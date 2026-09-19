import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ChevronDown, Send, CheckCircle2, MonitorPlay, Mic, Users, Presentation, 
  CreditCard, Building, FileText, Lock, ShieldCheck, DoorOpen, AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import API_URL from "../components/Config"; // Load API URL from Config

gsap.registerPlugin(ScrollTrigger);

export default function PaidCoworkingSpace() {
  const pageRef = useRef(null);
  const bannerRef = useRef(null);
  const roomsRef = useRef(null);
  const rulesRef = useRef(null);
  const formRef = useRef(null);
  const roomCardsRef = useRef([]);
  const ruleCardsRef = useRef([]);

  // Form State
  const [formData, setFormData] = useState({
    startup_name: '',
    registration_number: '',
    gst_number: '',
    dpiit_recognized: '',
    business_description: '',
    contact_name: '',
    designation: '',
    email: '',
    phone: '',
    address: '',
    seats_required: '',
    preferred_start_date: '',
    team_members: '',
    special_requirements: '',
    rise_alumni: false,
    terms_agreement: false,
    security_deposit: false,
    information_accuracy: false,
    bot_field: '' // Honeypot for spam protection
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Content Data
  const roomRates = [
    { title: "Mini Conference Rooms", price: "₹2,000", time: "maximum of 2 hours", icon: Users, desc: "One-time booking" },
    { title: "VC Room", price: "₹2,000", time: "maximum of 2 hours", icon: MonitorPlay, desc: "Video Conferencing" },
    { title: "Podcast Room", price: "₹1,000", time: "maximum of 1 hour", icon: Mic, desc: "Recording Space" },
    { title: "Training Room", price: "₹5,000", time: "maximum of 4 hours", icon: Presentation, desc: "Breakout Area" }
  ];

  const policies = [
    {
      icon: CreditCard, title: "1. Rent & Payment Terms",
      points: [
        "Cost: ₹1,000 per seat per month.",
        "Due Date: Advance Rent must be paid on or before the 5th of every month.",
        "Late Fee: ₹500 per week for delayed payments.",
        "Security Deposit: Two months' rent required at agreement signing."
      ]
    },
    {
      icon: Building, title: "2. Office Space Allocation",
      points: [
        "Availability: 33 paid seats (2-4 seats per startup).",
        "Duration: Maximum 11 months on a one-time basis.",
        "Allotment Basis: First-come, first-served for RISE alumni. Priority to DPIIT-recognized."
      ]
    },
    {
      icon: FileText, title: "3. Agreement & Documentation",
      points: [
        "Mandatory Agreement: Must sign a formal agreement with RISE Jhansi.",
        "Stamp Paper: Agreement must be executed on a minimum ₹1,000 stamp paper."
      ]
    },
    {
      icon: Lock, title: "4. Lock-in Period & Termination",
      points: [
        "Lock-in Period: 11 months from the date of agreement signing.",
        "Early Exit: Requires 30-day prior notice or one month's rent as exit fee."
      ]
    },
    {
      icon: CheckCircle2, title: "5. Facilities & Services",
      points: [
        "Included: Workspace, furniture, washroom access, drinking water.",
        "Additional Support: Rise sessions and networking opportunities."
      ]
    },
    {
      icon: ShieldCheck, title: "6. Compliance & Security",
      points: [
        "Legal Compliance: Adhere to company registration, GST, and labor laws.",
        "Data Protection: Strict policies enforced; violations result in expulsion."
      ]
    },
    {
      icon: DoorOpen, title: "7. Exit & Handover Process",
      points: [
        "Vacate Premises: At the end day of the lock-in period.",
        "Pending Payments: Must be cleared before vacating."
      ]
    },
    {
      icon: AlertTriangle, title: "8. Additional Rules",
      points: [
        "Visitor Policy: Pre-registration required; responsible for guests.",
        "Liability: RISE is not responsible for loss/theft of property (laptops, etc.)."
      ]
    }
  ];

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.bot_field !== '') return; // Stop bots

    // Basic Validation Check
    if (!formData.terms_agreement || !formData.security_deposit || !formData.information_accuracy) {
      alert("Please accept all declarations before submitting.");
      return;
    }

    setIsSubmitting(true);

    // Extract Incubation ID securely from env variables
    const incubationId = import.meta.env.VITE_INCUBATION_ID || "6a74ea248ade09560b5dc48c";
    const nodeEndpoint = API_URL ? `${API_URL}/coworking/apply` : 'http://localhost:5000/api/coworking/apply';

    // 1. Payload for Node.js Backend (JSON)
    const nodePayload = {
      incubationId: incubationId, // Added Incubation ID
      startup_name: formData.startup_name,
      registration_number: formData.registration_number,
      gst_number: formData.gst_number,
      dpiit_recognized: formData.dpiit_recognized,
      business_description: formData.business_description,
      contact_name: formData.contact_name,
      designation: formData.designation,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      seats_required: formData.seats_required,
      preferred_start_date: formData.preferred_start_date,
      team_members: formData.team_members,
      special_requirements: formData.special_requirements,
      rise_alumni: formData.rise_alumni ? 'yes' : 'no'
    };

    // 2. Payload for RiseJhansi Legacy API (JSON as per requirement, no Incubation ID)
    const risePayload = {
      startup_name: formData.startup_name,
      registration_number: formData.registration_number,
      gst_number: formData.gst_number,
      dpiit_recognized: formData.dpiit_recognized,
      business_description: formData.business_description,
      contact_name: formData.contact_name,
      designation: formData.designation,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      seats_required: formData.seats_required,
      preferred_start_date: formData.preferred_start_date,
      team_members: formData.team_members,
      rise_alumni: formData.rise_alumni ? 'yes' : 'no',
      terms_agreement: formData.terms_agreement ? 'yes' : 'no',
      security_deposit: formData.security_deposit ? 'yes' : 'no',
      information_accuracy: formData.information_accuracy ? 'yes' : 'no'
    };

    try {
      const [nodeRes, riseRes] = await Promise.allSettled([
        axios.post(nodeEndpoint, nodePayload, {
          headers: { 'Content-Type': 'application/json' }
        }),
        axios.post('https://risejhansi.in/coworking/submit_application', risePayload, {
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      const isNodeSuccess = nodeRes.status === 'fulfilled' && nodeRes.value.status >= 200 && nodeRes.value.status < 300;
      const isRiseSuccess = riseRes.status === 'fulfilled' && riseRes.value.status >= 200 && riseRes.value.status < 300;

      if (isNodeSuccess || isRiseSuccess) {
        alert("Application Submitted Successfully!");
        window.location.reload(); 
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bannerRef.current, { y: 40, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1 });

      roomCardsRef.current.forEach((card, i) => {
        gsap.fromTo(card, { y: 50, opacity: 0 }, { scrollTrigger: { trigger: card, start: "top 90%" }, y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: "power4.out" });
      });

      ruleCardsRef.current.forEach((card, i) => {
        gsap.fromTo(card, { y: 50, opacity: 0 }, { scrollTrigger: { trigger: card, start: "top 90%" }, y: 0, opacity: 1, duration: 0.8, delay: (i % 3) * 0.15, ease: "power4.out" });
      });

      gsap.fromTo(formRef.current, { y: 60, opacity: 0 }, { scrollTrigger: { trigger: formRef.current, start: "top 85%" }, y: 0, opacity: 1, duration: 1, ease: "power4.out" });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // UI Styles
  const inputStyle = "w-full px-[16px] py-[12px] rounded-[10px] border-2 border-[#eee] focus:border-[#ff2020] focus:ring-2 focus:ring-[#ff2020]/10 outline-none transition-all text-[#555] bg-[#f8f9fa] focus:bg-white text-[0.95rem]";
  const labelStyle = "block text-[0.95rem] font-bold text-[#333] mb-2";

  return (
    <main ref={pageRef} className="flex-grow bg-[#fdfdfd] min-h-screen pt-20 pb-24 font-['Poppins',sans-serif]">
      
      {/* ================= TOP BANNER (Premium Dark Theme) ================= */}
      <div className="w-full bg-[#1a1a1a] py-24 relative overflow-hidden shadow-inner">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/15 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/10 blur-[100px]"></div>
        
        <div ref={bannerRef} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block px-[16px] py-[6px] rounded-full bg-[#ff2020]/10 border border-[#ff2020]/30 text-[#ff2020] font-semibold text-sm mb-6 backdrop-blur-sm shadow-sm">
            Premium Infrastructure
          </div>
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
            Paid <span className="text-[#ff2020]">Co-Working</span> Space
          </h1>
          <p className="text-[#aaa] text-[1.1rem] font-medium max-w-2xl mx-auto leading-relaxed">
            A collaborative and technology-equipped environment designed for budding entrepreneurs and innovative startups.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-24">
        
        {/* ================= ROOM RENTAL MODEL ================= */}
        <section ref={roomsRef}>
          <div className="text-center mb-12">
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-[#333] mb-4">Room Rental Model</h2>
            <div className="w-[80px] h-[5px] bg-[#ff2020] rounded-full mx-auto mb-6"></div>
            <p className="text-[#555] max-w-2xl mx-auto text-[1.05rem]">The following rental structure is applicable for the utilization of various premium rooms at RISE Incubation Center.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
            {roomRates.map((room, index) => {
              const Icon = room.icon;
              return (
                <div key={index} ref={el => roomCardsRef.current[index] = el} className="bg-white rounded-[20px] p-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-[#eee] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,32,32,0.1)] transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-[#ff2020] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20"></div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#fff5f5] rounded-bl-full -z-0 group-hover:bg-[#ff2020]/10 transition-colors"></div>
                  
                  <Icon className="w-12 h-12 text-[#ff2020] mb-5 relative z-10" />
                  <h3 className="text-[1.2rem] font-bold text-[#333] mb-2 relative z-10 leading-snug">{room.title}</h3>
                  <p className="text-[0.9rem] text-[#666] mb-6 relative z-10 font-medium">{room.desc}</p>
                  <div className="pt-5 border-t border-[#eee] relative z-10">
                    <span className="text-[1.8rem] font-extrabold text-[#333] group-hover:text-[#ff2020] transition-colors">{room.price}</span>
                    <span className="block text-[0.75rem] font-bold text-[#aaa] uppercase tracking-wider mt-1">{room.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= CO-WORKING POLICIES ================= */}
        <section ref={rulesRef}>
          <div className="text-center mb-12">
            <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-[#333] mb-4">Terms & Conditions</h2>
            <div className="w-[80px] h-[5px] bg-[#ff2020] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {policies.map((policy, index) => {
              const Icon = policy.icon;
              return (
                <div key={index} ref={el => ruleCardsRef.current[index] = el} className="bg-white p-[30px] rounded-[20px] shadow-[0_5px_15px_rgba(0,0,0,0.03)] border border-[#eee] hover:border-[#ff2020]/50 transition-colors duration-300">
                  <div className="flex items-center mb-5">
                    <div className="w-[45px] h-[45px] rounded-full bg-[#fff5f5] flex items-center justify-center mr-4 shadow-inner">
                      <Icon className="w-5 h-5 text-[#ff2020]" />
                    </div>
                    <h3 className="text-[1.15rem] font-bold text-[#333]">{policy.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {policy.points.map((point, i) => (
                      <li key={i} className="text-[0.9rem] text-[#666] flex items-start font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff2020] mt-2 mr-3 flex-shrink-0"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= APPLICATION FORM ================= */}
        <section ref={formRef} className="max-w-4xl mx-auto">
          <div className="bg-white p-[30px] md:p-[50px] rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#eee] border-t-[5px] border-t-[#ff2020]">
            <div className="text-center mb-10">
              <h2 className="text-[2rem] md:text-[2.5rem] font-bold text-[#333]">Apply for Co-Working</h2>
              <p className="text-[0.95rem] text-[#888] mt-2 font-medium">* Required fields. Reviewed within 5-7 business days.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Honeypot */}
              <input type="text" name="bot_field" value={formData.bot_field} onChange={handleChange} className="hidden" />

              {/* 1. Startup Information */}
              <div className="space-y-6">
                <h3 className="text-[1.3rem] font-bold text-[#333] border-b border-[#eee] pb-3">1. Startup Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Startup Name *</label>
                    <input type="text" name="startup_name" value={formData.startup_name} onChange={handleChange} className={inputStyle} required />
                  </div>
                  <div>
                    <label className={labelStyle}>Registration Number</label>
                    <input type="text" name="registration_number" value={formData.registration_number} onChange={handleChange} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>GST Number</label>
                    <input type="text" name="gst_number" value={formData.gst_number} onChange={handleChange} className={inputStyle} />
                  </div>
                  <div>
                    <label className={labelStyle}>DPIIT Recognition Status *</label>
                    <select name="dpiit_recognized" value={formData.dpiit_recognized} onChange={handleChange} className={inputStyle} required>
                      <option value="">Select Status</option>
                      <option value="recognized">DPIIT Recognized</option>
                      <option value="applied">Applied for DPIIT</option>
                      <option value="not_applied">Not Applied</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Brief Description of Business *</label>
                    <textarea rows="3" name="business_description" value={formData.business_description} onChange={handleChange} className={`${inputStyle} resize-none`} required></textarea>
                  </div>
                </div>
              </div>

              {/* 2. Contact Details */}
              <div className="space-y-6">
                <h3 className="text-[1.3rem] font-bold text-[#333] border-b border-[#eee] pb-3">2. Contact Person Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Full Name *</label>
                    <input type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} className={inputStyle} required />
                  </div>
                  <div>
                    <label className={labelStyle}>Designation *</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleChange} className={inputStyle} required />
                  </div>
                  <div>
                    <label className={labelStyle}>Email Address *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} required />
                  </div>
                  <div>
                    <label className={labelStyle}>Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputStyle} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Complete Address *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputStyle} required />
                  </div>
                </div>
              </div>

              {/* 3. Space Requirements */}
              <div className="space-y-6">
                <h3 className="text-[1.3rem] font-bold text-[#333] border-b border-[#eee] pb-3">3. Space Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Number of Seats Required *</label>
                    <select name="seats_required" value={formData.seats_required} onChange={handleChange} className={inputStyle} required>
                      <option value="">Select Number of Seats</option>
                      <option value="2">2 Seats</option>
                      <option value="3">3 Seats</option>
                      <option value="4">4 Seats</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelStyle}>Preferred Start Date *</label>
                    <input type="date" name="preferred_start_date" value={formData.preferred_start_date} onChange={handleChange} className={inputStyle} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Team Members Information (Optional)</label>
                    <textarea rows="2" name="team_members" value={formData.team_members} onChange={handleChange} placeholder="Names and designations of team members" className={`${inputStyle} resize-none`}></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelStyle}>Any Special Requirements or Comments</label>
                    <textarea rows="2" name="special_requirements" value={formData.special_requirements} onChange={handleChange} className={`${inputStyle} resize-none`}></textarea>
                  </div>
                </div>
              </div>

              {/* 4. Declarations */}
              <div className="space-y-6">
                <h3 className="text-[1.3rem] font-bold text-[#333] border-b border-[#eee] pb-3">4. Declarations</h3>
                
                <label className="flex items-center space-x-3 cursor-pointer bg-[#fff5f5] p-4 rounded-[10px] border border-[#ff2020]/20">
                  <input type="checkbox" name="rise_alumni" checked={formData.rise_alumni} onChange={handleChange} className="w-5 h-5 rounded border-[#eee] text-[#ff2020] accent-[#ff2020]" />
                  <span className="text-[0.95rem] font-bold text-[#ff2020]">We are RISE Alumni / Virtual Startup</span>
                </label>

                <div className="space-y-4 pt-2">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input type="checkbox" name="terms_agreement" checked={formData.terms_agreement} onChange={handleChange} className="w-5 h-5 rounded border-[#eee] text-[#ff2020] accent-[#ff2020] mt-0.5 shrink-0" required />
                    <span className="text-[0.95rem] text-[#555] font-medium group-hover:text-[#333]">I have read and agree to all the terms and conditions mentioned above including the rent policy, lock-in period, and other rules *</span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input type="checkbox" name="security_deposit" checked={formData.security_deposit} onChange={handleChange} className="w-5 h-5 rounded border-[#eee] text-[#ff2020] accent-[#ff2020] mt-0.5 shrink-0" required />
                    <span className="text-[0.95rem] text-[#555] font-medium group-hover:text-[#333]">I understand and agree to pay the security deposit of two months' rent at the time of agreement signing *</span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input type="checkbox" name="information_accuracy" checked={formData.information_accuracy} onChange={handleChange} className="w-5 h-5 rounded border-[#eee] text-[#ff2020] accent-[#ff2020] mt-0.5 shrink-0" required />
                    <span className="text-[0.95rem] text-[#555] font-medium group-hover:text-[#333]">I declare that all information provided in this application is true and accurate *</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-8 flex flex-col items-center">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#ff2020] hover:bg-transparent text-white hover:text-[#ff2020] font-bold py-[18px] px-[50px] border-2 border-[#ff2020] rounded-[50px] transition-all duration-300 shadow-[0_10px_20px_rgba(255,32,32,0.25)] hover:-translate-y-1 text-[1.1rem] flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : <><Send className="w-5 h-5 mr-2" /> SUBMIT APPLICATION</>}
                </button>
              </div>

            </form>
          </div>
        </section>

      </div>
    </main>
  );
}