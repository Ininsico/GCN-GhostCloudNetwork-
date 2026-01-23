import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Layers,
    Cpu,
    Zap,
    Globe,
    ShieldCheck,
    Terminal,
    ChevronRight,
    Star,
    Activity,
    Box
} from 'lucide-react';
import axios from 'axios';

import { getAvailableCompute } from '../api';

const ResourceMarketplace: React.FC = () => {
    const [filter, setFilter] = useState('All');
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAvailableCompute();
    }, []);

    const fetchAvailableCompute = async () => {
        try {
            const data = await getAvailableCompute();
            setOffers(data);
        } catch (err) {
            console.error('Failed to fetch available compute');
        } finally {
            setLoading(false);
        }
    };

    const handleProvision = async (nodeId: string, isParallel: boolean = false) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/compute/provision', {
                nodeId, // Lead node
                taskType: isParallel ? 'Parallel_Compute' : 'AI_Training',
                requirements: {
                    parallelNodes: isParallel ? 3 : 1,
                    gpuRequired: true
                }
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(`COMPUTE_SENSE: ${isParallel ? 'Distributed Parallel' : 'Standard'} Provisioning Initialized. Transaction hash: ${res.data.contract?.tx_hash?.substring(0, 16)}...`);
            fetchAvailableCompute(); // Keep this line to refresh offers after provisioning
        } catch (err: any) {
            console.error('Provisioning failed', err); // Keep console.error for debugging
            alert(`Provisioning failed: ${err.response?.data?.message || 'Network consensus error'}`);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Compute Marketplace</h1>
                    <p className="text-gray-400">Rent high-performance distributed resources at a fraction of cloud costs.</p>
                </div>
                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                    {['All', 'GPU', 'CPU', 'Storage'].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === t ? 'bg-[#39ff14] text-black' : 'text-gray-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Pool */}
            <div className="bg-stone-950 border border-[#39ff14]/30 rounded-3xl p-8 relative overflow-hidden group cursor-pointer shadow-2xl shadow-[#39ff14]/5">
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#39ff14]/10 border border-[#39ff14]/30 rounded-full">
                            <Star size={14} className="text-[#39ff14] fill-current" />
                            <span className="text-[10px] font-bold text-[#39ff14] uppercase tracking-widest">Recommended for AI</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-tighter leading-none">
                            Decentralized <span className="text-[#39ff14]">H100 Pool</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl">
                            Leapfrog traditional cloud limits. Spin up massive parallelization for LLM training
                            directly on distributed Anchor Nodes.
                        </p>
                        <div className="flex items-center gap-8">
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Availability</p>
                                <p className="text-xl font-bold text-white">99.8%</p>
                            </div>
                            <div className="h-10 w-px bg-white/10"></div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Price Start</p>
                                <p className="text-xl font-bold text-[#39ff14]">0.85 ANC/hr</p>
                            </div>
                            <div className="h-10 w-px bg-white/10"></div>
                            <button
                                onClick={() => {
                                    const gpuNode = offers.find(o => o.specs?.gpu && o.specs.gpu !== 'None');
                                    if (gpuNode) handleProvision(gpuNode.nodeId, true);
                                    else alert('No H100 GPU nodes currently available.');
                                }}
                                className="bg-[#39ff14] text-black px-8 py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-tighter"
                            >
                                PROVISION PARALLEL POOL
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 aspect-video bg-black rounded-2xl border border-white/10 p-6 relative overflow-hidden group-hover:border-[#39ff14]/50 transition-colors">
                        <div className="absolute inset-0 bg-[#39ff14]/5 mix-blend-overlay"></div>
                        <div className="flex items-center gap-2 mb-4">
                            <Terminal size={16} className="text-[#39ff14]" />
                            <span className="text-[10px] font-mono text-gray-500">Node Explorer</span>
                        </div>
                        <div className="space-y-3 font-mono text-[10px]">
                            <p className="text-white"><span className="text-[#39ff14]">$</span> anchor pool inspect --id H100-DIST</p>
                            <p className="text-[#39ff14]/60"> {'>'} Verifying 1,248 Node Proofs...</p>
                            <p className="text-[#39ff14]/60"> {'>'} 2.4 PetaFLOPS available</p>
                            <p className="text-[#39ff14]/60"> {'>'} Geo-Distribution: Global (84 countries)</p>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ x: [-200, 400] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="h-full w-20 bg-[#39ff14]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Layers size={400} className="absolute -right-20 -bottom-20 opacity-5 text-[#39ff14] -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
            </div>

            {/* V-APP STORE / GAMING ENGINE */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                        <Box size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Ghost Application Store</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            id: 'gaming-engine',
                            name: 'Cloud Gaming Engine',
                            desc: 'Full GPU Passthrough for AAA Gaming (Tekken 8, Cyberpunk).',
                            image: 'Zap',
                            color: 'text-orange-400',
                            type: 'Gaming'
                        },
                        {
                            id: 'ai-workspace',
                            name: 'AI Model Workspace',
                            desc: 'Pre-configured Jupyter + CUDA for deep learning.',
                            image: 'Cpu',
                            color: 'text-blue-400',
                            type: 'AI_Training'
                        },
                        {
                            id: 'render-farm',
                            name: 'Octane Render Node',
                            desc: 'High-speed 3D rendering for Blender/Cinema4D.',
                            image: 'Layers',
                            color: 'text-[#39ff14]',
                            type: 'Experimental'
                        }
                    ].map(app => (
                        <div key={app.id} className="bg-stone-900/50 border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition-all group relative overflow-hidden">
                            <div className="relative z-10">
                                <div className={`p-4 rounded-2xl bg-black mb-4 w-fit border border-white/5 ${app.color}`}>
                                    {app.image === 'Zap' ? <Zap size={24} /> : app.image === 'Cpu' ? <Cpu size={24} /> : <Layers size={24} />}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{app.name}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed mb-6">{app.desc}</p>

                                <button
                                    onClick={async () => {
                                        const gpuNode = offers.find(o => o.metrics?.ramUsage < 80); // Find a live node
                                        if (!gpuNode) return alert("No nodes available with requested RAM/GPU power.");

                                        try {
                                            const token = localStorage.getItem('token');
                                            await axios.post('http://localhost:5000/api/clusters', {
                                                name: `Ghost-${app.id}`,
                                                provider: 'Self-Hosted',
                                                region: gpuNode.region || 'Auto-Edge',
                                                type: app.type,
                                                requirements: { minRam: '8GB', gpuRequired: true, preferEdge: true }
                                            }, {
                                                headers: { 'Authorization': `Bearer ${token}` }
                                            });
                                            alert(`${app.name} deployment initiated on Node: ${gpuNode.nodeId}. Initializing secure video tunnel...`);
                                        } catch (err: any) {
                                            alert(err.response?.data?.message || "Deployment failed");
                                        }
                                    }}
                                    className="w-full py-3 bg-white/5 hover:bg-white text-gray-400 hover:text-black rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                                >
                                    DEPLOY TO GHOST-NET
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Star size={16} className="text-purple-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="text-white">Scanning market...</div>
                ) : offers.length === 0 ? (
                    <div className="text-gray-500 col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                        No distributed nodes currently available for rent.
                    </div>
                ) : (
                    offers.map((offer) => (
                        <motion.div
                            key={offer._id || offer.id}
                            whileHover={{ y: -8 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#39ff14]/40 transition-all flex flex-col group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl bg-black border border-white/5 text-[#39ff14] group-hover:border-[#39ff14]/30 transition-colors`}>
                                    {offer.specs?.gpu ? <Zap size={24} /> : <Cpu size={24} />}
                                </div>
                                {offer.badge && (
                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-white/5 text-gray-400 group-hover:text-[#39ff14] uppercase tracking-widest border border-white/5">
                                        {offer.badge}
                                    </span>
                                )}
                            </div>


                            <div className="flex-1 mb-6">
                                <h3 className="text-xl font-bold text-white mb-1">{offer.name || 'Distributed Node'}</h3>
                                <p className="text-xs text-gray-500 font-medium line-clamp-1">{offer.specs?.cpu} • {offer.specs?.gpu || 'No GPU'}</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-500 flex items-center gap-1"><Globe size={12} /> {offer.location?.country || 'Global'}</span>
                                    <span className="text-[#39ff14] font-bold">-{offer.metrics?.latency || 10}ms</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px]">
                                        <span className="text-gray-500">Live Hardware Usage</span>
                                        <span className="text-white">{offer.metrics?.cpuUsage || 0}%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className={`h-full ${offer.load > 80 ? 'bg-red-500' : 'bg-[#39ff14]'}`} style={{ width: `${offer.metrics?.cpuUsage || 0}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Rate</p>
                                    <p className="text-lg font-bold text-white tracking-tight">{offer.earnings ? 'PAID' : '0.12 ANC/hr'}</p>
                                </div>
                                <button
                                    onClick={() => handleProvision(offer.nodeId, false)}
                                    className="p-3 bg-white/5 hover:bg-[#39ff14] hover:text-black rounded-2xl transition-all border border-white/5"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Trust factors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#39ff14]/10 flex items-center justify-center text-[#39ff14]">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Smart-Contract Escrow</h4>
                        <p className="text-[10px] text-gray-500">Micropayments only for actual uptime.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Geo-Optimized Routing</h4>
                        <p className="text-[10px] text-gray-500">Matching workloads to nearest nodes.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Workload Failure Redundancy</h4>
                        <p className="text-[10px] text-gray-500">Automatic failover if node goes offline.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceMarketplace;
