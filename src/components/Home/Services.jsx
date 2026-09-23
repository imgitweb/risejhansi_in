// ==========================================
// 3. Services.jsx
// ==========================================
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

import service1 from '../../img/service_1.png';
import service2 from '../../img/service_2.png';
import service3 from '../../img/service_3.png';
import service4 from '../../img/service_4.png';
import service5 from '../../img/service_5.png';
import service6 from '../../img/service_6.png';
import service7 from '../../img/service_7.png';
import service8 from '../../img/service_8.png';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  const servicesData = [
    { id: 1, title: "Mentorship & Handholding", image: service1, desc: "Pairing with experienced mentors providing strategic guidance to accelerate your growth." },
    { id: 2, title: "Funding Support", image: service2, desc: "Explore innovative fundraising concepts to connect with potential investors and resources." },
    { id: 3, title: "IT Co-Working Space", image: service3, desc: "Technology-equipped workspace for collaboration, innovation, and enhanced productivity." },
    { id: 4, title: "Women Startup Program", image: service4, desc: "Empowering women entrepreneurs by providing specialized resources to transform ideas." },
    { id: 5, title: "Launchpad", image: service5, desc: "A stimulating environment combining creativity, guidance, and peer collaboration." },
    { id: 6, title: "Modern Prototyping Lab", image: service6, desc: "Transform concepts into working prototypes using digital fabrication tools." },
    { id: 7, title: "Business Model & Marketing", image: service7, desc: "Guiding startups in developing effective models and strategic marketing plans." },
    { id: 8, title: "Grant & Investment", image: service8, desc: "Assisting in preparing compelling pitches and navigating grant opportunities." }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(headerRef.current.children,
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: headerRef.current, start: "top 80%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );

      // Advanced Card Stagger
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 80, opacity: 0, scale: 0.95 },
          {
            scrollTrigger: { trigger: card, start: "top 85%" },
            y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power4.out",
            delay: (index % 4) * 0.1 // Stagger by row position
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-[#f4f4f6] relative font-['Poppins',sans-serif]" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-[2px] bg-[#ff2020]"></span>
            <span className="text-[#ff2020] font-black tracking-widest uppercase text-sm">Ecosystem</span>
            <span className="w-8 h-[2px] bg-[#ff2020]"></span>
          </div>
          <h2 className="text-[3rem] lg:text-[4rem] font-black text-[#1a1a1a] tracking-tight leading-[1.1] mb-6">
            Comprehensive <br/> <span className="text-[#ff2020]">Startup Support</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium">
            Everything you need to transform your raw idea into a scalable, fundable, and globally recognized enterprise.
          </p>
        </div>

        {/* Breathtaking Masonry/Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service, index) => (
            <div 
              key={service.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative h-[400px] rounded-[2rem] overflow-hidden bg-white shadow-lg cursor-pointer"
            >
              {/* Background Image Container */}
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Number Badge */}
              <div className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white font-black text-xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#ff2020] group-hover:border-[#ff2020]">
                0{service.id}
              </div>

              {/* Text Content - Rises on Hover */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-8 flex flex-col justify-end h-full transform translate-y-8 transition-transform duration-500 group-hover:translate-y-0">
                <h3 className="text-2xl font-black text-white mb-3 leading-tight drop-shadow-md">
                  {service.title}
                </h3>
                <div className="overflow-hidden">
                  <p className="text-gray-300 font-medium leading-relaxed opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    {service.desc}
                  </p>
                </div>
                {/* Custom Action Arrow */}
                <div className="w-10 h-10 mt-6 rounded-full bg-white/10 flex items-center justify-center opacity-0 transform translate-y-4 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0 border border-white/20 group-hover:bg-[#ff2020] group-hover:border-[#ff2020]">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;