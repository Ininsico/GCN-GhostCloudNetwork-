const EventEmitter = require('events');

/**
 * RAFT CONSENSUS - DISTRIBUTED CONTROL PLANE
 * 
 * Ensures the control plane (scheduler, orchestrator) is highly available.
 * Multiple backend instances elect a leader. If leader dies, new election happens.
 * 
 * Raft Algorithm:
 * 1. Leader Election: Nodes vote for a leader
 * 2. Log Replication: Leader replicates state changes to followers
 * 3. Safety: Only committed entries can be applied
 * 
 * Use Case:
 * - Multiple scheduler instances across regions
 * - Only leader makes scheduling decisions
 * - Followers replicate state for failover
 */
class RaftNode extends EventEmitter {
    constructor(nodeId, peers = []) {
        super();
        this.nodeId = nodeId;
        this.peers = peers; // List of other Raft nodes

        // Persistent state
        this.currentTerm = 0;
        this.votedFor = null;
        this.log = []; // { term, command, index }

        // Volatile state
        this.commitIndex = 0;
        this.lastApplied = 0;
        this.state = 'follower'; // follower, candidate, leader

        // Leader state
        this.nextIndex = new Map(); // For each peer, next log entry to send
        this.matchIndex = new Map(); // For each peer, highest replicated entry

        // Timers
        this.electionTimeout = null;
        this.heartbeatInterval = null;

        this._resetElectionTimer();
    }

    /**
     * Start the Raft node
     */
    start() {
        console.log(`[Raft ${this.nodeId}] Starting as follower`);
        this._resetElectionTimer();
    }

    /**
     * Append a command to the log (only leader can do this)
     */
    async appendCommand(command) {
        if (this.state !== 'leader') {
            throw new Error('Not the leader - redirect to leader');
        }

        const entry = {
            term: this.currentTerm,
            command,
            index: this.log.length
        };

        this.log.push(entry);

        console.log(`[Raft ${this.nodeId}] Leader appended command: ${JSON.stringify(command)}`);

        // Replicate to followers
        await this._replicateLog();

        return entry;
    }

    /**
     * Handle RequestVote RPC
     */
    async handleRequestVote(candidateId, term, lastLogIndex, lastLogTerm) {
        console.log(`[Raft ${this.nodeId}] Received vote request from ${candidateId} (term ${term})`);

        // If candidate's term is older, reject
        if (term < this.currentTerm) {
            return { term: this.currentTerm, voteGranted: false };
        }

        // If candidate's term is newer, step down
        if (term > this.currentTerm) {
            this.currentTerm = term;
            this.state = 'follower';
            this.votedFor = null;
        }

        // Check if we already voted this term
        if (this.votedFor !== null && this.votedFor !== candidateId) {
            return { term: this.currentTerm, voteGranted: false };
        }

        // Check if candidate's log is at least as up-to-date
        const ourLastLog = this.log[this.log.length - 1];
        const ourLastTerm = ourLastLog ? ourLastLog.term : 0;
        const ourLastIndex = this.log.length - 1;

        const candidateLogUpToDate =
            lastLogTerm > ourLastTerm ||
            (lastLogTerm === ourLastTerm && lastLogIndex >= ourLastIndex);

        if (candidateLogUpToDate) {
            this.votedFor = candidateId;
            this._resetElectionTimer();
            console.log(`[Raft ${this.nodeId}] Voted for ${candidateId}`);
            return { term: this.currentTerm, voteGranted: true };
        }

        return { term: this.currentTerm, voteGranted: false };
    }

    /**
     * Handle AppendEntries RPC (heartbeat or log replication)
     */
    async handleAppendEntries(leaderId, term, prevLogIndex, prevLogTerm, entries, leaderCommit) {
        // Reset election timer (we heard from leader)
        this._resetElectionTimer();

        if (term < this.currentTerm) {
            return { term: this.currentTerm, success: false };
        }

        if (term > this.currentTerm) {
            this.currentTerm = term;
            this.state = 'follower';
            this.votedFor = null;
        }

        // Check if our log matches leader's
        if (prevLogIndex >= 0) {
            const prevLog = this.log[prevLogIndex];
            if (!prevLog || prevLog.term !== prevLogTerm) {
                return { term: this.currentTerm, success: false };
            }
        }

        // Append new entries
        if (entries && entries.length > 0) {
            // Delete conflicting entries
            this.log = this.log.slice(0, prevLogIndex + 1);

            // Append new entries
            this.log.push(...entries);

            console.log(`[Raft ${this.nodeId}] Replicated ${entries.length} entries from leader ${leaderId}`);
        }

        // Update commit index
        if (leaderCommit > this.commitIndex) {
            this.commitIndex = Math.min(leaderCommit, this.log.length - 1);
            await this._applyCommittedEntries();
        }

        return { term: this.currentTerm, success: true };
    }

