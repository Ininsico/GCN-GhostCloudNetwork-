const AnchorNode = require('../models/AnchorNode');
const Task = require('../models/Task');
const Cluster = require('../models/Cluster');

class Orchestrator {
    constructor() {
        this.activeWorkloads = new Map();
    }

    /**
     * Finds multiple nodes for parallel compute based on REAL SILICON capacity
     */
    async selectMultipleNodes(requirements, count) {
        const { minRam, gpuRequired, preferredRegion } = requirements;

        // Only target Active Nodes with substantial Free Memory
        const candidates = await AnchorNode.find({
            status: 'Online',
            'metrics.ramUsage': { $lt: 80 } // Targeted nodes must have >20% RAM available
        });

        // Smart Scoring: Sort by most powerful / least busy
        const scored = candidates.map(node => {
            let score = 0;
            if (preferredRegion && node.region === preferredRegion) score += 50;

            const freeRamFactor = 100 - (node.metrics?.ramUsage || 0);
            const idleCpuFactor = 100 - (node.metrics?.cpuUsage || 0);

            score += freeRamFactor * 2; // RAM is the primary resource for hosting/clusters
            score += idleCpuFactor;

            if (node.specs?.gpu && node.specs.gpu !== 'None') score += 500;
            score -= (node.activeTasks?.length || 0) * 20;

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

        if (nodes.length <= 1) {
            // Revert to single node if pool is empty
            const best = nodes[0] || (await this.selectOptimalNode(task.requirements));
            if (!best) return false;
            task.nodeId = best.nodeId;
            return this.dispatchTask(task, io);
        }

        console.log(`[ORCHESTRATOR] Initializing Distributed Map-Reduce for Task ${task._id}...`);

        // REAL LOGIC: Slicing the workload based on payload instructions
        const totalWork = task.payload.total_range || 1000000;
        const chunkSize = Math.floor(totalWork / nodes.length);

        task.subTasks = nodes.map((node, index) => {
            const start = index * chunkSize;
            const end = index === nodes.length - 1 ? totalWork : (index + 1) * chunkSize;

            return {
                nodeId: node.nodeId,
                chunkIndex: index,
                data: {
                    ...task.payload,
                    range_start: start,
                    range_end: end,
                    instruction: `FIND_PRIMES_IN_RANGE`,
                    worker_id: `WORKER_${index}_${node.nodeId.substring(0, 4)}`
                },
                status: 'Processing'
            };
        });

        task.status = 'Processing';
        await task.save();

        // Dispatch chunks to individual hardware agents via Socket.io
        for (const subTask of task.subTasks) {
            console.log(`[DISPATCH] Sent Chunk ${subTask.chunkIndex} to Agent ${subTask.nodeId} [Range: ${subTask.data.range_start}-${subTask.data.range_end}]`);

            io.to(`node_${subTask.nodeId}`).emit('new_task', {
                taskId: task._id,
                subTaskId: subTask._id,
                type: task.type,
                payload: subTask.data,
                isSubTask: true,
                security_token: require('crypto').randomBytes(16).toString('hex')
            });

            // Lock node by tracking its active contribution
            await AnchorNode.findOneAndUpdate(
                { nodeId: subTask.nodeId },
                { $push: { activeTasks: task._id }, status: 'Busy' }
            );
        }

        return true;
    }

    /**
     * SCRIPT DEPLOYMENT ENGINE (REX):
     * Deploys custom code + dependencies to a remote hardware node.
     */
    async deployCustomScript(taskId, nodeId, io) {
        const task = await Task.findById(taskId);
        const node = await AnchorNode.findOne({ nodeId });

        if (!task || !node) throw new Error('Task or Node not found');

        console.log(`[REX_ENGINE] Preparing Script Deployment: ${task.name} -> Node ${nodeId}`);

        // Extract script and deps from the task payload
        const { sourceCode, dependencies, environmentVariables } = task.payload;

        // Command the remote Agent to initialize the environment
        if (io) {
            io.to(`node_${nodeId}`).emit('script_deploy', {
                taskId: task._id,
                name: task.name,
                sourceCode,
                dependencies: dependencies || [],
                env: environmentVariables || {},
                timeout: 300000 // 5 minute max execution
            });
        }

        task.status = 'Processing';
        await task.save();

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
     * PROVISIONING REAL POWER: Docker Container & Ingress Routing
     * Seizes resources and maps a public endpoint to the remote hardware.
     */
    async deployWorkerContainer(clusterId, nodeId, io) {
        const cluster = await Cluster.findById(clusterId);
        const node = await AnchorNode.findOne({ nodeId });

        if (!node || node.status !== 'Online') throw new Error('Target Hardware Offline');

        console.log(`[REX_ENGINE] Seizing hardware on ${nodeId} for Cluster ${clusterId}`);

        // Define the Ghost Ingress (The tunnel endpoint)
        const ingressUrl = `${cluster.name.toLowerCase().replace(/ /g, '-')}.ghost-net.app`;

        // Emit the command to the Physical Agent
        if (io) {
            io.to(`node_${nodeId}`).emit('ghost_provision', {
                operation: 'SPAWN_CONTAINER',
                image: cluster.type === 'Gaming' ? 'ghcr.io/anchor/gameserver:v1' : 'ghcr.io/anchor/web-node:v2',
                config: {
                    ram_limit: '4096MB', // Physical RAM Lock
                    cpu_cores: 2,        // Core Affinity
                    ingress_port: 8080,   // Internal Service Port
                    public_url: ingressUrl // Where the tunnel leads
                }
            });
        }

        // Update Cluster with its new hardware location
        cluster.nodeId = nodeId;
        cluster.status = 'Provisioning';
        cluster.endpoint = ingressUrl;
        await cluster.save();

        return { success: true, endpoint: ingressUrl };
    }
}

module.exports = new Orchestrator();
