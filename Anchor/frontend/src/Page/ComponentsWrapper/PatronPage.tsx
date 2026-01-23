import { motion, useScroll, useSpring } from 'framer-motion';
import { Heart, Zap, Coffee, Crown, Rocket, Users, Github, Layout } from 'lucide-react';
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

const PatronHero = () => (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-20 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(57,255,20,0.05),transparent_70%)]" />
        <div className="container mx-auto px-6 text-center relative z-10">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="inline-block px-4 py-1 rounded-full border border-[#39ff14]/30 bg-[#39ff14]/5 text-[#39ff14] text-xs font-black uppercase tracking-[0.3em] mb-6">
                    Open Source & Community Driven
                </div>
                <h1 className="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter leading-none">
                    FUEL THE <br />
                    <span className="text-[#39ff14] italic">ANCHOR MESH</span>
                </h1>
                <p className="max-w-3xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed">
                    Anchor is 100% open source. We don't sell your data or charge for basic access.
                    Become a patron to help us build a decentralized future for everyone.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-6">
                    <button className="px-8 py-4 rounded-2xl bg-[#39ff14] text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-all flex items-center gap-2">
                        <Heart className="w-4 h-4" /> Become a Patron
                    </button>
                    <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center gap-2">
                        <Github className="w-4 h-4" /> Star on GitHub
                    </button>
                </div>
            </motion.div>
        </div>
    </section>
);

const PatronTiers = () => {
    return (
        <MotionSection className="bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">PATRON <span className="text-[#39ff14]">TIERS</span></h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Choose a level of support that fits your commitment to digital sovereignty. All funds go directly to network R&D.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Supporter",
                            price: "$5",
                            icon: Coffee,
                            desc: "Small acts, big impact. Help us keep the lights on and the servers humming.",
                            features: ["Patron Badge in Discord", "Early Access to Updates", "Name in CREDITS.md"],
                            color: "border-gray-800"
                        },
                        {
                            title: "Guardian",
                            price: "$25",
                            icon: Rocket,
                            desc: "For those who believe in the mission. Powering the next generation of node development.",
                            features: ["All Supporter Perks", "Private Alpha Testing", "Quarterly Roadmap Voting", "Anchor Pro Features"],
                            color: "border-[#39ff14] bg-[#39ff14]/5",
                            featured: true
                        },
                        {
                            title: "Vanguard",
                            price: "$100",
                            icon: Crown,
                            desc: "Architects of the anchor mesh. Directly funding global infrastructure scaling.",
                            features: ["All Guardian Perks", "Direct Developer Access", "Exclusive Vanguard Merch", "Your Logo on Homepage"],
                            color: "border-purple-500/50"
                        }
                    ].map((tier, i) => (
                        <div key={i} className={`p-10 rounded-[3rem] border ${tier.color} relative overflow-hidden group transition-all hover:-translate-y-2`}>
                            {tier.featured && (
                                <div className="absolute top-0 right-0 bg-[#39ff14] text-black text-[0.6rem] font-black uppercase px-4 py-1 rounded-bl-xl tracking-widest">
                                    Most Popular
                                </div>
                            )}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${tier.featured ? 'bg-[#39ff14] text-black' : 'bg-white/5 text-white'}`}>
                                <tier.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{tier.title}</h3>
                            <div className="text-4xl font-black text-white mb-6">{tier.price}<span className="text-sm text-gray-500 font-normal"> / mo</span></div>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">{tier.desc}</p>
                            <ul className="space-y-4 mb-10">
                                {tier.features.map((f, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                                        <Zap className="w-3 h-3 text-[#39ff14]" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${tier.featured ? 'bg-[#39ff14] text-black hover:bg-[#39ff14]/90' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                                Select Tier
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </MotionSection>
    );
};

const OpenRoadmap = () => {
    return (
        <MotionSection>
            <div className="container mx-auto px-6">
                <div className="bg-[#111] border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 opacity-5">
                        <Layout className="w-96 h-96 text-white" />
                    </div>
                    <div className="relative z-10">
                        <span className="text-[#39ff14] font-black uppercase tracking-[0.4em] text-xs mb-6 block">Transparent Planning</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">OPEN <span className="text-[#39ff14]">ROADMAP</span></h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {[
                                { status: "Current", title: "Node Core V2", desc: "Refactoring the consensus engine for 10x faster node-to-node handshakes.", progress: 85 },
                                { status: "Up Next", title: "Global Mesh Map", desc: "Interactive dashboard to visualize the real-time health of the Anchor Mesh.", progress: 30 },
                                { status: "Future", title: "Satellite Nodes", desc: "Extending the network to space for 100% global coverage without borders.", progress: 5 }
                            ].map((item, i) => (
                                <div key={i} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-[#39ff14] bg-[#39ff14]/10 px-3 py-1 rounded-full">{item.status}</span>
                                        <span className="text-white font-mono">{item.progress}%</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-white">{item.title}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${item.progress}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-[#39ff14]"
                                        />
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

const CommunityImpact = () => {
    return (
        <MotionSection className="bg-[#050505]">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2">
                        <Users className="text-[#39ff14] w-12 h-12 mb-8" />
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">BUILT BY <br /><span className="text-[#39ff14]">PEOPLE</span>, FOR PEOPLE</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-10">
                            Anchor isn't just code; it's a movement. We are a collection of over 500+ contributors and thousands of patrons committed to reclaiming our digital privacy.
                        </p>
                        <div className="grid grid-cols-2 gap-8 font-mono">
                            <div>
                                <div className="text-3xl font-bold text-white">54k+</div>
                                <div className="text-xs text-gray-500 uppercase mt-2">GitHub Stars</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">12.5k</div>
                                <div className="text-xs text-gray-500 uppercase mt-2">Commits</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#39ff14]">2.1k</div>
                                <div className="text-xs text-gray-500 uppercase mt-2">Active Patrons</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-[#39ff14]">$4.2M</div>
                                <div className="text-xs text-gray-500 uppercase mt-2">Funds Raised</div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="grid grid-cols-3 gap-4">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all cursor-crosshair">
                                    <div className="w-full h-full bg-gradient-to-br from-[#39ff14]/10 to-transparent flex items-center justify-center font-black text-white/10 text-4xl">
                                        {i + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-[#39ff14] text-black font-black p-6 rounded-2xl shadow-2xl transform rotate-3">
                            Join the movement.
                        </div>
                    </div>
                </div>
            </div>
        </MotionSection>
    );
};

const FAQ = () => {
    return (
        <MotionSection>
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">COMMON <span className="text-[#39ff14]">QUESTIONS</span></h2>
                <div className="space-y-6">
                    {[
                        { q: "Is Anchor really free?", a: "Yes. The core software is 100% free to use, modify, and host. Patronage is entirely optional but helps us scale the project faster." },
                        { q: "Where does the money go?", a: "All funds are used for server costs, hardware development for dedicated nodes, and paying full-time open-source maintainers." },
                        { q: "Can I contribute code instead?", a: "Absolutely! We value code contributions as much as financial ones. Check out our GitHub for open issues." }
                    ].map((item, i) => (
                        <div key={i} className="p-8 rounded-3xl border border-white/5 bg-[#080808]">
                            <h4 className="text-lg font-bold text-white mb-4">{item.q}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </MotionSection>
    );
};

const PatronPage = () => {
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
                <PatronHero />
                <PatronTiers />
                <OpenRoadmap />
                <CommunityImpact />
                <FAQ />
            </main>

            <Footer />
        </div>
    );
};

export default PatronPage;
