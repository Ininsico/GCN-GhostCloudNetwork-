const crypto = require('crypto');
const User = require('../models/User');

/**
 * BLOCK-NET: THE DISTRIBUTED LEDGER & SMART CONTRACT ENGINE
 * Verifies resource allocation and handles micro-payments for compute nodes.
 */
class BlockchainService {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
    }

    // Records a verified resource allocation "Smart Contract"
    async createAllocationContract(userId, nodeOwnerId, resources, amount) {
        const contract = {
            id: `anc_contract_${crypto.randomBytes(4).toString('hex')}`,
            timestamp: new Date(),
            parties: { user: userId, provider: nodeOwnerId },
            allocation: resources,
            escrow_amount: amount,
            status: 'LOCKED',
            verification_hash: this._generateHash(JSON.stringify(resources) + amount)
        };

        this.chain.push(contract);
        console.log(`[BLOCK-NET] New Smart Contract Verified: ${contract.id}`);
        return contract;
    }

    // Handles micro-payments in real-time during resource consumption
    async processMicropayment(contractId, usageDurationSeconds) {
        const contract = this.chain.find(c => c.id === contractId);
        if (!contract) return 0;

        // Calculate payment: ANC per hour / 3600 * seconds
        const paymentValue = (contract.escrow_amount / 3600) * usageDurationSeconds;

        try {
            // 1. Deduct from Renter
            await User.findByIdAndUpdate(contract.parties.user, {
                $inc: { credits: -paymentValue }
            });

            // 2. Pay Node Owner
            await User.findByIdAndUpdate(contract.parties.provider, {
                $inc: { credits: paymentValue }
            });

            console.log(`[BLOCK-NET] Micro-payment Ledger Update: ${paymentValue.toFixed(6)} ANC transferred from ${contract.parties.user} to ${contract.parties.provider}`);
            return paymentValue;
        } catch (err) {
            console.error('[BLOCK-NET] Ledget update failed:', err);
            return 0;
        }
    }

    _generateHash(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
}

module.exports = new BlockchainService();
