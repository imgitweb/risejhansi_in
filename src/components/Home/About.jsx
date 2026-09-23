import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, ArrowRight } from 'lucide-react';

import aboutImg from '../../img/about_.png';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const listItemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text Content Reveal
      gsap.fromTo(textContainerRef.current.children, 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out"
        }
      );

      // Image Container Reveal with Parallax Scale
      gsap.fromTo(imageContainerRef.current, 
        { x: 100, scale: 0.8, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          x: 0, scale: 1, opacity: 1, duration: 1.2, ease: "expo.out"
        }
      );

      // List Items Stagger
      gsap.fromTo(listItemsRef.current, 
        { x: -30, opacity: 0 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
          x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.5)"
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-white overflow-hidden font-['Poppins',sans-serif]" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side - Content */}
          <div ref={textContainerRef} className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#ff2020]"></span>
              <span className="text-[#ff2020] font-black tracking-widest uppercase text-sm">Know About Us</span>
            </div>
            
            <h2 className="text-[3rem] md:text-[4rem] font-black text-[#1a1a1a] tracking-tight leading-[1.1]">
              Driving Transformative <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-rose-500">Change in Bundelkhand</span>
            </h2>
            
            <p className="text-xl text-gray-500 leading-relaxed font-medium">
              Rani Laxmibai Incubator for Sustainable Entrepreneurship (RISE) Jhansi aspires to synergise startups, innovators, MSMEs, corporations, governments, academia, and investors.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Our innovation ecosystem bridges the gap between raw ideas and successful enterprises through world-class infrastructure and guidance.
            </p>

            <ul className="space-y-5 pt-4">
              {[
                "Mentorship & Strategic Guidance",
                "Access to Funding & Investors",
                "State-of-the-Art Co-working Space"
              ].map((item, index) => (
                <li key={index} ref={(el) => (listItemsRef.current[index] = el)} className="flex items-center text-[#1a1a1a] font-bold text-lg bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-[#ff2020]/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#ff2020]/10 flex items-center justify-center mr-4">
                    <CheckCircle2 className="w-6 h-6 text-[#ff2020]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            
            <button className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#1a1a1a] text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <div className="absolute inset-0 w-full h-full bg-[#ff2020] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
              <span className="relative z-10 flex items-center gap-3">
                Discover Our Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Right Side - Image & Decor */}
          <div ref={imageContainerRef} className="relative group lg:pl-10">
            {/* Abstract Geometry Behind */}
            <div className="absolute top-10 -right-10 w-full h-full bg-gray-100 rounded-[3rem] -z-10 transition-transform duration-500 group-hover:rotate-3"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#ff2020]/10 rounded-full blur-[60px] -z-10"></div>
            
            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.1)] border-8 border-white bg-white">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              <img src={aboutImg} alt="About RISE" className="w-full h-[600px] object-cover transform transition-transform duration-1000 group-hover:scale-105" />
              
              {/* Rotating Stamp Overlay */}
              <div className="absolute top-8 right-8 w-36 h-36 bg-white/90 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center z-20">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_12s_linear_infinite]">
                  {/* Circle path radius chhota kiya gaya (35) taki spacing aur clear mile */}
                  <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                  
                  {/* Font size 9px aur letter spacing badha di gayi hai */}
                  <text className="text-[9px] font-black uppercase tracking-[0.2em] fill-[#ff2020]">
                    <textPath href="#circlePath" startOffset="0%">
                      {'INNOVATE • EMPOWER • SCALE • '}
                    </textPath>
                  </text>
                </svg>
                <div className="absolute w-12 h-12 bg-[#ff2020] rounded-full flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-white -rotate-45" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;