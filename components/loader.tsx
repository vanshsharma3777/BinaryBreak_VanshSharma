"use client";

import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]">
      {/* Subtle ambient center glow - very faint white */}
      <div className="absolute w-[200px] h-[200px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Minimalist Spinner */}
        <div className="relative w-12 h-12">
          {/* Static Background Ring */}
          <div className="absolute inset-0 rounded-full border-[1.5px] border-zinc-800" />
          
          {/* Animated Foreground Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-[1.5px] border-t-zinc-200 border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Text with "Breathing" Opacity */}
        <motion.div 
          className="flex flex-col items-center gap-2"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
            Initialising
          </p>
          <div className="h-[1px] w-4 bg-zinc-700" />
        </motion.div>
      </div>
    </div>
  );
}