"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Lightbox } from "@/components/gallery/Lightbox";


type Project = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string | null;
  featuredOrder?: number | null;
  aspectRatio?: number | null;
  metadata?: {
    camera?: string;
    lens?: string;
    settings?: string;
    description?: string;
  };
  category?: { title: string; slug: string };
};

type Props = {
  initialProjects: Project[];
};

const BENTO_SLOTS = [
  {
    cardClass: "lg:col-span-7 lg:row-span-3 md:col-span-2 md:row-span-2",
    mobileClass: "col-span-1 aspect-[4/5] sm:aspect-square md:aspect-auto",
    targetRatio: 1.75,
  },
  {
    cardClass: "lg:col-span-5 lg:row-span-3 md:col-span-1 md:row-span-2",
    mobileClass: "col-span-1 aspect-[4/5] sm:aspect-square md:aspect-auto",
    targetRatio: 0.8,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-2 md:col-span-2 md:row-span-1",
    mobileClass: "col-span-1 aspect-[4/5] sm:aspect-square md:aspect-auto",
    targetRatio: 1.35,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-2 md:col-span-1 md:row-span-1",
    mobileClass: "col-span-1 aspect-[4/5] sm:aspect-square md:aspect-auto",
    targetRatio: 1.2,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-2 md:col-span-1 md:row-span-1",
    mobileClass: "col-span-1 aspect-[4/5] sm:aspect-square md:aspect-auto",
    targetRatio: 1.2,
  },
  {
    cardClass: "lg:col-span-8 lg:row-span-2 md:col-span-2 md:row-span-2",
    mobileClass: "col-span-1 aspect-[4/5] sm:aspect-square md:aspect-auto",
    targetRatio: 1.6,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-2 md:col-span-1 md:row-span-1",
    mobileClass: "col-span-1 aspect-[4/5] sm:aspect-square md:aspect-auto",
    targetRatio: 0.85,
  },
] as const;

function getAspectRatio(project: Project) {
  return project.aspectRatio && project.aspectRatio > 0 ? project.aspectRatio : 1;
}

function buildBentoProjects(initialProjects: Project[]) {
  const slots: Array<Project | null> = Array(BENTO_SLOTS.length).fill(null);
  const remaining: Project[] = [];

  for (const project of initialProjects) {
    const order = project.featuredOrder;
    if (typeof order === "number" && order >= 1 && order <= BENTO_SLOTS.length) {
      const slotIndex = order - 1;
      if (!slots[slotIndex]) {
        slots[slotIndex] = project;
        continue;
      }
    }
    remaining.push(project);
  }

  for (let slotIndex = 0; slotIndex < BENTO_SLOTS.length; slotIndex += 1) {
    if (slots[slotIndex] || remaining.length === 0) continue;

    const targetRatio = BENTO_SLOTS[slotIndex].targetRatio;
    let bestIndex = 0;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let candidateIndex = 0; candidateIndex < remaining.length; candidateIndex += 1) {
      const candidate = remaining[candidateIndex];
      const score = Math.abs(getAspectRatio(candidate) - targetRatio);
      if (score < bestScore) {
        bestScore = score;
        bestIndex = candidateIndex;
      }
    }

    slots[slotIndex] = remaining.splice(bestIndex, 1)[0];
  }

  return slots.filter((project): project is Project => Boolean(project));
}

export function GallerySection({
  initialProjects,
}: Props) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const projects = buildBentoProjects(initialProjects);

  if (!initialProjects || initialProjects.length === 0) return null;

  return (
    <div ref={galleryRef} className="scroll-mt-32">
      {/* Gallery Section */}
      <section id="work" className="py-14 sm:py-20 lg:py-24">
        <Reveal>
          <div className="flex flex-col items-center justify-center gap-8">
            <SectionHeading
              title="Featured Work"
              subtitle="A curated grid to highlight signature images and recent projects."
            />
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-14">
          <motion.div
            layout
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-12 lg:gap-5 auto-rows-auto md:auto-rows-[145px] lg:auto-rows-[122px] xl:auto-rows-[138px]"
          >
            <AnimatePresence mode="popLayout">
              {projects.map((project, idx) => {
                const slot = BENTO_SLOTS[idx] ?? BENTO_SLOTS[BENTO_SLOTS.length - 1];
                const isHovered = hoveredIdx === idx;

                return (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.6, 
                      delay: idx * 0.05,
                      ease: [0.215, 0.61, 0.355, 1] 
                    }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`${slot.cardClass} ${slot.mobileClass} group relative overflow-hidden rounded-[1.25rem] sm:rounded-[1.75rem] lg:rounded-[2.25rem] bg-zinc-900 cursor-pointer transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <button type="button" className="absolute inset-0 block z-20 w-full h-full text-left" aria-label={`View ${project.title}`} />

                    <div className="absolute inset-0 z-0 bg-zinc-900">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={`${project.category?.title || "Professional"} photography by RabinSon - ${project.title}`}
                          fill
                          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                      )}
                      
                      {/* Dynamic Overlay */}
                      <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>

                    <div className="pointer-events-none absolute left-4 top-4 z-10 sm:left-6 sm:top-6 lg:left-8 lg:top-8">
                      <motion.div 
                        initial={false}
                        animate={{ 
                          y: isHovered ? -4 : 0,
                          scale: isHovered ? 1.05 : 1
                        }}
                        className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-xl border border-white/20 transition-colors duration-500 group-hover:bg-white/20 sm:px-4 sm:py-2 sm:text-[0.7rem]"
                      >
                        {project.category?.title || "Project"}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <Lightbox
              isOpen={selectedIdx !== null}
              onClose={() => setSelectedIdx(null)}
              image={selectedIdx !== null ? projects[selectedIdx]?.imageUrl || null : null}
              title={selectedIdx !== null ? projects[selectedIdx]?.title || "Gallery Image" : ""}
            />
          </motion.div>
        </div>

        <Reveal delayMs={200}>
          <div className="mt-12 sm:mt-16 flex justify-center">
            <Link
              href="/gallery"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-5 text-[10px] font-bold uppercase tracking-[0.05em] text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-black/10 group sm:h-10 sm:px-6 sm:text-xs"
            >
              <span>View Full Gallery</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </Reveal>

      </section>
    </div>
  );
}
