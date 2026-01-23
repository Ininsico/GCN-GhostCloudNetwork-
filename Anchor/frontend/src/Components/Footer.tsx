import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="py-24 border-t border-white/5 text-center bg-[#050505]">
            <div className="container mx-auto px-6">
                <h3 className="text-3xl font-black mb-8">ANCHOR.</h3>
                <div className="flex justify-center gap-12 text-gray-500 uppercase tracking-widest text-xs font-bold mb-12 flex-wrap">
                    <Link to="/" className="hover:text-[#39ff14] transition-colors">Hero</Link>
                    <Link to="/features" className="hover:text-[#39ff14] transition-colors">Features</Link>
                    <Link to="/how-it-works" className="hover:text-[#39ff14] transition-colors">How It Works</Link>
                    <Link to="/network" className="hover:text-[#39ff14] transition-colors">Network</Link>
                    <Link to="/patron" className="hover:text-[#39ff14] transition-colors">Patron</Link>
                    <Link to="/documentation" className="hover:text-[#39ff14] transition-colors">Docs</Link>
                </div>
                <p className="text-gray-700 text-xs font-medium tracking-[0.4em]">© 2026 ANCHOR PROTOCOL. TECHNICAL DOCS V2.4</p>
            </div>
        </footer>
    );
};

export default Footer;
