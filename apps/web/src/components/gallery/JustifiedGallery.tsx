"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const ITEMS_PER_PAGE = 12;

function GalleryInner({ images, categories }: JustifiedGalleryProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");

  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  const allImages = images;

  const handleCategoryChange = (slug: string | null) => {
    if (slug === categoryParam) return;
    
    setIsFiltering(true);
    setCurrentPage(1); // Reset to first page when category changes
    
    setTimeout(() => {
      setIsFiltering(false);
    }, 500); // Premium skeleton loading duration
    
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/gallery?${params.toString()}`, { scroll: false });
  };

  const filteredImages = categoryParam
    ? allImages.filter((img: GalleryImage) => img.category?.slug === categoryParam)
    : allImages;

  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setIsFiltering(true);
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
    
    setTimeout(() => {
      setIsFiltering(false);
    }, 400); // Quick page-turn skeleton
  };

  const getPageNumbers = () => {
    const groupSize = 4;
    const startPage = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const isEmpty = filteredImages.length === 0;
  const activeCategoryLabel = categoryParam
    ? (categories.find((c) => c.slug === categoryParam)?.title ?? categoryParam)
    : "All";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for a premium feel
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98,
      transition: { duration: 0.3 }
    },
  };

  const skeletonContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const skeletonItem = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
  };

  const groupSize = 4;
  const currentGroupStart = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;

  const handleNextGroup = () => {
    const nextGroupStart = currentGroupStart + groupSize;
    if (nextGroupStart <= totalPages) {
      handlePageChange(nextGroupStart);
    } else if (currentPage < totalPages) {
      handlePageChange(totalPages);
    }
  };

  const handlePrevGroup = () => {
    const prevGroupStart = currentGroupStart - groupSize;
    if (prevGroupStart >= 1) {
      handlePageChange(prevGroupStart);
    } else if (currentPage > 1) {
      handlePageChange(1);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Category Filters - Horizontal Scroll on Mobile */}
      <div className="mb-12 border-b border-zinc-200/50 pb-px overflow-x-auto no-scrollbar">
        <div className="flex flex-nowrap gap-x-6 sm:gap-x-10 justify-start md:justify-center px-4 sm:px-0 min-w-max md:min-w-0">
          <button
            onClick={() => handleCategoryChange(null)}
            className={[
              "relative -mb-[1px] whitespace-nowrap pb-3 transition-colors",
              "font-body text-[11px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.08em]",
              categoryParam === null
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900",
            ].join(" ")}
          >
            All
            {categoryParam === null && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryChange(category.slug)}
                className={[
                  "relative -mb-[1px] whitespace-nowrap pb-3 transition-colors",
                  "font-body text-[11px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.08em]",
                  categoryParam === category.slug
                    ? "text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900",
                ].join(" ")}
              >
                {category.title}
                {categoryParam === category.slug && (
                  <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>
      </div>

      {/* Clean Uniform Grid with Layout Animations */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-1.5 min-h-[600px] sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isEmpty && !isFiltering ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="col-span-full flex min-h-[420px] items-center justify-center rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm"
            >
                <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
                  Gallery
                </p>
                <h3 className="mt-4 font-heading text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
                  Photos coming soon
                </h3>
                <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-600">
                  We&apos;re curating a focused selection for{" "}
                  <span className="font-medium text-zinc-900">{activeCategoryLabel.toUpperCase()}</span>.
                  Check back shortly.
                </p>
              </div>
            </motion.div>
          ) : isFiltering ? (
            <motion.div
              key="filtering-skeletons"
              variants={skeletonContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="contents"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  variants={skeletonItem}
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-md sm:rounded-lg bg-zinc-100/80 animate-pulse"
                />
              ))}
            </motion.div>
          ) : (
            paginatedImages.map((image: GalleryImage) => (
              <motion.div
                key={`${categoryParam || "all"}-${image._id}`}
                variants={itemVariants}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-md sm:rounded-lg bg-zinc-100 group cursor-pointer"
              >
                <Link
                  href={`/photo/${image._id}${categoryParam ? `?category=${categoryParam}` : ""}`}
                  className="absolute inset-0 z-10"
                >
                  <span className="sr-only">View {image.title}</span>
                </Link>

                {image.imageUrl ? (
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-95"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-400">
                    No image
                  </div>
                )}

              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Controls - Enhanced Grouped Window */}
      {!isEmpty && totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2 sm:gap-4">
          {currentPage > 1 && (
            <button
              onClick={handlePrevGroup}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-all hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-30 disabled:hover:border-zinc-200 disabled:hover:text-zinc-700"
              aria-label="Previous pages"
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
            </button>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={[
                  "h-10 w-10 rounded-full text-sm font-medium transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                  currentPage === pageNum
                    ? "bg-zinc-900 text-white scale-105 shadow-md"
                    : "bg-white text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
                ].join(" ")}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Next Button - Jumps to next group */}
          {currentPage < totalPages && (
            <button
              onClick={handleNextGroup}
              className="group flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-95 sm:px-6"
              aria-label="Next pages"
            >
              <span className="mr-1.5">Next</span>
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function JustifiedGallery(props: JustifiedGalleryProps) {
  return (
    <Suspense fallback={<div className="min-h-[400px] w-full animate-pulse bg-zinc-100 rounded-2xl" />}>
      <JustifiedGalleryKeyed {...props} />
    </Suspense>
  );
}

function JustifiedGalleryKeyed(props: JustifiedGalleryProps) {
  const searchParams = useSearchParams();
  const key = searchParams.get("category") ?? "all";
  return <GalleryInner key={key} {...props} />;
}
