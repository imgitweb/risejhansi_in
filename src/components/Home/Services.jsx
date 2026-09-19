import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Importing images directly from src/img/
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
    {
      id: 1,
      title: "Mentorship and Handholding",
      image: service1,
      desc: "We pair you with experienced mentors who provide strategic guidance to accelerate your business growth and development."
    },
    {
      id: 2,
      title: "Funding Support",
      image: service2,
      desc: "We continuously explore innovative fundraising concepts to connect your startup with potential investors and financial resources."
    },
    {
      id: 3,
      title: "Co-Working Space with IT enable",
      image: service3,
      desc: "Our technology-equipped workspace provides an ideal environment for collaboration, innovation, and enhanced productivity."
    },
    {
      id: 4,
      title: "Women Startup Program",
      image: service4,
      desc: "We empower women entrepreneurs by providing specialized resources and support to transform innovative ideas into successful businesses."
    },
    {
      id: 5,
      title: "Launchpad",
      image: service5,
      desc: "Our stimulating environment combines creativity, expert guidance, practical advice, and peer collaboration to help establish your business foundation."
    },
    {
      id: 6,
      title: "Modern Prototyping Lab",
      image: service6,
      desc: "Our facility helps innovators transform concepts into working prototypes using digital fabrication tools and specialized equipment."
    },
    {
      id: 7,
      title: "Business Model & Marketing",
      image: service7,
      desc: "We guide startups in developing effective business models and creating strategic marketing plans to reach their target audience."
    },
    {
      id: 8,
      title: "Grant & Investment",
      image: service8,
      desc: "We assist startups in preparing compelling investment pitches and navigating various government and private grant opportunities."
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Animation
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%", 
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out"
        }
      );

      // 2. Individual Card Animation
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
            delay: (index % 3) * 0.15 // Stagger effect by column
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#f8f9fa] overflow-hidden font-['Poppins',sans-serif]" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 opacity-0">
          {/* Theme Badge */}
          <div className="inline-block px-[16px] py-[6px] rounded-full bg-[#fff5f5] border border-[#ff2020]/20 text-[#ff2020] font-semibold text-sm mb-4 shadow-sm">
            What We Offer
          </div>
          
          <h2 className="text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-extrabold text-[#333] tracking-tight leading-tight mb-4">
            Our <span className="text-[#ff2020] relative after:content-[''] after:absolute after:bottom-[8px] after:left-0 after:w-full after:h-[12px] after:bg-[#ff2020]/10 after:z-[-1]">Services</span>
          </h2>
          
          {/* Red Accent Divider */}
          <div className="w-[80px] h-[5px] bg-[#ff2020] rounded-full mx-auto mt-4 mb-6"></div>
          
          <p className="text-[1.1rem] text-[#555] leading-relaxed">
            Rani Laxmibai Incubator for Sustainable Entrepreneurship (RISE) Jhansi aspires to synergise startups, innovators, MSMEs, corporations, governments, academia and investors to drive transformative change.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {servicesData.map((service, index) => (
            <div 
              key={service.id}
              ref={(el) => (cardsRef.current[index] = el)}
              // Note: Removed overflow-hidden from here and added hover:z-50 so the pop-out image overlaps other cards
              className="bg-white rounded-[20px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-[#eee] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,32,32,0.1)] transition-all duration-500 flex flex-col opacity-0 relative z-10 hover:z-50"
            >
              {/* Animated Top Border on Hover */}
              <div className="absolute top-0 left-0 w-full h-[4px] bg-[#ff2020] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20 rounded-t-[20px]"></div>

              {/* Image Container - Added group/img to target image hover specifically */}
              <div className="relative h-[220px] w-full rounded-t-[20px] group/img cursor-pointer">
                
                {/* 1. Base Image (Clips to card boundary) */}
                <div className="absolute inset-0 overflow-hidden rounded-t-[20px]">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 2. Pop-out Image (Breaks outside the card boundary on hover) */}
                <img 
                  src={service.image} 
                  alt={service.title} 
                  // Scales up by 1.25, becomes fully opaque, and adds a nice 3D shadow
                  className="absolute inset-0 w-full h-full object-cover rounded-t-[20px] opacity-0 group-hover/img:opacity-100 group-hover/img:scale-[1.25] group-hover/img:rounded-[15px] group-hover/img:shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-all duration-500 z-50 pointer-events-none"
                />
              </div>
              
              {/* Card Content */}
              {/* Added rounded-b-[20px] to preserve card shape since overflow-hidden was removed */}
              <div className="p-[30px] flex flex-col flex-grow bg-white rounded-b-[20px] z-10 relative">
                <h3 className="text-[1.25rem] font-extrabold text-[#333] mb-3 group-hover:text-[#ff2020] transition-colors duration-300 leading-snug">
                  {service.title}
                </h3>
                <p className="text-[#666] text-[0.95rem] leading-relaxed flex-grow">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;