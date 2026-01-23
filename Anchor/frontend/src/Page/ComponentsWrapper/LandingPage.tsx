import Header from "../../Components/Header"
import Footer from "../../Components/Footer"
import HeroSection from "../LandingpageComponets/Hero"
import Features from "../LandingpageComponets/Features"
import Network from "../LandingpageComponets/Network"
import HowItWorks from "../LandingpageComponets/HowItWorks"
import PatronSection from "../LandingpageComponets/PatronSection"
import CTA from "../LandingpageComponets/CTA"

const LandingPage = () => {
    return (
        <div className="bg-black min-h-screen text-white selection:bg-[#39ff14] selection:text-black">
            <Header />
            <main>
                <HeroSection />
                <Features />
                <HowItWorks />
                <Network />
                <PatronSection />
                <CTA />
            </main>
            <Footer />
        </div>
    )
}

export default LandingPage
