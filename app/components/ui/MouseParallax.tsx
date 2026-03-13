'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export function MouseParallax({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [windowCenter, setWindowCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCenter = () => {
      setWindowCenter({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  // Use springs for smooth interpolation
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // Calculate distance from center (-1 to 1)
    if (windowCenter.x === 0) return;
    const xDist = (e.clientX - windowCenter.x) / windowCenter.x;
    const yDist = (e.clientY - windowCenter.y) / windowCenter.y;
    
    mouseX.set(xDist);
    mouseY.set(yDist);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Map the -1 to 1 range to slight pixel transformations
  const xTransform = useTransform(mouseX, [-1, 1], [-25, 25]);
  const yTransform = useTransform(mouseY, [-1, 1], [-25, 25]);
  const xTransformInverse = useTransform(mouseX, [-1, 1], [15, -15]);
  const yTransformInverse = useTransform(mouseY, [-1, 1], [15, -15]);

  return (
    <div 
      ref={ref} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      {/* Background layer (moves opposite to mouse) */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ x: xTransformInverse, y: yTransformInverse }}
      >
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-gradient-to-tr from-[#efc07b]/10 to-transparent blur-[120px] mix-blend-screen rounded-full" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-gradient-to-bl from-[#a78bfa]/10 to-transparent blur-[100px] mix-blend-screen rounded-full" />
      </motion.div>

      {/* Foreground content layer (moves with mouse) */}
      <motion.div 
        className="relative z-10 w-full h-full"
        style={{ x: xTransform, y: yTransform }}
      >
        {children}
      </motion.div>
    </div>
  );
}
