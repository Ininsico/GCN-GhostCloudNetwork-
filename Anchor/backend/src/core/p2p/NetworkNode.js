const { createLibp2p } = require('libp2p');
const { tcp } = require('@libp2p/tcp');
const { noise } = require('@chainsafe/libp2p-noise');
const { mplex } = require('@libp2p/mplex');
const { bootstrap } = require('@libp2p/bootstrap');
const { kadDHT } = require('@libp2p/kad-dht');
const { gossipsub } = require('@chainsafe/libp2p-gossipsub');
const { mdns } = require('@libp2p/mdns');
const crypto = require('crypto');

/**
 * P2P NETWORK NODE
 * 
 * Decentralized peer discovery and communication.
 * No central server - nodes find each other via DHT and mDNS.
 * 
 * Features:
 * - Kademlia DHT for peer discovery
 * - GossipSub for cluster state propagation
 * - Noise protocol for encrypted connections
 * - NAT traversal via relay nodes
 */
class NetworkNode {
    constructor(config = {}) {
        this.nodeId = config.nodeId || crypto.randomBytes(32).toString('hex');
        this.port = config.port || 0; // Random port
        this.bootstrapPeers = config.bootstrapPeers || [];
        this.node = null;
        this.topics = new Map();
    }

    async start() {
        this.node = await createLibp2p({
            addresses: {
                listen: [
                    `/ip4/0.0.0.0/tcp/${this.port}`,
                    `/ip4/0.0.0.0/tcp/${this.port + 1}/ws` // WebSocket for browser nodes
                ]
            },
            transports: [tcp()],
            connectionEncryption: [noise()],
            streamMuxers: [mplex()],
            peerDiscovery: [
                mdns({
                    interval: 1000
                }),
                bootstrap({
                    list: this.bootstrapPeers
                })
            ],
            dht: kadDHT({
                clientMode: false,
                kBucketSize: 20
            }),
            pubsub: gossipsub({
                emitSelf: false,
                allowPublishToZeroPeers: true,
                D: 6, // Degree of mesh network
                Dlo: 4,
                Dhi: 12
            }),
            connectionManager: {
                autoDial: true,
                maxConnections: 100,
                minConnections: 10
            }
        });

        await this.node.start();

        const listenAddrs = this.node.getMultiaddrs();
        console.log('[P2P] Node started with ID:', this.node.peerId.toString());
        console.log('[P2P] Listening on:', listenAddrs.map(addr => addr.toString()));

        // Handle peer discovery
        this.node.addEventListener('peer:discovery', (evt) => {
            console.log('[P2P] Discovered peer:', evt.detail.id.toString());
        });

        this.node.addEventListener('peer:connect', (evt) => {
            console.log('[P2P] Connected to peer:', evt.detail.remotePeer.toString());
        });

        this.node.addEventListener('peer:disconnect', (evt) => {
            console.log('[P2P] Disconnected from peer:', evt.detail.remotePeer.toString());
        });

        return this;
    }

    /**
     * Subscribe to a topic (e.g., 'cluster-state', 'task-results')
     */
    async subscribe(topic, handler) {
        if (!this.topics.has(topic)) {
            this.node.pubsub.subscribe(topic);
            this.topics.set(topic, []);
        }

        this.topics.get(topic).push(handler);

        this.node.pubsub.addEventListener('message', (evt) => {
            if (evt.detail.topic === topic) {
                const data = JSON.parse(new TextDecoder().decode(evt.detail.data));
                handler(data, evt.detail.from.toString());
            }
        });
    }

    /**
     * Publish to a topic
     */
    async publish(topic, data) {
        const payload = new TextEncoder().encode(JSON.stringify(data));
        await this.node.pubsub.publish(topic, payload);
    }

    /**
     * Get list of connected peers
     */
    getPeers() {
        return this.node.getPeers().map(peer => peer.toString());
    }

    /**
     * Find peers providing a specific service (via DHT)
     */
    async findProviders(key) {
        const providers = [];
        for await (const provider of this.node.contentRouting.findProviders(key)) {
            providers.push(provider.id.toString());
        }
        return providers;
    }

    /**
     * Announce that this node provides a service
     */
    async provide(key) {
        await this.node.contentRouting.provide(key);
    }

    async stop() {
        await this.node.stop();
        console.log('[P2P] Node stopped');
    }
}

module.exports = NetworkNode;
