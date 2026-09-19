import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';

// Import images directly from your src/img folder
import home1 from '../../img/home_1.png';
import home2 from '../../img/home_2.png';
import home3 from '../../img/home_3.png';

const Hero = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    // GSAP Context setup for cleanup
    const ctx = gsap.context(() => {
      
      // 1. Text Animation: Smooth and punchy slide-up
      gsap.from(".hero-text", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.1
      });

      // 2. Images Entrance: Slide, scale, and subtle rotation (Premium Feel)
      gsap.from(imagesRef.current, {
        scale: 0.8,
        x: 60,
        y: 40,
        rotation: (i) => (i % 2 === 0 ? 4 : -4), // Alternate initial rotation
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "back.out(1.2)",
        delay: 0.4
      });

      // 3. Continuous organic floating animation for each image container
      imagesRef.current.forEach((img, index) => {
        gsap.to(img, {
          y: `+=${index === 1 ? -20 : 15}`, 
          x: `+=${index === 0 ? 10 : -10}`,
          rotation: `+=${index === 1 ? 1.5 : -1.5}`, // Subtle floating rotation
          duration: 3 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5 + (index * 0.2) // Start float after entrance
        });
      });

      // 4. Info Card pop-up
      gsap.from(".info-card", {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.5)",
        delay: 1.2
      });

    }, heroRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return (
    <section ref={heroRef} className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-[#fdfdfd] font-['Poppins',sans-serif]">
      
      {/* Background Decorative Gradients - Updated to Theme Colors */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#ff2020]/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-[#ff2020]/5 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content - Text */}
          <div ref={textRef} className="max-w-2xl z-10">
            {/* Badge */}
            <div className="hero-text inline-block px-[16px] py-[6px] rounded-full bg-[#fff5f5] border border-[#ff2020]/20 text-[#ff2020] font-semibold text-sm mb-6 shadow-sm">
              Empowering Startups & Innovators
            </div>
            
            {/* Headline */}
            <h1 className="hero-text text-[2.8rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-[#333] leading-[1.15] mb-6 tracking-tight">
              We <span className="text-[#ff2020]">RISE</span> By <br />
              Lifting Others
            </h1>
            
            {/* Subheadline */}
            <p className="hero-text text-[1.1rem] text-[#555] mb-10 leading-relaxed md:max-w-[90%]">
              Rani Laxmibai Incubator for Sustainable Entrepreneurship (RISE) Jhansi aspires to synergise startups, innovators, MSMEs, and investors to drive transformative change.
            </p>
            
            {/* Buttons */}
            <div className="hero-text flex flex-col sm:flex-row gap-[15px]">
              <button className="inline-flex items-center justify-center px-[35px] py-[15px] bg-[#ff2020] text-white rounded-[50px] font-semibold text-[1rem] shadow-[0_8px_20px_rgba(255,32,32,0.25)] border-2 border-[#ff2020] transition-all duration-300 hover:bg-transparent hover:text-[#ff2020] hover:-translate-y-[3px]">
                Join RISE
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="inline-flex items-center justify-center px-[35px] py-[15px] bg-transparent text-[#333] rounded-[50px] font-semibold text-[1rem] border-2 border-[#333] transition-all duration-300 hover:bg-[#333] hover:text-white hover:-translate-y-[3px]">
                Explore Services
              </button>
            </div>
          </div>

          {/* Right Content - 3 Image Collage with Hover Zoom & Pop-to-top */}
          <div className="relative w-full h-[500px] lg:h-[600px] mt-12 lg:mt-0">
            
            {/* Image 1: Top Left */}
            <div 
              ref={(el) => (imagesRef.current[0] = el)}
              className="absolute top-0 left-0 w-[68%] h-[58%] z-10 hover:z-50"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#ff2020]/20 cursor-pointer group relative">
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
                <img src={home1} alt="RISE Event 1" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Image 2: Center Right - Main Image */}
            <div 
              ref={(el) => (imagesRef.current[1] = el)}
              className="absolute top-[12%] right-0 w-[64%] h-[68%] z-20 hover:z-50"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,32,32,0.15)] hover:border-[#ff2020] cursor-pointer group relative">
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
                <img src={home2} alt="RISE Team" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Image 3: Bottom Left */}
            <div 
              ref={(el) => (imagesRef.current[2] = el)}
              className="absolute bottom-0 left-[5%] w-[62%] h-[48%] z-30 hover:z-50"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#ff2020]/20 cursor-pointer group relative">
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
                <img src={home3} alt="RISE Workspace" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Floating Info Card */}
            <div className="info-card absolute -bottom-4 lg:bottom-2 right-2 lg:right-6 bg-white p-[15px] rounded-[15px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center space-x-4 z-40 transition-transform duration-300 hover:-translate-y-2 cursor-default">
              <div className="w-[50px] h-[50px] rounded-full bg-[#fff5f5] flex items-center justify-center text-[#ff2020] font-bold text-2xl">
                🚀
              </div>
              <div>
                <p className="text-[0.85rem] text-[#666] font-medium leading-tight">Innovation</p>
                <p className="text-[#333] font-bold text-[1.05rem] leading-tight">Ecosystem</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;