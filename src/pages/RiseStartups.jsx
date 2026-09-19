import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, MapPin, Globe, MessageCircle, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const RiseStartups = () => {
  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const cardsContainerRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('Current'); // 'Current' or 'Graduated'

  // Dummy Data for Startups (Colors unified via CSS now)
  const startupsData = [
    // --- GRADUATED STARTUPS ---
    {
      id: 1,
      name: "HOSTELSNEARME",
      location: "Jhansi, Uttar Pradesh",
      status: "Graduated",
      sector: "Commercial",
      date: "Graduated: Mar 2025",
      logoText: "HN",
      hasWebsite: true,
      hasWhatsapp: true
    },
    {
      id: 2,
      name: "BEKAR KO AAKAR",
      location: "Jhansi, Uttar Pradesh",
      status: "Graduated",
      sector: "Social welfare and development",
      date: "Graduated: Mar 2025",
      logoText: "BK",
      hasWebsite: true,
      hasWhatsapp: false
    },
    {
      id: 3,
      name: "VMS2",
      location: "Jhansi, Uttar Pradesh",
      status: "Graduated",
      sector: "Information Technology",
      date: "Graduated: Dec 2024",
      logoText: "VM",
      hasWebsite: true,
      hasWhatsapp: true
    },
    {
      id: 4,
      name: "HAPPYPOT",
      location: "Jhansi, Uttar Pradesh",
      status: "Graduated",
      sector: "Agriculture",
      date: "Graduated: Jan 2025",
      logoText: "HP",
      hasWebsite: false,
      hasWhatsapp: true
    },
    {
      id: 5,
      name: "MANIRAM INDUSTRIES",
      location: "Jhansi, Uttar Pradesh",
      status: "Graduated",
      sector: "Commercial",
      date: "Graduated: Dec 2024",
      logoText: "MI",
      hasWebsite: true,
      hasWhatsapp: false
    },
    {
      id: 6,
      name: "THE ADVENTURE BUDDY",
      location: "Jhansi, Uttar Pradesh",
      status: "Graduated",
      sector: "Commercial",
      date: "Graduated: Dec 2024",
      logoText: "AB",
      hasWebsite: true,
      hasWhatsapp: true
    },

    // --- CURRENT STARTUPS ---
    {
      id: 7,
      name: "TECHNOFIX SOLUTIONS",
      location: "Jhansi, Uttar Pradesh",
      status: "Current",
      sector: "EdTech",
      date: "Incubated: Jan 2026",
      logoText: "TS",
      hasWebsite: true,
      hasWhatsapp: true
    },
    {
      id: 8,
      name: "GREEN AGRI",
      location: "Lalitpur, Uttar Pradesh",
      status: "Current",
      sector: "AgriTech",
      date: "Incubated: Feb 2026",
      logoText: "GA",
      hasWebsite: false,
      hasWhatsapp: true
    },
    {
      id: 9,
      name: "MEDICARE PLUS",
      location: "Jhansi, Uttar Pradesh",
      status: "Current",
      sector: "HealthTech",
      date: "Incubated: Mar 2026",
      logoText: "MP",
      hasWebsite: true,
      hasWhatsapp: false
    },
    {
      id: 10,
      name: "URBAN CRAFTS",
      location: "Jhansi, Uttar Pradesh",
      status: "Current",
      sector: "E-Commerce",
      date: "Incubated: Apr 2026",
      logoText: "UC",
      hasWebsite: true,
      hasWhatsapp: true
    },
    {
      id: 11,
      name: "JHANSI RIDES",
      location: "Jhansi, Uttar Pradesh",
      status: "Current",
      sector: "Logistics",
      date: "Incubated: May 2026",
      logoText: "JR",
      hasWebsite: true,
      hasWhatsapp: true
    }
  ];

  // Filtering data based on active tab
  const filteredStartups = startupsData.filter(startup => startup.status === activeTab);
  const currentCount = startupsData.filter(s => s.status === 'Current').length;
  const graduatedCount = startupsData.filter(s => s.status === 'Graduated').length;

  // Initial Load Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bannerTextRef.current, { y: 40, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // Animate cards whenever the Tab changes
  useEffect(() => {
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.children;
      gsap.fromTo(cards, 
        { y: 40, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: "power4.out", overwrite: "auto" }
      );
    }
  }, [activeTab]);

  return (
    <main ref={pageRef} className="flex-grow bg-[#fdfdfd] min-h-screen pt-20 pb-24 font-['Poppins',sans-serif]">
      
      {/* ================= TOP BANNER (Premium Dark Theme) ================= */}
      <div className="w-full bg-[#1a1a1a] py-24 relative overflow-hidden shadow-inner">
        {/* Decorative Glowing Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/15 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/10 blur-[100px]"></div>
        
        <div ref={bannerTextRef} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-block px-[16px] py-[6px] rounded-full bg-[#ff2020]/10 border border-[#ff2020]/30 text-[#ff2020] font-semibold text-sm mb-6 backdrop-blur-sm shadow-sm">
            Our Portfolio
          </div>
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
            Rise <span className="text-[#ff2020]">Startups</span>
          </h1>
          <p className="text-[#aaa] text-[1.1rem] font-medium max-w-2xl mx-auto leading-relaxed">
            Discover the innovative startups shaping the future, nurtured within our vibrant ecosystem.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

        {/* ================= TABS (Pill style to match Career page) ================= */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {/* Current Startups Tab */}
          <button 
            onClick={() => setActiveTab('Current')}
            className={`flex items-center px-[24px] py-[10px] rounded-[50px] text-[0.95rem] font-bold transition-all duration-300 border-2 ${
              activeTab === 'Current' 
                ? 'bg-[#ff2020] text-white border-[#ff2020] shadow-[0_8px_20px_rgba(255,32,32,0.25)] -translate-y-1'
                : 'bg-white text-[#555] border-[#eee] hover:border-[#ff2020] hover:text-[#ff2020] hover:-translate-y-1 hover:shadow-md'
            }`}
          >
            Current Startups 
            <span className={`ml-2 text-[0.75rem] px-[8px] py-[2px] rounded-full flex items-center justify-center ${activeTab === 'Current' ? 'bg-white/20 text-white' : 'bg-[#eee] text-[#555]'}`}>
              {currentCount}
            </span>
          </button>

          {/* Graduated Startups Tab */}
          <button 
            onClick={() => setActiveTab('Graduated')}
            className={`flex items-center px-[24px] py-[10px] rounded-[50px] text-[0.95rem] font-bold transition-all duration-300 border-2 ${
              activeTab === 'Graduated' 
                ? 'bg-[#333] text-white border-[#333] shadow-[0_8px_20px_rgba(0,0,0,0.2)] -translate-y-1'
                : 'bg-white text-[#555] border-[#eee] hover:border-[#333] hover:text-[#333] hover:-translate-y-1 hover:shadow-md'
            }`}
          >
            Graduated Startups 
            <span className={`ml-2 text-[0.75rem] px-[8px] py-[2px] rounded-full flex items-center justify-center ${activeTab === 'Graduated' ? 'bg-white/20 text-white' : 'bg-[#eee] text-[#555]'}`}>
              {graduatedCount}
            </span>
          </button>
        </div>

        {/* ================= STARTUP CARDS GRID ================= */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {filteredStartups.map((startup) => (
            <div 
              key={startup.id} 
              className="bg-white rounded-[20px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-[#eee] overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,32,32,0.08)] transition-all duration-500 group relative z-10"
            >
              {/* Animated Top Border on Hover */}
              <div className={`absolute top-0 left-0 w-full h-[4px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20 ${startup.status === 'Current' ? 'bg-[#ff2020]' : 'bg-[#333]'}`}></div>

              <div className="p-[30px] flex-grow flex flex-col items-center text-center relative z-10">
                
                {/* Logo Placeholder (Initials) */}
                <div className="w-[90px] h-[90px] rounded-full bg-[#f8f9fa] border-2 border-[#eee] shadow-sm flex items-center justify-center text-[1.8rem] font-extrabold text-[#ccc] mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-[#fff5f5] group-hover:border-[#ff2020]/30 group-hover:text-[#ff2020]">
                  {startup.logoText}
                </div>
                
                {/* Name & Location */}
                <h3 className={`text-[1.25rem] font-extrabold uppercase tracking-wide mb-1 transition-colors duration-300 ${startup.status === 'Current' ? 'text-[#333] group-hover:text-[#ff2020]' : 'text-[#333] group-hover:text-[#333]'}`}>
                  {startup.name}
                </h3>
                <p className="text-[0.85rem] font-medium text-[#888] flex items-center justify-center mb-5">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> {startup.location}
                </p>

                {/* Status Badge */}
                <div className={`inline-flex items-center px-[14px] py-[6px] rounded-[50px] text-[0.75rem] font-bold uppercase tracking-wider mb-5 border ${
                  startup.status === 'Graduated' 
                    ? 'bg-[#f8f9fa] text-[#333] border-[#eee]' 
                    : 'bg-[#fff5f5] text-[#ff2020] border-[#ff2020]/20'
                }`}>
                  {startup.status === 'Graduated' ? <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> : <Rocket className="w-3.5 h-3.5 mr-1.5" />}
                  {startup.status}
                </div>

                {/* Sector & Date */}
                <p className="text-[0.95rem] text-[#555] mb-2 font-semibold">
                  {startup.sector}
                </p>
                <p className="text-[0.8rem] text-[#aaa] font-medium">
                  {startup.date}
                </p>
              </div>

              {/* Bottom Social Icons */}
              <div className="border-t border-[#eee] py-[15px] flex justify-center space-x-4 bg-[#fcfcfc] relative z-10">
                {startup.hasWebsite ? (
                  <button className="w-[38px] h-[38px] rounded-full bg-[#f8f9fa] text-[#555] border border-[#eee] flex items-center justify-center hover:bg-[#333] hover:text-white hover:border-[#333] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                    <Globe className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-[38px] h-[38px] rounded-full bg-transparent flex items-center justify-center opacity-0"></div>
                )}
                
                {startup.hasWhatsapp ? (
                  <button className="w-[38px] h-[38px] rounded-full bg-[#f8f9fa] text-[#555] border border-[#eee] flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-[38px] h-[38px] rounded-full bg-transparent flex items-center justify-center opacity-0"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredStartups.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[20px] border border-[#eee] shadow-sm">
            <div className="w-[80px] h-[80px] bg-[#f8f9fa] rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-[#ccc]" />
            </div>
            <h3 className="text-[1.3rem] font-bold text-[#333] mb-2">No startups found</h3>
            <p className="text-[#888] text-[1rem]">We couldn't find any startups in this category.</p>
          </div>
        )}

      </div>
    </main>
  );
};

export default RiseStartups;