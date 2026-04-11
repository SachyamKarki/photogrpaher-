import { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { JustifiedGallery } from "@/components/gallery/JustifiedGallery";
import { getAllGalleryImages } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Gallery | Rabinson Photography",
  description: "Explore our full collection of professional photography across weddings, portraits, and commercial projects in a justified puzzle layout.",
};

export default async function GalleryPage() {
  const { allImages, processedCategories } = await getAllGalleryImages();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-[1440px] px-2 pb-20 pt-8 sm:px-10 lg:px-16">
        <Reveal>
          <div className="mb-8" />
        </Reveal>

        <Reveal delayMs={100}>
          <JustifiedGallery
            images={allImages}
            categories={processedCategories}
          />
        </Reveal>

        <Reveal delayMs={200}>
          <div className="mt-20 flex justify-center">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-8 text-[13px] font-semibold uppercase tracking-widest text-zinc-900 shadow-sm transition hover:border-black hover:bg-black hover:text-white group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Back to Home
            </Link>
          </div>
        </Reveal>
      </main>

    </div>
  );
}
