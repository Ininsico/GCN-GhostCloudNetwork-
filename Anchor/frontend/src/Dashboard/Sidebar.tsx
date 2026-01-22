import React from 'react';
import {
    LayoutDashboard,
    Server,
    Cpu,
    Activity,
    CreditCard,
    Settings,
    LogOut,
    Zap,
    Globe,
    Shield,
    Layers,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
    const menuItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'websockets', icon: Server, label: 'WebSocket Clusters' },
        { id: 'nodes', icon: Cpu, label: 'Anchor Nodes' },
        { id: 'Marketplace', icon: Layers, label: 'Compute Pool' },
        { id: 'Monitoring', icon: Activity, label: 'Monitoring' },
        { id: 'Billing', icon: CreditCard, label: 'Billing & Credits' },
        { id: 'settings', icon: Settings, label: 'System Settings' },
    ];

    return (
        <div className="flex flex-col h-full bg-black border-r border-[#39ff14]/10 w-64 text-white">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#39ff14] rounded-lg flex items-center justify-center">
                    <Zap className="text-black w-6 h-6 fill-current" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tighter">ANCHOR</h1>
                    <p className="text-[10px] text-[#39ff14] font-mono tracking-widest leading-none">DECENTRALIZED</p>
                </div>
            </div>

            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                            ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#39ff14]' : 'group-hover:text-[#39ff14] transition-colors'}`} />
                        <span className="font-medium">{item.label}</span>
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="sidebar-active"
                                className="ml-auto w-1 h-5 bg-[#39ff14] rounded-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-[#39ff14]/10">
                <div className="bg-[#39ff14]/5 rounded-2xl p-4 mb-4 border border-[#39ff14]/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-[#39ff14]" />
                        <span className="text-xs font-bold text-[#39ff14]">NETWORK STATUS</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                            <span className="text-gray-400">Nodes Online</span>
                            <span className="text-white">1,248</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="bg-[#39ff14] w-3/4 h-full animate-pulse" />
                        </div>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-gray-400">Pool Load</span>
                            <span className="text-white">64%</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
