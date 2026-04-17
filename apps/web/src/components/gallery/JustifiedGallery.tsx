"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";


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

// Robust Fisher-Yates Shuffle algorithm for a truly random grid
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const ITEMS_PER_PAGE = 12;

function GalleryInner({ images, categories }: JustifiedGalleryProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setHasMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  // Client-side shuffle to ensure a fresh experience on every visit without hydration errors
  const [shuffledAll, setShuffledAll] = useState<GalleryImage[]>(images);
  
  useEffect(() => {
    if (hasMounted) {
      const handle = requestAnimationFrame(() => {
        setShuffledAll(shuffleArray(images));
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [images, hasMounted]);

  const allImages = shuffledAll;





  // Sync internal state when URL changes (e.g., back button)
  // This pattern is recommended by React for syncing props to state
  if (categoryParam !== selectedCategory) {
    setSelectedCategory(categoryParam);
  }

  const handleCategoryChange = (slug: string | null) => {
    if (slug === selectedCategory) return;
    
    setIsFiltering(true);
    setSelectedCategory(slug);
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

  const filteredImages = selectedCategory
    ? allImages.filter((img: GalleryImage) => img.category?.slug === selectedCategory)
    : allImages;

  const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setIsFiltering(true);
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
    
    setTimeout(() => {
      setIsFiltering(false);
    }, 400); // Quick page-turn skeleton
  };

  const isEmpty = filteredImages.length === 0;
  const activeCategoryLabel = selectedCategory
    ? (categories.find((c) => c.slug === selectedCategory)?.title ?? selectedCategory)
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

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Category Filters - Wrapped (single scroll area) */}
      <div className="mb-12 border-b border-zinc-200/50 pb-px">
        <div className="flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-10 justify-start sm:justify-center px-4 sm:px-0">
          <button
            onClick={() => handleCategoryChange(null)}
            className={[
              "relative -mb-[1px] whitespace-nowrap pb-3 transition-colors",
              "font-body text-ui font-semibold uppercase tracking-[0.12em] sm:text-sm",
              selectedCategory === null
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900",
            ].join(" ")}
          >
            All
            {selectedCategory === null && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryChange(category.slug)}
              className={[
                "relative -mb-[1px] whitespace-nowrap pb-3 transition-colors",
                "font-body text-ui font-semibold uppercase tracking-[0.12em] sm:text-sm",
                selectedCategory === category.slug
                  ? "text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900",
              ].join(" ")}
            >
              {category.title}
              {selectedCategory === category.slug && (
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
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
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
                key={`${selectedCategory || 'all'}-${image._id}`}
                variants={itemVariants}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-md sm:rounded-lg bg-zinc-100 group cursor-pointer"
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
                    loading="lazy"
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
      </motion.div>

      {/* Pagination Controls - Touch Optimized */}
      {!isEmpty && totalPages > 1 && (
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
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