    /**
     * Start leader election
     */
    async _startElection() {
        this.state = 'candidate';
        this.currentTerm++;
        this.votedFor = this.nodeId;

        console.log(`[Raft ${this.nodeId}] Starting election for term ${this.currentTerm}`);

        const lastLog = this.log[this.log.length - 1];
        const lastLogIndex = this.log.length - 1;
        const lastLogTerm = lastLog ? lastLog.term : 0;

        // Request votes from all peers
        const votes = [true]; // Vote for self

        for (const peer of this.peers) {
            const response = await this._sendRequestVote(peer, {
                candidateId: this.nodeId,
                term: this.currentTerm,
                lastLogIndex,
                lastLogTerm
            });

            if (response && response.voteGranted) {
                votes.push(true);
            }

            // If we discover a higher term, step down
            if (response && response.term > this.currentTerm) {
                this.currentTerm = response.term;
                this.state = 'follower';
                this.votedFor = null;
                this._resetElectionTimer();
                return;
            }
        }

        // Check if we won
        const majority = Math.floor((this.peers.length + 1) / 2) + 1;
        if (votes.length >= majority) {
            this._becomeLeader();
        } else {
            // Lost election, back to follower
            this.state = 'follower';
            this._resetElectionTimer();
        }
    }

    /**
     * Become leader
     */
    _becomeLeader() {
        console.log(`[Raft ${this.nodeId}] 🎉 ELECTED LEADER for term ${this.currentTerm}`);

        this.state = 'leader';

        // Initialize leader state
        for (const peer of this.peers) {
            this.nextIndex.set(peer, this.log.length);
            this.matchIndex.set(peer, -1);
        }

        // Start sending heartbeats
        this._startHeartbeat();

        this.emit('leader-elected', this.nodeId);
    }

