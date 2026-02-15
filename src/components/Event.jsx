import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// --- GLOBAL CACHE ---
let eventsCache = null;

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

const Event = ({ slideIndex = 0 }) => {
  const [events, setEvents] = useState(eventsCache || []);
  const [loading, setLoading] = useState(!eventsCache);
  const [imgError, setImgError] = useState(false); // Track if primary image failed
  
  // --- FETCH DATA ---
  useEffect(() => {
    if (eventsCache) return;
    const fetchData = async () => {
      try {
        // Using relative path to solve CORS error
        const res = await axios.get('/kietdata/led');
        const latestData = res.data.slice().reverse();
        eventsCache = latestData;
        setEvents(latestData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset error state when slide changes
  useEffect(() => {
    setImgError(false);
  }, [slideIndex]);

  if (loading) return <div className="bg-white h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!events.length) return <div className="bg-white h-screen flex items-center justify-center text-gray-400">No Events Found</div>;

  // --- CURRENT SLIDE LOGIC ---
  const currentIndex = slideIndex % events.length;
  const item = events[currentIndex];
  
  const rawUrl = item["Upload your Poster Image (JPEG/PNG recommended) or Short Video (MP4/MOV recommended)"];
  const type = item["Select Content Type"]?.toLowerCase() || "";
  const isVideo = type.includes("video") || type.includes("clip");
  const driveId = getDriveId(rawUrl);

  // --- MEDIA STRATEGY ---
  let mediaSrc = "";
  
  if (isVideo && driveId) {
      mediaSrc = `https://drive.google.com/uc?export=download&id=${driveId}`;
  } else if (driveId) {
      // STRATEGY 1: Thumbnail API (Fast, usually works) / STRATEGY 2: Direct View (Backup)
      mediaSrc = !imgError 
        ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920` 
        : `https://drive.google.com/uc?export=view&id=${driveId}`;
  } else {
      mediaSrc = rawUrl;
  }

  return (
    // Changed bg-black to bg-white
    <div className="relative h-screen w-full bg-white flex items-center justify-center overflow-hidden">
      
      {/* 1. WHITE ANIMATED DOTS BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div
           animate={{
             backgroundPosition: ['0px 0px', '-30px -30px'],
           }}
           transition={{
             duration: 6,
             repeat: Infinity,
             ease: "linear"
           }}
           className="absolute inset-0 opacity-[0.3]"
           style={{
             // Subtle gray dots pattern
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
          // Added padding to avoid hitting the logo/clock areas too hard
          className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 md:p-20"
        >
          {/* 2. THE MEDIA PLAYER (Clean, centered) */}
          {isVideo ? (
            <video 
                src={mediaSrc} 
                // Removed shadow-2xl for a cleaner look on white, added max-h for spacing
                className="max-h-[85vh] max-w-full object-contain drop-shadow-xl rounded-lg" 
                autoPlay muted loop playsInline 
            />
          ) : (
            <img 
                src={mediaSrc} 
                // Removed shadow-2xl for a cleaner look on white, added max-h for spacing
                className="max-h-[85vh] max-w-full object-contain drop-shadow-xl rounded-lg" 
                alt="Event"
                onError={(e) => {
                    if (!imgError) {
                        console.log("Primary image method failed, trying backup...");
                        setImgError(true);
                    } else {
                        e.target.style.display = 'none';
                        document.getElementById('final-error').style.display = 'block';
                    }
                }}
            />
          )}

          {/* 3. MINIMAL ERROR MESSAGE (Only if everything fails) */}
          <div id="final-error" className="hidden text-red-400 font-mono text-sm bg-gray-50 p-4 rounded border border-red-200 text-center">
              Media not accessible (Private Drive File)
          </div>

          {/* REMOVED TEXT OVERLAY SECTION COMPLETELY */}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Event;