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
    mobileClass: "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto",
    targetRatio: 1.7,
  },
  {
    cardClass: "lg:col-span-5 lg:row-span-2 md:col-span-1 md:row-span-2",
    mobileClass: "col-span-1 row-span-1 aspect-square md:aspect-auto",
    targetRatio: 0.8,
  },
  {
    cardClass: "lg:col-span-5 lg:row-span-1 md:col-span-1 md:row-span-1",
    mobileClass: "col-span-1 row-span-1 aspect-square md:aspect-auto",
    targetRatio: 1.8,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-2 md:col-span-2 md:row-span-1",
    mobileClass: "col-span-1 row-span-1 aspect-square md:aspect-auto",
    targetRatio: 1.25,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-1 md:col-span-1 md:row-span-1",
    mobileClass: "col-span-1 row-span-1 aspect-square md:aspect-auto",
    targetRatio: 1.4,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-1 md:col-span-1 md:row-span-1",
    mobileClass: "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto",
    targetRatio: 1.3,
  },
  {
    cardClass: "lg:col-span-6 lg:row-span-2 md:col-span-2 md:row-span-2",
    mobileClass: "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto",
    targetRatio: 1.55,
  },
  {
    cardClass: "lg:col-span-6 lg:row-span-2 md:col-span-1 md:row-span-1",
    mobileClass: "col-span-1 row-span-1 aspect-square md:aspect-auto",
    targetRatio: 1.2,
  },
  {
    cardClass: "lg:col-span-8 lg:row-span-2 md:col-span-2 md:row-span-1",
    mobileClass: "col-span-1 row-span-1 aspect-square md:aspect-auto",
    targetRatio: 1.8,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-2 md:col-span-1 md:row-span-1",
    mobileClass: "col-span-1 row-span-1 aspect-square md:aspect-auto",
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
  const projects = buildBentoProjects(initialProjects);

  if (!initialProjects || initialProjects.length === 0) return null;

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
            className="grid grid-cols-2 gap-2 auto-rows-[120px] sm:auto-rows-[140px] md:grid-cols-3 md:auto-rows-[150px] lg:grid-cols-12 lg:auto-rows-[140px] xl:auto-rows-[160px]"
          >
            <AnimatePresence mode="popLayout">
              {projects.map((project, idx) => {
                const slot = BENTO_SLOTS[idx] ?? BENTO_SLOTS[BENTO_SLOTS.length - 1];

                return (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className={`${slot.cardClass} ${slot.mobileClass} group relative md:aspect-auto overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-zinc-200 bg-zinc-900 shadow-sm transition hover:shadow-md cursor-pointer`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <button type="button" className="absolute inset-0 block z-20 w-full h-full text-left" aria-label={`View ${project.title}`} />

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

                    <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10 p-1.5 pointer-events-none">
                      <div className="inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-[0.45rem] sm:text-[0.5rem] font-bold uppercase tracking-[0.08em] text-white/90 backdrop-blur-md shadow-sm">
                        {project.category?.title || "Project"}
                      </div>
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
              metadata={selectedIdx !== null ? projects[selectedIdx]?.metadata : undefined}
            />
          </motion.div>
        </div>

        <Reveal delayMs={200}>
          <div className="mt-12 sm:mt-16 flex justify-center">
            <Link
              href="/gallery"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-black/20 bg-black/5 px-5 text-[10px] font-bold uppercase tracking-[0.05em] text-zinc-900 backdrop-blur transition hover:bg-black/10 sm:h-11 sm:px-7 sm:text-xs md:h-13 md:px-10 focus:outline-none focus:ring-2 focus:ring-black/20 group"
            >
              <span className="translate-y-[1px]">View Full Gallery</span>
            </Link>
          </div>
        </Reveal>

      </section>
    </div>
  );
}
