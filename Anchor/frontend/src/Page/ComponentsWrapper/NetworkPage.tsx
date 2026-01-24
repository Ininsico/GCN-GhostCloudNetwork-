import { motion, useScroll, useSpring } from 'framer-motion';
import { Globe, Server, Activity, Shield, Zap, Database, Radio, Cpu, Share2, TrendingUp, BarChart2, Lock, Eye, Network, ArrowRight, CheckCircle, Wifi, HardDrive, Users } from 'lucide-react';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

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

const NetworkHero = () => (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden pt-20 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(57,255,20,0.08),transparent_60%)]" />
        {/* Animated Cyber-Spider-Web Background */}
        <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="#39ff14" />
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#39ff14" strokeWidth="0.5" strokeDasharray="5,5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#39ff14]/30 bg-[#39ff14]/5 text-[#39ff14] text-xs font-black uppercase tracking-[0.4em] mb-8">
                    <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
                    Live Network Status: Nominal
                </div>
                <h1 className="text-7xl md:text-[10rem] font-black text-white mb-6 tracking-tightest leading-[0.85]">
                    THE <span className="text-[#39ff14] italic">ANCHOR</span> <br /> MESH
                </h1>
                <p className="max-w-3xl mx-auto text-gray-500 text-xl md:text-2xl leading-relaxed mt-8 font-light">
                    A planetary-scale decentralized infrastructure. 1.2 million edges, 0 centralized points of failure.
                </p>
            </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-10 left-0 right-0 py-10 border-y border-white/5 backdrop-blur-sm">
            <div className="container mx-auto px-6 flex flex-wrap justify-between gap-10">
                {[
                    { label: "Total Nodes", value: "1,248,392" },
                    { label: "Active Bandwidth", value: "48.2 PB/s" },
                    { label: "Avg Latency", value: "4.8ms" },
                    { label: "Network Health", value: "99.999%" }
                ].map((stat, i) => (
                    <div key={i} className="flex flex-col">
                        <span className="text-gray-600 uppercase text-[0.6rem] font-black tracking-[0.3em] mb-1">{stat.label}</span>
                        <span className="text-white text-2xl font-bold font-mono tracking-tighter">{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const GlobalNodes = () => {
    return (
        <MotionSection className="bg-[#050505] overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-5xl font-bold text-white mb-8">GEOGRAPHIC <br /><span className="text-[#39ff14]">ABSTRACTION</span></h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-10">
                            Our network doesn't live in data centers. It lives in the spaces between. Anchor nodes are distributed across autonomous zones, residential ISPs, and satellite links, creating a truly un-killable mesh.
                        </p>
                        <div className="space-y-6">
                            {[
                                { region: "North America", nodes: "412k", percent: 85 },
                                { region: "Europe", nodes: "389k", percent: 92 },
                                { region: "Asia Pacific", nodes: "295k", percent: 74 },
                                { region: "Rest of World", nodes: "152k", percent: 68 }
                            ].map((reg, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-bold">{reg.region}</span>
                                        <span className="text-gray-500">{reg.nodes} Nodes</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${reg.percent}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="h-full bg-[#39ff14]"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-full border border-[#39ff14]/10 flex items-center justify-center p-12 relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.05),transparent_70%)] animate-pulse" />
                            <Globe className="w-full h-full text-[#39ff14] opacity-20" />
                            {/* Node clusters visualizer */}
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                                    className="absolute w-1 h-1 bg-[#39ff14] rounded-full shadow-[0_0_10px_#39ff14]"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const NodeTiers = () => {
    return (
        <MotionSection>
            <div className="container mx-auto px-6 text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">NODE <span className="text-[#39ff14]">HIERARCHY</span></h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Not all anchors are created equal. Our network categorizes nodes based on hardware telemetry and reliability history.</p>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        title: "Spectre",
                        icon: Radio,
                        desc: "Residential & IoT nodes providing the vast coverage mesh. Optimized for high-latency, stateless relaying.",
                        stats: ["1.1M Nodes", "100Mbps Avg", "Stateless"]
                    },
                    {
                        title: "Phantom",
                        icon: Server,
                        desc: "High-performance workstations and local servers. Dedicated for sharded compute and sharded storage.",
                        stats: ["120k Nodes", "1Gbps Avg", "SGX Enabled"],
                        featured: true
                    },
                    {
                        title: "Anchor",
                        icon: Database,
                        desc: "Bare-metal clusters and backbone providers. Used for heavy AI processing and large-scale data retrieval.",
                        stats: ["28k Nodes", "10Gbps+ Avg", "GPU Clusters"]
                    }
                ].map((tier, i) => (
                    <div key={i} className={`p-10 rounded-[3rem] border ${tier.featured ? 'border-[#39ff14] bg-[#39ff14]/5' : 'border-white/5 bg-[#080808]'} transition-all hover:-translate-y-2`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${tier.featured ? 'bg-[#39ff14] text-black' : 'bg-white/5 text-[#39ff14]'}`}>
                            <tier.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">{tier.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-10">{tier.desc}</p>
                        <div className="space-y-3 pt-8 border-t border-white/5">
                            {tier.stats.map((s, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-xs font-mono text-gray-400">
                                    <Activity className="w-3 h-3 text-[#39ff14]" />
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </MotionSection>
    );
};

const IncentivesLayer = () => {
    return (
        <MotionSection className="bg-black relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#39ff14]/5 blur-[120px] rounded-full" />
            <div className="container mx-auto px-6">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[4rem] p-12 md:p-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { icon: Zap, label: "Proof of Compute", value: "$GCN Reward" },
                                    { icon: Shield, label: "Uptime Bonus", value: "+15% Yield" },
                                    { icon: Cpu, label: "GPU Mining", value: "High Demand" },
                                    { icon: Share2, label: "Relay Fees", value: "Per GB" }
                                ].map((item, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-black border border-white/5">
                                        <item.icon className="text-[#39ff14] mb-4 w-6 h-6" />
                                        <div className="text-xs text-gray-600 uppercase tracking-widest mb-1">{item.label}</div>
                                        <div className="text-xl font-bold text-white">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <span className="text-[#39ff14] font-black uppercase tracking-[0.4em] text-xs mb-6 block">Tokenomics</span>
                            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">ECONOMY OF <br /> <span className="text-[#39ff14]">SHADOWS</span></h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-10">
                                The Anchor Cloud Network is powered by the $GCN utility token. Providers earn rewards by leasing their hardware to the mesh, while users burn tokens to access planetary-scale compute.
                            </p>
                            <button className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-[#39ff14] transition-all hover:scale-105">
                                View Whitepaper
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const RealTimeMap = () => {
    return (
        <MotionSection className="bg-black">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        LIVE NETWORK <span className="text-[#39ff14]">PULSE</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Watch data flow through the mesh in real-time. Every pulse represents thousands of encrypted packets.
                    </p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    <div className="aspect-video rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10 p-8 relative overflow-hidden">
                        {/* Map Background */}
                        <div className="absolute inset-0 opacity-20">
                            <Network className="w-full h-full text-[#39ff14]" />
                        </div>

                        {/* Animated Network Nodes */}
                        <div className="relative z-10 h-full flex items-center justify-center">
                            <div className="grid grid-cols-5 gap-8 w-full">
                                {[...Array(15)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1, 0.8] }}
                                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatDelay: 3 }}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div className="w-3 h-3 rounded-full bg-[#39ff14] shadow-[0_0_20px_#39ff14]" />
                                        <div className="text-[8px] text-gray-600 font-mono">NODE-{1000 + i}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Live Stats Overlay */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between">
                            {[
                                { label: "Packets/sec", value: "2.4M", icon: Zap },
                                { label: "Active Routes", value: "18.2K", icon: Share2 },
                                { label: "Bandwidth", value: "847 GB/s", icon: TrendingUp }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-3 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                    <stat.icon className="text-[#39ff14] w-4 h-4" />
                                    <div>
                                        <div className="text-white font-bold text-sm">{stat.value}</div>
                                        <div className="text-gray-500 text-[10px]">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const PerformanceMetrics = () => {
    return (
        <MotionSection className="bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <span className="text-[#39ff14] font-black uppercase tracking-[0.4em] text-xs mb-4 block">Performance Analytics</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            METRICS THAT <br /><span className="text-[#39ff14]">MATTER</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Our network is constantly self-optimizing. Every node reports telemetry data that feeds into our AI orchestration layer.
                        </p>
                        <div className="space-y-4">
                            {[
                                { metric: "Average Response Time", value: "4.2ms", change: "-12%" },
                                { metric: "Network Throughput", value: "48.2 PB/s", change: "+28%" },
                                { metric: "Node Availability", value: "99.997%", change: "+0.02%" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black border border-white/5">
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1">{item.metric}</div>
                                        <div className="text-white font-bold text-xl">{item.value}</div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#39ff14] text-sm font-bold">
                                        <TrendingUp size={16} />
                                        {item.change}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 rounded-2xl bg-black border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-white font-bold">Node Distribution</h4>
                                <BarChart2 className="text-[#39ff14]" size={20} />
                            </div>
                            <div className="space-y-4">
                                {[
                                    { type: "Spectre", count: "1.1M", percent: 88 },
                                    { type: "Phantom", count: "120K", percent: 65 },
                                    { type: "Anchor", count: "28K", percent: 42 }
                                ].map((node, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">{node.type}</span>
                                            <span className="text-white font-mono">{node.count}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${node.percent}%` }}
                                                transition={{ duration: 1, delay: i * 0.2 }}
                                                className="h-full bg-gradient-to-r from-[#39ff14] to-[#39ff14]/50"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 text-center">
                                <Wifi className="mx-auto mb-3 text-blue-400" size={24} />
                                <div className="text-2xl font-bold text-white mb-1">142+</div>
                                <div className="text-xs text-gray-500">Countries</div>
                            </div>
                            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 text-center">
                                <Users className="mx-auto mb-3 text-purple-400" size={24} />
                                <div className="text-2xl font-bold text-white mb-1">84K+</div>
                                <div className="text-xs text-gray-500">Providers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const BandwidthEconomics = () => {
    return (
        <MotionSection className="bg-black">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto bg-[#0a0a0a] rounded-3xl border border-white/10 p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            BANDWIDTH <span className="text-[#39ff14]">ECONOMICS</span>
                        </h2>
                        <p className="text-gray-500">Fair pricing for data transmission across the mesh</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { tier: "Relay Traffic", price: "$0.001", unit: "per GB", desc: "Stateless packet forwarding" },
                            { tier: "Compute Data", price: "$0.008", unit: "per GB", desc: "Workload input/output" },
                            { tier: "Storage Sync", price: "$0.003", unit: "per GB", desc: "Shard replication" }
                        ].map((tier, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-black border border-white/5 hover:border-[#39ff14]/30 transition-all">
                                <div className="text-[#39ff14] font-mono text-xs mb-2">{tier.tier}</div>
                                <div className="text-3xl font-bold text-white mb-1">{tier.price}</div>
                                <div className="text-gray-500 text-sm mb-4">{tier.unit}</div>
                                <div className="text-gray-600 text-xs">{tier.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-4 p-6 rounded-xl bg-[#39ff14]/5 border border-[#39ff14]/20">
                        <HardDrive className="text-[#39ff14]" size={24} />
                        <div className="text-white">
                            <span className="font-bold">Volume Discounts:</span> Enterprises processing 100TB+ monthly get up to 40% off
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const SecurityLayers = () => {
    return (
        <MotionSection className="bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        MULTI-LAYER <span className="text-[#39ff14]">DEFENSE</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Security isn't an afterthought. It's woven into every layer of the network stack.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {[
                        {
                            layer: "Layer 1: Transport",
                            icon: Lock,
                            features: ["End-to-end TLS 1.3", "Perfect forward secrecy", "Certificate pinning"]
                        },
                        {
                            layer: "Layer 2: Identity",
                            icon: Eye,
                            features: ["Zero-knowledge proofs", "Hardware attestation", "Biometric node signing"]
                        },
                        {
                            layer: "Layer 3: Data",
                            icon: Shield,
                            features: ["AES-256-GCM encryption", "Shard-level isolation", "Automatic key rotation"]
                        },
                        {
                            layer: "Layer 4: Network",
                            icon: Network,
                            features: ["DDoS mitigation", "Traffic obfuscation", "Onion routing"]
                        }
                    ].map((layer, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="flex gap-6 p-6 rounded-2xl bg-black border border-white/5 hover:border-[#39ff14]/20 transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#39ff14]/10 flex items-center justify-center flex-shrink-0">
                                <layer.icon className="text-[#39ff14]" size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold text-lg mb-3">{layer.layer}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {layer.features.map((feat, j) => (
                                        <span key={j} className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-xs border border-white/5">
                                            {feat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </MotionSection>
    );
};

const JoinNetworkCTA = () => {
    return (
        <MotionSection className="bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.1),transparent_70%)]" />
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        BECOME AN <br /><span className="text-[#39ff14]">ANCHOR</span>
                    </h2>
                    <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
                        Turn your idle hardware into a revenue stream. Join 84,000+ node providers earning $GCN tokens.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { step: "1", title: "Install Agent", desc: "One-line install on any OS" },
                            { step: "2", title: "Verify Hardware", desc: "Automated capability check" },
                            { step: "3", title: "Start Earning", desc: "Instant $GCN rewards" }
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
                                <div className="w-12 h-12 rounded-full bg-[#39ff14] text-black font-black text-xl flex items-center justify-center mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h4 className="text-white font-bold mb-2">{item.title}</h4>
                                <p className="text-gray-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 rounded-2xl bg-[#39ff14] text-black font-black uppercase tracking-widest text-sm hover:bg-white transition-all hover:scale-105 flex items-center justify-center gap-2">
                            Get Started
                            <ArrowRight size={18} />
                        </button>
                        <button className="px-8 py-4 rounded-2xl bg-transparent border-2 border-white/20 text-white font-black uppercase tracking-widest text-sm hover:border-[#39ff14] transition-all flex items-center justify-center gap-2">
                            <CheckCircle size={18} />
                            View Requirements
                        </button>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const NetworkProtocols = () => {
    return (
        <MotionSection className="bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-7xl font-bold text-white mb-6">CORE <span className="text-[#39ff14]">MESH</span> PROTOCOLS</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
                    {[
                        { title: "Anchor-P2P", desc: "Proprietary UDP-based transport protocol for NAT-bypassing node communication." },
                        { title: "Shadow-Query", desc: "Encrypted distributed hash table (DHT) for node discovery without central trackers." },
                        { title: "Anchor-Auth", desc: "Elliptic curve based zero-knowledge identity system for node authentication." },
                        { title: "Pulsar-Flow", desc: "AI load balancer that predicts node congestion and reroutes traffic in < 1ms." }
                    ].map((p, i) => (
                        <div key={i} className="group p-10 bg-black/40 border border-white/5 hover:bg-[#39ff14]/5 transition-all duration-500">
                            <div className="text-[#39ff14] font-mono mb-6">0{i + 1}</div>
                            <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-[#39ff14] transition-colors">{p.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </MotionSection>
    );
};

const NetworkPage = () => {
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
            <Header />

            <main>
                <NetworkHero />
                <GlobalNodes />
                <NodeTiers />
                <RealTimeMap />
                <PerformanceMetrics />
                <IncentivesLayer />
                <BandwidthEconomics />
                <SecurityLayers />
                <NetworkProtocols />
                <JoinNetworkCTA />
            </main>

            <Footer />
        </div>
    );
};

export default NetworkPage;
