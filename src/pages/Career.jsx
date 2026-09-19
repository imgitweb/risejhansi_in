import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Bookmark, IndianRupee, Clock, ArrowRight, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import API_URL from "../components/Config"; // API_URL coming from Config.jsx (.env)

gsap.registerPlugin(ScrollTrigger);

const Career = () => {
  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const filterRef = useRef(null);
  const cardsContainerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [jobsData, setJobsData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All Jobs');

  // Backend exact match filter options
  const filterOptions = ['All Jobs', 'Full-time', 'Part-time', 'Remote', 'Internship'];

  // Fetch Jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Fetching Incubation ID from .env file (with a fallback just in case)
        const incubationId = import.meta.env.VITE_INCUBATION_ID || "6a74ea248ade09560b5dc48c";
        
        const headers = incubationId ? { 'x-incubation-id': incubationId } : {};

        // Fetching data using API_URL from Config
        const response = await axios.get(`${API_URL}/incubation/jobs/list`, { headers });
        
        if (response.data?.success) {
          // Process and map backend data to frontend format
          const formattedJobs = response.data.data
            .filter(job => job.status === 'Open') // Only show active jobs
            .map(job => {
              // Format Date
              const dateObj = new Date(job.createdAt);
              const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
              
              // Clean salary string (remove ₹ or $ if already present so icon doesn't duplicate)
              let cleanSalary = job.salaryRange || 'Not Disclosed';
              cleanSalary = cleanSalary.replace(/[₹$]/g, '').trim();

              return {
                id: job._id,
                title: job.title,
                company: job.startupId?.startupName || job.startupId?.name || "Startup Company",
                location: job.locationType === 'Remote' ? 'Remote' : (job.location || job.locationType),
                locationType: job.locationType,
                salary: cleanSalary,
                type: job.employmentType || 'Full-time',
                posted: formattedDate,
                desc: job.description || '',
                link: job.applicationLink || '#'
              };
            });
            
          setJobsData(formattedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter Logic
  const filteredJobs = activeFilter === 'All Jobs' 
    ? jobsData 
    : jobsData.filter(job => {
        if (activeFilter === 'Remote') return job.locationType === 'Remote' || job.location === 'Remote';
        return job.type === activeFilter;
    });

  // Initial Page Load Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bannerTextRef.current, { y: 40, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1 });
      gsap.from(filterRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power4.out", delay: 0.3 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // Animate cards whenever the filter changes or data finishes loading
  useEffect(() => {
    if (cardsContainerRef.current && !loading) {
      const cards = cardsContainerRef.current.children;
      gsap.fromTo(cards, 
        { y: 40, opacity: 0, scale: 0.98 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: "power4.out", overwrite: "auto" }
      );
    }
  }, [activeFilter, filteredJobs.length, loading]);

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
            Join The Innovation Ecosystem
          </div>
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
            Recent Job Openings <br /> In <span className="text-[#ff2020]">Startups</span>
          </h1>
          <p className="text-[#aaa] text-[1.1rem] font-medium max-w-2xl mx-auto leading-relaxed">
            Discover exciting career opportunities and take the next step in your professional journey with top growing companies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* ================= FILTER BUTTONS ================= */}
        <div ref={filterRef} className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveFilter(option)}
              className={`px-[24px] py-[10px] rounded-[50px] text-[0.95rem] font-bold transition-all duration-300 border-2 ${
                activeFilter === option
                  ? 'bg-[#ff2020] text-white border-[#ff2020] shadow-[0_8px_20px_rgba(255,32,32,0.25)] -translate-y-1'
                  : 'bg-white text-[#555] border-[#eee] hover:border-[#ff2020] hover:text-[#ff2020] hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* ================= JOB CARDS GRID ================= */}
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 text-[#ff2020] animate-spin mb-4" />
            <p className="text-[#888] font-medium">Fetching latest opportunities...</p>
          </div>
        ) : (
          <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="job-card bg-white rounded-[20px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-[#eee] hover:shadow-[0_20px_40px_rgba(255,32,32,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col relative group"
                >
                  {/* Animated Top Border on Hover */}
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-[#ff2020] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20"></div>

                  {/* Card Header & Content */}
                  <div className="p-[30px] pb-4 flex-grow relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-[1.3rem] font-extrabold text-[#333] group-hover:text-[#ff2020] transition-colors duration-300 leading-tight pr-4">
                        {job.title}
                      </h3>
                      {/* Bookmark Icon */}
                      <button className="text-[#ccc] hover:text-[#ff2020] transition-colors shrink-0">
                        <Bookmark className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <p className="text-[#666] font-semibold text-[0.95rem] mb-2">{job.company}</p>
                    
                    <div className="flex items-center text-[#888] text-[0.85rem] mb-6 font-medium">
                      <MapPin className="w-4 h-4 mr-1 text-[#ff2020]" /> {job.location}
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-flex items-center px-[12px] py-[6px] rounded-[6px] bg-[#fff5f5] text-[#ff2020] border border-[#ff2020]/20 text-[0.8rem] font-bold tracking-wide">
                        {job.salary.toLowerCase() !== 'unpaid' && <IndianRupee className="w-3.5 h-3.5 mr-1" />}
                        {job.salary}
                      </span>
                      <span className="inline-flex items-center px-[12px] py-[6px] rounded-[6px] bg-[#f8f9fa] text-[#555] border border-[#eee] text-[0.8rem] font-bold tracking-wide">
                        <Briefcase className="w-3.5 h-3.5 mr-1" />
                        {job.type}
                      </span>
                    </div>

                    <p className="text-[#666] text-[0.95rem] leading-relaxed line-clamp-3">
                      {job.desc}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="p-[30px] pt-0 mt-auto relative z-10">
                    <div className="w-full h-px bg-[#eee] mb-5"></div>
                    <div className="flex justify-between items-center">
                      <p className="text-[0.85rem] text-[#888] font-medium flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 text-[#ff2020]" />
                        {job.posted}
                      </p>
                      <button 
                        onClick={() => window.open(job.link !== '#' ? job.link : null, '_blank')}
                        className="flex items-center justify-center bg-transparent text-[#333] border-2 border-[#333] hover:bg-[#ff2020] hover:border-[#ff2020] hover:text-white text-[0.9rem] font-bold py-[8px] px-[20px] rounded-[50px] transition-all duration-300"
                      >
                        Apply <ArrowRight className="w-4 h-4 ml-1.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white rounded-[20px] border border-[#eee] shadow-sm">
                <div className="w-[80px] h-[80px] bg-[#f8f9fa] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-[#ccc]" />
                </div>
                <h3 className="text-[1.3rem] font-bold text-[#333] mb-2">No jobs found</h3>
                <p className="text-[#888] text-[1rem]">We couldn't find any active jobs matching "{activeFilter}".</p>
                <button 
                  onClick={() => setActiveFilter('All Jobs')}
                  className="mt-6 text-[#ff2020] font-bold underline hover:no-underline"
                >
                  View all jobs
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Career;