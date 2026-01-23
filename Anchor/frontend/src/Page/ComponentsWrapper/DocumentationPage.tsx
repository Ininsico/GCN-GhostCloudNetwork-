import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Book,
    Terminal,
    Cpu,
    Shield,
    Globe,
    ChevronRight,
    Search,
    Copy,
    Check,
    Code2,
    Zap,
    Lock,
    Server,
    Network,
    Layers,
    Database,
    GitBranch,
    Settings,
    FileCode,
    Boxes,
    Radio,
    Activity
} from 'lucide-react';
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import { useNavigate } from 'react-router-dom';

const CodeBlock = ({ code, language = "bash" }: { code: string, language?: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39ff14]/20 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-[#0d0d0d] rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{language}</span>
                    <button
                        onClick={handleCopy}
                        className="text-gray-500 hover:text-[#39ff14] transition-colors p-1"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>
                <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
};

const Section = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <motion.section
        id={id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-16 scroll-mt-32"
    >
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-[#39ff14]">#</span> {title}
        </h2>
        <div className="text-gray-400 leading-relaxed space-y-4">
            {children}
        </div>
    </motion.section>
);

const DocumentationPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('introduction');
    const [searchQuery, setSearchQuery] = useState('');

    const sections = [
        {
            title: "Getting Started",
            items: [
                { id: "introduction", title: "Introduction", icon: Book },
                { id: "quickstart", title: "Quickstart", icon: Zap },
                { id: "installation", title: "Installation", icon: Terminal },
                { id: "configuration", title: "Configuration", icon: Settings },
            ]
        },
        {
            title: "Core Concepts",
            items: [
                { id: "architecture", title: "System Architecture", icon: Layers },
                { id: "ghost-edge", title: "Ghost Edge Protocol", icon: Globe },
                { id: "node-types", title: "Node Classification", icon: Server },
                { id: "sharding", title: "Data Sharding", icon: Database },
            ]
        },
        {
            title: "Security",
            items: [
                { id: "encryption", title: "Encryption Stack", icon: Lock },
                { id: "consensus", title: "POW Consensus", icon: Shield },
                { id: "tee", title: "Trusted Execution", icon: Cpu },
                { id: "zero-knowledge", title: "Zero-Knowledge Proofs", icon: Radio },
            ]
        },
        {
            title: "Development",
            items: [
                { id: "cli-reference", title: "CLI Reference", icon: Terminal },
                { id: "api-endpoints", title: "API Endpoints", icon: Network },
                { id: "sdk-usage", title: "SDK Usage", icon: Code2 },
                { id: "deployment", title: "Deployment Guide", icon: GitBranch },
            ]
        },
        {
            title: "Advanced",
            items: [
                { id: "custom-nodes", title: "Custom Node Setup", icon: Boxes },
                { id: "performance", title: "Performance Tuning", icon: Activity },
                { id: "monitoring", title: "Monitoring & Logs", icon: FileCode },
            ]
        }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Find the entry that is most visible
                const visibleEntries = entries.filter(entry => entry.isIntersecting);
                if (visibleEntries.length > 0) {
                    // Sort by intersection ratio and pick the most visible one
                    const mostVisible = visibleEntries.sort((a, b) =>
                        b.intersectionRatio - a.intersectionRatio
                    )[0];
                    setActiveSection(mostVisible.target.id);
                }
            },
            {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                rootMargin: "-20% 0px -35% 0px"
            }
        );

        // Wait for DOM to be ready
        setTimeout(() => {
            document.querySelectorAll('section[id]').forEach((section) => {
                observer.observe(section);
            });
        }, 100);

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-black text-white min-h-screen selection:bg-[#39ff14] selection:text-black">
            <Header />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-32 h-fit">
                        <div className="mb-8 relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#39ff14] transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search docs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#39ff14]/50 transition-all font-medium"
                            />
                        </div>

                        <nav className="space-y-8">
                            {sections.map((group) => (
                                <div key={group.title}>
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 px-3">
                                        {group.title}
                                    </h5>
                                    <div className="space-y-1">
                                        {group.items.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollToSection(item.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${activeSection === item.id
                                                    ? 'bg-[#39ff14]/10 text-[#39ff14]'
                                                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                                                    }`}
                                            >
                                                <item.icon size={16} className={activeSection === item.id ? 'text-[#39ff14]' : 'text-gray-500 group-hover:text-gray-300'} />
                                                {item.title}
                                                {activeSection === item.id && (
                                                    <motion.div layoutId="active-pill" className="ml-auto">
                                                        <ChevronRight size={14} />
                                                    </motion.div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 max-w-3xl">
                        <div className="mb-12">
                            <div className="flex items-center gap-2 text-[#39ff14] text-xs font-black uppercase tracking-widest mb-4">
                                <Code2 size={14} />
                                Documentation V2.4
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">
                                BEYOND THE <span className="text-[#39ff14] italic">ANCHOR</span>
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed">
                                Welcome to the technical heart of Anchor. Here we document the protocols, architectures, and APIs that power the world's most secure decentralized cloud network.
                            </p>
                        </div>

                        {/* INTRODUCTION */}
                        <Section id="introduction" title="Introduction">
                            <p>
                                Anchor is a decentralized, peer-to-peer cloud network designed for high-performance compute and absolute data sovereignty. Unlike traditional cloud providers that rely on centralized data centers, Anchor leverages a global grid of independent nodes.
                            </p>
                            <p>
                                Every interaction on the network is governed by the <span className="text-white font-bold">Anchor Protocol</span>, a proprietary Layer 2 communication stack that ensures Zero-Knowledge operations and near-zero latency.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#39ff14]/30 transition-all">
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <Shield size={16} className="text-[#39ff14]" />
                                        Security First
                                    </h4>
                                    <p className="text-sm">Double-blind encryption at every hop. Never trust, always verify.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#39ff14]/30 transition-all">
                                    <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <Zap size={16} className="text-[#39ff14]" />
                                        High Performance
                                    </h4>
                                    <p className="text-sm">Direct hardware access via our custom Edge Hypervisor.</p>
                                </div>
                            </div>
                        </Section>

                        {/* QUICKSTART */}
                        <Section id="quickstart" title="Quickstart">
                            <p>Ready to deploy your first Ghost instance? Follow these steps to get your environment mapped to the network.</p>
                            <ol className="list-decimal list-inside space-y-4 text-gray-400 py-4">
                                <li>Download the <span className="text-[#39ff14]">Anchor CLI</span> for your operating system.</li>
                                <li>Initialize your local environment with <code className="bg-white/10 px-2 py-0.5 rounded text-[#39ff14]">anchor init</code>.</li>
                                <li>Authenticate using your Patron or Developer keys.</li>
                                <li>Deploy your first workload to the Anchor Cloud.</li>
                            </ol>
                            <CodeBlock code={`# Install via curl
curl -fsSL https://get.anchor.net | sh

# Verify installation
anchor --version

# Initialize project
anchor init my-anchor-app
cd my-anchor-app

# Authenticate
anchor auth login`} />
                            <p className="mt-6">
                                Once authenticated, you can deploy applications, manage nodes, and monitor your network status directly from the CLI.
                            </p>
                        </Section>

                        {/* INSTALLATION */}
                        <Section id="installation" title="Installation">
                            <p>The Anchor toolchain supports Linux (Kernel 5.4+), macOS (12.0+), and Windows using WSL2.</p>

                            <h4 className="text-white font-bold mt-8 mb-3">System Requirements</h4>
                            <ul className="space-y-2">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">CPU:</strong> x86_64 or ARM64 architecture</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">RAM:</strong> Minimum 4GB (8GB recommended)</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Storage:</strong> 20GB available disk space</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Network:</strong> Stable internet connection (10Mbps+)</span>
                                </li>
                            </ul>

                            <h4 className="text-white font-bold mt-8 mb-3">Docker Integration</h4>
                            <p>For containerized workloads, we provide a native Docker plugin that redirects standard container engines to the Ghost Edge.</p>
                            <CodeBlock code={`# Install Ghost Edge Driver
docker plugin install ghost/edge-driver:latest

# Run container on Ghost Network
docker run --driver ghost-edge -d nginx

# List Ghost containers
docker ps --filter driver=ghost-edge`} language="bash" />

                            <h4 className="text-white font-bold mt-8 mb-3">NPM Package</h4>
                            <p>For JavaScript/TypeScript projects, install our SDK via npm:</p>
                            <CodeBlock code={`npm install @anchor/ghost-sdk

# or with yarn
yarn add @anchor/ghost-sdk`} language="bash" />
                        </Section>

                        {/* CONFIGURATION */}
                        <Section id="configuration" title="Configuration">
                            <p>Anchor uses a YAML-based configuration system. Create an <code className="bg-white/10 px-2 py-0.5 rounded text-[#39ff14]">anchor.config.yml</code> file in your project root:</p>
                            <CodeBlock code={`# anchor.config.yml
version: "2.4"

network:
  mode: "ghost-edge"
  region: "auto"  # or specify: us-east, eu-west, asia-pacific
  
compute:
  min_nodes: 5
  max_nodes: 50
  auto_scale: true
  
security:
  encryption: "aes-256-gcm"
  tee_required: true
  zero_knowledge: true
  
storage:
  sharding_factor: 128
  redundancy: 3
  compression: "zstd"
  
monitoring:
  enabled: true
  metrics_endpoint: "https://metrics.anchor.net"
  log_level: "info"`} language="yaml" />

                            <div className="bg-[#39ff14]/5 border border-[#39ff14]/20 p-6 rounded-2xl my-6">
                                <h4 className="text-[#39ff14] font-bold mb-2">💡 Pro Tip</h4>
                                <p className="text-sm text-gray-300">
                                    Use environment variables to override config values in production: <code className="bg-white/10 px-2 py-0.5 rounded">ANCHOR_NETWORK_MODE=ghost-edge</code>
                                </p>
                            </div>
                        </Section>

                        {/* ARCHITECTURE */}
                        <Section id="architecture" title="System Architecture">
                            <p>
                                Anchor's architecture is built on three fundamental layers that work in harmony to provide secure, distributed computing:
                            </p>

                            <div className="my-8 space-y-6">
                                <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20">
                                    <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                                        <Layers size={18} />
                                        Layer 1: Anchor Mesh Network
                                    </h4>
                                    <p className="text-sm">
                                        The foundational P2P network layer handling node discovery, routing, and communication. Uses UDP hole-punching and NAT traversal for direct peer connections.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20">
                                    <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                                        <Database size={18} />
                                        Layer 2: Distributed Storage Engine
                                    </h4>
                                    <p className="text-sm">
                                        Handles data sharding, encryption, and distribution across the network. Implements erasure coding for fault tolerance and content-addressable storage.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#39ff14]/10 to-transparent border border-[#39ff14]/20">
                                    <h4 className="text-[#39ff14] font-bold mb-3 flex items-center gap-2">
                                        <Cpu size={18} />
                                        Layer 3: Compute Orchestration
                                    </h4>
                                    <p className="text-sm">
                                        AI-driven workload scheduler that distributes compute tasks across optimal nodes based on latency, performance metrics, and security requirements.
                                    </p>
                                </div>
                            </div>
                        </Section>

                        {/* GHOST EDGE PROTOCOL */}
                        <Section id="anchor-edge" title="Anchor Edge Protocol">
                            <p>
                                The Anchor Edge Protocol (AEP) is the backbone of our communication. It operates by abstracting the TCP/IP stack into a proprietary "Encrypted Frame" system that provides:
                            </p>
                            <ul className="space-y-3 mt-4">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Stateless Routing:</strong> No node knows the full path of any packet</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Onion Encryption:</strong> Multi-layer encryption similar to Tor, but optimized for speed</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Dynamic Routing:</strong> Paths change every 30 seconds to prevent traffic analysis</span>
                                </li>
                            </ul>

                            <div className="bg-[#39ff14]/5 border border-[#39ff14]/20 p-6 rounded-2xl my-6">
                                <h4 className="text-[#39ff14] font-bold mb-2">Technical Insight</h4>
                                <p className="text-sm text-gray-300 italic">
                                    "By operating at Layer 2, we bypass standard kernel interrupts, reducing context switching by 40% compared to standard VPN or Overlay networks. This translates to sub-5ms latency globally."
                                </p>
                            </div>

                            <CodeBlock code={`// Example: Establishing a Anchor Edge connection
import { AnchorEdge } from '@anchor/anchor-sdk';

const edge = new GhostEdge({
  encryption: 'aes-256-gcm',
  routing: 'dynamic',
  hops: 5  // Number of relay nodes
});

await edge.connect();
console.log('Connected to Ghost Network');

// Send encrypted data
await edge.send({
  destination: 'ghost://node-abc123',
  payload: encryptedData,
  priority: 'high'
});`} language="typescript" />
                        </Section>

                        {/* NODE TYPES */}
                        <Section id="node-types" title="Node Classification">
                            <p>The Anchor Cloud Network categorizes nodes into three tiers based on hardware capabilities and reliability:</p>

                            <div className="space-y-6 mt-6">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
                                            <Radio className="text-gray-400" size={20} />
                                        </div>
                                        <h4 className="text-xl font-bold text-white">Spectre Nodes</h4>
                                    </div>
                                    <p className="text-sm mb-4">Residential & IoT devices providing mesh coverage. Ideal for stateless relay operations.</p>
                                    <div className="grid grid-cols-3 gap-4 text-xs">
                                        <div>
                                            <div className="text-gray-500">Count</div>
                                            <div className="text-white font-bold">1.1M+</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Avg Speed</div>
                                            <div className="text-white font-bold">100 Mbps</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Role</div>
                                            <div className="text-white font-bold">Relay</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/30">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#39ff14]/20 flex items-center justify-center">
                                            <Server className="text-[#39ff14]" size={20} />
                                        </div>
                                        <h4 className="text-xl font-bold text-white">Phantom Nodes</h4>
                                    </div>
                                    <p className="text-sm mb-4">High-performance workstations with SGX support. Handle compute and storage sharding.</p>
                                    <div className="grid grid-cols-3 gap-4 text-xs">
                                        <div>
                                            <div className="text-gray-500">Count</div>
                                            <div className="text-white font-bold">120K+</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Avg Speed</div>
                                            <div className="text-white font-bold">1 Gbps</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Role</div>
                                            <div className="text-white font-bold">Compute</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <Database className="text-purple-400" size={20} />
                                        </div>
                                        <h4 className="text-xl font-bold text-white">Anchor Nodes</h4>
                                    </div>
                                    <p className="text-sm mb-4">Bare-metal clusters with GPU acceleration. Used for AI workloads and large-scale processing.</p>
                                    <div className="grid grid-cols-3 gap-4 text-xs">
                                        <div>
                                            <div className="text-gray-500">Count</div>
                                            <div className="text-white font-bold">28K+</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Avg Speed</div>
                                            <div className="text-white font-bold">10+ Gbps</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Role</div>
                                            <div className="text-white font-bold">Heavy AI</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* DATA SHARDING */}
                        <Section id="sharding" title="Data Sharding">
                            <p>
                                Anchor implements a sophisticated sharding mechanism that splits data into encrypted fragments distributed across multiple nodes. This ensures no single node ever possesses complete data.
                            </p>

                            <h4 className="text-white font-bold mt-6 mb-3">Sharding Process</h4>
                            <ol className="list-decimal list-inside space-y-3">
                                <li><strong className="text-white">Fragmentation:</strong> Data is split into N chunks using Reed-Solomon erasure coding</li>
                                <li><strong className="text-white">Encryption:</strong> Each chunk is encrypted with a unique AES-256 key</li>
                                <li><strong className="text-white">Distribution:</strong> Chunks are distributed to geographically diverse nodes</li>
                                <li><strong className="text-white">Redundancy:</strong> K additional parity chunks are created for fault tolerance</li>
                            </ol>

                            <CodeBlock code={`// Sharding configuration example
const shardConfig = {
  totalShards: 128,        // N: Total data chunks
  parityShards: 32,        // K: Redundancy chunks
  minShardsToReconstruct: 96,  // Minimum needed to rebuild
  encryptionAlgorithm: 'aes-256-gcm',
  distributionStrategy: 'geographic-diverse'
};

// Upload with automatic sharding
await anchor.storage.upload('myfile.dat', {
  sharding: shardConfig,
  ttl: 86400  // 24 hours
});`} language="javascript" />
                        </Section>

                        {/* ENCRYPTION */}
                        <Section id="encryption" title="Encryption Stack">
                            <p>Anchor utilizes a multi-layered encryption approach that protects data at rest, in transit, and during computation:</p>
                            <ul className="space-y-4 mt-4">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Transport Layer:</strong> AES-256-GCM with rotating ephemeral keys (refreshed every 30s)</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Storage Layer:</strong> ChaCha20-Poly1305 with user-held master keys stored in hardware security modules</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Identity Layer:</strong> Ed25519 signatures for all command authorizations and node authentication</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Compute Layer:</strong> Homomorphic encryption for processing encrypted data without decryption</span>
                                </li>
                            </ul>

                            <CodeBlock code={`// Generate encryption keys
const keyPair = await anchor.crypto.generateKeyPair('ed25519');

// Encrypt data with hybrid encryption
const encrypted = await anchor.crypto.encrypt(data, {
  algorithm: 'aes-256-gcm',
  publicKey: recipientPublicKey,
  ephemeral: true  // Use one-time session key
});

// Sign transaction
const signature = await anchor.crypto.sign(transaction, keyPair.privateKey);`} language="javascript" />
                        </Section>

                        {/* CONSENSUS */}
                        <Section id="consensus" title="Proof of Work Consensus">
                            <p>
                                The Anchor Cloud Network uses a modified Proof of Work (PoW) consensus mechanism called <strong className="text-white">Proof of Execution (PoE)</strong>. Unlike traditional blockchain PoW, PoE validates that compute tasks were actually performed correctly.
                            </p>

                            <h4 className="text-white font-bold mt-6 mb-3">How PoE Works</h4>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5 border-l-4 border-[#39ff14]">
                                    <strong className="text-white">Step 1:</strong> Task is distributed to multiple nodes
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border-l-4 border-[#39ff14]">
                                    <strong className="text-white">Step 2:</strong> Nodes execute and return encrypted results + proof of work
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border-l-4 border-[#39ff14]">
                                    <strong className="text-white">Step 3:</strong> Validator nodes verify results match (Byzantine Fault Tolerance)
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border-l-4 border-[#39ff14]">
                                    <strong className="text-white">Step 4:</strong> Consensus reached when 2/3+ nodes agree on result
                                </div>
                            </div>
                        </Section>

                        {/* TEE */}
                        <Section id="tee" title="Trusted Execution Environments">
                            <p>
                                Anchor leverages hardware-based Trusted Execution Environments (TEEs) to ensure code runs in isolated, tamper-proof enclaves. We support:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                    <h4 className="text-blue-400 font-bold mb-2">Intel SGX</h4>
                                    <p className="text-sm">Software Guard Extensions for x86 processors. Provides hardware-level memory encryption.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                                    <h4 className="text-red-400 font-bold mb-2">AMD SEV</h4>
                                    <p className="text-sm">Secure Encrypted Virtualization for AMD EPYC processors. VM-level isolation.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
                                    <h4 className="text-green-400 font-bold mb-2">ARM TrustZone</h4>
                                    <p className="text-sm">Hardware isolation for ARM processors. Used in mobile and edge devices.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                                    <h4 className="text-purple-400 font-bold mb-2">Virtual TEE</h4>
                                    <p className="text-sm">Software-based enclave for systems without hardware TEE support.</p>
                                </div>
                            </div>

                            <CodeBlock code={`// Deploy to TEE-enabled nodes only
await anchor.deploy({
  image: 'my-secure-app:latest',
  requirements: {
    tee: 'intel-sgx',  // or 'amd-sev', 'arm-trustzone'
    attestation: true,
    memory: '4GB'
  }
});`} language="javascript" />
                        </Section>

                        {/* ZERO KNOWLEDGE */}
                        <Section id="zero-knowledge" title="Zero-Knowledge Proofs">
                            <p>
                                Anchor implements zk-SNARKs (Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge) to allow nodes to prove they performed computations correctly without revealing the actual data.
                            </p>

                            <div className="bg-[#39ff14]/5 border border-[#39ff14]/20 p-6 rounded-2xl my-6">
                                <h4 className="text-[#39ff14] font-bold mb-2">Use Case Example</h4>
                                <p className="text-sm text-gray-300">
                                    A node can prove it sorted a million records without revealing the records themselves, or prove a transaction is valid without exposing sender/receiver details.
                                </p>
                            </div>
                        </Section>

                        {/* CLI REFERENCE */}
                        <Section id="cli-reference" title="CLI Reference">
                            <p>Complete command reference for the Anchor CLI tool:</p>

                            <div className="space-y-6 mt-6">
                                <div>
                                    <h4 className="text-white font-bold mb-3">Authentication</h4>
                                    <CodeBlock code={`# Login to Anchor network
anchor auth login

# Logout
anchor auth logout

# Show current user
anchor auth whoami

# Generate API key
anchor auth generate-key --name "production-key"`} />
                                </div>

                                <div>
                                    <h4 className="text-white font-bold mb-3">Deployment</h4>
                                    <CodeBlock code={`# Deploy application
anchor deploy --config anchor.config.yml

# Deploy with custom settings
anchor deploy --nodes 10 --region us-east --tee required

# List deployments
anchor list

# Get deployment status
anchor status <deployment-id>

# Stop deployment
anchor stop <deployment-id>

# Delete deployment
anchor delete <deployment-id>`} />
                                </div>

                                <div>
                                    <h4 className="text-white font-bold mb-3">Node Management</h4>
                                    <CodeBlock code={`# Register as node provider
anchor node register --type phantom

# Start node
anchor node start

# Check node health
anchor node health

# View earnings
anchor node earnings

# Withdraw rewards
anchor node withdraw --amount 100 --address 0x...`} />
                                </div>

                                <div>
                                    <h4 className="text-white font-bold mb-3">Monitoring</h4>
                                    <CodeBlock code={`# View logs
anchor logs <deployment-id> --follow

# Get metrics
anchor metrics <deployment-id>

# Network status
anchor network status

# List available nodes
anchor network nodes --region eu-west`} />
                                </div>
                            </div>
                        </Section>

                        {/* API ENDPOINTS */}
                        <Section id="api-endpoints" title="API Endpoints">
                            <p>REST API reference for programmatic access to Anchor services:</p>

                            <h4 className="text-white font-bold mt-6 mb-3">Base URL</h4>
                            <CodeBlock code={`https://api.anchor.net/v2`} language="text" />

                            <h4 className="text-white font-bold mt-6 mb-3">Authentication</h4>
                            <p>All API requests require an API key in the Authorization header:</p>
                            <CodeBlock code={`Authorization: Bearer YOUR_API_KEY`} language="text" />

                            <h4 className="text-white font-bold mt-6 mb-3">Endpoints</h4>

                            <div className="space-y-6">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">POST</span>
                                        <code className="text-[#39ff14]">/deploy</code>
                                    </div>
                                    <p className="text-sm mb-3">Deploy a new application to the Anchor Network</p>
                                    <CodeBlock code={`{
  "image": "nginx:latest",
  "config": {
    "nodes": 5,
    "region": "auto",
    "tee": true
  }
}`} language="json" />
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold">GET</span>
                                        <code className="text-[#39ff14]">/deployments/:id</code>
                                    </div>
                                    <p className="text-sm mb-3">Get deployment status and details</p>
                                    <CodeBlock code={`{
  "id": "dep_abc123",
  "status": "running",
  "nodes": 5,
  "uptime": "99.98%",
  "endpoint": "ghost://abc123.anchor.net"
}`} language="json" />
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs font-bold">PUT</span>
                                        <code className="text-[#39ff14]">/deployments/:id/scale</code>
                                    </div>
                                    <p className="text-sm mb-3">Scale deployment up or down</p>
                                    <CodeBlock code={`{
  "nodes": 10
}`} language="json" />
                                </div>

                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold">DELETE</span>
                                        <code className="text-[#39ff14]">/deployments/:id</code>
                                    </div>
                                    <p className="text-sm">Terminate a deployment</p>
                                </div>
                            </div>
                        </Section>

                        {/* SDK USAGE */}
                        <Section id="sdk-usage" title="SDK Usage">
                            <p>The Anchor SDK provides a high-level interface for interacting with the Anchor Network:</p>

                            <h4 className="text-white font-bold mt-6 mb-3">Installation</h4>
                            <CodeBlock code={`npm install @anchor/ghost-sdk`} />

                            <h4 className="text-white font-bold mt-6 mb-3">Basic Usage</h4>
                            <CodeBlock code={`import { Anchor } from '@anchor/ghost-sdk';

// Initialize client
const anchor = new Anchor({
  apiKey: process.env.ANCHOR_API_KEY,
  network: 'mainnet'  // or 'testnet'
});

// Deploy application
const deployment = await anchor.deploy({
  image: 'my-app:latest',
  config: {
    nodes: 5,
    region: 'us-east',
    tee: true
  }
});

console.log('Deployed:', deployment.endpoint);

// Monitor deployment
deployment.on('status', (status) => {
  console.log('Status:', status);
});

// Scale deployment
await deployment.scale(10);

// Get metrics
const metrics = await deployment.getMetrics();
console.log('CPU:', metrics.cpu);
console.log('Memory:', metrics.memory);

// Terminate
await deployment.terminate();`} language="typescript" />

                            <h4 className="text-white font-bold mt-6 mb-3">Storage Operations</h4>
                            <CodeBlock code={`// Upload file with automatic sharding
const file = await anchor.storage.upload('./data.json', {
  encryption: 'aes-256',
  sharding: 128,
  ttl: 86400  // 24 hours
});

console.log('File ID:', file.id);

// Download file
const data = await anchor.storage.download(file.id);

// List files
const files = await anchor.storage.list();

// Delete file
await anchor.storage.delete(file.id);`} language="typescript" />
                        </Section>

                        {/* DEPLOYMENT */}
                        <Section id="deployment" title="Deployment Guide">
                            <p>Step-by-step guide to deploying production applications on Anchor:</p>

                            <h4 className="text-white font-bold mt-6 mb-3">1. Prepare Your Application</h4>
                            <p>Containerize your application using Docker:</p>
                            <CodeBlock code={`# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`} language="dockerfile" />

                            <h4 className="text-white font-bold mt-6 mb-3">2. Build and Push Image</h4>
                            <CodeBlock code={`docker build -t myapp:v1.0 .
docker tag myapp:v1.0 registry.anchor.net/myapp:v1.0
docker push registry.anchor.net/myapp:v1.0`} />

                            <h4 className="text-white font-bold mt-6 mb-3">3. Create Configuration</h4>
                            <CodeBlock code={`# anchor.config.yml
version: "2.4"
name: "my-production-app"

compute:
  min_nodes: 3
  max_nodes: 20
  auto_scale: true
  
network:
  mode: "anchor-edge"
  load_balancer: true
  
security:
  tee_required: true
  encryption: "aes-256-gcm"
  
monitoring:
  enabled: true
  alerts:
    - type: "cpu"
      threshold: 80
      action: "scale_up"
    - type: "memory"
      threshold: 90
      action: "alert"`} language="yaml" />

                            <h4 className="text-white font-bold mt-6 mb-3">4. Deploy</h4>
                            <CodeBlock code={`anchor deploy --config anchor.config.yml --env production`} />

                            <h4 className="text-white font-bold mt-6 mb-3">5. Verify Deployment</h4>
                            <CodeBlock code={`# Check status
anchor status

# View logs
anchor logs --follow

# Test endpoint
curl https://your-app.ghost.anchor.net/health`} />
                        </Section>

                        {/* CUSTOM NODES */}
                        <Section id="custom-nodes" title="Custom Node Setup">
                            <p>Become a node provider and earn $GCN tokens by contributing your hardware to the network:</p>

                            <h4 className="text-white font-bold mt-6 mb-3">Hardware Requirements</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <h5 className="text-white font-bold mb-2">Spectre Node</h5>
                                    <ul className="text-sm space-y-1">
                                        <li>• 2+ CPU cores</li>
                                        <li>• 4GB RAM</li>
                                        <li>• 50GB storage</li>
                                        <li>• 10 Mbps</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/30">
                                    <h5 className="text-white font-bold mb-2">Phantom Node</h5>
                                    <ul className="text-sm space-y-1">
                                        <li>• 8+ CPU cores</li>
                                        <li>• 16GB RAM</li>
                                        <li>• 500GB SSD</li>
                                        <li>• 100 Mbps</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <h5 className="text-white font-bold mb-2">Anchor Node</h5>
                                    <ul className="text-sm space-y-1">
                                        <li>• 32+ CPU cores</li>
                                        <li>• 64GB+ RAM</li>
                                        <li>• 2TB+ NVMe</li>
                                        <li>• 1 Gbps+</li>
                                    </ul>
                                </div>
                            </div>

                            <h4 className="text-white font-bold mt-8 mb-3">Setup Instructions</h4>
                            <CodeBlock code={`# Install node software
curl -fsSL https://node.anchor.net/install.sh | sh

# Register node
anchor node register \\
  --type phantom \\
  --wallet 0xYourWalletAddress \\
  --region us-east

# Configure resources
anchor node config \\
  --cpu 8 \\
  --memory 16GB \\
  --storage 500GB

# Start node
anchor node start

# Monitor earnings
anchor node earnings --watch`} />
                        </Section>

                        {/* PERFORMANCE */}
                        <Section id="performance" title="Performance Tuning">
                            <p>Optimize your Anchor deployments for maximum performance:</p>

                            <h4 className="text-white font-bold mt-6 mb-3">Network Optimization</h4>
                            <ul className="space-y-3">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Region Selection:</strong> Deploy to regions closest to your users</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Node Count:</strong> More nodes = better redundancy but higher cost</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] mt-2 flex-shrink-0" />
                                    <span><strong className="text-white">Caching:</strong> Enable edge caching for static content</span>
                                </li>
                            </ul>

                            <CodeBlock code={`# Performance-optimized config
compute:
  min_nodes: 5
  max_nodes: 50
  auto_scale: true
  scale_threshold:
    cpu: 70
    memory: 80
    
network:
  cdn_enabled: true
  cache_ttl: 3600
  compression: true
  
optimization:
  prefetch: true
  lazy_loading: true
  connection_pooling: true`} language="yaml" />
                        </Section>

                        {/* MONITORING */}
                        <Section id="monitoring" title="Monitoring & Logs">
                            <p>Comprehensive monitoring and logging capabilities:</p>

                            <h4 className="text-white font-bold mt-6 mb-3">Real-time Metrics</h4>
                            <CodeBlock code={`// Subscribe to metrics stream
const metrics = anchor.metrics.subscribe('dep_abc123');

metrics.on('data', (data) => {
  console.log({
    cpu: data.cpu,
    memory: data.memory,
    network: data.network,
    requests: data.requests_per_second
  });
});

// Get historical metrics
const history = await anchor.metrics.getHistory('dep_abc123', {
  from: Date.now() - 3600000,  // Last hour
  to: Date.now(),
  interval: '1m'
});`} language="javascript" />

                            <h4 className="text-white font-bold mt-6 mb-3">Log Aggregation</h4>
                            <CodeBlock code={`# Stream logs in real-time
anchor logs dep_abc123 --follow --level info

# Search logs
anchor logs dep_abc123 --search "error" --last 1h

# Export logs
anchor logs dep_abc123 --export logs.json --format json`} />

                            <div className="bg-[#39ff14]/5 border border-[#39ff14]/20 p-6 rounded-2xl my-6">
                                <h4 className="text-[#39ff14] font-bold mb-2">🔔 Alert Configuration</h4>
                                <p className="text-sm text-gray-300 mb-4">
                                    Set up alerts for critical events via webhook, email, or Slack:
                                </p>
                                <CodeBlock code={`anchor alerts create \\
  --deployment dep_abc123 \\
  --type cpu \\
  --threshold 90 \\
  --webhook https://hooks.slack.com/...`} />
                            </div>
                        </Section>

                        <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center text-sm">
                            <button
                                onClick={() => scrollToSection('introduction')}
                                className="text-gray-500 hover:text-white flex items-center gap-2 transition-colors"
                            >
                                <ChevronRight className="rotate-180" size={14} />
                                Back to Top
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="text-[#39ff14] hover:underline flex items-center gap-2 transition-all font-bold"
                            >
                                Return to Home
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </main>

                    {/* Table of Contents - Hidden on small screens */}
                    <aside className="hidden xl:block w-48 flex-shrink-0 sticky top-32 h-fit">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 px-3">
                            On This Page
                        </h5>
                        <div className="space-y-3 text-xs border-l border-white/10 ml-3">
                            {sections.flatMap(g => g.items).map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`block w-full text-left pl-4 border-l -ml-[1px] py-1 transition-all ${activeSection === item.id
                                        ? 'border-[#39ff14] text-[#39ff14] font-bold'
                                        : 'border-transparent text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {item.title}
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 p-4 rounded-xl bg-gradient-to-br from-[#39ff14]/10 to-transparent border border-[#39ff14]/20">
                            <h6 className="text-white font-bold text-xs mb-2">Need help?</h6>
                            <p className="text-[10px] text-gray-400 mb-4">Join our developer Discord for real-time support.</p>
                            <button className="w-full py-2 bg-white text-black text-[10px] font-black rounded-lg hover:bg-gray-200 transition-colors uppercase">
                                Join Discord
                            </button>
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                            <h6 className="text-white font-bold text-xs mb-2">Quick Links</h6>
                            <div className="space-y-2 text-[10px]">
                                <a href="#" className="block text-gray-400 hover:text-[#39ff14] transition-colors">GitHub Repository</a>
                                <a href="#" className="block text-gray-400 hover:text-[#39ff14] transition-colors">API Status</a>
                                <a href="#" className="block text-gray-400 hover:text-[#39ff14] transition-colors">Changelog</a>
                                <a href="#" className="block text-gray-400 hover:text-[#39ff14] transition-colors">Whitepaper</a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DocumentationPage;
