import React, { useState, useEffect } from 'react';
import { getNodes, registerNode } from '../api';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import {
    Cpu,
    Terminal,
    Download,
    Plus,
    Activity,
    HardDrive,
    Server,
    AlertCircle,
    CheckCircle2,
    Copy,
    Zap,
    TrendingUp,
    Package
} from 'lucide-react';
import axios from 'axios';
import ScriptRunner from './ScriptRunner';

const AnchorNodes: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [nodes, setNodes] = useState<any[]>([]);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNodes();
        fetchTasks();

        // Connect to websocket for real-time metrics
        const socket = io('http://localhost:5000');

        socket.on('global_network_update', (data) => {
            setNodes(prevNodes => prevNodes.map(node =>
                node.nodeId === data.nodeId ? { ...node, metrics: data.data, status: 'Online' } : node
            ));
        });

        // Listen for task updates
        socket.on('task_updated', (updatedTask) => {
            setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchNodes = async () => {
        try {
            const data = await getNodes();
            setNodes(data);
        } catch (err) {
            console.error('Failed to fetch nodes');
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/tasks', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to fetch tasks');
        }
    };

    const simulateLocalAgent = async () => {
        try {
            const newNodeId = `node-${Math.random().toString(36).substr(2, 5)}`;
            await registerNode({
                nodeId: newNodeId,
                name: `Simulated ${newNodeId}`,
                specs: {
                    cpu: '8 Cores',
                    gpu: 'RTX 3080',
                    ram: '32GB',
                    storage: '1TB'
                }
            });
            fetchNodes();

            // Simulate agent heartbeat via socket
            const agentSocket = io('http://localhost:5000', { query: { nodeId: newNodeId } });
            setInterval(() => {
                agentSocket.emit('agent_metrics', {
                    cpuUsage: Math.floor(Math.random() * 100),
                    ramUsage: Math.floor(Math.random() * 100),
                    gpuUsage: Math.floor(Math.random() * 100),
                    diskUsage: 20
                });
            }, 3000);

            // REAL DISTRIBUTED WORKLOAD ENGINE: Prime Number Sieve/Search
            agentSocket.on('new_task', async (task) => {
                console.log(`[AGENT ${newNodeId}] Ingress Task:`, task);
                const { range_start, range_end } = task.payload;

                // 1. Perform actual computation (finding primes in the given chunk)
                const start = performance.now();
                const primes: number[] = [];

                // Real CPU intensive loop
                for (let i = range_start; i < range_end; i++) {
                    let isPrime = true;
                    if (i < 2) continue;
                    for (let j = 2; j <= Math.sqrt(i); j++) {
                        if (i % j === 0) {
                            isPrime = false;
                            break;
                        }
                    }
                    if (isPrime) primes.push(i);
                }
                const duration = (performance.now() - start) / 1000;

                console.log(`[COMPUTE_READY] Chunk resolved. Found ${primes.length} primes in ${duration.toFixed(2)}s`);

                // 2. Report actual results back to the aggregator
                try {
                    const token = localStorage.getItem('token');
                    await axios.patch(`http://localhost:5000/api/tasks/${task.taskId}/status`, {
                        status: 'Completed',
                        subTaskId: task.subTaskId, // Use subTaskId for parallel aggregation
                        result: {
                            primes_count: primes.length,
                            execution_time: duration,
                            hardware: 'Web_Agent_X1',
                            sample: primes.slice(0, 5)
                        }
                    }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } catch (err) {
                    console.error('Failed to report verified result');
                }
            });

            agentSocket.on('script_deploy', async (payload) => {
                console.log(`[SIM_REX] Executing Script: ${payload.name}`);
                const start = performance.now();
                try {
                    const runner = new Function('console', payload.sourceCode);
                    const logs: string[] = [];
                    const mockConsole = { log: (...args: any[]) => logs.push(args.join(' ')) };
                    runner(mockConsole);
                    const duration = (performance.now() - start) / 1000;
                    const token = localStorage.getItem('token');
                    await axios.patch(`http://localhost:5000/api/tasks/${payload.taskId}/status`, {
                        status: 'Completed',
                        result: { stdout: logs.join('\n'), duration, hardware: 'Simulated_Browser' }
                    }, { headers: { 'Authorization': `Bearer ${token}` } });
                } catch (err: any) {
                    const token = localStorage.getItem('token');
                    await axios.patch(`http://localhost:5000/api/tasks/${payload.taskId}/status`, {
                        status: 'Failed',
                        result: { stderr: err.message }
                    }, { headers: { 'Authorization': `Bearer ${token}` } });
                }
            });

        } catch (err) {
            console.error('Failed to register node');
        }
    };



    const [selectedNodeId, setSelectedNodeId] = useState<string>('');

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Anchor <span className="text-[#39ff14]">Nodes</span></h1>
                    <p className="text-gray-400">Contribute your personal compute and earn network credits.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-lg shadow-[#39ff14]/5">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Credits</p>
                            <p className="text-xl font-bold text-[#39ff14]">1,852.80</p>
                        </div>
                        <div className="w-10 h-10 bg-[#39ff14]/10 rounded-full flex items-center justify-center text-[#39ff14]">
                            <Zap size={20} className="fill-current" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Connection Wizard / Docker Command */}
                <div className="lg:col-span-2 bg-gradient-to-br from-stone-950 to-stone-900 border border-[#39ff14]/20 rounded-3xl p-8 overflow-hidden relative group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-black rounded-xl border border-[#39ff14]/30">
                                <Terminal className="text-[#39ff14]" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Connect Local Hardware</h2>
                                <p className="text-xs text-gray-500">Run the Anchor Agent to link your RAM/CPU to the cloud.</p>
                            </div>
                        </div>

                        <div className="bg-black/80 rounded-2xl p-6 border border-white/10 mb-6 font-mono text-sm relative">
                            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                <span className="text-gray-500 text-xs">Terminal Command (Run in Backend root)</span>
                                <span className="text-[#39ff14] text-[10px] uppercase font-bold px-2 py-0.5 bg-[#39ff14]/10 rounded">Active Engine</span>
                            </div>
                            <p className="text-gray-300 break-all leading-relaxed">
                                <span className="text-[#39ff14]">$</span> node src/agent.js http://localhost:5000
                            </p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText('node src/agent.js http://localhost:5000');
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="absolute top-16 right-6 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                            >
                                {copied ? <CheckCircle2 size={16} className="text-[#39ff14]" /> : <Copy size={16} className="text-gray-400" />}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Node Status', val: 'Direct Link' },
                                { label: 'RAM Mapping', val: 'Kernel Level' },
                                { label: 'Encryption', val: 'AES-256' },
                                { label: 'Auth', val: 'Auto-Handshake' }
                            ].map((spec, i) => (
                                <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{spec.label}</p>
                                    <p className="text-xs text-white font-medium mt-1">{spec.val}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Cpu className="absolute -right-12 -bottom-12 w-64 h-64 text-[#39ff14]/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none" />
                </div>

                {/* Global Stats */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="text-[#39ff14]" size={20} />
                        Network Pulse
                    </h2>
                    <div className="space-y-6 flex-1">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Live Multiplier</p>
                                <p className="text-2xl font-bold text-white">2.4x <span className="text-sm text-[#39ff14]">+12%</span></p>
                            </div>
                            <TrendingUp size={32} className="text-[#39ff14]/20" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Resource Integrity</span>
                                <span className="text-white">99.9%</span>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-[#39ff14] w-[99.9%] h-full" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <div className="flex items-start gap-3 bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
                                <AlertCircle size={18} className="text-blue-400 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-blue-200 leading-relaxed">
                                    <span className="font-bold">Hardware Alert:</span> Running the agent will allow remote execution of signed scripts on your local RAM.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Active Nodes</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {loading && nodes.length === 0 ? (
                            <div className="text-white">Loading nodes...</div>
                        ) : (
                            nodes.map((node) => (
                                <motion.div
                                    key={node._id || node.id}
                                    onClick={() => setSelectedNodeId(node.nodeId)}
                                    whileHover={{ y: -4 }}
                                    className={`bg-white/5 border rounded-2xl p-6 group cursor-pointer transition-all ${selectedNodeId === node.nodeId ? 'border-[#39ff14] shadow-lg shadow-[#39ff14]/10' : 'border-white/10 hover:border-[#39ff14]/30'}`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4">
                                            <div className={`p-3 rounded-xl ${node.status === 'Offline' ? 'bg-white/5 text-gray-500' : 'bg-[#39ff14]/10 text-[#39ff14]'}`}>
                                                <Server size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white group-hover:text-[#39ff14] transition-colors">{node.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${node.status === 'Online' ? 'bg-[#39ff14] animate-pulse' : node.status === 'Syncing' ? 'bg-blue-400 animate-bounce' : node.status === 'Busy' ? 'bg-orange-400' : 'bg-red-500'}`} />
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{node.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Uptime</p>
                                            <p className="text-sm font-bold text-white">{node.metrics?.uptime ? `${Math.floor(node.metrics.uptime / 60)}m` : 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Cpu size={10} className="text-[#39ff14]" />
                                                <span className="text-[8px] text-gray-500 font-bold">CPU</span>
                                            </div>
                                            <p className="text-xs font-bold text-white tracking-tighter">
                                                {node.metrics?.cpuUsage !== undefined ? `${node.metrics.cpuUsage}%` : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Zap size={10} className="text-blue-400" />
                                                <span className="text-[8px] text-gray-500 font-bold">RAM LOAD</span>
                                            </div>
                                            <p className="text-xs font-bold text-white tracking-tighter">
                                                {node.metrics?.ramUsage !== undefined ? `${node.metrics.ramUsage}%` : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-1 mb-1">
                                                <Activity size={10} className="text-purple-400" />
                                                <span className="text-[8px] text-gray-500 font-bold">MEM USED</span>
                                            </div>
                                            <p className="text-xs font-bold text-white tracking-tighter">
                                                {node.metrics?.ramUsed !== undefined ? `${node.metrics.ramUsed}GB` : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-1 mb-1">
                                                <HardDrive size={10} className="text-orange-400" />
                                                <span className="text-[8px] text-gray-500 font-bold">TEMP</span>
                                            </div>
                                            <p className="text-xs font-bold text-white tracking-tighter">
                                                {node.metrics?.temp ? `${node.metrics.temp}°C` : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                        <button
                            onClick={simulateLocalAgent}
                            className="border-2 border-dashed border-white/5 rounded-2xl p-4 flex items-center justify-center gap-3 hover:border-[#39ff14]/30 hover:bg-[#39ff14]/5 transition-all text-gray-600 hover:text-[#39ff14] text-xs font-bold group"
                        >
                            <Plus size={16} />
                            SIMULATE VIRTUAL NODE
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Task Aggregator</h2>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 min-h-[400px]">
                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
                                <Activity size={48} className="opacity-10 mb-4" />
                                <p className="text-xs font-bold uppercase tracking-widest">Hydration Pending</p>
                                <p className="text-[10px] opacity-50 text-center max-w-[200px] mt-2 italic">Waiting for hardware-level signals from the REX engine...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tasks.slice(0, 8).map((task) => (
                                    <div key={task._id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex justify-between items-center group">
                                        <div className="flex gap-4 items-center">
                                            <div className={`p-2 rounded-lg bg-white/5 ${task.status === 'Processing' ? 'text-[#39ff14]' : 'text-gray-500'}`}>
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white truncate max-w-[120px]">{task.name}</p>
                                                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">{task.nodeId || 'PENDING'} • {task.type}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${task.status === 'Completed' ? 'bg-blue-500/10 text-blue-400' : task.status === 'Failed' ? 'bg-red-500/10 text-red-500' : 'bg-[#39ff14]/10 text-[#39ff14] animate-pulse'}`}>
                                                {task.status}
                                            </span>
                                            <p className="text-[10px] text-gray-600 font-mono mt-1">
                                                {task.status === 'Completed' ? 'VERIFIED' : 'ACTIVE_SENSE'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ScriptRunner nodeId={selectedNodeId} />
        </div>
    );
};

export default AnchorNodes;
