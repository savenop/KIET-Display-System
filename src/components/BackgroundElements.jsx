import React from 'react';
import { motion } from 'framer-motion';

// 1. Grainy Texture Overlay
export const NoiseOverlay = () => (
  <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

// 2. Floating Background Shapes
export const FloatingShapes = () => {
  const shapes = [
    { type: 'circle', color: '#E67E22', size: 40, top: '20%', left: '10%', delay: 0 },
    { type: 'square', color: '#2C3E50', size: 60, top: '70%', left: '80%', delay: 2 },
    { type: 'triangle', color: '#F39C12', size: 50, top: '15%', left: '85%', delay: 4 },
    { type: 'circle', color: '#2C3E50', size: 30, top: '80%', left: '20%', delay: 1 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, rotate: 0, opacity: 0.1 }}
          animate={{ 
            y: [0, -40, 0], 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 15 + i * 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: shape.delay 
          }}
          className="absolute opacity-10 blur-sm"
          style={{
            top: shape.top,
            left: shape.left,
            width: shape.size,
            height: shape.size,
            backgroundColor: shape.type !== 'triangle' ? shape.color : 'transparent',
            borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'square' ? '12px' : '0',
            borderBottom: shape.type === 'triangle' ? `${shape.size}px solid ${shape.color}` : 'none',
            borderLeft: shape.type === 'triangle' ? `${shape.size/2}px solid transparent` : 'none',
            borderRight: shape.type === 'triangle' ? `${shape.size/2}px solid transparent` : 'none',
            width: shape.type === 'triangle' ? 0 : shape.size,
            height: shape.type === 'triangle' ? 0 : shape.size,
          }}
        />
      ))}
    </div>
  );
};

// 3. Animated SVG Background
export const BackgroundSVG = () => (
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
  </div>
);