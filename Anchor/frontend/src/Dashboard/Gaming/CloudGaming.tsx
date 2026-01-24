
import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Monitor, Wifi, Zap, Disc, Headphones, Keyboard, MousePointer2, Play } from 'lucide-react';

const CloudGaming = () => {
    return (
        <div className="p-8 h-full overflow-y-auto text-white">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                    <Gamepad2 className="w-8 h-8 text-black" />
                </div>
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">NEON_ARCADE</h1>
                    <p className="text-pink-400 font-bold tracking-widest text-xs">LOW LATENCY • 4K • 120FPS</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Monitor */}
                <div className="lg:col-span-2 relative aspect-video bg-gray-900 rounded-3xl overflow-hidden border border-white/10 group">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-60 group-hover:opacity-80 transition-all duration-500 transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Live</span>
                                <span className="text-gray-300 text-xs font-medium">Session ID: #8X92-GAM</span>
                            </div>
                            <h2 className="text-3xl font-black uppercase mb-1">Cyberpunk 2077</h2>
                            <p className="text-gray-400 text-sm">RTX 4090 Ti Pod • Tokyo Region</p>
                        </div>
                        <button className="bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-wider hover:bg-[#39ff14] transition-colors shadow-xl">
                            Resume Game
                        </button>
                    </div>

                    <div className="absolute top-8 right-8 flex flex-col items-end gap-2">
                        <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2 text-xs font-mono text-[#39ff14]">
                            <Zap className="w-3 h-3" /> 16ms
                        </div>
                        <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs font-mono text-white">
                            4K HDR
                        </div>
                    </div>
                </div>

                {/* Library & Stats */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4">Input Telemetry</h3>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                                <MousePointer2 className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                                <span className="text-[10px] text-gray-400">0.4ms</span>
                            </div>
                            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                                <Keyboard className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                                <span className="text-[10px] text-gray-400">1.2ms</span>
                            </div>
                            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                                <Wifi className="w-5 h-5 mx-auto mb-1 text-green-400" />
                                <span className="text-[10px] text-gray-400">Stable</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white">Library</h3>
                            <button className="text-xs text-[#39ff14] hover:underline">View All</button>
                        </div>
                        {[
                            { name: 'Elden Ring', time: 'Played 2h ago' },
                            { name: 'Starfield', time: 'Played yesterday' },
                            { name: 'Apex Legends', time: 'Played last week' },
                        ].map((game, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                    <Disc className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-gray-200 group-hover:text-[#39ff14] transition-colors">{game.name}</h4>
                                    <p className="text-[10px] text-gray-500">{game.time}</p>
                                </div>
                                <Play className="w-4 h-4 text-gray-600 group-hover:text-white" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CloudGaming;
