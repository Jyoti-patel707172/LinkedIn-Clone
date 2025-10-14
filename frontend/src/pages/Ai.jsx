import React, { useState, useRef, useEffect } from "react";
import ai from "../assets/ai.jpg";
import { useNavigate } from "react-router-dom";
import open from "../assets/start.mp3";

function Ai() {
  const navigate = useNavigate();
  const [activeAi, setActiveAi] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const recognitionRef = useRef(null);
  const openingSoundRef = useRef(null);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize audio and speech recognition once
  useEffect(() => {
    // Initialize audio
    openingSoundRef.current = new Audio(open);
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript.trim().toLowerCase();
        handleVoiceCommand(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setActiveAi(false);
      };
      
      recognitionRef.current.onerror = (e) => {
        console.error("Speech recognition error:", e.error);
        setActiveAi(false);
      };
    } else {
      console.log("Speech Recognition not supported");
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  function speak(message) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  }

  const handleVoiceCommand = (transcript) => {
    if (transcript.includes("home") || transcript.includes("open home page")) {
      speak("Opening Home page");
      navigate("/");
    } else if (transcript.includes("signup") || transcript.includes("sign up page")) {
      speak("Opening Signup page");
      navigate("/signup");
    } else if (transcript.includes("login") || transcript.includes("log in page")) {
      speak("Opening Login page");
      navigate("/login");
    } else if (transcript.includes("profile") || transcript.includes("open profile page")) {
      speak("Opening Profile page");
      navigate("/profile");
    } else if (transcript.includes("network") || transcript.includes("network page")) {
      speak("Opening Network page");
      navigate("/network");
    } else if (transcript.includes("notification") || transcript.includes("notification page")) {
      speak("Opening Notification page");
      navigate("/notification");
    } else {
      speak("Sorry, I didn't understand. Please try again.");
      console.log("No match found for:", transcript);
    }
  };

  const handleAiClick = () => {
    if (recognitionRef.current) {
      setActiveAi(true);
      openingSoundRef.current.play().catch(e => console.log("Audio play failed:", e));
      
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.log("Speech recognition start error:", error);
        setActiveAi(false);
      }
    } else {
      alert("Speech recognition is not supported in your browser");
    }
  };

  return (
    <div
      className={`fixed z-50 ${
        isMobile 
          ? "bottom-[20px] right-[20px]"  // Mobile: bottom right corner
          : "lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%]"  // Desktop: original position
      }`}
      onClick={handleAiClick}
    >
      {/* Mobile-specific tooltip */}
      {isMobile && (
        <div className={`absolute bottom-full mb-2 right-0 bg-black text-white text-xs px-2 py-1 rounded-md transition-opacity duration-300 ${
          activeAi ? 'opacity-0' : 'opacity-100'
        }`}>
          Tap to speak
        </div>
      )}
      
      <img
        src={ai}
        alt="AI Assistant"
        className={`cursor-pointer rounded-full transform transition-all duration-300
          ${
            isMobile
              ? "w-[70px] h-[70px]"  // Smaller on mobile
              : "w-[100px] h-[100px]" // Original size on desktop
          }
          ${
            activeAi
              ? `${isMobile ? "translate-y-[-5px]" : "translate-x-[10%] translate-y-[-10%]"} scale-110 shadow-[0_0_30px_#00d2fc]`
              : "translate-x-0 translate-y-0 scale-100 shadow-[0_0_15px_rgba(0,0,0,0.4)]"
          }`}
        style={{
          filter: activeAi
            ? "grayscale(0%) drop-shadow(0 0 20px #00d2fc)"
            : "grayscale(50%) drop-shadow(0 0 10px rgba(0,0,0,0.4))"
        }}
      />
      
      {/* Active indicator for mobile */}
      {isMobile && activeAi && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
      )}
    </div>
  );
}

export default Ai;