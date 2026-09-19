import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! 👋 Welcome to RISE Jhansi. I am your AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Voice feature states
  const [isListening, setIsListening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN'; // Supports Indian English and Hindi mix

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setSpeechSupported(false);
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Text to Speech Function (Bot reads out the reply)
  const speakText = (text) => {
    if (soundEnabled && 'speechSynthesis' in window) {
      // Stop any ongoing speech before starting a new one
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Optional: You can change voice/pitch here if needed
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      // Cancel any ongoing bot speech when user starts talking
      window.speechSynthesis.cancel();
    }
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newUserMsg = { text: userText, sender: 'user' };
    
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Stop bot from talking if user sends a new message
    window.speechSynthesis.cancel();

    // Dummy Bot Reply Logic with NLP Simulation
    setTimeout(() => {
      let botReply = "Thank you for reaching out! Our team will get back to you soon.";
      const lowerInput = userText.toLowerCase();
      
      if (lowerInput.includes('ramp') || lowerInput.includes('jolt')) {
        botReply = "Great! You can apply for our RAMP and JOLT programs by navigating to the respective pages using the top menu.";
      } else if (lowerInput.includes('contact') || lowerInput.includes('phone') || lowerInput.includes('call')) {
        botReply = "You can reach us at +91 7607011145 or drop an email at connect@risejhansi.in.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        botReply = "Hello! I am ready to assist you. Ask me about our incubation programs, startups, or contact details.";
      } else if (lowerInput.includes('women')) {
        botReply = "Our Women Cell is dedicated to empowering female entrepreneurs. Check out the 12 Weeks Cohort Program!";
      }

      setMessages((prev) => [...prev, { text: botReply, sender: 'bot' }]);
      setIsTyping(false);
      
      // Bot speaks the reply
      speakText(botReply);

    }, 1500);
  };

  return (
    <>
      {/* ================= FLOATING ACTION BUTTON (With Pulse & Glow) ================= */}
      <div className={`fixed bottom-6 right-6 z-[99999] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Glow effect behind button */}
        <div className="absolute inset-0 bg-[#ff2020] rounded-full blur-[20px] opacity-40 animate-pulse"></div>
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-tr from-[#d81c28] to-[#ff4d4d] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(255,32,32,0.5)] transition-all duration-300 hover:scale-110 group border-2 border-white/20"
        >
          <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
          {/* Notification Dot */}
          <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-bounce"></span>
        </button>
      </div>

      {/* ================= CHAT WINDOW (Futuristic & Premium UI) ================= */}
      <div 
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[99999] w-[92vw] sm:w-[400px] bg-white rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-[#eee] flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right font-['Poppins',sans-serif] ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto translate-y-0' : 'scale-50 opacity-0 pointer-events-none translate-y-10'
        }`}
        style={{ height: '600px', maxHeight: '85vh' }}
      >
        {/* Chat Header */}
        <div className="bg-[#333] p-5 flex justify-between items-center relative overflow-hidden shrink-0 border-b-[4px] border-[#ff2020]">
          {/* Decorative shapes */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff2020]/20 rounded-full blur-[25px]"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#ff2020]/10 rounded-full blur-[25px]"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-inner">
                <Bot className="w-7 h-7 text-[#ff2020]" />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#333] rounded-full"></span>
            </div>
            <div>
              <h3 className="text-white font-extrabold text-[1.15rem] leading-tight tracking-wide">RISE AI Bot</h3>
              <p className="text-[#aaa] text-[0.8rem] font-medium flex items-center gap-1 mt-0.5">
                Always here to help
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative z-10">
            {/* Sound Toggle Button */}
            <button 
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if(soundEnabled) window.speechSynthesis.cancel();
              }}
              className={`p-2 rounded-full transition-colors ${soundEnabled ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20' : 'text-slate-400 bg-white/5 hover:bg-white/10'}`}
              title={soundEnabled ? "Mute Bot Voice" : "Enable Bot Voice"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white bg-white/5 hover:bg-[#ff2020] p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Body (Messages Area) */}
        <div className="flex-grow p-5 overflow-y-auto bg-[#f8f9fa] flex flex-col gap-5 scrollbar-thin scrollbar-thumb-[#ccc] scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-auto shadow-sm ${msg.sender === 'user' ? 'bg-[#333] text-white' : 'bg-white text-[#ff2020] border border-[#eee]'}`}>
                  {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                
                {/* Message Bubble */}
                <div 
                  className={`p-3.5 text-[0.95rem] leading-relaxed shadow-sm font-medium ${
                    msg.sender === 'user' 
                      ? 'bg-[#333] text-white rounded-[20px] rounded-br-[4px]' 
                      : 'bg-white border border-[#eee] text-[#555] rounded-[20px] rounded-bl-[4px]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="flex gap-3 max-w-[85%] flex-row">
                <div className="w-9 h-9 rounded-full bg-white text-[#ff2020] border border-[#eee] flex items-center justify-center shrink-0 mt-auto shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white border border-[#eee] px-4 py-4 rounded-[20px] rounded-bl-[4px] flex gap-1.5 items-center shadow-sm">
                  <span className="w-2.5 h-2.5 bg-[#ff2020] rounded-full animate-bounce"></span>
                  <span className="w-2.5 h-2.5 bg-[#ff2020] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2.5 h-2.5 bg-[#ff2020] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          
          {/* Listening Indicator */}
          {isListening && (
            <div className="flex justify-center my-2">
              <div className="bg-[#ff2020]/10 text-[#ff2020] px-4 py-2 rounded-full text-xs font-bold tracking-widest flex items-center gap-2 animate-pulse border border-[#ff2020]/20">
                <Mic className="w-4 h-4" /> LISTENING...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Footer (Input & Controls) */}
        <div className="p-4 bg-white border-t border-[#eee] shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            
            {/* Mic Button for Voice Input */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListen}
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isListening 
                    ? 'bg-[#ff2020] text-white shadow-[0_0_15px_rgba(255,32,32,0.5)] animate-pulse' 
                    : 'bg-[#f8f9fa] text-[#555] border border-[#eee] hover:bg-[#fff5f5] hover:text-[#ff2020] hover:border-[#ff2020]/30'
                }`}
                title="Hold to speak"
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            )}

            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..." 
              className="flex-grow px-5 py-3.5 bg-[#f8f9fa] border border-[#eee] rounded-[50px] text-[0.95rem] text-[#333] font-medium focus:outline-none focus:border-[#ff2020] focus:ring-2 focus:ring-[#ff2020]/10 transition-all"
            />
            
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="w-12 h-12 bg-[#ff2020] hover:bg-[#d81c28] disabled:bg-[#ffa0a0] disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center shrink-0 transition-colors shadow-md"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
          
          <div className="text-center mt-3">
            <p className="text-[0.75rem] text-[#aaa] font-medium">
              Powered by <span className="text-[#ff2020] font-bold">RISE AI Voice & Chat</span>
            </p>
          </div>
        </div>
      </div>

      {/* Add Custom Animation for smooth message entry */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUpMessage {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUpMessage 0.3s ease-out forwards;
        }
      `}} />
    </>
  );
};

export default Chatbot;