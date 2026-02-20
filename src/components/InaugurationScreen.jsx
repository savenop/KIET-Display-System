import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Snowfall from 'react-snowfall';
import { FloatingShapes } from './BackgroundElements'; 

const InaugurationScreen = ({ 
  isSystemReady, 
  isLaunching, 
  isError, 
  loadingStatus, 
  onInaugurate, 
  onRetry 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-white/50 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
    >
      
      {/* Snowfall */}
      <Snowfall 
        color="#E67E22" 
        style={{ opacity: 0.4, zIndex: 10 }} 
        snowflakeCount={80}
        radius={[0.5, 3.0]}
        speed={[0.5, 2.0]}
      />
      
      {/* Floating Shapes */}
      <FloatingShapes />

      {/* Glass Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 p-12 rounded-3xl border border-white/40 shadow-2xl backdrop-blur-xl bg-white/30 max-w-2xl w-full mx-4 flex flex-col items-center text-center"
      >
        
        {/* Logo */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-5 rounded-2xl shadow-xl mb-8 transform rotate-3 hover:rotate-0 transition-transform duration-500"
        >
          <img 
            src="https://www.kiet.edu/favicon.ico" 
            className="h-20 w-20 object-contain" 
            alt="KIET Logo" 
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-5xl font-black tracking-widest text-[#2C3E50] uppercase drop-shadow-sm mb-2">
            KIET University
          </h1>
          <div className="h-1 w-24 bg-[#E67E22] mx-auto mb-4 rounded-full"></div>
          <p className="text-[#E67E22] text-sm font-bold tracking-[0.6em] uppercase">
            Department of Computer Science
          </p>
        </motion.div>

        {/* Outline Button with Enhanced Click Effect */}
        <div className="mt-12 relative flex justify-center items-center">
          
          {/* Expanding glow ring that appears on click */}
          <AnimatePresence>
            {isLaunching && (
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-[#E67E22] blur-md pointer-events-none"
              />
            )}
          </AnimatePresence>

          <motion.button
            whileHover={isSystemReady && !isLaunching ? { y: -6 } : {}}
            whileTap={isSystemReady && !isLaunching ? { scale: 0.96 } : {}}
            animate={isLaunching ? { scale: 1.05, boxShadow: "0px 0px 30px rgba(230,126,34,0.5)", borderColor: "#E67E22" } : {}}
            onClick={isSystemReady ? onInaugurate : onRetry}
            disabled={(!isSystemReady && !isError) || (isLaunching && isSystemReady)}
            className={`
              relative px-12 py-5 rounded-full font-black text-lg tracking-widest uppercase 
              transition-all duration-300 flex items-center gap-3 z-10
              border-2 backdrop-blur-md overflow-hidden group
              ${
                isSystemReady
                  ? "border-[#2C3E50] text-[#2C3E50] bg-transparent hover:bg-white/20 hover:shadow-xl"
                  : isError
                    ? "border-red-500 text-red-500 hover:bg-red-500/10"
                    : "border-gray-300 text-gray-400 bg-transparent cursor-wait"
              }
            `}
          >
            {/* Built-in Framer Motion Shimmer Effect */}
            {isSystemReady && !isLaunching && (
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none" 
              />
            )}

            {isLaunching ? (
              <span className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#E67E22] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[#E67E22]">Launching...</span>
              </span>
            ) : isSystemReady ? (
              <>
                <span className="text-[#E67E22] transition-transform duration-300 group-hover:rotate-90">✦</span> 
                Inaugurate 
                <span className="text-[#E67E22] transition-transform duration-300 group-hover:rotate-90">✦</span>
              </>
            ) : (
              "Loading Assets..."
            )}
          </motion.button>
        </div>

        {/* Footer Status */}
        <motion.p 
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-8 text-xs text-[#2C3E50]/70 font-mono uppercase tracking-wider"
        >
          {isSystemReady 
            ? "All API Fetched • Ready to Launch • Server Running" 
            : isError 
              ? "⚠ Connection Error (503)" 
              : loadingStatus}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default InaugurationScreen;