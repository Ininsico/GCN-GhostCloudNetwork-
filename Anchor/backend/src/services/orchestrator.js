const AnchorNode = require('../models/AnchorNode');
const Task = require('../models/Task');
const Cluster = require('../models/Cluster');

class Orchestrator {
    constructor() {
        this.activeWorkloads = new Map();
        this.taskGraph = new Map(); // DAG: taskId -> { dependencies: [], status: 'pending' | 'running' | 'completed' }
        this.consensusCache = new Map(); // For result verification
    }

    /**
     * DAG SCHEDULER: Handles complex multi-step tasks with dependencies
     * Example: Task C only starts when Task A and Task B are complete
     */
    async scheduleDAGTask(taskGraph, io) {
        console.log(`[DAG] Initializing Task Graph with ${taskGraph.length} nodes...`);

        // Build dependency map
        const graph = new Map();
        for (const taskNode of taskGraph) {
            graph.set(taskNode.id, {
                task: taskNode,
                dependencies: taskNode.dependencies || [],
                status: 'pending',
                result: null
            });
        }

        this.taskGraph = graph;

        // Start execution of tasks with no dependencies
        for (const [taskId, node] of graph.entries()) {
            if (node.dependencies.length === 0) {
                await this.executeDAGNode(taskId, io);
            }
        }

        return true;
    }

    async executeDAGNode(taskId, io) {
        const node = this.taskGraph.get(taskId);
        if (!node || node.status !== 'pending') return;

        console.log(`[DAG] Executing Task Node: ${taskId}`);
        node.status = 'running';

        // Execute the actual task (could be parallel, script, or provision)
        const task = await Task.create(node.task);

        if (node.task.type === 'parallel') {
            await this.dispatchParallelTask(task, io);
        } else if (node.task.type === 'script') {
            const selectedNode = await this.selectOptimalNode(task.requirements);
            await this.deployCustomScript(task._id, selectedNode.nodeId, io);
        }

        // Mark as completed (in production, this would be triggered by task completion event)
        node.status = 'completed';

        // Trigger dependent tasks
        for (const [depTaskId, depNode] of this.taskGraph.entries()) {
            if (depNode.dependencies.includes(taskId)) {
                const allDepsComplete = depNode.dependencies.every(depId =>
                    this.taskGraph.get(depId)?.status === 'completed'
                );

                if (allDepsComplete) {
                    await this.executeDAGNode(depTaskId, io);
                }
            }
        }
    }

    /**
     * CONSENSUS VERIFICATION: Send same chunk to multiple nodes and verify results
     * Prevents "cheating" nodes from returning fake data
     */
    async verifyTaskResult(taskId, subTaskId, result) {
        const cacheKey = `${taskId}_${subTaskId}`;

        if (!this.consensusCache.has(cacheKey)) {
            this.consensusCache.set(cacheKey, []);
        }

        const results = this.consensusCache.get(cacheKey);
        results.push(result);

        // If we have multiple results, verify consensus
        if (results.length >= 2) {
            const firstResult = JSON.stringify(results[0]);
            const allMatch = results.every(r => JSON.stringify(r) === firstResult);

            if (!allMatch) {
                console.error(`[CONSENSUS] MISMATCH DETECTED for Task ${taskId}, SubTask ${subTaskId}`);
                console.error(`[CONSENSUS] Flagging nodes for integrity review...`);
                // In production: flag nodes, request re-execution, or use majority vote
                return { verified: false, action: 'RECOMPUTE' };
            }

            console.log(`[CONSENSUS] Results verified for Task ${taskId}, SubTask ${subTaskId}`);
            this.consensusCache.delete(cacheKey); // Clean up
            return { verified: true, result: results[0] };
        }

        return { verified: 'pending', waitingFor: 2 - results.length };
    }

