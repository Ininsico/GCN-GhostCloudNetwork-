const Task = require('../models/Task');
const AnchorNode = require('../models/AnchorNode');
const orchestrator = require('../services/orchestrator');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTask = async (req, res) => {
    const { name, type, payload, requirements } = req.body;
    try {
        const task = new Task({
            userId: req.user.id,
            name,
            type,
            payload,
            requirements: requirements || { minRam: '2GB', parallelNodes: 1 },
            status: 'Pending'
        });

        // Trigger orchestration for parallel or single node dispatch
        let success = false;
        if (task.requirements.parallelNodes > 1) {
            success = await orchestrator.dispatchParallelTask(task, req.io);
        } else {
            const optimalNode = await orchestrator.selectOptimalNode(task.requirements);
            if (optimalNode) {
                task.nodeId = optimalNode.nodeId;
                task.status = 'Processing';
                await task.save();
                success = await orchestrator.dispatchTask(task, req.io);
            }
        }

        if (success) {
            res.status(201).json(task);
        } else {
            // Task remains pending if no resources found
            const savedTask = await task.save();
            res.status(202).json({
                message: 'Task queued. Searching for suitable parallel compute resources...',
                task: savedTask
            });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { status, result, subTaskId } = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Handle Sub-task updates for Parallel Computing
        if (subTaskId) {
            const subTask = task.subTasks.id(subTaskId);
            if (subTask) {
                subTask.status = status;
                subTask.result = result;

                // Check if all subtasks are finished
                const allFinished = task.subTasks.every(st => st.status === 'Completed' || st.status === 'Failed');
                if (allFinished) {
                    task.status = 'Aggregating';
                    // Simulation logic: Merge results from all nodes
                    task.result = {
                        combined_output: task.subTasks.map(st => st.result),
                        node_map: task.subTasks.map(st => st.nodeId),
                        aggregated: true
                    };
                    task.status = 'Completed';
                }
            }
        } else {
            task.status = status;
            task.result = result;
        }

        if (status === 'Completed' || status === 'Failed') {
            task.completedAt = new Date();

            // Cleanup Node Workloads
            const nodesToCleanup = subTaskId ? [task.subTasks.id(subTaskId).nodeId] : [task.nodeId];

            for (const nodeId of nodesToCleanup) {
                const node = await AnchorNode.findOne({ nodeId });
                if (node) {
                    node.activeTasks = node.activeTasks.filter(tid => tid.toString() !== task._id.toString());
                    node.activeContractId = null; // Free from marketplace rental
                    if (node.activeTasks.length < 2) node.status = 'Online';
                    await node.save();
                }
            }
        }

        const savedTask = await task.save();

        // Notify subscribers
        const io = req.app.get('socketio');
        if (io) io.emit('task_updated', savedTask);

        res.json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
