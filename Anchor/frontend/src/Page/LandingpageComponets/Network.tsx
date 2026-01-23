import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const dummyData = [
    { time: '00:00', traffic: 400, latency: 12 },
    { time: '04:00', traffic: 300, latency: 15 },
    { time: '08:00', traffic: 600, latency: 8 },
    { time: '12:00', traffic: 800, latency: 10 },
    { time: '16:00', traffic: 500, latency: 14 },
    { time: '20:00', traffic: 900, latency: 7 },
    { time: '23:59', traffic: 1100, latency: 5 },
];

const Network: React.FC = () => {
    return (
        <section id="network" className="py-24 bg-black relative">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                                GLOBAL <span className="text-[#39ff14]">NETWORK</span> STATUS
                            </h2>
                            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                                The Anchor dashboard provides real-time visibility into the Ghost Cloud Network.
                                Monitor traffic, latency, and node health across 1,200+ global locations with millisecond precision.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { label: "Network Throughput", value: "42.8 Tbps" },
                                    { label: "Active Connections", value: "1.2M+" },
                                    { label: "Average Edge Latency", value: "4.2ms" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                        <span className="text-gray-400 font-medium">{item.label}</span>
                                        <span className="text-[#39ff14] font-bold">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#39ff14]/50 group-hover:h-2 transition-all" />

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="text-white font-bold">Network Traffic</h4>
                                <p className="text-xs text-gray-500">Real-time throughput (Gbps)</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/20 text-[#39ff14] text-xs font-bold animate-pulse">
                                LIVE
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dummyData}>
                                    <defs>
                                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#39ff14" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#ffffff40"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#ffffff40"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}G`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff20', borderRadius: '12px' }}
                                        itemStyle={{ color: '#39ff14' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="traffic"
                                        stroke="#39ff14"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTraffic)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Network;
