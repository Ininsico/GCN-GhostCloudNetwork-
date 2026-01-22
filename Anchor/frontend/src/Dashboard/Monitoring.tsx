import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import NetworkMap from './NetworkMap';

const Monitoring: React.FC = () => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Simulate real-time data flow for the graphs
        const interval = setInterval(() => {
            setData(prev => {
                const newData = [...prev, {
                    time: new Date().toLocaleTimeString(),
                    cpu: Math.floor(Math.random() * 40) + 20,
                    ram: Math.floor(Math.random() * 30) + 40,
                    throughput: Math.floor(Math.random() * 1000) + 500
                }].slice(-20);
                return newData;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { label: 'Global Throughput', value: '4.2 TB/s', trend: '+12%', color: '#39ff14' },
        { label: 'Active Edge Nodes', value: '12,402', trend: '+5%', color: '#60a5fa' },
        { label: 'Avg Latency', value: '18ms', trend: '-2ms', color: '#a855f7' },
        { label: 'Shield Uptime', value: '99.999%', trend: 'Stable', color: '#f59e0b' }
    ];

    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tighter mb-2 italic uppercase">NETWORK_SENSE <span className="text-[#39ff14] text-xs align-top not-italic font-mono">v4.0.2</span></h1>
                    <p className="text-gray-500 font-medium">Real-time telemetry and heuristic analysis from the Anchor Distributed Pool.</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-[#39ff14]/10 border border-[#39ff14]/20 rounded-full text-[10px] text-[#39ff14] font-bold animate-pulse">LIVE DATA</div>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 font-bold">EDGE_SYNC_READY</div>
                </div>
            </div>

            {/* Global Topology Map */}
            <NetworkMap />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-all"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br from-[#39ff14]/10 to-transparent rounded-full blur-2xl group-hover:from-[#39ff14]/20 transition-all" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
                        <div className="flex items-end gap-3">
                            <h2 className="text-3xl font-black text-white tracking-tight">{s.value}</h2>
                            <span className={`text-[10px] font-bold mb-1 ${s.trend.startsWith('+') ? 'text-green-400' : s.trend.startsWith('-') ? 'text-blue-400' : 'text-gray-500'}`}>{s.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-black border border-white/5 rounded-[40px] p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <div className="w-1 h-6 bg-[#39ff14] rounded-full" />
                            CPU & THROUGHPUT LOAD
                        </h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-[#39ff14]" /> CPU LOAD
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-blue-500" /> THROUGHPUT
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#39ff14" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="cpu" stroke="#39ff14" strokeWidth={3} fillOpacity={1} fill="url(#colorCpu)" animationDuration={1000} />
                                <Area type="monotone" dataKey="throughput" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorThroughput)" animationDuration={1000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[40px] p-8">
                    <h3 className="text-xl font-bold text-white mb-8 italic tracking-widest uppercase text-xs opacity-50">SHIELD_STATUS</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'DDoS Scrubbing', status: 'Optimal', count: '0 Attacks' },
                            { label: 'SSL Auto-Rotate', status: 'Synced', count: '452 CERTS' },
                            { label: 'BlockNet Ledger', status: 'Verified', count: '10.2k TX' },
                        ].map((m, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold mb-0.5 uppercase tracking-tighter">{m.label}</p>
                                    <p className="text-sm font-bold text-white">{m.status}</p>
                                </div>
                                <div className="text-right">
                                    <div className="px-2 py-0.5 rounded bg-[#39ff14]/10 text-[#39ff14] text-[8px] font-bold mb-1">SECURE</div>
                                    <p className="text-[10px] text-gray-500 font-bold">{m.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-3xl">
                        <h4 className="text-xs font-bold text-red-500 uppercase mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Anomaly Detected
                        </h4>
                        <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Heuristic engine found unusual ingress in Region: AP-South. Automated traffic shaping engaged via global routing layer.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Monitoring;
