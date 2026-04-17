import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllGalleryImages } from "@/lib/gallery";
import type { GalleryImage } from "@/types";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ZoomableImage } from "@/components/gallery/ZoomableImage";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { allImages } = await getAllGalleryImages();
  const params = await props.params;
  const image = allImages.find((img: GalleryImage) => img._id === params.id);
  
  if (!image) {
    return { title: "Photo Not Found | Rabin Son Photography" };
  }

  return {
    title: `${image.title} | Rabin Son Photography`,
    description: image.metadata?.description || "Professional photography capture.",
  };
}

export default async function PhotoPage(props: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const id = params.id;
  const categoryFilter = searchParams?.category as string | undefined;

  const { allImages } = await getAllGalleryImages();

  const filteredImages = categoryFilter
    ? allImages.filter((img) => img.category?.slug === categoryFilter)
    : allImages;

  const currentIndex = filteredImages.findIndex((img) => img._id === id);
  const image = currentIndex !== -1 ? filteredImages[currentIndex] : allImages.find((img) => img._id === id);

  if (!image) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Photo not found</h1>
          <Link href="/gallery" className="text-zinc-400 hover:text-white transition">
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  // Next and Previous Logic based on current filtered array context
  let prevUrl = null;
  let nextUrl = null;

  if (currentIndex !== -1 && filteredImages.length > 1) {
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    
    const catQuery = categoryFilter ? `?category=${categoryFilter}` : "";
    
    prevUrl = `/photo/${filteredImages[prevIndex]._id}${catQuery}`;
    nextUrl = `/photo/${filteredImages[nextIndex]._id}${catQuery}`;
  }

  const catReturnQuery = categoryFilter ? `?category=${categoryFilter}` : "";

  return (
    <div className="relative flex h-[100dvh] w-screen flex-col overflow-hidden bg-black font-body text-white selection:bg-white/30">
      
      {/* Cinematic Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {image.imageUrl && (
          <Image
            src={image.imageUrl}
            alt="ambient background"
            fill
            className="object-cover opacity-50 blur-[100px] scale-110"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col w-full h-full">
      {/* Top Header */}
      <header className="flex w-full flex-none items-center justify-end p-6 sm:p-8 z-50 pointer-events-none">

        <Link 
          href={`/gallery${catReturnQuery}`}
          className="pointer-events-auto group flex items-center justify-center rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 hover:scale-105 backdrop-blur-md"
          aria-label="Back to Gallery"
        >
          <X className="h-6 w-6 stroke-[1.5]" />
        </Link>
      </header>

      {/* Main Image Area */}
      <main className="absolute inset-0 w-full h-full flex items-center justify-center z-10 pointer-events-none animate-in fade-in zoom-in-[0.98] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]">
        
        {/* Invisible Click Zones for Nav (Awwwards Standard) */}
        {prevUrl && (
          <Link href={prevUrl} className="absolute inset-y-0 left-0 w-[20vw] sm:w-[20vw] z-40 group cursor-w-resize flex items-center pointer-events-auto" aria-label="Previous">
            <div className="ml-2 sm:ml-12 opacity-50 sm:opacity-0 group-hover:opacity-100 transition-all duration-700 sm:-translate-x-8 sm:group-hover:translate-x-0 text-white/50 hover:text-white drop-shadow-md">
               <ChevronLeft className="h-8 w-8 sm:h-12 sm:w-12 stroke-[1.5] sm:stroke-[1]" />
            </div>
          </Link>
        )}

        {nextUrl && (
          <Link href={nextUrl} className="absolute inset-y-0 right-0 w-[20vw] sm:w-[20vw] z-40 group cursor-e-resize flex items-center justify-end pointer-events-auto" aria-label="Next">
            <div className="mr-2 sm:mr-12 opacity-50 sm:opacity-0 group-hover:opacity-100 transition-all duration-700 sm:translate-x-8 sm:group-hover:translate-x-0 text-white/50 hover:text-white drop-shadow-md">
               <ChevronRight className="h-8 w-8 sm:h-12 sm:w-12 stroke-[1.5] sm:stroke-[1]" />
            </div>
          </Link>
        )}

        {/* The Image Wrapper */}
        <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
          <ZoomableImage
            src={image.imageUrl || ""}
            alt={image.title}
          />
        </div>
      </main>

      </div>
    </div>
  );
}
