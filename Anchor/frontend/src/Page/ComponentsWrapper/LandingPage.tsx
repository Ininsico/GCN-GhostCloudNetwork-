import Header from "../../Components/Header"
import HeroSection from "../LandingpageComponets/Hero"
import Features from "../LandingpageComponets/Features"
import Network from "../LandingpageComponets/Network"
import HowItWorks from "../LandingpageComponets/HowItWorks"
import PatronSection from "../LandingpageComponets/PatronSection"
import CTA from "../LandingpageComponets/CTA"

const LandingPage = ({ onNavigate }: { onNavigate: (view: any) => void }) => {
    return (
        <div className="bg-black min-h-screen text-white selection:bg-[#39ff14] selection:text-black">
            <Header onNavigate={onNavigate} />
            <main>
                <HeroSection />
                <Features />
                <HowItWorks />
                <Network />
                <PatronSection />
                <CTA />
            </main>
            <footer className="py-20 border-t border-white/5 bg-black">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <h3 className="text-2xl font-black mb-6">ANCHOR.</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                The leading protocol for decentralized cloud computing.
                                Ghost Cloud Network enables a new era of digital sovereignty.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Product</h4>
                            <ul className="space-y-4 text-gray-500 text-sm">
                                <li><a href="#" className="hover:text-[#39ff14] transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-[#39ff14] transition-colors">Network</a></li>
                                <li><button onClick={() => onNavigate('patron')} className="hover:text-[#39ff14] transition-colors">Patron</button></li>
                                <li><a href="#" className="hover:text-[#39ff14] transition-colors">Documentation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Company</h4>
                            <ul className="space-y-4 text-gray-500 text-sm">
                                <li><a href="#" className="hover:text-[#39ff14] transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-[#39ff14] transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-[#39ff14] transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-[#39ff14] transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6">Legal</h4>
                            <ul className="space-y-4 text-gray-500 text-sm">
                                <li><a href="#" className="hover:text-[#39ff14] transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-[#39ff14] transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-[#39ff14] transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs font-medium uppercase tracking-[0.2em]">
                        <p>&copy; {new Date().getFullYear()} ANCHOR PROTOCOL. ALL RIGHTS RESERVED.</p>
                        <div className="flex space-x-6">
                            <span>v2.4.0-STABLE</span>
                            <span className="text-[#39ff14]">OPERATIONAL</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
