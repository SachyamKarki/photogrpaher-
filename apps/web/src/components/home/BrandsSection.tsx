"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { demoBrands } from "@/lib/demo/content";

export function BrandsSection() {
  // Duplicate the brands array to create a seamless loop
  const duplicatedBrands = [...demoBrands, ...demoBrands];

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-12">
        <SectionHeading 
          title="Industry Partners" 
          align="center"
        />
      </div>

      <div className="relative flex overflow-hidden">
        {/* Gradients for smooth fade in/out - merging with bg-zinc-50 */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-60 bg-gradient-to-r from-zinc-50 via-zinc-50/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-60 bg-gradient-to-l from-zinc-50 via-zinc-50/80 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex whitespace-nowrap gap-6 md:gap-12 items-center"
          animate={{
            x: [0, "-50%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicatedBrands.map((brand, i) => (
            <div
              key={i}
              className="flex items-center justify-center min-w-[100px] md:min-w-[160px] h-12 md:h-20 px-2"
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-full w-auto max-w-[140px] md:max-w-[200px] object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <span className="font-heading text-lg md:text-2xl font-bold tracking-[0.02em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors duration-300 cursor-default">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