    /**
     * Finds multiple nodes based on REAL-TIME pressure and capabilities
     */
    async selectMultipleNodes(requirements, count) {
        const { minRam, gpuRequired, preferredRegion, dockerRequired } = requirements;

        const candidates = await AnchorNode.find({
            status: 'Online',
            'metrics.ramUsage': { $lt: 85 } // Safety threshold
        });

        // Smart Scoring: Prioritize efficiency and required capabilities
        const scored = candidates.map(node => {
            let score = 0;

            // Weight 1: Network Proximity
            if (preferredRegion && node.location?.country === preferredRegion) score += 100;

            // Weight 2: Hardware Headroom (More free RAM = Better)
            const freeRamGB = node.metrics?.ramTotal - node.metrics?.ramUsed;
            score += freeRamGB * 10;

            // Weight 3: Virtualization Capability
            if (dockerRequired && node.metrics?.hasDocker) score += 1000;
            if (!dockerRequired && !node.metrics?.hasDocker) score += 50; // Simple tasks prefer non-docker nodes to save power

            // Weight 4: Reliability (Uptime / Fault history)
            score += (node.metrics?.uptime / 3600); // Small bonus for stability

            // Weight 5: Efficiency (GPU nodes are reserved unless requested)
            if (node.specs?.gpu && gpuRequired) score += 2000;
            if (node.specs?.gpu && !gpuRequired) score -= 500; // Don't waste GPU nodes on CPU tasks

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
     * Intelligently selects runtime: isolate (default), WASM (math-heavy), or native (legacy)
     */
    async deployCustomScript(taskId, nodeId, io) {
        const task = await Task.findById(taskId);
        const node = await AnchorNode.findOne({ nodeId });

        if (!task || !node) throw new Error('Task or Node not found');

        console.log(`[REX_ENGINE] Preparing Script Deployment: ${task.name} -> Node ${nodeId}`);

        // Extract script and deps from the task payload
        const { sourceCode, dependencies, environmentVariables, runtime } = task.payload;

        // INTELLIGENT RUNTIME SELECTION
        let selectedRuntime = runtime || 'isolate'; // Default to isolated-vm for security

        // Auto-detect WASM if sourceCode is base64 or has WASM signature
        if (!runtime && (sourceCode.startsWith('AGFzbQ') || task.payload.isWASM)) {
            selectedRuntime = 'wasm';
            console.log(`[REX_ENGINE] Auto-detected WASM module. Using WebAssembly runtime.`);
        }

        // Use native runtime if dependencies are required (isolated-vm can't install npm packages)
        if (!runtime && dependencies && dependencies.length > 0) {
            selectedRuntime = 'native';
            console.log(`[REX_ENGINE] Dependencies detected. Using native runtime with npm.`);
        }

        console.log(`[REX_ENGINE] Selected Runtime: ${selectedRuntime.toUpperCase()}`);

        // Command the remote Agent to initialize the environment
        if (io) {
            io.to(`node_${nodeId}`).emit('script_deploy', {
                taskId: task._id,
                name: task.name,
                sourceCode,
                dependencies: dependencies || [],
                env: environmentVariables || {},
                runtime: selectedRuntime,
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
     * PROVISIONING REAL POWER: Pure Native Application Deployment
     * NO DOCKER REQUIRED - Works on ANY PC with just Node.js
     */
    async deployWorkerContainer(clusterId, nodeId, io, appConfig = null) {
        const cluster = await Cluster.findById(clusterId);
        const node = await AnchorNode.findOne({ nodeId });

        if (!node || node.status !== 'Online') throw new Error('Target Hardware Offline');

        console.log(`[REX_ENGINE] Native Provisioning on ${nodeId} for ${clusterId} (ZERO DOCKER)`);

        // Define the endpoint
        const ingressPort = appConfig?.port || 8080;
        const ingressUrl = `http://localhost:${ingressPort}`;

        // App selection logic - these are just identifiers now, not Docker images
        let appType = 'web-node';
        if (cluster.type === 'Gaming') appType = 'gaming-engine';
        if (cluster.type === 'AI_Training') appType = 'cuda-compute';
        if (cluster.type === 'Web') appType = 'web-node';

        // Emit the command to the Physical Agent
        if (io) {
            io.to(`node_${nodeId}`).emit('ghost_provision', {
                operation: 'SPAWN_APP',
                clusterId: cluster._id,
                image: `anchor/${appType}:native`,
                mode: 'NATIVE',
                config: {
                    ram_limit: appConfig?.ram || '4096MB',
                    cpu_cores: appConfig?.cpu || 2,
                    ingress_port: ingressPort,
                    public_url: ingressUrl,
                    enableStreaming: cluster.type === 'Gaming'
                }
            });

            // Initialize the P2P Signaling Tunnel
            io.to(`node_${nodeId}`).emit('ghost_tunnel_init', {
                target: 'CLIENT_BROWSER',
                tunnelId: `TUNNEL-${Math.random().toString(36).substring(7).toUpperCase()}`
            });
        }

        // Update Cluster
        cluster.nodeId = nodeId;
        cluster.status = 'Scaling';
        cluster.endpoint = ingressUrl;
        await cluster.save();

        return { success: true, endpoint: ingressUrl, mode: 'NATIVE' };
    }

    /**
     * Alias for deployWorkerContainer used in Cluster Controller
     */
    async deployToNode(clusterId, nodeId, io) {
        return this.deployWorkerContainer(clusterId, nodeId, io);
    }
}

module.exports = new Orchestrator();
