import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// saving data here so it dont fetch again when u swipe pages
let achievementsCache = null;

const getAwardTheme = (pos) => {
  const p = pos?.toLowerCase() || "";
  if (p.includes("1st") || p.includes("winner") || p.includes("first")) return { color: "#fbbf24", label: "FANTASTIC" };
  if (p.includes("2nd") || p.includes("runner") || p.includes("second")) return { color: "#94a3b8", label: "SILVER" };
  if (p.includes("3rd") || p.includes("third")) return { color: "#d97706", label: "BRONZE" }; 
  return { color: "#8b5cf6", label: "KEEP IT UP" }; 
};

// this part shows the cards based on what slide u are on
const Award = ({ slideIndex = 0 }) => {
  const [achievements, setAchievements] = useState(achievementsCache || []);
  const [loading, setLoading] = useState(!achievementsCache);
  
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    // if we already got the data just stop here lol
    if (achievementsCache) return;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/kietdata/filter?year=2');
        const data = await response.json();
        
        // flip the list so newest stuff is at top
        const allData = data.slice().reverse();
        
        // putting everything in cache so it feels fast
        achievementsCache = allData;
        
        setAchievements(allData);
        setLoading(false);
      } catch (error) {
        console.error("oops something went wrong:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // doing some math to pick which 3 items to show
  const startIndex = slideIndex * ITEMS_PER_PAGE;
  const currentItems = achievements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#000000]">
      <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen bg-[#050505] text-white pt-24 px-6 md:px-10 pb-20 overflow-hidden">
      
      {/* --- some cool shapes moving in the back --- */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />
        
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            opacity: [0.1, 0.3, 0.1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 120, 0],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center"
        >
          <h2 className="text-amber-500 text-md font-black uppercase tracking-[0.6em] mb-0">
            Elite Student Recognition
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Wall of Fame
          </h1>
          {/* just a small text to show page number */}
          <div className="mt-2 text-white/20 text-sm tracking-widest">
            PAGE {slideIndex + 1}
          </div>
        </motion.div>

        {/* making sure there is actually stuff to show here */}
        {currentItems.length > 0 ? (
          <div className="grid w-full max-w-7xl mb-5 mx-auto gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((item, index) => {
              const theme = getAwardTheme(item["Your position /Achievement"]);
              
              return (
                <motion.div
                  key={`${slideIndex}-${index}`} // need this so react doesnt get confused
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-[3rem] p-5 flex flex-col items-center shadow-2xl overflow-hidden"
                >
                  {/* the shiny ribbon in the corner */}
                  <div className="absolute top-0 right-0 w-30 h-30 overflow-hidden pointer-events-none">
                    <div 
                      className="absolute top-5 right-[-5px] p-2 transform translate-x-8 -translate-y-2 rotate-45 text-center w-40 shadow-lg"
                      style={{ backgroundColor: theme.color }}
                    >
                      <span className="pl-3 text-[10px] font-black text-black uppercase text-center tracking-widest">
                       {item["Your position /Achievement"]}
                      </span>
                    </div>
                  </div>

                  {/* students avatar thingy */}
                  <div className="relative mb-8">
                    <div 
                      className="absolute -inset-4 blur-2xl opacity-20 rounded-full"
                      style={{ backgroundColor: theme.color }}
                    />
                    <div className="relative">
                      <img 
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(item["Student Name"])}`} 
                        className="w-44 h-44 rounded-3xl border-2 border-white/10 bg-[#0a0a0a] object-cover z-10 p-2 shadow-2xl"
                        alt="Student"
                      />
                      <div 
                        className="absolute -bottom-4 -right-4 p-3 rounded-2xl shadow-xl z-20 border border-white/20"
                        style={{ backgroundColor: theme.color }}
                      >
                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 2H6a2 2 0 00-2 2v2c0 1.1.9 2 2 2h1v3.31c0 2.09 1.41 3.84 3.31 4.41L9 19H8a1 1 0 000 2h8a1 1 0 000-2h-1l-1.31-3.28c1.9-.57 3.31-2.32 3.31-4.41V8h1c1.1 0 2-.9 2-2V4a2 2 0 00-2-2zM6 6V4h12v2h-1v2H7V6H6z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* all the text info about the win */}
                  <div className="text-center z-10 w-full">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {item["Student Name"]}
                    </h3>
                    
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">
                      {item.year}st Year <span className="mx-2 text-white/20">|</span> CS-{item.section}
                    </p>

                    <div className="bg-white/5 rounded-2xl py-4 px-6 mb-6 border border-white/5">
                      <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mb-1">
                        {item["Event Name/ Title"]}
                      </h4>
                      <p className="text-md font-medium text-white tracking-tight leading-tight">
                        {item["Organization \n[Organization in which event happened]".toUpperCase()]}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed italic line-clamp-2 px-2 opacity-80">
                      "{item["Short Description about the event"]}"
                    </p>
                  </div>

                  {/* light glow at the bottom of the card */}
                  <div 
                    className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-48 h-48 blur-[80px] opacity-20"
                    style={{ backgroundColor: theme.color }}
                  />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-white/30 text-xl tracking-widest mt-20">
              NO MORE ACHIEVEMENTS TO DISPLAY
          </div>
        )}
      </div>
    </div>
  );
};

export default Award;