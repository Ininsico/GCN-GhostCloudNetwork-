const Redis = require('ioredis');
const { Registry, Counter, Gauge, Histogram, Summary } = require('prom-client');

/**
 * PRODUCTION MONITORING - Prometheus-Compatible Metrics
 * 
 * Features:
 * - Time-series metrics collection
 * - Prometheus exposition format
 * - Alerting rules
 * - Distributed tracing
 * - Log aggregation
 */
class MonitoringSystem {
    constructor() {
        this.registry = new Registry();
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379
        });

        // Define metrics
        this.metrics = {
            // Node metrics
            nodeCount: new Gauge({
                name: 'anchor_nodes_total',
                help: 'Total number of nodes in the cluster',
                labelNames: ['status'],
                registers: [this.registry]
            }),

            nodeCpu: new Gauge({
                name: 'anchor_node_cpu_usage',
                help: 'CPU usage percentage by node',
                labelNames: ['node_id', 'node_name'],
                registers: [this.registry]
            }),

            nodeMemory: new Gauge({
                name: 'anchor_node_memory_usage',
                help: 'Memory usage percentage by node',
                labelNames: ['node_id', 'node_name'],
                registers: [this.registry]
            }),

            nodeGpu: new Gauge({
                name: 'anchor_node_gpu_usage',
                help: 'GPU usage percentage by node',
                labelNames: ['node_id', 'node_name'],
                registers: [this.registry]
            }),

            // Pod metrics
            podCount: new Gauge({
                name: 'anchor_pods_total',
                help: 'Total number of pods',
                labelNames: ['namespace', 'status'],
                registers: [this.registry]
            }),

            podRestarts: new Counter({
                name: 'anchor_pod_restarts_total',
                help: 'Total pod restarts',
                labelNames: ['namespace', 'pod_name'],
                registers: [this.registry]
            }),

            // Task metrics
            taskDuration: new Histogram({
                name: 'anchor_task_duration_seconds',
                help: 'Task execution duration',
                labelNames: ['task_type', 'status'],
                buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120, 300],
                registers: [this.registry]
            }),

            taskCount: new Counter({
                name: 'anchor_tasks_total',
                help: 'Total tasks executed',
                labelNames: ['task_type', 'status'],
                registers: [this.registry]
            }),

            // Queue metrics
            queueDepth: new Gauge({
                name: 'anchor_queue_depth',
                help: 'Number of jobs in queue',
                labelNames: ['queue_name'],
                registers: [this.registry]
            }),

            queueProcessingTime: new Summary({
                name: 'anchor_queue_processing_seconds',
                help: 'Queue job processing time',
                labelNames: ['queue_name'],
                percentiles: [0.5, 0.9, 0.95, 0.99],
                registers: [this.registry]
            }),

            // Storage metrics
            storageUsed: new Gauge({
                name: 'anchor_storage_used_bytes',
                help: 'Storage used in bytes',
                labelNames: ['volume_id'],
                registers: [this.registry]
            }),

            storageIops: new Counter({
                name: 'anchor_storage_iops_total',
                help: 'Storage I/O operations',
                labelNames: ['volume_id', 'operation'],
                registers: [this.registry]
            }),

            // Network metrics
            networkBytesIn: new Counter({
                name: 'anchor_network_bytes_received_total',
                help: 'Network bytes received',
                labelNames: ['node_id'],
                registers: [this.registry]
            }),

            networkBytesOut: new Counter({
                name: 'anchor_network_bytes_sent_total',
                help: 'Network bytes sent',
                labelNames: ['node_id'],
                registers: [this.registry]
            }),

            // API metrics
            httpRequests: new Counter({
                name: 'anchor_http_requests_total',
                help: 'Total HTTP requests',
                labelNames: ['method', 'path', 'status'],
                registers: [this.registry]
            }),

            httpDuration: new Histogram({
                name: 'anchor_http_request_duration_seconds',
                help: 'HTTP request duration',
                labelNames: ['method', 'path'],
                buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
                registers: [this.registry]
            })
        };

        // Alerting rules
        this.alerts = [];

        this._startMetricsCollection();
    }

    /**
     * Record node metrics
     */
    async recordNodeMetrics(nodeId, nodeName, metrics) {
        this.metrics.nodeCpu.set({ node_id: nodeId, node_name: nodeName }, metrics.cpuUsage || 0);
        this.metrics.nodeMemory.set({ node_id: nodeId, node_name: nodeName }, metrics.ramUsage || 0);

        if (metrics.gpuUsage !== undefined) {
            this.metrics.nodeGpu.set({ node_id: nodeId, node_name: nodeName }, metrics.gpuUsage);
        }

        // Store in Redis for time-series queries
        const timestamp = Date.now();
        await this.redis.zadd(`metrics:node:${nodeId}:cpu`, timestamp, JSON.stringify({
            timestamp,
            value: metrics.cpuUsage
        }));

        await this.redis.zadd(`metrics:node:${nodeId}:memory`, timestamp, JSON.stringify({
            timestamp,
            value: metrics.ramUsage
        }));

        // Trim old data (keep last 24 hours)
        const cutoff = timestamp - (24 * 60 * 60 * 1000);
        await this.redis.zremrangebyscore(`metrics:node:${nodeId}:cpu`, 0, cutoff);
        await this.redis.zremrangebyscore(`metrics:node:${nodeId}:memory`, 0, cutoff);
    }

    /**
     * Record task execution
     */
    recordTask(taskType, status, duration) {
        this.metrics.taskCount.inc({ task_type: taskType, status });
        this.metrics.taskDuration.observe({ task_type: taskType, status }, duration);
    }

    /**
     * Record HTTP request
     */
    recordHttpRequest(method, path, status, duration) {
        this.metrics.httpRequests.inc({ method, path, status });
        this.metrics.httpDuration.observe({ method, path }, duration);
    }

    /**
     * Get metrics in Prometheus format
     */
    async getMetrics() {
        return this.registry.metrics();
    }

    /**
     * Query time-series data
     */
    async queryMetrics(nodeId, metric, startTime, endTime) {
        const key = `metrics:node:${nodeId}:${metric}`;
        const data = await this.redis.zrangebyscore(key, startTime, endTime);

        return data.map(item => JSON.parse(item));
    }

    /**
     * Define alert rule
     */
    addAlert(rule) {
        this.alerts.push({
            name: rule.name,
            condition: rule.condition, // Function that returns true if alert should fire
            severity: rule.severity || 'warning', // warning, critical
            message: rule.message,
            cooldown: rule.cooldown || 300000, // 5 minutes
            lastFired: null
        });
    }

    /**
     * Check alert conditions
     */
    async checkAlerts() {
        const now = Date.now();

        for (const alert of this.alerts) {
            // Skip if in cooldown
            if (alert.lastFired && (now - alert.lastFired) < alert.cooldown) {
                continue;
            }

            try {
                const shouldFire = await alert.condition();

                if (shouldFire) {
                    alert.lastFired = now;
                    await this._fireAlert(alert);
                }
            } catch (err) {
                console.error(`[MONITORING] Alert check failed for ${alert.name}:`, err.message);
            }
        }
    }

    /**
     * Fire an alert
     */
    async _fireAlert(alert) {
        console.error(`[ALERT] ${alert.severity.toUpperCase()}: ${alert.name} - ${alert.message}`);

        // Store alert in database
        const Alert = require('../models/Alert');
        await Alert.create({
            name: alert.name,
            severity: alert.severity,
            message: alert.message,
            firedAt: new Date()
        });

        // Send to external alerting systems (PagerDuty, Slack, etc.)
        // ... integration code ...
    }

    /**
     * Start continuous metrics collection
     */
    _startMetricsCollection() {
        // Update node counts every 10s
        setInterval(async () => {
            const AnchorNode = require('../models/AnchorNode');
            const statuses = ['Online', 'Offline', 'Busy'];

            for (const status of statuses) {
                const count = await AnchorNode.countDocuments({ status });
                this.metrics.nodeCount.set({ status }, count);
            }
        }, 10000);

        // Update pod counts every 10s
        setInterval(async () => {
            const Pod = require('../models/Pod');
            const namespaces = await Pod.distinct('namespace');
            const statuses = ['Pending', 'Running', 'Succeeded', 'Failed'];

            for (const namespace of namespaces) {
                for (const status of statuses) {
                    const count = await Pod.countDocuments({ namespace, status });
                    this.metrics.podCount.set({ namespace, status }, count);
                }
            }
        }, 10000);

        // Update queue depths every 5s
        setInterval(async () => {
            const orchestrator = require('./orchestrator');
            const stats = await orchestrator.getQueueStats();

            if (stats) {
                this.metrics.queueDepth.set({ queue_name: 'tasks' }, stats.tasks?.waiting || 0);
                this.metrics.queueDepth.set({ queue_name: 'dag' }, stats.dag?.waiting || 0);
                this.metrics.queueDepth.set({ queue_name: 'consensus' }, stats.consensus?.waiting || 0);
            }
        }, 5000);

        // Check alerts every 30s
        setInterval(() => this.checkAlerts(), 30000);

        console.log('[MONITORING] Metrics collection started');
    }

    /**
     * Get dashboard data
     */
    async getDashboardData() {
        const AnchorNode = require('../models/AnchorNode');
        const Pod = require('../models/Pod');
        const Task = require('../models/Task');

        const [
            totalNodes,
            onlineNodes,
            totalPods,
            runningPods,
            totalTasks,
            completedTasks
        ] = await Promise.all([
            AnchorNode.countDocuments(),
            AnchorNode.countDocuments({ status: 'Online' }),
            Pod.countDocuments(),
            Pod.countDocuments({ status: 'Running' }),
            Task.countDocuments(),
            Task.countDocuments({ status: 'Completed' })
        ]);

        // Get recent alerts
        const Alert = require('../models/Alert');
        const recentAlerts = await Alert.find()
            .sort({ firedAt: -1 })
            .limit(10);

        return {
            cluster: {
                totalNodes,
                onlineNodes,
                totalPods,
                runningPods,
                totalTasks,
                completedTasks
            },
            alerts: recentAlerts
        };
    }
}

