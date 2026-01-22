import React from 'react';
import { Bell, Search, User, ChevronDown, Rocket } from 'lucide-react';

import axios from 'axios';

const TopBar: React.FC = () => {
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user for topbar');
            }
        };
        fetchUser();
    }, []);

    const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : '??';
    const emailPrefix = user?.email ? user.email.split('@')[0] : 'Loading...';

    return (
        <div className="h-16 border-b border-[#39ff14]/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#39ff14] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search clusters, nodes, or documentation..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/20 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 rounded-full text-sm font-bold hover:bg-[#39ff14]/20 transition-all">
                    <Rocket className="w-4 h-4" />
                    <span>DEPLOY NEW</span>
                </button>

                <div className="relative">
                    <button className="p-2 text-gray-400 hover:text-[#39ff14] transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#39ff14] rounded-full ring-2 ring-black"></span>
                    </button>
                </div>

                <div className="h-8 w-px bg-white/10 mx-2"></div>

                <button className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#39ff14] to-emerald-900 flex items-center justify-center text-black font-bold text-xs ring-2 ring-transparent group-hover:ring-[#39ff14]/50 transition-all">
                        {initials}
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-xs font-bold text-white group-hover:text-[#39ff14] transition-colors leading-none uppercase">{emailPrefix}</p>
                        <p className="text-[10px] text-gray-500 font-mono tracking-tighter">{user?.role === 'admin' ? 'ROOT ACCESS' : 'OPERATOR'}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </button>
            </div>
        </div>
    );
};

export default TopBar;
