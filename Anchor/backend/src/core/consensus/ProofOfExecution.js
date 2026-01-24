const crypto = require('crypto');
const { createHash } = crypto;

/**
 * PROOF OF EXECUTION (PoE)
 * 
 * Cryptographic verification that a node actually executed a task.
 * Prevents nodes from claiming they did work without doing it.
 * 
 * Protocol:
 * 1. Orchestrator sends task with challenge (random nonce)
 * 2. Node executes task, generates proof (hash of result + nonce + timestamp)
 * 3. Orchestrator verifies proof matches expected output
 * 4. Multiple nodes execute same task (redundancy), majority consensus wins
 * 
 * Byzantine Fault Tolerance:
 * - Requires 2f+1 nodes to tolerate f Byzantine failures
 * - If results don't match, slash dishonest nodes
 */
class ProofOfExecution {
    constructor() {
        this.pendingVerifications = new Map();
        this.nodeReputations = new Map(); // nodeId -> reputation score
    }

    /**
     * Generate a challenge for a task
     */
    generateChallenge(taskId) {
        const nonce = crypto.randomBytes(32).toString('hex');
        const timestamp = Date.now();

        const challenge = {
            taskId,
            nonce,
            timestamp,
            expiresAt: timestamp + 300000 // 5 minutes
        };

        this.pendingVerifications.set(taskId, {
            challenge,
            submissions: [],
            verified: false
        });

        return challenge;
    }

    /**
     * Node submits proof of execution
     */
    submitProof(taskId, nodeId, result, proof) {
        const verification = this.pendingVerifications.get(taskId);
        if (!verification) {
            throw new Error('No pending verification for this task');
        }

        if (Date.now() > verification.challenge.expiresAt) {
            throw new Error('Challenge expired');
        }

        // Verify proof structure
        const expectedProof = this._generateProof(
            result,
            verification.challenge.nonce,
            verification.challenge.timestamp
        );

        const isValid = proof === expectedProof;

        verification.submissions.push({
            nodeId,
            result,
            proof,
            valid: isValid,
            submittedAt: Date.now()
        });

        console.log(`[PoE] Proof submitted by ${nodeId} for task ${taskId}: ${isValid ? 'VALID' : 'INVALID'}`);

        return isValid;
    }

    /**
     * Verify consensus (majority agreement)
     */
    verifyConsensus(taskId, requiredNodes = 3) {
        const verification = this.pendingVerifications.get(taskId);
        if (!verification) {
            throw new Error('No pending verification');
        }

        if (verification.submissions.length < requiredNodes) {
            return {
                ready: false,
                message: `Waiting for ${requiredNodes - verification.submissions.length} more submissions`
            };
        }

        // Group by result hash
        const resultGroups = new Map();
        for (const submission of verification.submissions) {
            const resultHash = createHash('sha256').update(JSON.stringify(submission.result)).digest('hex');

            if (!resultGroups.has(resultHash)) {
                resultGroups.set(resultHash, []);
            }
            resultGroups.get(resultHash).push(submission);
        }

        // Find majority
        let majorityGroup = null;
        let maxCount = 0;

        for (const [hash, group] of resultGroups) {
            if (group.length > maxCount) {
                maxCount = group.length;
                majorityGroup = group;
            }
        }

        const consensusReached = maxCount >= Math.ceil(requiredNodes / 2);

        if (consensusReached) {
            // Update reputations
            for (const submission of verification.submissions) {
                const inMajority = majorityGroup.includes(submission);
                this._updateReputation(submission.nodeId, inMajority ? 1 : -10);
            }

            verification.verified = true;
            verification.consensusResult = majorityGroup[0].result;
            verification.honestNodes = majorityGroup.map(s => s.nodeId);
            verification.dishonestNodes = verification.submissions
                .filter(s => !majorityGroup.includes(s))
                .map(s => s.nodeId);

            console.log(`[PoE] Consensus reached for task ${taskId}`);
            console.log(`[PoE] Honest nodes: ${verification.honestNodes.join(', ')}`);
            console.log(`[PoE] Dishonest nodes: ${verification.dishonestNodes.join(', ')}`);

            return {
                ready: true,
                verified: true,
                result: verification.consensusResult,
                honestNodes: verification.honestNodes,
                dishonestNodes: verification.dishonestNodes
            };
        }

        return { ready: true, verified: false, message: 'No consensus reached' };
    }

    /**
     * Generate proof hash
     */
    _generateProof(result, nonce, timestamp) {
        const data = JSON.stringify({ result, nonce, timestamp });
        return createHash('sha256').update(data).digest('hex');
    }

    /**
     * Update node reputation
     */
    _updateReputation(nodeId, delta) {
        const current = this.nodeReputations.get(nodeId) || 100;
        const updated = Math.max(0, Math.min(100, current + delta));
        this.nodeReputations.set(nodeId, updated);

        if (updated < 50) {
            console.warn(`[PoE] Node ${nodeId} reputation dropped to ${updated} - consider banning`);
        }
    }

    /**
     * Get node reputation
     */
    getReputation(nodeId) {
        return this.nodeReputations.get(nodeId) || 100;
    }

    /**
     * Slash a dishonest node (reduce stake/ban)
     */
    slashNode(nodeId, reason) {
        this._updateReputation(nodeId, -50);
        console.log(`[PoE] SLASHED node ${nodeId}: ${reason}`);

        // In production, this would:
        // 1. Reduce their staked tokens
        // 2. Temporarily ban from network
        // 3. Broadcast to all peers
    }
}

module.exports = new ProofOfExecution();
