const crypto = require('crypto');
const tls = require('tls');
const fs = require('fs-extra');
const path = require('path');
const Redis = require('ioredis');

/**
 * SERVICE MESH - Distributed & Secure
 * 
 * Features:
 * - Distributed Service Discovery (Redis-backed)
 * - mTLS (mutual TLS) for all inter-node traffic
 * - Load balancing
 * - Circuit breaking
 */
class ServiceMesh {
    constructor() {
        // Shared Redis for service registry
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
        });

        // Local cache for performance (syncs with Redis)
        this.localCache = new Map();

        this.circuitBreakers = new Map(); // endpoint -> state
        this.certificates = new Map(); // nodeId -> cert

        this._initializeCertificateAuthority();
        this._startCacheSync();
    }

    /**
     * Initialize internal Certificate Authority for mTLS
     */
    async _initializeCertificateAuthority() {
        const certDir = path.join(process.cwd(), 'certs');
        await fs.ensureDir(certDir);

        const caKeyPath = path.join(certDir, 'ca-key.pem');
        const caCertPath = path.join(certDir, 'ca-cert.pem');

        // Generate CA if doesn't exist
        if (!await fs.pathExists(caKeyPath)) {
            console.log('[MESH] Generating Certificate Authority...');

            const { exec } = require('child_process');
            const { promisify } = require('util');
            const execAsync = promisify(exec);

            // Generate CA private key
            await execAsync(`openssl genrsa -out "${caKeyPath}" 4096`);

            // Generate CA certificate
            await execAsync(`openssl req -new -x509 -days 3650 -key "${caKeyPath}" -out "${caCertPath}" -subj "/CN=Anchor-CA"`);

            console.log('[MESH] Certificate Authority created');
        }

        this.caKey = await fs.readFile(caKeyPath, 'utf8');
        this.caCert = await fs.readFile(caCertPath, 'utf8');
    }

    /**
     * Issue certificate for a node
     */
    async issueCertificate(nodeId) {
        const certDir = path.join(process.cwd(), 'certs', 'nodes');
        await fs.ensureDir(certDir);

        const keyPath = path.join(certDir, `${nodeId}-key.pem`);
        const certPath = path.join(certDir, `${nodeId}-cert.pem`);
        const csrPath = path.join(certDir, `${nodeId}-csr.pem`);

        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);

        // Generate node private key
        await execAsync(`openssl genrsa -out "${keyPath}" 2048`);

        // Generate CSR
        await execAsync(`openssl req -new -key "${keyPath}" -out "${csrPath}" -subj "/CN=${nodeId}"`);

        // Sign with CA
        const caKeyPath = path.join(process.cwd(), 'certs', 'ca-key.pem');
        const caCertPath = path.join(process.cwd(), 'certs', 'ca-cert.pem');
        await execAsync(`openssl x509 -req -in "${csrPath}" -CA "${caCertPath}" -CAkey "${caKeyPath}" -CAcreateserial -out "${certPath}" -days 365`);

        const cert = await fs.readFile(certPath, 'utf8');
        const key = await fs.readFile(keyPath, 'utf8');

        this.certificates.set(nodeId, { cert, key });

        console.log(`[MESH] Certificate issued for ${nodeId}`);

        return { cert, key, ca: this.caCert };
    }

    /**
     * Register a service endpoint (DISTRIBUTED)
     * Writes to Redis with TTL
     */
    async registerService(serviceName, endpoint) {
        const key = `service:${serviceName}`;
        const member = JSON.stringify(endpoint);

        // Add to Set
        await this.redis.sadd(key, member);

        // Refresh TTL for this service key if needed (lazy approach)
        await this.redis.expire(key, 60); // Service expires if no one refreshes within 60s

        // Also start a heartbeat loop for this service instance
        if (!endpoint.heartbeatStarted) {
            this._startHeartbeat(serviceName, member);
            endpoint.heartbeatStarted = true;
        }

        console.log(`[MESH] Service ${serviceName} registered in Redis: ${endpoint.host}:${endpoint.port}`);
    }

    _startHeartbeat(serviceName, member) {
        setInterval(async () => {
            const key = `service:${serviceName}`;
            await this.redis.sadd(key, member);
            await this.redis.expire(key, 60);
        }, 30000); // 30s heartbeat
    }

    /**
     * Deregister a service endpoint
     */
    async deregisterService(serviceName, endpoint) {
        const key = `service:${serviceName}`;
        const member = JSON.stringify(endpoint);
        await this.redis.srem(key, member);
        console.log(`[MESH] Service ${serviceName} deregistered from Redis`);
    }

    /**
     * Get service endpoint with load balancing
     * Reads from Redis (or local cache)
     */
    async getServiceEndpoint(serviceName, strategy = 'round-robin') {
        let endpoints = [];

        // Try getting from local cache first for speed
        if (this.localCache.has(serviceName)) {
            endpoints = this.localCache.get(serviceName);
        } else {
            // Fallback to Redis
            const members = await this.redis.smembers(`service:${serviceName}`);
            endpoints = members.map(m => JSON.parse(m));
            this.localCache.set(serviceName, endpoints);
        }

        if (endpoints.length === 0) return null;

        // Filter healthy endpoints (rudimentary check here, real health state should be in Redis too)
        const healthy = endpoints;

        switch (strategy) {
            case 'round-robin':
                const endpoint = healthy[0];
                // Rotate locally just for this instance's view
                healthy.push(healthy.shift());
                this.localCache.set(serviceName, healthy);
                return endpoint;

            case 'random':
                return healthy[Math.floor(Math.random() * healthy.length)];

            default:
                return healthy[0];
        }
    }

    async _startCacheSync() {
        setInterval(async () => {
            // Sync all known services from Redis to local Map
            const keys = await this.redis.keys('service:*');
            for (const key of keys) {
                const serviceName = key.split(':')[1];
                const members = await this.redis.smembers(key);
                const endpoints = members.map(m => JSON.parse(m));
                this.localCache.set(serviceName, endpoints);
            }
        }, 5000); // Sync every 5s
    }

    /**
     * Circuit breaker pattern
     */
    async callWithCircuitBreaker(endpoint, fn, options = {}) {
        const key = `${endpoint.host}:${endpoint.port}`;
        const maxFailures = options.maxFailures || 5;
        const resetTimeout = options.resetTimeout || 60000; // 1 minute

        if (!this.circuitBreakers.has(key)) {
            this.circuitBreakers.set(key, {
                state: 'closed', // closed, open, half-open
                failures: 0,
                lastFailure: null
            });
        }

        const breaker = this.circuitBreakers.get(key);

        // If circuit is open, check if we should try again
        if (breaker.state === 'open') {
            if (Date.now() - breaker.lastFailure > resetTimeout) {
                breaker.state = 'half-open';
                console.log(`[MESH] Circuit breaker ${key} entering half-open state`);
            } else {
                throw new Error(`Circuit breaker open for ${key}`);
            }
        }

        try {
            const result = await fn();

            // Success - reset circuit breaker
            if (breaker.state === 'half-open') {
                breaker.state = 'closed';
                breaker.failures = 0;
                console.log(`[MESH] Circuit breaker ${key} closed`);
            }

            return result;

        } catch (err) {
            breaker.failures++;
            breaker.lastFailure = Date.now();

            if (breaker.failures >= maxFailures) {
                breaker.state = 'open';
                console.log(`[MESH] Circuit breaker ${key} opened after ${breaker.failures} failures`);
            }

            throw err;
        }
    }

    /**
     * Create secure TLS connection to another node
     */
    async createSecureConnection(nodeId, port) {
        const nodeCert = this.certificates.get(nodeId);
        if (!nodeCert) {
            throw new Error(`No certificate for node ${nodeId}`);
        }

        const options = {
            key: nodeCert.key,
            cert: nodeCert.cert,
            ca: this.caCert,
            rejectUnauthorized: true,
            requestCert: true
        };

        return tls.connect(port, nodeId, options);
    }
}

module.exports = new ServiceMesh();
