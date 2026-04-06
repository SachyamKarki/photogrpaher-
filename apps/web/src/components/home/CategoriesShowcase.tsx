"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
};

type Props = {
  categories: Category[];
  onCategoryClick: (slug: string) => void;
};

export function CategoriesShowcase({ categories, onCategoryClick }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="categories" className="scroll-mt-24 py-16 sm:py-32">
      {/* Section heading */}
      <Reveal>
        <div className="mb-12 sm:mb-20">
          <SectionHeading
            title="Explore by category"
            subtitle="A curated selection of work across distinct photographic styles."
          />
        </div>
      </Reveal>

      {/* Elite Floating Accordion Carousel — Large Desktop */}
      <div className="hidden xl:flex w-full h-[600px] xl:h-[700px] gap-3 group/container" onMouseLeave={() => setHoveredIdx(null)}>
        {categories.map((c, idx) => {
          const isHovered = hoveredIdx === idx;
          
          return (
            <motion.div
              key={c._id}
              layout
              initial={false}
              animate={{ flex: isHovered ? 3.5 : 1 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onClick={() => onCategoryClick(c.slug)}
              style={{ minWidth: 0 }} // prevents flex item from blowing out
              className={`relative overflow-hidden rounded-[2rem] cursor-pointer group/card ${isHovered ? "is-hovered" : ""}`}
            >
              {/* Animated Inner Image Layer */}
              <div className="absolute inset-0 bg-zinc-900 overflow-hidden">
                {c.imageUrl ? (
                  <motion.div layout className="absolute inset-0 w-full h-full origin-center">
                    <Image
                      src={c.imageUrl}
                      alt={c.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 33vw, 50vw"
                    />
                  </motion.div>
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
                )}
              </div>

              {/* Dynamic Gradients */}
              <motion.div layout="position" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-700 group-hover/card:opacity-95" />
              <motion.div layout="position" className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-40 transition-opacity duration-700 group-hover/card:opacity-0" />

              {/* Animated Text Content */}
              <motion.div layout="position" className="absolute inset-x-0 bottom-0 p-8 xl:p-10 flex flex-col justify-end h-full pointer-events-none">
                <div className="mt-auto">
                  <h3 className="font-heading text-3xl xl:text-5xl font-bold uppercase tracking-tight text-white transition-all duration-700 w-full truncate mb-0 group-hover/card:mb-4">
                    {c.title}
                  </h3>
                
                  {/* CSS Grid trick for perfectly smooth accordion height animation */}
                  <div className="grid grid-rows-[0fr] group-[.is-hovered]/card:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                    <div className="overflow-hidden">
                      <div className="w-full h-px bg-white/20 mb-5 transform origin-left scale-x-0 group-[.is-hovered]/card:scale-x-100 transition-transform duration-700 delay-100"></div>
                      {c.description && (
                        <p className="text-sm font-medium leading-relaxed text-zinc-300 max-w-sm mb-6 opacity-0 group-[.is-hovered]/card:opacity-100 transition-opacity duration-700 delay-200 line-clamp-2 pr-4">
                          {c.description}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white opacity-0 group-[.is-hovered]/card:opacity-100 transition-opacity duration-700 delay-300">
                        Explore Gallery
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Standard Grid / Mobile Stacked — Tablet and Below */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:hidden gap-4 sm:gap-6">
        {categories.map((c, idx) => (
          <Reveal key={c._id} delayMs={idx * 100}>
            <div
              onClick={() => onCategoryClick(c.slug)}
              className="group relative h-[320px] sm:h-[400px] w-full cursor-pointer overflow-hidden rounded-[2rem]"
            >
              <div className="absolute inset-0 bg-zinc-900">
                {c.imageUrl ? (
                  <Image
                    src={c.imageUrl}
                    alt={c.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
                )}
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5 opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="font-heading text-3xl sm:text-4xl font-semibold uppercase tracking-tight text-white mb-2 transform transition-transform duration-500 group-hover:-translate-y-1">
                  {c.title}
                </h3>
                {c.description && (
                  <p className="text-sm leading-relaxed text-zinc-300 line-clamp-2 transform transition-transform duration-500 group-hover:-translate-y-1">
                    {c.description}
                  </p>
                )}
                
                <div className="mt-6 flex items-center gap-4 overflow-hidden">
                  <div className="h-px w-12 bg-white/30 transform origin-left transition-all duration-500 group-hover:w-16 group-hover:bg-white/60" />
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition-colors duration-500 group-hover:text-white transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    Explore Gallery
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
