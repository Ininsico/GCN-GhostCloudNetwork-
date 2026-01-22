const Cluster = require('../models/Cluster');
const orchestrator = require('../services/orchestrator');

exports.getClusters = async (req, res) => {
    try {
        const clusters = await Cluster.find({ userId: req.user.id });
        res.json(clusters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCluster = async (req, res) => {
    const { name, provider, region, type, requirements } = req.body;

    try {
        const newCluster = new Cluster({
            userId: req.user.id,
            name,
            provider,
            region,
            type,
            status: 'Healthy'
        });

        // HYBRID CLOUD LOGIC: Professional Cloud vs Distributed Nodes
        if (provider === 'Self-Hosted' || requirements?.preferEdge) {
            console.log(`[LOGIC] Routing requested cluster "${name}" to decentralized pool...`);

            const optimalNode = await orchestrator.selectOptimalNode(requirements || { minRam: '2GB' });

            if (!optimalNode) {
                return res.status(503).json({ message: 'No available Anchor Nodes match your requirements.' });
            }

            // BLOCK-NET: Verify and lock resources on the distributed ledger
            const blockchain = require('../services/blockchainService');
            const contract = await blockchain.createAllocationContract(
                req.user.id,
                optimalNode.userId,
                requirements || optimalNode.specs,
                0.10
            );

            // Deploy to the specific agent
            await orchestrator.deployToNode(newCluster._id, optimalNode.nodeId, req.io);

            newCluster.endpoint = `ws://${optimalNode.nodeId}.edge.anchor.network:8080`;
            newCluster.status = 'Healthy'; // In real system might be 'Provisioning'
        } else {
            // Professional Cloud Provisioning + Automated SSL
            const security = require('../utils/securityEngine');
            const ssl = await security.provisionSSL(`${name.toLowerCase().replace(/\s+/g, '-')}.${provider.toLowerCase()}.anchor.dev`);

            newCluster.endpoint = `wss://${name.toLowerCase().replace(/\s+/g, '-')}.${provider.toLowerCase()}.anchor.dev`;
        }

        const savedCluster = await newCluster.save();
        res.status(201).json(savedCluster);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.exportTerraform = async (req, res) => {
    try {
        const cluster = await Cluster.findById(req.params.id);
        if (!cluster) return res.status(404).json({ message: 'Cluster not found' });

        const TerraformExporter = require('../utils/terraformExporter');
        const config = TerraformExporter.generateClusterConfig(cluster);

        res.setHeader('Content-Type', 'text/plain');
        res.send(config);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCluster = async (req, res) => {
    try {
        await Cluster.findByIdAndDelete(req.params.id);
        res.json({ message: 'Cluster deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
