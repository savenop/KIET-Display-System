import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper: Get Initials from Name
const getInitials = (name) => {
  if (!name) return "ST"; 
  const parts = name.trim().split(/\s+/); 
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// *** FIXED HELPER FUNCTION ***
const getDriveImage = (url) => {
  if (!url) return null;
  
  // 1. Extract the ID using Regex (Works for /file/d/ID and ?id=ID)
  const idRegex = /(?:\/d\/|id=)([\w-]+)/;
  const match = url.match(idRegex);
  
  if (match && match[1]) {
    // 2. Use the 'lh3' endpoint which allows direct embedding of Drive images
    // w=1000 sets the width to 1000px. You can increase this if needed.
    return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
  }
  
  return null;
};

// Helper: Theme logic (Unchanged)
const getAwardTheme = (pos) => {
  const p = pos?.toLowerCase() || "";
  if (p.includes("1st") || p.includes("winner") || p.includes("first")) 
    return { 
      main: "#f59e0b", label: "WINNER", bg: "bg-amber-50", border: "border-amber-200", 
      icon: "text-amber-600", gradient: "from-amber-400 to-orange-500", darkBg: "bg-gray-900", 
      blob: ["#f59e0b", "#d97706", "#fbbf24"] 
    }; 
  if (p.includes("2nd") || p.includes("runner") || p.includes("second")) 
    return { 
      main: "#64748b", label: "RUNNER UP", bg: "bg-slate-50", border: "border-slate-200", 
      icon: "text-slate-600", gradient: "from-slate-400 to-slate-600", darkBg: "bg-slate-900", 
      blob: ["#94a3b8", "#64748b", "#cbd5e1"]
    };
  if (p.includes("3rd") || p.includes("third")) 
    return { 
      main: "#d97706", label: "KEEP IT UP", bg: "bg-orange-50", border: "border-orange-200", 
      icon: "text-orange-600", gradient: "from-orange-400 to-red-500", darkBg: "bg-orange-950", 
      blob: ["#ea580c", "#c2410c", "#fb923c"]
    };
  return { 
    main: "#8b5cf6", label: "PARTICIPATION", bg: "bg-violet-50", border: "border-violet-200", 
    icon: "text-violet-600", gradient: "from-violet-400 to-purple-600", darkBg: "bg-[#2e1065]", 
    blob: ["#8b5cf6", "#7c3aed", "#a78bfa"]
  };
};

const Award = ({ slideIndex = 0, preFetchedData = [] }) => {
  // State to track if image failed to load
  const [imgError, setImgError] = useState(false);

  const totalRecords = preFetchedData.length;
  if (totalRecords === 0) return null;

  const currentIndex = slideIndex % (totalRecords || 1);
  const item = preFetchedData[currentIndex];

  if (!item) return null;

  // Reset error state when slide changes
  React.useEffect(() => {
    setImgError(false);
  }, [currentIndex]);

  const theme = getAwardTheme(item["Your position /Achievement"]);
  const rawLink = item["Google drive Link of event pictures for magazine /website updation(sharing mode should be on)"];
  
  // Only try to generate an image link if the raw link exists
  const eventImage = rawLink ? getDriveImage(rawLink) : null;
  
  const stipend = item["Winning Amount/ Stipend (if any for hackathon/ internship or any other extra curricular event)"];
  const finalStipend = (stipend && stipend.toLowerCase() !== "na" && stipend.trim() !== "") ? stipend : "N/A";
  const positionText = item["Your position /Achievement"] || "Participant";

  // LOGIC: Show image if URL exists AND no error occurred. Otherwise, show fallback.
  const showImage = eventImage && !imgError;

  return (
    <div className="relative w-full min-h-screen bg-[#F8F9FA] text-[#2C3E50] overflow-x-hidden">
      
      {/* BACKGROUND PATTERN */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: `radial-gradient(#2C3E50 1px, transparent 1px)`, backgroundSize: '24px 24px' }} 
          />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#E67E22]/5 to-transparent rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-20 pb-8 text-center" 
        >
           <h2 className="text-[#E67E22] text-sm font-black uppercase tracking-[0.4em] mb-3">Elite Student Recognition</h2>
           <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#2C3E50] mb-4">
             Wall of <span className="relative inline-block text-[#E67E22] decoration-4 underline decoration-[#E67E22]/20 underline-offset-8">Fame</span>
           </h1>
           <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
             <span className="w-2 h-2 rounded-full bg-[#E67E22] animate-pulse"></span>
             <p className="text-[#2C3E50]/60 text-xs font-bold uppercase tracking-widest">
               Showing Record {currentIndex + 1} of {totalRecords}
             </p>
           </div>
        </motion.div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-24" 
          >
            {/* LEFT COL: IMAGE OR FALLBACK */}
            <div className="lg:col-span-7 relative group">
              <div className="absolute -inset-4 border-2 border-dashed border-gray-300 rounded-[2.5rem] opacity-50 rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
              <div className="relative h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-white bg-white">
                
                {/* 1. ACTUAL IMAGE */}
                {showImage && (
                  <img 
                    src={eventImage} 
                    alt="Event" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={() => setImgError(true)} // If image fails, switch to fallback
                  />
                )}

                {/* 2. FALLBACK CONTAINER (Shows if no image OR if image errors) */}
                {!showImage && (
                  <div className={`w-full h-full ${theme.darkBg} flex flex-col items-center justify-center p-8 text-center relative overflow-hidden`}>
                     <motion.div animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0], scale: [1, 1.2, 0.8, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full blur-[80px] opacity-60" style={{ backgroundColor: theme.blob[0] }} />
                     <motion.div animate={{ x: [0, -30, 30, 0], y: [0, 40, -40, 0], scale: [1, 1.1, 0.9, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[80px] opacity-60" style={{ backgroundColor: theme.blob[1] }} />
                     <div className="relative z-10 w-full max-w-lg backdrop-blur-sm border border-white/10 bg-white/5 p-8 rounded-3xl shadow-2xl">
                            <div className="mb-6"><span className="inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] shadow-lg border border-white/20" style={{ backgroundColor: theme.main }}>{positionText}</span></div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-xl mb-4 line-clamp-3">{item["Event Name/ Title"]}</h2>
                     </div>
                  </div>
                )}

                {/* Organization tag overlay */}
                {item["Organization \n[Organization in which event happened]"] && (
                  <div className="absolute bottom-6 right-6 z-20">
                      <div className="bg-white/95 backdrop-blur px-6 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
                         <div className="p-2 rounded-full bg-gray-50 text-[#E67E22]"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg></div>
                         <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Captured At</p><p className="text-sm font-extrabold text-[#2C3E50] max-w-[150px] truncate">{item["Organization \n[Organization in which event happened]"]}</p></div>
                      </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COL: INFO (Unchanged) */}
            <div className="lg:col-span-5 flex flex-col gap-6 pt-2">
              <div className="flex items-start gap-6">
                 <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-[#E67E22] rounded-3xl rotate-6 opacity-20"></div>
                    <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '8px 8px' }}></div>
                        <span className="relative z-10 text-white font-black text-3xl md:text-5xl tracking-tighter drop-shadow-md">{getInitials(item["Student Name"])}</span>
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-[#2C3E50] text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-[#F8F9FA]">{item.year}YR</div>
                 </div>
                 <div className="flex flex-col justify-center pt-2">
                    <h2 className="text-4xl md:text-5xl font-black text-[#2C3E50] leading-[0.9] tracking-tight mb-2">{item["Student Name"]}</h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-[#2C3E50] text-[11px] font-bold uppercase tracking-wide">Section {item.section}</span>
                      <span className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-[#2C3E50] text-[11px] font-bold uppercase tracking-wide">{item["Student University Roll Number"]}</span>
                    </div>
                 </div>
              </div>

              <div className="w-full border-t-2 border-dotted border-gray-300"></div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                   <span className="px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-sm" style={{ backgroundColor: theme.main }}>{theme.label}</span>
                   <div className="flex items-center gap-1 text-gray-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{item["Achievement_Date "] || "N/A"}</span>
                   </div>
                </div>
                <h3 className="text-3xl font-bold text-[#2C3E50] leading-tight">{item["Event Name/ Title"]}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className={`p-4 rounded-2xl border ${theme.border} ${theme.bg} flex flex-col justify-center`}>
                    <div className="flex items-center gap-2 mb-1"><svg className={`w-5 h-5 ${theme.icon}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><p className="text-[10px] uppercase font-bold text-gray-400">Position Secured</p></div>
                    <p className="text-xl md:text-2xl font-black text-[#2C3E50] line-clamp-1" title={item["Your position /Achievement"]}>{item["Your position /Achievement"]}</p>
                 </div>
                 <div className={`p-4 rounded-2xl border ${theme.border} ${theme.bg} flex flex-col justify-center`}>
                    <div className="flex items-center gap-2 mb-1"><svg className={`w-5 h-5 ${theme.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p className="text-[10px] uppercase font-bold text-gray-400">Reward</p></div>
                    <p className="text-xl md:text-2xl font-black text-[#2C3E50] line-clamp-1">{finalStipend}</p>
                 </div>
              </div>

              <div className="relative pl-6 border-l-4 border-gray-200">
                 <div className="max-h-[140px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <p className="text-gray-500 italic font-medium leading-relaxed text-sm md:text-base">"{item["Short Description about the event"]}"</p>
                 </div>  
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Award;