const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// MongoDB Models
const NodeSchema = new mongoose.Schema({
    nodeId: String,
    status: String,
    cpuUsage: Number,
    ramUsage: Number,
    ramTotal: Number,
    lastSeen: Date
});
const Node = mongoose.model('Node', NodeSchema);

const PodSchema = new mongoose.Schema({
    name: String,
    image: String,
    command: [String],
    status: String,
    nodeId: String,
    createdAt: { type: Date, default: Date.now }
});
const Pod = mongoose.model('Pod', PodSchema);

// API: Create Pod
app.post('/api/pods', async (req, res) => {
    try {
        const { name, image, command } = req.body;
        const pod = await Pod.create({ name, image, command, status: 'Pending' });

        // Find available node
        const node = await Node.findOne({ status: 'Online' }).sort({ cpuUsage: 1 });
        if (node) {
            pod.status = 'Scheduled';
            pod.nodeId = node.nodeId;
            await pod.save();

            // Send to agent
            io.to(`node_${node.nodeId}`).emit('pod_start', {
                podId: pod._id,
                name: pod.name,
                image: pod.image,
                command: pod.command
            });
        }

        res.json(pod);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Get Pods
app.get('/api/pods', async (req, res) => {
    const pods = await Pod.find().sort({ createdAt: -1 });
    res.json(pods);
});

// API: Update Pod Status
app.patch('/api/pods/:id/status', async (req, res) => {
    const { status, exitCode } = req.body;
    const pod = await Pod.findByIdAndUpdate(req.params.id, { status, exitCode }, { new: true });
    res.json(pod);
});

// API: Get Nodes
app.get('/api/nodes', async (req, res) => {
    const nodes = await Node.find();
    res.json(nodes);
});

// Socket.io: Agent Connection
io.on('connection', (socket) => {
    const nodeId = socket.handshake.query.nodeId;
    if (!nodeId) return;

    console.log(`[AGENT] Connected: ${nodeId}`);
    socket.join(`node_${nodeId}`);

    // Register node
    Node.findOneAndUpdate(
        { nodeId },
        { nodeId, status: 'Online', lastSeen: new Date() },
        { upsert: true }
    ).exec();

    // Receive metrics
    socket.on('agent_metrics', async (metrics) => {
        await Node.findOneAndUpdate(
            { nodeId },
            {
                cpuUsage: metrics.cpuUsage,
                ramUsage: metrics.ramUsage,
                ramTotal: metrics.ramTotal,
                status: 'Online',
                lastSeen: new Date()
            }
        );
    });

    socket.on('disconnect', () => {
        console.log(`[AGENT] Disconnected: ${nodeId}`);
        Node.findOneAndUpdate({ nodeId }, { status: 'Offline' }).exec();
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/anchor';

mongoose.connect(MONGO_URI).then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
        console.log(`\n🚀 ANCHOR CLOUD - http://localhost:${PORT}\n`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
});
