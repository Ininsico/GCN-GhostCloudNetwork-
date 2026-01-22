import Header from "../../Components/Header"
import HeroSection from "../LandingpageComponets/Hero"
import Features from "../LandingpageComponets/Features"
import Network from "../LandingpageComponets/Network"
import CTA from "../LandingpageComponets/CTA"

const LandingPage = () => {
    return (
        <div className="bg-black min-h-screen text-white selection:bg-[#39ff14] selection:text-black">
            <Header />
            <main>
                <HeroSection />
                <Features />
                <Network />
                <CTA />
            </main>
            <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
                <p>&copy; {new Date().getFullYear()} ANCHOR. GHOST CLOUD NETWORK PROTOCOL.</p>
            </footer>
        </div>
    )
}

export default LandingPage
