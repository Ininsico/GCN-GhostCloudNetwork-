import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Cpu, Lock, Zap, Share2, Server, Terminal, Shield, Globe } from 'lucide-react';
import Header from "../../Components/Header";

// Motion Section Wrapper
const MotionSection = ({ children, className = "" }: any) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className={`py-24 ${className}`}
        >
            {children}
        </motion.section>
    );
};

const FeatureHero = () => (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(57,255,20,0.1),transparent_70%)]" />
        <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tighter leading-none">
                    TECHNICAL <br />
                    <span className="text-[#39ff14] italic">SUPERIORITY</span>
                </h1>
                <p className="max-w-3xl mx-auto text-gray-400 text-xl md:text-2xl leading-relaxed">
                    Deep dive into the architecture that powers the Ghost Cloud Network.
                    Military-grade protocols meets cloud-scale performance.
                </p>
            </motion.div>
        </div>
    </section>
);

const FeatureArchitecture = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

    return (
        <MotionSection className="bg-[#050505]">
            <div className="container mx-auto px-6" ref={ref}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div style={{ rotateX: rotate }}>
                        <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Server className="w-64 h-64 text-[#39ff14]" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                                HYPER-DISTRIBUTED <br />
                                <span className="text-[#39ff14]">CORE ENGINE</span>
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Stateless Routing", desc: "Every node in the network operates as a blind relay, ensuring 100% data anonymity." },
                                    { title: "Dynamic Sharding", desc: "Workloads are automatically split into micro-encrypted shards across 50+ nodes." },
                                    { title: "Auto-Migration", desc: "Network intelligently moves running instances to the highest performing node in real-time." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-1 h-12 bg-[#39ff14]/30 rounded-full flex-shrink-0" />
                                        <div>
                                            <h4 className="text-white font-bold">{item.title}</h4>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <div>
                        <span className="text-[#39ff14] font-black tracking-widest uppercase text-sm mb-4 block">Engineered for Scale</span>
                        <h3 className="text-4xl font-bold text-white mb-8">The Ghost Edge Protocol</h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Unlike traditional CDNs, Anchor uses a proprietary Ghost Edge Protocol that operates at Layer 2. This allows for direct hardware-to-socket communication, bypassing standard OS bottlenecks.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <Zap className="text-[#39ff14] mb-4" />
                                <h5 className="text-white font-bold mb-2">3.2ms</h5>
                                <p className="text-gray-500 text-xs">Propagated Latency</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <Globe className="text-[#39ff14] mb-4" />
                                <h5 className="text-white font-bold mb-2">1,200+</h5>
                                <p className="text-gray-500 text-xs">Edge Locations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const SecurityProtocol = () => {
    return (
        <MotionSection>
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 underline decoration-[#39ff14]/30">GHOST PRIVACY <span className="italic">STACK</span></h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Privacy isn't a feature, it's the foundation. Every packet is double-blind encrypted before it even hits our network.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Lock, title: "Zero-Knowledge Logs", desc: "Our infrastructure is designed to be incapable of logging user activity. What we don't have, we can't share." },
                        { icon: Shield, title: "AES-256-GCM Edge", desc: "End-to-end encryption using military-grade standards. Your keys are generated locally and never leave your device." },
                        { icon: Terminal, title: "SSH-over-Web", desc: "Manage your cluster directly from the dashboard using our secure websocket-tunneling technology." }
                    ].map((item, i) => (
                        <div key={i} className="group p-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-[#39ff14]/40 transition-all duration-500">
                            <div className="w-16 h-16 rounded-2xl bg-[#39ff14]/5 flex items-center justify-center mb-8 group-hover:bg-[#39ff14]/10 transition-colors">
                                <item.icon className="text-[#39ff14] w-8 h-8" />
                            </div>
                            <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
                            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </MotionSection>
    );
};

const ComputeDetails = () => {
    return (
        <MotionSection className="bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-white/[0.02] border border-white/10 p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute bottom-0 right-0 p-10 opacity-5">
                        <Cpu className="w-96 h-96 text-white" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
                            <div className="px-6 py-2 rounded-full border border-[#39ff14]/30 bg-[#39ff14]/5 text-[#39ff14] text-xs font-black uppercase tracking-[0.3em]">
                                Feature Specification
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white">RESOURCES & <span className="text-[#39ff14]">COMPUTE</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-3">
                                        <Share2 className="text-[#39ff14] w-5 h-5" />
                                        Natively Multi-Tenant
                                    </h4>
                                    <p className="text-gray-400">Our custom hypervisor allows for isolated multi-tenant execution without the overhead of traditional virtualization, saving up to 40% in CPU cycles.</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-3">
                                        <Cpu className="text-[#39ff14] w-5 h-5" />
                                        GPU Acceleration
                                    </h4>
                                    <p className="text-gray-400">Direct PCIe pass-through for AI workloads. Deploy LLMs or rendering engines across the Ghost Cloud with one click.</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-3">
                                        <Terminal className="text-[#39ff14] w-5 h-5" />
                                        Ghost CLI
                                    </h4>
                                    <p className="text-gray-400">A powerful command-line interface to manage clusters, monitor logs, and deploy applications directly from your terminal.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-sm text-[#39ff14]/80">
                                    <div className="flex gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="space-y-1">
                                        <p>$ anchor login</p>
                                        <p className="text-white">Authenticating with Ghost Protocol...</p>
                                        <p>$ anchor deploy --cluster v2-proxy</p>
                                        <p className="text-white">Success! Endpoint: ghost-a7.anchor.net</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const ComparisonSection = () => {
    return (
        <MotionSection>
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">ANCHOR VS <span className="text-gray-600">TRADITION</span></h2>
                </div>

                <div className="max-w-4xl mx-auto overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-6 px-4 text-gray-500 font-medium">Feature</th>
                                <th className="py-6 px-4 text-[#39ff14] font-black tracking-widest uppercase text-sm">Anchor</th>
                                <th className="py-6 px-4 text-gray-600 font-medium">AWS/GCP</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {[
                                { f: "Network Structure", a: "Decentralized P2P", o: "Centralized Data Centers" },
                                { f: "Data Privacy", a: "Zero-Knowledge", o: "Logging & Harvest" },
                                { f: "Latency (Global)", a: "< 5ms", o: "20ms - 150ms" },
                                { f: "Cost Reduction", a: "60-80%", o: "0%" },
                                { f: "Infrastructure Ownership", a: "Community Nodes", o: "Big Tech Proprietary" }
                            ].map((row, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="py-6 px-4 text-gray-400">{row.f}</td>
                                    <td className="py-6 px-4 font-bold">{row.a}</td>
                                    <td className="py-6 px-4 text-gray-600">{row.o}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MotionSection>
    );
};

const FeaturesPage = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="bg-black text-white selection:bg-[#39ff14] selection:text-black min-h-screen">
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-[#39ff14] z-[100] origin-left"
                style={{ scaleX }}
            />
            <Header onNavigate={onNavigate} />

            <main>
                <FeatureHero />
                <FeatureArchitecture />
                <SecurityProtocol />
                <ComputeDetails />
                <ComparisonSection />
            </main>

            <footer className="py-24 border-t border-white/5 text-center bg-[#050505]">
                <div className="container mx-auto px-6">
                    <h3 className="text-3xl font-black mb-8">ANCHOR.</h3>
                    <div className="flex justify-center gap-12 text-gray-500 uppercase tracking-widest text-xs font-bold mb-12">
                        <button onClick={() => onNavigate('landing')} className="hover:text-[#39ff14] transition-colors">Hero</button>
                        <button onClick={() => onNavigate('features')} className="hover:text-[#39ff14] transition-colors underline underline-offset-8 decoration-[#39ff14]">Features</button>
                        <button onClick={() => onNavigate('how-it-works')} className="hover:text-[#39ff14] transition-colors">How It Works</button>
                        <button onClick={() => onNavigate('network')} className="hover:text-[#39ff14] transition-colors">Network</button>
                        <button onClick={() => onNavigate('patron')} className="hover:text-[#39ff14] transition-colors">Patron</button>
                        <button onClick={() => onNavigate('documentation')} className="hover:text-[#39ff14] transition-colors">Docs</button>
                        <button className="hover:text-[#39ff14] transition-colors">Whitepaper</button>
                    </div>
                    <p className="text-gray-700 text-xs font-medium tracking-[0.4em]">© 2026 GHOST CLOUD NETWORK PROTOCOL. TECHNICAL DOCS V2.4</p>
                </div>
            </footer>
        </div>
    );
};

export default FeaturesPage;
