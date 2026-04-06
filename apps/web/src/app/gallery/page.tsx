import { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { JustifiedGallery } from "@/components/gallery/JustifiedGallery";
import { getAllGalleryImages } from "@/lib/gallery";
import { demoFooter } from "@/lib/demo/content";

export const metadata: Metadata = {
  title: "Gallery | Rabinson Photography",
  description: "Explore our full collection of professional photography across weddings, portraits, and commercial projects in a justified puzzle layout.",
};

export default async function GalleryPage() {
  const { allImages, processedCategories } = await getAllGalleryImages();
  let siteTitle = "Rabinson Photography";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-[1440px] px-6 pb-20 pt-8 sm:px-10 lg:px-16">
        <Reveal>
          <div className="mb-8">
            <SectionHeading
              title="Portraits of Life"
              subtitle="Every individual photograph from our curated collections, categorized for your inspiration in a justified layout."
            />
          </div>
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
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-8 text-[13px] font-semibold uppercase tracking-widest text-zinc-900 shadow-sm transition hover:border-black hover:bg-black hover:text-white"
            >
              Back to Home
            </Link>
          </div>
        </Reveal>
      </main>

    </div>
  );
}
