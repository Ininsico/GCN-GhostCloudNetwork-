import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA: React.FC = () => {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#39ff14]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 p-12 md:p-20 text-center relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Sparkles className="w-12 h-12 text-[#39ff14]" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                        READY TO JOIN THE <span className="text-[#39ff14]">REVOLUTION?</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        Stop overpaying for centralized cloud providers. Start building on the
                        Anchor Cloud Network today and experience true digital sovereignty.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="w-full sm:w-auto px-10 py-5 rounded-full bg-[#39ff14] text-black font-black text-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(57,255,20,0.3)] flex items-center justify-center space-x-3">
                            <span>GET STARTED NOW</span>
                            <ArrowRight className="w-6 h-6" />
                        </button>
                        <button className="w-full sm:w-auto px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xl hover:bg-white/10 transition-all backdrop-blur-md">
                            TALK TO SALES
                        </button>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                        {/* Simple Logo Placeholders */}
                        <span className="text-xl font-bold tracking-widest">NVIDIA</span>
                        <span className="text-xl font-bold tracking-widest">AMD</span>
                        <span className="text-xl font-bold tracking-widest">INTEL</span>
                        <span className="text-xl font-bold tracking-widest">ARM</span>
                        <span className="text-xl font-bold tracking-widest">LINUX</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
