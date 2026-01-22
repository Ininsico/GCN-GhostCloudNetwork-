import React from 'react';
import { Shield, Zap, Globe, Cpu, Lock, Cloud } from 'lucide-react';

const Features: React.FC = () => {
    const features = [
        {
            title: "Military-Grade Security",
            description: "End-to-end encryption for all data packets moving through the Ghost Cloud Network.",
            icon: <Shield className="w-8 h-8 text-[#39ff14]" />,
        },
        {
            title: "Ultra-Low Latency",
            description: "Edge computing nodes strategically placed globally to ensure sub-15ms response times.",
            icon: <Zap className="w-8 h-8 text-[#39ff14]" />,
        },
        {
            title: "Global Distribution",
            description: "Automatically replicate your applications across our decentralized network of nodes.",
            icon: <Globe className="w-8 h-8 text-[#39ff14]" />,
        },
        {
            title: "High Performance",
            description: "Optimized for computational-heavy workloads and real-time data processing.",
            icon: <Cpu className="w-8 h-8 text-[#39ff14]" />,
        },
        {
            title: "Zero-Knowledge Arch.",
            description: "We don't see your data. You own the keys, you own the network, you own the infrastructure.",
            icon: <Lock className="w-8 h-8 text-[#39ff14]" />,
        },
        {
            title: "Infinite Scalability",
            description: "The network expands as demand increases, ensuring your app never hits a bottleneck.",
            icon: <Cloud className="w-8 h-8 text-[#39ff14]" />,
        }
    ];

    return (
        <section id="features" className="py-24 bg-black relative">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mb-16">
                    <h2 className="text-[#39ff14] text-sm font-bold tracking-widest uppercase mb-4">Core Infrastructure</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        ENGINEERED FOR THE <br />
                        <span className="text-gray-600">DECENTRALIZED FUTURE</span>
                    </h3>
                    <p className="text-gray-400 text-lg">
                        Anchor provides the primitive building blocks required to build, deploy, and scale
                        censorship-resistant applications on a global scale.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="group p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#39ff14]/30 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                        >
                            <div className="mb-6 p-3 rounded-xl bg-white/[0.03] w-fit group-hover:bg-[#39ff14]/10 transition-colors">
                                {f.icon}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#39ff14] transition-colors">{f.title}</h4>
                            <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
