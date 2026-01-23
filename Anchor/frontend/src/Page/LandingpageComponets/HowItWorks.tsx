import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Share2, Rocket } from 'lucide-react';

const Step = ({ number, title, desc, icon: Icon, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, x: number % 2 === 0 ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-24 last:mb-0"
    >
        <div className={`flex-1 ${number % 2 === 0 ? 'md:order-2' : ''}`}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] font-bold mb-6">
                {number}
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
            <p className="text-gray-400 text-lg leading-relaxed">{desc}</p>
        </div>

        <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-[#39ff14]/5 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all" />
                <Icon className="w-32 h-32 text-[#39ff14] relative z-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
        </div>

        {/* Connector Line (Desktop) */}
        {number < 3 && (
            <div className="hidden md:block absolute left-1/2 bottom-[-80px] w-px h-32 bg-gradient-to-b from-[#39ff14]/50 to-transparent" />
        )}
    </motion.div>
);

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-24 bg-black overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-32">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        HOW IT <span className="text-[#39ff14]">WORKS</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Deploying on the Ghost Cloud Network is simpler than traditional cloud providers.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <Step
                        number={1}
                        icon={Layers}
                        title="Containerize Your App"
                        desc="Package your application into a standard Docker container or use one of our pre-configured Ghost Templates for Node.js, Python, or Go."
                        delay={0.1}
                    />
                    <Step
                        number={2}
                        icon={Share2}
                        title="Global Distribution"
                        desc="Our P2P mesh network automatically encrypts and shards your application, distributing it across 1,200+ nodes globally."
                        delay={0.2}
                    />
                    <Step
                        number={3}
                        icon={Rocket}
                        title="Auto-Scale at the Edge"
                        desc="Anchor intelligently handles traffic spikes by spinning up instances closest to your users, ensuring sub-5ms latency."
                        delay={0.3}
                    />
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
