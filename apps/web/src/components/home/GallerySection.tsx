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
    targetRatio: 1.75,
  },
  {
    cardClass: "lg:col-span-5 lg:row-span-3 md:col-span-1 md:row-span-2",
    mobileClass: "col-span-1 row-span-1 aspect-square md:aspect-auto",
    targetRatio: 0.8,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-2 md:col-span-2 md:row-span-1",
    mobileClass: "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto",
    targetRatio: 1.35,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-2 md:col-span-1 md:row-span-1",
    mobileClass: "col-span-1 row-span-1 aspect-square md:aspect-auto",
    targetRatio: 1.2,
  },
  {
    cardClass: "lg:col-span-4 lg:row-span-2 md:col-span-1 md:row-span-1",
    mobileClass: "col-span-1 row-span-1 aspect-square md:aspect-auto",
    targetRatio: 1.2,
  },
  {
    cardClass: "lg:col-span-8 lg:row-span-2 md:col-span-2 md:row-span-2",
    mobileClass: "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto",
    targetRatio: 1.6,
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
      <section id="work" className="py-14 sm:py-20 lg:py-24">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              title="Featured Work"
              subtitle="A curated grid to highlight signature images and recent projects."
            />
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-14">
          <motion.div
            layout
            className="grid grid-cols-2 gap-2 auto-rows-[100px] sm:gap-2.5 sm:auto-rows-[125px] md:grid-cols-3 md:auto-rows-[145px] lg:grid-cols-12 lg:gap-3 lg:auto-rows-[122px] xl:auto-rows-[138px]"
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
                    className={`${slot.cardClass} ${slot.mobileClass} group relative md:aspect-auto overflow-hidden rounded-[1rem] sm:rounded-[1.35rem] md:rounded-[1.6rem] bg-zinc-900 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(0,0,0,0.14)] cursor-pointer`}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <button type="button" className="absolute inset-0 block z-20 w-full h-full text-left" aria-label={`View ${project.title}`} />

                    <div className="absolute inset-0 z-0 bg-zinc-900">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
                    </div>

                    <div className="pointer-events-none absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
                      <div className="inline-flex w-fit items-center gap-1 rounded-full bg-white/12 px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md">
                        {project.category?.title || "Project"}
                      </div>
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
                      <div className="max-w-[85%]">
                        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
                          Featured
                        </p>
                        <h3 className="mt-1 text-base font-semibold tracking-tight text-white sm:text-lg">
                          {project.title}
                        </h3>
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
