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
  const ITEMS_PER_PAGE = 20;

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
  const isEmpty = !isSearching && filteredImages.length === 0;
  const activeCategoryLabel = activeCategory
    ? (categories.find((c) => c.slug === activeCategory)?.title ?? activeCategory)
    : "All";

  return (
    <div className="w-full">
      {/* Refined Minimalist Category Filters - Scrollable on Mobile */}
      <div className="relative mb-12">
        <div className="flex overflow-x-auto no-scrollbar border-b border-zinc-200/50 pb-px scroll-smooth">
          <div className="flex flex-nowrap gap-8 sm:gap-12 min-w-full justify-start sm:justify-center px-4 sm:px-0">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`relative text-sm sm:text-base font-semibold uppercase tracking-[0.24em] transition-colors pb-4 -mb-[1px] whitespace-nowrap ${
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
                className={`relative text-sm sm:text-base font-semibold uppercase tracking-[0.24em] transition-colors pb-4 -mb-[1px] whitespace-nowrap ${
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

      {/* Clean Uniform Grid */}
      <div className="grid grid-cols-2 gap-3 min-h-[600px] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
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
                className="relative aspect-[4/5] overflow-hidden rounded-lg bg-zinc-100"
              >
                <Skeleton className="h-full w-full" />
              </motion.div>
            ))
          ) : isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="col-span-full flex min-h-[420px] items-center justify-center rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm"
            >
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                  Gallery
                </p>
                <h3 className="mt-4 font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
                  Photos coming soon
                </h3>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-600">
                  We're curating a focused selection for{" "}
                  <span className="font-medium text-zinc-900">{activeCategoryLabel.toUpperCase()}</span>.
                  Check back shortly.
                </p>
              </div>
            </motion.div>
          ) : (
            paginatedImages.map((image) => (
              <motion.div
                key={image._id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-zinc-100 group cursor-pointer"
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
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-400">
                    No image
                  </div>
                )}

                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls - Touch Optimized */}
      {!isEmpty && totalPages > 1 && (
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
