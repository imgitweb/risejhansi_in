import React from 'react';
import { Link } from 'react-router-dom'; // Link import kiya gaya hai

// Saari images ko yahan import karein
import ramp1 from '../img/ramp/ramp1.JPG';
import ramp2 from '../img/ramp/ramp2.JPG';
import ramp3 from '../img/ramp/ramp3.JPG';
import ramp4 from '../img/ramp/ramp4.JPG';
import ramp5 from '../img/ramp/ramp5.JPG';
import ramp6 from '../img/ramp/ramp6.JPG';
import ramp7 from '../img/ramp/ramp7.JPG';
import ramp8 from '../img/ramp/ramp8.JPG';
import ramp9 from '../img/ramp/ramp9.JPG';

export default function RampLandingPage() {
  // Imported variables ko ek array mein store kar lein
  const galleryImages = [
    ramp1, ramp2, ramp3, ramp4, ramp5, 
    ramp6, ramp7, ramp8, ramp9
  ];

  const stats = [
    { num: '8', label: 'Weeks Program' },
    { num: '0%', label: 'Equity Dilution' },
    { num: '100%', label: 'Founder Support' },
    { num: '50+', label: 'Top Mentors' },
  ];

  const focusAreas = [
    {
      icon: '🛠️',
      title: 'Product Development',
      desc: 'Refine your MVP with expert technical guidance, user-testing frameworks, and scalable architecture.',
    },
    {
      icon: '📊',
      title: 'Market Validation',
      desc: 'Leverage data-driven insights and customer discovery techniques to confirm your product-market fit.',
    },
    {
      icon: '💎',
      title: 'Investor Readiness',
      desc: 'Master your pitch, build a bulletproof financial model, and train for successful institutional funding rounds.',
    },
  ];

  return (
    <div className="font-['Poppins',sans-serif] text-[#4a4a4a] bg-white overflow-x-hidden leading-relaxed">

      {/* --- CUSTOM STYLES FOR SPECIFIC ANIMATIONS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customPulse {
            0% { box-shadow: 0 0 0 0 rgba(230, 25, 25, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(230, 25, 25, 0); }
            100% { box-shadow: 0 0 0 0 rgba(230, 25, 25, 0); }
        }
        .animate-custom-pulse {
            animation: customPulse 2s infinite;
        }
        .animate-custom-pulse:hover {
            animation: none;
        }
      `}} />

      {/* --- STICKY CTA (Updated with Link) --- */}
      <Link 
        to="/ramp-2.0" 
        className="fixed top-1/2 right-[30px] -translate-y-1/2 z-[9999] bg-[#e61919] text-white rounded-[50px] font-bold no-underline shadow-[0_10px_25px_rgba(230,25,25,0.4)] transition-all duration-[0.3s] ease-[cubic-bezier(0.25,0.8,0.25,1)] animate-custom-pulse hover:bg-[#1a1a1a] hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:text-white 
        [writing-mode:vertical-rl] [text-orientation:mixed] px-[15px] py-[30px] text-[1rem] tracking-wide
        max-md:top-auto max-md:bottom-5 max-md:right-5 max-md:transform-none max-md:[writing-mode:horizontal-tb] max-md:px-[30px] max-md:py-[15px]"
      >
        Apply for 2.0
      </Link>

      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-white to-[#fff0f0] pt-[140px] pb-[120px]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-[60px] items-center text-center md:text-center lg:text-left">

            {/* Hero Content */}
            <div>
              <h1 className="text-[3rem] lg:text-[4rem] font-extrabold text-[#1a1a1a] leading-[1.15] mb-[25px] tracking-tight">
                Launch Your Startup with <span className="text-[#e61919]">RAMP 2.0</span>
              </h1>
              <p className="text-[1.15rem] text-[#555] mb-[40px] lg:max-w-[90%] mx-auto lg:mx-0">
                Following the massive success of our inaugural cohort, RAMP 2.0 is now open. An 8-week intensive program designed to scale your vision with better resources, deeper mentorship, and expanded funding access.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-0">
                {/* Updated with Link */}
                <Link 
                  to="/ramp-2.0" 
                  className="inline-block px-[42px] py-[16px] rounded-[50px] font-semibold text-[1.05rem] transition-all duration-[0.3s] ease-[cubic-bezier(0.25,0.8,0.25,1)] bg-[#e61919] text-white shadow-[0_8px_25px_rgba(230,25,25,0.3)] border-2 border-[#e61919] hover:bg-[#c21515] hover:border-[#c21515] hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(230,25,25,0.4)] text-center"
                >
                  Apply for 2.0
                </Link>
                {/* Ye same page par scroll karega isliye isko <a> tag hi rehne diya hai */}
                <a 
                  href="#gallery" 
                  className="inline-block px-[42px] py-[16px] rounded-[50px] font-semibold text-[1.05rem] transition-all duration-[0.3s] ease-[cubic-bezier(0.25,0.8,0.25,1)] border-2 border-[#e0e0e0] text-[#1a1a1a] bg-white sm:ml-[15px] hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white hover:-translate-y-[3px] text-center"
                >
                  See RAMP 1.0 Highlights
                </a>
              </div>
            </div>

            {/* Hero Tags / Glassmorphism Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
              {[
                { icon: '🚀', text: 'RAMP 1.0 Alumni' },
                { icon: '📈', text: '2.0 Improved' },
                { icon: '💡', text: 'Innovation Hub' },
                { icon: '💰', text: 'Funding Ready' },
              ].map((tag, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-[10px] p-[25px_20px] rounded-[12px] text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-white/50 font-semibold text-[1.05rem] text-[#1a1a1a] transition-all duration-[0.3s] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-[5px] hover:border-[#ff4d4d] hover:shadow-[0_15px_35px_rgba(230,25,25,0.1)]">
                  <span className="block text-[1.8rem] mb-[10px]">{tag.icon}</span>
                  {tag.text}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* --- GALLERY SECTION --- */}
      <section id="gallery" className="py-[100px] relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-[70px]">
            <h2 className="text-[2.75rem] font-extrabold text-[#1a1a1a] mb-[15px] relative inline-block tracking-tight after:content-[''] after:block after:w-[80px] after:h-[5px] after:bg-[#e61919] after:mx-auto after:mt-[15px] after:rounded-[5px]">
              RAMP 1.0 in Action
            </h2>
            <p className="text-[1.1rem] text-[#666] max-w-[600px] mx-auto">
              A look back at the mentorship, networking, and phenomenal growth from our first successful batch of founders.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {galleryImages.map((src, index) => (
              <div key={index} className="rounded-[12px] overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.06)] relative group">
                <img 
                  src={src} 
                  alt={`RAMP 1.0 Highlight ${index + 1}`} 
                  className="w-full aspect-[4/3] object-cover block transition-transform duration-[0.3s] ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[0.3s] ease-[cubic-bezier(0.25,0.8,0.25,1)] pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-[100px] relative bg-[#f4f6f9]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white py-[40px] px-[20px] rounded-[12px] text-center border-b-[5px] border-[#e61919] shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-all duration-[0.3s] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-[8px] hover:shadow-[0_15px_45px_rgba(0,0,0,0.08)]">
                <span className="block text-[3.2rem] font-extrabold text-[#e61919] leading-none mb-[10px]">
                  {stat.num}
                </span>
                <span className="text-[1.1rem] font-semibold text-[#1a1a1a] uppercase tracking-[1px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOCUS AREAS --- */}
      <section className="py-[100px] relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-[70px]">
            <h2 className="text-[2.75rem] font-extrabold text-[#1a1a1a] mb-[15px] relative inline-block tracking-tight after:content-[''] after:block after:w-[80px] after:h-[5px] after:bg-[#e61919] after:mx-auto after:mt-[15px] after:rounded-[5px]">
              Key Focus Areas
            </h2>
            <p className="text-[1.1rem] text-[#666] max-w-[600px] mx-auto">
              Our accelerator program provides targeted resources to ensure your startup is built on a solid foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[35px]">
            {focusAreas.map((area, idx) => (
              <div key={idx} className="bg-white p-[45px_35px] rounded-[12px] border border-[#eaeaea] shadow-[0_5px_20px_rgba(0,0,0,0.02)] transition-all duration-[0.3s] ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:border-[#e61919] hover:shadow-[0_15px_40px_rgba(230,25,25,0.08)] hover:-translate-y-[5px]">
                <span className="inline-block text-[2.5rem] mb-[20px] bg-[#fff0f0] w-[70px] h-[70px] leading-[70px] text-center rounded-full">
                  {area.icon}
                </span>
                <h3 className="text-[1.4rem] color-[#1a1a1a] mb-[15px] font-bold text-[#1a1a1a]">
                  {area.title}
                </h3>
                <p className="text-[#666] text-[1.05rem]">
                  {area.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-[100px] relative bg-gradient-to-br from-[#1a1a1a] to-black text-center text-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[3rem] font-extrabold mb-[20px]">
            Ready to Join RAMP 2.0?
          </h2>
          <p className="text-[1.2rem] text-[#a0a0a0] mb-[40px] max-w-[600px] mx-auto">
            Secure your spot in the next cohort and gain access to the network, capital, and mentorship needed to take your startup to the next level.
          </p>
          {/* Updated with Link */}
          <Link 
            to="/ramp-2.0" 
            className="inline-block px-[50px] py-[18px] rounded-[50px] font-semibold text-[1.1rem] transition-all duration-[0.3s] ease-[cubic-bezier(0.25,0.8,0.25,1)] bg-white text-[#1a1a1a] hover:-translate-y-[3px] shadow-lg hover:bg-gray-100"
          >
            Apply Now
          </Link>
        </div>
      </section>

    </div>
  );
}