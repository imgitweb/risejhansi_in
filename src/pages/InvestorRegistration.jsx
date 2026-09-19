import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { User, Mail, Phone, MapPin, Send, Building, Globe, FileText, Image as ImageIcon, Briefcase } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';
import API_URL from "../components/Config"; // Load API URL from Config
import locationData from '../data/locationdata.json'; // Load local JSON data

gsap.registerPlugin(ScrollTrigger);

export default function InvestorRegistration() {
  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const formRef = useRef(null);
  const recaptchaRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    investorName: '',
    email: '',
    mobile: '',
    country: '', // Storing string names now
    state: '',   // Storing string names now
    city: '',    // Storing string names now
    companyFund: '',
    investmentLimit: '',
    investorType: '',
    linkedinProfile: '',
    website: '',
    shortDescription: '',
    fullDescription: '',
    firmLogo: null,
    bot_field: '' // Honeypot
  });

  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [errors, setErrors] = useState({});
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableStages = ['Ideation', 'Validation', 'Prototype/MVP', 'Scaling'];
  const availableIndustries = ['EdTech', 'FinTech', 'HealthTech', 'AgriTech', 'E-Commerce', 'SaaS', 'Other'];

  // Derived states for location dropdowns based on JSON
  const countriesList = locationData?.countries || [];
  const indiaStates = locationData?.indiaData ? Object.keys(locationData.indiaData) : [];
  
  // Get cities list if "India" and a valid state is selected
  const availableCities = (formData.country === 'India' && formData.state && locationData?.indiaData[formData.state]) 
      ? locationData.indiaData[formData.state] 
      : [];

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bannerTextRef.current, { y: 40, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1 });
      gsap.from(formRef.current, { y: 50, opacity: 0, duration: 1, ease: "power4.out", delay: 0.3 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, firmLogo: e.target.files[0] });
  };

  const handleCountryChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, country: val, state: '', city: '' });
    if (errors.country) setErrors({ ...errors, country: null });
  };

  const handleStateChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, state: val, city: '' });
    if (errors.state) setErrors({ ...errors, state: null });
  };

  const toggleArrayItem = (item, array, setArray) => {
    setArray(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleRecaptcha = (token) => {
    setCaptchaToken(token);
    if (errors.recaptcha) setErrors({ ...errors, recaptcha: null });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    const requiredFields = ['investorName', 'email', 'mobile', 'country', 'state', 'city', 'investorType'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || String(formData[field]).trim() === '') {
        newErrors[field] = 'Required';
        isValid = false;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
      isValid = false;
    }

    if (!captchaToken) {
      newErrors.recaptcha = 'Verify captcha';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.bot_field !== '') return; // Honeypot block

    if (validateForm()) {
      setIsSubmitting(true);

      // Extract Incubation ID securely from env variables
      const incubationId = import.meta.env.VITE_INCUBATION_ID || "6a74ea248ade09560b5dc48c";
      const nodeEndpoint = API_URL ? `${API_URL}/investors/register` : 'http://localhost:5000/api/investors/register';

      // --- 1. Payload for Node.js API (Mongoose Model) ---
      const nodePayload = new FormData();
      nodePayload.append('incubationId', incubationId); // Goes ONLY to Node.js backend
      if (formData.firmLogo) nodePayload.append('firmLogo', formData.firmLogo);
      nodePayload.append('investorName', formData.investorName);
      nodePayload.append('investorType', formData.investorType.toLowerCase().includes('angel') ? 'angel' : 'vc');
      nodePayload.append('email', formData.email);
      nodePayload.append('contactNumber', formData.mobile);
      nodePayload.append('linkedinProfile', formData.linkedinProfile);
      nodePayload.append('website', formData.website);
      nodePayload.append('locationRaw', `${formData.city}, ${formData.state}, ${formData.country}`);
      nodePayload.append('shortDescription', formData.shortDescription);
      nodePayload.append('fullDescription', formData.fullDescription);
      nodePayload.append('stage', JSON.stringify(selectedStages));
      nodePayload.append('industry', JSON.stringify(selectedIndustries));

      // --- 2. Payload for RiseJhansi API (No Incubation ID here) ---
      const risePayload = new FormData();
      risePayload.append('company_name', formData.companyName || 'Individual');
      risePayload.append('investor_name', formData.investorName);
      risePayload.append('email', formData.email);
      risePayload.append('mobile', formData.mobile);
      risePayload.append('country', formData.country);
      risePayload.append('state', formData.state);
      risePayload.append('city', formData.city);
      risePayload.append('company_fund', formData.companyFund);
      risePayload.append('investment_limit', formData.investmentLimit);
      risePayload.append('investor_type', formData.investorType);
      
      // Dynamic Checkbox mapping for RiseJhansi API
      if (selectedStages.includes('Ideation')) risePayload.append('stage_ideation', 1);
      if (selectedStages.includes('Validation')) risePayload.append('stage_validation', 1);
      
      risePayload.append('code_again', 'BYPASS'); // RiseJhansi Legacy Bypass
      risePayload.append('captcha', captchaToken);

      try {
        const [nodeRes, riseRes] = await Promise.allSettled([
          axios.post(nodeEndpoint, nodePayload),
          axios.post('https://risejhansi.in/InvestorController/saveInvestor', risePayload)
        ]);

        const isNodeSuccess = nodeRes.status === 'fulfilled' && nodeRes.value.status >= 200 && nodeRes.value.status < 300;
        const isRiseSuccess = riseRes.status === 'fulfilled' && riseRes.value.status >= 200 && riseRes.value.status < 300;

        if (isNodeSuccess || isRiseSuccess) {
          alert("Investor Registration Successful!");
          window.location.reload(); 
        } else {
          alert("Failed to register. Please try again.");
        }
      } catch (err) {
        console.error(err);
        alert("Network error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // UI Styles
  const inputStyle = "w-full px-[16px] py-[12px] rounded-[10px] border-2 border-[#eee] focus:border-[#ff2020] focus:ring-2 focus:ring-[#ff2020]/10 outline-none transition-all text-[#555] bg-[#f8f9fa] focus:bg-white text-[0.95rem]";
  const labelStyle = "flex items-center text-[0.95rem] font-bold text-[#333] mb-2";
  const errorStyle = "text-[#ff2020] text-[0.8rem] mt-1.5 font-medium";

  return (
    <main ref={pageRef} className="flex-grow bg-[#fdfdfd] min-h-screen pt-20 pb-24 font-['Poppins',sans-serif]">
      
      {/* ================= TOP BANNER (Premium Dark Theme) ================= */}
      <div className="w-full bg-[#1a1a1a] py-24 relative overflow-hidden shadow-inner">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/15 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/10 blur-[100px]"></div>
        
        <div ref={bannerTextRef} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block px-[16px] py-[6px] rounded-full bg-[#ff2020]/10 border border-[#ff2020]/30 text-[#ff2020] font-semibold text-sm mb-6 backdrop-blur-sm shadow-sm">
            Catalyst For Change
          </div>
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
            Investor <span className="text-[#ff2020]">Registration</span>
          </h1>
          <p className="text-[#aaa] text-[1.1rem] font-medium max-w-2xl mx-auto leading-relaxed">
            Discover high-potential startups and innovative ideas! Invest in the future with RISE Jhansi.
          </p>
        </div>
      </div>

      {/* ================= FORM CONTAINER ================= */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div ref={formRef} className="bg-white p-[30px] md:p-[50px] rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#eee] border-t-[5px] border-t-[#ff2020]">
          <form onSubmit={handleSubmit} noValidate>
            
            {/* Honeypot */}
            <input type="text" name="bot_field" value={formData.bot_field} onChange={handleChange} className="hidden" />

            {/* --- 1. FIRM & CONTACT DETAILS --- */}
            <div className="mb-10">
              <h3 className="text-[1.3rem] font-bold text-[#333] mb-6 flex items-center border-b border-[#eee] pb-3">
                <User className="w-5 h-5 mr-2 text-[#ff2020]" /> Investor Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>Firm / Company Name <span className="text-[#aaa] font-normal ml-1">(Optional)</span></label>
                  <input type="text" name="companyName" className={inputStyle} value={formData.companyName} onChange={handleChange} placeholder="e.g. VC Partners" />
                </div>
                <div>
                  <label className={labelStyle}>Investor Name (Contact Person) <span className="text-[#ff2020] ml-1">*</span></label>
                  <input type="text" name="investorName" className={`${inputStyle} ${errors.investorName ? 'border-[#ff2020]' : ''}`} value={formData.investorName} onChange={handleChange} placeholder="Full Name" />
                  {errors.investorName && <p className={errorStyle}>{errors.investorName}</p>}
                </div>
                <div>
                  <label className={labelStyle}><Mail className="w-4 h-4 mr-1 text-[#ff2020]"/> Email <span className="text-[#ff2020] ml-1">*</span></label>
                  <input type="email" name="email" className={`${inputStyle} ${errors.email ? 'border-[#ff2020]' : ''}`} value={formData.email} onChange={handleChange} placeholder="Email address" />
                  {errors.email && <p className={errorStyle}>{errors.email}</p>}
                </div>
                <div>
                  <label className={labelStyle}><Phone className="w-4 h-4 mr-1 text-[#ff2020]"/> Mobile <span className="text-[#ff2020] ml-1">*</span></label>
                  <input type="tel" name="mobile" className={`${inputStyle} ${errors.mobile ? 'border-[#ff2020]' : ''}`} value={formData.mobile} onChange={handleChange} placeholder="10-digit number" />
                  {errors.mobile && <p className={errorStyle}>{errors.mobile}</p>}
                </div>
                <div>
                  <label className={labelStyle}><Globe className="w-4 h-4 mr-1 text-[#ff2020]" /> Website <span className="text-[#aaa] font-normal ml-1">(Optional)</span></label>
                  <input type="url" name="website" className={inputStyle} value={formData.website} onChange={handleChange} placeholder="https://..." />
                </div>
                <div>
                  <label className={labelStyle}><ImageIcon className="w-4 h-4 mr-1 text-[#ff2020]" /> Firm Logo <span className="text-[#aaa] font-normal ml-1">(Optional)</span></label>
                  <input type="file" accept="image/*" className={`${inputStyle} bg-white`} onChange={handleFileChange} />
                </div>
              </div>
            </div>

            {/* --- 2. INVESTMENT PREFERENCES --- */}
            <div className="mb-10">
              <h3 className="text-[1.3rem] font-bold text-[#333] mb-6 flex items-center border-b border-[#eee] pb-3">
                <Briefcase className="w-5 h-5 mr-2 text-[#ff2020]" /> Investment Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={labelStyle}>Type Of Investor <span className="text-[#ff2020] ml-1">*</span></label>
                  <select name="investorType" className={`${inputStyle} ${errors.investorType ? 'border-[#ff2020]' : ''}`} value={formData.investorType} onChange={handleChange}>
                    <option value="">Select investor type</option>
                    <option value="Angel Investor">Angel Investor</option>
                    <option value="Venture Capitalist (VC)">Venture Capitalist (VC)</option>
                    <option value="Institutional Investor">Institutional Investor</option>
                  </select>
                  {errors.investorType && <p className={errorStyle}>{errors.investorType}</p>}
                </div>
                <div>
                  <label className={labelStyle}>Investment Limit <span className="text-[#aaa] font-normal ml-1">(Optional)</span></label>
                  <select name="investmentLimit" className={inputStyle} value={formData.investmentLimit} onChange={handleChange}>
                    <option value="">Select Limit</option>
                    <option value="Upto 2 Lakh">Upto 2 Lakh</option>
                    <option value="2-5 Lakh">2-5 Lakh</option>
                    <option value="More than 5 Lakh">More than 5 Lakh</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Number of Companies Funded <span className="text-[#aaa] font-normal ml-1">(Optional)</span></label>
                  <select name="companyFund" className={inputStyle} value={formData.companyFund} onChange={handleChange}>
                    <option value="">Select Number</option>
                    <option value="0">0</option>
                    <option value="1-5">1-5</option>
                    <option value="5+">5+</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>LinkedIn URL <span className="text-[#aaa] font-normal ml-1">(Optional)</span></label>
                  <input type="url" name="linkedinProfile" className={inputStyle} value={formData.linkedinProfile} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>

              {/* Checkboxes for Stage and Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[0.95rem] font-bold text-[#333] mb-3">Choice of startup stage for investing <span className="text-[#ff2020]">*</span></label>
                  <div className="flex flex-col gap-3">
                    {availableStages.map((stage, i) => (
                      <label key={i} className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-[#ff2020]" checked={selectedStages.includes(stage)} onChange={() => toggleArrayItem(stage, selectedStages, setSelectedStages)} />
                        <span className="text-[0.9rem] font-medium text-[#555]">{stage}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[0.95rem] font-bold text-[#333] mb-3">Preferred Industries <span className="text-[#ff2020]">*</span></label>
                  <div className="flex flex-col gap-3">
                    {availableIndustries.map((industry, i) => (
                      <label key={i} className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-[#ff2020]" checked={selectedIndustries.includes(industry)} onChange={() => toggleArrayItem(industry, selectedIndustries, setSelectedIndustries)} />
                        <span className="text-[0.9rem] font-medium text-[#555]">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* --- 3. LOCATION --- */}
            <div className="mb-10">
              <h3 className="text-[1.3rem] font-bold text-[#333] mb-6 flex items-center border-b border-[#eee] pb-3">
                <MapPin className="w-5 h-5 mr-2 text-[#ff2020]" /> Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <select name="country" className={`${inputStyle} ${errors.country ? 'border-[#ff2020]' : ''}`} value={formData.country} onChange={handleCountryChange}>
                    <option value="">Select Country</option>
                    {countriesList.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                  </select>
                  {errors.country && <p className={errorStyle}>{errors.country}</p>}
                </div>
                <div>
                  {formData.country === 'India' ? (
                    <select name="state" className={`${inputStyle} ${errors.state ? 'border-[#ff2020]' : ''}`} value={formData.state} onChange={handleStateChange}>
                      <option value="">Select State</option>
                      {indiaStates.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="state" placeholder="Enter State" value={formData.state} onChange={handleChange} className={`${inputStyle} ${errors.state ? 'border-[#ff2020]' : ''}`} disabled={!formData.country} />
                  )}
                  {errors.state && <p className={errorStyle}>{errors.state}</p>}
                </div>
                <div>
                  {formData.country === 'India' && availableCities.length > 0 ? (
                    <select name="city" className={`${inputStyle} ${errors.city ? 'border-[#ff2020]' : ''}`} value={formData.city} onChange={handleChange}>
                      <option value="">Select City</option>
                      {availableCities.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input type="text" name="city" placeholder="Enter City" value={formData.city} onChange={handleChange} className={`${inputStyle} ${errors.city ? 'border-[#ff2020]' : ''}`} disabled={!formData.state} />
                  )}
                  {errors.city && <p className={errorStyle}>{errors.city}</p>}
                </div>
              </div>
            </div>

            {/* --- 4. ABOUT --- */}
            <div className="mb-10">
              <h3 className="text-[1.3rem] font-bold text-[#333] mb-6 flex items-center border-b border-[#eee] pb-3">
                <FileText className="w-5 h-5 mr-2 text-[#ff2020]" /> About the Investor / Firm
              </h3>
              <div className="space-y-6">
                <div>
                  <label className={labelStyle}>Short Description <span className="text-[#aaa] font-normal ml-1">(Optional)</span></label>
                  <textarea name="shortDescription" rows="2" className={`${inputStyle} resize-none`} value={formData.shortDescription} onChange={handleChange} placeholder="Brief one-liner about your investment thesis..."></textarea>
                </div>
                <div>
                  <label className={labelStyle}>Full Description <span className="text-[#aaa] font-normal ml-1">(Optional)</span></label>
                  <textarea name="fullDescription" rows="4" className={`${inputStyle} resize-none`} value={formData.fullDescription} onChange={handleChange} placeholder="Detailed description..."></textarea>
                </div>
              </div>
            </div>

            {/* Google reCAPTCHA */}
            <div className="mb-8 bg-[#f8f9fa] p-6 rounded-[10px] border border-[#eee]">
              <label className={labelStyle}>Security Verification <span className="text-[#ff2020] ml-1">*</span></label>
              <div className="mt-3">
                <ReCAPTCHA ref={recaptchaRef} sitekey="6LfBFPMqAAAAAP1IRHgKSJJWbr9NkcIaSqG7AROC" onChange={handleRecaptcha} />
                {errors.recaptcha && <p className={errorStyle}>{errors.recaptcha}</p>}
              </div>
            </div>

            <div className="text-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-[50px] py-[18px] bg-[#ff2020] hover:bg-[#d81c28] text-white font-bold rounded-[50px] text-[1.1rem] shadow-[0_10px_20px_rgba(255,32,32,0.25)] border-2 border-[#ff2020] transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
              >
                {isSubmitting ? (
                  <><span className="inline-block w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin mr-[10px] align-middle"></span> Processing...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> Register as Investor</>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}