const io = require('socket.io-client');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const si = require('systeminformation');
const crypto = require('crypto');

/**
 * ANCHOR CONSOLIDATED AGENT
 * Run this to contribute your PC's power to the Anchor Network.
 * Usage: node src/agent.js [BACKEND_URL]
 */

const BACKEND_URL = process.argv[2] || 'http://localhost:5000';
const NODE_ID = `REX-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
const WORK_DIR = path.join(process.cwd(), 'anchor_runtime');

async function startAgent() {
    console.clear();
    console.log(`[ANCHOR] Initiating Hardware-Level Connection: ${NODE_ID}`);

    const socket = io(BACKEND_URL, {
        query: { nodeId: NODE_ID }
    });

    socket.on('connect', () => {
        console.log(`[ONLINE] Handshake successful with ${BACKEND_URL}`);

        // Start Hardware Metric Pulse
        setInterval(async () => {
            const cpu = await si.currentLoad();
            const mem = await si.mem();
            socket.emit('agent_metrics', {
                cpuUsage: Math.round(cpu.currentLoad),
                ramUsage: Math.round((mem.active / mem.total) * 100),
                temp: (await si.cpuTemperature()).main || 0,
                uptime: process.uptime()
            });
        }, 2000);
    });

    // 🚀 THE REX ENGINE: Handling Custom Scripts + Dependencies
    socket.on('script_deploy', async (payload) => {
        const { taskId, name, sourceCode, dependencies, env } = payload;
        console.log(`\n[REX] INGRESS: Executing "${name}"...`);

        const taskDir = path.join(WORK_DIR, taskId);
        await fs.ensureDir(taskDir);

        // 写源码
        await fs.writeFile(path.join(taskDir, 'index.js'), sourceCode);

        // 处理核心依赖
        if (dependencies?.length > 0) {
            console.log(`[REX] Resolving Dependencies: ${dependencies.join(', ')}`);
            await fs.writeJson(path.join(taskDir, 'package.json'), {
                dependencies: dependencies.reduce((a, d) => ({ ...a, [d]: 'latest' }), {})
            });

            await new Promise((res) => {
                exec('npm install', { cwd: taskDir }, () => res());
            });
        }

        const start = Date.now();
        console.log(`[REX] Launching Kernel Thread...`);

        exec('node index.js', {
            cwd: taskDir,
            env: { ...process.env, ...env },
            timeout: 60000
        }, async (err, stdout, stderr) => {
            const result = {
                stdout,
                stderr,
                duration: (Date.now() - start) / 1000,
                exitCode: err ? 1 : 0
            };

            console.log(`[REX] Execution complete. Result sync pending...`);

            try {
                // Return result to Backend
                await axios.patch(`${BACKEND_URL}/api/tasks/${taskId}/status`, {
                    status: err ? 'Failed' : 'Completed',
                    result
                });
                console.log(`[REX] Sync Complete.`);
            } catch (fail) {
                console.error(`[REX] Sync Failed to Backend.`);
            }

            // Cleanup physical disk traces
            await fs.remove(taskDir);
        });
    });

    socket.on('disconnect', () => console.log('\n[OFFLINE] Connection timed out.'));
}

startAgent().catch(console.error);
