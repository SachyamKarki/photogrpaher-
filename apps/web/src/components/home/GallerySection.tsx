"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";


type Project = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string | null;
  category?: { title: string; slug: string };
};

type Props = {
  initialProjects: Project[];
};

export function GallerySection({
  initialProjects,
}: Props) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState(initialProjects);

  // Shuffle images on client mount to ensure a fresh, dynamic grid on every visit
  useEffect(() => {
    setProjects([...initialProjects].sort(() => Math.random() - 0.5));
  }, [initialProjects]);

  return (
    <div ref={galleryRef} className="scroll-mt-32">
      {/* Gallery Section */}
      <section id="work" className="py-16 sm:py-24 lg:py-32">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              title="Featured Work"
              subtitle="A curated grid to highlight signature images and recent projects."
            />
          </div>
        </Reveal>

        <div className="mt-12 sm:mt-16">
          <motion.div
            layout
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-12 lg:auto-rows-[140px] xl:auto-rows-[160px]"
          >
            <AnimatePresence mode="popLayout">
              {projects.map((project, idx) => {
                const getCardClass = (index: number) => {
                  switch (index) {
                    case 0: return "lg:col-span-7 lg:row-span-3";
                    case 1: return "lg:col-span-5 lg:row-span-2";
                    case 2: return "lg:col-span-5 lg:row-span-1";
                    case 3: return "lg:col-span-4 lg:row-span-1";
                    case 4: return "lg:col-span-4 lg:row-span-1";
                    case 5: return "lg:col-span-4 lg:row-span-1";
                    case 6: return "lg:col-span-6 lg:row-span-2";
                    case 7: return "lg:col-span-6 lg:row-span-2";
                    case 8: return "lg:col-span-8 lg:row-span-2";
                    case 9: return "lg:col-span-4 lg:row-span-2";
                    default: return "lg:col-span-4 lg:row-span-1";
                  }
                };
                const cardClass = getCardClass(idx);

                return (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className={`${cardClass} group relative flex aspect-square lg:aspect-auto overflow-hidden rounded-xl sm:rounded-[2rem] border border-zinc-200 bg-zinc-900 shadow-sm transition hover:shadow-md cursor-pointer`}
                  >
                    <Link href={`/photo/${project._id}`} className="absolute inset-0 block z-20">
                      <span className="sr-only">View {project.title}</span>
                    </Link>

                    <div className="absolute inset-0 bg-zinc-900 z-0">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.02]"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
                    </div>

                    <div className="absolute top-0 left-0 z-10 p-1.5 sm:p-2.5 pointer-events-none">
                      <div className="inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-[0.45rem] sm:text-[0.5rem] font-bold uppercase tracking-[0.08em] text-white/90 backdrop-blur-md shadow-sm">
                        {project.category?.title || "Project"}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        <Reveal delayMs={200}>
          <div className="mt-12 sm:mt-16 flex justify-center">
            <Link
              href="/gallery"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-8 text-xs font-semibold uppercase tracking-widest text-zinc-900 shadow-sm transition hover:border-black hover:bg-black hover:text-white group"
            >
              View Full Gallery
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </Reveal>

      </section>
    </div>
  );
}
