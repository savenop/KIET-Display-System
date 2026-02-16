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
  const [imgError, setImgError] = useState(false); // false = try primary (thumb), true = try backup (view)
  const [isDeadLink, setIsDeadLink] = useState(false); // true = really dead

  // --- FETCH DATA ---
  useEffect(() => {
    if (eventsCache) return;
    const fetchData = async () => {
      try {
        const res = await axios.get('/kietdata/led');
        // Filter empty rows instantly
        const validData = res.data.filter(item => 
            item["Upload your Poster Image (JPEG/PNG recommended) or Short Video (MP4/MOV recommended)"]
        ).reverse();
        
        eventsCache = validData;
        setEvents(validData);
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
    setIsDeadLink(false);
  }, [slideIndex]);

  if (loading) return <div className="h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!events.length) return <div className="h-screen flex items-center justify-center text-gray-400">No Events Found</div>;

  // --- CURRENT SLIDE LOGIC ---
  const currentIndex = slideIndex % events.length;
  const item = events[currentIndex];
  
  const rawUrl = item["Upload your Poster Image (JPEG/PNG recommended) or Short Video (MP4/MOV recommended)"];
  const type = item["Select Content Type"]?.toLowerCase() || "";
  const isVideo = type.includes("video") || type.includes("clip");
  const driveId = getDriveId(rawUrl);

  // --- MEDIA STRATEGY (Force Thumbnail First) ---
  let mediaSrc = "";

  if (isVideo && driveId) {
      mediaSrc = `https://drive.google.com/uc?export=download&id=${driveId}`;
  } else if (driveId) {
      // STRATEGY 1 (Primary): Thumbnail API with High Res (Most Reliable)
      // STRATEGY 2 (Backup): Direct View Link
      mediaSrc = !imgError 
        ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000` 
        : `https://drive.google.com/uc?export=view&id=${driveId}`;
  } else {
      mediaSrc = rawUrl;
  }

  return (
    <div className="relative h-screen w-full bg-white flex items-center justify-center overflow-hidden">
      
      {/* BACKGROUND */}
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
          {/* MEDIA PLAYER */}
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
                // CRITICAL: This bypasses some Google referrer checks
                referrerPolicy="no-referrer"
                className="max-h-[85vh] max-w-full object-contain drop-shadow-xl rounded-lg" 
                alt="Event"
                onError={(e) => {
                    console.error("Image load failed for:", mediaSrc);
                    if (!imgError) {
                        console.warn("Switching to backup method...");
                        setImgError(true);
                    } else {
                        console.error("Both methods failed.");
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