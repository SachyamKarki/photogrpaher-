"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getMoreGalleryImages } from "@/app/gallery/actions";
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

function GalleryInner({ images, categories }: JustifiedGalleryProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || null);

  const [allRetrievedImages, setAllRetrievedImages] = useState<GalleryImage[]>(images);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(images.length >= 20); // Sync with initial fetch limit

  const [isFiltering, setIsFiltering] = useState(false);



  // Sync internal state when URL changes (e.g., back button)
  // This pattern is recommended by React for syncing props to state
  if (categoryParam !== selectedCategory) {
    setSelectedCategory(categoryParam);
  }

  const handleCategoryChange = (slug: string | null) => {
    if (slug === selectedCategory) return;
    
    setIsFiltering(true);
    setSelectedCategory(slug);
    
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

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const start = allRetrievedImages.length;
    const end = start + 12; // Load in smaller, faster chunks of 12
    
    const res = await getMoreGalleryImages(start, end);
    if (res.success && res.images.length > 0) {
      setAllRetrievedImages(prev => [...prev, ...res.images]);
      if (res.images.length < 12) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  const filteredImages = selectedCategory
    ? allRetrievedImages.filter((img: GalleryImage) => img.category?.slug === selectedCategory)
    : allRetrievedImages;

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

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Refined Minimalist Category Filters - Scrollable on Mobile */}
      <div className="relative mb-12">
        <div className="flex overflow-x-auto no-scrollbar border-b border-zinc-200/50 pb-px scroll-smooth">
          <div className="flex flex-nowrap gap-6 sm:gap-10 w-max justify-start sm:justify-center px-4 sm:px-0">
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
        
        {/* Subtle Fade Indicators for scrolling */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-zinc-50 to-transparent sm:hidden opacity-0" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-zinc-50 to-transparent sm:hidden" />
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
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-md sm:rounded-lg bg-zinc-200/60 animate-pulse"
              />
            ))
          ) : (
            filteredImages.map((image: GalleryImage) => (
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

      {/* "Load More" Integrated with high-end glassmorphism */}
      {!isEmpty && hasMore && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="group relative flex h-14 items-center justify-center gap-4 overflow-hidden rounded-full bg-black px-10 text-ui font-bold uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loadingMore ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <>
                <span>Load More</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-y-1"
                >
                  <path d="m7 7 5 5 5-5" />
                  <path d="m7 13 5 5 5-5" />
                </svg>
              </>
            )}
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </button>
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
