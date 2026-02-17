import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Component Imports
import News from './components/News';
import Award from './components/Award';
import Event from './components/Event';
import Opor from './components/Opor';

const NO_OF_SLIDES = 3;

// --- ANIMATED SVG BACKGROUND ---
const BackgroundSVG = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-[#F8F9FA]">
    <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FA] via-[#f3f4f6] to-[#e5e7eb]" />
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      className="absolute -right-[10%] -top-[40%] w-[70vh] h-[70vh] opacity-[0.05] border-[40px] border-dashed border-[#2C3E50] rounded-full"
    />
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      className="absolute -right-[5%] -top-[30%] w-[50vh] h-[50vh] opacity-[0.1] border-[2px] border-[#E67E22] rounded-full"
    />
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -left-[10%] -bottom-[20%] w-[60vw] h-[60vw] bg-gradient-to-tr from-[#E67E22]/20 to-transparent rounded-full blur-[100px]"
    />
    <div className="absolute bottom-0 left-0 w-full h-[40%] opacity-[0.1]" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(44, 62, 80, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(44, 62, 80, 0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to top, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
            transform: 'perspective(500px) rotateX(20deg) scale(1.5)',
            transformOrigin: 'bottom'
          }} 
    />
  </div>
);

const App = () => {
  // --- CENTRALIZED DATA STATES ---
  const [newsList, setNewsList] = useState([]); 
  const [awardsList, setAwardsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  
  // Connection States
  const [isError, setIsError] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Initializing...");

  // App Logic States
  const [isInaugurated, setIsInaugurated] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // Slideshow States
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [awardIndex, setAwardIndex] = useState(0);
  const [page, setPage] = useState(0); 
  const [progressKey, setProgressKey] = useState(0); 
  const [currentTime, setCurrentTime] = useState(new Date());

  const timerRef = useRef(null);

  // --- 1. ROBUST DATA FETCHING ---
  const fetchAllData = useCallback(async () => {
    setIsLaunching(true); // Shows spinner on button
    setIsError(false);
    setLoadingStatus("Connecting to Server...");

    try {
      // Promise.allSettled waits for ALL requests to finish (success or fail)
      const results = await Promise.allSettled([
        axios.get('/kietdata/news'),
        axios.get('/kietdata/filter?year=1'),
        axios.get('/kietdata/led')
      ]);

      const [newsRes, awardsRes, eventsRes] = results;

      // 1. Process News
      if (newsRes.status === 'fulfilled') {
        setNewsList(newsRes.value.data);
      } else {
        console.error("News Failed:", newsRes.reason);
      }

      // 2. Process Awards
      if (awardsRes.status === 'fulfilled') {
        setAwardsList(awardsRes.value.data.slice().reverse());
      } else {
        console.error("Awards Failed:", awardsRes.reason);
      }

      // 3. Process Events
      if (eventsRes.status === 'fulfilled') {
        const validEvents = eventsRes.value.data.filter(item => 
            item["Upload your Poster Image (JPEG/PNG recommended) or Short Video (MP4/MOV recommended)"]
        );
        setEventsList(validEvents.reverse());
      } else {
        console.error("Events Failed:", eventsRes.reason);
      }

      // If any critical data is missing, mark as error
      if (newsRes.status === 'rejected' || awardsRes.status === 'rejected' || eventsRes.status === 'rejected') {
        setIsError(true);
        setLoadingStatus("Server Unavailable (503)");
      }

    } catch (error) {
      console.error("Critical Failure:", error);
      setIsError(true);
      setLoadingStatus("Connection Error");
    } finally {
      setIsLaunching(false);
    }
  }, []);

  // Initial Fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // STRICT RULE: All 3 lists must have data to be "Ready"
  const isSystemReady = newsList.length > 0 && awardsList.length > 0 && eventsList.length > 0;

  // --- 2. INAUGURATION LOGIC ---
  const handleInauguration = () => {
    // Confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#E67E22', '#2C3E50', '#F39C12'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#E67E22', '#2C3E50', '#F39C12'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#E67E22', '#2C3E50', '#F39C12'] });

    frame();
    setIsLaunching(true);

    setTimeout(() => {
      setIsInaugurated(true);
      // FIXED: Force a fresh progress bar animation key
      setProgressKey(prev => prev + 1);
      resetTimer(); 
    }, 2000);
  };

  // --- 3. SLIDESHOW HANDLERS ---
  const handleNext = useCallback(() => {
    setPage((prevPage) => {
      if (prevPage === NO_OF_SLIDES) {
        setCurrentIndex((prevIdx) => (prevIdx + 1) % (newsList.length || 1));
        setAwardIndex((prev) => prev + 1); 
        return 0; 
      } else {
        return prevPage + 1; 
      }
    });
    setProgressKey(prev => prev + 1); 
  }, [newsList.length]);

  const handlePrev = useCallback(() => {
    setPage((prevPage) => {
      if (prevPage === 0) {
        setCurrentIndex((prevIdx) => prevIdx === 0 ? (newsList.length || 1) - 1 : prevIdx - 1);
        return NO_OF_SLIDES;
      } else {
        return prevPage - 1;
      }
    });
    setProgressKey(prev => prev + 1); 
  }, [newsList.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isInaugurated) {
        timerRef.current = setInterval(() => {
            handleNext();
        }, 10000);
    }
  }, [handleNext, isInaugurated]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isInaugurated) return;
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
  }, [handleNext, handlePrev, resetTimer, isInaugurated]); 

  return (
    <div className="h-screen w-full bg-[#F8F9FA] relative overflow-hidden font-sans text-[#2C3E50]">
      
      <BackgroundSVG />

      {/* --- INAUGURATION SCREEN --- */}
      <AnimatePresence>
        {!isInaugurated && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#F8F9FA]/80 backdrop-blur-sm"
          >
            <motion.div 
               initial={{ y: -20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="mb-12 flex flex-col items-center"
            >
                <div className="bg-[#000] p-4 rounded-xl shadow-2xl mb-4">
                     <img src="https://www.kiet.edu/favicon.ico" className='h-16 w-16 brightness-200 contrast-200 grayscale' alt="Kiet Logo" />
                </div>
                <h1 className="text-4xl font-black tracking-widest text-[#2C3E50] uppercase">KIET University</h1>
                <p className="text-[#E67E22] text-sm font-bold tracking-[0.5em] uppercase mt-2">Department of Computer Science</p>
            </motion.div>

            {/* SMART BUTTON */}
            <motion.button
              whileHover={isSystemReady ? { scale: 1.05, boxShadow: "0 0 30px rgba(230,126,34,0.6)" } : {}}
              whileTap={isSystemReady ? { scale: 0.95 } : {}}
              onClick={isSystemReady ? handleInauguration : fetchAllData} // Retry on click if error
              disabled={(!isSystemReady && !isError) || (isLaunching && isSystemReady)} // Disable only during normal loading
              className={`
                relative px-12 py-6 rounded-full font-black text-xl tracking-widest uppercase transition-all duration-500
                ${isSystemReady 
                  ? "bg-gradient-to-r from-[#E67E22] to-[#F39C12] text-white shadow-[0_0_20px_rgba(230,126,34,0.4)] cursor-pointer" 
                  : isError
                    ? "bg-red-500 text-white cursor-pointer hover:bg-red-600 shadow-lg" // Error State
                    : "bg-gray-200 text-gray-400 cursor-wait border-2 border-gray-300"} // Loading State
              `}
            >
              {isLaunching ? (
                 <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    {isSystemReady ? "Launching..." : "Connecting..."}
                 </span>
              ) : isError ? (
                 <span className="flex items-center gap-3">
                    ⚠️ Connection Failed. Retry?
                 </span>
              ) : isSystemReady ? (
                 <span className="flex items-center gap-3">
                    <span className="animate-pulse"></span> Inaugurate Display <span className="animate-pulse"></span>
                 </span>
              ) : (
                 <span className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Loading Systems...
                 </span>
              )}
              
              {isSystemReady && !isLaunching && !isError && (
                 <>
                  <span className="absolute inset-0 rounded-full border border-[#E67E22] animate-ping opacity-20"></span>
                  <span className="absolute -inset-1 rounded-full border border-[#E67E22] opacity-10 animate-pulse"></span>
                 </>
              )}
            </motion.button>
            
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-8 text-sm text-[#2C3E50]/60 font-mono"
            >
              {isSystemReady 
                ? "All Systems Operational. Ready for Launch." 
                : isError 
                  ? "Error: Backend Service Unavailable (503). Please check server." 
                  : `System Status: ${loadingStatus}`}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <div className={`transition-opacity duration-1000 ${isInaugurated ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* --- Top Progress Line --- */}
        <div className="absolute rounded-2xl top-0 left-0 w-full h-1.5 z-50 bg-[#2C3E50]/10">
          {/* FIXED: Only render this div when inaugurated is TRUE. This ensures it starts at 0% */}
          {isInaugurated && (
            <motion.div
              key={progressKey}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="h-full bg-gradient-to-r from-[#E67E22] to-[#F39C12] shadow-[0_0_10px_rgba(230,126,34,0.5)]"
            />
          )}
        </div>

        <div className="absolute top-10 left-12 z-50 flex items-center gap-4">
            <div className="bg-[#000000] text-white p-2 rounded-lg shadow-lg">
               <img src="https://www.kiet.edu/favicon.ico" className='h-8 w-9 brightness-200 contrast-200 grayscale' alt="Kiet Logo" />
            </div>
            <div>
               <h3 className="font-black text-xl leading-none tracking-wider uppercase text-[#000000]">KIET UNIVERSITY</h3>
               <p className="text-[#E67E22] text-xs font-bold tracking-[0.3em] uppercase">CS DEPARTMENT</p>
            </div>
        </div>

        <div className="absolute top-10 right-12 z-50 text-right hidden md:block">
            <h3 className="font-black text-xl leading-none tracking-wider uppercase text-[#000000]">
                {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </h3>
            <p className="text-[#E67E22] text-xs font-bold tracking-[0.3em] uppercase">
                {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
        </div>

        <AnimatePresence mode="wait">
          {/* We use isSystemReady to ensure arrays are not empty before rendering */}
          {isSystemReady && (
              <>
                {page === 0 ? (
                  <News 
                    data={newsList[currentIndex]} 
                    currentIndex={currentIndex} 
                    totalCount={newsList.length} 
                  />
                ) : page === 1 ? (
                  <motion.div
                    key={`award-slide-${page}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-screen w-full flex items-center justify-center z-20"
                  >
                     <Award 
                        slideIndex={awardIndex} 
                        preFetchedData={awardsList} 
                     />
                  </motion.div>
                ) : page === 2 ? (
                  <motion.div
                     key={`event-slide-${page}`}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="h-screen w-full flex items-center justify-center z-20"
                  >
                     <Event preFetchedData={eventsList} />
                  </motion.div>
                ) : (
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
              </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;