    /**
     * Send heartbeats to maintain leadership
     */
    _startHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.heartbeatInterval = setInterval(async () => {
            if (this.state !== 'leader') {
                clearInterval(this.heartbeatInterval);
                return;
            }

            await this._replicateLog();
        }, 150); // Send heartbeat every 150ms
    }

    /**
     * Replicate log to followers
     */
    async _replicateLog() {
        for (const peer of this.peers) {
            const nextIdx = this.nextIndex.get(peer);
            const prevLogIndex = nextIdx - 1;
            const prevLog = this.log[prevLogIndex];
            const prevLogTerm = prevLog ? prevLog.term : 0;

            const entries = this.log.slice(nextIdx);

            const response = await this._sendAppendEntries(peer, {
                leaderId: this.nodeId,
                term: this.currentTerm,
                prevLogIndex,
                prevLogTerm,
                entries,
                leaderCommit: this.commitIndex
            });

            if (response && response.success) {
                // Update nextIndex and matchIndex
                if (entries.length > 0) {
                    this.nextIndex.set(peer, nextIdx + entries.length);
                    this.matchIndex.set(peer, nextIdx + entries.length - 1);
                }
            } else if (response && !response.success) {
                // Decrement nextIndex and retry
                this.nextIndex.set(peer, Math.max(0, nextIdx - 1));
            }

            // Step down if we discover higher term
            if (response && response.term > this.currentTerm) {
                this.currentTerm = response.term;
                this.state = 'follower';
                this.votedFor = null;
                clearInterval(this.heartbeatInterval);
                this._resetElectionTimer();
                return;
            }
        }

        // Update commit index
        this._updateCommitIndex();
    }

    /**
     * Update commit index based on majority replication
     */
    _updateCommitIndex() {
        const matchIndices = Array.from(this.matchIndex.values()).sort((a, b) => b - a);
        const majority = Math.floor(this.peers.length / 2);

        if (matchIndices.length > majority) {
            const newCommitIndex = matchIndices[majority];

            if (newCommitIndex > this.commitIndex && this.log[newCommitIndex].term === this.currentTerm) {
                this.commitIndex = newCommitIndex;
                this._applyCommittedEntries();
            }
        }
    }

    /**
     * Apply committed entries to state machine
     */
    async _applyCommittedEntries() {
        while (this.lastApplied < this.commitIndex) {
            this.lastApplied++;
            const entry = this.log[this.lastApplied];

            console.log(`[Raft ${this.nodeId}] Applying command: ${JSON.stringify(entry.command)}`);

            this.emit('command-applied', entry.command);
        }
    }

    /**
     * Reset election timer
     */
    _resetElectionTimer() {
        if (this.electionTimeout) {
            clearTimeout(this.electionTimeout);
        }

        // Random timeout between 150-300ms
        const timeout = 150 + Math.random() * 150;

        this.electionTimeout = setTimeout(() => {
            if (this.state !== 'leader') {
                this._startElection();
            }
        }, timeout);
    }

    /**
     * Set P2P node for network communication
     */
    setP2PNode(p2pNode) {
        this.p2pNode = p2pNode;

        // Subscribe to Raft RPC topics
        if (this.p2pNode) {
            this.p2pNode.subscribe('raft-request-vote', async (data, from) => {
                const response = await this.handleRequestVote(
                    data.candidateId,
                    data.term,
                    data.lastLogIndex,
                    data.lastLogTerm
                );

                // Send response back
                await this.p2pNode.publish(`raft-vote-response-${data.candidateId}`, {
                    from: this.nodeId,
                    ...response
                });
            });

            this.p2pNode.subscribe('raft-append-entries', async (data, from) => {
                const response = await this.handleAppendEntries(
                    data.leaderId,
                    data.term,
                    data.prevLogIndex,
                    data.prevLogTerm,
                    data.entries,
                    data.leaderCommit
                );

                // Send response back
                await this.p2pNode.publish(`raft-append-response-${data.leaderId}`, {
                    from: this.nodeId,
                    ...response
                });
            });
        }
    }

    /**
     * Send RequestVote RPC via P2P
     */
    async _sendRequestVote(peer, request) {
        if (!this.p2pNode) {
            console.warn('[Raft] No P2P node set - cannot send RequestVote');
            return { term: this.currentTerm, voteGranted: false };
        }

        try {
            // Publish vote request
            await this.p2pNode.publish('raft-request-vote', request);

            // Wait for response (with timeout)
            return await new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    resolve({ term: this.currentTerm, voteGranted: false });
                }, 1000); // 1 second timeout

                this.p2pNode.subscribe(`raft-vote-response-${this.nodeId}`, (data, from) => {
                    if (data.from === peer) {
                        clearTimeout(timeout);
                        resolve(data);
                    }
                });
            });
        } catch (err) {
            console.error(`[Raft] Failed to send RequestVote to ${peer}:`, err.message);
            return { term: this.currentTerm, voteGranted: false };
        }
    }

    /**
     * Send AppendEntries RPC via P2P
     */
    async _sendAppendEntries(peer, request) {
        if (!this.p2pNode) {
            console.warn('[Raft] No P2P node set - cannot send AppendEntries');
            return { term: this.currentTerm, success: false };
        }

        try {
            // Publish append entries request
            await this.p2pNode.publish('raft-append-entries', request);

            // Wait for response (with timeout)
            return await new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    resolve({ term: this.currentTerm, success: false });
                }, 1000); // 1 second timeout

                this.p2pNode.subscribe(`raft-append-response-${this.nodeId}`, (data, from) => {
                    if (data.from === peer) {
                        clearTimeout(timeout);
                        resolve(data);
                    }
                });
            });
        } catch (err) {
            console.error(`[Raft] Failed to send AppendEntries to ${peer}:`, err.message);
            return { term: this.currentTerm, success: false };
        }
    }

    stop() {
        if (this.electionTimeout) clearTimeout(this.electionTimeout);
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    }
}

module.exports = RaftNode;
