const mongoose = require('mongoose');

const ClusterSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    provider: { type: String, enum: ['AWS', 'GCP', 'Azure', 'Vercel', 'Self-Hosted'], required: true },
    region: { type: String, required: true },
    type: { type: String, enum: ['Messaging', 'Gaming', 'IoT', 'Experimental'], default: 'Messaging' },
    status: { type: String, enum: ['Healthy', 'Scaling', 'DDoS Mitigating', 'Offline'], default: 'Healthy' },
    config: {
        maxConnections: Number,
        authRequired: Boolean,
        encryption: String
    },
    endpoint: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Cluster', ClusterSchema);