// Define default alerts
const monitoring = new MonitoringSystem();

// Alert: High CPU usage
monitoring.addAlert({
    name: 'HighCPUUsage',
    severity: 'warning',
    message: 'Cluster average CPU usage above 80%',
    condition: async () => {
        const AnchorNode = require('../models/AnchorNode');
        const nodes = await AnchorNode.find({ status: 'Online' });

        if (nodes.length === 0) return false;

        const avgCpu = nodes.reduce((sum, node) => sum + (node.metrics?.cpuUsage || 0), 0) / nodes.length;
        return avgCpu > 80;
    }
});

// Alert: Node offline
monitoring.addAlert({
    name: 'NodeOffline',
    severity: 'critical',
    message: 'One or more nodes went offline',
    condition: async () => {
        const AnchorNode = require('../models/AnchorNode');
        const offlineCount = await AnchorNode.countDocuments({ status: 'Offline' });
        return offlineCount > 0;
    }
});

// Alert: Pod failures
monitoring.addAlert({
    name: 'PodFailures',
    severity: 'warning',
    message: 'Multiple pod failures detected',
    condition: async () => {
        const Pod = require('../models/Pod');
        const failedCount = await Pod.countDocuments({
            status: 'Failed',
            createdAt: { $gt: new Date(Date.now() - 300000) } // Last 5 minutes
        });
        return failedCount > 5;
    }
});

module.exports = monitoring;
