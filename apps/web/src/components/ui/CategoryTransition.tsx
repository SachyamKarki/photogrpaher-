"use client";

import { motion } from "framer-motion";

interface CategoryTransitionProps {
  title: string;
  isVisible: boolean;
}

export function CategoryTransition({ title, isVisible }: CategoryTransitionProps) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={{ scaleY: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      style={{ originY: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 pointer-events-none"
    >
      <div className="relative overflow-hidden text-center px-6">
        <motion.h2
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="font-heading text-4xl md:text-6xl xl:text-8xl font-bold uppercase tracking-tighter text-white"
        >
          {title}
        </motion.h2>
        
        {/* Subtle decorative elements */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isVisible ? "100%" : 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
          className="h-px bg-white/20 mt-8"
        />
      </div>
    </motion.div>
  );
}
