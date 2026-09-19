import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  CheckCircle, ArrowLeft, ArrowRight, Rocket, Mail, Building, 
  Smartphone, Calendar, Lightbulb, Briefcase, TrendingUp, Globe, 
  Link, Upload, Sparkles, Wrench, Box, DollarSign, Target
} from 'lucide-react';

const RampApplicationForm = () => {
  const navigate = useNavigate();
  const totalSteps = 10;
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stepContainerRef = useRef(null);
  const bgOrb1Ref = useRef(null);
  const bgOrb2Ref = useRef(null);
  
  const [formData, setFormData] = useState({
    email: '', startupName: '', mobile: '', foundedDate: '',
    brief: '', domain: '', stage: '', website: '', linkedin: '', pitchDeck: null
  });

  const popularDomains = [
    { name: 'EdTech', icon: <Lightbulb size={20} /> },
    { name: 'FinTech', icon: <DollarSign size={20} /> },
    { name: 'HealthTech', icon: <Target size={20} /> },
    { name: 'SaaS', icon: <Globe size={20} /> },
    { name: 'E-commerce', icon: <Box size={20} /> },
    { name: 'DeepTech', icon: <Sparkles size={20} /> },
    { name: 'AgriTech', icon: <TrendingUp size={20} /> }
  ];

  const stageOptions = [
    { id: 'Ideation', title: 'Ideation', desc: 'Just a vision, validating the market.', icon: <Lightbulb className="w-8 h-8 mb-3" /> },
    { id: 'PoC', title: 'Proof of Concept', desc: 'Building the initial prototype.', icon: <Wrench className="w-8 h-8 mb-3" /> },
    { id: 'MVP', title: 'MVP Ready', desc: 'Basic product is out for early users.', icon: <Box className="w-8 h-8 mb-3" /> },
    { id: 'Pre-Revenue', title: 'Early Traction', desc: 'Got users, iterating fast, pre-revenue.', icon: <TrendingUp className="w-8 h-8 mb-3" /> },
    { id: 'Revenue', title: 'Revenue Generating', desc: 'Actively making money & growing.', icon: <DollarSign className="w-8 h-8 mb-3" /> }
  ];

  const stepQuotes = [
    "Every big empire starts with a single email.",
    "What will the world remember you by?",
    "Let's stay connected for the big news.",
    "When did this beautiful journey begin?",
    "Pitch us your vision. Make it count.",
    "Where does your startup make an impact?",
    "How far along are you on this mission?",
    "Where can we find your digital footprint?",
    "Your professional network speaks volumes.",
    "The final countdown. Show us your master plan!"
  ];

  // Advanced Animations on Step Change
  useEffect(() => {
    if (!isSubmitted) {
      const ctx = gsap.context(() => {
        // Form Content Entrance (Blur & Slide)
        gsap.fromTo(stepContainerRef.current, 
          { opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.95 }, 
          { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 0.8, ease: "back.out(1.2)" }
        );

        // Dynamic Background Orbs Movement based on Step
        gsap.to(bgOrb1Ref.current, {
          x: (step % 2 === 0) ? 200 : -200,
          y: (step % 3 === 0) ? 150 : -150,
          scale: 1 + (step * 0.05),
          duration: 2,
          ease: "power2.out"
        });
        
        gsap.to(bgOrb2Ref.current, {
          x: (step % 2 === 0) ? -200 : 200,
          y: (step % 3 === 0) ? -150 : 150,
          scale: 1.5 - (step * 0.05),
          duration: 2,
          ease: "power2.out"
        });
      });
      return () => ctx.revert();
    }
  }, [step, isSubmitted]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setError(''); 
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      if (name === 'brief' && value.length > 200) return;
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && step !== 5 && step !== 10) {
      e.preventDefault();
      handleNext();
    }
  };

  const validateStep = () => {
    setError('');
    switch (step) {
      case 1: if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'A valid email is required to blast off.'; break;
      case 2: if (!formData.startupName.trim()) return 'We need a name for the history books.'; break;
      case 3: if (!formData.mobile.trim() || formData.mobile.length < 10) return 'Enter a valid comms channel (mobile number).'; break;
      case 4: if (!formData.foundedDate) return 'Time coordinates required (Founded Date).'; break;
      case 5: if (formData.brief.length < 20) return 'Dig a little deeper. Give us at least 20 characters.'; break;
      case 6: if (!formData.domain.trim()) return 'Select or enter your operational domain.'; break;
      case 7: if (!formData.stage) return 'Identify your current mission stage.'; break;
      case 8: if (!formData.website.trim()) return 'We need your headquarters URL.'; break;
      case 9: if (!formData.linkedin.includes('linkedin.com')) return 'A valid LinkedIn profile is required.'; break;
      case 10: 
        if (!formData.pitchDeck) return 'Your Pitch Deck is your ticket. Please upload it.'; 
        if (formData.pitchDeck.type !== 'application/pdf') return 'Only PDF blueprints are accepted.';
        break;
      default: break;
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      gsap.fromTo(stepContainerRef.current, 
        { x: -15 }, { x: 15, yoyo: true, repeat: 3, duration: 0.08, ease: "power1.inOut", onComplete: () => gsap.set(stepContainerRef.current, {x: 0}) }
      );
      setError(validationError);
      return;
    }
    if (step < totalSteps) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrev = () => { if (step > 1) { setStep(step - 1); setError(''); } };

  const handleSubmit = () => {
    console.log('Form Submitted:', formData);
    setIsSubmitted(true);
  };

  // ==========================================
  // SUCCESS / THANK YOU PAGE RENDER
  // ==========================================
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#030305] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-r from-[#ff2020]/20 to-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-[pulse_4s_infinite]"></div>
        
        <div className="max-w-xl w-full bg-white/5 backdrop-blur-2xl p-12 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center border border-white/10 relative z-10 animate-[fadeIn_1s_ease-out]">
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)] relative">
            <CheckCircle className="w-16 h-16 text-white absolute animate-[ping_1.5s_ease-in-out_infinite] opacity-50" />
            <CheckCircle className="w-16 h-16 text-white relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-4 tracking-tight">Mission Accomplished!</h1>
          <p className="text-gray-400 mb-10 leading-relaxed text-lg font-light">
            Your application for <span className="font-bold text-[#ff2020]">RAMP 2.0</span> has successfully entered our orbit. Our experts are reviewing your pitch deck. Stay tuned to your comms channel (email).
          </p>
          <button
            onClick={() => navigate('/')}
            className="group relative bg-white hover:bg-gray-100 text-black font-extrabold py-4 px-10 rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.15)] transition-all hover:scale-105 inline-flex items-center gap-3 uppercase tracking-widest text-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
            <ArrowLeft className="w-5 h-5 relative z-10" /> <span className="relative z-10">Return to Base</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // FORM INPUT RENDERER
  // ==========================================
  const renderInput = () => {
    const inputClasses = "w-full text-2xl md:text-4xl font-black bg-transparent border-b-2 border-white/20 focus:border-[#ff2020] text-white outline-none py-4 transition-colors placeholder-white/10 caret-[#ff2020]";
    
    switch (step) {
      case 1:
        return (
          <>
            <div className="inline-flex items-center gap-3 text-[#ff2020] bg-[#ff2020]/10 px-4 py-2 rounded-full mb-8"><Mail className="w-5 h-5" /> <span className="uppercase tracking-widest font-bold text-xs">Primary Contact</span></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">Let's start with your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-[#ff7a7a]">email address</span>.</h2>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="founder@startup.com" className={inputClasses} autoFocus />
          </>
        );
      case 2:
        return (
          <>
            <div className="inline-flex items-center gap-3 text-[#ff2020] bg-[#ff2020]/10 px-4 py-2 rounded-full mb-8"><Building className="w-5 h-5" /> <span className="uppercase tracking-widest font-bold text-xs">Identity</span></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">What is the name of <br/>your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-[#ff7a7a]">startup</span>?</h2>
            <input type="text" name="startupName" value={formData.startupName} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="e.g. InnovateX" className={inputClasses} autoFocus />
          </>
        );
      case 3:
        return (
          <>
            <div className="inline-flex items-center gap-3 text-[#ff2020] bg-[#ff2020]/10 px-4 py-2 rounded-full mb-8"><Smartphone className="w-5 h-5" /> <span className="uppercase tracking-widest font-bold text-xs">Communication</span></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">What's the best number <br/>to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-[#ff7a7a]">reach you</span>?</h2>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="+91 90000 00000" className={inputClasses} autoFocus />
          </>
        );
      case 4:
        return (
          <>
            <div className="inline-flex items-center gap-3 text-[#ff2020] bg-[#ff2020]/10 px-4 py-2 rounded-full mb-8"><Calendar className="w-5 h-5" /> <span className="uppercase tracking-widest font-bold text-xs">Timeline</span></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">When did you <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-[#ff7a7a]">found</span> <br/>this venture?</h2>
            <input type="date" name="foundedDate" value={formData.foundedDate} onChange={handleInputChange} onKeyDown={handleKeyDown} className={`${inputClasses} [color-scheme:dark] text-3xl`} autoFocus />
          </>
        );
      case 5:
        return (
          <>
            <div className="inline-flex items-center gap-3 text-[#ff2020] bg-[#ff2020]/10 px-4 py-2 rounded-full mb-8"><Lightbulb className="w-5 h-5" /> <span className="uppercase tracking-widest font-bold text-xs">The Core</span></div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-[1.2]">In a few words, what <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-[#ff7a7a]">problem</span> are you solving?</h2>
            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-[#ff2020] focus-within:bg-[#ff2020]/5 transition-all">
              <textarea name="brief" value={formData.brief} onChange={handleInputChange} placeholder="We are building a platform that..." className="w-full text-xl md:text-2xl bg-transparent text-white outline-none p-4 resize-none h-40 leading-relaxed placeholder-white/20" autoFocus />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full border-[3px] border-white/10 flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke={formData.brief.length > 180 ? '#ff2020' : '#4ade80'} strokeDasharray="100" strokeDashoffset={100 - (formData.brief.length / 200) * 100} className="transition-all duration-300" />
                  </svg>
                </div>
                <span className={`text-sm font-bold ${formData.brief.length > 180 ? 'text-[#ff2020]' : 'text-gray-400'}`}>{formData.brief.length}/200</span>
              </div>
            </div>
          </>
        );
      case 6:
        return (
          <>
            <div className="inline-flex items-center gap-3 text-[#ff2020] bg-[#ff2020]/10 px-4 py-2 rounded-full mb-8"><Briefcase className="w-5 h-5" /> <span className="uppercase tracking-widest font-bold text-xs">Sector</span></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">Select your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-[#ff7a7a]">industry</span>.</h2>
            <div className="flex flex-wrap gap-4 mb-8">
              {popularDomains.map(domain => (
                <button key={domain.name} onClick={() => { setFormData({...formData, domain: domain.name}); setError(''); }} className={`flex items-center gap-2 px-6 py-4 rounded-xl border-2 font-bold transition-all duration-300 ${formData.domain === domain.name ? 'bg-[#ff2020] border-[#ff2020] text-white shadow-[0_10px_30px_rgba(255,32,32,0.4)] scale-105' : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white'}`}>
                  {domain.icon} {domain.name}
                </button>
              ))}
            </div>
            <input type="text" name="domain" value={formData.domain} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="Or type custom domain here..." className={`${inputClasses} text-xl`} />
          </>
        );
      case 7:
        return (
          <>
            <div className="inline-flex items-center gap-3 text-[#ff2020] bg-[#ff2020]/10 px-4 py-2 rounded-full mb-8"><TrendingUp className="w-5 h-5" /> <span className="uppercase tracking-widest font-bold text-xs">Progress</span></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">What's your current <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-[#ff7a7a]">stage</span>?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stageOptions.map(option => (
                <div key={option.id} onClick={() => { setFormData({...formData, stage: option.id}); setError(''); }} className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 group ${formData.stage === option.id ? 'bg-gradient-to-br from-[#ff2020]/20 to-transparent border-[#ff2020] shadow-[0_10px_30px_rgba(255,32,32,0.2)] -translate-y-2' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1'}`}>
                  <div className={`transition-colors duration-300 ${formData.stage === option.id ? 'text-[#ff2020]' : 'text-gray-500 group-hover:text-white'}`}>
                    {option.icon}
                  </div>
                  <h3 className={`text-xl font-black mb-2 tracking-wide ${formData.stage === option.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{option.title}</h3>
                  <p className={`text-sm ${formData.stage === option.id ? 'text-red-200' : 'text-gray-500'}`}>{option.desc}</p>
                </div>
              ))}
            </div>
          </>
        );
      case 8:
        return (
          <>
            <div className="inline-flex items-center gap-3 text-[#ff2020] bg-[#ff2020]/10 px-4 py-2 rounded-full mb-8"><Globe className="w-5 h-5" /> <span className="uppercase tracking-widest font-bold text-xs">Digital Base</span></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">Where can we find you <br/>on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-[#ff7a7a]">web</span>?</h2>
            <input type="url" name="website" value={formData.website} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="https://yourstartup.com" className={inputClasses} autoFocus />
          </>
        );
      case 9:
        return (
          <>
            <div className="inline-flex items-center gap-3 text-[#ff2020] bg-[#ff2020]/10 px-4 py-2 rounded-full mb-8"><Link className="w-5 h-5" /> <span className="uppercase tracking-widest font-bold text-xs">Network</span></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">Drop your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-[#ff7a7a]">LinkedIn</span> <br/>profile.</h2>
            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="https://linkedin.com/in/founder" className={inputClasses} autoFocus />
          </>
        );
      case 10:
        return (
          <>
            <div className="inline-flex items-center gap-3 text-green-400 bg-green-400/10 px-4 py-2 rounded-full mb-8"><Sparkles className="w-5 h-5" /> <span className="uppercase tracking-widest font-bold text-xs">The Climax</span></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">Upload your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Pitch Deck</span>.</h2>
            
            <label className={`relative flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all duration-500 overflow-hidden group ${formData.pitchDeck ? 'border-green-500 bg-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.15)]' : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/50'}`}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4 relative z-10">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${formData.pitchDeck ? 'bg-green-500 text-black scale-110' : 'bg-white/10 text-white/50 group-hover:scale-110 group-hover:text-white'}`}>
                  <Upload className="w-10 h-10" />
                </div>
                {formData.pitchDeck ? (
                  <>
                    <p className="mb-2 text-2xl font-black text-white">{formData.pitchDeck.name}</p>
                    <p className="text-sm text-green-400 font-bold uppercase tracking-widest">Deck Secured • Click to change</p>
                  </>
                ) : (
                  <>
                    <p className="mb-3 text-2xl font-black text-white">Click to upload or drag & drop</p>
                    <p className="text-sm text-gray-400 font-medium tracking-wide">PDF format only (Max 10MB)</p>
                  </>
                )}
              </div>
              <input type="file" name="pitchDeck" accept=".pdf" onChange={handleInputChange} className="hidden" />
            </label>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] flex flex-col relative overflow-hidden font-['Poppins',sans-serif]">
      {/* Deep Space Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] mix-blend-screen pointer-events-none"></div>
      <div ref={bgOrb1Ref} className="absolute top-[10%] left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#ff2020]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div ref={bgOrb2Ref} className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      {/* Glassmorphism Navbar Area */}
      <div className="w-full p-6 md:px-12 md:py-8 flex items-center justify-between relative z-30 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff2020] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,32,32,0.4)]">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">RAMP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2020] to-orange-400">2.0</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <span className="text-[#ff2020] font-black">{step}</span>
            <span className="text-white/30 text-sm">/ {totalSteps}</span>
          </div>
          <button onClick={() => navigate('/')} className="text-white/50 hover:text-white transition-colors font-bold text-sm tracking-widest uppercase hover:bg-white/10 px-4 py-2 rounded-full">Exit</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col justify-center px-4 sm:px-8 lg:px-24 xl:px-48 relative z-20">
        
        {/* Dynamic Context Panel (Left on Desktop, Top on Mobile) */}
        <div className="w-full max-w-5xl mx-auto min-h-[500px] flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          
          <div className="w-full lg:w-1/3 flex flex-col pt-8 lg:pt-0">
            <div className="h-1 w-full bg-white/10 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#ff2020] to-orange-500 transition-all duration-700 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
            </div>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed italic border-l-4 border-[#ff2020]/50 pl-6 animate-[fadeIn_0.5s_ease-out]">
              "{stepQuotes[step - 1]}"
            </p>
          </div>

          {/* Form Input Area */}
          <div className="w-full lg:w-2/3">
            <div ref={stepContainerRef} className="will-change-transform">
              {renderInput()}
              
              {/* Error Message */}
              {error && (
                <div className="mt-6 flex items-center gap-3 text-[#ff2020] bg-[#ff2020]/10 border border-[#ff2020]/30 px-5 py-4 rounded-xl font-bold animate-[pulse_2s_infinite] backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-[#ff2020]"></div> {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between mt-12 py-8 relative z-30">
          <button 
            onClick={handlePrev}
            className={`font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all hover:bg-white/10 px-6 py-3 rounded-full ${step > 1 ? 'text-white/60 hover:text-white' : 'opacity-0 pointer-events-none'}`}
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          
          <button 
            onClick={handleNext}
            className="group relative px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#ff2020] to-orange-500 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              {step === totalSteps ? 'Launch Application' : 'Next Step'} <ArrowRight className="w-5 h-5" />
            </span>
          </button>
        </div>

        {/* Keyboard Hint */}
        <div className="w-full text-center pb-8 text-white/20 text-xs font-bold uppercase tracking-widest hidden md:block">
          {step !== 5 && step !== 10 ? 'Press Enter ↵ to continue' : ''}
        </div>

      </div>
    </div>
  );
};

export default RampApplicationForm;