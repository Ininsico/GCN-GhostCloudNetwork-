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
    Layers,
    BookOpen,
    Gamepad2,
    HardDrive
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
    const supervisorItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'monitoring', icon: Activity, label: 'Global Network' },
        { id: 'nodes', icon: Cpu, label: 'Node Explorer' },
    ];

    const workspaceItems = [
        { id: 'compute', icon: Server, label: 'My Servers' },
        { id: 'notebooks', icon: BookOpen, label: 'AI Notebooks' },
        { id: 'gaming', icon: Gamepad2, label: 'Cloud Gaming' },
        { id: 'marketplace', icon: Layers, label: 'Resource Market' },
        { id: 'billing', icon: CreditCard, label: 'Billing' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    const NavItem = ({ item }: { item: any }) => (
        <button
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${activeTab === item.id
                ? 'bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
        >
            <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#39ff14]' : 'group-hover:text-[#39ff14] transition-colors'}`} />
            <span className="font-medium text-sm">{item.label}</span>
            {activeTab === item.id && (
                <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1 h-4 bg-[#39ff14] rounded-full"
                />
            )}
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-black border-r border-[#39ff14]/10 w-64 text-white">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#39ff14] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.3)]">
                    <Zap className="text-black w-6 h-6 fill-current" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tighter">ANCHOR</h1>
                    <p className="text-[10px] text-[#39ff14] font-mono tracking-widest leading-none">DECENTRALIZED</p>
                </div>
            </div>

            <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">

                {/* Supervisor Section */}
                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Supervisor</p>
                    {supervisorItems.map((item) => (
                        <NavItem key={item.id} item={item} />
                    ))}
                </div>

                {/* Workspace Section */}
                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">User Workspace</p>
                    {workspaceItems.map((item) => (
                        <NavItem key={item.id} item={item} />
                    ))}
                </div>

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
