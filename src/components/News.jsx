import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- HELPER FUNCTIONS ---
const formatNewsDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// --- IMAGE WIDGET ---
const NewsImageWidget = ({ category, imageUrl, currentIndex, totalCount }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const getGradient = () => {
    switch (category?.toLowerCase()) {
      case 'sports': return 'from-orange-500 to-red-500';
      case 'technology': return 'from-cyan-500 to-blue-600';
      case 'academic': return 'from-emerald-500 to-green-600';
      default: return 'from-[#E67E22] to-orange-500';
    }
  };

  const hasValidImage = imageUrl && !imgError;

  return (
    // Changed: Removed 'max-w-sm' to allow the image to fill the container width
    <div className="w-full"> 
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

        {/* B. FALLBACK GRADIENT LAYER */}
        <div className={`absolute inset-0 bg-gradient-to-bl ${getGradient()} transition-all duration-500 z-0 ${hasValidImage ? 'opacity-0' : 'opacity-90'}`} />

        {/* C. FALLBACK NOISE & ICON */}
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
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
          </>
        )}

        {/* D. BADGE */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${hasValidImage ? 'bg-green-400' : 'bg-white'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
              {hasValidImage ? 'Visual Context' : 'Generated View'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center opacity-70">
        <svg width="40" height="8" className="text-[#2C3E50]">
          <rect width="40" height="2" fill="currentColor" />
          <rect y="6" width="20" height="2" fill="currentColor" />
        </svg>
        <span className="font-mono text-[10px] text-[#2C3E50] font-bold">ID: {currentIndex + 1} / {totalCount}</span>
      </div>
    </div>
  );
};

// --- MAIN NEWS COMPONENT ---
const News = ({ data, currentIndex, totalCount }) => {
  if (!data) return null;

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
    <motion.div
      key={`content-${currentIndex}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-screen w-full pl-12 pr-8 flex items-center relative z-10"
    >
      {/* LEFT SIDE: NEWS CONTENT */}
      <div className="w-[65%] flex flex-col justify-center pr-12 h-full pt-20">

        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4">
          <span className="px-4 py-1 bg-[#E67E22]/10 border border-[#E67E22]/30 text-[#d35400] text-xs font-bold uppercase tracking-[0.15em] rounded-full">
            {data["Category of the News"] || "General"}
          </span>

          <span className="text-[#2C3E50]/60 text-xs font-mono uppercase tracking-widest flex items-center gap-3">
            <span className="font-bold">
              <span className='text-[#2C3E50]/40'> Published On -</span> {formatNewsDate(data["Timestamp"])}
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
          {data["News Headline"]}
        </motion.h1>

        <motion.div variants={itemVariants} className="relative pl-6 border-l-4 border-[#E67E22] mb-6">
          <p className="text-lg xl:text-2xl text-[#2C3E50] font-medium leading-relaxed line-clamp-3">
            {data["Brief Description of the News Story"]}
          </p>
        </motion.div>

        {data["Students Impact"] && (
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
              {data["Students Impact"]}
            </p>
          </motion.div>
        )}
      </div>

      {/* RIGHT SIDE: IMAGE WIDGET */}
      {/* Changed: Increased width slightly to 35% and added padding to let image scale naturally */}
      <div className="w-[35%] h-full flex items-center justify-center p-10">
        <motion.div variants={itemVariants} className="w-full">
          <NewsImageWidget
            category={data["Category of the News"]}
            imageUrl={data["Image"]}
            currentIndex={currentIndex}
            totalCount={totalCount}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default News;