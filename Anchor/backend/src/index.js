const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
const podRoutes = require('./routes/podRoutes');
app.use('/api/pods', podRoutes);

// AGENT SOCKET HANDLING
const AnchorNode = require('./models/AnchorNode');
const User = require('./models/User');

io.on('connection', async (socket) => {
    const agentNodeId = socket.handshake.query.nodeId;

    if (agentNodeId) {
        console.log(`[AGENT] Connected: ${agentNodeId}`);
        socket.join(`node_${agentNodeId}`);

        try {
            let node = await AnchorNode.findOne({ nodeId: agentNodeId });
            if (!node) {
                const firstUser = await User.findOne();
                if (firstUser) {
                    node = new AnchorNode({
                        userId: firstUser._id,
                        nodeId: agentNodeId,
                        name: `Node_${agentNodeId.substring(0, 6)}`,
                        specs: { cpu: 'Detecting...', ram: 'Detecting...' },
                        status: 'Online'
                    });
                    await node.save();
                    console.log(`[AUTO-PROVISION] Node registered: ${agentNodeId}`);
                }
            } else {
                node.status = 'Online';
                await node.save();
            }
        } catch (err) {
            console.error('[AGENT] Handshake error:', err.message);
        }

        // Agent metrics
        socket.on('agent_metrics', async (metrics) => {
            try {
                await AnchorNode.findOneAndUpdate(
                    { nodeId: agentNodeId },
                    {
                        metrics: {
                            cpuUsage: metrics.cpuUsage,
                            ramUsage: metrics.ramUsage,
                            ramTotal: metrics.ramTotal,
                            ramUsed: metrics.ramUsed,
                            temp: metrics.temp,
                            uptime: metrics.uptime
                        },
                        hasDocker: metrics.hasDocker,
                        status: 'Online',
                        lastSeen: new Date()
                    }
                );
            } catch (err) {
                console.error('[AGENT] Metrics update failed:', err.message);
            }
        });

        socket.on('disconnect', async () => {
            console.log(`[AGENT] Disconnected: ${agentNodeId}`);
            try {
                await AnchorNode.findOneAndUpdate(
                    { nodeId: agentNodeId },
                    { status: 'Offline' }
                );
            } catch (err) {
                console.error('[AGENT] Disconnect update failed:', err.message);
            }
        });
    }
});

// STARTUP
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/anchor';

async function start() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB connected');

        const scheduler = require('./core/scheduler');
        scheduler.init(io);
        console.log('✅ Scheduler initialized');

        httpServer.listen(PORT, () => {
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🚀 ANCHOR CLOUD - ONLINE');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`🌐 HTTP Server: http://localhost:${PORT}`);
            console.log(`👑 Scheduler: ACTIVE`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        });

    } catch (err) {
        console.error('❌ STARTUP FAILED:', err);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    await mongoose.disconnect();
    process.exit(0);
});

start();

module.exports = { app, httpServer, io };
