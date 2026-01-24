const scheduler = require('./scheduler');
const storage = require('./distributedStorage');

/**
 * ML TRAINING ORCHESTRATOR
 * 
 * Handles:
 * - Distributed training across multiple GPUs
 * - Data parallelism and model parallelism
 * - Checkpointing and resuming
 * - Hyperparameter tuning
 * - Model versioning
 */
class MLOrchestrator {
    constructor() {
        this.trainingJobs = new Map();
    }

    /**
     * Start distributed ML training job
     */
    async startTraining(spec) {
        const jobId = `ml-${Date.now()}`;

        const job = {
            id: jobId,
            name: spec.name,
            framework: spec.framework, // pytorch, tensorflow, jax
            model: spec.model,
            dataset: spec.dataset,
            hyperparameters: spec.hyperparameters || {},
            distributed: spec.distributed || false,
            gpuCount: spec.gpuCount || 1,
            status: 'initializing',
            createdAt: new Date(),
            checkpoints: [],
            metrics: []
        };

        this.trainingJobs.set(jobId, job);

        // Create persistent volume for model checkpoints
        const volume = await storage.createVolume({
            name: `${jobId}-checkpoints`,
            size: spec.checkpointSize || 100, // GB
            type: 'ssd'
        });

        job.volumeId = volume.id;

        if (job.distributed) {
            // Multi-GPU distributed training
            await this._startDistributedTraining(job);
        } else {
            // Single-GPU training
            await this._startSingleGPUTraining(job);
        }

        return job;
    }

    /**
     * Single-GPU training
     */
    async _startSingleGPUTraining(job) {
        // Schedule pod with GPU requirement
        const pod = await scheduler.schedulePod({
            name: `${job.id}-worker`,
            namespace: 'ml-training',
            priority: 10, // High priority
            resources: {
                gpu: 1,
                cpu: '4000m', // 4 CPUs
                memory: '16Gi'
            },
            affinity: {
                nodeAffinity: {
                    required: {
                        'gpu.type': 'nvidia' // Require NVIDIA GPU
                    }
                }
            },
            spec: {
                containers: [{
                    name: 'trainer',
                    image: `anchor/ml-${job.framework}:latest`,
                    command: this._generateTrainingCommand(job),
                    env: {
                        JOB_ID: job.id,
                        MODEL: job.model,
                        DATASET: job.dataset,
                        ...job.hyperparameters
                    },
                    resources: {
                        requests: {
                            gpu: 1,
                            cpu: '4000m',
                            memory: '16Gi'
                        },
                        limits: {
                            gpu: 1,
                            cpu: '8000m',
                            memory: '32Gi'
                        }
                    }
                }],
                volumes: [{
                    name: 'checkpoints',
                    type: 'persistentVolumeClaim',
                    source: job.volumeId
                }],
                restartPolicy: 'OnFailure'
            }
        });

        job.pods = [pod._id];
        job.status = 'running';

        console.log(`[ML] Started single-GPU training job ${job.id}`);
    }

    /**
     * Distributed multi-GPU training
     */
    async _startDistributedTraining(job) {
        const pods = [];

        // Create master pod
        const masterPod = await scheduler.schedulePod({
            name: `${job.id}-master`,
            namespace: 'ml-training',
            priority: 10,
            resources: {
                gpu: 1,
                cpu: '4000m',
                memory: '16Gi'
            },
            spec: {
                containers: [{
                    name: 'master',
                    image: `anchor/ml-${job.framework}:latest`,
                    command: this._generateDistributedMasterCommand(job),
                    env: {
                        JOB_ID: job.id,
                        ROLE: 'master',
                        WORLD_SIZE: job.gpuCount.toString(),
                        ...job.hyperparameters
                    }
                }],
                volumes: [{
                    name: 'checkpoints',
                    type: 'persistentVolumeClaim',
                    source: job.volumeId
                }]
            }
        });

        pods.push(masterPod._id);

        // Create worker pods
        for (let i = 1; i < job.gpuCount; i++) {
            const workerPod = await scheduler.schedulePod({
                name: `${job.id}-worker-${i}`,
                namespace: 'ml-training',
                priority: 10,
                resources: {
                    gpu: 1,
                    cpu: '4000m',
                    memory: '16Gi'
                },
                spec: {
                    containers: [{
                        name: 'worker',
                        image: `anchor/ml-${job.framework}:latest`,
                        command: this._generateDistributedWorkerCommand(job, i),
                        env: {
                            JOB_ID: job.id,
                            ROLE: 'worker',
                            RANK: i.toString(),
                            WORLD_SIZE: job.gpuCount.toString(),
                            MASTER_ADDR: `${job.id}-master`,
                            MASTER_PORT: '29500',
                            ...job.hyperparameters
                        }
                    }],
                    volumes: [{
                        name: 'checkpoints',
                        type: 'persistentVolumeClaim',
                        source: job.volumeId
                    }]
                }
            });

            pods.push(workerPod._id);
        }

        job.pods = pods;
        job.status = 'running';

        console.log(`[ML] Started distributed training job ${job.id} with ${job.gpuCount} GPUs`);
    }

