import { motion, useScroll, useSpring } from 'framer-motion';
import { ShieldCheck, Cpu, Share2, Activity, Layers, Boxes, Globe, Zap, Terminal, Lock, HardDrive } from 'lucide-react';
import Header from "../../Components/Header";

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

const HowHero = () => (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(57,255,20,0.05),transparent_70%)]" />
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#39ff1411 1px, transparent 1px), linear-gradient(90 binary #39ff1411 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="inline-block px-4 py-1 rounded-full border border-[#39ff14]/30 bg-[#39ff14]/5 text-[#39ff14] text-xs font-black uppercase tracking-[0.3em] mb-6">
                    Protocol Architecture
                </div>
                <h1 className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter leading-none">
                    ENGINEERED <br />
                    <span className="text-[#39ff14] italic underline decoration-white/20 underline-offset-8">GHOSTS</span>
                </h1>
                <p className="max-w-3xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed">
                    A decentralized orchestration layer that turns idle hardware into a global supercomputer.
                    Experience the Ghost Protocol workflow.
                </p>
            </motion.div>
        </div>
    </section>
);

const StepSection = ({ number, title, desc, icon: Icon, features, reverse = false }: any) => (
    <MotionSection className="border-b border-white/5 bg-[#030303]">
        <div className="container mx-auto px-6">
            <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 md:gap-24`}>
                <div className="flex-1 w-full">
                    <div className="relative">
                        <div className="absolute -top-12 -left-8 text-[12rem] font-black text-[#39ff14]/5 select-none leading-none">
                            0{number}
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                                <Icon className="text-[#39ff14] w-8 h-8" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{title}</h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-2 border-[#39ff14]/20 pl-6">
                                {desc}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {features.map((f: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-gray-500 hover:text-[#39ff14] transition-colors cursor-default">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14]/50" />
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-br from-[#39ff14]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-1 shadow-2xl overflow-hidden aspect-video">
                            <div className="absolute inset-0 bg-[#050505] rounded-[2.4rem] m-[1px] flex items-center justify-center">
                                {/* Dynamic Graphic */}
                                <div className="relative w-full h-full p-8 flex flex-col items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1">
                                            {[...Array(64)].map((_, i) => (
                                                <div key={i} className="bg-[#39ff14] rounded-sm" style={{ opacity: Math.random() }} />
                                            ))}
                                        </div>
                                    </div>
                                    <Icon className="w-24 h-24 text-[#39ff14] z-10 drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]" />
                                    <div className="mt-6 text-[0.6rem] font-mono text-[#39ff14]/40 uppercase tracking-[0.5em] text-center">
                                        System Status: Operational <br /> Secure Socket established
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </MotionSection>
);

const ArchitectureVisualizer = () => {
    return (
        <MotionSection className="bg-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(57,255,20,0.03),transparent_40%)]" />
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">THE <span className="text-[#39ff14]">INFRASTRUCTURE</span> STACK</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">A multi-layered defense and execution environment built for the future of decentralized computing.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Terminal, title: "Ghost CLI", color: "bg-blue-500/10 border-blue-500/20 text-blue-400", desc: "Command line interface for managing clusters and nodes." },
                        { icon: Boxes, title: "Orchestrator", color: "bg-purple-500/10 border-purple-500/20 text-purple-400", desc: "AI-driven task distribution and load balancing engine." },
                        { icon: Lock, title: "TEE Enclaves", color: "bg-[#39ff14]/10 border-[#39ff14]/20 text-[#39ff14]", desc: "Hardware-isolated execution zones for secure computation." },
                        { icon: Globe, title: "Edge Relay", color: "bg-orange-500/10 border-orange-500/20 text-orange-400", desc: "Global distribution network for low-latency delivery." }
                    ].map((item, i) => (
                        <div key={i} className={`p-8 rounded-3xl border ${item.color.split(' ')[1]} ${item.color.split(' ')[0]} transition-all hover:scale-105 group`}>
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-4">{item.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </MotionSection>
    );
};

const SecurityDeepDive = () => {
    return (
        <MotionSection className="bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2">
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
                            SECURITY <br /> <span className="text-[#39ff14]">HARDENED</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                { title: "End-to-End Sharding", desc: "Files and scripts are never stored in one place. They exist as entropy shards across the globe." },
                                { title: "Biometric Attestation", desc: "Nodes must prove their identity and integrity through hardware-level attestation." },
                                { title: "Zero Memory Trace", desc: "Upon completion, execution environments are instantly wiped, leaving no digital footprint." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="mt-1 w-6 h-6 rounded-full border border-[#39ff14] flex items-center justify-center flex-shrink-0">
                                        <div className="w-2 h-2 bg-[#39ff14] rounded-full" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                                        <p className="text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-[#39ff14]/5 to-transparent border border-[#39ff14]/10 shadow-[0_0_50px_rgba(57,255,20,0.05)]">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-black border border-white/5 flex flex-col items-center text-center">
                                    <ShieldCheck className="text-[#39ff14] mb-4 w-10 h-10" />
                                    <div className="text-2xl font-bold text-white">99.9%</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Uptime Goal</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-black border border-white/5 flex flex-col items-center text-center">
                                    <Activity className="text-blue-400 mb-4 w-10 h-10" />
                                    <div className="text-2xl font-bold text-white">256-bit</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Entropy</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-black border border-white/5 flex flex-col items-center text-center">
                                    <Zap className="text-yellow-400 mb-4 w-10 h-10" />
                                    <div className="text-2xl font-bold text-white">12ms</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Response</div>
                                </div>
                                <div className="p-6 rounded-2xl bg-black border border-white/5 flex flex-col items-center text-center">
                                    <HardDrive className="text-purple-400 mb-4 w-10 h-10" />
                                    <div className="text-2xl font-bold text-white">50PB+</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Storage Capacity</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const NetworkTopologyMap = () => {
    return (
        <MotionSection className="bg-black">
            <div className="container mx-auto px-6">
                <div className="bg-[#111] rounded-[4rem] p-12 md:p-20 relative overflow-hidden border border-white/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.05),transparent_70%)]" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[#39ff14] font-black uppercase tracking-[0.4em] text-xs mb-6 block">Global Reach</span>
                            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">Decentralized <br /> <span className="italic">Topology</span></h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-10">
                                Unlike centralized clouds that rely on a few massive data centers, Anchor's network is woven into the very fabric of the internet. Every node acts as both a provider and a verifier.
                            </p>
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-3xl font-bold text-white">142+</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-tighter mt-1">Countries</div>
                                </div>
                                <div className="w-px h-12 bg-white/10" />
                                <div>
                                    <div className="text-3xl font-bold text-[#39ff14]">1.2M</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-tighter mt-1">Active Nodes</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-[400px] flex items-center justify-center">
                            {/* Abstract Map Graphic */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                <div className="w-full h-full rounded-full border border-dashed border-[#39ff14]/20 animate-[spin_60s_linear_infinite]" />
                                <div className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-[#39ff14]/10 animate-[spin_40s_linear_reverse_infinite]" />
                            </div>
                            <Globe className="w-64 h-64 text-[#39ff14] opacity-80" />
                            {/* Animated "Pings" */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#39ff14] rounded-full animate-ping" />
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const HowItWorksPage = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
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
                <HowHero />

                <StepSection
                    number={1}
                    icon={Cpu}
                    title="Node Onboarding"
                    desc="Any device with computing power can join the Ghost Cloud Network. Whether it's a high-end server or an idle workstation, our lightweight agent transforms it into a secure network node."
                    features={["Automated Hardware Scouting", "Resource Capability Analysis", "Secure Identity Minting", "Uptime Monitoring"]}
                />

                <StepSection
                    number={2}
                    icon={Share2}
                    reverse
                    title="Workload Fragmentation"
                    desc="When a task is deployed, the Ghost Controller shards the data and execution script into hundreds of encrypted fragments. No single node ever sees the full picture."
                    features={["AES-512 Sharding", "Data Entropy Injection", "Redundancy Encoding", "Asynchronous Delivery"]}
                />

                <ArchitectureVisualizer />

                <StepSection
                    number={3}
                    icon={ShieldCheck}
                    title="Encapsulated Execution"
                    desc="Fragments are executed within hardware-isolated 'Safe Zones' or TEEs (Trusted Execution Environments). This prevents the host machine from accessing the running memory."
                    features={["Intel SGX Support", "AMD SEV Integration", "Virtual Enclave Logic", "Zero-Memory-Trace"]}
                />

                <SecurityDeepDive />

                <StepSection
                    number={4}
                    icon={Layers}
                    reverse
                    title="Dynamic Orchestration"
                    desc="Our AI-driven orchestration layer constantly shifts workloads between nodes based on latency, performance, and security health. It's a living, breathing cloud."
                    features={["Predictive Load Balancing", "Auto-Healing Nodes", "Latency-Optimized Routing", "Self-Scaling Clusters"]}
                />

                <NetworkTopologyMap />

                <StepSection
                    number={5}
                    icon={Activity}
                    title="Consensus & Output"
                    desc="Nodes return encrypted results which are verified through our Proof-of-Execution protocol. Once consensus is reached, the output is reconstructed for the end-user."
                    features={["Multi-Node Verification", "Byzantine Fault Tolerance", "Atomic Result Merging", "Instant Finality"]}
                />
            </main>

            <footer className="py-24 border-t border-white/5 text-center bg-[#050505]">
                <div className="container mx-auto px-6">
                    <h3 className="text-3xl font-black mb-8">ANCHOR.</h3>
                    <div className="flex justify-center gap-12 text-gray-500 uppercase tracking-widest text-xs font-bold mb-12">
                        <button onClick={() => onNavigate('landing')} className="hover:text-[#39ff14] transition-colors">Hero</button>
                        <button onClick={() => onNavigate('features')} className="hover:text-[#39ff14] transition-colors">Features</button>
                        <button onClick={() => onNavigate('how-it-works')} className="hover:text-[#39ff14] transition-colors underline underline-offset-8 decoration-[#39ff14]">How It Works</button>
                        <button onClick={() => onNavigate('network')} className="hover:text-[#39ff14] transition-colors">Network</button>
                        <button onClick={() => onNavigate('patron')} className="hover:text-[#39ff14] transition-colors">Patron</button>
                    </div>
                    <p className="text-gray-700 text-xs font-medium tracking-[0.4em]">© 2026 GHOST CLOUD NETWORK PROTOCOL. TECHNICAL DOCS V2.4</p>
                </div>
            </footer>
        </div>
    );
};

export default HowItWorksPage;
