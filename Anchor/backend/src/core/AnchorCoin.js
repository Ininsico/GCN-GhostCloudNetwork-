/**
 * ANCHOR COINS - INTERNAL CREDIT SYSTEM
 * 
 * Simple supply/demand based pricing.
 * No blockchain - just a ledger in MongoDB.
 * 
 * How it works:
 * 1. Users buy Anchor Coins with credit card
 * 2. Spend coins to use compute resources
 * 3. Node operators earn coins for providing resources
 * 4. Price adjusts based on network load (supply/demand)
 */

class AnchorCoin {
    constructor() {
        this.basePrice = 0.001; // $0.001 per coin
        this.totalSupply = 0;
        this.circulatingSupply = 0;
    }

    /**
     * Calculate current price based on network load
     */
    async getCurrentPrice() {
        const utilizationRate = await this._getNetworkUtilization();
        const demandMultiplier = 1 + (utilizationRate / 100);

        return this.basePrice * demandMultiplier;
    }

    /**
     * Calculate cost for compute resources
     */
    async calculateCost(resourceType, duration, specs = {}) {
        const rates = {
            cpu: 0.1, // coins per core-hour
            ram: 0.01, // coins per GB-hour
            gpu: 1.0, // coins per GPU-hour
            storage: 0.001 // coins per GB-hour
        };

        const baseRate = rates[resourceType] || rates.cpu;
        const hours = duration / 3600;

        let cost = baseRate * hours;

        // GPU multiplier based on type
        if (resourceType === 'gpu' && specs.gpuType) {
            const gpuMultipliers = {
                'RTX 4090': 2.0,
                'RTX 4080': 1.5,
                'RTX 3090': 1.2,
                'GTX 1080': 0.5
            };
            cost *= (gpuMultipliers[specs.gpuType] || 1.0);
        }

        // Network load surge pricing
        const utilizationRate = await this._getNetworkUtilization();
        if (utilizationRate > 90) {
            cost *= 2.0; // 100% surge
        } else if (utilizationRate > 80) {
            cost *= 1.5; // 50% surge
        }

        return Math.ceil(cost * 100) / 100;
    }

    /**
     * Mint new coins (when users buy with credit card)
     */
    async mint(userId, amount) {
        const Ledger = require('../models/Ledger');

        const transaction = await Ledger.create({
            userId,
            type: 'mint',
            amount,
            balance: await this._getBalance(userId) + amount,
            timestamp: new Date()
        });

        this.totalSupply += amount;
        this.circulatingSupply += amount;

        console.log(`[AnchorCoin] Minted ${amount} coins for user ${userId}`);

        return transaction;
    }

    /**
     * Transfer coins from user to node operator
     */
    async transfer(fromUserId, toNodeId, amount, reason) {
        const Ledger = require('../models/Ledger');

        const fromBalance = await this._getBalance(fromUserId);
        if (fromBalance < amount) {
            throw new Error('Insufficient balance');
        }

        // Deduct from user
        await Ledger.create({
            userId: fromUserId,
            type: 'debit',
            amount: -amount,
            balance: fromBalance - amount,
            metadata: { toNodeId, reason },
            timestamp: new Date()
        });

        // Credit to node operator
        const toBalance = await this._getBalance(toNodeId);
        await Ledger.create({
            userId: toNodeId,
            type: 'credit',
            amount,
            balance: toBalance + amount,
            metadata: { fromUserId, reason },
            timestamp: new Date()
        });

        console.log(`[AnchorCoin] Transferred ${amount} coins: ${fromUserId} → ${toNodeId} (${reason})`);
    }

    /**
     * Get user balance
     */
    async _getBalance(userId) {
        const Ledger = require('../models/Ledger');
        const lastEntry = await Ledger.findOne({ userId }).sort({ timestamp: -1 });
        return lastEntry ? lastEntry.balance : 0;
    }

    /**
     * Get network utilization (0-100%)
     * REAL calculation from MongoDB cluster state
     */
    async _getNetworkUtilization() {
        try {
            const AnchorNode = require('../models/AnchorNode');

            const nodes = await AnchorNode.find({ status: { $in: ['Online', 'Idle'] } });

            if (nodes.length === 0) return 0;

            let totalCpu = 0;
            let count = 0;

            for (const node of nodes) {
                if (node.metrics && typeof node.metrics.cpuUsage === 'number') {
                    totalCpu += node.metrics.cpuUsage;
                    count++;
                }
            }

            return count > 0 ? Math.round(totalCpu / count) : 0;

        } catch (err) {
            console.error('[AnchorCoin] Failed to get network utilization:', err.message);
            return 50;
        }
    }

    /**
     * Get coin statistics
     */
    async getStats() {
        const Ledger = require('../models/Ledger');

        const totalTransactions = await Ledger.countDocuments();
        const last24h = await Ledger.countDocuments({
            timestamp: { $gte: new Date(Date.now() - 86400000) }
        });

        return {
            totalSupply: this.totalSupply,
            circulatingSupply: this.circulatingSupply,
            currentPrice: await this.getCurrentPrice(),
            networkUtilization: await this._getNetworkUtilization(),
            totalTransactions,
            transactions24h: last24h
        };
    }
}

module.exports = new AnchorCoin();
