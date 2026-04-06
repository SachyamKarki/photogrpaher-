"use client";

import { useState, Suspense } from "react";
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

  // Sync internal state when URL changes (e.g., back button)
  // This pattern is recommended by React for syncing props to state
  if (categoryParam !== selectedCategory && !isSearching) {
    setSelectedCategory(categoryParam);
    setCurrentPage(1);
  }

  const activeCategory = isSearching ? (selectedCategory !== categoryParam ? selectedCategory : categoryParam) : categoryParam;

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

  const filteredImages = activeCategory
    ? images.filter((img) => img.category?.slug === activeCategory)
    : images;

  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const paginatedImages = filteredImages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      {/* Refined Minimalist Category Filters - Scrollable on Mobile */}
      <div className="relative mb-12">
        <div className="flex overflow-x-auto no-scrollbar border-b border-zinc-200/50 pb-px scroll-smooth">
          <div className="flex flex-nowrap gap-8 sm:gap-12 min-w-full justify-start sm:justify-center px-4 sm:px-0">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`relative text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors pb-4 -mb-[1px] whitespace-nowrap ${
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
                className={`relative text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors pb-4 -mb-[1px] whitespace-nowrap ${
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
        </div>
        
        {/* Subtle Fade Indicators for scrolling */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-zinc-50 to-transparent sm:hidden opacity-0" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-50 to-transparent sm:hidden" />
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
            paginatedImages.map((image) => (
              <motion.div
                key={image._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  // Industry Standard Optimized Grid Logic:
                  // 1. Flex Grow by aspect ratio (justified fill)
                  flexGrow: image.aspectRatio,
                  // 2. Responsive Flex Basis: 
                  // - On mobile (< 640px): strictly 2 columns (max 48% to fit two per row)
                  // - On larger screens: calculated based on aspect ratio height of 280px
                  flexBasis: `calc(min(48%, max(44%, ${image.aspectRatio * 160}px)))`,
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
                
                {/* Refined Cinematic Overlay - More visible on mobile touch */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:backdrop-blur-[2px] flex flex-col items-center justify-end pb-6 pointer-events-none p-4">
                  <div className="text-center translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {image.category && (
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/90 mb-1 sm:text-[9px] sm:tracking-[0.25em]">
                        {image.category.title}
                      </p>
                    )}
                    <h3 className="text-sm font-heading tracking-wide text-white drop-shadow-md sm:text-lg md:text-xl">
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

      {/* Pagination Controls - Touch Optimized */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentPage(i + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`rounded-full h-11 w-11 text-sm font-semibold transition-all active:scale-95 ${
                currentPage === i + 1
                  ? "bg-black text-white shadow-md scale-105"
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
