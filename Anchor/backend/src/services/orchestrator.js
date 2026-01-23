const Queue = require('bull');
const Redis = require('ioredis');
const AnchorNode = require('../models/AnchorNode');
const Task = require('../models/Task');
const Cluster = require('../models/Cluster');

/**
 * PRODUCTION ORCHESTRATOR
 * Uses Redis-backed Bull queues for persistent, distributed task management
 * NO MORE IN-MEMORY MAPS THAT CRASH ON RESTART
 */
class ProductionOrchestrator {
    constructor() {
        // Redis connection for Bull
        const redisConfig = {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            retryStrategy: (times) => Math.min(times * 50, 2000)
        };

        // Create persistent job queues
        this.taskQueue = new Queue('anchor-tasks', { redis: redisConfig });
        this.dagQueue = new Queue('anchor-dag', { redis: redisConfig });
        this.consensusQueue = new Queue('anchor-consensus', { redis: redisConfig });

        // Redis client for state management
        this.redis = new Redis(redisConfig);

        // Socket.io instance (set from index.js)
        this.io = null;

        this._initializeWorkers();
    }

    setIO(io) {
        this.io = io;
    }

    /**
     * Initialize queue processors
     */
    _initializeWorkers() {
        // Process regular tasks
        this.taskQueue.process(async (job) => {
            const { taskId, nodeId, type } = job.data;
            console.log(`[QUEUE] Processing task ${taskId} on node ${nodeId}`);

            const task = await Task.findById(taskId);
            if (!task) throw new Error('Task not found');

            if (type === 'script') {
                await this._executeScriptTask(task, nodeId);
            } else if (type === 'parallel') {
                await this._executeParallelTask(task);
            } else if (type === 'provision') {
                await this._executeProvisionTask(task, nodeId);
            }

            return { success: true, taskId };
        });

        // Process DAG tasks
        this.dagQueue.process(async (job) => {
            const { graphId, nodeId } = job.data;
            console.log(`[DAG_QUEUE] Processing DAG node ${nodeId} in graph ${graphId}`);

            await this._executeDAGNode(graphId, nodeId);
            return { success: true, graphId, nodeId };
        });

        // Process consensus verification
        this.consensusQueue.process(async (job) => {
            const { taskId, subTaskId, result } = job.data;
            console.log(`[CONSENSUS_QUEUE] Verifying result for ${taskId}/${subTaskId}`);

            const verification = await this._verifyConsensus(taskId, subTaskId, result);
            return verification;
        });

        // Error handlers
        this.taskQueue.on('failed', (job, err) => {
            console.error(`[QUEUE] Task ${job.id} failed:`, err.message);
        });

        this.dagQueue.on('failed', (job, err) => {
            console.error(`[DAG_QUEUE] Job ${job.id} failed:`, err.message);
        });

        console.log('[ORCHESTRATOR] Production queue workers initialized');
    }

