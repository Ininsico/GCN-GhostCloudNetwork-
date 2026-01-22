import React from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    History,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Zap,
    DollarSign,
    TrendingUp,
    Clock,
    ExternalLink
} from 'lucide-react';

import axios from 'axios';

const Billing: React.FC = () => {
    const [credits, setCredits] = React.useState(1852.80);
    const [userName, setUserName] = React.useState('Operator');

    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCredits(res.data.credits);
                setUserName(res.data.email.split('@')[0]);
            } catch (err) {
                console.error('Failed to fetch billing data');
            }
        };
        fetchUserData();
    }, []);

    const transactions = [
        { id: 'TX-9281', desc: 'Resource Rental - AWS Cluster-A', amount: '-$12.50', date: 'Jan 22, 2026', status: 'Success' },
        { id: 'TX-9274', desc: 'Anchor Node Earnings - Node-X82', amount: '+4.2 ANC', date: 'Jan 21, 2026', status: 'Success' },
        { id: 'TX-9260', desc: 'Monthly Pro Subscription', amount: '-$29.00', date: 'Jan 20, 2026', status: 'Success' },
        { id: 'TX-9255', desc: 'Anchor Node Earnings - Node-W11', amount: '+12.8 ANC', date: 'Jan 19, 2026', status: 'Success' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Billing & Credits</h1>
                <p className="text-gray-400">Manage your payments, view earnings, and control your budget.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Wallet Balance */}
                <div className="bg-gradient-to-br from-[#39ff14] to-emerald-900 rounded-3xl p-8 text-black shadow-2xl shadow-[#39ff14]/10 relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-3 bg-black rounded-xl">
                                    <Zap className="text-[#39ff14]" size={24} />
                                </div>
                                <div className="bg-black/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Active Credits</div>
                            </div>
                            <p className="text-sm font-bold opacity-70 mb-1">Total Network Credits</p>
                            <h2 className="text-5xl font-extrabold tracking-tighter mb-4">{credits.toLocaleString()} <span className="text-lg">ANC</span></h2>
                            <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                                <TrendingUp size={16} />
                                <span>+$142.20 this month</span>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <button className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
                                SWAP TO USDT
                            </button>
                            <button className="flex-1 bg-white/20 backdrop-blur-md text-black border border-black/10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">
                                BUY CREDITS
                            </button>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute -right-20 -top-20 opacity-10 pointer-events-none"
                    >
                        <Zap size={300} />
                    </motion.div>
                </div>

                {/* Payment Method */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <CreditCard className="text-[#39ff14]" size={20} />
                            Payment Method
                        </h2>
                        <button className="text-[10px] font-bold text-[#39ff14] hover:underline uppercase">Edit</button>
                    </div>

                    <div className="bg-black/40 rounded-2xl p-6 border border-white/10 mb-8 relative group cursor-pointer hover:border-[#39ff14]/30 transition-all">
                        <div className="flex justify-between items-start mb-12">
                            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center font-bold italic text-white text-xs">VISA</div>
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/20 group-hover:text-[#39ff14]/50">
                                <History size={16} />
                            </div>
                        </div>
                        <div>
                            <p className="text-white font-mono tracking-[0.2em] mb-2">**** **** **** 4291</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] text-gray-500 font-bold uppercase">Card Holder</p>
                                    <p className="text-xs text-white font-medium uppercase">{userName}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] text-gray-500 font-bold uppercase">Expires</p>
                                    <p className="text-xs text-white font-medium">12/28</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Monthly Usage</span>
                            <span className="text-white font-bold">$142.50 / $500.00</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#39ff14] w-[28%] h-full" />
                        </div>
                        <p className="text-[10px] text-gray-500 italic">*Usage resets in 8 days</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="text-[#39ff14]" size={20} />
                        Summary
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Spent (30d)</p>
                            <p className="text-lg font-bold text-white">$248.12</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Earned (30d)</p>
                            <p className="text-lg font-bold text-[#39ff14]">420 ANC</p>
                        </div>
                    </div>

                    <div className="p-4 bg-[#39ff14]/5 rounded-2xl border border-[#39ff14]/10">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign size={14} className="text-[#39ff14]" />
                            <span className="text-xs font-bold text-[#39ff14]">COST OPTIMIZATION</span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                            You could save <span className="text-white font-bold">$42.00</span> next month by migrating your "Chat Main" cluster to Anchor Personal Nodes.
                        </p>
                        <button className="mt-3 text-[10px] font-bold text-white bg-black/40 hover:bg-black px-3 py-1.5 rounded-lg border border-white/10 transition-all">
                            REALIZE SAVINGS
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
                    <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                        <Download size={16} /> DOWNLOAD CSV
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                                <th className="pb-4">Transaction ID</th>
                                <th className="pb-4">Description</th>
                                <th className="pb-4">Date</th>
                                <th className="pb-4">Amount</th>
                                <th className="pb-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {transactions.map((tx, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-4 font-mono text-xs text-gray-400 group-hover:text-white transition-colors">{tx.id}</td>
                                    <td className="py-4 text-white font-medium">{tx.desc}</td>
                                    <td className="py-4 text-gray-500 flex items-center gap-2">
                                        <Clock size={12} /> {tx.date}
                                    </td>
                                    <td className={`py-4 font-bold ${tx.amount.startsWith('+') ? 'text-[#39ff14]' : 'text-white'}`}>
                                        {tx.amount}
                                    </td>
                                    <td className="py-4 text-right">
                                        <span className="px-2 py-1 bg-[#39ff14]/10 text-[#39ff14] text-[10px] font-bold rounded">
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="w-full mt-6 py-3 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                        See Entire History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Billing;
