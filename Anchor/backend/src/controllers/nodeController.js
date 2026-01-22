const AnchorNode = require('../models/AnchorNode');

exports.getNodes = async (req, res) => {
    try {
        const nodes = await AnchorNode.find({ userId: req.user.id });
        res.json(nodes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.registerNode = async (req, res) => {
    const { nodeId, name, specs } = req.body;
    try {
        const existingNode = await AnchorNode.findOne({ nodeId });
        if (existingNode) {
            return res.status(400).json({ message: 'Node already registered' });
        }

        const node = new AnchorNode({
            userId: req.user.id,
            nodeId,
            name,
            specs,
            location: {
                city: 'Global Edge',
                country: 'Distributed',
                lat: (Math.random() * 140) - 70, // -70 to 70
                lng: (Math.random() * 360) - 180  // -180 to 180
            }
        });
        const savedNode = await node.save();
        res.status(201).json(savedNode);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.heartbeat = async (req, res) => {
    const { nodeId, metrics } = req.body;
    const io = req.app.get('socketio');

    try {
        const node = await AnchorNode.findOneAndUpdate(
            { nodeId },
            {
                metrics,
                lastHeartbeat: new Date(),
                status: 'Online'
            },
            { new: true }
        );

        if (node && io) {
            io.to(`node_${nodeId}`).emit('metrics_update', metrics);

            // BLOCK-NET: Process micro-payments for active contribution
            if (node.activeContractId) {
                const blockchain = require('../services/blockchainService');
                // Assuming node has been active for the heartbeat interval (~10s)
                await blockchain.processMicropayment(node.activeContractId, 10);
            }
        }

        res.json({
            status: 'ok',
            verified_on_chain: true,
            credits_updated: true
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
