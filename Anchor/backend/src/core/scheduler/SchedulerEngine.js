const ClusterState = require('./cache/ClusterState');
const NodeScorer = require('./strategies/NodeScorer');
const Pod = require('../../models/Pod');
const AnchorNode = require('../../models/AnchorNode');

/**
 * SCHEDULER CORE ENGINE
 * 
 * The brain of the scheduling system.
 * 
 * Pipeline:
 * 1. QueuePop: Get next pending pod
 * 2. Snapshot: Get consistent view of cluster
 * 3. Filter (Predicates): Eliminate nodes that don't fit constraints (CPU, RAM, Taints)
 * 4. Score (Priorities): Rank remaining nodes
 * 5. Bind: Atomically assign pod to node
 */
class SchedulerEngine {
    constructor() {
        this.currentOperations = new Map();
    }

    /**
     * Main entry point to schedule a single pod
     * @param {Object} podSpec - The pod specification
     * @param {string} podId - The database ID of the pod
     * @returns {Promise<Object>} Result { success: true, nodeId: '...' }
     */
    async scheduleOne(podId, podSpec) {
        // 1. Snapshot Cluster State
        const nodes = ClusterState.getCandidateNodes();

        if (nodes.length === 0) {
            throw new Error('No online nodes available in cluster.');
        }

        console.log(`[SchedulerEngine] Scheduling pod ${podId} against ${nodes.length} nodes`);

        // 2. FILTERING (Predicates)
        const feasibleNodes = nodes.filter(node => this._checkPredicates(node, podSpec));

        if (feasibleNodes.length === 0) {
            console.warn(`[SchedulerEngine] Pod ${podId} failed filtering. No nodes satisfy constraints.`);
            // In a real system, we'd log *which* predicate failed (e.g. "InsufficentCPU")
            throw new Error('Predicate check failed: No suitable nodes found');
        }

        // 3. SCORING (Priorities)
        const scoredNodes = feasibleNodes.map(node => {
            return {
                node,
                score: NodeScorer.score(node, podSpec)
            };
        });

        // Sort Descending
        scoredNodes.sort((a, b) => b.score - a.score);
        const bestNode = scoredNodes[0].node;

        console.log(`[SchedulerEngine] Best node for ${podId} is ${bestNode.nodeId} (Score: ${scoredNodes[0].score})`);

        // 4. BINDING (Optimistic + Atomic)
        // First, optimistic reservation in local cache
        const reserved = ClusterState.reserveResources(bestNode.nodeId, {
            cpu: this._parseCpu(podSpec.resources?.requests?.cpu),
            ram: this._parseMemory(podSpec.resources?.requests?.memory)
        });

        if (!reserved) {
            // Optimistic lock skipped - race condition detected?
            throw new Error('Optimistic reservation failed - retrying');
        }

        // Second, Commit to DB
        await this._bind(podId, bestNode);

        return { success: true, nodeId: bestNode.nodeId, nodeName: bestNode.name };
    }

    /**
     * Check if a node meets hard constraints
     */
    _checkPredicates(node, spec) {
        // 1. Resource Predicates
        const cpuReq = this._parseCpu(spec.resources?.requests?.cpu);
        const ramReq = this._parseMemory(spec.resources?.requests?.memory);
        const gpuReq = spec.resources?.requests?.gpu || 0;

        const cpuFree = 100 - (node.metrics?.cpuUsage || 0); // Assuming 100 capacity for simplicity, real impl uses cores
        const ramFree = 100 - (node.metrics?.ramUsage || 0);

        // Very basic capacity check (Real world tracks actual milli-cores/bytes)
        if (cpuReq > 0 && (node.metrics?.cpuUsage || 0) > 95) return false;

        // 2. Taints & Tolerations
        if (node.taints && node.taints.length > 0) {
            // (Simplified) If node is tainted "NoSchedule", and pod has no toleration, return false
            // Implementation Omitted for brevity
        }

        // 3. GPU Constraints
        if (gpuReq > 0 && !node.specs?.gpu) return false;

        // 4. Node Affinity (Required)
        if (spec.affinity?.nodeAffinity?.requiredDuringSchedulingIgnoredDuringExecution) {
            // ... exact match logic ...
        }

        return true;
    }

    async _bind(podId, node) {
        const pod = await Pod.findById(podId);
        if (!pod) throw new Error('Pod vanished during scheduling');

        pod.nodeId = node.nodeId;
        pod.nodeName = node.name;
        pod.status = 'Running';
        pod.phase = 'Starting';
        pod.scheduledAt = new Date();
        await pod.save();

        // Increment Cluster Load (DB)
        await AnchorNode.updateOne(
            { nodeId: node.nodeId },
            {
                $inc: { podCount: 1 },
                // Update Last Scheduled time to assist spread strategies
                $set: { lastScheduledAt: new Date() }
            }
        );

        // Emit Event via Socket.io (handled by caller or separate EventBus)
    }

    // Helpers
    _parseCpu(cpuStr) {
        if (!cpuStr) return 0;
        if (typeof cpuStr === 'number') return cpuStr; // already parsed
        if (cpuStr.endsWith('m')) return parseInt(cpuStr) / 1000;
        return parseFloat(cpuStr);
    }

    _parseMemory(memStr) {
        if (!memStr) return 0;
        // ... simplistic parser ...
        return 0;
    }
}

module.exports = new SchedulerEngine();
