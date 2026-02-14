import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- GLOBAL CACHE ---
let achievementsCache = null;

// Helper: Convert Google Drive View Link to Embed Link
const getDriveImage = (url) => {
  if (!url || !url.includes('google.com')) return null;
  let id = null;
  const parts = url.split('/');
  const dIndex = parts.indexOf('d');
  if (dIndex !== -1 && parts[dIndex + 1]) {
    id = parts[dIndex + 1];
  } else if (url.includes('id=')) {
    id = new URL(url).searchParams.get('id');
  }
  return id ? `https://lh3.googleusercontent.com/d/${id}=w1000?authuser=0` : url;
};

// Helper: Theme logic
const getAwardTheme = (pos) => {
  const p = pos?.toLowerCase() || "";
  if (p.includes("1st") || p.includes("winner") || p.includes("first")) 
    return { main: "#f59e0b", label: "WINNER", bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-500" }; 
  if (p.includes("2nd") || p.includes("runner") || p.includes("second")) 
    return { main: "#64748b", label: "RUNNER UP", bg: "bg-slate-50", border: "border-slate-200", icon: "text-slate-500" };
  if (p.includes("3rd") || p.includes("third")) 
    return { main: "#d97706", label: "KEEP IT UP", bg: "bg-orange-50", border: "border-orange-200", icon: "text-orange-500" };
  return { main: "#8b5cf6", label: "PARTICIPATION", bg: "bg-violet-50", border: "border-violet-200", icon: "text-violet-500" };
};

const Award = ({ slideIndex = 0 }) => {
  const [achievements, setAchievements] = useState(achievementsCache || []);
  const [loading, setLoading] = useState(!achievementsCache);

  useEffect(() => {
    if (achievementsCache) return;
    const fetchData = async () => {
      try {
        const response = await fetch('/kietdata/filter?year=1');
        const data = await response.json();
        const latestData = data.slice().reverse(); 
        achievementsCache = latestData;
        setAchievements(latestData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []); 

  const totalRecords = achievements.length;
  const currentIndex = slideIndex % (totalRecords || 1);
  const item = achievements[currentIndex];

  if (loading) return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#F8F9FA]">
      <div className="w-12 h-12 border-4 border-[#E67E22]/20 border-t-[#E67E22] rounded-full animate-spin"></div>
    </div>
  );

  if (!item) return null;

  const theme = getAwardTheme(item["Your position /Achievement"]);
  const driveLink = item["Google drive Link of event pictures for magazine /website updation(sharing mode should be on)"];
  const eventImage = getDriveImage(driveLink);
  const stipend = item["Winning Amount/ Stipend (if any for hackathon/ internship or any other extra curricular event)"];
  const finalStipend = (stipend && stipend.toLowerCase() !== "na" && stipend.trim() !== "") ? stipend : "N/A";

  return (
    <div className="relative w-full min-h-screen bg-[#F8F9FA] text-[#2C3E50] overflow-x-hidden">
      
      {/* --- BACKGROUND PATTERN --- */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute inset-0 opacity-[0.03]" 
              style={{ backgroundImage: `radial-gradient(#2C3E50 1px, transparent 1px)`, backgroundSize: '24px 24px' }} 
         />
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#E67E22]/5 to-transparent rounded-full blur-[100px]" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        
        {/* --- HEADER --- */}
        {/* Changed pt-32 to pt-20 to pull content up */}
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

        {/* --- CONTENT LAYOUT --- */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            // Increased pb-12 to pb-24 to create bottom margin
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-24" 
          >
            
            {/* --- LEFT COL: IMAGE (Span 7) --- */}
            <div className="lg:col-span-7 relative group">
              <div className="absolute -inset-4 border-2 border-dashed border-gray-300 rounded-[2.5rem] opacity-50 rotate-1 group-hover:rotate-0 transition-transform duration-500"></div>
              
              <div className="relative h-[400px] md:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl ring-8 ring-white">
                {eventImage ? (
                  <img 
                    src={eventImage} 
                    alt="Event" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"; }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <p className="text-white/30 font-bold text-xl uppercase tracking-widest">Event Gallery</p>
                  </div>
                )}
                
                {/* Captured At Badge */}
                <div className="absolute bottom-6 right-6">
                   <div className="bg-white/95 backdrop-blur px-6 py-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gray-50 text-[#E67E22]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Captured At</p>
                        <p className="text-sm font-extrabold text-[#2C3E50] max-w-[150px] truncate">{item["Organization \n[Organization in which event happened]"]}</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT COL: INFO (Span 5) --- */}
            <div className="lg:col-span-5 flex flex-col gap-6 pt-2">
              
              {/* 1. STUDENT PROFILE */}
              <div className="flex items-start gap-6">
                 <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-[#E67E22] rounded-3xl rotate-6 opacity-20"></div>
                    <img 
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(item["Student Name"])}&backgroundColor=ffffff`} 
                      className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white shadow-xl bg-white" 
                      alt="Student" 
                    />
                    <div className="absolute -bottom-3 -right-3 bg-[#2C3E50] text-white text-xs font-bold px-3 py-1 rounded-full border-4 border-[#F8F9FA]">
                      {item.year}YR
                    </div>
                 </div>
                 
                 <div className="flex flex-col justify-center pt-2">
                    <h2 className="text-4xl md:text-5xl font-black text-[#2C3E50] leading-[0.9] tracking-tight mb-2">
                      {item["Student Name"]}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-[#2C3E50] text-[11px] font-bold uppercase tracking-wide">
                        Section {item.section}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-[#2C3E50] text-[11px] font-bold uppercase tracking-wide">
                         {item["Student University Roll Number"]}
                      </span>
                    </div>
                 </div>
              </div>

              {/* Dotted Divider */}
              <div className="w-full border-t-2 border-dotted border-gray-300"></div>

              {/* 2. EVENT INFO */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                   <span 
                     className="px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-sm"
                     style={{ backgroundColor: theme.main }}
                   >
                     {theme.label}
                   </span>
                   {/* Subtle Date Tag */}
                   <div className="flex items-center gap-1 text-gray-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {item["Achievement_Date "] || "N/A"}
                      </span>
                   </div>
                </div>
                <h3 className="text-3xl font-bold text-[#2C3E50] leading-tight">
                   {item["Event Name/ Title"]}
                </h3>
              </div>

              {/* 3. DETAILS GRID (Position & Stipend) */}
              <div className="grid grid-cols-2 gap-4">
                 
                 {/* Item: Position (Bolded) */}
                 <div className={`p-4 rounded-2xl border ${theme.border} ${theme.bg} flex flex-col justify-center`}>
                    <div className="flex items-center gap-2 mb-1">
                      <svg className={`w-5 h-5 ${theme.icon}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Position Secured</p>
                    </div>
                    <p className="text-xl md:text-2xl font-black text-[#2C3E50] line-clamp-1" title={item["Your position /Achievement"]}>
                        {item["Your position /Achievement"]}
                    </p>
                 </div>

                 {/* Item: Stipend (Bolded) */}
                 <div className={`p-4 rounded-2xl border ${theme.border} ${theme.bg} flex flex-col justify-center`}>
                    <div className="flex items-center gap-2 mb-1">
                       <svg className={`w-5 h-5 ${theme.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                       <p className="text-[10px] uppercase font-bold text-gray-400">Reward</p>
                    </div>
                    <p className="text-xl md:text-2xl font-black text-[#2C3E50] line-clamp-1">
                        {finalStipend}
                    </p>
                 </div>

              </div>

              {/* 4. DESCRIPTION (Scrollable) */}
              <div className="relative pl-6 border-l-4 border-gray-200">
                 <div className="max-h-[140px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <p className="text-gray-500 italic font-medium leading-relaxed text-sm md:text-base">
                      "{item["Short Description about the event"]}"
                    </p>
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