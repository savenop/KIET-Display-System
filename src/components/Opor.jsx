import React from 'react';
import { motion } from 'framer-motion';

// --- DUMMY DATA ---
const DATA = {
  company: "TCS iON",
  logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg", 
  role: "Young Professional Internship",
  description: "Join TCS's elite early-career program designed to bridge the gap between academic theory and industry reality. You will work on live cloud infrastructure projects and AI-driven automation tools under the mentorship of senior architects.",
  type: "Remote / Hybrid",
  targetAudience: "CS / IT / AI-DS (1st & 2nd Year)",
  deadline: "Feb 28, 2026",
  stipend: "₹15,000 - ₹25,000 / Month",
  link: "https://www.tcs.com/careers", 
  eligibility: [
    "B.Tech 2027/28 Batch",
    "Min CGPA: 6.0 (No Backlogs)",
    "Skill: Python / Java / C++",
    "Problem Solving"
  ]
};

const Opor = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 50 } 
    }
  };

  return (
    <motion.div 
      className="h-full w-full pt-32 pb-12 px-16 flex justify-between relative z-10 font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
    >
      {/* --- BACKGROUND WATERMARK --- */}
      <div className="absolute right-[-10%] bottom-[-10%] w-[80vh] h-[80vh] opacity-[0.04] pointer-events-none z-0">
         <img src={DATA.logo} alt="Watermark" className="w-full h-full object-contain grayscale" />
      </div>

      {/* --- LEFT COLUMN: CONTENT (60%) --- */}
      <div className="w-[60%] flex flex-col justify-center gap-8 relative z-10">
        
        {/* 1. Company Identity */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
           <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
              <img src={DATA.logo} alt="Company Logo" className="h-10 object-contain" />
           </div>
           <span className="text-[#E67E22] font-bold tracking-[0.2em] uppercase text-sm border-l-2 border-[#E67E22] pl-4">
              Official Campus Hiring
           </span>
        </motion.div>

        {/* 2. Main Title */}
        <motion.div variants={itemVariants}>
           <h1 className="text-6xl xl:text-7xl font-black text-[#2C3E50] leading-tight tracking-tight mb-2">
             {DATA.role}
           </h1>
           <div className="flex gap-4 text-[#7f8c8d] font-medium text-xl items-center">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                {DATA.type}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]"></span>
              <span className="text-[#2C3E50] font-bold">{DATA.stipend}</span>
           </div>
        </motion.div>

        {/* 3. Description */}
        <motion.div variants={itemVariants} className="border-l-4 border-[#2C3E50]/20 pl-6">
           <p className="text-xl text-[#2C3E50]/80 leading-relaxed max-w-2xl">
              {DATA.description}
           </p>
        </motion.div>

        {/* 4. Condensed Eligibility Block */}
        <motion.div variants={itemVariants} className="mt-4">
            <h3 className="text-[#E67E22] text-xs font-bold uppercase tracking-widest mb-4">
              Minimum Requirements
            </h3>
            <div className="bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-lg max-w-2xl">
              <div className="flex flex-wrap gap-3">
                 {DATA.eligibility.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="px-4 py-2 bg-[#2C3E50]/5 text-[#2C3E50] font-semibold text-lg rounded-lg border border-[#2C3E50]/10"
                    >
                      {item}
                    </span>
                 ))}
              </div>
            </div>
        </motion.div>

      </div>

      {/* --- RIGHT COLUMN: ACTION (35%) --- */}
      <div className="w-[35%] flex flex-col justify-end items-end relative z-10 pb-8 gap-10">
         
         {/* Deadline Alert */}
         <motion.div 
            variants={itemVariants}
            className="text-right"
         >
            <p className="text-[#E67E22] font-bold uppercase tracking-widest text-sm mb-1">Application Deadline</p>
            <p className="text-5xl font-mono font-black text-[#2C3E50] tracking-tighter">
               {DATA.deadline}
            </p>
         </motion.div>

         {/* QR Code Block */}
         <motion.div 
           variants={itemVariants}
           className="relative bg-white p-5 rounded-[2rem] shadow-2xl border-4 border-white/50"
         >
            <img 
               src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(DATA.link)}&color=2C3E50`} 
               alt="Scan to Apply" 
               className="w-56 h-56 mix-blend-multiply"
            />
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 origin-center translate-x-[-50%]">
               <span className="text-[#E67E22] font-bold text-xs uppercase tracking-[0.3em] whitespace-nowrap">
                  Scan to Apply
               </span>
            </div>
         </motion.div>

      </div>

    </motion.div>
  );
};

export default Opor;