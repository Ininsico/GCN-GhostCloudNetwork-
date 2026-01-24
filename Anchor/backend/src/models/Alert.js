const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    name: { type: String, required: true },
    severity: { type: String, enum: ['info', 'warning', 'critical'], required: true },
    message: { type: String, required: true },
    firedAt: { type: Date, required: true },
    resolvedAt: Date,
    acknowledged: { type: Boolean, default: false },
    acknowledgedBy: String,
    acknowledgedAt: Date
}, { timestamps: true });

AlertSchema.index({ firedAt: -1 });
AlertSchema.index({ severity: 1, resolvedAt: 1 });

module.exports = mongoose.model('Alert', AlertSchema);
