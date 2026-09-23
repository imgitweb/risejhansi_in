import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Rocket, TrendingUp, Target, Users, Zap, ShieldCheck, 
  ArrowRight, CheckCircle2, MonitorSmartphone,Calendar
} from 'lucide-react';

// Images Import
import ramp1 from '../img/ramp/ramp1.JPG';
import ramp2 from '../img/ramp/ramp2.JPG';
import ramp3 from '../img/ramp/ramp3.JPG';
import ramp4 from '../img/ramp/ramp4.JPG';
import ramp5 from '../img/ramp/ramp5.JPG';
import ramp6 from '../img/ramp/ramp6.JPG';
import ramp7 from '../img/ramp/ramp7.JPG';
import ramp8 from '../img/ramp/ramp8.JPG';
import ramp9 from '../img/ramp/ramp9.JPG';

gsap.registerPlugin(ScrollTrigger);

export default function RampLandingPage() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const focusRef = useRef(null);
  const galleryRef = useRef(null);

  const galleryImages = [ramp1, ramp2, ramp3, ramp4, ramp5, ramp6, ramp7, ramp8, ramp9];

  const stats = [
    { num: '8', label: 'Weeks Program', icon: <Calendar className="w-6 h-6" /> },
    { num: '0%', label: 'Equity Dilution', icon: <ShieldCheck className="w-6 h-6" /> },
    { num: '100%', label: 'Founder Support', icon: <Users className="w-6 h-6" /> },
    { num: '50+', label: 'Top Mentors', icon: <Target className="w-6 h-6" /> },
  ];

  const focusAreas = [
    {
      icon: <MonitorSmartphone className="w-8 h-8" />,
      title: 'Product Development',
      desc: 'Refine your MVP with expert technical guidance, user-testing frameworks, and scalable architecture.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Market Validation',
      desc: 'Leverage data-driven insights and customer discovery techniques to confirm your product-market fit.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Investor Readiness',
      desc: 'Master your pitch, build a bulletproof financial model, and train for successful institutional funding rounds.',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animations
      gsap.fromTo(".hero-elem", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out" }
      );

      // Stats Animations
      gsap.fromTo(".stat-card",
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: statsRef.current, start: "top 85%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.5)" }
      );

      // Focus Areas
      gsap.fromTo(".focus-card",
        { y: 50, opacity: 0, scale: 0.95 },
        { scrollTrigger: { trigger: focusRef.current, start: "top 80%" }, y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );

      // Gallery Images
      gsap.fromTo(".gallery-img",
        { opacity: 0, scale: 0.8 },
        { scrollTrigger: { trigger: galleryRef.current, start: "top 75%" }, opacity: 1, scale: 1, duration: 0.8, stagger: 0.05, ease: "power2.out" }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="font-['Poppins',sans-serif] bg-white overflow-x-hidden selection:bg-[#ff2020] selection:text-white">

      {/* --- STICKY CTA (Pill Shape on Right) --- */}
      <Link 
        to="/ramp-2.0" 
        className="fixed top-1/2 right-0 -translate-y-1/2 translate-x-[70%] hover:translate-x-0 z-[50] bg-[#ff2020] text-white font-bold shadow-[-5px_0_20px_rgba(255,32,32,0.3)] transition-transform duration-300 flex items-center gap-3 px-6 py-4 rounded-l-full hidden md:flex"
      >
        <Rocket className="w-5 h-5 animate-pulse" />
        <span className="whitespace-nowrap uppercase tracking-widest text-sm">Apply for 2.0</span>
      </Link>

      {/* Mobile Bottom Sticky CTA */}
      <div className="fixed bottom-0 left-0 w-full p-4 z-[50] md:hidden bg-gradient-to-t from-black to-transparent pointer-events-none">
        <Link to="/ramp-2.0" className="w-full bg-[#ff2020] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,32,32,0.4)] pointer-events-auto">
          Apply for RAMP 2.0 <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* --- HERO SECTION (Dark Premium Theme) --- */}
      <section ref={heroRef} className="relative bg-[#0a0a0a] pt-32 pb-48 lg:pt-40 lg:pb-56 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ff2020]/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="hero-elem inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-semibold mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#ff2020] animate-ping"></span> 
            <span className="w-2 h-2 rounded-full bg-[#ff2020] absolute"></span>
            Applications Now Open for Cohort 2
          </div>
          
          <h1 className="hero-elem text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Launch Your Startup <br />
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-[#ff7a7a]">RAMP 2.0</span>
          </h1>
          
          <p className="hero-elem text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Following the massive success of our inaugural cohort, RAMP 2.0 is an 8-week intensive accelerator program designed to scale your vision with better resources, deeper mentorship, and expanded funding access.
          </p>
          
          <div className="hero-elem flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link 
              to="/ramp-2.0" 
              className="w-full sm:w-auto px-8 py-4 bg-[#ff2020] text-white rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_30px_rgba(255,32,32,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group"
            >
              Start Application <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#gallery" 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
            >
              Explore 1.0 Highlights
            </a>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION (Overlapping Hero) --- */}
      <section ref={statsRef} className="relative z-20 -mt-24 px-6 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card bg-white rounded-2xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-red-50 text-[#ff2020] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {/* We use Zap just as a fallback if icon is missing, but we mapped proper ones above */}
                {stat.icon || <Zap className="w-6 h-6" />}
              </div>
              <h3 className="text-4xl font-black text-[#1a1a1a] mb-1">{stat.num}</h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOCUS AREAS (Modern Glass Cards) --- */}
      <section ref={focusRef} className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-6 tracking-tight">
              Program <span className="text-[#ff2020]">Focus Areas</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our accelerator program provides targeted resources to ensure your startup is built on a solid, scalable, and fundable foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {focusAreas.map((area, idx) => (
              <div key={idx} className="focus-card bg-white p-10 rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl hover:border-[#ff2020]/30 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-white rounded-2xl flex items-center justify-center text-[#ff2020] mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-red-100">
                  {area.icon}
                </div>
                <h3 className="text-2xl font-black text-[#1a1a1a] mb-4 group-hover:text-[#ff2020] transition-colors">
                  {area.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {area.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY SECTION (Asymmetrical Grid) --- */}
      <section id="gallery" ref={galleryRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4 tracking-tight">
                RAMP 1.0 <span className="text-gray-400">in Action</span>
              </h2>
              <p className="text-lg text-gray-600">
                A look back at the mentorship, networking, and phenomenal growth from our first successful batch of founders.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#ff2020] font-bold">
              <CheckCircle2 className="w-5 h-5" /> 15+ Startups Graduated
            </div>
          </div>

          {/* Custom Modern Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {galleryImages.map((src, index) => {
              // Create dynamic span classes for an interesting masonry-like look
              let spanClass = "col-span-1 row-span-1";
              if (index === 0) spanClass = "col-span-2 row-span-2"; // Big feature
              if (index === 3) spanClass = "col-span-2 row-span-1"; // Wide
              if (index === 6) spanClass = "col-span-1 row-span-2"; // Tall
              
              return (
                <div key={index} className={`gallery-img rounded-2xl overflow-hidden relative group cursor-pointer ${spanClass}`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img 
                    src={src} 
                    alt={`RAMP 1.0 Highlight ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Hover Overlay Text */}
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <p className="text-white font-bold flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-[#ff2020]" /> Cohort 1.0 Memories
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA (Deep Immersion) --- */}
      <section className="py-32 relative bg-[#0a0a0a] text-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-screen"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#ff2020]/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Ready to Build the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-orange-500">Next Big Thing?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            Secure your spot in the next cohort and gain access to the network, capital, and mentorship needed to dominate your industry.
          </p>
          <Link 
            to="/ramp-2.0" 
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black text-lg uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            Apply Now <Rocket className="w-6 h-6 text-[#ff2020]" />
          </Link>
        </div>
      </section>

    </div>
  );
}