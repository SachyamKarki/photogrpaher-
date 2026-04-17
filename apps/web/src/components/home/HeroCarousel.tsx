"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  slides: { src: string; alt: string }[];
  siteTitle: string;
};

export function HeroCarousel({ slides, siteTitle }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(nextSlide, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length, nextSlide]);

  return (
    <div className="group/hero absolute inset-0">
      {slides.map((slide, index) => (
        <div
          key={`${slide.src}:${index}`}
          className={[
            "absolute inset-0 transition-opacity duration-1000",
            index === activeIndex ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <Image
            src={slide.src}
            alt={slide.alt || siteTitle}
            fill
            priority={index === 0}
            quality={100}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

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

