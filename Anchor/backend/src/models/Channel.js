const mongoose = require('mongoose');

/**
 * CHANNEL MODEL - Payment Channels
 * 
 * Stores payment channel state in MongoDB.
 * Replaces the in-memory Map.
 */
const channelSchema = new mongoose.Schema({
    channelId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    from: {
        type: String,
        required: true,
        index: true
    },
    to: {
        type: String,
        required: true,
        index: true
    },
    capacity: {
        type: Number,
        required: true
    },
    balance: {
        type: Object,
        required: true
    },
    collateral: {
        type: Object,
        required: true
    },
    nonce: {
        type: Number,
        default: 0
    },
    state: {
        type: String,
        enum: ['open', 'closed', 'disputed'],
        default: 'open',
        index: true
    },
    openedAt: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    closedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Channel', channelSchema);
