const mongoose = require('mongoose');

/**
 * LEDGER MODEL - Anchor Coin Transactions
 * 
 * Every transaction is recorded here.
 * Balance is calculated from transaction history.
 */
const ledgerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['mint', 'credit', 'debit', 'burn'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    metadata: {
        type: Object,
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

module.exports = mongoose.model('Ledger', ledgerSchema);
