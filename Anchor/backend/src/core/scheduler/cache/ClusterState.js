const Redis = require('ioredis');
const EventEmitter = require('events');

/**
 * CLUSTER STATE CACHE (The "Informer")
 * 
 * In a distributed scheduler, querying the DB for every pod scheduling decision is too slow.
 * We maintain a local, eventually-consistent cache of critical node metrics.
 * 
 * Features:
 * - Subscribes to Redis Pub/Sub for real-time node updates
 * - Maintains efficient indexes (e.g. nodes by region, nodes by GPU type)
 * - Atomic snapshotting for scheduling cycles
 */
class ClusterState extends EventEmitter {
    constructor() {
        super();
        this.nodes = new Map(); // nodeId -> NodeSnapshot

        // Secondary Indexes for O(1) lookups
        this.nodesByRegion = new Map();
        this.nodesByGpu = new Map();

        this.redisComp = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
        });

        this.syncInterval = null;
        this._startSubscription();
    }

    async _startSubscription() {
        // Subscribe to real-time node updates
        const sub = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
        });

        await sub.subscribe('node:updates', 'node:lifecycle');

        sub.on('message', (channel, message) => {
            try {
                const update = JSON.parse(message);
                this._handleClusterUpdate(update);
            } catch (err) {
                console.error('[ClusterState] Failed to parse update:', err);
            }
        });

        // Initial hydrate
        await this._hydrate();
    }

    async _hydrate() {
        // Load initial state from DB (AnchorNodes)
        // In a real system, we'd stream this. For now, fetch all.
        const AnchorNode = require('../../../models/AnchorNode');
        const nodes = await AnchorNode.find({ status: { $ne: 'Offline' } }).lean();

        for (const node of nodes) {
            this.updateNode(node.nodeId, node);
        }

        console.log(`[ClusterState] Hydrated ${nodes.length} nodes into local cache`);
    }

    updateNode(nodeId, data) {
        const existing = this.nodes.get(nodeId);

        const snapshot = {
            ...existing,
            ...data,
            lastSeen: Date.now()
        };

        this.nodes.set(nodeId, snapshot);

        // Update Indexes
        if (snapshot.location?.region) {
            if (!this.nodesByRegion.has(snapshot.location.region)) {
                this.nodesByRegion.set(snapshot.location.region, new Set());
            }
            this.nodesByRegion.get(snapshot.location.region).add(nodeId);
        }

        if (snapshot.specs?.gpu) {
            const gpuKey = `${snapshot.specs.gpu.type}:${snapshot.specs.gpu.vram}`;
            if (!this.nodesByGpu.has(gpuKey)) {
                this.nodesByGpu.set(gpuKey, new Set());
            }
            this.nodesByGpu.get(gpuKey).add(nodeId);
        }
    }

    _handleClusterUpdate(update) {
        if (update.type === 'NODE_METRICS') {
            this.updateNode(update.nodeId, { metrics: update.metrics });
        } else if (update.type === 'NODE_STATUS') {
            this.updateNode(update.nodeId, { status: update.status });
        }
    }

    /**
     * Get a snapshot of nodes suitable for scheduling
     * @returns {Array<Object>} List of node snapshots
     */
    getCandidateNodes() {
        return Array.from(this.nodes.values()).filter(n => n.status === 'Online' || n.status === 'Idle');
    }

    /**
     * Optimistic lock check
     * Creates a temporary reservation in memory to prevent double-booking 
     * within the same scheduler instance before DB commit.
     */
    reserveResources(nodeId, resources) {
        const node = this.nodes.get(nodeId);
        if (!node) return false;

        // Perform check
        if (node.metrics.cpuUsage + resources.cpu > 100) return false;

        // Apply reservation (temporarily)
        node.metrics.cpuUsage += (resources.cpu || 0);
        node.metrics.ramUsage += (resources.ram || 0);

        return true;
    }
}

module.exports = new ClusterState();
