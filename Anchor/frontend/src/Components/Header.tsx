import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('down');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = 'down';
      } else {
        scrollDirection.current = 'up';
      }
      
      // Clear any existing timer
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      // INSTANT collapse when scrolling down past 100px
      if (scrollDirection.current === 'down' && currentScrollY > 100) {
        setIsScrolled(true);
      }
      
      // INSTANT expand when scrolling up past 100px
      if (scrollDirection.current === 'up' && currentScrollY > 100) {
        setIsScrolled(false);
      }
      
      // Always expanded when at top
      if (currentScrollY <= 100) {
        setIsScrolled(false);
      }
      
      // Set timer for scrolling stop behavior
      scrollTimer.current = setTimeout(() => {
        // If scrolling stopped and we're not at top, expand
        if (currentScrollY > 100 && currentScrollY <= lastScrollY.current) {
          setIsScrolled(false);
        }
      }, 250); // Reduced to 250ms for faster response
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    if (window.scrollY > 100) {
      setIsScrolled(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Docs', href: '/docs' },
    { name: 'Features', hasDropdown: true },
  ];

  const featuresItems = [
    { name: 'Analytics', href: '/features/analytics' },
    { name: 'Security', href: '/features/security' },
    { name: 'API', href: '/features/api' },
    { name: 'Integrations', href: '/features/integrations' },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden lg:block">
        {/* Main Header Container - ALWAYS centered on screen */}
        <div className={`
          mx-auto transition-all duration-250 ease-in-out
          ${isScrolled 
            ? 'h-14 rounded-full mt-3 px-8 backdrop-blur-md bg-black/70 border border-[#39ff14]/30 shadow-xl shadow-[#39ff14]/10 absolute left-1/2 -translate-x-1/2' 
            : 'h-20 w-full bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-sm border-b border-[#39ff14]/30 relative'
          }
        `}>
          <div className={`
            h-full flex items-center transition-all duration-250 ease-in-out
            ${isScrolled ? 'justify-center' : 'justify-between max-w-7xl mx-auto px-8'}
          `}>
            {/* Logo - Always centered */}
            <div className={`
              flex items-center transition-all duration-250 ease-in-out
              ${isScrolled ? 'space-x-3 justify-center' : 'space-x-4'}
            `}>
              <div className={`
                rounded-full bg-[#39ff14] flex items-center justify-center transition-all duration-250 ease-in-out
                ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}
              `}>
                <span className={`
                  text-black font-bold transition-all duration-250 ease-in-out
                  ${isScrolled ? 'text-base' : 'text-lg'}
                `}>
                  S
                </span>
              </div>
              <span className={`
                text-[#39ff14] font-bold transition-all duration-250 ease-in-out
                ${isScrolled ? 'text-lg tracking-tight' : 'text-2xl'}
              `}>
                Slime
              </span>
            </div>

            {/* Navigation Links - Only visible when expanded */}
            <nav className={`
              flex items-center space-x-8 transition-all duration-250 ease-in-out
              ${isScrolled ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100'}
            `}>
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div
                      className="relative group"
                      onMouseEnter={() => setIsFeaturesOpen(true)}
                      onMouseLeave={() => setIsFeaturesOpen(false)}
                    >
                      <button className="flex items-center text-white hover:text-[#39ff14] transition-colors font-medium text-sm hover:scale-105 duration-150">
                        {item.name}
                        <ChevronDown className="ml-1 w-3 h-3" />
                      </button>

                      {/* Features Dropdown */}
                      <div className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-md border border-[#39ff14]/30 rounded-lg shadow-xl shadow-[#39ff14]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="py-2">
                          {featuresItems.map((feature) => (
                            <a
                              key={feature.name}
                              href={feature.href}
                              className="block px-4 py-2 text-white hover:text-[#39ff14] hover:bg-[#39ff14]/10 transition-colors"
                              onClick={() => setIsFeaturesOpen(false)}
                            >
                              {feature.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="text-white hover:text-[#39ff14] font-medium text-sm transition-colors hover:scale-105 duration-150"
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
            </nav>

            {/* Sign In Button - Only visible when expanded */}
            <div className={`
              transition-all duration-250 ease-in-out
              ${isScrolled ? 'opacity-0 scale-95 pointer-events-none absolute' : 'opacity-100 scale-100'}
            `}>
              <a
                href="/signin"
                className="px-5 py-2 rounded-full bg-[#39ff14] text-black font-semibold hover:bg-[#39ff14]/80 hover:scale-105 active:scale-95 transition-all duration-150 text-sm"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-black/95 backdrop-blur-sm border-b border-[#39ff14]/30">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#39ff14] flex items-center justify-center">
                <span className="text-black font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-[#39ff14]">Slime</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-[#39ff14] transition-colors p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="px-6 pb-6 border-t border-[#39ff14]/20 bg-black/95 backdrop-blur-md">
              <div className="py-4 space-y-3">
                <a 
                  href="/" 
                  className="block text-white hover:text-[#39ff14] font-medium transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/about" 
                  className="block text-white hover:text-[#39ff14] font-medium transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="/contact" 
                  className="block text-white hover:text-[#39ff14] font-medium transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <a 
                  href="/docs" 
                  className="block text-white hover:text-[#39ff14] font-medium transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Docs
                </a>
                
                {/* Mobile Features Dropdown */}
                <div>
                  <button
                    onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                    className="flex items-center text-white hover:text-[#39ff14] font-medium transition-colors py-2 w-full"
                  >
                    Features
                    <ChevronDown className={`ml-2 w-4 h-4 transition-transform duration-300 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isFeaturesOpen && (
                    <div className="ml-4 mt-2 space-y-2 border-l border-[#39ff14]/20 pl-4">
                      {featuresItems.map((feature) => (
                        <a
                          key={feature.name}
                          href={feature.href}
                          className="block text-white/80 hover:text-[#39ff14] transition-colors py-2"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsFeaturesOpen(false);
                          }}
                        >
                          {feature.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <a 
                  href="/signin"
                  className="block w-full px-4 py-3 rounded-full bg-[#39ff14] text-black font-semibold hover:bg-[#39ff14]/80 transition-colors text-center mt-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </a>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;