import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const RampApplicationForm = () => {
  const navigate = useNavigate();
  const totalSteps = 10;
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    startupName: '',
    mobile: '',
    foundedDate: '',
    brief: '',
    domain: '',
    stage: '',
    website: '',
    linkedin: '',
    pitchDeck: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setError(''); // Clear error on typing
    
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      // Character limit check for brief
      if (name === 'brief' && value.length > 200) return;
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateStep = () => {
    setError('');
    
    switch (step) {
      case 1:
        if (!formData.email) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Enter a valid email address';
        break;
      case 2:
        if (!formData.startupName.trim()) return 'Startup Name is required';
        break;
      case 3:
        if (!formData.mobile.trim()) return 'Mobile Number is required';
        if (!/^\d{10,15}$/.test(formData.mobile.replace(/[^0-9]/g, ''))) return 'Enter a valid mobile number';
        break;
      case 4:
        if (!formData.foundedDate) return 'Founded Date is required';
        break;
      case 5:
        if (!formData.brief.trim()) return 'Startup Brief is required';
        if (formData.brief.length < 10) return 'Please provide a slightly more detailed brief (min 10 chars)';
        break;
      case 6:
        if (!formData.domain.trim()) return 'Domain / Industry is required';
        break;
      case 7:
        if (!formData.stage) return 'Startup Stage is required';
        break;
      case 8:
        if (!formData.website.trim()) return 'Website Link is required';
        if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.website)) return 'Enter a valid URL';
        break;
      case 9:
        if (!formData.linkedin.trim()) return 'LinkedIn Link is required';
        if (!formData.linkedin.includes('linkedin.com')) return 'Enter a valid LinkedIn URL';
        break;
      case 10:
        if (!formData.pitchDeck) return 'Pitch Deck is required';
        if (formData.pitchDeck.type !== 'application/pdf') return 'Only PDF files are allowed';
        break;
      default:
        break;
    }
    return null;
  };

  const handleNext = () => {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleSubmit = () => {
    // Handle form submission logic here (e.g., API call)
    console.log('Form Submitted:', formData);
    
    // Show the Thank You page
    setIsSubmitted(true);
  };

  // ==========================================
  // SUCCESS / THANK YOU PAGE RENDER
  // ==========================================
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white text-[#1a202c]">
        <div className="max-w-lg w-full bg-slate-50 p-10 rounded-[2rem] shadow-xl text-center border border-slate-100 animate-[fadeIn_0.5s_ease-out]">
          
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-green-500 animate-[bounce_1s_ease-in-out_2]" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-[#2d2d2d] mb-4">
            Application Submitted!
          </h1>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for applying to <span className="font-bold text-[#ff1e1e]">RAMP 2.0</span>. We have successfully received your startup details and pitch deck. Our selection committee will review your application and get back to you via email shortly.
          </p>
          
          <button
            onClick={() => navigate('/')}
            className="bg-black hover:bg-gray-800 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 inline-flex items-center gap-2 uppercase tracking-wider text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>

        {/* Inline CSS for the fade-in animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}} />
      </div>
    );
  }

  // ==========================================
  // FORM INPUT RENDERER
  // ==========================================
  const renderInput = () => {
    const inputClasses = "w-full text-xl py-3 border-b border-gray-300 focus:border-black outline-none bg-transparent transition-colors placeholder-gray-400";
    
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">1. Email Address *</h2>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleInputChange} 
              placeholder="demo@gmail.com"
              className={inputClasses} 
              autoFocus
            />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">2. Startup Name *</h2>
            <input 
              type="text" 
              name="startupName"
              value={formData.startupName} 
              onChange={handleInputChange} 
              placeholder="Enter your startup name"
              className={inputClasses} 
              autoFocus
            />
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">3. Mobile Number *</h2>
            <input 
              type="tel" 
              name="mobile"
              value={formData.mobile} 
              onChange={handleInputChange} 
              placeholder="+91 9876543210"
              className={inputClasses} 
              autoFocus
            />
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">4. Founded Date *</h2>
            <input 
              type="date" 
              name="foundedDate"
              value={formData.foundedDate} 
              onChange={handleInputChange} 
              className={inputClasses} 
              autoFocus
            />
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">5. Brief (150-200 chars) *</h2>
            <textarea 
              name="brief"
              value={formData.brief} 
              onChange={handleInputChange} 
              placeholder="What problem are you solving?"
              className={`${inputClasses} resize-none`}
              rows={3}
              autoFocus
            />
            <p className="text-right text-sm text-gray-500 mt-2">
              {formData.brief.length} / 200
            </p>
          </>
        );
      case 6:
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">6. Domain / Industry *</h2>
            <input 
              type="text"
              name="domain"
              list="domains"
              value={formData.domain} 
              onChange={handleInputChange} 
              placeholder="e.g. EdTech, FinTech, SaaS..."
              className={inputClasses} 
              autoFocus
            />
            <datalist id="domains">
              <option value="AgriTech" />
              <option value="DeepTech" />
              <option value="EdTech" />
              <option value="FinTech" />
              <option value="HealthTech" />
              <option value="SaaS" />
              <option value="E-commerce" />
            </datalist>
          </>
        );
      case 7:
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">7. Startup Stage *</h2>
            <select 
              name="stage"
              value={formData.stage} 
              onChange={handleInputChange} 
              className={inputClasses}
              autoFocus
            >
              <option value="" disabled>Select your current stage</option>
              <option value="Ideation">Ideation</option>
              <option value="Proof of Concept (PoC)">Proof of Concept (PoC)</option>
              <option value="Minimum Viable Product (MVP)">Minimum Viable Product (MVP)</option>
              <option value="Early Traction / Pre-Revenue">Early Traction / Pre-Revenue</option>
              <option value="Revenue Generating">Revenue Generating</option>
            </select>
          </>
        );
      case 8:
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">8. Website Link *</h2>
            <input 
              type="url" 
              name="website"
              value={formData.website} 
              onChange={handleInputChange} 
              placeholder="https://www.yourstartup.com"
              className={inputClasses} 
              autoFocus
            />
          </>
        );
      case 9:
        return (
          <>
            <h2 className="text-2xl font-medium mb-6">9. LinkedIn Link *</h2>
            <input 
              type="url" 
              name="linkedin"
              value={formData.linkedin} 
              onChange={handleInputChange} 
              placeholder="https://linkedin.com/company/yourstartup"
              className={inputClasses} 
              autoFocus
            />
          </>
        );
      case 10:
        return (
          <>
            <h2 className="text-xl md:text-2xl font-medium mb-6 text-gray-700 bg-gray-200 inline-block px-1">10. Pitch Deck (PDF Only) *</h2>
            <div className="relative border-b border-gray-300 pb-3">
              <input 
                type="file" 
                name="pitchDeck"
                accept=".pdf"
                onChange={handleInputChange} 
                className="block w-full text-lg cursor-pointer file:mr-2 file:py-1 file:px-3 file:border file:border-gray-400 file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 file:rounded-sm transition-all" 
              />
            </div>
            {formData.pitchDeck && (
              <p className="mt-2 text-green-600 text-sm font-medium">
                Selected: {formData.pitchDeck.name}
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  // ==========================================
  // MAIN COMPONENT RENDER
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-4 bg-white text-[#1a202c]">
      
      {/* Header Form Title */}
      <div className="w-full max-w-3xl mt-30 mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight inline-flex items-center gap-3">
          <span className="relative">
            RAMP Application
            {/* The exact pink underline style from image */}
            <span className="absolute bottom-1 left-0 w-full h-1 bg-[#ffdfdf] -z-10"></span>
          </span>
          2.0
        </h1>
      </div>

      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 bg-gray-200 h-[3px] rounded-full relative">
            <div 
              className="absolute top-0 left-0 h-[3px] bg-[#333333] rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">Step {step} of {totalSteps}</span>
        </div>

        {/* Form Fields */}
        <div className="min-h-[150px]">
          {renderInput()}
          
          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mt-3 animate-pulse">{error}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mt-16 pb-12">
          {step > 1 && (
            <button 
              onClick={handlePrev}
              className="relative overflow-hidden bg-[#ededed] text-gray-700 font-bold text-sm px-8 py-2.5 rounded-full uppercase tracking-wide group transition-all"
            >
              {/* Smooth Black Fill Background */}
              <span className="absolute inset-0 w-full h-full bg-black origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
              {/* Text rendering on top */}
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">PREVIOUS</span>
            </button>
          )}
          
          <button 
            onClick={handleNext}
            className="bg-[#ff1e1e] hover:bg-[#d81010] text-white font-bold py-2.5 px-8 rounded-full shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wide uppercase"
          >
            {step === totalSteps ? 'SUBMIT APPLICATION' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RampApplicationForm;