"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type LightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  image: string | null;
  title: string;
  metadata?: {
    camera?: string;
    lens?: string;
    settings?: string;
    description?: string;
  };
  onPrev?: () => void;
  onNext?: () => void;
};

export function Lightbox({
  isOpen,
  onClose,
  image,
  title,
  metadata,
  onPrev,
  onNext,
}: LightboxProps) {
  const [showInfo, setShowInfo] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "i" || e.key === "I") setShowInfo(prev => !prev);
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
            onClick={() => setShowInfo(!showInfo)}
            className={`rounded-full p-3 transition focus:outline-none ${
              showInfo ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
            aria-label="Toggle information"
            title="Press 'I' for info"
          >
            <Info className="h-6 w-6" />
          </button>
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
          
          {/* Simple Title Caption (always visible if not showing info) */}
          {!showInfo && (
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <p className="font-heading text-xs uppercase tracking-[0.2em] text-white/40">
                {title}
              </p>
            </div>
          )}
        </motion.div>

        {/* Professional Metadata Info Panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-0 left-0 right-0 z-[130] bg-black/60 backdrop-blur-xl border-t border-white/10 p-8 sm:p-12"
            >
              <div className="mx-auto max-w-4xl">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Technical Standard</h4>
                    <div className="mt-4 space-y-4">
                      {metadata?.camera && (
                        <div>
                          <p className="text-[11px] text-white/30 uppercase tracking-widest">Camera</p>
                          <p className="mt-1 text-sm font-medium text-white">{metadata.camera}</p>
                        </div>
                      )}
                      {metadata?.lens && (
                        <div>
                          <p className="text-[11px] text-white/30 uppercase tracking-widest">Lens</p>
                          <p className="mt-1 text-sm font-medium text-white">{metadata.lens}</p>
                        </div>
                      )}
                      {metadata?.settings && (
                        <div>
                          <p className="text-[11px] text-white/30 uppercase tracking-widest">Exif Data</p>
                          <p className="mt-1 text-sm font-medium text-white tracking-wide">{metadata.settings}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Artistic Context</h4>
                    <p className="mt-5 text-sm leading-relaxed text-white/70 italic">
                      {metadata?.description || "A focus on honest light and careful composition to create a timeless, editorial aesthetic that lasts beyond the current moment."}
                    </p>
                    <p className="mt-8 text-[11px] font-medium uppercase tracking-widest text-white/40">
                      Photography — {title}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
