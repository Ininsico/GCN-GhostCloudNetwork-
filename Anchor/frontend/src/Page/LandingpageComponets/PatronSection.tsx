import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Check } from 'lucide-react';

const PatronCard = ({ tier, price, features, recommended = false, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className={`p-8 rounded-[2.5rem] flex flex-col h-full bg-white/[0.03] border ${recommended ? 'border-[#39ff14]' : 'border-white/10'} relative overflow-hidden`}
    >
        {recommended && (
            <div className="absolute top-0 right-0 bg-[#39ff14] text-black text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                Most Popular
            </div>
        )}

        <div className="mb-8">
            <h4 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">{tier}</h4>
            <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-bold text-white">${price}</span>
                <span className="text-gray-500 font-medium">/month</span>
            </div>
        </div>

        <ul className="space-y-4 mb-10 flex-grow">
            {features.map((feature: any, i: number) => (
                <li key={i} className="flex items-center space-x-3 text-gray-300 text-sm">
                    <Check className="w-4 h-4 text-[#39ff14] flex-shrink-0" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>

        <button className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${recommended
            ? 'bg-[#39ff14] text-black hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]'
            : 'bg-white/10 text-white hover:bg-white/20'
            }`}>
            <Heart className="w-4 h-4" /> Support Project
        </button>
    </motion.div>
);

const PatronSection: React.FC = () => {
    return (
        <section id="patron" className="py-24 bg-black">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        COMMUNITY <span className="text-[#39ff14]">PATRONS</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Anchor is free for everyone. Our development is funded by users who believe in a decentralized internet. Join the mission.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <PatronCard
                        tier="Supporter"
                        price="5"
                        delay={0.1}
                        features={[
                            "Community Discord Badge",
                            "Name in CREDITS.md",
                            "Beta Testing Access",
                            "Project Newsletter"
                        ]}
                    />
                    <PatronCard
                        tier="Guardian"
                        price="25"
                        recommended={true}
                        delay={0.2}
                        features={[
                            "Guardian Discord Role",
                            "Quarterly Roadmap Voting",
                            "Priority Feature Request",
                            "Early Security Briefings",
                            "Dedicated Profile Badge"
                        ]}
                    />
                    <PatronCard
                        tier="Vanguard"
                        price="100"
                        delay={0.3}
                        features={[
                            "Executive Discord Access",
                            "Monthly Dev Q&A",
                            "Your Logo on Website",
                            "Exclusive Swag Access",
                            "Vanguard Identity Pack"
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

export default PatronSection;
