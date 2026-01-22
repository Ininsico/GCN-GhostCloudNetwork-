import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Anchor as AnchorIcon } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Network', href: '#network' },
    { name: 'Features', href: '#features' },
    { name: 'Security', href: '#security' },
    { name: 'Documentation', href: '/docs' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-lg border-b border-[#39ff14]/20 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3 group text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center transition-all duration-300 group-hover:bg-[#39ff14]/20 group-hover:scale-110">
            <AnchorIcon className="text-[#39ff14] w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter group-hover:text-[#39ff14] transition-colors">
            ANCHOR
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-10">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-400 hover:text-[#39ff14] transition-all relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#39ff14] transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-6">
          <button className="text-sm font-medium text-white hover:text-[#39ff14] transition-colors">
            Sign In
          </button>
          <button className="px-6 py-2.5 rounded-full bg-[#39ff14] text-black font-bold text-sm hover:bg-[#39ff14]/90 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95">
            Get Started
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white hover:text-[#39ff14] transition-colors"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-black transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 px-8 space-y-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-3xl font-bold text-white hover:text-[#39ff14] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="pt-8 space-y-6">
            <button className="block w-full text-left text-2xl font-bold text-white hover:text-[#39ff14]">
              Sign In
            </button>
            <button className="w-full py-4 rounded-2xl bg-[#39ff14] text-black font-black text-xl">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
