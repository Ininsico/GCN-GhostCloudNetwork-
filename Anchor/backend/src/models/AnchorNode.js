const mongoose = require('mongoose');

const AnchorNodeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nodeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['Online', 'Offline', 'Syncing', 'Busy'], default: 'Online' },
    specs: {
        cpu: String,
        gpu: String,
        ram: String,
        storage: String
    },
    location: {
        city: String,
        country: String,
        lat: Number,
        lng: Number
    },
    metrics: {
        cpuUsage: { type: Number, default: 0 },
        gpuUsage: { type: Number, default: 0 },
        ramUsage: { type: Number, default: 0 },
        uptime: { type: Number, default: 0 }
    },
    earnings: { type: Number, default: 0 },
    activeTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    activeContractId: { type: String },
    lastHeartbeat: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('AnchorNode', AnchorNodeSchema);
