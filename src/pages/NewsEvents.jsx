import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// यहाँ से Instagram को हटा दिया गया है
import { Calendar, Settings, ArrowRight, X, Heart, MessageCircle, ExternalLink, ChevronLeft, ChevronRight, Image as ImageIcon, PlayCircle } from 'lucide-react';
import axios from 'axios';
import API_URL from "../components/Config";

gsap.registerPlugin(ScrollTrigger);

// Custom Instagram SVG Icon (अब lucide-react की ज़रूरत नहीं)
const InstagramIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const NewsEvents = () => {
  const pageRef = useRef(null);
  const bannerTextRef = useRef(null);
  const cardsRef = useRef([]);

  // States
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const POSTS_PER_PAGE = 30;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/instagram/posts?page=${currentPage}&limit=${POSTS_PER_PAGE}`);
        
        if (response.data && response.data.success) {
          setPosts(response.data.data);
          setTotalPages(response.data.pagination?.totalPages || 1);
        } else {
          setError("Failed to load posts.");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Something went wrong while fetching posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bannerTextRef.current, { 
        y: 40, opacity: 0, duration: 1, ease: "power4.out", delay: 0.1 
      });

      if (!loading && posts.length > 0) {
        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          gsap.fromTo(card,
            { y: 50, opacity: 0, scale: 0.95 },
            {
              scrollTrigger: {
                trigger: card,
                start: "top 95%",
                toggleActions: "play none none none",
              },
              y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out",
              delay: (index % 10) * 0.05 
            }
          );
        });
      }
    }, pageRef);

    setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => ctx.revert();
  }, [posts, loading]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: 'smooth' }); 
    }
  };

  return (
    <main ref={pageRef} className="flex-grow bg-[#fdfdfd] min-h-screen pt-20 pb-24 font-['Poppins',sans-serif]" id="news-events">
      
      {/* ================= TOP BANNER ================= */}
      <div className="w-full bg-[#1a1a1a] py-24 relative overflow-hidden shadow-inner">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/15 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-[#ff2020]/10 blur-[100px]"></div>
        
        <div ref={bannerTextRef} className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block px-[16px] py-[6px] rounded-full bg-[#ff2020]/10 border border-[#ff2020]/30 text-[#ff2020] font-semibold text-sm mb-6 backdrop-blur-sm shadow-sm">
            Stay Updated
          </div>
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold text-white tracking-tight mb-6 leading-tight">
            Latest <span className="text-[#ff2020]">Updates</span>
          </h1>
          <p className="text-[#aaa] text-[1.1rem] font-medium max-w-2xl mx-auto leading-relaxed">
            Catch up on our latest announcements, workshops, and milestones straight from our social feed.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#ff2020]/20 border-t-[#ff2020] rounded-full animate-spin"></div>
            <p className="mt-4 text-[#666] font-medium">Loading posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-rose-500 font-semibold bg-rose-50 rounded-2xl border border-rose-100">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 text-rose-400" />
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-[#666] font-medium bg-gray-50 rounded-2xl border border-gray-100">
            No posts available at the moment. Please sync from settings.
          </div>
        ) : (
          <>
            {/* Events/Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] mb-12">
              {posts.map((post, index) => {
                const mediaUrl = post.media_type === 'VIDEO' && post.thumbnail_url ? post.thumbnail_url : post.media_url;
                
                return (
                  <div 
                    key={post.ig_post_id || index}
                    ref={(el) => (cardsRef.current[index] = el)}
                    onClick={() => setSelectedPost(post)}
                    className="bg-white rounded-[20px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-[#eee] group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,32,32,0.12)] transition-all duration-500 flex flex-col opacity-0 relative z-10 cursor-pointer"
                  >
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-[#ff2020] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20"></div>

                    <div className="relative h-[280px] overflow-hidden bg-gray-100 flex items-center justify-center">
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-[14px] py-[6px] rounded-[10px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] z-20 flex items-center text-[0.8rem] font-bold text-[#333]">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#ff2020]" />
                        {formatDate(post.post_timestamp)}
                      </div>

                      <div className="absolute top-4 right-4 z-20">
                        {post.media_type === 'VIDEO' ? (
                          <PlayCircle className="w-6 h-6 text-white drop-shadow-md" />
                        ) : post.media_type === 'CAROUSEL_ALBUM' ? (
                          <ImageIcon className="w-5 h-5 text-white drop-shadow-md" />
                        ) : null}
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500 z-10"></div>
                      
                      {mediaUrl ? (
                        <img 
                          src={mediaUrl} 
                          alt="Post Thumbnail" 
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="p-[25px] flex flex-col flex-grow bg-white z-10 relative">
                      <p className="text-[#444] text-[0.95rem] leading-relaxed flex-grow mb-4">
                        {truncateText(post.caption, 120) || "No caption provided."}
                      </p>

                      <div className="mt-auto pt-4 border-t border-[#eee] flex items-center justify-between text-[#666]">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center text-[0.85rem] font-medium"><Heart className="w-4 h-4 mr-1 text-rose-500"/> {post.like_count || 0}</span>
                          <span className="flex items-center text-[0.85rem] font-medium"><MessageCircle className="w-4 h-4 mr-1 text-blue-500"/> {post.comments_count || 0}</span>
                        </div>
                        <span className="text-[0.85rem] font-bold text-[#ff2020] flex items-center group-hover:underline">
                          View <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#ddd] text-[#333] hover:border-[#ff2020] hover:text-[#ff2020] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-[0.95rem] font-semibold text-[#555]">
                  Page <span className="text-[#ff2020]">{currentPage}</span> of {totalPages}
                </span>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#ddd] text-[#333] hover:border-[#ff2020] hover:text-[#ff2020] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= POST POPUP MODAL ================= */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
          <div 
            className="absolute inset-0 z-0" 
            onClick={() => setSelectedPost(null)}
          ></div>
          
          <div className="relative z-10 w-full max-w-5xl bg-[#1a1a1a] rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-[#333] animate-in fade-in zoom-in-95 duration-300">
            
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/50 hover:bg-[#ff2020] text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative border-b md:border-b-0 md:border-r border-[#333] min-h-[300px]">
              {selectedPost.media_type === 'VIDEO' ? (
                <video 
                  src={selectedPost.media_url} 
                  controls 
                  autoPlay 
                  className="max-w-full max-h-[60vh] md:max-h-[90vh] object-contain"
                  poster={selectedPost.thumbnail_url}
                />
              ) : (
                <img 
                  src={selectedPost.media_url} 
                  alt="Post Content" 
                  className="max-w-full max-h-[60vh] md:max-h-[90vh] object-contain"
                />
              )}
            </div>

            <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col overflow-y-auto custom-scrollbar bg-[#1a1a1a]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#333]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
                  <div className="w-full h-full bg-[#1a1a1a] border-2 border-[#1a1a1a] rounded-full flex items-center justify-center">
                    {/* Custom SVG in place of missing lucide icon */}
                    <InstagramIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold text-[0.95rem]">Instagram Update</h4>
                  <p className="text-[#888] text-[0.8rem]">{formatDate(selectedPost.post_timestamp)}</p>
                </div>
              </div>

              <div className="flex-grow">
                <p className="text-[#ccc] text-[0.95rem] leading-relaxed whitespace-pre-wrap font-light">
                  {selectedPost.caption || "No caption available for this post."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#333]">
                <a 
                  href={selectedPost.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#ff2020] hover:bg-[#e61c1c] text-white font-semibold rounded-xl shadow-lg shadow-[#ff2020]/20 flex items-center justify-center gap-2 transition-colors"
                >
                  View on Instagram <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default NewsEvents;