import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
    return (
        <section className="py-24 bg-black border-t border-white/5">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                    SECURE YOUR <br />
                    <span className="text-[#39ff14]">DIGITAL ANCHOR</span>
                </h2>
                <p className="max-w-2xl mx-auto text-gray-400 text-lg mb-12">
                    Join the thousands of developers building the next generation of decentralized
                    applications on the most robust network ever created.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-[#39ff14] text-black font-black text-xl hover:shadow-[0_0_40px_rgba(57,255,20,0.4)] transition-all">
                        GET STARTED FOR FREE
                    </button>
                    <button className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xl hover:bg-white/10 transition-all">
                        TALK TO AN ENGINEER
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTA;
