const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

/**
 * CORE ANCHOR HYBRID CLOUD SERVER
 */
const app = express();
const httpServer = createServer(app); // REAL HTTP SERVER CREATION

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const security = require('./utils/securityEngine');
const blockchain = require('./services/blockchainService');

// GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(security.ddosMitigator.bind(security)); // ACTIVATED DDOS MITIGATION
app.use((req, res, next) => {
    req.io = io; // Attach socket to request
    next();
});
app.set('socketio', io); // Set for global access via app.get('socketio')

// RESOURCE DISTRIBUTION ENGINE (Sharing Logic)
const orchestrator = require('./services/orchestrator');

// ROUTES
const authRoutes = require('./routes/authRoutes');
const clusterRoutes = require('./routes/clusterRoutes');
const nodeRoutes = require('./routes/nodeRoutes');
const computeRoutes = require('./routes/computeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dagRoutes = require('./routes/dag');

app.use('/api/auth', authRoutes);
app.use('/api/clusters', clusterRoutes);
app.use('/api/nodes', nodeRoutes);
app.use('/api/compute', computeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dag', dagRoutes);

// WEBSOCKET LOGIC FOR AGENTS (Real-time Resource Sharing)
io.on('connection', async (socket) => {
    const nodeId = socket.handshake.query.nodeId;

    if (nodeId) {
        console.log(`[AGENT ATTEMPT] Node: ${nodeId}`);
        socket.join(`node_${nodeId}`);

        // Ensure node exists in database (Auto-provision for dev)
        const AnchorNode = require('./models/AnchorNode');
        const User = require('./models/User');

        try {
            let node = await AnchorNode.findOne({ nodeId });
            if (!node) {
                const firstUser = await User.findOne(); // Assign to first user for dev
                if (firstUser) {
                    node = new AnchorNode({
                        userId: firstUser._id,
                        nodeId,
                        name: `Real_Node_${nodeId.substring(0, 4)}`,
                        specs: { cpu: 'Detecting...', ram: 'Detecting...' }
                    });
                    await node.save();
                    console.log(`[AUTO-PROVISION] Real Hardware Registered: ${nodeId}`);
                }
            }
        } catch (err) {
            console.error('Handshake Error:', err.message);
        }

        // Listen for real resource metrics from Anchor Agent
        socket.on('agent_metrics', async (data) => {
            const AnchorNode = require('./models/AnchorNode');
            await AnchorNode.findOneAndUpdate(
                { nodeId },
                { metrics: data, lastHeartbeat: new Date(), status: 'Online' }
            );
            io.emit('global_network_update', { nodeId, data });
        });

        // 🎮 V-APP PROVISIONING SYNC: When a node finishes spawning a container
        socket.on('provision_response', async (res) => {
            console.log(`[SYNC] Node ${nodeId} reported provision status: ${res.success ? 'SUCCESS' : 'FAIL'}`);
            if (res.success) {
                const Cluster = require('./models/Cluster');
                await Cluster.findOneAndUpdate(
                    { nodeId: nodeId, status: 'Scaling' },
                    { status: 'Healthy', endpoint: res.endpoint }
                );
            }
        });
    }

    socket.on('disconnect', () => {
        console.log('Client/Agent disconnected');
    });
});

// STARTUP
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/anchor';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('--- ANCHOR BACKEND INITIALIZED ---');
        console.log(`Database: Connected to MongoDB`);
        httpServer.listen(PORT, () => {
            console.log(`Server: Operational on port ${PORT}`);
            console.log(`Orchestrator: Intelligent Routing Active`);
        });
    })
    .catch(err => {
        console.error('CRITICAL STARTUP ERROR:', err);
    });

module.exports = { app, httpServer, io };
