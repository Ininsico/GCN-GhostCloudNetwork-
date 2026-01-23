import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Terminal, Shield, Zap, Cpu } from 'lucide-react';

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black selection:bg-[#39ff14] selection:text-black">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#39ff14]/10 rounded-full blur-[120px] mix-blend-screen"
        />
        <motion.div
          style={{ y: useTransform(scrollY, [0, 500], [0, -100]) }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#39ff14]/5 rounded-full blur-[100px] mix-blend-screen"
        />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Version Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-md"
          >
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14]"></span>
            </span>
            <span className="text-gray-300 text-xs font-medium tracking-[0.2em] uppercase">
              Ghost Cloud Protocol v2.4.0
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-9xl font-bold text-white mb-8 tracking-tighter leading-none"
          >
            UNLEASH THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] via-[#32cd32] to-[#39ff14] animate-gradient-x italic">
              ANONYMOUS CLOUD
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-gray-400 text-lg md:text-2xl mb-12 leading-relaxed"
          >
            The world's most powerful decentralized computing network.
            Deploy, scale, and secure your infrastructure on the Ghost Cloud.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
          >
            <button className="group relative px-8 py-4 rounded-full bg-[#39ff14] text-black font-bold text-lg hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="flex items-center space-x-3 relative z-10">
                <span>Start Deploying</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md flex items-center space-x-3">
              <Terminal className="w-5 h-5 text-[#39ff14]" />
              <span>View Documentation</span>
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-t border-white/10"
          >
            {[
              { label: 'Uptime', value: '99.99%', icon: Shield },
              { label: 'Latency', value: ' < 5ms', icon: Zap },
              { label: 'Nodes', value: '1.2k+', icon: Cpu },
              { label: 'Saved', value: '80%', icon: ArrowRight },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start">
                <div className="flex items-center space-x-2 mb-1">
                  <stat.icon className="w-4 h-4 text-[#39ff14]" />
                  <span className="text-[#39ff14] text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</span>
                </div>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-[#39ff14] rounded-full animate-ping opacity-20" />
        <div className="absolute bottom-1/3 right-20 w-3 h-3 bg-[#39ff14] rounded-full animate-ping opacity-10" />
      </div>
    </section>
  );
};

export default HeroSection;
