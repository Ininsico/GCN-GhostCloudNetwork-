const express = require('express');
const router = express.Router();
const Pod = require('../models/Pod');
const scheduler = require('../core/scheduler');

/**
 * POD API ROUTES
 * Kubernetes-style pod management
 */

// Create a new pod
router.post('/', async (req, res) => {
    try {
        const podSpec = req.body;
        const pod = await scheduler.schedulePod(podSpec);
        res.status(201).json(pod);
    } catch (error) {
        console.error('[API] Pod creation failed:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all pods
router.get('/', async (req, res) => {
    try {
        const { namespace } = req.query;
        const filter = namespace ? { namespace } : {};
        const pods = await Pod.find(filter).sort({ createdAt: -1 });
        res.json(pods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single pod
router.get('/:id', async (req, res) => {
    try {
        const pod = await Pod.findById(req.params.id);
        if (!pod) {
            return res.status(404).json({ error: 'Pod not found' });
        }
        res.json(pod);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update pod status (called by agent)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, exitCode, error } = req.body;
        const pod = await Pod.findByIdAndUpdate(
            req.params.id,
            {
                status,
                exitCode,
                statusReason: error,
                updatedAt: new Date()
            },
            { new: true }
        );
        res.json(pod);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete pod
router.delete('/:id', async (req, res) => {
    try {
        await Pod.findByIdAndDelete(req.params.id);
        res.json({ message: 'Pod deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
