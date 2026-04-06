"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const brands = [
  "VOGUE", 
  "GQ", 
  "SONY", 
  "LEICA", 
  "KINFOLK", 
  "CEREAL", 
  "MONOCLE", 
  "ARTFORUM", 
  "WALLPAPER*"
];

export function BrandsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full py-16 sm:py-32 overflow-hidden bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-12 flex flex-col justify-center">
        <SectionHeading
          title="Collaborated Partners"
        />
      </div>
      
      {/* Scrollable Area with Inline Controls */}
      <div className="relative flex w-full items-center gap-4 sm:gap-8 mx-auto max-w-[90rem] px-4 sm:px-6 md:px-8">
        
        {/* Left Arrow Button */}
        <button 
          onClick={scrollLeft}
          className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-sm hidden sm:flex"
          aria-label="Scroll left"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Slider Container */}
        <div className="relative flex-1 overflow-hidden mx-auto select-none">
          {/* Left fade out mask */}
          <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-zinc-50 to-transparent z-10 pointer-events-none" />
        
        <div 
          ref={scrollRef}
          className="flex gap-16 md:gap-24 items-center whitespace-nowrap overflow-x-auto no-scrollbar py-4 px-6 snap-x snap-mandatory scroll-smooth w-full"
        >
          {brands.map((brand, i) => (
            <span 
              key={i} 
              className="font-serif text-xl md:text-3xl font-light tracking-[0.2em] uppercase text-zinc-300 transition-all duration-500 hover:text-zinc-900 hover:scale-105 cursor-default snap-center shrink-0"
            >
              {brand}
            </span>
          ))}
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-zinc-50 to-transparent z-10 pointer-events-none" />
        </div>

        {/* Right Arrow Button */}
        <button 
          onClick={scrollRight}
          className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-sm hidden sm:flex"
          aria-label="Scroll right"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
