import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, ArrowRight } from 'lucide-react';

// Import image directly from src/img folder
import aboutImg from '../../img/about_.png';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const listItemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Text sliding in from the left
      gsap.from(textContainerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: -50,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
      });

      // 2. Image sliding in from the right with a slight scale
      gsap.from(imageContainerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: 60,
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.2)"
      });

      // 3. Staggered reveal for the feature list
      gsap.from(listItemsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.4
      });
      
    }, sectionRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#fdfdfd] overflow-hidden font-['Poppins',sans-serif]" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Text & Content */}
          <div ref={textContainerRef} className="space-y-6 z-10">
            {/* Theme Badge */}
            <div className="inline-block px-[16px] py-[6px] rounded-full bg-[#fff5f5] border border-[#ff2020]/20 text-[#ff2020] font-semibold text-sm shadow-sm">
              Know About Us
            </div>
            
            {/* Headline */}
            <h2 className="text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-extrabold text-[#333] tracking-tight leading-[1.15]">
              Driving Transformative <br />
              <span className="text-[#ff2020] relative after:content-[''] after:absolute after:bottom-[5px] after:left-0 after:w-full after:h-[12px] after:bg-[#ff2020]/10 after:z-[-1]">
                Change in Bundelkhand
              </span>
            </h2>
            
            {/* Red Accent Divider */}
            <div className="w-[80px] h-[5px] bg-[#ff2020] rounded-full mt-4 mb-6"></div>
            
            {/* Paragraphs */}
            <p className="text-[1.1rem] text-[#555] leading-relaxed">
              Rani Laxmibai Incubator for Sustainable Entrepreneurship (RISE) Jhansi aspires to synergise startups, innovators, MSMEs, corporations, governments, academia, and investors.
            </p>
            <p className="text-[1.1rem] text-[#555] leading-relaxed mb-6">
              Our innovation ecosystem promises to stand firmly on various services, bridging the gap between raw ideas and successful enterprises.
            </p>

            {/* Key Highlights List */}
            <ul className="space-y-4 mb-8 mt-6">
              {[
                "Mentorship & Strategic Guidance",
                "Access to Funding & Investors",
                "State-of-the-Art Co-working Space"
              ].map((item, index) => (
                <li 
                  key={index}
                  ref={(el) => (listItemsRef.current[index] = el)}
                  className="flex items-center text-[#333] font-semibold text-[1.05rem]"
                >
                  <CheckCircle className="w-6 h-6 text-[#ff2020] mr-4 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            
            {/* Button */}
            <button className="flex items-center mt-8 px-[35px] py-[15px] bg-transparent text-[#333] border-2 border-[#333] rounded-[50px] font-semibold shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-[#333] hover:text-white hover:-translate-y-1 transition-all duration-300 group">
              Discover Our Journey
              <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Side - Image with Floating Gradients */}
          <div ref={imageContainerRef} className="relative group lg:ml-8 mt-12 lg:mt-0">
            {/* Decorative background blocks - Changed to Theme Red */}
            <div className="absolute -inset-4 bg-[#ff2020]/10 rounded-[20px] transform rotate-3 group-hover:rotate-1 transition-transform duration-700 -z-10 blur-xl"></div>
            <div className="absolute -inset-4 bg-[#ff2020]/5 rounded-[20px] transform -rotate-2 group-hover:-rotate-1 transition-transform duration-700 -z-10"></div>
            
            {/* Image Container */}
            <div className="relative rounded-[20px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-4 border-white bg-white">
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/10 mix-blend-overlay z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
              <img 
                src={aboutImg} 
                alt="About RISE Jhansi" 
                className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
              />
            </div>

            {/* Floating Stats Badge */}
            <div className="absolute -bottom-8 -left-6 lg:-left-10 bg-white p-5 rounded-[15px] shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center space-x-4 z-20 hover:-translate-y-2 transition-transform duration-300 cursor-default">
              <div className="w-16 h-16 rounded-full bg-[#ff2020] flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
                10+
              </div>
              <div>
                <p className="text-[#333] font-extrabold text-[1.15rem] leading-tight">Startups</p>
                <p className="text-sm text-[#666] font-medium mt-0.5">Incubated Successfully</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;