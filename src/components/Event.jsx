import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Global memory to remember index across slide changes
let savedEventIndex = 0; 

const getDriveId = (url) => {
  if (!url) return null;
  let id = null;
  try {
    if (url.includes('id=')) {
      id = new URL(url).searchParams.get('id');
    } else if (url.includes('/d/')) {
      const parts = url.split('/d/');
      if (parts[1]) id = parts[1].split('/')[0];
    }
  } catch (e) {
    console.error("ID Parse Error:", e);
  }
  return id;
};

// --- UPDATED COMPONENT ---
const Event = ({ preFetchedData = [] }) => {
  // Use pre-fetched data
  const events = preFetchedData;

  // Initialize with the remembered global index
  const [currentIndex, setCurrentIndex] = useState(savedEventIndex);
  
  const [imgError, setImgError] = useState(false);
  const [isDeadLink, setIsDeadLink] = useState(false);

  // --- SYNC GLOBAL MEMORY & ADVANCE ON EXIT ---
  useEffect(() => {
    savedEventIndex = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    // When unmounting, push index forward by 1 for next time
    return () => {
      if (events && events.length > 0) {
        savedEventIndex = (savedEventIndex + 1) % events.length;
      }
    };
  }, [events]);

  // --- INTERNAL CYCLE TIMER ---
  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [events]);

  // Reset errors when the slide changes
  useEffect(() => {
    setImgError(false);
    setIsDeadLink(false);
  }, [currentIndex]);

  if (!events.length) return <div className="h-screen flex items-center justify-center text-gray-400">No Events Found</div>;

  // --- CURRENT ITEM ---
  const item = events[currentIndex % events.length]; // Safeguard index
  
  const rawUrl = item["Upload your Poster Image (JPEG/PNG recommended) or Short Video (MP4/MOV recommended)"];
  const type = item["Select Content Type"]?.toLowerCase() || "";
  const isVideo = type.includes("video") || type.includes("clip");
  const driveId = getDriveId(rawUrl);

  // --- MEDIA STRATEGY ---
  let mediaSrc = "";
  if (isVideo && driveId) {
      mediaSrc = `https://drive.google.com/uc?export=download&id=${driveId}`;
  } else if (driveId) {
      mediaSrc = !imgError 
        ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000` 
        : `https://drive.google.com/uc?export=view&id=${driveId}`;
  } else {
      mediaSrc = rawUrl;
  }

  return (
    <div className="relative h-screen w-full bg-white flex items-center justify-center overflow-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div
           animate={{ backgroundPosition: ['0px 0px', '-30px -30px'] }}
           transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 opacity-[0.3]"
           style={{
             backgroundImage: 'radial-gradient(circle, #94a3b8 2px, transparent 2px)', 
             backgroundSize: '30px 30px' 
           }}
         />
      </div>

      <AnimatePresence mode='wait'>
        <motion.div 
          key={currentIndex} 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 md:p-20"
        >
          {isDeadLink ? (
             <div className="text-red-400 font-mono text-sm bg-gray-50 p-4 rounded border border-red-200 text-center">
                 Media Not Accessible
             </div>
          ) : isVideo ? (
            <video 
               src={mediaSrc} 
               className="max-h-[85vh] max-w-full object-contain drop-shadow-xl rounded-lg" 
               autoPlay muted loop playsInline 
               onError={() => setIsDeadLink(true)}
            />
          ) : (
            <img 
               src={mediaSrc} 
               referrerPolicy="no-referrer"
               className="max-h-[85vh] max-w-full object-contain drop-shadow-xl rounded-lg" 
               alt="Event"
               onError={() => {
                   if (!imgError) {
                       setImgError(true);
                   } else {
                       setIsDeadLink(true);
                   }
               }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Event;