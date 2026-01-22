import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#39ff14]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#39ff14]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 -left-20 w-60 h-60 bg-[#39ff14]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 lg:pt-40">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse mr-2"></div>
            <span className="text-[#39ff14] text-sm font-medium">Slime v2.0 is here!</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="block">Welcome to</span>
            <span className="text-[#39ff14]">Slime World</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl">
            Experience the future of web development with our cutting-edge platform. 
            Build faster, deploy smarter, and scale infinitely.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button className="px-8 py-4 rounded-full bg-[#39ff14] text-black font-bold text-lg hover:bg-[#39ff14]/90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-[#39ff14]/20">
              Get Started Free
            </button>
            <button className="px-8 py-4 rounded-full bg-transparent border-2 border-[#39ff14] text-[#39ff14] font-bold text-lg hover:bg-[#39ff14]/10 hover:scale-105 active:scale-95 transition-all duration-200">
              View Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '99.9%', label: 'Uptime' },
              { value: '50+', label: 'Countries' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm border border-[#39ff14]/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-[#39ff14] mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm mb-2">Scroll down</span>
            <div className="w-6 h-10 border-2 border-[#39ff14]/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-[#39ff14] rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dummy content to enable scrolling */}
      <div className="py-32 space-y-12 px-4">
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#39ff14]">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="bg-black/30 p-6 rounded-2xl border border-[#39ff14]/20">
                <div className="w-12 h-12 rounded-full bg-[#39ff14] flex items-center justify-center text-black font-bold text-xl mb-4">
                  {step}
                </div>
                <h3 className="text-xl font-bold mb-3">Step {step}</h3>
                <p className="text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#39ff14]">Features</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-black/20 p-6 rounded-xl border border-[#39ff14]/10 hover:border-[#39ff14]/30 transition-all duration-300">
                <h3 className="text-xl font-bold mb-2">Feature {item}</h3>
                <p className="text-gray-300">
                  Detailed description of feature {item}. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#39ff14]">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Basic', 'Pro', 'Enterprise'].map((plan, index) => (
              <div key={plan} className={`p-8 rounded-2xl border-2 ${index === 1 ? 'border-[#39ff14] bg-black/40' : 'border-[#39ff14]/20'}`}>
                <h3 className="text-2xl font-bold mb-4">{plan}</h3>
                <div className="text-4xl font-bold text-[#39ff14] mb-6">
                  ${index * 20 + 9}<span className="text-lg text-gray-300">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-2 h-2 bg-[#39ff14] rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-full font-bold ${index === 1 ? 'bg-[#39ff14] text-black' : 'bg-transparent border border-[#39ff14] text-[#39ff14]'} hover:scale-105 transition-transform`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* More dummy content for scrolling */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-[#39ff14]">Keep Scrolling!</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              This is additional content to test the header animation. Scroll up to see the header transform back to its original state.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;