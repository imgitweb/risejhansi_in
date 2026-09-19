import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { User, Mail, Phone, Lock, Building, MapPin, Target, Send, Globe } from 'lucide-react';

// Apna JSON data import karein (Path apne folder structure ke hisaab se adjust kar lena)
import locationData from '../data/locationdata.json'; 

export default function StartupRegistration() {
    const [formData, setFormData] = useState({
        // Founder Details
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        contactNumber: '',
        
        // Startup Details
        startupName: '',
        website: '',
        dpiitNo: '',
        
        // Location (Ab direct string names use honge JSON se)
        country: '',
        state: '',
        city: '',
        
        // Business Profile
        industry: '',
        stage: '',
        revenueStarted: 'false',
        
        // Pitches
        elevatorPitch: '', 
        problemStatement: '',
        
        // Honeypot
        bot_field: '' 
    });

    const [errors, setErrors] = useState({});
    const [captchaToken, setCaptchaToken] = useState(null);
    const [submissionTime] = useState(Date.now() / 1000);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const recaptchaRef = useRef(null);

    // Derived states for dropdowns based on JSON
    const countriesList = locationData?.countries || [];
    const indiaStates = locationData?.indiaData ? Object.keys(locationData.indiaData) : [];
    
    // Get cities list if "India" and a valid state is selected
    const availableCities = (formData.country === 'India' && formData.state && locationData?.indiaData[formData.state]) 
        ? locationData.indiaData[formData.state] 
        : [];

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'contactNumber') {
            const onlyNums = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: onlyNums });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    // Handle Country Change
    const handleCountryChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, country: val, state: '', city: '' });
        if (errors.country) setErrors({ ...errors, country: null });
    };

    // Handle State Change
    const handleStateChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, state: val, city: '' });
        if (errors.state) setErrors({ ...errors, state: null });
    };

    const handleRecaptcha = (token) => {
        setCaptchaToken(token);
        if (errors.recaptcha) setErrors({ ...errors, recaptcha: null });
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        const requiredFields = [
            'firstName', 'lastName', 'email', 'password', 'contactNumber', 
            'startupName', 'country', 'state', 'city', 
            'stage', 'industry', 'elevatorPitch', 'problemStatement'
        ];
        
        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === '') {
                newErrors[field] = 'Required field';
                isValid = false;
            }
        });

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (formData.email && !emailPattern.test(formData.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        if (formData.contactNumber && (formData.contactNumber.length < 10 || formData.contactNumber.length > 15)) {
            newErrors.contactNumber = 'Invalid mobile number';
            isValid = false;
        }

        if (!captchaToken) {
            newErrors.recaptcha = 'Please verify that you are not a robot';
            isValid = false;
        }

        if (Date.now() / 1000 - submissionTime < 3) {
            isValid = false; // Bot detection
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Bot check
        if (formData.bot_field !== '') return;

        if (validateForm()) {
            setIsSubmitting(true);
            
            // Get Incubation ID from .env
            const incubationId = import.meta.env.VITE_INCUBATION_ID || "6a74ea248ade09560b5dc48c";
            
            // ================= 1. PAYLOAD FOR API 1 (JSON) =================
            const payloadAPI1 = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                startupName: formData.startupName,
                selectedPlan: "sigma", // Default
                country: formData.country,
                state: formData.state,
                industry: formData.industry,
                startupStage: formData.stage,
                website: formData.website,
                contactNumber: formData.contactNumber,
                elevatorPitch: formData.elevatorPitch,
                problemStatement: formData.problemStatement,
                revenueStarted: formData.revenueStarted === 'true',
                incubationId: incubationId, // Secured from env
                currency: "INR",
                language: "English"
            };

            // ================= 2. PAYLOAD FOR API 2 (FormData) =================
            const payloadAPI2 = new FormData();
            payloadAPI2.append('startup_name', formData.startupName);
            payloadAPI2.append('startup_email', formData.email);
            payloadAPI2.append('startup_mobile', formData.contactNumber);
            // Passing Names directly since we don't have IDs in JSON
            payloadAPI2.append('country', formData.country);
            payloadAPI2.append('state', formData.state);
            payloadAPI2.append('city', formData.city);
            payloadAPI2.append('stage', formData.stage);
            payloadAPI2.append('sector', formData.industry);
            payloadAPI2.append('service', formData.elevatorPitch);
            payloadAPI2.append('dpiit_no', formData.dpiitNo);
            payloadAPI2.append('g-recaptcha-response', captchaToken);
            payloadAPI2.append('submission_time', submissionTime);

            try {
                // Submit to BOTH APIs concurrently
                const [response1, response2] = await Promise.allSettled([
                    fetch('https://incubationmasters.com/api/startups', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payloadAPI1)
                    }),
                    fetch('https://risejhansi.in/StartupController/saveStartup', {
                        method: 'POST',
                        body: payloadAPI2
                    })
                ]);

                if ((response1.status === 'fulfilled' && response1.value.ok) || 
                    (response2.status === 'fulfilled' && response2.value.ok)) {
                    
                    alert("Registration Successful!");
                    
                    // Reset Form
                    setFormData({
                        firstName: '', lastName: '', email: '', password: '', contactNumber: '',
                        startupName: '', website: '', dpiitNo: '',
                        country: '', state: '', city: '',
                        industry: '', stage: '', revenueStarted: 'false', elevatorPitch: '', problemStatement: '', bot_field: ''
                    });
                    if(recaptchaRef.current) recaptchaRef.current.reset();
                    setCaptchaToken(null);
                } else {
                    alert("Failed to register on servers. Please try again.");
                }
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("Network error. Could not submit form.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // UI HELPER CLASSES (Premium Theme)
    const inputStyle = "w-full px-[16px] py-[12px] rounded-[10px] border-2 border-[#eee] focus:border-[#ff2020] focus:ring-2 focus:ring-[#ff2020]/10 outline-none transition-all text-[#555] bg-[#f8f9fa] focus:bg-white text-[0.95rem]";
    const labelStyle = "flex items-center text-[0.95rem] font-bold text-[#333] mb-2";
    const errorStyle = "text-[#ff2020] text-[0.8rem] mt-1.5 font-medium";

    return (
        <main className="min-h-screen bg-[#fdfdfd] font-['Poppins',sans-serif] pt-20 pb-24">
            
            {/* ================= TOP BANNER (Premium Dark Theme) ================= */}
            <div className="w-full bg-[#1a1a1a] py-24 relative overflow-hidden shadow-inner">
                <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/15 blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/10 blur-[100px]"></div>
                
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-block px-[16px] py-[6px] rounded-full bg-[#ff2020]/10 border border-[#ff2020]/30 text-[#ff2020] font-semibold text-sm mb-6 backdrop-blur-sm shadow-sm">
                        Join RISE Ecosystem
                    </div>
                    <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
                        Startup <span className="text-[#ff2020]">Registration</span>
                    </h1>
                    <p className="text-[#aaa] text-[1.1rem] font-medium max-w-2xl mx-auto leading-relaxed">
                        Turn your vision into reality! Get access to mentorship, funding, and a thriving startup ecosystem.
                    </p>
                </div>
            </div>

            {/* ================= FORM CONTAINER ================= */}
            <div className="max-w-[1000px] mx-auto px-4 md:px-6 pt-16">
                <div className="bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] rounded-[20px] p-[30px] md:p-[50px] border border-[#eee] border-t-[5px] border-t-[#ff2020]">
                    <form onSubmit={handleSubmit} noValidate>
                        
                        {/* Honeypot field (invisible to humans) */}
                        <div style={{ display: 'none' }}>
                            <input type="text" name="bot_field" value={formData.bot_field} onChange={handleChange} autoComplete="off" />
                        </div>

                        {/* --- 1. FOUNDER DETAILS --- */}
                        <div className="mb-10">
                            <h3 className="text-[1.3rem] font-bold text-[#333] mb-6 flex items-center border-b border-[#eee] pb-3">
                                <User className="w-5 h-5 mr-2 text-[#ff2020]" /> Founder Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelStyle}>First Name <span className="text-[#ff2020] ml-1">*</span></label>
                                    <input type="text" className={`${inputStyle} ${errors.firstName ? 'border-[#ff2020]' : ''}`} placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                    {errors.firstName && <p className={errorStyle}>{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>Last Name <span className="text-[#ff2020] ml-1">*</span></label>
                                    <input type="text" className={`${inputStyle} ${errors.lastName ? 'border-[#ff2020]' : ''}`} placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                    {errors.lastName && <p className={errorStyle}>{errors.lastName}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}><Mail className="w-4 h-4 mr-1.5 text-[#ff2020]" /> Email Address <span className="text-[#ff2020] ml-1">*</span></label>
                                    <input type="email" className={`${inputStyle} ${errors.email ? 'border-[#ff2020]' : ''}`} placeholder="Founder Email" name="email" value={formData.email} onChange={handleChange} />
                                    {errors.email && <p className={errorStyle}>{errors.email}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}><Phone className="w-4 h-4 mr-1.5 text-[#ff2020]" /> Mobile Number <span className="text-[#ff2020] ml-1">*</span></label>
                                    <input type="tel" className={`${inputStyle} ${errors.contactNumber ? 'border-[#ff2020]' : ''}`} placeholder="10-digit Mobile" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                                    {errors.contactNumber && <p className={errorStyle}>{errors.contactNumber}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}><Lock className="w-4 h-4 mr-1.5 text-[#ff2020]" /> Password <span className="text-[#ff2020] ml-1">*</span></label>
                                    <input type="password" className={`${inputStyle} ${errors.password ? 'border-[#ff2020]' : ''}`} placeholder="Create a strong password" name="password" value={formData.password} onChange={handleChange} />
                                    {errors.password && <p className={errorStyle}>{errors.password}</p>}
                                </div>
                            </div>
                        </div>

                        {/* --- 2. STARTUP DETAILS --- */}
                        <div className="mb-10">
                            <h3 className="text-[1.3rem] font-bold text-[#333] mb-6 flex items-center border-b border-[#eee] pb-3">
                                <Building className="w-5 h-5 mr-2 text-[#ff2020]" /> Startup Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelStyle}>Startup Name <span className="text-[#ff2020] ml-1">*</span></label>
                                    <input type="text" className={`${inputStyle} ${errors.startupName ? 'border-[#ff2020]' : ''}`} placeholder="Your Startup Name" name="startupName" value={formData.startupName} onChange={handleChange} />
                                    {errors.startupName && <p className={errorStyle}>{errors.startupName}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}><Globe className="w-4 h-4 mr-1.5 text-[#ff2020]" /> Website URL <span className="text-[#aaa] font-normal ml-1">(Optional)</span></label>
                                    <input type="url" className={inputStyle} placeholder="https://yourstartup.com" name="website" value={formData.website} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Startup Stage <span className="text-[#ff2020] ml-1">*</span></label>
                                    <select name="stage" className={`${inputStyle} ${errors.stage ? 'border-[#ff2020]' : ''}`} value={formData.stage} onChange={handleChange}>
                                        <option value="">Select Stage</option>
                                        <option value="Ideation">Ideation</option>
                                        <option value="MVP">MVP / Proof of Concept</option>
                                        <option value="Beta_Launched">Beta Launched</option>
                                        <option value="Early_Revenues">Early Revenues</option>
                                        <option value="Steady_Revenues">Steady Revenues</option>
                                    </select>
                                    {errors.stage && <p className={errorStyle}>{errors.stage}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>Industry / Sector <span className="text-[#ff2020] ml-1">*</span></label>
                                    <select name="industry" className={`${inputStyle} ${errors.industry ? 'border-[#ff2020]' : ''}`} value={formData.industry} onChange={handleChange}>
                                        <option value="">Select Industry</option>
                                        <option value="EdTech">EdTech</option>
                                        <option value="Healthcare">Healthcare</option>
                                        <option value="Agriculture">Agriculture</option>
                                        <option value="Information Technology">Information Technology</option>
                                        <option value="E-Commerce">E-Commerce</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.industry && <p className={errorStyle}>{errors.industry}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>DPIIT Number <span className="text-[#aaa] font-normal ml-1">(Optional)</span></label>
                                    <input type="text" className={inputStyle} placeholder="DPIIT Registration No." name="dpiitNo" value={formData.dpiitNo} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Revenue Started? <span className="text-[#ff2020] ml-1">*</span></label>
                                    <select name="revenueStarted" className={inputStyle} value={formData.revenueStarted} onChange={handleChange}>
                                        <option value="false">No, pre-revenue</option>
                                        <option value="true">Yes, generating revenue</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* --- 3. LOCATION (USING JSON DATA) --- */}
                        <div className="mb-10">
                            <h3 className="text-[1.3rem] font-bold text-[#333] mb-6 flex items-center border-b border-[#eee] pb-3">
                                <MapPin className="w-5 h-5 mr-2 text-[#ff2020]" /> Location Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* COUNTRY */}
                                <div>
                                    <label className={labelStyle}>Country <span className="text-[#ff2020] ml-1">*</span></label>
                                    <select name="country" className={`${inputStyle} ${errors.country ? 'border-[#ff2020]' : ''}`} value={formData.country} onChange={handleCountryChange}>
                                        <option value="">Select Country</option>
                                        {countriesList.map((c, idx) => (
                                            <option key={idx} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    {errors.country && <p className={errorStyle}>{errors.country}</p>}
                                </div>

                                {/* STATE */}
                                <div>
                                    <label className={labelStyle}>State <span className="text-[#ff2020] ml-1">*</span></label>
                                    {formData.country === 'India' ? (
                                        <select name="state" className={`${inputStyle} ${errors.state ? 'border-[#ff2020]' : ''}`} value={formData.state} onChange={handleStateChange}>
                                            <option value="">Select State</option>
                                            {indiaStates.map((s, idx) => (
                                                <option key={idx} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input type="text" name="state" placeholder="Enter State" value={formData.state} onChange={handleChange} className={`${inputStyle} ${errors.state ? 'border-[#ff2020]' : ''}`} disabled={!formData.country} />
                                    )}
                                    {errors.state && <p className={errorStyle}>{errors.state}</p>}
                                </div>

                                {/* CITY */}
                                <div>
                                    <label className={labelStyle}>City <span className="text-[#ff2020] ml-1">*</span></label>
                                    {formData.country === 'India' && availableCities.length > 0 ? (
                                        <select name="city" className={`${inputStyle} ${errors.city ? 'border-[#ff2020]' : ''}`} value={formData.city} onChange={handleChange}>
                                            <option value="">Select City</option>
                                            {availableCities.map((c, idx) => (
                                                <option key={idx} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input type="text" name="city" placeholder="Enter City" value={formData.city} onChange={handleChange} className={`${inputStyle} ${errors.city ? 'border-[#ff2020]' : ''}`} disabled={!formData.state} />
                                    )}
                                    {errors.city && <p className={errorStyle}>{errors.city}</p>}
                                </div>
                            </div>
                        </div>

                        {/* --- 4. BUSINESS PROPOSAL --- */}
                        <div className="mb-10">
                            <h3 className="text-[1.3rem] font-bold text-[#333] mb-6 flex items-center border-b border-[#eee] pb-3">
                                <Target className="w-5 h-5 mr-2 text-[#ff2020]" /> Business Proposal
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className={labelStyle}>Problem Statement <span className="text-[#ff2020] ml-1">*</span></label>
                                    <textarea rows="3" className={`${inputStyle} resize-none ${errors.problemStatement ? 'border-[#ff2020]' : ''}`} name="problemStatement" placeholder="What problem are you solving?" value={formData.problemStatement} onChange={handleChange}></textarea>
                                    {errors.problemStatement && <p className={errorStyle}>{errors.problemStatement}</p>}
                                </div>
                                <div>
                                    <label className={labelStyle}>Product / Service (Elevator Pitch) <span className="text-[#ff2020] ml-1">*</span></label>
                                    <textarea rows="4" className={`${inputStyle} resize-none ${errors.elevatorPitch ? 'border-[#ff2020]' : ''}`} name="elevatorPitch" placeholder="Describe your product/service and how it solves the problem..." value={formData.elevatorPitch} onChange={handleChange}></textarea>
                                    {errors.elevatorPitch && <p className={errorStyle}>{errors.elevatorPitch}</p>}
                                </div>
                            </div>
                        </div>

                        {/* --- 5. SECURITY --- */}
                        <div className="mt-8 bg-[#f8f9fa] p-6 rounded-[10px] border border-[#eee]">
                            <label className={labelStyle}>Security Verification <span className="text-[#ff2020] ml-1">*</span></label>
                            <div className="mt-3">
                                {/* FIXED: Replaced live domain key with official Google testing sitekey to work on localhost */}
                                <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={import.meta.env.VITE_RECAPTCHA_KEY}
                                onChange={handleRecaptcha}
                            />
                                {errors.recaptcha && <p className={errorStyle}>{errors.recaptcha}</p>}
                            </div>
                        </div>

                        {/* --- 6. SUBMIT --- */}
                        <div className="mt-10 text-center">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center px-[50px] py-[18px] bg-[#ff2020] hover:bg-[#d81c28] text-white font-bold rounded-[50px] text-[1.1rem] shadow-[0_10px_20px_rgba(255,32,32,0.25)] transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
                            >
                                {isSubmitting ? (
                                    <><span className="inline-block w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin mr-[10px] align-middle"></span> Processing...</>
                                ) : (
                                    <><Send className="w-5 h-5 mr-2" /> Submit Registration</>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </main>
    );
}