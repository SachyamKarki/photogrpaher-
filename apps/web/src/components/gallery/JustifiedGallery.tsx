"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

type GalleryImage = {
  _id: string;
  title: string;
  imageUrl: string | null;
  aspectRatio: number; // width / height
  category?: { title: string; slug: string };
  metadata?: {
    camera?: string;
    lens?: string;
    settings?: string;
    description?: string;
  };
};

type Category = {
  _id: string;
  title: string;
  slug: string;
};

type JustifiedGalleryProps = {
  images: GalleryImage[];
  categories: Category[];
};

function GalleryInner({ images, categories }: JustifiedGalleryProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || null);
  const [isSearching, setIsSearching] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [categoryParam]);

  const handleCategoryChange = (slug: string | null) => {
    if (slug === selectedCategory) return;
    
    setIsSearching(true);
    
    // Simulate a "search" phase for a premium feel
    setTimeout(() => {
      setSelectedCategory(slug);
      setCurrentPage(1);
      setIsSearching(false);
      
      if (slug) {
        router.push(`/gallery?category=${slug}`, { scroll: false });
      } else {
        router.push(`/gallery`, { scroll: false });
      }
    }, 600);
  };

  const filteredImages = selectedCategory
    ? images.filter((img) => img.category?.slug === selectedCategory)
    : images;

  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const paginatedImages = filteredImages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      {/* Refined Minimalist Category Filters */}
      <div className="mb-12 flex flex-wrap justify-center gap-8 sm:gap-12 border-b border-zinc-200/50 pb-4">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`relative text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors pb-4 -mb-[17px] ${
            selectedCategory === null
              ? "text-zinc-900"
              : "text-zinc-400 hover:text-zinc-900"
          }`}
        >
          All
          {selectedCategory === null && (
            <motion.div layoutId="activeGalleryFilter" className="absolute bottom-0 left-0 right-0 h-px bg-zinc-900" />
          )}
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryChange(category.slug)}
            className={`relative text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors pb-4 -mb-[17px] ${
              selectedCategory === category.slug
                ? "text-zinc-900"
                : "text-zinc-400 hover:text-zinc-900"
            }`}
          >
            {category.title}
            {selectedCategory === category.slug && (
              <motion.div layoutId="activeGalleryFilter" className="absolute bottom-0 left-0 right-0 h-px bg-zinc-900" />
            )}
          </button>
        ))}
      </div>

      {/* "Puzzle" Justified Grid */}
      <div className="flex flex-wrap gap-4 sm:gap-6 min-h-[600px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {isSearching ? (
            // Skeleton Loading State
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  flexGrow: i % 3 === 0 ? 1.5 : i % 3 === 1 ? 1 : 0.8,
                  flexBasis: `${(i % 3 === 0 ? 1.5 : i % 3 === 1 ? 1 : 0.8) * 200}px`,
                  aspectRatio: i % 3 === 0 ? "3/2" : i % 3 === 1 ? "1/1" : "4/5",
                }}
                className="relative overflow-hidden rounded-2xl bg-zinc-100"
              >
                <Skeleton className="h-full w-full" />
              </motion.div>
            ))
          ) : (
            paginatedImages.map((image, index) => (
              <motion.div
                key={image._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  flexGrow: image.aspectRatio,
                  flexBasis: `${image.aspectRatio * 200}px`,
                  aspectRatio: `${image.aspectRatio}`,
                }}
                className="relative overflow-hidden rounded-2xl bg-zinc-100 group cursor-pointer"
              >
                <Link
                  href={`/photo/${image._id}${selectedCategory ? `?category=${selectedCategory}` : ""}`}
                  className="absolute inset-0 z-10"
                >
                  <span className="sr-only">View {image.title}</span>
                </Link>

                {image.imageUrl ? (
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover transition duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-400">
                    No image
                  </div>
                )}
                
                {/* Refined Cinematic Overlay */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex flex-col items-center justify-center pointer-events-none p-4">
                  <div className="text-center translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {image.category && (
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/80 mb-2">
                        {image.category.title}
                      </p>
                    )}
                    <h3 className="text-lg md:text-xl font-heading tracking-wide text-white drop-shadow-md">
                      {image.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        
        {/* Helper to keep the last row from stretching too much */}
        {!isSearching && <div className="flex-grow-[100] basis-0" />}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentPage(i + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`rounded-full h-10 w-10 text-sm font-semibold transition ${
                currentPage === i + 1
                  ? "bg-black text-white"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:border-black hover:text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function JustifiedGallery(props: JustifiedGalleryProps) {
  return (
    <Suspense fallback={<div className="min-h-[400px] w-full animate-pulse bg-zinc-100 rounded-2xl" />}>
      <GalleryInner {...props} />
    </Suspense>
  );
}
