import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Mail, Lock, ArrowRight, Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

interface LoginProps {
    onSuccess: (data: any) => void;
    onSwitch: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            onSuccess(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#39ff14] rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#39ff14] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Main Card */}
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-2xl shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="relative mb-6"
                        >
                            <div className="absolute inset-0 bg-[#39ff14] blur-xl opacity-50 rounded-full" />
                            <div className="relative w-20 h-20 bg-gradient-to-br from-[#39ff14] to-[#2dd60f] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#39ff14]/30 rotate-6 hover:rotate-0 transition-transform">
                                <Terminal className="text-black w-10 h-10" strokeWidth={2.5} />
                            </div>
                        </motion.div>

                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                            GHOST <span className="text-[#39ff14]">ACCESS</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium">Enter the decentralized network</p>

                        {/* Status Badge */}
                        <div className="mt-4 px-4 py-2 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#39ff14] rounded-full animate-pulse" />
                            <span className="text-[#39ff14] text-xs font-bold uppercase tracking-widest">Network Online</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3"
                            >
                                <Shield className="text-red-500 flex-shrink-0" size={20} />
                                <span className="text-red-400 text-sm font-medium">{error}</span>
                            </motion.div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-4 flex items-center gap-2">
                                <Mail size={12} />
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39ff14]/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="relative w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-5 text-white text-sm outline-none focus:border-[#39ff14]/50 transition-all placeholder:text-gray-600"
                                    placeholder="operator@ghost.network"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-4 flex items-center gap-2">
                                <Lock size={12} />
                                Access Key
                            </label>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39ff14]/20 to-transparent rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="relative w-full bg-black/60 border border-white/10 rounded-2xl py-4 px-5 pr-12 text-white text-sm outline-none focus:border-[#39ff14]/50 transition-all placeholder:text-gray-600"
                                    placeholder="••••••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#39ff14] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#39ff14] to-[#2dd60f] text-black font-black py-4 rounded-2xl hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Initialize Connection
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-gray-500 text-sm text-center">
                            New to the network?{' '}
                            <button
                                onClick={onSwitch}
                                className="text-[#39ff14] font-bold hover:underline underline-offset-4 transition-all"
                            >
                                Register Node
                            </button>
                        </p>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-xs font-mono">
                        🔒 Secured by <span className="text-[#39ff14]">AES-256</span> encryption
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
