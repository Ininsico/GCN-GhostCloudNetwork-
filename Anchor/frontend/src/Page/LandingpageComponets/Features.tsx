import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Cpu, Lock, Share2, Activity, Database } from 'lucide-react';

const FeatureCard = ({ title, desc, icon: Icon, delay, className = "" }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className={`group p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#39ff14]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(57,255,20,0.1)] relative overflow-hidden ${className}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-[#39ff14]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#39ff14]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="text-[#39ff14] w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#39ff14] transition-colors">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{desc}</p>
        </div>
    </motion.div>
);

const Features: React.FC = () => {
    return (
        <section id="features" className="py-24 relative overflow-hidden bg-black">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        ENGINEERED FOR <span className="text-[#39ff14] italic">PERFORMANCE</span>
                    </motion.h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Built on top of the Ghost Cloud Protocol, Anchor provides a suite of tools
                        designed for the next generation of decentralized applications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {/* Main Feature - Large */}
                    <FeatureCard
                        className="md:col-span-2 lg:col-span-3 lg:row-span-2"
                        icon={Shield}
                        title="Sovereign Security"
                        desc="Military-grade encryption and decentralized identity management. Your data never leaves your control, protected by the Ghost Protocol's zero-knowledge proofs."
                        delay={0.1}
                    />

                    <FeatureCard
                        className="md:col-span-2 lg:col-span-3"
                        icon={Zap}
                        title="Instant Deployment"
                        desc="Global distribution in under 60 seconds with our optimized container engine."
                        delay={0.2}
                    />

                    <FeatureCard
                        className="md:col-span-2 lg:col-span-2"
                        icon={Globe}
                        title="Edge-First"
                        desc="Nodes in 120+ countries ensuring minimum latency for every user."
                        delay={0.3}
                    />

                    <FeatureCard
                        className="md:col-span-2 lg:col-span-1"
                        icon={Cpu}
                        title="Bare Metal"
                        desc="Direct hardware access for maximum efficiency."
                        delay={0.4}
                    />

                    <FeatureCard
                        className="md:col-span-2 lg:col-span-2"
                        icon={Lock}
                        title="Private Compute"
                        desc="Isolated execution environments for sensitive workloads."
                        delay={0.5}
                    />

                    <FeatureCard
                        className="md:col-span-2 lg:col-span-2"
                        icon={Database}
                        title="Elastic Storage"
                        desc="Distributed object storage that scales with your needs."
                        delay={0.6}
                    />

                    <FeatureCard
                        className="md:col-span-2 lg:col-span-2"
                        icon={Share2}
                        title="P2P Mesh"
                        desc="Direct node-to-node communication for ultra-fast data sync."
                        delay={0.7}
                    />

                    <FeatureCard
                        className="md:col-span-2 lg:col-span-2"
                        icon={Activity}
                        title="Real-time Stats"
                        desc="Advanced monitoring with Recharts-powered analytics."
                        delay={0.8}
                    />
                </div>
            </div>
        </section>
    );
};

export default Features;
