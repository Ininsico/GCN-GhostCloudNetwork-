const io = require('socket.io-client');
const { exec } = require('child_process');
const si = require('systeminformation');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

const BACKEND_URL = process.argv[2] || 'http://localhost:5000';
const NODE_ID = `NODE-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
const WORK_DIR = path.join(process.cwd(), 'anchor_pods');

console.log(`[ANCHOR AGENT] Starting: ${NODE_ID}`);
console.log(`[ANCHOR AGENT] Connecting to: ${BACKEND_URL}\n`);

const socket = io(BACKEND_URL, { query: { nodeId: NODE_ID } });

socket.on('connect', () => {
    console.log(`✅ Connected to backend\n`);

    // Send metrics every 3 seconds
    setInterval(async () => {
        const cpu = await si.currentLoad();
        const mem = await si.mem();

        socket.emit('agent_metrics', {
            cpuUsage: Math.round(cpu.currentLoad),
            ramUsage: Math.round((mem.active / mem.total) * 100),
            ramTotal: Math.round(mem.total / (1024 * 1024 * 1024))
        });
    }, 3000);
});

socket.on('pod_start', async (pod) => {
    console.log(`\n[POD] Starting: ${pod.name}`);
    console.log(`[POD] Image: ${pod.image}`);

    try {
        const podDir = path.join(WORK_DIR, pod.podId);
        await fs.ensureDir(podDir);

        let proc;

        if (pod.image.includes('node')) {
            // Node.js workload
            const script = pod.command ? pod.command.join('\n') : 'console.log("Hello from Anchor!");';
            await fs.writeFile(path.join(podDir, 'index.js'), script);

            proc = exec('node index.js', { cwd: podDir });
        } else if (pod.image.includes('python')) {
            // Python workload
            const script = pod.command ? pod.command.join('\n') : 'print("Hello from Anchor!")';
            await fs.writeFile(path.join(podDir, 'main.py'), script);

            proc = exec('python main.py', { cwd: podDir });
        } else {
            throw new Error('Unsupported image type');
        }

        proc.stdout.on('data', (data) => {
            console.log(`[POD ${pod.name}] ${data.toString().trim()}`);
        });

        proc.stderr.on('data', (data) => {
            console.error(`[POD ${pod.name}] ERROR: ${data.toString().trim()}`);
        });

        proc.on('exit', async (code) => {
            console.log(`[POD] ${pod.name} exited with code ${code}\n`);

            // Report back to backend
            const axios = require('axios');
            await axios.patch(`${BACKEND_URL}/api/pods/${pod.podId}/status`, {
                status: code === 0 ? 'Completed' : 'Failed',
                exitCode: code
            });

            // Cleanup
            await fs.remove(podDir);
        });

    } catch (err) {
        console.error(`[POD] Failed to start: ${err.message}\n`);

        const axios = require('axios');
        await axios.patch(`${BACKEND_URL}/api/pods/${pod.podId}/status`, {
            status: 'Failed',
            error: err.message
        });
    }
});

socket.on('disconnect', () => {
    console.log('\n❌ Disconnected from backend\n');
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down agent...\n');
    socket.disconnect();
    process.exit(0);
});
