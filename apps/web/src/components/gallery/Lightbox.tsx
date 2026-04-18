"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type LightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  image: string | null;
  title: string;
  onPrev?: () => void;
  onNext?: () => void;
};

export function Lightbox({
  isOpen,
  onClose,
  image,
  title,
  onPrev,
  onNext,
}: LightboxProps) {


  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();

    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-md p-4 sm:p-10"
      >
        {/* Top Controls */}
        <div className="absolute right-6 top-6 z-[120] flex items-center gap-4">
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Arrows */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-6 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-4 text-white transition hover:bg-white/20 focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-6 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-4 text-white transition hover:bg-white/20 focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}

        {/* Main Image Container */}
        <motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  className="relative h-full w-full max-w-6xl overflow-hidden rounded-xl"
>
  <Image
    src={image}
    alt={title}
    fill
    className="object-contain"
    sizes="100vw"
    priority
  />
</motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
