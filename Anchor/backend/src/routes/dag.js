const express = require('express');
const router = express.Router();
const orchestrator = require('../services/orchestrator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

/**
 * POST /api/dag/schedule
 * Schedule a complex multi-step task with dependencies
 * Body: { tasks: [{ id, type, payload, requirements, dependencies: [] }] }
 */
router.post('/schedule', auth, async (req, res) => {
    try {
        const { tasks } = req.body;

        if (!tasks || !Array.isArray(tasks)) {
            return res.status(400).json({ error: 'Invalid task graph format' });
        }

        const io = req.app.get('io');
        await orchestrator.scheduleDAGTask(tasks, io);

        res.json({
            success: true,
            message: `DAG task graph scheduled with ${tasks.length} nodes`,
            taskIds: tasks.map(t => t.id)
        });
    } catch (error) {
        console.error('[DAG_API] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/dag/verify
 * Verify task result using consensus mechanism
 * Body: { taskId, subTaskId, result }
 */
router.post('/verify', auth, async (req, res) => {
    try {
        const { taskId, subTaskId, result } = req.body;

        const verification = await orchestrator.verifyTaskResult(taskId, subTaskId, result);

        res.json({
            success: true,
            verification
        });
    } catch (error) {
        console.error('[CONSENSUS_API] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/dag/graph/:taskId
 * Get the current state of a DAG task graph
 */
router.get('/graph/:taskId', auth, async (req, res) => {
    try {
        const { taskId } = req.params;
        const graph = orchestrator.taskGraph;

        if (!graph.has(taskId)) {
            return res.status(404).json({ error: 'Task graph not found' });
        }

        // Convert Map to object for JSON serialization
        const graphState = {};
        for (const [id, node] of graph.entries()) {
            graphState[id] = {
                status: node.status,
                dependencies: node.dependencies,
                hasResult: !!node.result
            };
        }

        res.json({
            success: true,
            graph: graphState
        });
    } catch (error) {
        console.error('[DAG_API] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
