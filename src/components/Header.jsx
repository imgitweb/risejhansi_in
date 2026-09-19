import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// Make sure your folder structure is: src/img/logo-web.png
import logo from '../img/logo-web.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  // Navigation Links Data (Added JOLT)
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'News & Events', path: '/news-and-events' },
    { 
      name: 'Join RISE', 
      path: '#', // Hover dropdown will open here
      dropdown: [
        { name: 'Startup Registration', path: '/startup-registration' },
        { name: 'Mentor Registration', path: '/mentor-registration' },
        { name: 'Investor Registration', path: '/investor-registration' },
        { name: 'Partner Registration', path: '/partner-registration' },
        { name: 'Paid Co-Working Space', path: '/paid-coworking-space' },
      ]
    },
    { name: 'Women Cell', path: '/women-cell' },
    { name: 'Rise Startup', path: '/rise-startup' },
    { name: 'Career', path: '/career' },
    { name: 'RAMP', path: '/ramp' },
    { name: 'JOLT', path: '/jolt' }, // <-- JOLT option added here
    { name: 'Contact Us', path: '/contact-us' },
  ];

  // Handle scroll effect for glassmorphism and shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-2 lg:py-3'
          : 'bg-white py-4 lg:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Section (Increased Size) */}
          <Link to="/" className="flex-shrink-0 cursor-pointer">
            <img 
              src={logo} 
              alt="RISE Jhansi Logo" 
              // h-14 for mobile, h-16 for tablet, h-[4.5rem] for large desktop
              className="h-14 md:h-16 lg:h-[4.5rem] w-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-7 items-center h-full">
            {navLinks.map((link, index) => (
              link.dropdown ? (
                // Dropdown Menu Item
                <div key={index} className="relative group h-full flex items-center py-2">
                  {/* Increased Text Size: text-base lg:text-lg */}
                  <div className="flex items-center text-gray-700 font-medium text-base lg:text-[1.1rem] cursor-pointer transition-colors duration-300 hover:text-[#ff2020]">
                    {link.name}
                    <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
                    {/* Hover Underline Animation */}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff2020] transition-all duration-300 ease-out group-hover:w-full"></span>
                  </div>

                  {/* Dropdown Box (Appears on Hover) */}
                  <div className="absolute top-full left-0 w-[17rem] pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top group-hover:translate-y-0 translate-y-2">
                    <div className="bg-white rounded-xl shadow-2xl border border-slate-100 relative">
                      
                      {/* Red Accent Arrow Pointer */}
                      <div className="absolute -top-1.5 left-6 w-3 h-3 bg-[#ff2020] rotate-45 rounded-sm z-0"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff2020] rounded-t-xl z-10"></div>
                      
                      {/* Dropdown Links */}
                      <div className="bg-white relative z-20 rounded-xl overflow-hidden py-2">
                        {link.dropdown.map((subItem, subIndex) => (
                          <Link 
                            key={subIndex} 
                            to={subItem.path} 
                            // Increased Text Size in dropdown: text-base
                            className="block px-5 py-3 text-[1rem] font-semibold text-slate-700 hover:bg-[#fff5f5] hover:text-[#ff2020] transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Standard Menu Item
                <Link
                  key={index}
                  to={link.path}
                  // Increased Text Size: text-base lg:text-lg
                  className="text-gray-700 font-medium text-base lg:text-[1.1rem] relative group transition-colors duration-300 hover:text-[#ff2020] py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff2020] transition-all duration-300 ease-out group-hover:w-full"></span>
                </Link>
              )
            ))}
          </nav>

          {/* Search Icon & Mobile Menu Button */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <button className="text-gray-600 hover:text-[#ff2020] transition-colors duration-300 p-2 rounded-full hover:bg-[#fff5f5]">
              <Search className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-gray-600 hover:text-[#ff2020] transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden absolute w-full bg-white shadow-xl border-t border-slate-100 transition-all duration-300 origin-top ${
          isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        }`}
      >
        {/* pb-32 added so bottom items aren't hidden behind mobile browser bars */}
        <div className="px-4 pt-4 pb-32 space-y-2 flex flex-col h-screen overflow-y-auto">
          {navLinks.map((link, index) => (
            link.dropdown ? (
              // Mobile Dropdown Item
              <div key={index} className="flex flex-col">
                <button
                  onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                  // Increased text size: text-lg
                  className="flex justify-between items-center text-gray-800 px-3 py-3.5 rounded-md text-lg font-bold hover:text-[#ff2020] hover:bg-[#fff5f5] w-full text-left transition-colors"
                >
                  {link.name}
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileDropdownOpen ? 'rotate-180 text-[#ff2020]' : ''}`} />
                </button>
                
                {/* Mobile Expanded Links */}
                <div className={`overflow-hidden transition-all duration-300 ${mobileDropdownOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-6 pr-3 py-2 space-y-1 bg-[#fcfcfc] rounded-lg mx-2 my-1 border border-slate-100">
                    {link.dropdown.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        // Increased text size: text-base
                        className="block py-3 px-3 text-base font-semibold text-slate-600 hover:text-[#ff2020] hover:bg-white rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Standard Mobile Link
              <Link
                key={index}
                to={link.path}
                // Increased text size: text-lg
                className="text-gray-800 block px-3 py-3.5 rounded-md text-lg font-bold hover:text-[#ff2020] hover:bg-[#fff5f5] transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;