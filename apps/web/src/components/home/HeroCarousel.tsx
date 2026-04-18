"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  slides: { src: string; alt: string }[];
};

type NetworkInformationLike = {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

function isSlowConnection(connection?: NetworkInformationLike | null) {
  if (!connection) return false;
  return connection.saveData === true || connection.effectiveType === "slow-2g" || connection.effectiveType === "2g";
}

export function HeroCarousel({ slides }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedDataMode, setReducedDataMode] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    const updateMode = () => setReducedDataMode(isSlowConnection(connection));

    updateMode();
    connection?.addEventListener?.("change", updateMode);

    return () => connection?.removeEventListener?.("change", updateMode);
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || reducedDataMode) return;

    const timer = window.setInterval(nextSlide, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length, nextSlide, reducedDataMode]);

  const activeSlide = slides[activeIndex];

  if (!activeSlide) return null;

  return (
    <div className="group/hero absolute inset-0">
      <div
        key={`${activeSlide.src}:${activeIndex}`}
        className="absolute inset-0 transition-opacity duration-700"
      >
        <Image
          src={activeSlide.src}
          alt={`High Altitude & Adventure Photography by RabinSon - ${activeSlide.alt}`}
          fill
          priority={activeIndex === 0}
          fetchPriority={activeIndex === 0 ? "high" : "auto"}
          loading={activeIndex === 0 ? "eager" : "lazy"}
          quality={reducedDataMode ? 60 : 82}
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Navigation Arrows - Visible on Hover */}
      <div className="absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-between px-4 sm:px-8 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500 pointer-events-none">
        <button
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10 text-white backdrop-blur-md transition-all hover:bg-black/30 pointer-events-auto"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10 text-white backdrop-blur-md transition-all hover:bg-black/30 pointer-events-auto"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 stroke-[1.5]" />
        </button>
      </div>

      {reducedDataMode && (
        <div className="absolute left-4 top-4 z-20 rounded-full bg-black/25 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-white backdrop-blur-sm sm:left-8 sm:top-8">
          Data saver mode
        </div>
      )}

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-10 z-20">
        {slides.map((slide, index) => (
          <button
            key={`${slide.src}:dot:${index}`}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={[
              "rounded-full transition-all duration-300",
              index === activeIndex 
                ? "h-2 w-2 bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                : "h-2 w-2 bg-white/40 hover:bg-white/70",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
