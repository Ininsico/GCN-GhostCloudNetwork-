import React from 'react';

const Network: React.FC = () => {
    return (
        <section id="network" className="py-24 bg-black overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="rounded-3xl bg-[#39ff14]/5 border border-[#39ff14]/20 p-8 md:p-16 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#39ff14]/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                            <h2 className="text-[#39ff14] text-sm font-bold tracking-widest uppercase mb-4">Live Network</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                                THE PULSE OF THE <br />
                                <span className="italic">GHOST CLOUD</span>
                            </h3>
                            <p className="text-gray-400 text-lg mb-8">
                                Monitor the real-time health and distribution of the Anchor network.
                                Our nodes are distributed across 84 countries, providing redundant
                                connectivity for all deployed services.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { label: "Total Nodes", value: "1,482", color: "bg-[#39ff14]" },
                                    { label: "Active Connections", value: "248.5k", color: "bg-blue-500" },
                                    { label: "Data Processed (24h)", value: "8.4 PB", color: "bg-purple-500" }
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                            <span className="text-white">{stat.value}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full ${stat.color} w-3/4 animate-pulse`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 aspect-video bg-black/40 rounded-2xl border border-white/5 relative flex items-center justify-center group overflow-hidden">
                            {/* Fake Network Visualizer */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#39ff14_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
                            </div>

                            <div className="relative flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full border border-[#39ff14] flex items-center justify-center animate-spin-slow">
                                    <div className="w-16 h-16 rounded-full border border-[#39ff14]/50 animate-ping"></div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#39ff14] font-black text-xl">
                                    LIVE
                                </div>
                            </div>

                            {/* Node Indicators */}
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 bg-[#39ff14] rounded-full animate-pulse"
                                    style={{
                                        top: `${Math.random() * 80 + 10}%`,
                                        left: `${Math.random() * 80 + 10}%`,
                                        animationDelay: `${Math.random() * 2}s`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Network;