    /**
     * Generate training command based on framework
     */
    _generateTrainingCommand(job) {
        switch (job.framework) {
            case 'pytorch':
                return [
                    'python', '-u', 'train.py',
                    '--model', job.model,
                    '--dataset', job.dataset,
                    '--checkpoint-dir', '/checkpoints',
                    ...this._hyperparamsToArgs(job.hyperparameters)
                ];

            case 'tensorflow':
                return [
                    'python', '-u', 'train.py',
                    '--model', job.model,
                    '--dataset', job.dataset,
                    '--checkpoint-dir', '/checkpoints',
                    ...this._hyperparamsToArgs(job.hyperparameters)
                ];

            default:
                return ['echo', 'Unknown framework'];
        }
    }

    /**
     * Generate distributed master command
     */
    _generateDistributedMasterCommand(job) {
        switch (job.framework) {
            case 'pytorch':
                return [
                    'python', '-u', '-m', 'torch.distributed.launch',
                    '--nproc_per_node=1',
                    '--nnodes', job.gpuCount.toString(),
                    '--node_rank=0',
                    '--master_addr=0.0.0.0',
                    '--master_port=29500',
                    'train.py',
                    '--model', job.model,
                    '--dataset', job.dataset,
                    '--checkpoint-dir', '/checkpoints',
                    ...this._hyperparamsToArgs(job.hyperparameters)
                ];

            default:
                return ['echo', 'Unknown framework'];
        }
    }

    /**
     * Generate distributed worker command
     */
    _generateDistributedWorkerCommand(job, rank) {
        switch (job.framework) {
            case 'pytorch':
                return [
                    'python', '-u', '-m', 'torch.distributed.launch',
                    '--nproc_per_node=1',
                    '--nnodes', job.gpuCount.toString(),
                    `--node_rank=${rank}`,
                    '--master_addr=${MASTER_ADDR}',
                    '--master_port=29500',
                    'train.py',
                    '--model', job.model,
                    '--dataset', job.dataset,
                    '--checkpoint-dir', '/checkpoints',
                    ...this._hyperparamsToArgs(job.hyperparameters)
                ];

            default:
                return ['echo', 'Unknown framework'];
        }
    }

    /**
     * Convert hyperparameters object to CLI args
     */
    _hyperparamsToArgs(hyperparams) {
        const args = [];
        for (const [key, value] of Object.entries(hyperparams)) {
            args.push(`--${key}`, value.toString());
        }
        return args;
    }

    /**
     * Save checkpoint
     */
    async saveCheckpoint(jobId, epoch, metrics) {
        const job = this.trainingJobs.get(jobId);
        if (!job) return;

        const checkpoint = {
            epoch,
            metrics,
            timestamp: new Date()
        };

        job.checkpoints.push(checkpoint);
        job.metrics.push(metrics);

        console.log(`[ML] Checkpoint saved for ${jobId} at epoch ${epoch}`);
    }

    /**
     * Stop training job
     */
    async stopTraining(jobId) {
        const job = this.trainingJobs.get(jobId);
        if (!job) return;

        // Delete all pods
        for (const podId of job.pods) {
            await scheduler.deletePod(podId);
        }

        job.status = 'stopped';
        job.stoppedAt = new Date();

        console.log(`[ML] Training job ${jobId} stopped`);
    }

    /**
     * Get training job status
     */
    getJobStatus(jobId) {
        return this.trainingJobs.get(jobId);
    }

    /**
     * List all training jobs
     */
    listJobs() {
        return Array.from(this.trainingJobs.values());
    }
}

module.exports = new MLOrchestrator();
