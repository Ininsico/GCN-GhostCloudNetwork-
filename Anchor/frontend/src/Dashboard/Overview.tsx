import React from 'react';
import { motion } from 'framer-motion';
import {
    Server,
    Cpu,
    Activity,
    Zap,
    ShieldCheck,
    TrendingUp,
    Globe
} from 'lucide-react';
import axios from 'axios';

import { getClusters, getNodes } from '../api';
import SystemTerminal from './SystemTerminal';

const Overview: React.FC = () => {
    const [clusterCount, setClusterCount] = React.useState(0);
    const [nodeCount, setNodeCount] = React.useState(0);
    const [credits, setCredits] = React.useState(0);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [clusters, nodes, userRes] = await Promise.all([
                    getClusters(),
                    getNodes(),
                    axios.get('http://localhost:5000/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                setClusterCount(clusters.length);
                setNodeCount(nodes.length);
                setCredits(userRes.data.credits);
            } catch (err) {
                console.error("Failed to fetch overview data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { label: 'Active Clusters', value: loading ? '...' : clusterCount.toString(), icon: Server, color: '#39ff14', growth: '+2' },
        { label: 'Anchor Nodes', value: loading ? '...' : nodeCount.toString(), icon: Cpu, color: '#39ff14', growth: '+15' },
        { label: 'Uptime', value: '99.99%', icon: Activity, color: '#39ff14', growth: '0%' },
        { label: 'Credits Earned', value: loading ? '...' : credits.toLocaleString(), icon: Zap, color: '#39ff14', growth: '+42.5%' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
                <p className="text-gray-400">Real-time status of your decentralized infrastructure.</p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#39ff14]/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-black rounded-xl border border-white/5 group-hover:border-[#39ff14]/50 transition-colors">
                                <stat.icon size={24} className="text-[#39ff14]" />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded bg-[#39ff14]/10 text-[#39ff14]`}>
                                {stat.growth}
                            </span>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart Placeholder */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-[300px] relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="text-[#39ff14] w-5 h-5" />
                                Resource Allocation
                            </h2>
                            <div className="flex gap-2">
                                {['24H', '7D', '30D'].map(t => (
                                    <button key={t} className="text-[10px] font-bold px-3 py-1 rounded bg-white/5 text-gray-400 hover:text-[#39ff14] transition-colors">
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Faked Chart Visualization */}
                        <div className="absolute inset-x-0 bottom-0 top-24 p-8 flex items-end gap-1">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-[#39ff14]/20 hover:bg-[#39ff14] transition-all rounded-t-sm"
                                    style={{ height: `${Math.random() * 80 + 20}%` }}
                                />
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                    </div>

                    <div className="bg-stone-900 border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-6 text-white">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Server size={18} className="text-[#39ff14]" />
                                Active Ghost Workloads
                            </h2>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2 py-1 bg-white/5 rounded">Live Tunnel Status</span>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-gray-500 italic text-xs">Scanning network...</div>
                            ) : (
                                // This would ideally map over a 'clusters' state, adding a simple mock for now
                                [1, 2].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-[#39ff14]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl text-gray-500 group-hover:text-[#39ff14] transition-colors relative">
                                                <Zap size={18} />
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#39ff14] rounded-full animate-pulse" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-white text-sm">Ghost-Gaming-{i === 0 ? 'X9' : 'B2'}</h4>
                                                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold uppercase tracking-tighter">Native NGR</span>
                                                </div>
                                                <p className="text-[10px] text-gray-500 font-mono">
                                                    Signal: <span className="text-[#39ff14]">2ms</span> • P2P Tunnel: <span className="text-white">Active</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => alert("Connecting to Native Ghost Runtime via P2P Tunnel...")}
                                            className="px-4 py-2 bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 rounded-lg text-[10px] font-bold uppercase tracking-tighter hover:bg-[#39ff14] hover:text-black transition-all"
                                        >
                                            OPEN STREAM
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Recent Events -> System Terminal */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-1"
                >
                    <SystemTerminal />
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#39ff14] to-emerald-800 rounded-2xl p-6 text-black flex items-center justify-between overflow-hidden relative group cursor-pointer">
                    <div className="z-10">
                        <h3 className="font-bold text-lg leading-tight mb-1">Anchor Node Agent</h3>
                        <p className="text-sm opacity-80 mb-4">Install on your device and start earning credits.</p>
                        <button className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform">
                            DOWNLOAD NOW
                        </button>
                    </div>
                    <Cpu size={120} className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 group hover:border-blue-500/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Global Routing</h3>
                            <p className="text-xs text-gray-500">Latency-aware workload distribution.</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-white tracking-tighter">14 <span className="text-xs text-gray-500">Regions</span></div>
                        <button className="text-blue-400 text-xs font-bold hover:underline">Manage Map</button>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 group hover:border-[#39ff14]/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-[#39ff14]/10 rounded-xl text-[#39ff14]">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Advanced Shield</h3>
                            <p className="text-xs text-gray-500">DDoS Protection & SSL Automation.</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="text-2xl font-bold text-white tracking-tighter">Active</div>
                        <button className="text-[#39ff14] text-xs font-bold hover:underline">Settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
