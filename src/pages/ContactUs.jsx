import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Mail, Send, ArrowRight } from 'lucide-react';
import axios from 'axios';
import API_URL from "../components/Config"; // Load API URL from Config

gsap.registerPlugin(ScrollTrigger);

const ContactUs = () => {
  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const formSectionRef = useRef(null);
  const infoSectionRef = useRef(null);
  const infoCardsRef = useRef([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    bot_field: '' // Honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.bot_field !== '') return; // Spam protection

    setIsSubmitting(true);

    // Extract Incubation ID securely from env variables
    const incubationId = import.meta.env.VITE_INCUBATION_ID || "6a74ea248ade09560b5dc48c";
    const nodeEndpoint = API_URL ? `${API_URL}/contact/submit` : 'http://localhost:5000/api/contact/submit';

    try {
      const response = await axios.post(nodeEndpoint, {
        incubationId: incubationId,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (response.status >= 200 && response.status < 300) {
        alert("Your message has been sent successfully!");
        setFormData({ name: '', email: '', subject: '', message: '', bot_field: '' });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error! Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Banner text animation
      gsap.from(bannerTextRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.1
      });

      // Form Section Slide In from Left
      gsap.fromTo(formSectionRef.current, 
        { x: -50, opacity: 0 },
        { 
          scrollTrigger: { trigger: formSectionRef.current, start: "top 85%" },
          x: 0, opacity: 1, duration: 1, ease: "power4.out"
        }
      );

      // Info Section Slide In from Right
      gsap.fromTo(infoSectionRef.current, 
        { x: 50, opacity: 0 },
        { 
          scrollTrigger: { trigger: infoSectionRef.current, start: "top 85%" },
          x: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2
        }
      );

      // Staggered Info Items
      infoCardsRef.current.forEach((card, index) => {
        gsap.fromTo(card,
          { y: 30, opacity: 0 },
          {
            scrollTrigger: { trigger: infoSectionRef.current, start: "top 85%" },
            y: 0, opacity: 1, duration: 0.8, delay: 0.4 + (index * 0.15), ease: "power4.out"
          }
        );
      });

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
        
        <div ref={bannerTextRef} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-block px-[16px] py-[6px] rounded-full bg-[#ff2020]/10 border border-[#ff2020]/30 text-[#ff2020] font-semibold text-sm mb-6 backdrop-blur-sm shadow-sm">
            Let's Connect
          </div>
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
            Contact <span className="text-[#ff2020]">Us</span>
          </h1>
          <p className="text-[#aaa] text-[1.1rem] font-medium max-w-2xl mx-auto leading-relaxed">
            Have questions or want to collaborate? We'd love to hear from you. Drop us a message and our team will get back to you shortly.
          </p>
        </div>
      </div>

      {/* ================= MAIN CONTACT SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-start">
          
          {/* LEFT: GET IN TOUCH FORM */}
          <div ref={formSectionRef} className="bg-white p-[30px] md:p-[50px] rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#eee] border-t-[5px] border-t-[#ff2020] opacity-0">
            <div className="mb-8">
              <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-[#333] mb-2 leading-tight">
                Get in Touch
              </h2>
              <div className="w-[60px] h-[5px] bg-[#ff2020] rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Honeypot field (invisible to humans) */}
              <input type="text" name="bot_field" value={formData.bot_field} onChange={handleChange} className="hidden" />

              {/* Message Field */}
              <div>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5" 
                  placeholder="Enter Message" 
                  className="w-full px-[16px] py-[12px] rounded-[10px] border-2 border-[#eee] focus:border-[#ff2020] focus:ring-2 focus:ring-[#ff2020]/10 outline-none transition-all text-[#555] bg-[#fdfdfd] focus:bg-white resize-none"
                  required
                ></textarea>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name" 
                    className="w-full px-[16px] py-[12px] rounded-[10px] border-2 border-[#eee] focus:border-[#ff2020] focus:ring-2 focus:ring-[#ff2020]/10 outline-none transition-all text-[#555] bg-[#fdfdfd] focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address" 
                    className="w-full px-[16px] py-[12px] rounded-[10px] border-2 border-[#eee] focus:border-[#ff2020] focus:ring-2 focus:ring-[#ff2020]/10 outline-none transition-all text-[#555] bg-[#fdfdfd] focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter Subject" 
                  className="w-full px-[16px] py-[12px] rounded-[10px] border-2 border-[#eee] focus:border-[#ff2020] focus:ring-2 focus:ring-[#ff2020]/10 outline-none transition-all text-[#555] bg-[#fdfdfd] focus:bg-white"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-[40px] py-[16px] bg-[#ff2020] border-2 border-[#ff2020] hover:bg-transparent text-white hover:text-[#ff2020] rounded-[50px] font-bold text-[1.1rem] shadow-[0_10px_20px_rgba(255,32,32,0.2)] transition-all duration-300 w-full sm:w-auto hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : <><Send className="mr-2 w-5 h-5" /> Send Message <ArrowRight className="ml-2 w-5 h-5" /></>}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: PREMIUM CONTACT INFORMATION CARD */}
          <div ref={infoSectionRef} className="relative h-full opacity-0">
            {/* Premium Dark Theme Card */}
            <div className="bg-[#333] h-full p-[30px] md:p-[50px] rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden relative group border border-[#ff2020]/20">
              
              {/* Decorative Background Glowing Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff2020]/20 rounded-full blur-[60px] transform translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-150"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff2020]/10 rounded-full blur-[60px] transform -translate-x-1/2 translate-y-1/2 transition-transform duration-700 group-hover:scale-150"></div>

              <div className="relative z-10">
                <div className="mb-12">
                  <h2 className="text-[1.8rem] md:text-[2.2rem] font-bold text-white mb-2 leading-tight">
                    Contact Information
                  </h2>
                  <div className="w-[60px] h-[5px] bg-[#ff2020] rounded-full"></div>
                </div>

                <div className="space-y-10">
                  
                  {/* Location Info */}
                  <div ref={el => infoCardsRef.current[0] = el} className="flex items-start space-x-5 group/item cursor-default opacity-0">
                    <div className="w-[55px] h-[55px] rounded-full bg-[#fff5f5] flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#ff2020] transition-colors duration-300 shadow-inner">
                      <MapPin className="w-6 h-6 text-[#ff2020] group-hover/item:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-[1.1rem] font-bold text-white mb-1 group-hover/item:text-[#ff2020] transition-colors">Our Location</h3>
                      <p className="text-[#ccc] leading-relaxed text-[0.95rem]">
                        RISE Jhansi Incubation Centre, Jhansi Nagar Nigam premises, Civil Lines, near Elite Chauraha, Jhansi, Uttar Pradesh, 284001
                      </p>
                    </div>
                  </div>

                  {/* Phone Info */}
                  <div ref={el => infoCardsRef.current[1] = el} className="flex items-start space-x-5 group/item cursor-default opacity-0">
                    <div className="w-[55px] h-[55px] rounded-full bg-[#fff5f5] flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#ff2020] transition-colors duration-300 shadow-inner">
                      <Phone className="w-6 h-6 text-[#ff2020] group-hover/item:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-[1.1rem] font-bold text-white mb-1 group-hover/item:text-[#ff2020] transition-colors">Phone Number</h3>
                      <p className="text-[#ccc] text-[0.95rem]">+91 7607011145</p>
                    </div>
                  </div>

                  {/* Email Info */}
                  <div ref={el => infoCardsRef.current[2] = el} className="flex items-start space-x-5 group/item cursor-pointer opacity-0">
                    <div className="w-[55px] h-[55px] rounded-full bg-[#fff5f5] flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#ff2020] transition-colors duration-300 shadow-inner">
                      <Mail className="w-6 h-6 text-[#ff2020] group-hover/item:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-[1.1rem] font-bold text-white mb-1 group-hover/item:text-[#ff2020] transition-colors">Email Address</h3>
                      <a href="mailto:connect@risejhansi.in" className="text-[#ccc] hover:text-white text-[0.95rem] transition-colors">
                        connect@risejhansi.in
                      </a>
                      <p className="text-[#999] text-[0.85rem] mt-1 font-medium">Send us your query anytime!</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ContactUs;