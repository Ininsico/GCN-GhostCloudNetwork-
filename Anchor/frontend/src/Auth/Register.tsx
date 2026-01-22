import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, UserPlus, Loader2, ShieldCheck } from 'lucide-react';
import axios from 'axios';

interface RegisterProps {
    onSuccess: (data: any) => void;
    onSwitch: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSuccess, onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) return setError('Passwords do not match');

        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
            localStorage.setItem('token', res.data.token);
            onSuccess(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#39ff14]/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#39ff14]/5 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/[0.02] border border-white/10 rounded-[40px] p-10 backdrop-blur-xl relative z-10"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-[#39ff14] rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-[#39ff14]/20">
                        <UserPlus className="text-black w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-widest text-center italic uppercase tracking-tighter">UPLINK_START</h1>
                    <p className="text-gray-500 text-sm mt-2 text-center">Establish your identity on the Anchor Network</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Communication Relay (Email)</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:border-[#39ff14]/50 transition-all font-mono"
                                placeholder="operator@anchor.net"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Secure Key (Password)</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:border-[#39ff14]/50 transition-all font-mono"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Confirm Key</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:border-[#39ff14]/50 transition-all font-mono"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-[#39ff14] text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#39ff14]/20 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'INITIALIZE_ENDPOINT'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-xs">
                        Already have an established uplink? {' '}
                        <button onClick={onSwitch} className="text-[#39ff14] font-bold hover:underline">LOGIN_EXISTING</button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
