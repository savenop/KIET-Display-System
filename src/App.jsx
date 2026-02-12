import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Award from './components/Award';

// --- STUFF YOU CAN CHANGE ---
const NO_OF_SLIDES = 3; // how many award pages u want to show before it loops back
// ---------------------
  
const App = () => {
  const [newsList, setNewsList] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // page 0 is news, then 1, 2, 3 are the award slides
  const [page, setPage] = useState(1); 
  const [progressKey, setProgressKey] = useState(0);

  // grabbing news from that api
  const fetchData = async () => {
    try {
      // make sure the token is still working lol
      const res = await axios.get(
        'https://api.thenewsapi.com/v1/news/all?api_token=WpQFPVYX0g4HzIClr578PI1Wjb3a4vc2MPeUzqJ8&search=tech|ai|india&language=en'
      );
      setNewsList(res.data.data);
    } catch (error) {
      console.error("news fetch failed man:", error);
    }
  };

  // run this once when the app starts up
  useEffect(() => {
    fetchData();
  }, []);

  // this is the main loop that switches slides automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prevPage) => {
        // if we finished all award slides, go back to news and pick a new one
        if (prevPage === NO_OF_SLIDES) {
          setCurrentIndex((prevIdx) => (prevIdx + 1) % newsList.length);
          setImageLoaded(false); 
          return 0;
        } 
        // just move to the next slide in the sequence
        else {
          return prevPage + 1;
        }
      });
      
      // resetting the timer bar at the top
      setProgressKey(prev => prev + 1);
      
    }, 20000); // stay on each slide for 20 seconds

    return () => clearInterval(interval);
  }, [newsList.length]);

  // show this if the internet is slow and news aint here yet
  if (newsList.length === 0) {
     return (
       <div className="h-screen w-full bg-[#0a0a0a] flex justify-center items-center">
         <div className="text-white/20 animate-pulse font-light tracking-[0.5em] text-4xl">INITIALIZING SYSTEM</div>
       </div>
     );
  }

  const currentNews = newsList[currentIndex];

  return (
    <div className="h-screen w-full bg-[#0a0a0a] relative overflow-hidden">
      
      {/* that subtle grid pattern in the background */}
      <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />

      {/* the orange progress bar at the very top */}
      <div className="absolute top-0 left-0 w-full h-1 z-50 bg-white/5">
        <motion.div
          key={progressKey}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 20, ease: "linear" }}
          className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"
        />
      </div>

      <AnimatePresence mode="wait">
        {page === 0 ? (
          // --- THE NEWS SCREEN ---
          <motion.div
            key={`news-${currentIndex}`} 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="h-screen w-full flex justify-center items-center p-4 md:p-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] to-[#000000]"
          >
             <div className='text-white absolute top-8 left-8 z-20'>
                <img src="/image.png" onClick={fetchData} className='h-20 rounded-sm px-3' alt="Logo" />
             </div>

            <div className="relative group max-w-5xl w-full min-h-[60%] max-h-[97%] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row">
              <div className="p-8 md:p-14 flex-[1.5] flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-[1px] w-8 bg-amber-500/50"></span>
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-500/80">
                    {currentNews.categories[0]}
                  </span>
                </div>
                <h1 className="text-white text-3xl md:text-5xl font-medium leading-[1.15] mb-6 line-clamp-3">
                  {currentNews.title}
                </h1>
                <p className="text-gray-400 text-lg font-light leading-relaxed mb-8 line-clamp-3">
                  {currentNews.description}
                </p>
                <a href={currentNews.url} target="_blank" rel="noopener noreferrer" className="w-fit px-8 py-2 rounded-full bg-white/5 text-white/70 text-xs font-bold uppercase tracking-widest border border-white/10 hover:bg-white hover:text-black transition-all">
                  Source: {currentNews.source}
                </a>
              </div>

              <div className="w-full md:w-[40%] min-h-[250px] relative bg-white/5 order-first md:order-last">
                {!imageLoaded && (
                   <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                     <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                   </div>
                )}
                <img 
                  src={currentNews.image_url} 
                  onLoad={() => setImageLoaded(true)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  alt="news"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent" />
              </div>
            </div> 
          </motion.div>
        ) : (
          // --- THE AWARD SCREENS ---
          // passing the index here so it knows which students to show
          <motion.div
            key={`award-page-${page}`} // key helps framer motion know when to slide
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="h-screen w-full bg-[#0a0a0a] flex justify-center items-center"
          >
              <Award slideIndex={page - 1} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;