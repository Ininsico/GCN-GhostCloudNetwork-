import React from 'react';
import { ArrowRight, Shield, Zap, Globe, Cpu } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#39ff14]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#39ff14]/5 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#39ff14]/5 border border-[#39ff14]/20 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14]"></span>
          </span>
          <span className="text-[#39ff14] text-xs font-bold tracking-widest uppercase">
            Ghost Cloud Network v2.0
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
          DECENTRALIZED <br />
          <span className="text-[#39ff14] italic">INFRASTRUCTURE</span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 leading-relaxed">
          Anchor is the standard for secure, high-performance decentralized computing.
          Deploy global-scale applications on the Ghost Cloud Network with zero latency.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
          <button className="group px-8 py-4 rounded-xl bg-[#39ff14] text-black font-black text-lg hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all flex items-center space-x-3">
            <span>DEPLOY NOW</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md">
            VIEW NETWORK STATS
          </button>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto border-t border-white/5 pt-12">
          <div className="text-left">
            <div className="text-[#39ff14] text-3xl font-black mb-1">99.99%</div>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest text-wrap">NETWORK UPTIME</div>
          </div>
          <div className="text-left border-l border-white/5 pl-4 md:pl-8">
            <div className="text-[#39ff14] text-3xl font-black mb-1">12ms</div>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest text-wrap">AVG LATENCY</div>
          </div>
          <div className="text-left border-l border-white/5 pl-4 md:pl-8">
            <div className="text-[#39ff14] text-3xl font-black mb-1">500+</div>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest text-wrap">ACTIVE NODES</div>
          </div>
          <div className="text-left border-l border-white/5 pl-4 md:pl-8">
            <div className="text-[#39ff14] text-3xl font-black mb-1">0.001$</div>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest text-wrap">COST PER GB</div>
          </div>
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#39ff14]/20 z-10 w-full shadow-[0_0_20px_rgba(57,255,20,0.2)]"></div>
    </section>
  );
};

export default HeroSection;
