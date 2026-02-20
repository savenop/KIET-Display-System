import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- COMPONENT IMPORTS ---
import News from './components/News';
import Award from './components/Award';
import Event from './components/Event';
import Opor from './components/Opor';
import InaugurationScreen from './components/InaugurationScreen';
import { NoiseOverlay, BackgroundSVG } from './components/BackgroundElements';

const NO_OF_SLIDES = 3;

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
    setIsLaunching(true); 
    setIsError(false);
    setLoadingStatus("Connecting to Server...");

    try {
      const results = await Promise.allSettled([
        axios.get('/kietdata/latest-news?limit=5'),
        axios.get('/kietdata/filter?year=1'),
        axios.get('/kietdata/led')
      ]);

      const [newsRes, awardsRes, eventsRes] = results;

      if (newsRes.status === 'fulfilled') setNewsList(newsRes.value.data);
      if (awardsRes.status === 'fulfilled') setAwardsList(awardsRes.value.data.slice().reverse());
      if (eventsRes.status === 'fulfilled') {
        const validEvents = eventsRes.value.data.filter(item => 
            item["Upload your Poster Image (JPEG/PNG recommended) or Short Video (MP4/MOV recommended)"]
        );
        setEventsList(validEvents.reverse());
      }

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

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const isSystemReady = newsList.length > 0 && awardsList.length > 0 && eventsList.length > 0;

  // --- 2. INAUGURATION LOGIC (Optimized for Performance) ---
  const handleInauguration = () => {
    setIsLaunching(true);
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#E67E22', '#2C3E50', '#F39C12'];

    // Big initial burst from the center
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: colors });

    // Performant continuous bursts from the sides (every 250ms instead of every frame)
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({ particleCount: 20, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 20, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
    }, 250);

    // Give it 2.5s before fading the screen out
    setTimeout(() => {
      setIsInaugurated(true);
      setProgressKey(prev => prev + 1);
      resetTimer(); 
    }, 2500); 
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
      
      {/* GLOBAL BACKGROUND LAYERS */}
      <BackgroundSVG />
      <NoiseOverlay />
      
      {/* --- INAUGURATION SCREEN OVERLAY --- */}
      <AnimatePresence>
        {!isInaugurated && (
          <InaugurationScreen 
            isSystemReady={isSystemReady}
            isLaunching={isLaunching}
            isError={isError}
            loadingStatus={loadingStatus}
            onInaugurate={handleInauguration}
            onRetry={fetchAllData}
          />
        )}
      </AnimatePresence>

      {/* --- MAIN DISPLAY CONTENT --- */}
      <div className={`transition-all duration-1000 ${isInaugurated ? 'opacity-100 blur-0' : 'opacity-0 blur-xl pointer-events-none'}`}>
        
        {/* Progress Bar */}
        <div className="absolute rounded-2xl top-0 left-0 w-full h-1.5 z-50 bg-[#2C3E50]/5">
          {isInaugurated && (
            <motion.div
              key={progressKey}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="h-full bg-gradient-to-r from-[#E67E22] to-[#F39C12] shadow-[0_0_15px_rgba(230,126,34,0.6)]"
            />
          )}
        </div>

        {/* Header Left */}
        <div className="absolute top-10 left-12 z-50 flex items-center gap-4">
            <div className="bg-[#2C3E50] text-white p-2 rounded-lg shadow-xl ring-1 ring-white/50">
               <img src="https://www.kiet.edu/favicon.ico" className='h-8 w-9 brightness-200 contrast-200 grayscale' alt="Kiet Logo" />
            </div>
            <div>
               <h3 className="font-black text-xl leading-none tracking-wider uppercase text-[#2C3E50]">KIET UNIVERSITY</h3>
               <p className="text-[#E67E22] text-xs font-bold tracking-[0.3em] uppercase">CS DEPARTMENT</p>
            </div>
        </div>

        {/* Header Right */}
        <div className="absolute top-10 right-12 z-50 text-right hidden md:block">
            <h3 className="font-black text-xl leading-none tracking-wider uppercase text-[#2C3E50]">
                {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </h3>
            <p className="text-[#E67E22] text-xs font-bold tracking-[0.3em] uppercase">
                {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
        </div>

        {/* --- DYNAMIC SLIDES --- */}
        <AnimatePresence mode="wait">
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
                     <Award slideIndex={awardIndex} preFetchedData={awardsList} />
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