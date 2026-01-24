
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Server, Smartphone, Globe, Lock, Plus, Terminal, Activity, Wifi, Cpu, HardDrive } from 'lucide-react';

const ServerManager = () => {
    const [activeView, setActiveView] = useState<'servers' | 'devices'>('servers');

    const servers = [
        { id: 1, name: 'Main-Cluster-01', region: 'US-East', type: 'Private', status: 'Online', load: 45, ip: '192.168.1.12' },
        { id: 2, name: 'Edge-Link-Pro', region: 'EU-Central', type: 'Public', status: 'Syncing', load: 12, ip: '10.0.0.4' },
        { id: 3, name: 'AI-Training-Rig', region: 'Asia-South', type: 'Private', status: 'Offline', load: 0, ip: '192.168.1.15' },
    ];

    const devices = [
        { id: 1, name: 'MacBook Pro M3', type: 'Laptop', linked: true, appVersion: 'v2.1.0' },
        { id: 2, name: 'NVIDIA Jetson Nano', type: 'IoT', linked: true, appVersion: 'v2.0.4' },
        { id: 3, name: 'iPhone 15 Pro', type: 'Mobile', linked: false, appVersion: '-' },
    ];

    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto text-white">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter">COMPUTE_MANAGER</h1>
                    <p className="text-gray-400 text-sm">Orchestrate your decentralized infrastructure.</p>
                </div>
                <button className="bg-[#39ff14] text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#32d612] transition flex items-center gap-2">
                    <Plus className="w-4 h-4" /> DEPLOY NEW INSTANCE
                </button>
            </div>

            {/* View Toggle */}
            <div className="flex gap-4 border-b border-white/10 pb-1">
                <button
                    onClick={() => setActiveView('servers')}
                    className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'servers' ? 'text-[#39ff14] border-b-2 border-[#39ff14]' : 'text-gray-500 hover:text-white'}`}
                >
                    <Server className="w-4 h-4" /> SERVERS
                </button>
                <button
                    onClick={() => setActiveView('devices')}
                    className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'devices' ? 'text-[#39ff14] border-b-2 border-[#39ff14]' : 'text-gray-500 hover:text-white'}`}
                >
                    <Smartphone className="w-4 h-4" /> LINKED DEVICES
                </button>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-4">
                    {activeView === 'servers' ? (
                        <>
                            {servers.map((server) => (
                                <motion.div
                                    key={server.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#39ff14]/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white">
                                            <Terminal className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${server.status === 'Online' ? 'bg-[#39ff14]/20 text-[#39ff14]' : 'bg-gray-800 text-gray-500'}`}>
                                            <Server className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold">{server.name}</h3>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${server.type === 'Private' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {server.type.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-6 text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {server.region}</span>
                                                <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> {server.ip}</span>
                                                <span className={`flex items-center gap-1 font-bold ${server.status === 'Online' ? 'text-[#39ff14]' : 'text-red-500'}`}>
                                                    <Activity className="w-3 h-3" /> {server.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400 mb-1">CPU LOAD</div>
                                            <div className="text-xl font-mono font-bold text-[#39ff14]">{server.load}%</div>
                                        </div>
                                    </div>
                                    {/* Load Bar */}
                                    <div className="mt-4 w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#39ff14]"
                                            style={{ width: `${server.load}%` }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </>
                    ) : (
                        <>
                            {devices.map((device) => (
                                <motion.div
                                    key={device.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:bg-white/10 transition-all"
                                >
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                                        <Smartphone className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{device.name}</h3>
                                        <p className="text-xs text-gray-400">{device.type} • Anchor Client {device.appVersion}</p>
                                    </div>
                                    <div>
                                        {device.linked ? (
                                            <button className="px-4 py-2 bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20 rounded-lg text-xs font-bold hover:bg-[#39ff14]/20">
                                                MANAGE
                                            </button>
                                        ) : (
                                            <button className="px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10">
                                                CONNECT
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </>
                    )}
                </div>

                {/* Right Panel: Resource Summary */}
                <div className="space-y-6">
                    <div className="bg-black/40 border border-white/10 rounded-3xl p-6">
                        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Total Resources</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                                        <Cpu className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">vCPU Cores</p>
                                        <p className="text-xs text-gray-500">Available across fleet</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold">128</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <HardDrive className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Storage</p>
                                        <p className="text-xs text-gray-500">SSD / NVMe Pool</p>
                                    </div>
                                </div>
                                <span className="text-xl font-bold">4.2 TB</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#39ff14] rounded-3xl p-6 text-black relative overflow-hidden group cursor-pointer">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all" />
                        <h3 className="text-2xl font-black mb-2 relative z-10">DOWNLOAD CLIENT</h3>
                        <p className="text-sm font-bold opacity-80 mb-4 relative z-10 max-w-[150px]">Connect this device to your Anchor Cloud.</p>
                        <Terminal className="w-8 h-8 relative z-10" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServerManager;
