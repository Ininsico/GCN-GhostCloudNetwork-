import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Server,
    Cloud,
    Activity,
    Settings,
    Database,
    Gamepad2,
    MessageSquare,
    Cpu,
    Search,
    MoreVertical,
    ExternalLink,
    ChevronRight,
    Monitor
} from 'lucide-react';

import { getClusters, createCluster } from '../api';

const WebSocketManager: React.FC = () => {
    const [showWizard, setShowWizard] = useState(false);
    const [clusters, setClusters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClusters();
    }, []);

    const fetchClusters = async () => {
        try {
            const data = await getClusters(); // Assuming getClusters already returns the data directly
            setClusters(data);
        } catch (err) {
            console.error('Failed to fetch clusters');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCluster = async (template: any) => {
        try {
            await createCluster({
                name: `${template.title} Cluster`,
                provider: 'AWS', // Default for now
                region: 'us-east-1',
                type: template.title.includes('Chat') ? 'Messaging' : 'Gaming'
            });
            fetchClusters();
            setShowWizard(false);
        } catch (err) {
            console.error('Failed to create cluster');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">WebSocket Clusters</h1>
                    <p className="text-gray-400">Manage your real-time infrastructure across multiple providers.</p>
                </div>
                <button
                    onClick={() => setShowWizard(true)}
                    className="flex items-center gap-2 bg-[#39ff14] text-black px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#39ff14]/20"
                >
                    <Plus size={20} />
                    CREATE CLUSTER
                </button>
            </div>

            <div className="flex gap-4 mb-8">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#39ff14] transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search clusters by name, type or region..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/10 transition-all font-medium"
                    />
                </div>
                <div className="flex border border-white/10 rounded-xl overflow-hidden p-1 bg-white/5">
                    <button className="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-lg transition-colors">ALL</button>
                    <button className="px-4 py-2 text-gray-500 hover:text-white text-xs font-bold transition-colors">AWS</button>
                    <button className="px-4 py-2 text-gray-500 hover:text-white text-xs font-bold transition-colors">GCP</button>
                    <button className="px-4 py-2 text-gray-500 hover:text-white text-xs font-bold transition-colors">LOCAL</button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-white">Loading clusters...</div>
                ) : (
                    clusters.map((cluster) => (
                        <motion.div
                            key={cluster._id || cluster.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all flex flex-wrap lg:flex-nowrap items-center gap-8 group"
                        >
                            <div className="w-14 h-14 bg-black rounded-2xl border border-white/10 flex items-center justify-center text-[#39ff14] group-hover:border-[#39ff14]/30 transition-colors shadow-inner">
                                {cluster.type === 'Messaging' && <MessageSquare size={24} />}
                                {cluster.type === 'Gaming' && <Gamepad2 size={24} />}
                                {cluster.type === 'IoT' && <Database size={24} />}
                                {cluster.type === 'Experimental' && <Cpu size={24} />}
                            </div>

                            <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#39ff14] transition-colors">{cluster.name}</h3>
                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 font-mono">{cluster.id}</span>
                                </div>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <Cloud size={14} /> {cluster.provider} • <Monitor size={14} /> {cluster.region}
                                </p>
                            </div>

                            <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity size={14} className="text-gray-500" />
                                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Health Status</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden max-w-[150px]">
                                        <div
                                            className={`h-full ${cluster.status === 'Healthy' ? 'bg-[#39ff14]' : cluster.status === 'Scaling' ? 'bg-blue-400' : 'bg-red-500'} animate-pulse`}
                                            style={{ width: cluster.status === 'Healthy' ? '100%' : '65%' }}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-bold ${cluster.status === 'Healthy' ? 'text-[#39ff14]' : cluster.status === 'Scaling' ? 'text-blue-400' : 'text-red-500'}`}>
                                        {cluster.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="p-3 text-gray-500 hover:text-white transition-colors">
                                    <Settings size={20} />
                                </button>
                                <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 group/btn transition-all border border-white/5">
                                    CONSOLE
                                    <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {showWizard && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowWizard(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-stone-950 border border-[#39ff14]/20 rounded-3xl overflow-hidden shadow-2xl shadow-[#39ff14]/10"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3">
                                <div className="p-8 bg-black border-r border-white/10">
                                    <h2 className="text-2xl font-bold text-white mb-6">Create Cluster</h2>
                                    <div className="space-y-6">
                                        {[
                                            { step: 1, title: 'Template', desc: 'Choose engine type' },
                                            { step: 2, title: 'Provider', desc: 'Select cloud or edge' },
                                            { step: 3, title: 'Config', desc: 'Auto-scaling & Auth' },
                                            { step: 4, title: 'Deploy', desc: 'Finalize & Launch' },
                                        ].map((s, i) => (
                                            <div key={i} className="flex gap-4 items-center group cursor-pointer">
                                                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-colors ${i === 0 ? 'border-[#39ff14] text-[#39ff14]' : 'border-white/10 text-gray-500 group-hover:border-white/30'}`}>
                                                    {s.step}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-bold ${i === 0 ? 'text-white' : 'text-gray-500'}`}>{s.title}</p>
                                                    <p className="text-[10px] text-gray-600">{s.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-2 p-12 overflow-y-auto max-h-[80vh]">
                                    <h3 className="text-xl font-bold text-[#39ff14] mb-8">Select Template</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { icon: MessageSquare, title: 'Real-time Chat', desc: 'Optimized for high-frequency messages and presence.' },
                                            { icon: Gamepad2, title: 'Gaming Relay', desc: 'Low-latency UDP/TCP bridge for multiplayer sync.' },
                                            { icon: Database, title: 'IoT Stream', desc: 'High throughput telemetry gathering for billions of devices.' },
                                            { icon: Monitor, title: 'Collaboration', desc: 'Perfect for collaborative apps like Figma or VS Code.' },
                                        ].map((t, i) => (
                                            <div
                                                key={i}
                                                onClick={() => handleCreateCluster(t)}
                                                className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-[#39ff14]/40 hover:bg-[#39ff14]/5 transition-all cursor-pointer group"
                                            >
                                                <t.icon className="w-8 h-8 text-gray-400 group-hover:text-[#39ff14] mb-4 transition-colors" />
                                                <h4 className="font-bold text-white mb-2">{t.title}</h4>
                                                <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-12 flex justify-between">
                                        <button
                                            onClick={() => setShowWizard(false)}
                                            className="text-gray-500 hover:text-white font-bold transition-colors"
                                        >
                                            CANCEL
                                        </button>
                                        <button className="bg-[#39ff14] text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:translate-x-1 transition-all">
                                            CONTINUE <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WebSocketManager;
