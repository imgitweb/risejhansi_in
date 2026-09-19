import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, ArrowRight, User, Mail, Phone, MapPin, Send, Rocket } from 'lucide-react';
import axios from 'axios';
import API_URL from "../components/Config"; // API_URL config se import kiya gaya hai

// Import images from your src/img/ folder
import women1 from '../img/women_1.png';
import women2 from '../img/women_2.png';
import women3 from '../img/women_3.png';
import women4 from '../img/women_4.png';
import women5 from '../img/women_5.png';
import women6 from '../img/women_6.jpg'; 
import women7 from '../img/women_7.jpg'; 
import logoManikarnika from '../img/logo_manikarnika.jpeg';

gsap.registerPlugin(ScrollTrigger);

const WomenCell = () => {
  // Refs
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroImagesRef = useRef([]);
  const aboutRef = useRef(null);
  const aboutTextRef = useRef(null);
  const missionCardRef = useRef(null);
  const logoRef = useRef(null);
  const cohortRef = useRef(null);
  const servicesHeaderRef = useRef(null);
  const serviceCardsRef = useRef([]);
  const formRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    applicant_name: '',
    email_id: '',
    mobile_no: '',
    location: '',
    startupidea: '',
    bot_field: '' // Honeypot
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Services Data
  const servicesData = [
    { id: 1, title: "Incubation Support", image: women1, desc: "Comprehensive assistance for early-stage women entrepreneurs to establish and grow their ventures." },
    { id: 2, title: "Mentorship & Investor Connect", image: women2, desc: "Access to experienced mentors and potential investors to guide and fund your business journey." },
    { id: 3, title: "Digital Marketing Training", image: women3, desc: "Learn essential digital marketing skills to promote and expand your business online." },
    { id: 4, title: "Online Product Selling Platform", image: women4, desc: "Platform to showcase and sell your products to a wider audience through e-commerce." },
    { id: 5, title: "Self-help Group Support", image: women5, desc: "Network with like-minded women entrepreneurs and share resources and experiences." },
    { id: 6, title: "Policy Awareness", image: women6, desc: "Stay informed about government policies and schemes beneficial for women entrepreneurs." }
  ];

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-content", { y: 50, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.1 });
      gsap.from(heroImagesRef.current, { scale: 0.8, x: 60, y: 40, rotation: (i) => (i % 2 === 0 ? 3 : -3), opacity: 0, duration: 1.5, stagger: 0.2, ease: "back.out(1.2)", delay: 0.4 });
      
      heroImagesRef.current.forEach((img, index) => {
        gsap.to(img, { y: `+=${index === 1 ? -15 : 15}`, x: `+=${index === 0 ? 10 : -10}`, duration: 3 + index * 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5 + (index * 0.2) });
      });

      gsap.fromTo(aboutTextRef.current, { x: -50, opacity: 0 }, { scrollTrigger: { trigger: aboutRef.current, start: "top 80%" }, x: 0, opacity: 1, duration: 1, ease: "power4.out" });
      gsap.fromTo(missionCardRef.current, { y: 40, opacity: 0 }, { scrollTrigger: { trigger: missionCardRef.current, start: "top 85%" }, y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 });
      gsap.fromTo(logoRef.current, { x: 50, opacity: 0, scale: 0.9 }, { scrollTrigger: { trigger: aboutRef.current, start: "top 80%" }, x: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.2)", delay: 0.4 });
      gsap.fromTo(cohortRef.current, { y: 40, opacity: 0, scale: 0.95 }, { scrollTrigger: { trigger: cohortRef.current, start: "top 85%" }, y: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" });
      gsap.fromTo(servicesHeaderRef.current, { y: 40, opacity: 0 }, { scrollTrigger: { trigger: servicesHeaderRef.current, start: "top 85%" }, y: 0, opacity: 1, duration: 1, ease: "power4.out" });
      
      serviceCardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card, { y: 60, opacity: 0, scale: 0.95 }, { scrollTrigger: { trigger: card, start: "top 90%" }, y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power4.out", delay: (index % 3) * 0.15 });
      });

      gsap.fromTo(formRef.current, { y: 50, opacity: 0, scale: 0.95 }, { scrollTrigger: { trigger: formRef.current, start: "top 85%" }, y: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" });
    });
    return () => ctx.revert();
  }, []);

  // Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile_no') {
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.bot_field !== '') return; // Honeypot trap

    if (!formData.applicant_name || !formData.email_id || !formData.mobile_no || !formData.location || !formData.startupidea) {
        alert("Please fill all required fields.");
        return;
    }

    setIsSubmitting(true);

    // Get Incubation ID securely from .env variables
    const incubationId = import.meta.env.VITE_INCUBATION_ID || "6a74ea248ade09560b5dc48c";
    
    // Set Node Endpoint dynamically using API_URL from Config
    const nodeEndpoint = API_URL ? `${API_URL}/womencell/apply` : 'http://localhost:5000/api/womencell/apply';

    // 1. Node.js Backend Payload (JSON)
    const nodePayload = {
      incubationId: incubationId, // Passed securely here
      applicantName: formData.applicant_name,
      email: formData.email_id,
      mobile: formData.mobile_no,
      location: formData.location,
      startupIdea: formData.startupidea
    };

    // 2. RiseJhansi Legacy API Payload (FormData)
    const risePayload = new FormData();
    risePayload.append('applicant_name', formData.applicant_name);
    risePayload.append('email_id', formData.email_id);
    risePayload.append('mobile_no', formData.mobile_no);
    risePayload.append('location', formData.location);
    risePayload.append('startupidea', formData.startupidea);

    try {
      const [nodeRes, riseRes] = await Promise.allSettled([
        axios.post(nodeEndpoint, nodePayload),
        axios.post('https://risejhansi.in/Manikarnika/joinProgram', risePayload)
      ]);

      const isNodeSuccess = nodeRes.status === 'fulfilled' && nodeRes.value.status >= 200 && nodeRes.value.status < 300;
      const isRiseSuccess = riseRes.status === 'fulfilled' && riseRes.value.status >= 200 && riseRes.value.status < 300;

      if (isNodeSuccess || isRiseSuccess) {
        alert("Application Submitted Successfully!");
        setFormData({ applicant_name: '', email_id: '', mobile_no: '', location: '', startupidea: '', bot_field: '' });
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Styles
  const inputStyle = "w-full px-[16px] py-[12px] rounded-[10px] border-2 border-[#eee] focus:border-[#ff2020] focus:ring-2 focus:ring-[#ff2020]/10 outline-none transition-all text-[#555] bg-[#f8f9fa] focus:bg-white text-[0.95rem]";
  const labelStyle = "flex items-center text-[0.95rem] font-bold text-[#333] mb-2";

  return (
    <main className="flex-grow font-['Poppins',sans-serif] bg-[#fdfdfd]">
      
      {/* ================= HERO SECTION (Premium Dark Theme: #1a1a1a) ================= */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#1a1a1a] overflow-hidden shadow-inner">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#ff2020]/15 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-[#ff2020]/10 blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div ref={heroTextRef} className="max-w-2xl z-10">
              <div className="hero-content inline-block px-[16px] py-[6px] rounded-full bg-[#ff2020]/10 border border-[#ff2020]/30 text-[#ff2020] font-semibold text-sm mb-6 backdrop-blur-sm shadow-sm">
                Women Entrepreneur Development Cell
              </div>
              <h3 className="hero-content text-xl md:text-2xl text-[#ccc] mb-4 font-medium tracking-wide">
                उद्यमिता से सफलता की ओर
              </h3>
              <h1 className="hero-content text-[2.8rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white leading-[1.15] mb-6 tracking-tight">
                Empowering Women <br />
                <span className="text-[#ff2020]">Entrepreneurs</span> in Jhansi
              </h1>
              <p className="hero-content text-[1.1rem] text-[#aaa] mb-10 leading-relaxed md:max-w-[90%]">
                Transform your ideas into successful ventures with our tailored support, mentorship, and resources designed specifically for women entrepreneurs.
              </p>
              <button onClick={() => document.getElementById('register-form').scrollIntoView({ behavior: 'smooth' })} className="hero-content inline-flex items-center justify-center px-[35px] py-[15px] bg-[#ff2020] text-white rounded-[50px] font-bold text-[1.05rem] shadow-[0_8px_20px_rgba(255,32,32,0.25)] border-2 border-[#ff2020] transition-all duration-300 hover:bg-transparent hover:text-[#ff2020] hover:-translate-y-[3px]">
                Join Women Cell
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[400px] lg:h-[500px] mt-10 lg:mt-0">
              <div ref={(el) => (heroImagesRef.current[0] = el)} className="absolute top-[5%] left-[5%] w-[55%] h-[55%] z-10 hover:z-50">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-[3px] border-[#333] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,32,32,0.15)] hover:border-[#ff2020] cursor-pointer group relative bg-[#1a1a1a]">
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img src={women5} alt="Women Entrepreneurs" className="w-full h-full object-cover" />
                </div>
              </div>
              <div ref={(el) => (heroImagesRef.current[1] = el)} className="absolute top-[20%] right-[5%] w-[60%] h-[60%] z-20 hover:z-50">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-[3px] border-[#333] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,32,32,0.15)] hover:border-[#ff2020] cursor-pointer group relative bg-[#1a1a1a]">
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img src={women6} alt="Women Entrepreneurs" className="w-full h-full object-cover" />
                </div>
              </div>
              <div ref={(el) => (heroImagesRef.current[2] = el)} className="absolute bottom-[5%] left-[15%] w-[50%] h-[45%] z-30 hover:z-50">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-[3px] border-[#333] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,32,32,0.15)] hover:border-[#ff2020] cursor-pointer group relative bg-[#1a1a1a]">
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img src={women7} alt="Women Entrepreneurs" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 12 WEEKS COHORT PROGRAM BANNER (Dark Card: #333) ================= */}
      <div className="bg-[#f8f9fa] pt-16 -mb-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={cohortRef} className="bg-[#333] rounded-[20px] p-[40px] md:p-[50px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#ff2020]/20 relative overflow-hidden opacity-0">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-[#ff2020]/20 rounded-full blur-[40px]"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-[#ff2020]/10 rounded-full blur-[40px]"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left max-w-2xl">
                <div className="inline-flex items-center space-x-2 bg-[#ff2020]/10 text-[#ff2020] px-[12px] py-[4px] rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-[#ff2020]/30 shadow-sm">
                  <Rocket className="w-4 h-4" />
                  <span>Specialized Training</span>
                </div>
                <h2 className="text-[2rem] md:text-[2.5rem] font-extrabold text-white mb-4 leading-tight">
                  12 Weeks Women Cohort Program
                </h2>
                <p className="text-[#ccc] text-[1.1rem] leading-relaxed">
                  Join our specialized program designed to nurture and develop women entrepreneurs through hands-on training, mentorship, and networking opportunities.
                </p>
              </div>
              <button onClick={() => document.getElementById('register-form').scrollIntoView({ behavior: 'smooth' })} className="flex-shrink-0 px-[35px] py-[15px] bg-[#ff2020] text-white border-2 border-[#ff2020] rounded-[50px] font-bold text-[1.1rem] shadow-[0_10px_20px_rgba(255,32,32,0.2)] hover:bg-transparent hover:text-[#ff2020] transition-all duration-300 hover:-translate-y-1 flex items-center">
                Join Now <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ABOUT US & MISSION SECTION ================= */}
      <section ref={aboutRef} className="py-20 lg:py-28 bg-[#f8f9fa] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[2.5rem] md:text-[3rem] font-extrabold text-[#333] tracking-tight mb-4">
              About <span className="text-[#ff2020]">Us</span>
            </h2>
            <div className="w-[80px] h-[5px] bg-[#ff2020] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div ref={aboutTextRef} className="space-y-6 mb-10 opacity-0">
                <p className="text-[1.1rem] text-[#555] leading-relaxed">
                  RISE Jhansi Incubation Center recognizes the pivotal role of incubation centers in fostering inspiration, enthusiasm, and support for women looking to establish their own businesses.
                </p>
                <p className="text-[1.1rem] text-[#555] leading-relaxed">
                  With this vision in mind, RISE Jhansi has a dedicated Women Entrepreneurship Cell aimed at empowering women in Jhansi to excel in entrepreneurship.
                </p>
              </div>

              <div ref={missionCardRef} className="bg-white rounded-[20px] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-[#eee] border-l-[5px] border-l-[#ff2020] relative opacity-0 hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#fff5f5] flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-[#ff2020]" />
                  </div>
                  <h3 className="text-[1.4rem] font-bold text-[#333]">Our Mission</h3>
                </div>
                <p className="text-[#666] leading-relaxed text-[1.05rem]">
                  Our mission is to empower the women of Jhansi to realize their entrepreneurial aspirations. We achieve this by offering comprehensive support, invaluable resources, and tailored training programs.
                </p>
              </div>
            </div>

            <div ref={logoRef} className="opacity-0 flex justify-center lg:justify-end">
              <div className="bg-white p-8 md:p-12 rounded-[30px] shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-[#eee] transform transition-transform duration-500 hover:scale-105">
                <img src={logoManikarnika} alt="Manikarnika Logo" className="w-full max-w-md h-auto object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR SERVICES SECTION ================= */}
      <section className="py-20 lg:py-28 bg-[#fdfdfd] overflow-hidden" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div ref={servicesHeaderRef} className="text-center max-w-3xl mx-auto mb-16 opacity-0">
            <h2 className="text-[2.5rem] md:text-[3rem] font-extrabold text-[#333] tracking-tight mb-4">
              Our <span className="text-[#ff2020]">Services</span>
            </h2>
            <div className="w-[80px] h-[5px] bg-[#ff2020] rounded-full mx-auto mb-6"></div>
            <p className="text-[1.1rem] text-[#555]">
              Tailored services to support women entrepreneurs at every stage of their business journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {servicesData.map((service, index) => (
              <div 
                key={service.id}
                ref={(el) => (serviceCardsRef.current[index] = el)}
                className="bg-white rounded-[20px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-[#eee] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,32,32,0.1)] transition-all duration-500 flex flex-col opacity-0 relative"
              >
                <div className="absolute top-0 left-0 w-full h-[4px] bg-[#ff2020] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20"></div>

                <div className="relative h-[220px] overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                </div>
                
                <div className="p-[30px] flex flex-col flex-grow bg-white z-10 relative">
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

      {/* ================= REGISTER NOW FORM ================= */}
      <section id="register-form" className="py-20 lg:py-28 bg-[#f8f9fa] border-t border-[#eee]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-[2.5rem] md:text-[3rem] font-extrabold text-[#333] tracking-tight mb-4">
              Register <span className="text-[#ff2020]">Now</span>
            </h2>
            <div className="w-[80px] h-[5px] bg-[#ff2020] rounded-full mx-auto"></div>
          </div>

          <div ref={formRef} className="bg-white p-[30px] md:p-[50px] rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#eee] border-t-[5px] border-t-[#ff2020] opacity-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Honeypot */}
              <input type="text" name="bot_field" value={formData.bot_field} onChange={handleChange} className="hidden" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>
                    <User className="w-4 h-4 mr-2 text-[#ff2020]" /> Your Name <span className="text-[#ff2020] ml-1">*</span>
                  </label>
                  <input type="text" name="applicant_name" value={formData.applicant_name} onChange={handleChange} placeholder="Enter your full name" className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>
                    <Mail className="w-4 h-4 mr-2 text-[#ff2020]" /> Email ID <span className="text-[#ff2020] ml-1">*</span>
                  </label>
                  <input type="email" name="email_id" value={formData.email_id} onChange={handleChange} placeholder="Enter your email address" className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>
                    <Phone className="w-4 h-4 mr-2 text-[#ff2020]" /> Mobile No. <span className="text-[#ff2020] ml-1">*</span>
                  </label>
                  <input type="tel" name="mobile_no" value={formData.mobile_no} onChange={handleChange} placeholder="10-digit mobile number" className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>
                    <MapPin className="w-4 h-4 mr-2 text-[#ff2020]" /> Location <span className="text-[#ff2020] ml-1">*</span>
                  </label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Your city/town" className={inputStyle} required />
                </div>
              </div>

              <div>
                <label className={labelStyle}>
                  <Target className="w-4 h-4 mr-2 text-[#ff2020]" /> Describe your startup idea <span className="text-[#ff2020] ml-1">*</span>
                </label>
                <textarea rows="4" name="startupidea" value={formData.startupidea} onChange={handleChange} placeholder="Tell us about your business idea or existing business" className={`${inputStyle} resize-none`} required></textarea>
              </div>

              <div className="pt-6 flex justify-center">
                <button type="submit" disabled={isSubmitting} className="flex items-center justify-center px-[40px] py-[16px] bg-[#ff2020] border-2 border-[#ff2020] hover:bg-transparent text-white hover:text-[#ff2020] rounded-[50px] font-bold text-[1.1rem] shadow-[0_10px_20px_rgba(255,32,32,0.2)] transition-all duration-300 w-full sm:w-auto hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Processing...' : <><Send className="w-5 h-5 mr-2" /> Submit Application</>}
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

    </main>
  );
};

export default WomenCell;