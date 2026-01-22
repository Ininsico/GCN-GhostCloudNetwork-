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

        // 1. Create the Workload Task with requirements
        const task = new Task({
            userId: req.user.id,
            name: `Marketplace-Distributed-${taskType}`,
            type: taskType || 'AI_Training',
            payload: { total_range: 5000000, complexity: 'High' },
            requirements: requirements || { parallelNodes: 1 },
            status: 'Processing'
        });

        // 2. Verified Allocation on Blockchain
        const contract = await blockchain.createAllocationContract(
            req.user.id,
            node.userId,
            task.requirements,
            0.50 // Base rental price in ANC
        );

        // Update node state
        node.activeContractId = contract.id;
        node.status = 'Busy';
        await node.save();

        const savedTask = await task.save();

        // 3. Inform Orchestrator/Agent (Parallel vs Single)
        let success = false;
        if (savedTask.requirements.parallelNodes > 1) {
            success = await orchestrator.dispatchParallelTask(savedTask, req.io);
        } else {
            savedTask.nodeId = node.nodeId;
            await savedTask.save();
            success = await orchestrator.dispatchTask(savedTask, req.io);
        }

        res.status(201).json({
            success: true,
            task: savedTask,
            contract,
            distributed: savedTask.requirements.parallelNodes > 1
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
