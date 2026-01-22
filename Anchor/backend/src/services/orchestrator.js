const AnchorNode = require('../models/AnchorNode');
const Task = require('../models/Task');
const Cluster = require('../models/Cluster');

class Orchestrator {
    constructor() {
        this.activeWorkloads = new Map();
    }

    /**
     * Finds multiple nodes for parallel compute
     */
    async selectMultipleNodes(requirements, count) {
        const { minRam, gpuRequired, preferredRegion } = requirements;

        let query = { status: 'Online' };
        if (gpuRequired) query['specs.gpu'] = { $ne: 'None' };
        query['metrics.cpuUsage'] = { $lt: 85 };

        const candidates = await AnchorNode.find(query);

        // Simple heuristic scoring
        const scored = candidates.map(node => {
            let score = 0;
            if (preferredRegion && node.region === preferredRegion) score += 50;
            score += (100 - node.metrics.cpuUsage);
            score -= (node.activeTasks?.length || 0) * 15;
            return { node, score };
        }).sort((a, b) => b.score - a.score);

        return scored.slice(0, count).map(s => s.node);
    }

    /**
     * Splits a task into parallel chunks and dispatches to multiple nodes
     */
    async dispatchParallelTask(task, io) {
        if (!task.requirements.parallelNodes || task.requirements.parallelNodes <= 1) {
            return this.dispatchTask(task, io);
        }

        const nodeCount = task.requirements.parallelNodes;
        const nodes = await this.selectMultipleNodes(task.requirements, nodeCount);

        if (nodes.length === 0) return false;

        console.log(`[ORCHESTRATOR] Splitting Task ${task._id} into ${nodes.length} parallel streams...`);

        task.subTasks = nodes.map((node, index) => ({
            nodeId: node.nodeId,
            chunkIndex: index,
            data: { ...task.payload, chunk: index, totalChunks: nodes.length },
            status: 'Processing'
        }));

        task.status = 'Processing';
        await task.save();

        // Dispatch each chunk to its respective node
        for (const subTask of task.subTasks) {
            io.to(`node_${subTask.nodeId}`).emit('new_task', {
                taskId: task._id,
                subTaskId: subTask._id,
                type: task.type,
                payload: subTask.data,
                isSubTask: true
            });

            // Update node status
            await AnchorNode.findOneAndUpdate(
                { nodeId: subTask.nodeId },
                { $push: { activeTasks: task._id }, status: 'Busy' }
            );
        }

        return true;
    }

    /**
     * Intelligently selects a node based on specs, latency, and current load
     */
    async selectOptimalNode(requirements) {
        const nodes = await this.selectMultipleNodes(requirements, 1);
        return nodes[0] || null;
    }

    /**
     * Dispatches a task to a specific node and informs the agent via WebSocket
     */
    async dispatchTask(task, io) {
        if (!task || !task.nodeId) return false;

        const node = await AnchorNode.findOne({ nodeId: task.nodeId });
        if (!node) return false;

        console.log(`[ORCHESTRATOR] Dispatching task ${task._id} to node ${task.nodeId}...`);

        // Update node status
        node.activeTasks.push(task._id);
        if (node.activeTasks.length > 2) node.status = 'Busy';
        await node.save();

        // Emit to the specific node's socket room
        if (io) {
            io.to(`node_${task.nodeId}`).emit('new_task', {
                taskId: task._id,
                type: task.type,
                payload: task.payload,
                encryption: 'AES-256-GCM'
            });
        }

        return true;
    }

    /**
     * Handles the actual "sharing" logic - provisioning a cluster onto a node
     */
    async deployToNode(clusterId, nodeId, io) {
        const cluster = await Cluster.findById(clusterId);
        const node = await AnchorNode.findOne({ nodeId });

        if (!cluster || !node) throw new Error('Invalid Cluster or Node');

        console.log(`[ORCHESTRATOR] Provisioning cluster ${clusterId} on node ${nodeId}...`);

        // Real-time instruction to the agent
        if (io) {
            io.to(`node_${nodeId}`).emit('provision_cluster', {
                clusterId,
                name: cluster.name,
                type: cluster.type,
                config: {
                    port: 8080,
                    ssl: true
                }
            });
        }

        return true;
    }
}

module.exports = new Orchestrator();
