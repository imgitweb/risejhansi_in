import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, ArrowRight, User, Mail, Phone, MapPin, Send, Rocket, Sparkles, Award } from 'lucide-react';
import axios from 'axios';
import API_URL from "../components/Config";

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
  // Refs for animations
  const pageRef = useRef(null);
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

  // GSAP Animations with fromTo (React 18 safe)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.fromTo(".hero-content", 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.1 }
      );
      
      // Hero Images Float & Entrance
      gsap.fromTo(heroImagesRef.current, 
        { scale: 0.8, x: 60, y: 40, rotation: (i) => (i % 2 === 0 ? 5 : -5), opacity: 0 }, 
        { scale: 1, x: 0, y: 0, rotation: (i) => (i % 2 === 0 ? 3 : -3), opacity: 1, duration: 1.5, stagger: 0.2, ease: "back.out(1.2)", delay: 0.4 }
      );
      
      // Continuous floating effect
      heroImagesRef.current.forEach((img, index) => {
        gsap.to(img, { 
          y: `+=${index === 1 ? -20 : 20}`, 
          x: `+=${index === 0 ? 10 : -10}`, 
          rotation: `+=${index === 1 ? 2 : -2}`,
          duration: 4 + index, 
          repeat: -1, 
          yoyo: true, 
          ease: "sine.inOut", 
          delay: 1.5 + (index * 0.2) 
        });
      });

      // Scroll Animations
      gsap.fromTo(aboutTextRef.current, 
        { x: -50, opacity: 0 }, 
        { scrollTrigger: { trigger: aboutRef.current, start: "top 80%" }, x: 0, opacity: 1, duration: 1, ease: "power4.out" }
      );
      
      gsap.fromTo(missionCardRef.current, 
        { y: 50, opacity: 0 }, 
        { scrollTrigger: { trigger: missionCardRef.current, start: "top 85%" }, y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 }
      );
      
      gsap.fromTo(logoRef.current, 
        { x: 50, opacity: 0, scale: 0.9 }, 
        { scrollTrigger: { trigger: aboutRef.current, start: "top 80%" }, x: 0, opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.2)", delay: 0.4 }
      );
      
      gsap.fromTo(cohortRef.current, 
        { y: 60, opacity: 0, scale: 0.95 }, 
        { scrollTrigger: { trigger: cohortRef.current, start: "top 85%" }, y: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" }
      );
      
      gsap.fromTo(servicesHeaderRef.current, 
        { y: 40, opacity: 0 }, 
        { scrollTrigger: { trigger: servicesHeaderRef.current, start: "top 85%" }, y: 0, opacity: 1, duration: 1, ease: "power4.out" }
      );
      
      serviceCardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card, 
          { y: 80, opacity: 0 }, 
          { scrollTrigger: { trigger: card, start: "top 90%" }, y: 0, opacity: 1, duration: 0.8, ease: "power4.out", delay: (index % 3) * 0.15 }
        );
      });

      gsap.fromTo(formRef.current, 
        { y: 50, opacity: 0, scale: 0.98 }, 
        { scrollTrigger: { trigger: formRef.current, start: "top 85%" }, y: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" }
      );
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
    if (formData.bot_field !== '') return; 

    if (!formData.applicant_name || !formData.email_id || !formData.mobile_no || !formData.location || !formData.startupidea) {
        alert("Please fill all required fields to proceed.");
        return;
    }

    setIsSubmitting(true);

    const incubationId = import.meta.env.VITE_INCUBATION_ID || "6a74ea248ade09560b5dc48c";
    const nodeEndpoint = API_URL ? `${API_URL}/womencell/apply` : 'http://localhost:5000/api/womencell/apply';

    const nodePayload = {
      incubationId: incubationId,
      applicantName: formData.applicant_name,
      email: formData.email_id,
      mobile: formData.mobile_no,
      location: formData.location,
      startupIdea: formData.startupidea
    };

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
        alert("Application Submitted Successfully! Welcome to the mission.");
        setFormData({ applicant_name: '', email_id: '', mobile_no: '', location: '', startupidea: '', bot_field: '' });
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modern Premium Input Style
  const inputStyle = "w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#ff2020] focus:ring-4 focus:ring-[#ff2020]/10 outline-none transition-all duration-300 text-gray-700 font-medium placeholder-gray-400";
  const labelStyle = "flex items-center text-[0.95rem] font-bold text-gray-800 mb-3 tracking-wide";

  return (
    <main ref={pageRef} className="flex-grow font-['Poppins',sans-serif] bg-slate-50 overflow-hidden">
      
      {/* ================= HERO SECTION (Premium Dark Cinematic) ================= */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36 bg-[#0B0B0F] overflow-hidden">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[#ff2020]/20 blur-[150px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[70%] rounded-full bg-rose-600/10 blur-[150px] mix-blend-screen pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div ref={heroTextRef} className="max-w-2xl z-20">
              <div className="hero-content inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[#ff2020] font-bold text-sm mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(255,32,32,0.1)]">
                <Sparkles className="w-4 h-4" /> Women Entrepreneur Development Cell
              </div>
              <h3 className="hero-content text-xl md:text-2xl text-gray-400 mb-4 font-semibold tracking-wide flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#ff2020]"></span> उद्यमिता से सफलता की ओर
              </h3>
              <h1 className="hero-content text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                Empowering Women <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-rose-400">Entrepreneurs</span> in Jhansi
              </h1>
              <p className="hero-content text-lg text-gray-400 mb-12 leading-relaxed max-w-[90%] font-light">
                Transform your ideas into successful ventures with our tailored support, mentorship, and resources designed specifically for visionary women.
              </p>
              <button 
                onClick={() => document.getElementById('register-form').scrollIntoView({ behavior: 'smooth' })} 
                className="hero-content group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-full font-black text-lg shadow-[0_10px_30px_rgba(255,255,255,0.15)] transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(255,32,32,0.3)] overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#ff2020] to-rose-500 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></div>
                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                  Join Women Cell <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>

            {/* 3D Floating Images Grid */}
            <div className="relative w-full h-[450px] lg:h-[600px] mt-12 lg:mt-0 perspective-1000">
              <div ref={(el) => (heroImagesRef.current[0] = el)} className="absolute top-[5%] left-[5%] w-[55%] h-[55%] z-10">
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#ff2020]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img src={women5} alt="Women Entrepreneurs" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>
              <div ref={(el) => (heroImagesRef.current[1] = el)} className="absolute top-[25%] right-0 w-[55%] h-[55%] z-20">
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img src={women6} alt="Women Entrepreneurs" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>
              <div ref={(el) => (heroImagesRef.current[2] = el)} className="absolute bottom-0 left-[15%] w-[60%] h-[45%] z-30">
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#ff2020]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                  <img src={women7} alt="Women Entrepreneurs" className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 12 WEEKS COHORT PROGRAM BANNER ================= */}
      <div className="bg-slate-50 pt-16 -mb-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={cohortRef} className="bg-gradient-to-br from-[#ff2020] via-red-600 to-rose-600 rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(255,32,32,0.2)] relative overflow-hidden opacity-0">
            {/* Overlay Patterns */}
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-[50px]"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="text-center lg:text-left max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-black/20 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-sm border border-white/10">
                  <Rocket className="w-4 h-4 text-rose-200" /> Exclusive Training
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                  12 Weeks Women Cohort Program
                </h2>
                <p className="text-red-50 text-lg md:text-xl leading-relaxed font-light">
                  Join our specialized program designed to nurture and develop women entrepreneurs through intensive hands-on training, elite mentorship, and deep networking.
                </p>
              </div>
              <button 
                onClick={() => document.getElementById('register-form').scrollIntoView({ behavior: 'smooth' })} 
                className="flex-shrink-0 px-10 py-5 bg-white text-[#ff2020] rounded-full font-black text-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-all duration-300 flex items-center gap-3 group"
              >
                Join the Cohort <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ABOUT US & MISSION SECTION ================= */}
      <section ref={aboutRef} className="py-32 bg-slate-50 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#ff2020] font-black tracking-widest uppercase text-sm mb-3 block">Discover</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
              About <span className="text-[#ff2020]">Us</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div ref={aboutTextRef} className="space-y-6 mb-12 opacity-0">
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  RISE Jhansi Incubation Center recognizes the pivotal role of incubation centers in fostering inspiration, enthusiasm, and support for women looking to establish their own businesses.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  With this vision in mind, RISE Jhansi has a dedicated Women Entrepreneurship Cell aimed at empowering women in Jhansi to excel in entrepreneurship, breaking barriers and creating leaders.
                </p>
              </div>

              <div ref={missionCardRef} className="bg-white rounded-[2rem] p-10 shadow-[0_15px_50px_rgba(0,0,0,0.05)] border border-gray-100 border-l-[8px] border-l-[#ff2020] relative opacity-0 hover:-translate-y-2 transition-transform duration-500 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform duration-500 ease-out"></div>
                
                <div className="flex items-center mb-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mr-5 shadow-sm group-hover:bg-[#ff2020] transition-colors duration-500">
                    <Target className="w-8 h-8 text-[#ff2020] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg relative z-10">
                  Our mission is to empower the women of Jhansi to realize their entrepreneurial aspirations. We achieve this by offering comprehensive support, invaluable resources, and tailored high-impact training programs.
                </p>
              </div>
            </div>

            <div ref={logoRef} className="opacity-0 flex justify-center lg:justify-end">
              <div className="bg-white p-12 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-50 transform transition-all duration-700 hover:scale-105 hover:shadow-[0_30px_60px_rgba(255,32,32,0.1)] relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-50 to-transparent rounded-[3rem] opacity-50"></div>
                <img src={logoManikarnika} alt="Manikarnika Logo" className="w-full max-w-md h-auto object-contain relative z-10 mix-blend-multiply" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR SERVICES SECTION ================= */}
      <section className="py-32 bg-white relative" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div ref={servicesHeaderRef} className="text-center max-w-3xl mx-auto mb-20 opacity-0">
            <span className="text-[#ff2020] font-black tracking-widest uppercase text-sm mb-3 block">Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
              Our <span className="text-[#ff2020]">Services</span>
            </h2>
            <p className="text-xl text-gray-500">
              Tailored high-end services to support women entrepreneurs at every critical stage of their business journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, index) => (
              <div 
                key={service.id}
                ref={(el) => (serviceCardsRef.current[index] = el)}
                className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100 group hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(255,32,32,0.15)] transition-all duration-500 flex flex-col opacity-0"
              >
                <div className="relative h-[250px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10 opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center z-20 text-white font-bold border border-white/30">
                    0{service.id}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow bg-white z-20 relative -mt-6 rounded-t-[2rem] border-t border-gray-50">
                  <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-[#ff2020] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-base leading-relaxed flex-grow">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REGISTER NOW FORM ================= */}
      <section id="register-form" className="py-32 bg-gray-50 relative border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-[#ff2020] font-black tracking-widest uppercase text-sm mb-3 block">Take Action</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
              Register <span className="text-[#ff2020]">Now</span>
            </h2>
            <p className="text-lg text-gray-500">Join the movement and start building your legacy today.</p>
          </div>

          <div ref={formRef} className="bg-white p-8 md:p-14 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 opacity-0 relative overflow-hidden">
            
            {/* Decorative element inside form */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-[80px] -z-0 pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              
              <input type="text" name="bot_field" value={formData.bot_field} onChange={handleChange} className="hidden" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelStyle}>
                    <User className="w-5 h-5 mr-2 text-[#ff2020]" /> Full Name <span className="text-[#ff2020] ml-1">*</span>
                  </label>
                  <input type="text" name="applicant_name" value={formData.applicant_name} onChange={handleChange} placeholder="Enter your full name" className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>
                    <Mail className="w-5 h-5 mr-2 text-[#ff2020]" /> Email Address <span className="text-[#ff2020] ml-1">*</span>
                  </label>
                  <input type="email" name="email_id" value={formData.email_id} onChange={handleChange} placeholder="name@example.com" className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>
                    <Phone className="w-5 h-5 mr-2 text-[#ff2020]" /> Mobile No. <span className="text-[#ff2020] ml-1">*</span>
                  </label>
                  <input type="tel" name="mobile_no" value={formData.mobile_no} onChange={handleChange} placeholder="10-digit mobile number" className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>
                    <MapPin className="w-5 h-5 mr-2 text-[#ff2020]" /> Location <span className="text-[#ff2020] ml-1">*</span>
                  </label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, State" className={inputStyle} required />
                </div>
              </div>

              <div>
                <label className={labelStyle}>
                  <Target className="w-5 h-5 mr-2 text-[#ff2020]" /> Describe your startup idea <span className="text-[#ff2020] ml-1">*</span>
                </label>
                <textarea rows="5" name="startupidea" value={formData.startupidea} onChange={handleChange} placeholder="Tell us about the problem you are solving..." className={`${inputStyle} resize-none`} required></textarea>
              </div>

              <div className="pt-8 flex justify-center">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="group relative inline-flex items-center justify-center px-12 py-5 bg-[#ff2020] text-white rounded-full font-black text-lg uppercase tracking-widest shadow-[0_15px_30px_rgba(255,32,32,0.3)] transition-all duration-300 w-full sm:w-auto hover:shadow-[0_20px_40px_rgba(255,32,32,0.4)] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  {isSubmitting ? (
                    <span className="relative z-10 flex items-center"><span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></span> Processing...</span>
                  ) : (
                    <span className="relative z-10 flex items-center gap-3"><Send className="w-5 h-5" /> Submit Application</span>
                  )}
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