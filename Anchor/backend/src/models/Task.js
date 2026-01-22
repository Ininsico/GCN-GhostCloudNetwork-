const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nodeId: { type: String }, // Primary or shared node ID
    name: { type: String, required: true },
    type: { type: String, enum: ['AI_Training', 'Data_Processing', 'Edge_Compute', 'Encoding', 'Parallel_Compute'], required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Aggregating'], default: 'Pending' },
    priority: { type: Number, default: 0 },
    payload: { type: mongoose.Schema.Types.Mixed },
    requirements: {
        minRam: String,
        gpuRequired: Boolean,
        parallelNodes: { type: Number, default: 1 } // How many nodes to distribute across
    },
    subTasks: [{
        nodeId: String,
        chunkIndex: Number,
        data: mongoose.Schema.Types.Mixed,
        status: { type: String, enum: ['Pending', 'Processing', 'Completed', 'Failed'], default: 'Pending' },
        result: mongoose.Schema.Types.Mixed,
        heartbeat: Date
    }],
    result: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

module.exports = mongoose.model('Task', taskSchema);
