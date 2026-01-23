import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Cpu, Lock, Zap, Share2, Server, Terminal, Shield, Globe, Activity, BarChart3, Code, Gauge, DollarSign, TrendingDown, Layers, Rocket, Package, Workflow, LineChart, PieChart } from 'lucide-react';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

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
                    Deep dive into the architecture that powers the Anchor Cloud Network.
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
                        <h3 className="text-4xl font-bold text-white mb-8">The Anchor Edge Protocol</h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Unlike traditional CDNs, Anchor uses a proprietary Anchor Edge Protocol that operates at Layer 2. This allows for direct hardware-to-socket communication, bypassing standard OS bottlenecks.
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
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 underline decoration-[#39ff14]/30">ANCHOR PRIVACY <span className="italic">STACK</span></h2>
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
                                    <p className="text-gray-400">Direct PCIe pass-through for AI workloads. Deploy LLMs or rendering engines across the Anchor Cloud with one click.</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-3">
                                        <Terminal className="text-[#39ff14] w-5 h-5" />
                                        Anchor CLI
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
                                        <p className="text-white">Authenticating with Anchor Protocol...</p>
                                        <p>$ anchor deploy --cluster v2-proxy</p>
                                        <p className="text-white">Success! Endpoint: anchor-a7.anchor.net</p>
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

const AnalyticsSection = () => {
    return (
        <MotionSection>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-[#39ff14] font-black tracking-widest uppercase text-sm mb-4 block">Real-Time Intelligence</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            OBSERVABILITY <br />
                            <span className="text-[#39ff14] italic">AT SCALE</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Monitor every aspect of your infrastructure with millisecond precision. Our analytics engine processes billions of events per second, giving you unprecedented visibility into your distributed workloads.
                        </p>
                        <div className="space-y-4">
                            {[
                                { icon: Activity, title: "Live Metrics Stream", desc: "Real-time CPU, memory, network, and disk I/O metrics with sub-second granularity" },
                                { icon: BarChart3, title: "Predictive Analytics", desc: "AI-powered forecasting to predict resource bottlenecks before they happen" },
                                { icon: LineChart, title: "Custom Dashboards", desc: "Build unlimited dashboards with drag-and-drop widgets and custom queries" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#39ff14]/20 transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-[#39ff14]/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="text-[#39ff14] w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                        <p className="text-gray-500 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#39ff14]/20 via-transparent to-transparent rounded-3xl blur-2xl" />
                        <div className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/10">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-white font-bold">Network Performance</h4>
                                <span className="text-xs text-gray-500 font-mono">Last 24h</span>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { label: "Throughput", value: "847 GB/s", percent: 94, color: "#39ff14" },
                                    { label: "Request Rate", value: "2.4M req/s", percent: 78, color: "#00d4ff" },
                                    { label: "Cache Hit Ratio", value: "99.2%", percent: 99, color: "#ff00ff" },
                                    { label: "P99 Latency", value: "4.2ms", percent: 65, color: "#ffaa00" }
                                ].map((metric, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-400 text-sm">{metric.label}</span>
                                            <span className="text-white font-bold text-sm">{metric.value}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${metric.percent}%` }}
                                                transition={{ duration: 1, delay: idx * 0.1 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: metric.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 p-4 rounded-xl bg-[#39ff14]/5 border border-[#39ff14]/20">
                                <div className="flex items-center gap-3">
                                    <PieChart className="text-[#39ff14] w-5 h-5" />
                                    <div>
                                        <p className="text-white font-bold text-sm">System Health: Optimal</p>
                                        <p className="text-gray-500 text-xs">All nodes operating within normal parameters</p>
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

const DeveloperExperience = () => {
    return (
        <MotionSection className="bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        BUILT FOR <span className="text-[#39ff14] italic">DEVELOPERS</span>
                    </h2>
                    <p className="text-gray-500 max-w-3xl mx-auto text-lg">
                        Ship faster with our comprehensive SDK, REST APIs, and pre-built integrations. From prototype to production in minutes, not months.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { icon: Code, title: "Multi-Language SDKs", desc: "JavaScript, Python, Go, Rust, and more", color: "from-blue-500/10 to-transparent", border: "border-blue-500/20" },
                        { icon: Package, title: "NPM Packages", desc: "Install with one command, deploy in seconds", color: "from-red-500/10 to-transparent", border: "border-red-500/20" },
                        { icon: Workflow, title: "CI/CD Integration", desc: "GitHub Actions, GitLab, Jenkins ready", color: "from-purple-500/10 to-transparent", border: "border-purple-500/20" },
                        { icon: Rocket, title: "Instant Deployment", desc: "Zero-config deployments with auto-detection", color: "from-[#39ff14]/10 to-transparent", border: "border-[#39ff14]/20" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} hover:scale-105 transition-transform`}
                        >
                            <item.icon className="text-white w-8 h-8 mb-4" />
                            <h4 className="text-white font-bold mb-2">{item.title}</h4>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10">
                            <h4 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                                <Terminal className="text-[#39ff14] w-5 h-5" />
                                Quick Start Example
                            </h4>
                            <div className="bg-black/60 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                                <pre className="text-gray-400">
                                    <code>
                                        {`import { Anchor } from '@anchor/sdk';

const anchor = new Anchor({
  apiKey: process.env.ANCHOR_KEY
});

// Deploy your app
await anchor.deploy({
  name: 'my-app',
  image: 'node:18',
  port: 3000,
  scale: { min: 3, max: 50 }
});

// ✅ Live in 30 seconds`}
                                    </code>
                                </pre>
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10">
                            <h4 className="text-white font-bold text-xl mb-4">Developer Tools</h4>
                            <div className="space-y-4">
                                {[
                                    { name: "REST API", status: "v2.4 Stable", badge: "99.99% Uptime" },
                                    { name: "GraphQL API", status: "Beta", badge: "Real-time Subscriptions" },
                                    { name: "WebSocket API", status: "Live", badge: "Bi-directional" },
                                    { name: "CLI Tool", status: "v3.1", badge: "Cross-platform" }
                                ].map((tool, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                        <div>
                                            <p className="text-white font-bold text-sm">{tool.name}</p>
                                            <p className="text-gray-500 text-xs">{tool.status}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-[#39ff14]/10 text-[#39ff14] text-xs font-bold">
                                            {tool.badge}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const ScalabilitySection = () => {
    return (
        <MotionSection>
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block px-6 py-2 rounded-full border border-[#39ff14]/30 bg-[#39ff14]/5 text-[#39ff14] text-xs font-black uppercase tracking-[0.3em] mb-6">
                            Infinite Scale
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            AUTO-SCALING <br />
                            <span className="text-[#39ff14]">WITHOUT LIMITS</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                            From zero to millions of requests per second. Our intelligent orchestration layer automatically scales your workloads across the global network based on real-time demand.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {[
                            { icon: Gauge, value: "0.8s", label: "Cold Start Time", desc: "Fastest in the industry" },
                            { icon: Layers, value: "10,000+", label: "Concurrent Instances", desc: "Per deployment" },
                            { icon: Activity, value: "Auto", label: "Load Balancing", desc: "Geographic routing" }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.15 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center hover:border-[#39ff14]/30 transition-all"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[#39ff14]/10 flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="text-[#39ff14] w-8 h-8" />
                                </div>
                                <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
                                <p className="text-[#39ff14] font-bold mb-2">{stat.label}</p>
                                <p className="text-gray-500 text-sm">{stat.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-10 rounded-3xl bg-[#0a0a0a] border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#39ff14]/5 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-8">Performance Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { title: "Edge Caching", desc: "Automatic content caching at 1,200+ edge locations worldwide", icon: Globe },
                                    { title: "Smart Routing", desc: "AI-powered traffic routing to the lowest-latency node", icon: Zap },
                                    { title: "Health Checks", desc: "Continuous monitoring with automatic failover in <100ms", icon: Shield },
                                    { title: "Resource Pooling", desc: "Shared resource pools for instant scaling without cold starts", icon: Server }
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                            <feature.icon className="text-[#39ff14] w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">{feature.title}</h4>
                                            <p className="text-gray-500 text-sm">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const CostOptimization = () => {
    return (
        <MotionSection className="bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                PAY FOR WHAT <br />
                                <span className="text-[#39ff14]">YOU ACTUALLY USE</span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                No hidden fees, no egress charges, no surprise bills. Our transparent pricing model means you only pay for compute time, measured in milliseconds. Save 60-80% compared to traditional cloud providers.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { icon: DollarSign, title: "Per-Millisecond Billing", desc: "Only pay for actual execution time, not idle resources" },
                                    { icon: TrendingDown, title: "Volume Discounts", desc: "Automatic pricing tiers as you scale - no negotiation needed" },
                                    { icon: BarChart3, title: "Cost Analytics", desc: "Real-time cost tracking and optimization recommendations" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                        <div className="w-12 h-12 rounded-lg bg-[#39ff14]/10 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="text-[#39ff14] w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#39ff14]/10 to-transparent border border-[#39ff14]/30">
                                <h4 className="text-white font-bold text-xl mb-6">Pricing Comparison</h4>
                                <div className="space-y-4">
                                    {[
                                        { provider: "Anchor", cost: "$0.000008", unit: "per ms", savings: "—" },
                                        { provider: "AWS Lambda", cost: "$0.0000166", unit: "per ms", savings: "-52%" },
                                        { provider: "Google Cloud Run", cost: "$0.0000180", unit: "per ms", savings: "-56%" },
                                        { provider: "Azure Functions", cost: "$0.0000200", unit: "per ms", savings: "-60%" }
                                    ].map((row, idx) => (
                                        <div key={idx} className={`flex items-center justify-between p-4 rounded-xl ${idx === 0 ? 'bg-[#39ff14]/10 border border-[#39ff14]/30' : 'bg-white/[0.02] border border-white/5'}`}>
                                            <div>
                                                <p className={`font-bold ${idx === 0 ? 'text-[#39ff14]' : 'text-white'}`}>{row.provider}</p>
                                                <p className="text-gray-500 text-xs">{row.unit}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${idx === 0 ? 'text-[#39ff14]' : 'text-white'}`}>{row.cost}</p>
                                                {idx > 0 && (
                                                    <p className="text-red-400 text-xs font-bold">{row.savings}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/10">
                                <h4 className="text-white font-bold mb-4">Resource Efficiency</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">CPU Utilization</span>
                                        <span className="text-[#39ff14] font-bold text-sm">94%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Memory Efficiency</span>
                                        <span className="text-[#39ff14] font-bold text-sm">91%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">Network Optimization</span>
                                        <span className="text-[#39ff14] font-bold text-sm">97%</span>
                                    </div>
                                    <div className="pt-3 mt-3 border-t border-white/10">
                                        <p className="text-xs text-gray-500 italic">
                                            Industry average: 40-60% resource utilization
                                        </p>
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

const FeaturesPage = () => {
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
                <FeatureHero />
                <FeatureArchitecture />
                <SecurityProtocol />
                <ComputeDetails />
                <AnalyticsSection />
                <DeveloperExperience />
                <ScalabilitySection />
                <CostOptimization />
                <ComparisonSection />
            </main>

            <Footer />
        </div>
    );
};

export default FeaturesPage;
