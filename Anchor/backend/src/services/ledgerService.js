const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * CREDIT LEDGER SERVICE
 * Replaces the fake blockchain linked-list.
 * Keeps track of who owes who compute power based on usage.
 */

class LedgerService {

    /**
     * Record a transaction: User A consumes resources from Node B (owned by User C)
     * @param {string} consumerId - User ID using the service
     * @param {string} providerNodeId - Node ID providing the service
     * @param {number} durationSeconds - How long the session lasted
     * @param {string} type - 'GAMING', 'COMPUTE', etc.
     */
    async recordUsage(consumerId, providerNodeId, durationSeconds, type) {

        // 1. Calculate Cost (Simple Rate: 1 Credit / Minute)
        const cost = Math.ceil(durationSeconds / 60);

        const AnchorNode = require('../models/AnchorNode');
        const node = await AnchorNode.findOne({ nodeId: providerNodeId });
        if (!node) return; // Should not happen

        const providerUserId = node.userId;

        console.log(`[LEDGER] Transferring ${cost} credits from ${consumerId} to ${providerUserId}`);

        // 2. Atomic Database Update (ACID Database Transaction)
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Deduct from Consumer
            await User.findByIdAndUpdate(consumerId, { $inc: { credits: -cost } }, { session });

            // Add to Provider
            await User.findByIdAndUpdate(providerUserId, { $inc: { credits: cost } }, { session });

            // Log entry
            // In a real app we'd save a "Transaction" document here for history

            await session.commitTransaction();
            session.endSession();

            return { success: true, cost };

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('[LEDGER] Transaction failed:', error);
            return { success: false };
        }
    }
}

module.exports = new LedgerService();
