"use client";

import { useRef } from "react";
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

  return (
    <div ref={galleryRef} className="scroll-mt-32">
      {/* Gallery Section */}
      <section id="work" className="py-16 sm:py-32">
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
            className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-12 lg:auto-rows-[220px] xl:auto-rows-[240px]"
          >
            <AnimatePresence mode="popLayout">
              {initialProjects.slice(0, 6).map((project, idx) => {
                const isBento = true;
                const cardClass = isBento
                  ? idx === 0
                    ? "lg:col-span-7 lg:row-span-3"
                    : idx === 1
                      ? "lg:col-span-5 lg:row-span-2"
                      : idx === 2
                        ? "lg:col-span-5 lg:row-span-1"
                        : "lg:col-span-4 lg:row-span-1"
                  : "lg:col-span-4 lg:row-span-1";

                return (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className={`${cardClass} group relative flex aspect-[3/4] sm:aspect-square lg:aspect-auto overflow-hidden rounded-xl sm:rounded-[2rem] border border-zinc-200 bg-zinc-900 shadow-sm transition hover:shadow-md cursor-pointer`}
                  >
                    <Link href={`/gallery`} className="absolute inset-0 block z-20">
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

                    <div className="relative z-10 flex h-full w-full flex-col justify-between p-3 sm:p-5 md:p-6 pointer-events-none">
                      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[0.5rem] sm:text-[0.6rem] font-bold uppercase tracking-[0.08em] text-white/90 backdrop-blur-md">
                        {project.category?.title || "Project"}
                      </div>

                      <div className="max-w-[90%]">
                        <div className="text-white">
                          <div className="text-sm font-semibold tracking-wide sm:text-base uppercase drop-shadow-sm leading-tight">
                            {project.title}
                          </div>
                        </div>
                        <div className="mt-3 inline-flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-white/80">
                          Explore <span className="transition-transform group-hover:translate-x-0.5">→</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
