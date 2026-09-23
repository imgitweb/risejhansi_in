import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import NewsEvents from './pages/NewsEvents';
import WomenCell from './pages/WomenCell';
import StartupRegistration from './pages/StartupRegistration';
import MentorRegistration from './pages/MentorRegistration';
import InvestorRegistration from './pages/InvestorRegistration';
import PartnerRegistration from './pages/PartnerRegistration';
import PaidCoworkingSpace from './pages/PaidCoworkingSpace';
import ContactUs from './pages/ContactUs';
import Career from './pages/Career';
import Ramp from './pages/Ramp';
import RampApplicationForm from './pages/RampApplicationForm';
import RiseStartups from './pages/RiseStartups';
import JoltPortal from './pages/JoltPortal';
import AboutUs from "./pages/AboutUs";

// 1. ScrollToTop Component banayein
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jab bhi pathname (URL) change hoga, page top par scroll ho jayega
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      {/* 2. ScrollToTop ko Router ke andar add karein */}
      <ScrollToTop />
      
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {/* Header sabhi pages par dikhega */}
        <Header />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/news-and-events" element={<NewsEvents />} />
            <Route path="/women-cell" element={<WomenCell />} />
            <Route path="/startup-registration" element={<StartupRegistration />} />
            <Route path="/mentor-registration" element={<MentorRegistration />} />
            <Route path="/investor-registration" element={<InvestorRegistration />} />
            <Route path="/partner-registration" element={<PartnerRegistration />} />
            <Route path="/paid-coworking-space" element={<PaidCoworkingSpace />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/career" element={<Career />} />
            <Route path="/ramp" element={<Ramp />} />
            <Route path="/ramp-2.0" element={<RampApplicationForm />} />
            <Route path="/rise-startup" element={<RiseStartups />} />
            <Route path="/jolt" element={<JoltPortal />} />
          </Routes>
        </div>

        {/* Footer sabhi pages par dikhega */}
        <Footer />

        {/* Chatbot sabhi pages par bottom-right mein dikhega */}
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;