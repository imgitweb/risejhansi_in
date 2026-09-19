import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Settings, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const NewsEvents = () => {
  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const cardsRef = useRef([]);
  const alertRef = useRef(null);

  // Mock data for Latest Events
  const eventsData = [
    {
      id: 1,
      title: "Startup Pitch Deck Workshop",
      date: "24 June, 2026",
      category: "Event",
      image: "/img/service_1.png", // Using existing images as placeholder
      desc: "Learn how to craft a compelling pitch deck that grabs investors' attention instantly."
    },
    {
      id: 2,
      title: "Govt. Grants & Funding Seminar",
      date: "10 July, 2026",
      category: "Seminar",
      image: "/img/service_2.png",
      desc: "An exclusive session on navigating government schemes and securing seed funds."
    },
    {
      id: 3,
      title: "Women in Tech Meetup",
      date: "18 Aug, 2026",
      category: "News",
      image: "/img/service_4.png",
      desc: "Celebrating female founders and fostering a strong community of women entrepreneurs."
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Banner Text Animation (Triggers immediately on load)
      gsap.from(bannerTextRef.current, { 
        y: 40, 
        opacity: 0, 
        duration: 1, 
        ease: "power4.out", 
        delay: 0.1 
      });

      // 2. Events Cards Animation (Staggered with slight scale)
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power4.out",
            delay: (index % 3) * 0.15
          }
        );
      });

      // 3. API Alert Box Animation
      gsap.fromTo(alertRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: alertRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power4.out",
          delay: 0.3
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={pageRef} className="flex-grow bg-[#fdfdfd] min-h-screen pt-20 pb-24 font-['Poppins',sans-serif]" id="news-events">
      
      {/* ================= TOP BANNER (Premium Dark Theme) ================= */}
      <div className="w-full bg-[#1a1a1a] py-24 relative overflow-hidden shadow-inner">
        {/* Decorative Glowing Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/15 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/10 blur-[100px]"></div>
        
        <div ref={bannerTextRef} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-block px-[16px] py-[6px] rounded-full bg-[#ff2020]/10 border border-[#ff2020]/30 text-[#ff2020] font-semibold text-sm mb-6 backdrop-blur-sm shadow-sm">
            Stay Updated
          </div>
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
            News & <span className="text-[#ff2020]">Events</span>
          </h1>
          <p className="text-[#aaa] text-[1.1rem] font-medium max-w-2xl mx-auto leading-relaxed">
            Catch up on the latest happenings, workshops, and milestones at RISE Jhansi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mb-24">
          {eventsData.map((event, index) => (
            <div 
              key={event.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="bg-white rounded-[20px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-[#eee] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,32,32,0.12)] transition-all duration-500 flex flex-col opacity-0 relative z-10"
            >
              {/* Animated Top Border on Hover */}
              <div className="absolute top-0 left-0 w-full h-[4px] bg-[#ff2020] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20"></div>

              <div className="relative h-[240px] overflow-hidden">
                {/* Floating Date Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-[14px] py-[8px] rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] z-20 flex items-center text-[0.85rem] font-bold text-[#333] border border-white/50">
                  <Calendar className="w-4 h-4 mr-2 text-[#ff2020]" />
                  {event.date}
                </div>
                
                {/* Image Overlay & Zoom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-500 z-10"></div>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="p-[30px] flex flex-col flex-grow bg-white z-10 relative">
                <span className="text-[0.8rem] font-extrabold uppercase tracking-wider text-[#ff2020] mb-3">
                  {event.category}
                </span>
                
                <h3 className="text-[1.3rem] font-extrabold text-[#333] mb-3 group-hover:text-[#ff2020] transition-colors duration-300 leading-snug">
                  {event.title}
                </h3>
                
                <p className="text-[#666] text-[0.95rem] leading-relaxed flex-grow mb-6">
                  {event.desc}
                </p>

                {/* Read Article Link */}
                <div className="mt-auto pt-5 border-t border-[#eee]">
                  <button className="flex items-center text-[0.95rem] font-bold text-[#333] group-hover:text-[#ff2020] transition-colors">
                    Read Article <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium API Setup Notice */}
        <div ref={alertRef} className="max-w-4xl mx-auto opacity-0">
          <div className="relative overflow-hidden bg-[#333] rounded-[20px] p-[30px] sm:p-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-[#ff2020]/20">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-[#ff2020]/20 rounded-full blur-[40px]"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-[#ff2020]/10 rounded-full blur-[40px]"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-[25px]">
              {/* Icon Box */}
              <div className="w-[60px] h-[60px] rounded-full bg-[#fff5f5] flex items-center justify-center flex-shrink-0 border border-[#ff2020]/30 shadow-inner">
                <Settings className="w-7 h-7 text-[#ff2020]" />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-[1.3rem] sm:text-[1.5rem] font-bold text-white mb-2 leading-tight">
                  Facebook API Setup Required
                </h3>
                <p className="text-[#ccc] text-[0.95rem] mb-4 leading-relaxed">
                  To display dynamic live posts from Facebook, the Graph API needs to be configured by the administrator.
                </p>
                
                {/* Styled Instructions List */}
                <ul className="text-[#e0e0e0] text-[0.9rem] space-y-2 mb-0 font-medium">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#ff2020] mr-3 shrink-0"></span> 
                    Go to Facebook for Developers & Create App
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-[#ff2020] mr-3 shrink-0"></span> 
                    Generate Page Access Token
                  </li>
                  <li className="flex items-center flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-[#ff2020] mr-3 shrink-0"></span> 
                    Update <code className="text-[#ff2020] bg-[#1a1a1a] px-[6px] py-[2px] rounded-[4px] mx-1 my-1 border border-[#ff2020]/20 text-[0.8rem]">YOUR_PAGE_ACCESS_TOKEN</code> in backend
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default NewsEvents;