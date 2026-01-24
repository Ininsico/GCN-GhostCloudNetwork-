/**
 * ORCHESTRATOR STUB
 * Minimal implementation to prevent import errors
 */

class Orchestrator {
    async submitTask(taskData) {
        throw new Error('Legacy orchestrator deprecated. Use /api/pods instead.');
    }

    async getTaskStatus(taskId) {
        return { status: 'unknown', message: 'Legacy API' };
    }

    async executeDAG(dag) {
        throw new Error('DAG execution moved to scheduler');
    }
}

module.exports = new Orchestrator();
