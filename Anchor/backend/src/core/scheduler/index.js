const { Queue, Worker, QueueEvents } = require('bullmq');
const Redis = require('ioredis');
const SchedulerEngine = require('./SchedulerEngine');
const Pod = require('../../models/Pod');

/**
 * PRODUCTION SCHEDULER CONTROLLER
 * 
 * The public interface for the scheduling system.
 * Manages the distributed work queue (BullMQ) and delegates logic to the Engine.
 */
class SchedulerController {
    constructor() {
        this.io = null; // Will be set via init()
        this.connection = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
            maxRetriesPerRequest: null
        });

        // The Queue
        this.queue = new Queue('pod-scheduling-queue', { connection: this.connection });

        // The Worker (Multi-Process Scalable)
        this.worker = new Worker('pod-scheduling-queue', async (job) => {
            return await this._processJob(job);
        }, {
            connection: this.connection,
            concurrency: 10, // High concurrency
            lockDuration: 60000
        });

        this.queueEvents = new QueueEvents('pod-scheduling-queue', { connection: this.connection });

        // Error Handling
        this.worker.on('failed', (job, err) => {
            console.error(`[Scheduler] Job ${job.id} failed: ${err.message}`);
        });

        console.log('[Scheduler] Controller Online - Distributed Mode');
    }

    /**
     * Initialize with Socket.io instance
     */
    init(ioInstance) {
        this.io = ioInstance;
        console.log('[Scheduler] Socket.io connected');
    }

    /**
     * Submit a pod for scheduling
     */
    async schedulePod(podSpec) {
        // Idempotency: Create Pod record first
        const pod = await Pod.create({
            name: podSpec.name,
            namespace: podSpec.namespace || 'default',
            spec: podSpec,
            status: 'Pending',
            phase: 'Scheduling',
            createdAt: new Date()
        });

        // Add to distributed queue
        await this.queue.add('schedule-pod', {
            podId: pod._id.toString(),
            spec: podSpec
        }, {
            priority: podSpec.priority || 1,
            attempts: 5,
            backoff: { type: 'exponential', delay: 1000 }
        });

        return pod;
    }

    /**
     * Worker Logic
     */
    async _processJob(job) {
        const { podId, spec } = job.data;

        try {
            const result = await SchedulerEngine.scheduleOne(podId, spec);

            // Post-Binding: Notify Agent via Socket.io
            if (this.io && result.nodeId) {
                this.io.to(`node_${result.nodeId}`).emit('pod_start', {
                    podId: podId,
                    spec: spec,
                    namespace: spec.namespace || 'default'
                });
                console.log(`[Scheduler] Sent pod_start to node_${result.nodeId}`);
            }

            return result;

        } catch (err) {
            // Update Pod Status to show error
            await Pod.findByIdAndUpdate(podId, {
                statusReason: err.message,
                status: 'Pending' // Keep pending for retry
            });
            throw err; // Trigger BullMQ retry
        }
    }

    // Health Check Proxy
    async healthCheck() {
        // TODO: Implement cleaner/reconciler logic here
    }
}

module.exports = new SchedulerController();
