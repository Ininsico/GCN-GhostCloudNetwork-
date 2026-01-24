const mongoose = require('mongoose');

const PodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    namespace: { type: String, default: 'default' },

    // Spec defines what the pod should run
    spec: {
        containers: [{
            name: String,
            image: String,
            command: [String],
            env: mongoose.Schema.Types.Mixed,
            resources: {
                requests: {
                    cpu: String,      // e.g., "500m" = 0.5 CPU
                    memory: String,   // e.g., "512Mi"
                    gpu: Number       // e.g., 1
                },
                limits: {
                    cpu: String,
                    memory: String,
                    gpu: Number
                }
            },
            ports: [{
                containerPort: Number,
                protocol: String
            }]
        }],

        restartPolicy: { type: String, default: 'Always' }, // Always, OnFailure, Never

        affinity: {
            nodeAffinity: {
                required: mongoose.Schema.Types.Mixed,
                preferred: mongoose.Schema.Types.Mixed
            },
            podAffinity: mongoose.Schema.Types.Mixed,
            podAntiAffinity: mongoose.Schema.Types.Mixed
        },

        tolerations: [mongoose.Schema.Types.Mixed],

        volumes: [{
            name: String,
            type: String, // persistentVolumeClaim, hostPath, emptyDir
            source: String
        }],

        deployment: String, // Parent deployment name
        priority: { type: Number, default: 0 }
    },

    // Status
    status: { type: String, default: 'Pending' }, // Pending, Running, Succeeded, Failed, Unknown
    phase: String, // Scheduling, Starting, Running, Terminating
    statusReason: String,

    // Node assignment
    nodeId: String,
    nodeName: String,

    // Timestamps
    scheduledAt: Date,
    startedAt: Date,
    terminatedAt: Date,

    // Metrics
    metrics: {
        cpuUsage: Number,
        memoryUsage: Number,
        gpuUsage: Number,
        networkIn: Number,
        networkOut: Number
    },

    // Restart tracking
    restartCount: { type: Number, default: 0 },
    lastRestartTime: Date,

    // Logs
    logs: [String]
}, { timestamps: true });

// Indexes for fast queries
PodSchema.index({ namespace: 1, status: 1 });
PodSchema.index({ nodeId: 1, status: 1 });
PodSchema.index({ 'spec.deployment': 1, namespace: 1 });

module.exports = mongoose.model('Pod', PodSchema);
