import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Eye, Rocket, CheckCircle2, Zap, Lightbulb } from 'lucide-react';

// Import images from your src/img/ folder
import aboutImg1 from '../img/about_.png';
import aboutImg2 from '../img/about1.png';

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const introRef = useRef(null);
  const visionMissionRef = useRef(null);
  const industriesRef = useRef(null);

  const industries = [
    "Agriculture & Rural Development", "Smart Vehicles", "Use of ICCC Data", 
    "Cleanliness / Swachhata", "Transportation & Logistics", "Robotics and Drones", 
    "Clean & Green Technology", "Tourism", "Renewable / Sustainable Energy", 
    "Smart Communication", "Healthcare & Biomedical devices", "Block-chain & Cyber Security", 
    "Smart Automation", "Fitness & Sport", "Heritage & Culture", 
    "MedTech / BioTech / HealthTech", "Sustainable projects"
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Banner Animation
      gsap.fromTo(bannerTextRef.current, 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.1 }
      );

      // 2. Intro Section Animation
      gsap.fromTo(".about-text-element", 
        { x: -50, opacity: 0 },
        {
          scrollTrigger: { trigger: introRef.current, start: "top 85%" },
          x: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out"
        }
      );
      
      gsap.fromTo(".about-image-wrapper", 
        { x: 50, opacity: 0 },
        {
          scrollTrigger: { trigger: introRef.current, start: "top 85%" },
          x: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.3
        }
      );

      // 3. Vision & Mission Cards Animation
      gsap.fromTo(".vm-card", 
        { y: 50, opacity: 0 },
        {
          scrollTrigger: { trigger: visionMissionRef.current, start: "top 85%" },
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power4.out"
        }
      );

      // 4. Industry Pills Animation
      gsap.fromTo(".industry-pill", 
        { scale: 0.8, opacity: 0 },
        {
          scrollTrigger: { trigger: industriesRef.current, start: "top 90%" },
          scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)"
        }
      );

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="flex-grow bg-[#fdfdfd] min-h-screen pt-20 pb-24 font-['Poppins',sans-serif]">
      
      {/* ================= TOP BANNER (Premium Dark Theme) ================= */}
      <div className="w-full bg-[#1a1a1a] py-24 relative overflow-hidden shadow-inner">
        {/* Decorative Glowing Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/15 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/10 blur-[100px]"></div>
        
        <div ref={bannerTextRef} className="relative z-10 text-center px-4 max-w-4xl mx-auto opacity-0">
          <div className="inline-block px-[16px] py-[6px] rounded-full bg-[#ff2020]/10 border border-[#ff2020]/30 text-[#ff2020] font-semibold text-sm mb-6 backdrop-blur-sm shadow-sm">
            Empowering Innovation
          </div>
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
            About <span className="text-[#ff2020]">RISE Jhansi</span>
          </h1>
          <p className="text-[#aaa] text-[1.1rem] font-medium max-w-2xl mx-auto leading-relaxed">
            Catalyzing the startup ecosystem in Uttar Pradesh by transforming visionary ideas into self-sustaining, successful enterprises.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        
        {/* ================= INTRO SECTION ================= */}
        <section ref={introRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Left Text Content */}
          <div className="space-y-6">
            <div className="about-text-element opacity-0 flex items-center space-x-2 text-[#ff2020] font-bold tracking-wider uppercase text-sm mb-2">
              <Zap className="w-4 h-4" />
              <span>Who We Are</span>
            </div>
            <h2 className="about-text-element opacity-0 text-[2rem] md:text-[2.5rem] font-extrabold text-[#333] leading-tight">
              A Hub For <span className="text-[#ff2020]">Innovation</span> & Business Growth
            </h2>
            <p className="about-text-element opacity-0 text-[#555] text-[1.1rem] leading-relaxed">
              <strong>RISE Jhansi Incubation Centre</strong> is a premier business incubation center of Jhansi Smart City Limited. We are dedicated to creating a vibrant culture of excellence and sustaining young business minds.
            </p>
            <p className="about-text-element opacity-0 text-[#666] text-[1.05rem] leading-relaxed">
              By offering mentorship, support for innovation, financial facilitation, technological backing, and strategic marketing guidance, we provide all the necessary structural support required to turn a raw idea into a market-ready business.
            </p>
            
            <div className="about-text-element opacity-0 pt-6">
              <ul className="space-y-3">
                {['Mentorship & Expert Guidance', 'Financial Facilitation', 'Technological & Marketing Support'].map((item, i) => (
                  <li key={i} className="flex items-center text-[#444] font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#ff2020] mr-3 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Overlapping Images */}
          <div className="about-image-wrapper opacity-0 relative h-[450px] lg:h-[500px] w-full flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff2020]/5 to-transparent rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>
            
            {/* Main Image 1 */}
            <div className="absolute top-0 right-10 w-[65%] h-[70%] rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-4 border-white z-10 hover:scale-105 transition-transform duration-500 bg-[#eee]">
              <img src={aboutImg1} alt="RISE Jhansi Infrastructure" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Overlapping Image 2 */}
            <div className="absolute bottom-0 left-0 w-[55%] h-[60%] rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-4 border-white z-20 hover:scale-105 transition-transform duration-500 bg-[#eee]">
              <img src={aboutImg2} alt="Startups at RISE Jhansi" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-10 right-4 bg-white p-4 rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-30 flex items-center space-x-3 border-l-4 border-[#ff2020]">
              <div className="w-12 h-12 bg-[#fff5f5] rounded-full flex items-center justify-center">
                <Rocket className="w-6 h-6 text-[#ff2020]" />
              </div>
              <div>
                <p className="text-[1.2rem] font-bold text-[#333] leading-none">Smart City</p>
                <p className="text-[#888] text-sm font-medium">Initiative</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= VISION & MISSION SECTION ================= */}
        <section ref={visionMissionRef} className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Vision Card */}
            <div className="vm-card opacity-0 bg-white p-[40px] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#eee] border-t-[4px] border-t-[#ff2020] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,32,32,0.1)] transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#fff5f5] rounded-bl-[100px] z-0 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="w-16 h-16 bg-[#ff2020] rounded-[15px] flex items-center justify-center mb-6 relative z-10 shadow-[0_8px_20px_rgba(255,32,32,0.3)] text-white group-hover:rotate-12 transition-transform duration-300">
                <Eye className="w-8 h-8" />
              </div>
              
              <h3 className="text-[1.8rem] font-extrabold text-[#333] mb-4 relative z-10">Our Vision</h3>
              <p className="text-[#666] text-[1.05rem] leading-relaxed relative z-10">
                Our foremost vision is to provide a platform for aspiring entrepreneurs to launch their businesses with the least amount of risk possible. We aim to build a world-class, self-sustaining enterprise incubation facility and innovation ecosystem. 
                <br /><br />
                This ecosystem will foster ventures that are knowledge-based, technologically unique, socially relevant, and have a growing financial impact on the residents of Smart City Jhansi, Uttar Pradesh, and our nation at large.
              </p>
            </div>

            {/* Mission Card */}
            <div className="vm-card opacity-0 bg-white p-[40px] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#eee] border-t-[4px] border-t-[#333] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f8f9fa] rounded-bl-[100px] z-0 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="w-16 h-16 bg-[#333] rounded-[15px] flex items-center justify-center mb-6 relative z-10 shadow-[0_8px_20px_rgba(0,0,0,0.2)] text-white group-hover:rotate-12 transition-transform duration-300">
                <Target className="w-8 h-8" />
              </div>
              
              <h3 className="text-[1.8rem] font-extrabold text-[#333] mb-4 relative z-10">Our Mission</h3>
              <p className="text-[#666] text-[1.05rem] leading-relaxed relative z-10">
                The mission of RISE Jhansi Incubation Centre is to develop and empower the next generation of business leaders to solve local problems. 
                <br /><br />
                We are committed to supporting sustainable start-up businesses that will generate jobs, energize communities, market cutting-edge technology, and significantly boost regional and national economies.
              </p>
            </div>

          </div>
        </section>

      </div>

      {/* ================= INDUSTRY EXPERTISE SECTION ================= */}
      <section ref={industriesRef} className="bg-[#f8f9fa] py-20 border-t border-b border-[#eee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-[2rem] md:text-[2.5rem] font-extrabold text-[#333] tracking-tight mb-4">
              Industry Specific <span className="text-[#ff2020]">Expertise</span>
            </h2>
            <div className="w-[80px] h-[5px] bg-[#ff2020] rounded-full mx-auto mb-6"></div>
            <p className="text-[#666] text-[1.1rem]">
              We provide tailored mentorship, infrastructure, and support across a wide spectrum of rapidly growing industries and sectors.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-5">
            {industries.map((industry, index) => (
              <div 
                key={index}
                className="industry-pill opacity-0 bg-white px-[20px] py-[12px] rounded-[50px] shadow-[0_4px_10px_rgba(0,0,0,0.04)] border border-[#eee] flex items-center group hover:border-[#ff2020] hover:shadow-[0_8px_15px_rgba(255,32,32,0.1)] transition-all duration-300 cursor-default"
              >
                <div className="w-2 h-2 rounded-full bg-[#ccc] group-hover:bg-[#ff2020] mr-3 transition-colors duration-300"></div>
                <span className="text-[#444] font-semibold text-[0.95rem] group-hover:text-[#ff2020] transition-colors duration-300">
                  {industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="max-w-4xl mx-auto px-4 text-center mt-24 mb-10">
        <h2 className="text-[2rem] font-bold text-[#333] mb-6">Ready to Accelerate Your Idea?</h2>
        <button 
          onClick={() => window.location.href = '/startup-registration'} 
          className="inline-flex items-center justify-center px-[40px] py-[16px] bg-[#ff2020] text-white rounded-[50px] font-bold text-[1.1rem] shadow-[0_10px_20px_rgba(255,32,32,0.25)] border-2 border-[#ff2020] transition-all duration-300 hover:bg-transparent hover:text-[#ff2020] hover:-translate-y-1"
        >
          <Lightbulb className="mr-2 w-5 h-5" />
          Apply For Incubation
        </button>
      </section>

    </main>
  );
}