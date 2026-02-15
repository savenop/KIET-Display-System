import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
// Animations
import { motion, AnimatePresence } from 'framer-motion';
import Award from './components/Award'; 
import Event from './components/Event';
import Opor from './components/Opor'; // <--- 1. Import the new component

// Total slides count (indices: 0, 1, 2, 3)
// 0: News, 1: Award, 2: Event, 3: Opor
const NO_OF_SLIDES = 3; 

// --- 1. ANIMATED SVG BACKGROUND (Theme: Light/Clean) ---
const BackgroundSVG = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-[#F8F9FA]">
    {/* Subtle gradient base */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FA] via-[#f3f4f6] to-[#e5e7eb]" />
    
    {/* Large rotating ring */}
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      className="absolute -right-[10%] -top-[40%] w-[70vh] h-[70vh] opacity-[0.05] border-[40px] border-dashed border-[#2C3E50] rounded-full"
    />
    
    {/* Smaller rotating ring */}
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      className="absolute -right-[5%] -top-[30%] w-[50vh] h-[50vh] opacity-[0.1] border-[2px] border-[#E67E22] rounded-full"
    />
    
    {/* Soft Orange Glow Gradient */}
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -left-[10%] -bottom-[20%] w-[60vw] h-[60vw] bg-gradient-to-tr from-[#E67E22]/20 to-transparent rounded-full blur-[100px]"
    />
    
    {/* Grid Floor */}
    <div className="absolute bottom-0 left-0 w-full h-[40%] opacity-[0.1]" 
          style={{ 
            backgroundImage: `
              linear-gradient(rgba(44, 62, 80, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(44, 62, 80, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to top, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
            transform: 'perspective(500px) rotateX(20deg) scale(1.5)',
            transformOrigin: 'bottom'
          }} 
    />
    
    {/* Floating Particles */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-[#E67E22]/30 rounded-full blur-xl"
        initial={{ x: Math.random() * 1000, y: Math.random() * 1000, scale: 0 }}
        animate={{ 
          y: [null, Math.random() * -100],
          opacity: [0, 0.6, 0] 
        }}
        transition={{ 
          duration: Math.random() * 5 + 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: i * 1.5
        }}
        style={{ width: Math.random() * 100 + 50, height: Math.random() * 100 + 50 }}
      />
    ))}
  </div>
);

// --- 2. IMAGE WIDGET ---
const NewsImageWidget = ({ category, imageUrl }) => {
  const [imgError, setImgError] = useState(false);

  // Reset error state when image URL changes
  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const getGradient = () => {
    switch(category?.toLowerCase()) {
      case 'sports': return 'from-orange-500 to-red-500';
      case 'technology': return 'from-cyan-500 to-blue-600';
      case 'academic': return 'from-emerald-500 to-green-600';
      default: return 'from-[#E67E22] to-orange-500';
    }
  };

  const hasValidImage = imageUrl && !imgError;

  return (
    <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group bg-white">
      
      {/* A. REAL IMAGE LAYER */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="News Context"
          onError={() => setImgError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 z-10 ${imgError ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {/* B. FALLBACK GRADIENT LAYER (Visible if no image or image fails) */}
      <div className={`absolute inset-0 bg-gradient-to-bl ${getGradient()} transition-all duration-500 z-0 ${hasValidImage ? 'opacity-0' : 'opacity-90'}`} />
      
      {/* C. FALLBACK NOISE & ICON (Visible if no image) */}
      {!hasValidImage && (
        <>
          <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay z-0" width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center z-0">
             <svg className="w-32 h-32 text-white/40 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
             </svg>
          </div>
        </>
      )}

      {/* D. BADGE (Always on top) */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full animate-pulse ${hasValidImage ? 'bg-green-400' : 'bg-white'}`} />
           <span className="text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
             {hasValidImage ? 'Visual Context' : 'Generated View'}
           </span>
        </div>
      </div>
    </div>
  );
};

// --- HELPER FUNCTIONS ---
const formatNewsDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// --- MAIN COMPONENT ---
const App = () => {
  const [newsList, setNewsList] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [page, setPage] = useState(0); 
  const [progressKey, setProgressKey] = useState(0); 
  const [currentTime, setCurrentTime] = useState(new Date());

  const timerRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await axios.get('/kietdata/news');
      setNewsList(res.data); 
    } catch (error) {
      console.error("News fetch failed bhai:", error);
    }
  };

  // --- HANDLER: Next Slide ('N') ---
  const handleNext = useCallback(() => {
    setPage((prevPage) => {
      if (prevPage === NO_OF_SLIDES) {
        // Reset to 0 (News) and advance news index
        setCurrentIndex((prevIdx) => (prevIdx + 1) % (newsList.length || 1));
        return 0; 
      } else {
        return prevPage + 1; 
      }
    });
    setProgressKey(prev => prev + 1); 
  }, [newsList.length]);

  // --- HANDLER: Previous Slide ('P') ---
  const handlePrev = useCallback(() => {
    setPage((prevPage) => {
      if (prevPage === 0) {
        setCurrentIndex((prevIdx) => {
          return prevIdx === 0 ? (newsList.length || 1) - 1 : prevIdx - 1;
        });
        return NO_OF_SLIDES;
      } else {
        return prevPage - 1;
      }
    });
    setProgressKey(prev => prev + 1); 
  }, [newsList.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      handleNext();
    }, 20000);
  }, [handleNext]);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (newsList.length === 0) return;
    
    resetTimer();

    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (key === 'n' || event.key === 'ArrowRight') {
        handleNext();
        resetTimer();
      }
      if (key === 'p' || event.key === 'ArrowLeft') {
        handlePrev();
        resetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev, newsList.length, resetTimer]); 

  if (newsList.length === 0) {
      return (
        <div className="h-screen w-full bg-[#F8F9FA] flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-1 bg-[#E67E22] animate-pulse rounded-full" />
             <span className="text-[#2C3E50]/50 font-mono tracking-widest uppercase text-sm">Initializing Display System</span>
          </div>
        </div>
      );
  }

  const currentNews = newsList[currentIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 15 } 
    }
  };

  return (
    <div className="h-screen w-full bg-[#F8F9FA] relative overflow-hidden font-sans text-[#2C3E50]">
      
      <BackgroundSVG />

      {/* --- Top Progress Line --- */}
      <div className="absolute rounded-2xl top-0 left-0 w-full h-1.5 z-50 bg-[#2C3E50]/10">
        <motion.div
          key={progressKey}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 20, ease: "linear" }}
          className="h-full bg-gradient-to-r from-[#E67E22] to-[#F39C12] shadow-[0_0_10px_rgba(230,126,34,0.5)]"
        />
      </div>

      {/* --- University Logo --- */}
      <div className="absolute top-10 left-12 z-50 flex items-center gap-4">
          <div className="bg-[#000000] text-white p-2 rounded-lg shadow-lg">
             <img src="https://www.kiet.edu/favicon.ico" className='h-8 w-9 brightness-200 contrast-200 grayscale' alt="Kiet Logo" />
          </div>
          <div>
             <h3 className="font-black text-xl leading-none tracking-wider uppercase text-[#000000]">KIET UNIVERSITY</h3>
             <p className="text-[#E67E22] text-xs font-bold tracking-[0.3em] uppercase">CS DEPARTMENT</p>
          </div>
      </div>

      {/* --- Live Clock --- */}
      <div className="absolute top-10 right-12 z-50 text-right hidden md:block">
          <h3 className="font-black text-xl leading-none tracking-wider uppercase text-[#000000]">
              {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </h3>
          <p className="text-[#E67E22] text-xs font-bold tracking-[0.3em] uppercase">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
      </div>

      <AnimatePresence mode="wait">
        
        {page === 0 ? (
          // --- PAGE 0: NEWS SLIDE ---
          <motion.div
            key={`content-${currentIndex}`} 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="h-screen w-full pl-12 pr-8 flex items-center relative z-10"
          >
            
            {/* LEFT SIDE: NEWS CONTENT */}
            <div className="w-[70%] flex flex-col justify-center pr-12 h-full pt-20"> 
              
              <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1 bg-[#E67E22]/10 border border-[#E67E22]/30 text-[#d35400] text-xs font-bold uppercase tracking-[0.15em] rounded-full">
                  {currentNews["Category of the News"] || "General"}
                </span>
                
                <span className="text-[#2C3E50]/60 text-xs font-mono uppercase tracking-widest flex items-center gap-3">
                    <span className="font-bold">
                        <span className='text-[#2C3E50]/40'> Published On -</span> {formatNewsDate(currentNews["Timestamp"])}
                    </span>
                </span>
              </motion.div>

              <motion.h1 
                variants={itemVariants} 
                className="text-5xl xl:text-7xl font-black leading-[1.05] mb-6 tracking-tight 
                           bg-gradient-to-r from-[#E67E22] via-[#F39C12] to-[#D35400]
                           bg-clip-text text-transparent 
                           drop-shadow-sm line-clamp-3"
              >
                {currentNews["News Headline"]}
              </motion.h1>

              <motion.div variants={itemVariants} className="relative pl-6 border-l-4 border-[#E67E22] mb-6">
                <p className="text-lg xl:text-2xl text-[#2C3E50] font-medium leading-relaxed line-clamp-3">
                  {currentNews["Brief Description of the News Story"]}
                </p>
              </motion.div>

              {currentNews["Students Impact"] && (
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-[#FFFFFF] border border-gray-100 rounded-2xl p-6 shadow-xl max-w-[90%]"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E67E22]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        <h4 className="text-[#E67E22] text-xs font-bold uppercase tracking-widest">
                            Student Impact
                        </h4>
                    </div>
                    <p className="text-[#2C3E50]/80 text-base xl:text-lg leading-snug">
                        {currentNews["Students Impact"]}
                    </p>
                </motion.div>
              )}

            </div>

            {/* RIGHT SIDE: IMAGE WIDGET */}
            <div className="w-[30%] h-full flex items-center justify-center">
                <motion.div 
                  variants={itemVariants}
                  className="w-full max-w-sm"
                >
                  <NewsImageWidget 
                    category={currentNews["Category of the News"]} 
                    imageUrl={currentNews["Image"]} 
                  />
                  
                  <div className="mt-6 flex justify-between items-center opacity-70">
                      <svg width="40" height="8" className="text-[#2C3E50]">
                        <rect width="40" height="2" fill="currentColor" />
                        <rect y="6" width="20" height="2" fill="currentColor" />
                      </svg>
                      <span className="font-mono text-[10px] text-[#2C3E50] font-bold">ID: {currentIndex + 1} / {newsList.length}</span>
                  </div>
                </motion.div>
            </div>

          </motion.div>

        ) : page === 1 ? (

          // --- PAGE 1: AWARDS SLIDE ---
          <motion.div
            key={`award-slide-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen w-full flex items-center justify-center z-20"
          >
             <Award slideIndex={page - 1} />
          </motion.div>

        ) : page === 2 ? (

          // --- PAGE 2: EVENTS SLIDE ---
          <motion.div
             key={`event-slide-${page}`}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="h-screen w-full flex items-center justify-center z-20"
          >
             <Event slideIndex={page} />
          </motion.div>

        ) : (

          // --- PAGE 3: OPPORTUNITY SLIDE (NEW) ---
          <motion.div
             key={`opor-slide-${page}`}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="h-screen w-full flex items-center justify-center z-20"
          >
             <Opor />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default App;