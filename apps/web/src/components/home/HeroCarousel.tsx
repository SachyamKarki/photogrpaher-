"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  slides: { src: string; alt: string }[];
  siteTitle: string;
};

export function HeroCarousel({ slides, siteTitle }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="absolute inset-0">
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
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-10">
        {slides.map((slide, index) => (
          <button
            key={`${slide.src}:dot:${index}`}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={[
              "h-1.5 rounded-full bg-white/55 transition-all",
              index === activeIndex ? "w-8 bg-white" : "w-3 hover:bg-white/80",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}