    /**
     * Schedule a DAG task graph (persistent)
     */
    async scheduleDAGTask(taskGraph, io) {
        this.io = io;
        const graphId = `dag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        console.log(`[DAG] Scheduling graph ${graphId} with ${taskGraph.length} nodes`);

        // Store graph in Redis (persistent)
        const graphData = {
            id: graphId,
            nodes: {},
            createdAt: Date.now()
        };

        for (const node of taskGraph) {
            graphData.nodes[node.id] = {
                task: node,
                dependencies: node.dependencies || [],
                status: 'pending',
                result: null
            };
        }

        await this.redis.set(`dag:${graphId}`, JSON.stringify(graphData), 'EX', 86400); // 24h TTL

        // Queue tasks with no dependencies
        for (const node of taskGraph) {
            if (!node.dependencies || node.dependencies.length === 0) {
                await this.dagQueue.add({
                    graphId,
                    nodeId: node.id
                }, {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 2000 }
                });
            }
        }

        return { graphId, status: 'scheduled' };
    }

    /**
     * Execute a DAG node (persistent state)
     */
    async _executeDAGNode(graphId, nodeId) {
        const graphJson = await this.redis.get(`dag:${graphId}`);
        if (!graphJson) throw new Error('DAG graph not found');

        const graph = JSON.parse(graphJson);
        const node = graph.nodes[nodeId];

        if (!node || node.status !== 'pending') return;

        console.log(`[DAG] Executing node ${nodeId} in graph ${graphId}`);
        node.status = 'running';
        await this.redis.set(`dag:${graphId}`, JSON.stringify(graph), 'EX', 86400);

        // Create and execute task
        const task = await Task.create(node.task);

        if (node.task.type === 'parallel') {
            await this._executeParallelTask(task);
        } else if (node.task.type === 'script') {
            const selectedNode = await this.selectOptimalNode(task.requirements || {});
            if (selectedNode) {
                await this._executeScriptTask(task, selectedNode.nodeId);
            }
        }

        // Mark completed
        node.status = 'completed';
        node.result = { taskId: task._id };
        await this.redis.set(`dag:${graphId}`, JSON.stringify(graph), 'EX', 86400);

        // Trigger dependent nodes
        for (const [depNodeId, depNode] of Object.entries(graph.nodes)) {
            if (depNode.dependencies.includes(nodeId)) {
                const allDepsComplete = depNode.dependencies.every(
                    depId => graph.nodes[depId]?.status === 'completed'
                );

                if (allDepsComplete && depNode.status === 'pending') {
                    await this.dagQueue.add({
                        graphId,
                        nodeId: depNodeId
                    }, {
                        attempts: 3,
                        backoff: { type: 'exponential', delay: 2000 }
                    });
                }
            }
        }
    }

    /**
     * Verify task result using consensus (persistent)
     */
    async verifyTaskResult(taskId, subTaskId, result) {
        await this.consensusQueue.add({
            taskId,
            subTaskId,
            result
        }, {
            attempts: 1
        });

        return { status: 'queued_for_verification' };
    }

    async _verifyConsensus(taskId, subTaskId, result) {
        const cacheKey = `consensus:${taskId}:${subTaskId}`;

        // Get existing results from Redis
        const existingJson = await this.redis.get(cacheKey);
        const results = existingJson ? JSON.parse(existingJson) : [];

        results.push({
            result,
            timestamp: Date.now(),
            resultHash: require('crypto').createHash('sha256').update(JSON.stringify(result)).digest('hex')
        });

        await this.redis.set(cacheKey, JSON.stringify(results), 'EX', 3600); // 1h TTL

        // Verify if we have enough results
        if (results.length >= 2) {
            const firstHash = results[0].resultHash;
            const allMatch = results.every(r => r.resultHash === firstHash);

            if (!allMatch) {
                console.error(`[CONSENSUS] FRAUD DETECTED: Task ${taskId}, SubTask ${subTaskId}`);

                // Store fraud evidence
                await this.redis.set(
                    `fraud:${taskId}:${subTaskId}`,
                    JSON.stringify({ results, detected: Date.now() }),
                    'EX', 86400 * 7 // 7 days
                );

                return { verified: false, action: 'RECOMPUTE', evidence: results };
            }

            console.log(`[CONSENSUS] Verified: ${taskId}/${subTaskId}`);
            await this.redis.del(cacheKey);
            return { verified: true, result: results[0].result };
        }

        return { verified: 'pending', waitingFor: 2 - results.length };
    }

    /**
     * Execute parallel task (distributed map-reduce)
     */
    async _executeParallelTask(task) {
        const nodeCount = task.requirements?.parallelNodes || 2;
        const nodes = await this.selectMultipleNodes(task.requirements || {}, nodeCount);

        if (nodes.length === 0) {
            throw new Error('No nodes available');
        }

        console.log(`[PARALLEL] Distributing task ${task._id} across ${nodes.length} nodes`);

        const totalWork = task.payload.total_range || 1000000;
        const chunkSize = Math.floor(totalWork / nodes.length);

        const subTasks = nodes.map((node, index) => {
            const start = index * chunkSize;
            const end = index === nodes.length - 1 ? totalWork : (index + 1) * chunkSize;

            return {
                nodeId: node.nodeId,
                chunkIndex: index,
                payload: {
                    ...task.payload,
                    range_start: start,
                    range_end: end,
                    instruction: task.payload.instruction || 'FIND_PRIMES_IN_RANGE'
                }
            };
        });

        task.subTasks = subTasks;
        task.status = 'Processing';
        await task.save();

        // Emit to nodes via Socket.io
        for (const subTask of subTasks) {
            if (this.io) {
                this.io.to(`node_${subTask.nodeId}`).emit('new_task', {
                    taskId: task._id,
                    subTaskId: `${task._id}_chunk_${subTask.chunkIndex}`,
                    type: task.type,
                    payload: subTask.payload
                });
            }

            // Update node status
            await AnchorNode.findOneAndUpdate(
                { nodeId: subTask.nodeId },
                { $push: { activeTasks: task._id }, status: 'Busy' }
            );
        }

        return true;
    }

    /**
     * Execute script deployment
     */
    async _executeScriptTask(task, nodeId) {
        const node = await AnchorNode.findOne({ nodeId });
        if (!node) throw new Error('Node not found');

        console.log(`[SCRIPT] Deploying ${task.name} to node ${nodeId}`);

        const { sourceCode, dependencies, environmentVariables, runtime } = task.payload;

        // Auto-detect runtime
        let selectedRuntime = runtime || 'isolate';
        if (!runtime && (sourceCode.startsWith('AGFzbQ') || task.payload.isWASM)) {
            selectedRuntime = 'wasm';
        }
        if (!runtime && dependencies && dependencies.length > 0) {
            selectedRuntime = 'native';
        }

        if (this.io) {
            this.io.to(`node_${nodeId}`).emit('script_deploy', {
                taskId: task._id,
                name: task.name,
                sourceCode,
                dependencies: dependencies || [],
                env: environmentVariables || {},
                runtime: selectedRuntime,
                timeout: 300000
            });
        }

        task.status = 'Processing';
        task.nodeId = nodeId;
        await task.save();

        return true;
    }

    /**
     * Execute provision task (native app deployment)
     */
    async _executeProvisionTask(task, nodeId) {
        const node = await AnchorNode.findOne({ nodeId });
        if (!node) throw new Error('Node not found');

        console.log(`[PROVISION] Deploying app to node ${nodeId}`);

        const { appType, config } = task.payload;

        if (this.io) {
            this.io.to(`node_${nodeId}`).emit('ghost_provision', {
                operation: 'SPAWN_APP',
                image: `anchor/${appType}:native`,
                mode: 'NATIVE',
                config: config || {}
            });
        }

        task.status = 'Processing';
        task.nodeId = nodeId;
        await task.save();

        return true;
    }

    /**
     * Select optimal node(s) based on requirements
     */
    async selectMultipleNodes(requirements, count = 1) {
        const { minRam, gpuRequired, preferredRegion, dockerRequired } = requirements;

        const candidates = await AnchorNode.find({
            status: { $in: ['Online', 'Idle'] },
            'metrics.ramUsage': { $lt: 85 }
        });

        const scored = candidates.map(node => {
            let score = 0;

            if (preferredRegion && node.location?.country === preferredRegion) score += 100;

            const freeRamGB = (node.metrics?.ramTotal || 8) - (node.metrics?.ramUsed || 0);
            score += freeRamGB * 10;

            if (dockerRequired && node.metrics?.hasDocker) score += 1000;
            if (!dockerRequired && !node.metrics?.hasDocker) score += 50;

            score += (node.metrics?.uptime || 0) / 3600;

            if (node.specs?.gpu && gpuRequired) score += 2000;
            if (node.specs?.gpu && !gpuRequired) score -= 500;

            return { node, score };
        }).sort((a, b) => b.score - a.score);

        return scored.slice(0, count).map(s => s.node);
    }

    async selectOptimalNode(requirements) {
        const nodes = await this.selectMultipleNodes(requirements, 1);
        return nodes[0] || null;
    }

    /**
     * Deploy application to node (native, no Docker)
     */
    async deployWorkerContainer(clusterId, nodeId, io, appConfig = null) {
        this.io = io;

        const cluster = await Cluster.findById(clusterId);
        const node = await AnchorNode.findOne({ nodeId });

        if (!node || node.status === 'Offline') {
            throw new Error('Target node offline');
        }

        console.log(`[PROVISION] Native deployment on ${nodeId} for cluster ${clusterId}`);

        const ingressPort = appConfig?.port || 8080;
        const ingressUrl = `http://localhost:${ingressPort}`;

        let appType = 'web-node';
        if (cluster.type === 'Gaming') appType = 'gaming-engine';
        if (cluster.type === 'AI_Training') appType = 'cuda-compute';
        if (cluster.type === 'Web') appType = 'web-node';

        if (this.io) {
            this.io.to(`node_${nodeId}`).emit('ghost_provision', {
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
        }

        cluster.nodeId = nodeId;
        cluster.status = 'Scaling';
        cluster.endpoint = ingressUrl;
        await cluster.save();

        return { success: true, endpoint: ingressUrl, mode: 'NATIVE' };
    }

    async deployToNode(clusterId, nodeId, io) {
        return this.deployWorkerContainer(clusterId, nodeId, io);
    }

    /**
     * Get queue stats (for monitoring)
     */
    async getQueueStats() {
        const [taskCounts, dagCounts, consensusCounts] = await Promise.all([
            this.taskQueue.getJobCounts(),
            this.dagQueue.getJobCounts(),
            this.consensusQueue.getJobCounts()
        ]);

        return {
            tasks: taskCounts,
            dag: dagCounts,
            consensus: consensusCounts
        };
    }

    /**
     * Cleanup (graceful shutdown)
     */
    async shutdown() {
        console.log('[ORCHESTRATOR] Shutting down gracefully...');
        await this.taskQueue.close();
        await this.dagQueue.close();
        await this.consensusQueue.close();
        await this.redis.quit();
    }
}

module.exports = new ProductionOrchestrator();
