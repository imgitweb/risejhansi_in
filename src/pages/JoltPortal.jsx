import React, { useState, useEffect, useRef } from 'react';
import yogiji from '../img/yogiji.jpeg';

export default function JoltPortal() {
  // --- STATE MANAGEMENT ---
  const API_BASE_URL = 'https://www.incubationmasters.com/api/jolt';
  
  const [activeTab, setActiveTab] = useState('problem'); // 'problem' | 'solution'
  const [solutionSubmitType, setSolutionSubmitType] = useState('Startup'); // 'Startup' | 'Individual'
  
  const [problemsList, setProblemsList] = useState([]);
  const [problemMap, setProblemMap] = useState({});
  
  // Conditional "Other" Fields State
  const [probOrgType, setProbOrgType] = useState('');
  const [probCategory, setProbCategory] = useState('');
  const [solSector, setSolSector] = useState('');
  const [solPrevImplemented, setSolPrevImplemented] = useState('');
  const [solDevStage, setSolDevStage] = useState('');
  const [solPocDuration, setSolPocDuration] = useState('');

  // File states
  const [probFileName, setProbFileName] = useState('');
  const [solFileName, setSolFileName] = useState('');
  const [audioNames, setAudioNames] = useState({});

  // Loading & Toast State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Refs for forms
  const problemFormRef = useRef(null);
  const solutionFormRef = useRef(null);
  const probFileRef = useRef(null);
  const solFileRef = useRef(null);

  // --- LIFECYCLE: FETCH PROBLEMS ---
  useEffect(() => {
    fetchAvailableProblems();
    // Auto-scroll to forms on load if URL has #forms
    if (window.location.hash === '#forms') {
      setTimeout(() => {
        document.getElementById('forms')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  const fetchAvailableProblems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/problems`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const json = await response.json();
      const map = {};
      
      if (json.success && json.data && json.data.length > 0) {
        const approvedProblems = json.data.filter(prob => prob.status === 'Approved');
        setProblemsList(approvedProblems);
        
        approvedProblems.forEach(prob => {
          const title = prob.title || prob.problemTitle;
          map[title] = prob._id;
        });
      } else {
        setProblemsList([]);
      }
      setProblemMap(map);
    } catch (error) {
      console.error('Error fetching problems:', error);
      // Fallback for development if API fails
      const mockTitles = ['AI-based Waste Collection', 'Smart Traffic Management', 'Healthcare Data Digitization'];
      const mockMap = {};
      mockTitles.forEach(t => (mockMap[t] = `mock_${Math.random()}`));
      setProblemsList(mockTitles.map(t => ({ title: t })));
      setProblemMap(mockMap);
    }
  };

  // --- HELPERS ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleAudioChange = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      setAudioNames(prev => ({ ...prev, [fieldName]: `Selected: ${e.target.files[0].name}` }));
    } else {
      setAudioNames(prev => {
        const newState = { ...prev };
        delete newState[fieldName];
        return newState;
      });
    }
  };

  const validateCheckboxes = (form, namePrefixes) => {
    for (let name of namePrefixes) {
      const checkboxes = form.querySelectorAll(`input[name="${name}"]`);
      if (checkboxes.length > 0) {
        const isChecked = Array.from(checkboxes).some(cb => cb.checked);
        if (!isChecked) return false;
      }
    }
    return true;
  };

  // --- SUBMISSION HANDLERS ---
  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      showToast("Please fill all required fields correctly.", "error");
      form.reportValidity();
      return;
    }

    if (!validateCheckboxes(form, ['affectedGroups', 'preferredSolutionTypes'])) {
      showToast("Please select at least one option in checkbox groups.", "error");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(form);

    try {
      const response = await fetch(`${API_BASE_URL}/problems`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Problem Statement submitted successfully!", "success");
        form.reset();
        setProbOrgType('');
        setProbCategory('');
        setProbFileName('');
        setAudioNames({});
        fetchAvailableProblems();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      console.error("Problem Submission Error:", error);
      showToast(error.message || "Failed to submit. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      showToast("Please fill all required fields correctly.", "error");
      form.reportValidity();
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(form);

    // Inject exact problem ID if matched
    const probTitle = formData.get('problemStatementRef');
    if (problemMap[probTitle]) {
      formData.set('problemStatementId', problemMap[probTitle]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/solutions`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Solution submitted successfully!", "success");
        form.reset();
        setSolSector('');
        setSolPrevImplemented('');
        setSolDevStage('');
        setSolPocDuration('');
        setSolFileName('');
        setSolutionSubmitType('Startup'); // Reset to default
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      console.error("Solution Submission Error:", error);
      showToast(error.message || "Failed to submit. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Numbering for Solution Form
  const numOffset = solutionSubmitType === 'Startup' ? 1 : 0;

  // --- COMMON TAILWIND CLASSES ---
  const inputClass = "w-full px-[16px] py-[12px] border-2 border-[#eee] rounded-[10px] font-['Poppins'] text-[0.95rem] text-[#555] bg-[#fdfdfd] focus:border-[#ff2020] focus:bg-white outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClass = "block text-[0.92rem] font-semibold text-[#333] mb-[8px]";
  const btnPrimary = "inline-block px-[40px] py-[15px] rounded-[50px] font-semibold text-[1rem] transition-all duration-300 bg-[#ff2020] text-white shadow-[0_10px_20px_rgba(255,32,32,0.2)] border-2 border-[#ff2020] hover:bg-transparent hover:text-[#ff2020] hover:-translate-y-[3px] cursor-pointer text-center";
  const btnOutline = "inline-block px-[40px] py-[15px] rounded-[50px] font-semibold text-[1rem] transition-all duration-300 border-2 border-[#333] text-[#333] hover:bg-[#333] hover:text-white hover:-translate-y-[3px] cursor-pointer text-center";
  const sectionHeadH2 = "text-[2.5rem] font-bold text-[#333] mb-[15px] relative inline-block after:content-[''] after:block after:w-[60px] after:h-[4px] after:bg-[#ff2020] after:mx-auto after:mt-[10px] after:rounded-[2px]";
  const formSectionTitle = "text-[1.3rem] font-bold text-[#333] my-[35px] pb-[10px] border-b-2 border-[#f0f0f0] flex items-center gap-[10px]";
  const formNum = "w-[32px] h-[32px] bg-[#ff2020] text-white rounded-full inline-flex items-center justify-center text-[0.9rem] font-bold shrink-0";
  const checkListItem = "relative pl-[35px] mb-[15px] text-[1.05rem] before:content-['✔'] before:absolute before:left-0 before:top-[2px] before:text-[#ff2020] before:font-extrabold";
  const multiCheckItem = "flex items-center gap-[6px] bg-[#f8f9fa] px-[14px] py-[8px] rounded-[50px] text-[0.9rem] cursor-pointer transition-all duration-200 border border-[#eee] hover:border-[#ff2020] hover:text-[#ff2020]";

  return (
    <div className="font-['Poppins',sans-serif] text-[#555] leading-[1.7] bg-white relative overflow-x-hidden">
      
      {/* STICKY APPLY BUTTON */}
      <a href="#forms" className="fixed top-[180px] right-[20px] z-[9999] bg-[#ff2020] text-white px-[30px] py-[15px] rounded-[50px] font-bold no-underline shadow-[0_5px_20px_rgba(0,0,0,0.3)] border-2 border-white flex items-center gap-[10px] transition-all duration-300 hover:-translate-y-[5px] hover:text-white">
        Join the Mission
      </a>

      {/* --- HERO SECTION --- */}
      <section id="home" className="bg-gradient-to-br from-[#fff5f5] to-[#ffffff] pt-[50px] pb-[100px]">
        <div className="max-w-[1200px] mx-auto px-[20px]">
          <div className="relative text-center pb-[40px]">
            <img src="/assets/img/yogiji.jpeg" alt="Banner Image" className="max-w-full w-full h-auto rounded-[12px] block" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-[50px] items-center text-center lg:text-left">
            <div>
              <h1 className="text-[2.5rem] lg:text-[3.5rem] font-bold text-[#333] leading-[1.2] mb-[25px]">
                Transforming <br />
                <span className="text-[#ff2020] relative after:content-[''] after:absolute after:bottom-[5px] after:left-0 after:w-full after:h-[15px] after:bg-[rgba(255,230,0,0.3)] after:z-[-1]">
                  Problems into
                </span><br />
                Startup Solutions
              </h1>
              <p className="text-[1.2rem] text-[#666] mb-[40px]">
                JOLT – Jhansi Open Lab for Technology is an open innovation platform by Jhansi Smart City that connects real-world challenges with innovative startups capable of building impactful solutions.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-[15px]">
                <a href="#forms" className={btnPrimary}>Submit a Problem</a>
                <a href="#about" className={btnOutline}>Learn More</a>
              </div>
            </div>
            <div>
              {/* Placeholder for hero tags (from original code) */}
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-[90px] relative">
        <div className="max-w-[1200px] mx-auto px-[20px]">
          <div className="text-center mb-[60px]">
            <h2 className={sectionHeadH2}>About JOLT</h2>
            <p className="text-[1.1rem] max-w-[700px] mx-auto">Every challenge is an opportunity to innovate.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px] mb-[60px]">
            {[
              { num: '20+', label: 'Problem Categories' },
              { num: '6', label: 'Stage Process' },
              { num: '4', label: 'Submitter Types' },
              { num: '∞', label: 'Impact Potential' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-[30px_20px] rounded-[15px] text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-b-[4px] border-[#ff2020]">
                <span className="block text-[2.5rem] font-extrabold text-[#ff2020] leading-none mb-[10px]">{stat.num}</span>
                <span className="text-[0.9rem] font-semibold uppercase tracking-[1px] text-[#333]">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-white p-[30px] md:p-[50px] rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.05)] border-l-[5px] border-[#ff2020]">
            <h3 className="text-[1.5rem] font-bold text-[#333] mb-[20px]">What is JOLT?</h3>
            <p className="text-[1.05rem] mb-[20px]">
              JOLT is an open innovation platform by Jhansi Smart City that connects real-world problems from government departments, private industries, institutions, and citizens with innovative startups capable of building impactful solutions.
            </p>
            <p className="text-[1.05rem]">
              Instead of letting challenges remain unresolved, JOLT creates a structured ecosystem where organizations can publish their problem statements and startups can submit innovative, scalable, and implementable solutions. Cities, industries, and institutions face hundreds of operational and strategic challenges every day — JOLT bridges this gap.
            </p>
          </div>
        </div>
      </section>

      {/* --- WHO CAN SUBMIT SECTION --- */}
      <section id="who" className="py-[90px] relative bg-[#f8f9fa]">
        <div className="max-w-[1200px] mx-auto px-[20px]">
          <div className="text-center mb-[60px]">
            <h2 className={sectionHeadH2}>Who Can Submit Problem Statements?</h2>
            <p className="text-[1.1rem] max-w-[700px] mx-auto">We welcome challenges from all sectors of society.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
            {[
              { icon: '🏛', title: 'Government Departments', desc: 'Share civic, administrative, infrastructure, healthcare, education, transport, sanitation, agriculture, water, energy, or public service challenges.' },
              { icon: '🏭', title: 'Private Industries', desc: 'Publish manufacturing, automation, AI, sustainability, HR, logistics, quality control, digital transformation, and operational challenges.' },
              { icon: '🏢', title: 'Educational Institutions', desc: 'Submit challenges related to campus management, student engagement, learning technologies, research, and administration.' },
              { icon: '👥', title: 'Citizens', desc: 'Have an idea to improve Jhansi? Report civic issues or suggest opportunities where technology and innovation can make life better.' }
            ].map((focus, idx) => (
              <div key={idx} className="bg-white p-[35px_25px] rounded-[15px] transition-all duration-300 border border-[#eee] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:border-[#ff2020]">
                <h3 className="text-[1.2rem] mb-[12px] text-[#333] font-bold">{focus.icon} {focus.title}</h3>
                <p>{focus.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how" className="py-[90px] relative">
        <div className="max-w-[1200px] mx-auto px-[20px]">
          <div className="text-center mb-[60px]">
            <h2 className={sectionHeadH2}>How JOLT Works</h2>
            <p className="text-[1.1rem] max-w-[700px] mx-auto">A structured 6-step process from problem to solution.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {[
              { title: 'Problem Identification', desc: 'Government departments, industries, institutions, and citizens submit real-world challenges.' },
              { title: 'Problem Review', desc: 'The JOLT team reviews, validates, and categorizes each problem statement before publishing it.' },
              { title: 'Solution Submission', desc: 'Startups explore published challenges and submit innovative solutions.' },
              { title: 'Evaluation', desc: 'Domain experts evaluate submissions based on innovation, feasibility, scalability, impact, and implementation readiness.' },
              { title: 'Paid Proof of Concept', desc: 'Selected startups are invited to develop and demonstrate their solution through a paid PoC wherever applicable.' },
              { title: 'Solution Implementation', desc: 'Successful solutions are deployed with the respective department or organization, creating measurable impact for Jhansi.' },
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-[35px_25px] rounded-[15px] transition-all duration-300 border border-[#eee] hover:-translate-y-[5px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:border-[#ff2020]">
                <div className="w-[50px] h-[50px] bg-[#ff2020] text-white rounded-full flex items-center justify-center text-[1.3rem] font-extrabold mb-[20px]">
                  {idx + 1}
                </div>
                <h3 className="text-[1.15rem] font-bold mb-[10px] text-[#333]">{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section id="categories" className="py-[90px] relative bg-[#f8f9fa]">
        <div className="max-w-[1200px] mx-auto px-[20px]">
          <div className="text-center mb-[60px]">
            <h2 className={sectionHeadH2}>Problem Categories</h2>
            <p className="text-[1.1rem] max-w-[700px] mx-auto">We address challenges across 20+ domains.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[15px]">
            {[
              "🤖 Artificial Intelligence", "🏛 Smart Governance", "🏥 Healthcare", "📚 Education",
              "🌾 Agriculture", "🏭 Manufacturing", "🚗 Smart Mobility", "💧 Water Management",
              "♻️ Waste Management", "🌿 Environment", "⚡ Energy", "🛡️ Public Safety",
              "🏰 Tourism", "📦 Logistics", "💳 FinTech", "💻 Digital Services",
              "🌱 Rural Development", "🤝 Social Innovation", "👩 Women & Child", "🏢 MSME"
            ].map((cat, idx) => (
              <div key={idx} className="bg-white p-[14px_16px] rounded-[10px] border border-[#eee] text-center text-[0.9rem] font-semibold text-[#333] transition-all duration-300 hover:border-[#ff2020] hover:text-[#ff2020] hover:-translate-y-[3px]">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY JOLT SECTION --- */}
      <section id="why" className="py-[90px] relative">
        <div className="max-w-[1200px] mx-auto px-[20px]">
          <div className="text-center mb-[60px]">
            <h2 className={sectionHeadH2}>Why Choose JOLT?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {[
              { icon: '🎯', title: 'Real-World Problems', desc: 'Work on actual challenges from government and industry, not hypothetical case studies.' },
              { icon: '💰', title: 'Paid PoC Opportunities', desc: 'Selected startups receive paid proof of concept opportunities to validate and implement their solutions.' },
              { icon: '🤝', title: 'Government Validation', desc: 'Build credibility with government-backed validation and successful pilot deployments.' },
              { icon: '📈', title: 'Scale Nationally', desc: 'Successful solutions deployed in Jhansi can be replicated across cities in India.' },
              { icon: '🌟', title: 'Mentorship & Support', desc: 'Access mentorship, technical support, and market access through the innovation ecosystem.' },
              { icon: '🏆', title: 'Social Impact', desc: 'Create meaningful impact for citizens of Jhansi while building a successful business.' },
            ].map((card, idx) => (
              <div key={idx} className="bg-white p-[40px_30px] rounded-[15px] shadow-[0_5px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-[8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                <div className="w-[60px] h-[60px] bg-[rgba(255,32,32,0.1)] text-[#ff2020] rounded-full flex items-center justify-center text-[1.5rem] mb-[20px]">
                  {card.icon}
                </div>
                <h3 className="text-[1.2rem] mb-[10px] font-bold text-[#333]">{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ELIGIBILITY SECTION --- */}
      <section id="eligibility" className="py-[90px] relative bg-[#f8f9fa]">
        <div className="max-w-[1200px] mx-auto px-[20px]">
          <div className="text-center mb-[60px]">
            <h2 className={sectionHeadH2}>Who Should Participate?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[50px]">
            <div>
              <h3 className="text-[1.6rem] mb-[25px] font-bold text-[#ff2020]">Submit a problem if you are…</h3>
              <ul className="list-none p-0">
                <li className={checkListItem}>A government department with civic or administrative challenges</li>
                <li className={checkListItem}>A private industry seeking technology-driven solutions</li>
                <li className={checkListItem}>An educational institution with operational challenges</li>
                <li className={checkListItem}>A citizen with ideas to improve Jhansi</li>
                <li className={checkListItem}>Willing to conduct a Paid PoC with selected startups</li>
                <li className={checkListItem}>Committed to deploying impactful solutions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[1.6rem] mb-[25px] font-bold text-[#333]">Submit a solution if you are…</h3>
              <ul className="list-none p-0">
                <li className={checkListItem}>A startup building innovative technology products</li>
                <li className={checkListItem}>Ready to solve real-world government or industry problems</li>
                <li className={checkListItem}>Looking for customer validation and pilot opportunities</li>
                <li className={checkListItem}>Interested in market access and visibility</li>
                <li className={checkListItem}>Capable of implementing at scale</li>
                <li className={checkListItem}>Passionate about creating social and economic impact</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- FORMS SECTION --- */}
      <section id="forms" className="py-[90px] relative">
        <div className="max-w-[1200px] mx-auto px-[20px]">
          <div className="text-center mb-[60px]">
            <h2 className={sectionHeadH2}>Get Started with JOLT</h2>
            <p className="text-[1.1rem] max-w-[700px] mx-auto">Submit a problem or propose your innovative solution.</p>
          </div>

          <div className="flex justify-center gap-[15px] mb-[50px] flex-wrap">
            <button 
              onClick={() => setActiveTab('problem')} 
              className={`px-[35px] py-[14px] rounded-[50px] font-semibold text-[1rem] transition-all duration-300 border-2 border-[#ff2020] ${activeTab === 'problem' ? 'bg-[#ff2020] text-white' : 'bg-transparent text-[#ff2020] hover:bg-[#ff2020] hover:text-white'}`}
            >
              📋 Submit a Problem
            </button>
            <button 
              onClick={() => setActiveTab('solution')} 
              className={`px-[35px] py-[14px] rounded-[50px] font-semibold text-[1rem] transition-all duration-300 border-2 border-[#ff2020] ${activeTab === 'solution' ? 'bg-[#ff2020] text-white' : 'bg-transparent text-[#ff2020] hover:bg-[#ff2020] hover:text-white'}`}
            >
              🚀 Submit a Solution
            </button>
          </div>

          {/* --- TAB 1: PROBLEM FORM --- */}
          {activeTab === 'problem' && (
            <form ref={problemFormRef} onSubmit={handleProblemSubmit} className="bg-white p-[30px] md:p-[50px] rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border-t-[5px] border-[#ff2020]">
              <h2 className="text-[1.8rem] font-bold text-[#333] mb-[5px]">Problem Statement Submission</h2>
              <p className="text-[#888] mb-[10px]">Help us identify challenges that matter.</p>

              <div className={formSectionTitle}><span className={formNum}>1</span> Personal Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                <div>
                  <label className={labelClass}>Name <span className="text-[#ff2020]">*</span></label>
                  <input type="text" name="name" className={inputClass} placeholder="Full name" required />
                </div>
                <div>
                  <label className={labelClass}>Mobile Number <span className="text-[#ff2020]">*</span></label>
                  <input type="tel" name="mobile" className={inputClass} placeholder="+91 XXXXX XXXXX" pattern="^[0-9\-\+\s]{10,15}$" required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Email Address <span className="text-[#ff2020]">*</span></label>
                  <input type="email" name="email" className={inputClass} placeholder="you@example.com" required />
                </div>
              </div>

              <div className={formSectionTitle}><span className={formNum}>2</span> Problem Details</div>
              <div className="grid grid-cols-1 gap-[20px]">
                <div>
                  <label className={labelClass}>Organization/Department Name <span className="text-[#ff2020]">*</span></label>
                  <input type="text" name="orgName" className={inputClass} placeholder="Enter organization/department name" required />
                </div>
                <div>
                  <label className={labelClass}>Organization Type <span className="text-[#ff2020]">*</span></label>
                  <select name="orgType" className={inputClass} required onChange={(e) => setProbOrgType(e.target.value)}>
                    <option value="">Select type</option>
                    <option value="Government Department">Government Department</option>
                    <option value="Private Industry">Private Industry</option>
                    <option value="Educational Institution">Educational Institution</option>
                    <option value="Citizen">Citizen</option>
                    <option value="Other">Other</option>
                  </select>
                  {probOrgType === 'Other' && (
                    <input type="text" name="otherOrgType" className={`${inputClass} mt-[8px]`} placeholder="Specify other organization type..." required />
                  )}
                </div>
                <div>
                  <label className={labelClass}>Problem Title <span className="text-[#ff2020]">*</span></label>
                  <input type="text" name="title" className={inputClass} placeholder="e.g. AI-based Waste Collection Monitoring" required />
                </div>
                <div>
                  <label className={labelClass}>Problem Category <span className="text-[#ff2020]">*</span></label>
                  <select name="category" className={inputClass} required onChange={(e) => setProbCategory(e.target.value)}>
                    <option value="">Select category</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Smart City">Smart City</option>
                    <option value="Water Management">Water Management</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="Mobility">Mobility</option>
                    <option value="Environment">Environment</option>
                    <option value="Tourism">Tourism</option>
                    <option value="Energy">Energy</option>
                    <option value="Public Safety">Public Safety</option>
                    <option value="Digital Governance">Digital Governance</option>
                    <option value="MSME">MSME</option>
                    <option value="Other">Other</option>
                  </select>
                  {probCategory === 'Other' && (
                    <input type="text" name="otherCategory" className={`${inputClass} mt-[8px]`} placeholder="Specify other category..." required />
                  )}
                </div>
                <div>
                  <label className={labelClass}>Problem Description <span className="text-[#ff2020]">*</span></label>
                  <textarea name="description" className={`${inputClass} min-h-[120px]`} placeholder="Describe the challenge in detail... (500–1000 characters)" rows="5" required></textarea>
                  <div className="flex items-center gap-[10px] mt-[10px]">
                    <label className="bg-[#f0f0f0] border border-[#ddd] rounded-[8px] px-[15px] py-[8px] text-[0.85rem] text-[#ff2020] font-semibold cursor-pointer hover:bg-[#e6e6e6] transition-colors">
                      <input type="file" name="descriptionAudio" accept="audio/*" capture="microphone" className="hidden" onChange={(e) => handleAudioChange(e, 'probDescAudio')} />
                      🎤 Record / Upload Audio
                    </label>
                    {audioNames['probDescAudio'] && <span className="text-[#28a745] text-[0.85rem] font-medium">{audioNames['probDescAudio']}</span>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Current Situation <span className="text-[#aaa] font-normal">(Optional)</span></label>
                  <textarea name="currentSituation" className={`${inputClass} min-h-[120px]`} placeholder="How is this problem currently being managed?" rows="3"></textarea>
                  <div className="flex items-center gap-[10px] mt-[10px]">
                    <label className="bg-[#f0f0f0] border border-[#ddd] rounded-[8px] px-[15px] py-[8px] text-[0.85rem] text-[#ff2020] font-semibold cursor-pointer hover:bg-[#e6e6e6] transition-colors">
                      <input type="file" name="currentSituationAudio" accept="audio/*" capture="microphone" className="hidden" onChange={(e) => handleAudioChange(e, 'probCurSitAudio')} />
                      🎤 Record / Upload Audio
                    </label>
                    {audioNames['probCurSitAudio'] && <span className="text-[#28a745] text-[0.85rem] font-medium">{audioNames['probCurSitAudio']}</span>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Desired Outcome <span className="text-[#ff2020]">*</span></label>
                  <textarea name="desiredOutcome" className={`${inputClass} min-h-[120px]`} placeholder="e.g. Reduce manual inspection time by 80%." rows="3" required></textarea>
                  <div className="flex items-center gap-[10px] mt-[10px]">
                    <label className="bg-[#f0f0f0] border border-[#ddd] rounded-[8px] px-[15px] py-[8px] text-[0.85rem] text-[#ff2020] font-semibold cursor-pointer hover:bg-[#e6e6e6] transition-colors">
                      <input type="file" name="desiredOutcomeAudio" accept="audio/*" capture="microphone" className="hidden" onChange={(e) => handleAudioChange(e, 'probDesOutAudio')} />
                      🎤 Record / Upload Audio
                    </label>
                    {audioNames['probDesOutAudio'] && <span className="text-[#28a745] text-[0.85rem] font-medium">{audioNames['probDesOutAudio']}</span>}
                  </div>
                </div>
              </div>

              <div className={formSectionTitle}><span className={formNum}>3</span> Impact</div>
              <div className="mb-[20px]">
                <label className={labelClass}>Who is Affected? <span className="text-[#ff2020]">*</span></label>
                <div className="flex flex-wrap gap-[10px]">
                  {['Citizens', 'Employees', 'Customers', 'Students', 'Farmers', 'Businesses', 'Other'].map(grp => (
                    <label key={grp} className={multiCheckItem}>
                      <input type="checkbox" name="affectedGroups" value={grp} className="accent-[#ff2020]" /> {grp}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-[20px]">
                <label className={labelClass}>Estimated Impact <span className="text-[#ff2020]">*</span></label>
                <div className="flex flex-wrap gap-[12px]">
                  {['Low', 'Medium', 'High', 'Critical', 'Other'].map(imp => (
                    <label key={imp} className="flex items-center gap-[8px] text-[0.95rem] cursor-pointer">
                      <input type="radio" name="estimatedImpact" value={imp} className="accent-[#ff2020] w-[16px] h-[16px]" required /> {imp}
                    </label>
                  ))}
                </div>
              </div>

              <div className={formSectionTitle}><span className={formNum}>4</span> Preferred Solution</div>
              <div className="mb-[20px]">
                <label className={labelClass}>Are you looking for? <span className="text-[#ff2020]">*</span></label>
                <div className="flex flex-wrap gap-[10px]">
                  {['Software Solution', 'Hardware Solution', 'AI/ML Solution', 'IoT Solution', 'Mobile App', 'Process Innovation', 'Any Innovative Solution', 'Other'].map(sol => (
                    <label key={sol} className={multiCheckItem}>
                      <input type="checkbox" name="preferredSolutionTypes" value={sol} className="accent-[#ff2020]" /> {sol}
                    </label>
                  ))}
                </div>
              </div>

              <div className={formSectionTitle}><span className={formNum}>5</span> Pilot Opportunity</div>
              <div className="grid grid-cols-1 gap-[20px]">
                <div>
                  <label className={labelClass}>Willing to invest for Proof of Concept with any startup <span className="text-[#ff2020]">*</span></label>
                  <div className="flex flex-wrap gap-[12px]">
                    <label className="flex items-center gap-[8px] text-[0.95rem] cursor-pointer">
                      <input type="radio" name="willingToInvest" value="true" className="accent-[#ff2020] w-[16px] h-[16px]" required /> Yes
                    </label>
                    <label className="flex items-center gap-[8px] text-[0.95rem] cursor-pointer">
                      <input type="radio" name="willingToInvest" value="false" className="accent-[#ff2020] w-[16px] h-[16px]" required /> No
                    </label>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Expected Implementation Timeline <span className="text-[#ff2020]">*</span></label>
                  <select name="implementationTimeline" className={inputClass} required>
                    <option value="">Select timeline</option>
                    <option value="Immediate (<1 Month)">Immediate (&lt;1 Month)</option>
                    <option value="1–3 Months">1–3 Months</option>
                    <option value="3–6 Months">3–6 Months</option>
                    <option value="More than 6 Months">More than 6 Months</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className={formSectionTitle}><span className={formNum}>6</span> Attachments <span className="text-[0.85rem] font-normal text-[#aaa] ml-[5px]">(Optional)</span></div>
              <div 
                className="border-2 border-dashed border-[#ddd] rounded-[12px] p-[30px] text-center cursor-pointer transition-colors bg-[#fafafa] hover:border-[#ff2020]"
                onClick={() => probFileRef.current && probFileRef.current.click()}
              >
                <div className="text-[2rem]">📎</div>
                <p className={`mt-[10px] ${probFileName ? 'text-[#ff2020] font-semibold' : 'text-[#888] text-[0.95rem]'}`}>
                  {probFileName ? probFileName : "Upload Images, Reports, SOPs, PDFs, Videos"}
                </p>
                {!probFileName && <p className="text-[0.82rem] mt-[5px] text-[#888]">Click to browse files</p>}
                <input 
                  type="file" 
                  name="attachments" 
                  multiple 
                  className="hidden" 
                  ref={probFileRef}
                  onChange={(e) => setProbFileName(e.target.files.length > 0 ? `${e.target.files.length} file(s) selected` : '')}
                />
              </div>

              <div className={formSectionTitle}><span className={formNum}>7</span> Additional Information</div>
              <div className="mb-[20px]">
                <label className={labelClass}>Anything else startups should know?</label>
                <textarea name="additionalInfo" className={`${inputClass} min-h-[120px]`} placeholder="Add any additional context or notes..." rows="4"></textarea>
              </div>

              <div className={formSectionTitle}><span className={formNum}>8</span> Declaration</div>
              <div className="flex flex-col gap-[12px] mb-[30px]">
                <label className="flex items-start gap-[10px] text-[0.95rem] cursor-pointer">
                  <input type="checkbox" name="declaration1" value="true" className="w-[18px] h-[18px] mt-[2px] shrink-0 accent-[#ff2020]" required />
                  <span>I confirm that the information provided is accurate to the best of my knowledge.</span>
                </label>
                <label className="flex items-start gap-[10px] text-[0.95rem] cursor-pointer">
                  <input type="checkbox" name="declaration2" value="true" className="w-[18px] h-[18px] mt-[2px] shrink-0 accent-[#ff2020]" required />
                  <span>I agree that this problem statement may be published on the JOLT platform for startups.</span>
                </label>
              </div>

              <div className="text-center mt-[40px]">
                <button type="submit" disabled={isSubmitting} className={btnPrimary}>
                  {isSubmitting ? (
                    <><span className="inline-block w-[16px] h-[16px] border-2 border-white/30 border-t-white rounded-full animate-spin mr-[8px] align-middle"></span> Processing...</>
                  ) : "Submit Problem Statement"}
                </button>
              </div>
            </form>
          )}

          {/* --- TAB 2: SOLUTION FORM --- */}
          {activeTab === 'solution' && (
            <form ref={solutionFormRef} onSubmit={handleSolutionSubmit} className="bg-white p-[30px] md:p-[50px] rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border-t-[5px] border-[#ff2020]">
              <h2 className="text-[1.8rem] font-bold text-[#333] mb-[5px]">Startup Solution Submission</h2>
              <p className="text-[#888] mb-[10px]">Turn your innovation into real-world impact.</p>

              {/* Toggle Startup/Individual */}
              <div className="mt-[20px] bg-[#f8f9fa] p-[20px] rounded-[10px] border border-[#eee] mb-[20px]">
                <label className="text-[1.1rem] font-semibold text-[#333] mb-[10px] block">Submit Solution As <span className="text-[#ff2020]">*</span></label>
                <div className="flex flex-wrap gap-[15px]">
                  <label className="flex items-center gap-[8px] text-[0.95rem] cursor-pointer">
                    <input type="radio" name="solutionType" value="Individual" checked={solutionSubmitType === 'Individual'} onChange={() => setSolutionSubmitType('Individual')} className="accent-[#ff2020] w-[16px] h-[16px]" /> 1. Individual
                  </label>
                  <label className="flex items-center gap-[8px] text-[0.95rem] cursor-pointer">
                    <input type="radio" name="solutionType" value="Startup" checked={solutionSubmitType === 'Startup'} onChange={() => setSolutionSubmitType('Startup')} className="accent-[#ff2020] w-[16px] h-[16px]" /> 2. Startup
                  </label>
                </div>
              </div>

              <div className={formSectionTitle}>
                <span className={formNum}>1</span> {solutionSubmitType === 'Startup' ? 'Startup Details' : 'Personal Details'}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                {solutionSubmitType === 'Individual' ? (
                  <>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Name <span className="text-[#ff2020]">*</span></label>
                      <input type="text" name="name" className={inputClass} placeholder="Full name" required />
                    </div>
                    <div>
                      <label className={labelClass}>Mobile Number <span className="text-[#ff2020]">*</span></label>
                      <input type="tel" name="mobile" className={inputClass} placeholder="+91 XXXXX XXXXX" pattern="^[0-9\-\+\s]{10,15}$" required />
                    </div>
                    <div>
                      <label className={labelClass}>Email ID <span className="text-[#ff2020]">*</span></label>
                      <input type="email" name="email" className={inputClass} placeholder="you@example.com" required />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className={labelClass}>Startup Name <span className="text-[#ff2020]">*</span></label>
                      <input type="text" name="startupName" className={inputClass} placeholder="Your startup name" required />
                    </div>
                    <div>
                      <label className={labelClass}>Startup Stage <span className="text-[#ff2020]">*</span></label>
                      <select name="startupStage" className={inputClass} required>
                        <option value="">Select stage</option>
                        <option value="Idea">Idea</option>
                        <option value="Prototype">Prototype</option>
                        <option value="MVP">MVP</option>
                        <option value="Early Revenue">Early Revenue</option>
                        <option value="Growth Stage">Growth Stage</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Founder / Contact Person <span className="text-[#ff2020]">*</span></label>
                      <input type="text" name="name" className={inputClass} placeholder="Full name" required />
                    </div>
                    <div>
                      <label className={labelClass}>Designation</label>
                      <input type="text" name="designation" className={inputClass} placeholder="Your designation" />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address <span className="text-[#ff2020]">*</span></label>
                      <input type="email" name="email" className={inputClass} placeholder="you@startup.com" required />
                    </div>
                    <div>
                      <label className={labelClass}>Mobile Number <span className="text-[#ff2020]">*</span></label>
                      <input type="tel" name="mobile" className={inputClass} placeholder="+91 XXXXX XXXXX" pattern="^[0-9\-\+\s]{10,15}$" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Website</label>
                      <input type="url" name="website" className={inputClass} placeholder="https://yourstartup.com" />
                    </div>
                  </>
                )}
              </div>

              {solutionSubmitType === 'Startup' && (
                <div>
                  <div className={formSectionTitle}><span className={formNum}>2</span> Startup Profile</div>
                  <div className="grid grid-cols-1 gap-[20px]">
                    <div>
                      <label className={labelClass}>Brief About Your Startup <span className="text-[#ff2020]">*</span></label>
                      <textarea name="aboutStartup" className={`${inputClass} min-h-[120px]`} placeholder="Tell us about your startup, what you build, and your mission... (250–500 words)" rows="6" required></textarea>
                    </div>
                    <div>
                      <label className={labelClass}>Sector / Industry <span className="text-[#ff2020]">*</span></label>
                      <select name="sector" className={inputClass} required onChange={(e) => setSolSector(e.target.value)}>
                        <option value="">Select sector</option>
                        <option value="AI / Machine Learning">AI / Machine Learning</option>
                        <option value="SaaS">SaaS</option>
                        <option value="IoT">IoT</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Agritech">Agritech</option>
                        <option value="EdTech">EdTech</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Smart City">Smart City</option>
                        <option value="CleanTech">CleanTech</option>
                        <option value="FinTech">FinTech</option>
                        <option value="Robotics">Robotics</option>
                        <option value="Other">Other</option>
                      </select>
                      {solSector === 'Other' && (
                        <input type="text" name="otherSector" className={`${inputClass} mt-[8px]`} placeholder="Specify other sector..." required />
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className={formSectionTitle}><span className={formNum}>{2 + numOffset}</span> Problem Statement</div>
              <div className="mb-[20px]">
                <label className={labelClass}>Select a Problem Statement to solve <span className="text-[#ff2020]">*</span></label>
                <select name="problemStatementRef" className={inputClass} required>
                  <option value="">-- Select a Problem Statement --</option>
                  {problemsList.length > 0 ? (
                    problemsList.map((p, i) => (
                      <option key={i} value={p.title || p.problemTitle}>{p.title || p.problemTitle}</option>
                    ))
                  ) : (
                    <option value="" disabled>No approved problems available right now</option>
                  )}
                </select>
              </div>

              <div className={formSectionTitle}><span className={formNum}>{3 + numOffset}</span> Proposed Solution</div>
              <div className="grid grid-cols-1 gap-[20px]">
                <div>
                  <label className={labelClass}>Solution Title <span className="text-[#ff2020]">*</span></label>
                  <input type="text" name="solutionTitle" className={inputClass} placeholder="Give your solution a clear title" required />
                </div>
                <div>
                  <label className={labelClass}>Describe Your Solution <span className="text-[#ff2020]">*</span></label>
                  <textarea name="description" className={`${inputClass} min-h-[120px]`} placeholder="Explain how your solution addresses the problem..." rows="5" required></textarea>
                </div>
                <div>
                  <label className={labelClass}>What makes your solution unique? <span className="text-[#ff2020]">*</span></label>
                  <textarea name="uniqueValue" className={`${inputClass} min-h-[120px]`} placeholder="What differentiates your approach from existing solutions?" rows="4" required></textarea>
                </div>
                <div>
                  <label className={labelClass}>Technology to be Used</label>
                  <div className="flex flex-wrap gap-[10px]">
                    {['AI/ML', 'Computer Vision', 'IoT', 'Mobile App', 'Cloud', 'Robotics', 'Blockchain', 'Data Analytics', 'Hardware', 'Other'].map(tech => (
                      <label key={tech} className={multiCheckItem}>
                        <input type="checkbox" name="technologies" value={tech} className="accent-[#ff2020]" /> {tech}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={formSectionTitle}><span className={formNum}>{4 + numOffset}</span> Readiness</div>
              <div className="mb-[20px]">
                <label className={labelClass}>Has this or similar solution been implemented before? <span className="text-[#ff2020]">*</span></label>
                <div className="flex flex-wrap gap-[12px]">
                  <label className="flex items-center gap-[8px] text-[0.95rem] cursor-pointer">
                    <input type="radio" name="previouslyImplemented" value="true" onChange={(e) => setSolPrevImplemented(e.target.value)} className="accent-[#ff2020] w-[16px] h-[16px]" required /> Yes
                  </label>
                  <label className="flex items-center gap-[8px] text-[0.95rem] cursor-pointer">
                    <input type="radio" name="previouslyImplemented" value="false" onChange={(e) => setSolPrevImplemented(e.target.value)} className="accent-[#ff2020] w-[16px] h-[16px]" required /> No
                  </label>
                </div>
              </div>
              
              {solPrevImplemented === 'true' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] mb-[20px] bg-[#fafafa] p-[20px] rounded-[10px] border border-[#eee]">
                  <div className="md:col-span-2">
                    <label className={labelClass}>Current Development Stage <span className="text-[#ff2020]">*</span></label>
                    <select name="developmentStage" className={inputClass} onChange={(e) => setSolDevStage(e.target.value)} required>
                      <option value="">Select stage</option>
                      <option value="Concept">Concept</option>
                      <option value="Prototype Ready">Prototype Ready</option>
                      <option value="MVP Ready">MVP Ready</option>
                      <option value="Market Ready">Market Ready</option>
                      <option value="Already Deployed">Already Deployed</option>
                      <option value="Other">Other</option>
                    </select>
                    {solDevStage === 'Other' && (
                      <input type="text" name="otherDevStage" className={`${inputClass} mt-[8px]`} placeholder="Specify other stage..." required />
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Client Name <span className="text-[#aaa] font-normal">(If previously implemented)</span></label>
                    <input type="text" name="clientName" className={inputClass} placeholder="Previous client name" />
                  </div>
                  <div>
                    <label className={labelClass}>Brief Outcome</label>
                    <input type="text" name="briefOutcome" className={inputClass} placeholder="Key result from previous implementation" />
                  </div>
                </div>
              )}

              <div className={formSectionTitle}><span className={formNum}>{5 + numOffset}</span> Implementation Plan</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                <div>
                  <label className={labelClass}>Estimated PoC Duration <span className="text-[#ff2020]">*</span></label>
                  <select name="pocDuration" className={inputClass} onChange={(e) => setSolPocDuration(e.target.value)} required>
                    <option value="">Select duration</option>
                    <option value="Less than 1 Month">Less than 1 Month</option>
                    <option value="1–3 Months">1–3 Months</option>
                    <option value="3–6 Months">3–6 Months</option>
                    <option value="More than 6 Months">More than 6 Months</option>
                    <option value="Other">Other</option>
                  </select>
                  {solPocDuration === 'Other' && (
                    <input type="text" name="otherPocDuration" className={`${inputClass} mt-[8px]`} placeholder="Specify other duration..." required />
                  )}
                </div>
                <div>
                  <label className={labelClass}>Team Members for this Project <span className="text-[#ff2020]">*</span></label>
                  <input type="number" name="teamMembers" className={inputClass} placeholder="Number of people involved" min="1" required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Expected Outcomes <span className="text-[#ff2020]">*</span></label>
                  <textarea name="expectedOutcomes" className={`${inputClass} min-h-[120px]`} placeholder="What measurable results do you expect from this implementation?" rows="4" required></textarea>
                </div>
              </div>

              <div className={formSectionTitle}><span className={formNum}>{6 + numOffset}</span> Attachments <span className="text-[0.85rem] font-normal text-[#aaa] ml-[5px]">(Optional)</span></div>
              <div 
                className="border-2 border-dashed border-[#ddd] rounded-[12px] p-[30px] text-center cursor-pointer transition-colors bg-[#fafafa] hover:border-[#ff2020]"
                onClick={() => solFileRef.current && solFileRef.current.click()}
              >
                <div className="text-[2rem]">📁</div>
                <p className={`mt-[10px] ${solFileName ? 'text-[#ff2020] font-semibold' : 'text-[#888] text-[0.95rem]'}`}>
                  {solFileName ? solFileName : "Upload Pitch Deck, Product Brochure, Demo Video, Screenshots, Case Studies"}
                </p>
                {!solFileName && <p className="text-[0.82rem] mt-[5px] text-[#888]">Click to browse files</p>}
                <input 
                  type="file" 
                  name="attachments" 
                  multiple 
                  className="hidden" 
                  ref={solFileRef}
                  onChange={(e) => setSolFileName(e.target.files.length > 0 ? `${e.target.files.length} file(s) selected` : '')}
                />
              </div>

              <div className={formSectionTitle}><span className={formNum}>{7 + numOffset}</span> Additional Information</div>
              <div className="mb-[20px]">
                <label className={labelClass}>Anything else you'd like the evaluation committee to know?</label>
                <textarea name="additionalInfo" className={`${inputClass} min-h-[120px]`} placeholder="Add any additional context, links, or notes..." rows="4"></textarea>
              </div>

              <div className={formSectionTitle}><span className={formNum}>{8 + numOffset}</span> Declaration</div>
              <div className="flex flex-col gap-[12px] mb-[30px]">
                <label className="flex items-start gap-[10px] text-[0.95rem] cursor-pointer">
                  <input type="checkbox" name="declaration1" className="w-[18px] h-[18px] mt-[2px] shrink-0 accent-[#ff2020]" required />
                  <span>I certify that the information provided is true and accurate.</span>
                </label>
                <label className="flex items-start gap-[10px] text-[0.95rem] cursor-pointer">
                  <input type="checkbox" name="declaration2" className="w-[18px] h-[18px] mt-[2px] shrink-0 accent-[#ff2020]" required />
                  <span>I understand that submission of this proposal does not guarantee selection.</span>
                </label>
                <label className="flex items-start gap-[10px] text-[0.95rem] cursor-pointer">
                  <input type="checkbox" name="declaration3" className="w-[18px] h-[18px] mt-[2px] shrink-0 accent-[#ff2020]" required />
                  <span>I agree that JOLT may share this proposal with the respective problem owner for evaluation.</span>
                </label>
              </div>

              <div className="text-center mt-[40px]">
                <button type="submit" disabled={isSubmitting} className={btnPrimary}>
                  {isSubmitting ? (
                    <><span className="inline-block w-[16px] h-[16px] border-2 border-white/30 border-t-white rounded-full animate-spin mr-[8px] align-middle"></span> Processing...</>
                  ) : "Submit Solution"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-[90px] relative bg-[#f8f9fa]">
        <div className="max-w-[1200px] mx-auto px-[20px]">
          <div className="bg-[#333] rounded-[20px] p-[50px_30px] md:p-[80px_40px] text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute w-[300px] h-[300px] bg-[#ff2020] rounded-full opacity-10 top-[-100px] right-[-50px]"></div>
            <h2 className="text-[2.2rem] font-bold mb-[20px] relative z-10">Be Part of Jhansi's Innovation Movement</h2>
            <p className="mb-[40px] text-[#e0e0e0] max-w-[650px] mx-auto text-[1.1rem] relative z-10">
              JOLT is more than a problem repository — it's a collaborative platform where government, industry, citizens, and startups come together to build smarter, more efficient solutions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-[15px] relative z-10">
              <button onClick={() => { setActiveTab('problem'); document.getElementById('forms').scrollIntoView({behavior: 'smooth'})}} className="inline-block px-[40px] py-[15px] rounded-[50px] font-semibold text-[1rem] transition-all duration-300 bg-white text-[#ff2020] hover:bg-gray-100 hover:-translate-y-[3px]">
                Submit a Problem
              </button>
              <button onClick={() => { setActiveTab('solution'); document.getElementById('forms').scrollIntoView({behavior: 'smooth'})}} className={btnPrimary}>
                Submit a Solution
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CUSTOM TOAST NOTIFICATION --- */}
      {toast.show && (
        <div className="fixed bottom-[30px] right-[30px] z-[99999] flex flex-col gap-[10px] animate-fade-in-up">
          <div className={`px-[25px] py-[15px] rounded-[8px] text-white font-semibold text-[0.95rem] shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${toast.type === 'error' ? 'bg-[#dc3545]' : 'bg-[#28a745]'}`}>
            {toast.message}
          </div>
        </div>
      )}
      
      {/* ADD CUSTOM ANIMATION KEYFRAMES TO DOCUMENT */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}