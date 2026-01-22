import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Bell, Globe, Save, RefreshCw, Copy, Check } from 'lucide-react';
import axios from 'axios';

const SystemSettings: React.FC = () => {
    const [apiKey, setApiKey] = useState('anch_live_************************');
    const [copied, setCopied] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [ddosLevel, setDdosLevel] = useState('High');

    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setApiKey(res.data.apiKey);
            } catch (err) {
                console.error('Failed to fetch user data');
            }
        };
        fetchApiKey();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
                    <p className="text-gray-400 font-medium text-sm">Configure your global infrastructure and security protocols.</p>
                </div>
                <button className="bg-[#39ff14] text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-[1.02] transition-all">
                    <Save size={18} /> SAVE CHANGES
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Security Section */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8">
                    <div className="flex items-center gap-3 text-[#39ff14]">
                        <Shield size={24} />
                        <h2 className="text-xl font-bold text-white">Security & Guard</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                            <div>
                                <p className="text-sm font-bold text-white mb-1">DDoS Mitigation Level</p>
                                <p className="text-xs text-gray-500">Heuristic traffic shaping aggression.</p>
                            </div>
                            <div className="flex bg-white/5 p-1 rounded-xl">
                                {['Low', 'Medium', 'High'].map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setDdosLevel(level)}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${ddosLevel === level ? 'bg-[#39ff14] text-black' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        {level.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5">
                            <div>
                                <p className="text-sm font-bold text-white mb-1">Automatic SSL Rotation</p>
                                <p className="text-xs text-gray-500">Auto-renew Let's Encrypt certificates.</p>
                            </div>
                            <div className="w-12 h-6 bg-[#39ff14] rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* API & Access */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8">
                    <div className="flex items-center gap-3 text-blue-400">
                        <Key size={24} />
                        <h2 className="text-xl font-bold text-white">API Access Control</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Master API Key</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={apiKey}
                                    readOnly
                                    className="w-full bg-black border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-mono pr-24"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 text-gray-500 hover:text-[#39ff14] transition-colors"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                        <RefreshCw size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-[#39ff14]/5 rounded-2xl border border-[#39ff14]/10">
                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                <span className="text-[#39ff14] font-bold">WARNING:</span> Treat this key like a password. It allows full programmatic access to your cloud clusters and edge resource pool via <span className="text-white font-mono">api.anchor.io</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8">
                    <div className="flex items-center gap-3 text-purple-400">
                        <Bell size={24} />
                        <h2 className="text-xl font-bold text-white">Alerting Protocols</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: 'Cluster Health Failure', desc: 'Notify when AWS/GCP nodes go offline.' },
                            { label: 'Micropayment Ledger', desc: 'Alert on blockchain credit depletion.' },
                            { label: 'Edge Scaling Events', desc: 'When Anchor Nodes scale to handle load.' },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                                <div>
                                    <p className="text-sm font-bold text-white mb-0.5">{item.label}</p>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${i < 2 ? 'bg-[#39ff14]' : 'bg-white/10'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-black rounded-full transition-all ${i < 2 ? 'right-1' : 'left-1'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Network & Regions */}
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8 overflow-hidden relative">
                    <div className="flex items-center gap-3 text-orange-400">
                        <Globe size={24} />
                        <h2 className="text-xl font-bold text-white">Global Edge Routing</h2>
                    </div>

                    <div className="relative h-48 bg-black/60 rounded-3xl border border-white/5 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#39ff14] to-transparent animate-pulse" />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-[10px] font-bold text-[#39ff14] uppercase tracking-widest mb-2 font-mono">Mesh_Visualizer_Offline</p>
                            <p className="text-xs text-gray-500">Intelligent Geo-Routing is active across 42 availability zones.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
