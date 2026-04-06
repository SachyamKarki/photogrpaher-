"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CategoriesShowcase } from "@/components/home/CategoriesShowcase";

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
};

type Project = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  imageUrl?: string | null;
  category?: { title: string; slug: string };
};

type Props = {
  initialCategories: Category[];
  initialProjects: Project[];
};

export function GallerySection({
  initialCategories,
  initialProjects,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const filteredProjects = activeCategory
    ? initialProjects.filter((p) => p.category?.slug === activeCategory)
    : initialProjects;

  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    router.push(`/gallery?category=${slug}`);
  };

  return (
    <div ref={galleryRef} className="scroll-mt-32">
      {/* Gallery Section */}
      <section id="work" className="py-16 sm:py-32">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              title={activeCategory ? initialCategories.find(c => c.slug === activeCategory)?.title || "Featured work" : "Featured work"}
              subtitle="A curated grid to highlight signature images and recent projects."
            />
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="mb-8 text-sm font-semibold uppercase tracking-widest text-zinc-400 transition hover:text-zinc-900"
              >
                ← Back to Featured
              </button>
            )}
          </div>
        </Reveal>

        <div className="mt-12 sm:mt-16">
          <motion.div 
            layout
            className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-12 lg:auto-rows-[220px] xl:auto-rows-[240px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.slice(0, 6).map((project, idx) => {
                const isFirst = idx === 0 && !activeCategory;
                const cardClass = isFirst 
                  ? "aspect-[4/5] sm:aspect-square md:aspect-auto lg:col-span-7 lg:row-span-3 lg:h-full lg:min-h-[400px]"
                  : idx === 1 && !activeCategory 
                  ? "aspect-[4/5] sm:aspect-square md:aspect-auto lg:col-span-5 lg:row-span-2 lg:h-full lg:min-h-[300px]"
                  : idx === 2 && !activeCategory 
                  ? "aspect-[4/5] sm:aspect-square md:aspect-auto lg:col-span-5 lg:row-span-1 lg:h-full"
                  : "aspect-[4/5] sm:aspect-square md:aspect-auto lg:col-span-4 lg:row-span-1 lg:h-full";

                return (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className={`${cardClass} group relative overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-900 shadow-sm transition hover:shadow-md`}
                  >
                    <Link href={`/gallery`} className="absolute inset-0 block">
                      <div className="absolute inset-0 bg-zinc-900">
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

                      <div className="relative flex h-full flex-col justify-between p-6">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                          {project.category?.title || "Project"}
                        </div>

                        <div>
                          <div className="text-white">
                            <div className="text-base font-semibold tracking-tight sm:text-lg uppercase">
                              {project.title}
                            </div>
                            {project.excerpt ? (
                              <div className="mt-1 line-clamp-2 text-sm text-zinc-200/90">
                                {project.excerpt}
                              </div>
                            ) : null}
                          </div>
                          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/90">
                            View in gallery <span className="transition-transform group-hover:translate-x-0.5">→</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Categories Section — Interactive Hover-Reveal */}
      <CategoriesShowcase categories={initialCategories} onCategoryClick={handleCategoryClick} />
    </div>
  );
}
