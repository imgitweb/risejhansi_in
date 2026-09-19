import React, { useState, useEffect } from 'react';
import { Mic, UploadCloud, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// LOCAL IMAGE IMPORT
import yogiji from '../img/yogiji.jpeg';

const API_BASE_URL = 'https://www.incubationmasters.com/api/jolt';

export default function JoltLandingPage() {
  const [activeTab, setActiveTab] = useState('problem');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [problemsList, setProblemsList] = useState([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState(true);

  // Form states for dynamic fields - Problem Form
  const [orgType, setOrgType] = useState('');
  const [problemCategory, setProblemCategory] = useState('');
  const [implementationTimeline, setImplementationTimeline] = useState('');
  const [isSubmittingProblem, setIsSubmittingProblem] = useState(false);

  // Form states for dynamic fields - Solution Form
  const [submitAs, setSubmitAs] = useState('Startup');
  const [sector, setSector] = useState('');
  const [previouslyImplemented, setPreviouslyImplemented] = useState('');
  const [developmentStage, setDevelopmentStage] = useState('');
  const [pocDuration, setPocDuration] = useState('');
  const [isSubmittingSolution, setIsSubmittingSolution] = useState(false);

  // File states for UI feedback
  const [problemFiles, setProblemFiles] = useState([]);
  const [solutionFiles, setSolutionFiles] = useState([]);

  // Fetch Problems on mount
  useEffect(() => {
    fetchAvailableProblems();
  }, []);

  const fetchAvailableProblems = async () => {
    setIsLoadingProblems(true);
    try {
      const response = await fetch(`${API_BASE_URL}/problems`);
      if (!response.ok) throw new Error('Failed to fetch');
      const json = await response.json();
      if (json.success && json.data) {
        setProblemsList(json.data);
      }
   } catch (error) {
      console.error('Error fetching problems:', error);
      setProblemsList([
        { _id: 'mock_1', title: 'AI-based Waste Collection' },
        { _id: 'mock_2', title: 'Smart Traffic Management' },
        { _id: 'mock_3', title: 'Healthcare Data Digitization' }
      ]);
    } finally {
      setIsLoadingProblems(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // ---------------------------------------------
  // PROBLEM SUBMIT HANDLER
  // ---------------------------------------------
  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    const affectedGroups = form.querySelectorAll('input[name="affectedGroups"]:checked');
    const solutionTypes = form.querySelectorAll('input[name="preferredSolutionTypes"]:checked');
    if (affectedGroups.length === 0) return showToast("Please select at least one affected group.", "error");
    if (solutionTypes.length === 0) return showToast("Please select at least one preferred solution type.", "error");

    setIsSubmittingProblem(true);
    const formData = new FormData(form);

    try {
      const response = await fetch(`${API_BASE_URL}/problems`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Problem Statement submitted successfully!", "success");
        form.reset();
        setOrgType('');
        setProblemCategory('');
        setImplementationTimeline('');
        setProblemFiles([]);
        fetchAvailableProblems();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      showToast(error.message || "Failed to submit. Please try again later.", "error");
    } finally {
      setIsSubmittingProblem(false);
    }
  };

  // ---------------------------------------------
  // SOLUTION SUBMIT HANDLER
  // ---------------------------------------------
  const handleSolutionSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    setIsSubmittingSolution(true);
    const formData = new FormData(form);

    const selectedTitle = formData.get('problemStatementRef');
    const matchedProblem = problemsList.find(p => (p.title || p.problemTitle) === selectedTitle);
    
    if (matchedProblem) {
      formData.set('problemStatementId', matchedProblem._id);
    } else {
      setIsSubmittingSolution(false);
      return showToast("Please select a valid problem statement from the list.", "error");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/solutions`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showToast("Solution submitted successfully!", "success");
        form.reset();
        setSubmitAs('Startup');
        setSector('');
        setPreviouslyImplemented('');
        setDevelopmentStage('');
        setPocDuration('');
        setSolutionFiles([]);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (error) {
      showToast(error.message || "Failed to submit. Please try again later.", "error");
    } finally {
      setIsSubmittingSolution(false);
    }
  };

  // REUSABLE COMPONENTS
  const SectionHeading = ({ title, subtitle }) => (
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-[#333333] mb-4 relative inline-block after:content-[''] after:block after:w-16 after:h-1.5 after:bg-[#ff2020] after:mx-auto after:mt-3 after:rounded-full">
        {title}
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );

  const InputLabel = ({ title, required = false }) => (
    <label className="block text-[0.92rem] font-semibold text-[#333333] mb-2">
      {title} {required && <span className="text-[#ff2020] ml-0.5">*</span>}
    </label>
  );

  const inputClasses = "w-full p-3 border-2 border-gray-200 rounded-xl font-sans text-[0.95rem] text-[#333333] bg-[#fdfdfd] focus:border-[#ff2020] focus:bg-white outline-none transition-colors";

  return (
    <div className="font-sans text-gray-600 overflow-x-hidden bg-white leading-relaxed">
      
      {/* Sticky Apply Button */}
      <a href="#forms" className="fixed top-44 right-5 z-50 bg-[#ff2020] text-white px-6 py-3 rounded-full font-bold shadow-xl border-2 border-white flex items-center gap-2 hover:-translate-y-1 transition-transform">
        Join the Mission
      </a>

      {/* HERO SECTION */}
      <section id="home" className="bg-gradient-to-br from-[#fff5f5] to-white pt-12 pb-24 px-5">
        <div className="max-w-7xl mx-auto">
          
          {/* IMPORTED POSTER / IMAGE HERE */}
          <div className="relative text-center pt-20 pb-10">
            <img 
              src={yogiji} 
              alt="JOLT Banner" 
              className="w-full h-auto rounded-xl mx-auto block max-w-5xl shadow-md object-cover" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#333333] mb-6">
                Transforming <br />
                <span className="text-[#ff2020] relative inline-block">
                  Problems into
                  <span className="absolute bottom-1 left-0 w-full h-4 bg-yellow-300 opacity-30 -z-10"></span>
                </span><br />
                Startup Solutions
              </h1>
              <p className="text-lg text-gray-600 mb-10">
                JOLT – Jhansi Open Lab for Technology is an open innovation platform by Jhansi Smart City that connects real-world challenges with innovative startups capable of building impactful solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#forms" className="bg-[#ff2020] text-white px-8 py-3.5 rounded-full font-semibold shadow-[0_10px_20px_rgba(255,32,32,0.2)] border-2 border-[#ff2020] hover:bg-transparent hover:text-[#ff2020] hover:-translate-y-1 transition-all text-center">
                  Submit a Problem
                </a>
                <a href="#about" className="border-2 border-[#333333] text-[#333333] px-8 py-3.5 rounded-full font-semibold hover:bg-[#333333] hover:text-white transition-all text-center">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="About JOLT" subtitle="Every challenge is an opportunity to innovate." />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { num: '20+', label: 'Problem Categories' },
              { num: '6', label: 'Stage Process' },
              { num: '4', label: 'Submitter Types' },
              { num: '∞', label: 'Impact Potential' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-b-4 border-[#ff2020]">
                <span className="block text-4xl font-extrabold text-[#ff2020] mb-2">{stat.num}</span>
                <span className="text-sm font-semibold uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="bg-white p-10 md:p-14 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border-l-8 border-[#ff2020]">
            <h3 className="text-2xl font-bold text-[#333333] mb-5">What is JOLT?</h3>
            <p className="text-lg mb-4">
              JOLT is an open innovation platform by Jhansi Smart City that connects real-world problems from government departments, private industries, institutions, and citizens with innovative startups capable of building impactful solutions.
            </p>
            <p className="text-lg">
              Instead of letting challenges remain unresolved, JOLT creates a structured ecosystem where organizations can publish their problem statements and startups can submit innovative, scalable, and implementable solutions. Cities, industries, and institutions face hundreds of operational and strategic challenges every day — JOLT bridges this gap.
            </p>
          </div>
        </div>
      </section>

      {/* FOCUS GRID SECTION */}
      <section id="who" className="py-24 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Who Can Submit Problem Statements?" subtitle="We welcome challenges from all sectors of society." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🏛', title: 'Government Departments', desc: 'Share civic, administrative, infrastructure, healthcare, education, transport, sanitation, agriculture, water, energy, or public service challenges.' },
              { icon: '🏭', title: 'Private Industries', desc: 'Publish manufacturing, automation, AI, sustainability, HR, logistics, quality control, digital transformation, and operational challenges.' },
              { icon: '🏢', title: 'Educational Institutions', desc: 'Submit challenges related to campus management, student engagement, learning technologies, research, and administration.' },
              { icon: '👥', title: 'Citizens', desc: 'Have an idea to improve Jhansi? Report civic issues or suggest opportunities where technology and innovation can make life better.' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:border-[#ff2020] transition-all">
                <h3 className="text-xl font-bold text-[#333333] mb-3">{card.icon} {card.title}</h3>
                <p className="text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="How JOLT Works" subtitle="A structured 6-step process from problem to solution." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Problem Identification', desc: 'Government departments, industries, institutions, and citizens submit real-world challenges.' },
              { title: 'Problem Review', desc: 'The JOLT team reviews, validates, and categorizes each problem statement before publishing it.' },
              { title: 'Solution Submission', desc: 'Startups explore published challenges and submit innovative solutions.' },
              { title: 'Evaluation', desc: 'Domain experts evaluate submissions based on innovation, feasibility, scalability, impact, and implementation readiness.' },
              { title: 'Paid Proof of Concept', desc: 'Selected startups are invited to develop and demonstrate their solution through a paid PoC wherever applicable.' },
              { title: 'Solution Implementation', desc: 'Successful solutions are deployed with the respective department or organization, creating measurable impact for Jhansi.' }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] hover:border-[#ff2020] transition-all relative">
                <div className="w-12 h-12 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-xl font-extrabold mb-5">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-[#333333] mb-3">{step.title}</h3>
                <p className="text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-24 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Problem Categories" subtitle="We address challenges across 20+ domains." />
          <div className="flex flex-wrap justify-center gap-4">
            {['🤖 Artificial Intelligence', '🏛 Smart Governance', '🏥 Healthcare', '📚 Education', '🌾 Agriculture', '🏭 Manufacturing', '🚗 Smart Mobility', '💧 Water Management', '♻️ Waste Management', '🌿 Environment', '⚡ Energy', '🛡️ Public Safety', '🏰 Tourism', '📦 Logistics', '💳 FinTech', '💻 Digital Services', '🌱 Rural Development', '🤝 Social Innovation', '👩 Women & Child', '🏢 MSME'].map((cat, i) => (
              <div key={i} className="bg-white px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#333333] hover:border-[#ff2020] hover:text-[#ff2020] hover:-translate-y-1 transition-all cursor-default">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY JOLT */}
      <section id="why" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Why Choose JOLT?" subtitle="" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Real-World Problems', desc: 'Work on actual challenges from government and industry, not hypothetical case studies.' },
              { icon: '💰', title: 'Paid PoC Opportunities', desc: 'Selected startups receive paid proof of concept opportunities to validate and implement their solutions.' },
              { icon: '🤝', title: 'Government Validation', desc: 'Build credibility with government-backed validation and successful pilot deployments.' },
              { icon: '📈', title: 'Scale Nationally', desc: 'Successful solutions deployed in Jhansi can be replicated across cities in India.' },
              { icon: '🌟', title: 'Mentorship & Support', desc: 'Access mentorship, technical support, and market access through the innovation ecosystem.' },
              { icon: '🏆', title: 'Social Impact', desc: 'Create meaningful impact for citizens of Jhansi while building a successful business.' }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.03)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all">
                <div className="w-16 h-16 bg-red-50 text-[#ff2020] text-3xl rounded-full flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">{feature.title}</h3>
                <p className="text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ELIGIBILITY */}
      <section id="eligibility" className="py-24 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <SectionHeading title="Who Should Participate?" subtitle="" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold text-[#ff2020] mb-8">Submit a problem if you are…</h3>
              <ul className="space-y-4">
                {[
                  'A government department with civic or administrative challenges',
                  'A private industry seeking technology-driven solutions',
                  'An educational institution with operational challenges',
                  'A citizen with ideas to improve Jhansi',
                  'Willing to conduct a Paid PoC with selected startups',
                  'Committed to deploying impactful solutions'
                ].map((item, i) => (
                  <li key={i} className="relative pl-8 text-lg">
                    <span className="absolute left-0 top-0.5 text-[#ff2020] font-black">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#333333] mb-8">Submit a solution if you are…</h3>
              <ul className="space-y-4">
                {[
                  'A startup building innovative technology products',
                  'Ready to solve real-world government or industry problems',
                  'Looking for customer validation and pilot opportunities',
                  'Interested in market access and visibility',
                  'Capable of implementing at scale',
                  'Passionate about creating social and economic impact'
                ].map((item, i) => (
                  <li key={i} className="relative pl-8 text-lg">
                    <span className="absolute left-0 top-0.5 text-[#ff2020] font-black">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FORMS SECTION */}
      <section id="forms" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <SectionHeading title="Get Started with JOLT" subtitle="Submit a problem or propose your innovative solution." />

          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-8 py-3.5 rounded-full font-semibold border-2 border-[#ff2020] transition-all ${
                activeTab === 'problem' ? 'bg-[#ff2020] text-white' : 'bg-transparent text-[#ff2020] hover:bg-[#ff2020] hover:text-white'
              }`}
            >
              📋 Submit a Problem
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`px-8 py-3.5 rounded-full font-semibold border-2 border-[#ff2020] transition-all ${
                activeTab === 'solution' ? 'bg-[#ff2020] text-white' : 'bg-transparent text-[#ff2020] hover:bg-[#ff2020] hover:text-white'
              }`}
            >
              🚀 Submit a Solution
            </button>
          </div>

          {/* PROBLEM FORM */}
          {activeTab === 'problem' && (
            <form onSubmit={handleProblemSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border-t-8 border-[#ff2020]">
              <h2 className="text-3xl font-bold text-[#333333] mb-2">Problem Statement Submission</h2>
              <p className="text-gray-500 mb-8">Help us identify challenges that matter.</p>

              {/* 1. Personal Details */}
              <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">1</span>
                Personal Details
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <InputLabel title="Name" required />
                  <input type="text" name="name" placeholder="Full name" required className={inputClasses} />
                </div>
                <div>
                  <InputLabel title="Mobile Number" required />
                  <input type="tel" name="mobile" placeholder="+91 XXXXX XXXXX" pattern="^[0-9\-\+\s]{10,15}$" required className={inputClasses} />
                </div>
                <div className="md:col-span-2">
                  <InputLabel title="Email Address" required />
                  <input type="email" name="email" placeholder="you@example.com" required className={inputClasses} />
                </div>
              </div>

              {/* 2. Problem Details */}
              <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">2</span>
                Problem Details
              </div>
              <div className="space-y-6">
                <div>
                  <InputLabel title="Organization/Department" required />
                  <input type="text" name="orgName" placeholder="Enter organization/department name" required className={inputClasses} />
                </div>
                
                <div>
                  <InputLabel title="Organization Type" required />
                  <select name="orgType" value={orgType} onChange={(e) => setOrgType(e.target.value)} required className={inputClasses}>
                    <option value="">Select type</option>
                    <option value="Government Department">Government Department</option>
                    <option value="Private Industry">Private Industry</option>
                    <option value="Educational Institution">Educational Institution</option>
                    <option value="Citizen">Citizen</option>
                    <option value="Other">Other</option>
                  </select>
                  {orgType === 'Other' && (
                    <input type="text" name="otherOrgType" placeholder="Please specify other organization type..." required className={`mt-3 ${inputClasses}`} />
                  )}
                </div>

                <div>
                  <InputLabel title="Problem Title" required />
                  <input type="text" name="title" placeholder="e.g. AI-based Waste Collection Monitoring" required className={inputClasses} />
                </div>

                <div>
                  <InputLabel title="Problem Category" required />
                  <select name="category" value={problemCategory} onChange={(e) => setProblemCategory(e.target.value)} required className={inputClasses}>
                    <option value="">Select category</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Smart City">Smart City</option>
                    <option value="Other">Other</option>
                  </select>
                  {problemCategory === 'Other' && (
                    <input type="text" name="otherCategory" placeholder="Please specify other category..." required className={`mt-3 ${inputClasses}`} />
                  )}
                </div>

                <div>
                  <InputLabel title="Problem Description (500-1000 chars)" required />
                  <textarea name="description" placeholder="Describe the challenge in detail..." rows="5" required className={inputClasses}></textarea>
                  <label className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-[#ff2020] font-semibold cursor-pointer hover:bg-gray-200 transition-colors">
                    <Mic className="w-4 h-4" /> Record / Upload Audio
                    <input type="file" name="descriptionAudio" accept="audio/*" capture="microphone" className="hidden" />
                  </label>
                </div>

                <div>
                  <InputLabel title="Current Situation (Optional)" />
                  <textarea name="currentSituation" placeholder="How is this problem currently being managed?" rows="3" className={inputClasses}></textarea>
                </div>

                <div>
                  <InputLabel title="Desired Outcome" required />
                  <textarea name="desiredOutcome" placeholder="e.g. Reduce manual inspection time by 80%." rows="3" required className={inputClasses}></textarea>
                </div>
              </div>

              {/* 3. Impact */}
              <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">3</span>
                Impact
              </div>
              <div className="space-y-6">
                <div>
                  <InputLabel title="Who is Affected?" required />
                  <div className="flex flex-wrap gap-3">
                    {['Citizens', 'Employees', 'Customers', 'Students', 'Farmers', 'Businesses', 'Other'].map((group) => (
                      <label key={group} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 cursor-pointer hover:border-[#ff2020] hover:text-[#ff2020] transition-colors text-sm">
                        <input type="checkbox" name="affectedGroups" value={group} className="accent-[#ff2020]" /> {group}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <InputLabel title="Estimated Impact" required />
                  <div className="flex flex-wrap gap-4">
                    {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                      <label key={level} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="estimatedImpact" value={level} required className="w-4 h-4 accent-[#ff2020]" /> {level}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Preferred Solution */}
              <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">4</span>
                Preferred Solution
              </div>
              <div>
                <InputLabel title="Are you looking for?" required />
                <div className="flex flex-wrap gap-3">
                  {['Software Solution', 'Hardware Solution', 'AI/ML Solution', 'IoT Solution', 'Mobile App', 'Process Innovation', 'Any Innovative Solution'].map((type) => (
                    <label key={type} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 cursor-pointer hover:border-[#ff2020] hover:text-[#ff2020] transition-colors text-sm">
                      <input type="checkbox" name="preferredSolutionTypes" value={type} className="accent-[#ff2020]" /> {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Pilot Opportunity */}
              <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">5</span>
                Pilot Opportunity
              </div>
              <div className="space-y-6">
                <div>
                  <InputLabel title="Willing to invest for Proof of Concept with any startup?" required />
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="willingToInvest" value="true" required className="accent-[#ff2020] w-4 h-4" /> Yes
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="willingToInvest" value="false" required className="accent-[#ff2020] w-4 h-4" /> No
                    </label>
                  </div>
                </div>
                <div>
                  <InputLabel title="Expected Implementation Timeline" required />
                  <select name="implementationTimeline" value={implementationTimeline} onChange={(e) => setImplementationTimeline(e.target.value)} required className={inputClasses}>
                    <option value="">Select timeline</option>
                    <option value="Immediate (<1 Month)">Immediate (&lt;1 Month)</option>
                    <option value="1–3 Months">1–3 Months</option>
                    <option value="3–6 Months">3–6 Months</option>
                    <option value="More than 6 Months">More than 6 Months</option>
                    <option value="Other">Other</option>
                  </select>
                  {implementationTimeline === 'Other' && (
                    <input type="text" name="otherTimeline" placeholder="Specify timeline..." required className={`mt-3 ${inputClasses}`} />
                  )}
                </div>
              </div>

              {/* 6. Attachments */}
              <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">6</span>
                Attachments <span className="text-sm font-normal text-gray-400">(Optional)</span>
              </div>
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-[#ff2020] bg-gray-50 transition-colors">
                <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-1">Upload Images, Reports, SOPs, Process Documents</p>
                <p className="text-sm text-gray-400">Click to browse</p>
                <input 
                  type="file" 
                  name="attachments" 
                  multiple 
                  className="hidden" 
                  onChange={(e) => setProblemFiles(Array.from(e.target.files))}
                />
                {problemFiles.length > 0 && (
                  <p className="mt-3 text-[#ff2020] font-semibold">{problemFiles.length} file(s) selected</p>
                )}
              </label>

              {/* 7. Declarations */}
              <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">7</span>
                Declaration
              </div>
              <div className="space-y-3 mb-10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" name="declaration1" required className="mt-1 w-5 h-5 accent-[#ff2020] flex-shrink-0" />
                  <span className="text-sm text-gray-700">I confirm that the information provided is accurate to the best of my knowledge.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" name="declaration2" required className="mt-1 w-5 h-5 accent-[#ff2020] flex-shrink-0" />
                  <span className="text-sm text-gray-700">I agree that this problem statement may be published on the JOLT platform for startups to submit solutions.</span>
                </label>
              </div>

              <div className="text-center mt-10">
                <button type="submit" disabled={isSubmittingProblem} className="bg-[#ff2020] text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center mx-auto gap-2">
                  {isSubmittingProblem && <Loader2 className="animate-spin w-5 h-5" />}
                  {isSubmittingProblem ? 'Processing...' : 'Submit Problem Statement'}
                </button>
              </div>
            </form>
          )}

          {/* SOLUTION FORM */}
          {activeTab === 'solution' && (
            <form onSubmit={handleSolutionSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border-t-8 border-[#ff2020]">
              <h2 className="text-3xl font-bold text-[#333333] mb-2">Startup Solution Submission</h2>
              <p className="text-gray-500 mb-8">Turn your innovation into real-world impact.</p>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-10">
                <InputLabel title="Submit Solution As" required />
                <div className="flex gap-6 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="solutionType" value="Individual" checked={submitAs === 'Individual'} onChange={() => setSubmitAs('Individual')} className="accent-[#ff2020] w-4 h-4" /> 1. Individual
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="solutionType" value="Startup" checked={submitAs === 'Startup'} onChange={() => setSubmitAs('Startup')} className="accent-[#ff2020] w-4 h-4" /> 2. Startup
                  </label>
                </div>
              </div>

              {/* 1. Applicant Details */}
              <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mb-6">
                <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">1</span>
                {submitAs === 'Startup' ? 'Startup Details' : 'Personal Details'}
              </div>
              
              {submitAs === 'Individual' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <InputLabel title="Name" required />
                    <input type="text" name="name" placeholder="Full name" required className={inputClasses} />
                  </div>
                  <div>
                    <InputLabel title="Mobile Number" required />
                    <input type="tel" name="mobile" placeholder="+91 XXXXX XXXXX" pattern="^[0-9\-\+\s]{10,15}$" required className={inputClasses} />
                  </div>
                  <div>
                    <InputLabel title="Email ID" required />
                    <input type="email" name="email" placeholder="you@example.com" required className={inputClasses} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <InputLabel title="Startup Name" required />
                    <input type="text" name="startupName" placeholder="Your startup name" required className={inputClasses} />
                  </div>
                  <div>
                    <InputLabel title="Startup Stage" required />
                    <select name="startupStage" required className={inputClasses}>
                      <option value="">Select stage</option>
                      <option value="Idea">Idea</option>
                      <option value="Prototype">Prototype</option>
                      <option value="MVP">MVP</option>
                      <option value="Early Revenue">Early Revenue</option>
                      <option value="Growth Stage">Growth Stage</option>
                    </select>
                  </div>
                  <div>
                    <InputLabel title="Founder / Contact Person" required />
                    <input type="text" name="name" placeholder="Full name" required className={inputClasses} />
                  </div>
                  <div>
                    <InputLabel title="Designation" />
                    <input type="text" name="designation" placeholder="Your designation" className={inputClasses} />
                  </div>
                  <div>
                    <InputLabel title="Email Address" required />
                    <input type="email" name="email" placeholder="you@startup.com" required className={inputClasses} />
                  </div>
                  <div>
                    <InputLabel title="Mobile Number" required />
                    <input type="tel" name="mobile" placeholder="+91 XXXXX XXXXX" pattern="^[0-9\-\+\s]{10,15}$" required className={inputClasses} />
                  </div>
                  <div className="md:col-span-2">
                    <InputLabel title="Website" />
                    <input type="url" name="website" placeholder="https://yourstartup.com" className={inputClasses} />
                  </div>
                </div>
              )}

              {/* 2. Startup Profile */}
              {submitAs === 'Startup' && (
                <>
                  <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                    <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">2</span>
                    Startup Profile
                  </div>
                  <div className="space-y-6">
                    <div>
                      <InputLabel title="Brief About Your Startup" required />
                      <textarea name="aboutStartup" placeholder="Tell us about your startup, what you build..." rows="4" required className={inputClasses}></textarea>
                    </div>
                    <div>
                      <InputLabel title="Sector / Industry" required />
                      <select name="sector" value={sector} onChange={(e) => setSector(e.target.value)} required className={inputClasses}>
                        <option value="">Select sector</option>
                        <option value="AI / Machine Learning">AI / Machine Learning</option>
                        <option value="SaaS">SaaS</option>
                        <option value="IoT">IoT</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Agritech">Agritech</option>
                        <option value="EdTech">EdTech</option>
                        <option value="Other">Other</option>
                      </select>
                      {sector === 'Other' && (
                        <input type="text" name="otherSector" placeholder="Specify sector..." required className={`mt-3 ${inputClasses}`} />
                      )}
                    </div>
                  </div>
                </>
              )}

              {(() => {
                const offset = submitAs === 'Startup' ? 1 : 0;
                return (
                  <>
                    <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                      <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">{2 + offset}</span>
                      Problem Statement
                    </div>
                    <div>
                      <InputLabel title="Select a Problem Statement to Solve" required />
                      {isLoadingProblems ? (
                        <p className="text-gray-500 flex items-center gap-2"><Loader2 className="animate-spin w-4 h-4"/> Loading available problems...</p>
                      ) : (
                        <>
                          <input 
                            list="problem-statements-list" 
                            name="problemStatementRef" 
                            placeholder="Search and select problem statement..." 
                            required 
                            className={inputClasses}
                          />
                          <datalist id="problem-statements-list">
                            {problemsList.map(p => (
                              <option key={p._id} value={p.title || p.problemTitle} />
                            ))}
                          </datalist>
                        </>
                      )}
                    </div>

                    <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                      <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">{3 + offset}</span>
                      Proposed Solution
                    </div>
                    <div className="space-y-6">
                      <div>
                        <InputLabel title="Solution Title" required />
                        <input type="text" name="solutionTitle" placeholder="Give your solution a clear title" required className={inputClasses} />
                      </div>
                      <div>
                        <InputLabel title="Describe Your Solution" required />
                        <textarea name="description" placeholder="Explain how your solution addresses the problem..." rows="5" required className={inputClasses}></textarea>
                      </div>
                      <div>
                        <InputLabel title="What makes your solution unique?" required />
                        <textarea name="uniqueValue" placeholder="What differentiates your approach?" rows="4" required className={inputClasses}></textarea>
                      </div>
                      <div>
                        <InputLabel title="Technology to be Used" />
                        <div className="flex flex-wrap gap-3">
                          {['AI/ML', 'Computer Vision', 'IoT', 'Mobile App', 'Cloud', 'Robotics', 'Blockchain'].map((tech) => (
                            <label key={tech} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 cursor-pointer hover:border-[#ff2020] text-sm">
                              <input type="checkbox" name="technologies" value={tech} className="accent-[#ff2020]" /> {tech}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                      <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">{4 + offset}</span>
                      Readiness
                    </div>
                    <div className="space-y-6">
                      <div>
                        <InputLabel title="Has this or a similar solution been implemented before?" required />
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="previouslyImplemented" value="true" checked={previouslyImplemented === 'true'} onChange={(e) => setPreviouslyImplemented(e.target.value)} required className="accent-[#ff2020] w-4 h-4" /> Yes
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="previouslyImplemented" value="false" checked={previouslyImplemented === 'false'} onChange={(e) => setPreviouslyImplemented(e.target.value)} required className="accent-[#ff2020] w-4 h-4" /> No
                          </label>
                        </div>
                      </div>
                      
                      {previouslyImplemented === 'true' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="md:col-span-2">
                            <InputLabel title="Current Development Stage" required />
                            <select name="developmentStage" value={developmentStage} onChange={(e) => setDevelopmentStage(e.target.value)} required className={inputClasses}>
                              <option value="">Select stage</option>
                              <option value="Concept">Concept</option>
                              <option value="Prototype Ready">Prototype Ready</option>
                              <option value="MVP Ready">MVP Ready</option>
                              <option value="Market Ready">Market Ready</option>
                              <option value="Already Deployed">Already Deployed</option>
                            </select>
                          </div>
                          <div>
                            <InputLabel title="Client Name (If any)" />
                            <input type="text" name="clientName" placeholder="Previous client name" className={inputClasses} />
                          </div>
                          <div>
                            <InputLabel title="Brief Outcome" />
                            <input type="text" name="briefOutcome" placeholder="Key result from previous implementation" className={inputClasses} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                      <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">{5 + offset}</span>
                      Implementation Plan
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <InputLabel title="Estimated PoC Duration" required />
                        <select name="pocDuration" value={pocDuration} onChange={(e) => setPocDuration(e.target.value)} required className={inputClasses}>
                          <option value="">Select duration</option>
                          <option value="Less than 1 Month">Less than 1 Month</option>
                          <option value="1–3 Months">1–3 Months</option>
                          <option value="3–6 Months">3–6 Months</option>
                          <option value="More than 6 Months">More than 6 Months</option>
                        </select>
                      </div>
                      <div>
                        <InputLabel title="Team Members for this Project" required />
                        <input type="number" name="teamMembers" placeholder="e.g. 3" min="1" required className={inputClasses} />
                      </div>
                      <div className="md:col-span-2">
                        <InputLabel title="Expected Outcomes" required />
                        <textarea name="expectedOutcomes" placeholder="What measurable results do you expect?" rows="3" required className={inputClasses}></textarea>
                      </div>
                    </div>

                    <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                      <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">{6 + offset}</span>
                      Attachments <span className="text-sm font-normal text-gray-400">(Optional)</span>
                    </div>
                    <label className="block border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-[#ff2020] bg-gray-50 transition-colors">
                      <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 mb-1">Upload Pitch Deck, Product Brochure, Demo Video, Technical Architecture</p>
                      <p className="text-sm text-gray-400">Click to browse</p>
                      <input 
                        type="file" 
                        name="attachments" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => setSolutionFiles(Array.from(e.target.files))}
                      />
                      {solutionFiles.length > 0 && (
                        <p className="mt-3 text-[#ff2020] font-semibold">{solutionFiles.length} file(s) selected</p>
                      )}
                    </label>

                    <div className="text-xl font-bold text-[#333333] flex items-center gap-3 border-b-2 border-gray-100 pb-3 mt-10 mb-6">
                      <span className="w-8 h-8 bg-[#ff2020] text-white rounded-full flex items-center justify-center text-sm">{7 + offset}</span>
                      Declaration
                    </div>
                    <div className="space-y-3 mb-10">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name="declaration1" required className="mt-1 w-5 h-5 accent-[#ff2020] flex-shrink-0" />
                        <span className="text-sm text-gray-700">I certify that the information provided is true and accurate.</span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name="declaration2" required className="mt-1 w-5 h-5 accent-[#ff2020] flex-shrink-0" />
                        <span className="text-sm text-gray-700">I understand that submission of this proposal does not guarantee selection.</span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" name="declaration3" required className="mt-1 w-5 h-5 accent-[#ff2020] flex-shrink-0" />
                        <span className="text-sm text-gray-700">I agree that JOLT may share this proposal with the respective problem owner for evaluation.</span>
                      </label>
                    </div>

                  </>
                );
              })()}

              <div className="text-center mt-10">
                <button type="submit" disabled={isSubmittingSolution} className="bg-[#ff2020] text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center mx-auto gap-2">
                  {isSubmittingSolution && <Loader2 className="animate-spin w-5 h-5" />}
                  {isSubmittingSolution ? 'Processing...' : 'Submit Solution'}
                </button>
              </div>
            </form>
          )}

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#333333] text-white rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-[-100px] right-[-50px] w-72 h-72 bg-[#ff2020] opacity-10 rounded-full blur-3xl"></div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Be Part of Jhansi's Innovation Movement</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10 relative z-10">
              JOLT is more than a problem repository — it's a collaborative platform where government, industry, citizens, and startups come together to build smarter, more efficient solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <button onClick={() => { window.location.href = '#forms'; setActiveTab('problem'); }} className="bg-white text-[#ff2020] px-8 py-3.5 rounded-full font-bold hover:bg-gray-100 transition-colors">
                Submit a Problem
              </button>
              <button onClick={() => { window.location.href = '#forms'; setActiveTab('solution'); }} className="bg-[#ff2020] text-white px-8 py-3.5 rounded-full font-bold hover:bg-red-700 transition-colors border border-[#ff2020]">
                Submit a Solution
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-8 right-8 z-[9999] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white font-semibold ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.type === 'error' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      </div>

    </div>
  );
}