"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbox } from "./Lightbox";

type GalleryImage = {
  _id: string;
  title: string;
  imageUrl: string | null;
  category?: { title: string; slug: string };
};

type Category = {
  _id: string;
  title: string;
  slug: string;
};

type GalleryMasonryProps = {
  images: GalleryImage[];
  categories: Category[];
};

export function GalleryMasonry({ images, categories }: GalleryMasonryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = selectedCategory
    ? images.filter((img) => img.category?.slug === selectedCategory)
    : images;

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(
        (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
      );
    }
  };

  return (
    <div className="w-full">
      {/* Category Filters */}
      <div className="mb-12 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-widest transition ${
            selectedCategory === null
              ? "bg-black text-white"
              : "border border-zinc-200 bg-white text-zinc-600 hover:border-black hover:text-black"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setSelectedCategory(category.slug)}
            className={`rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              selectedCategory === category.slug
                ? "bg-black text-white"
                : "border border-zinc-200 bg-white text-zinc-600 hover:border-black hover:text-black"
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-6 break-inside-avoid"
            >
              <div
                onClick={() => setLightboxIndex(index)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-100"
              >
                {image.imageUrl ? (
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    width={800}
                    height={1000}
                    className="h-auto w-full object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center text-sm font-medium text-zinc-400">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 transition group-hover:opacity-100 flex items-end p-6">
                  <div className="text-white">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-100">
                      {image.category?.title}
                    </p>
                    <h3 className="mt-1 text-sm font-medium">{image.title}</h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        image={lightboxIndex !== null ? filteredImages[lightboxIndex]?.imageUrl : null}
        title={lightboxIndex !== null ? filteredImages[lightboxIndex]?.title : ""}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
