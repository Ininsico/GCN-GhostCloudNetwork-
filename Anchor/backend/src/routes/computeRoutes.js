const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Task = require('../models/Task');
const AnchorNode = require('../models/AnchorNode');
const orchestrator = require('../services/orchestrator');
const blockchain = require('../services/blockchainService');

// This fetches nodes that are "Online" and not "Busy" (available for rent)
router.get('/available', auth, async (req, res) => {
    try {
        const nodes = await AnchorNode.find({ status: 'Online' });
        res.json(nodes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * PROVISION A NODE: Rent a node from the marketplace
 */
router.post('/provision', auth, async (req, res) => {
    const { nodeId, taskType, requirements } = req.body;
    try {
        const node = await AnchorNode.findOne({ nodeId, status: 'Online' });
        if (!node) return res.status(404).json({ message: 'Node not online or available.' });

        // 1. Create the Workload Task
        const task = new Task({
            userId: req.user.id,
            nodeId: node.nodeId,
            name: `Marketplace-Workload-${taskType}`,
            type: taskType || 'AI_Training',
            status: 'Processing',
            payload: { marketplace: true, rentedAt: new Date() }
        });

        const savedTask = await task.save();

        // 2. Verified Allocation on Blockchain
        const contract = await blockchain.createAllocationContract(
            req.user.id,
            node.userId,
            requirements || node.specs,
            0.50 // Base rental price in ANC
        );

        // Update node state
        node.activeContractId = contract.id;
        node.status = 'Busy';
        await node.save();

        // 3. Inform Orchestrator/Agent
        await orchestrator.dispatchTask(savedTask, req.io);

        res.status(201).json({ task: savedTask, contractId: contract.id });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
