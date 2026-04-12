import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { aboutContent, portfolioCategories } from "@/lib/portfolio/data";
import { isSanityConfigured } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";
import { sanityServerClient } from "@/lib/sanity/serverClient";
import { HOME_CATEGORIES_QUERY } from "@/lib/sanity/queries";
import { HomeCategories } from "@/components/home/HomeCategories";

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
  coverImage?: unknown;
};

export default async function AboutPage() {
  const sanityEnabled = Boolean(sanityServerClient && isSanityConfigured);
  let categories: Category[] | null = null;

  if (sanityEnabled) {
    try {
      categories = await sanityServerClient!.fetch<Category[]>(HOME_CATEGORIES_QUERY);
    } catch {
      categories = null;
    }
  }

  const aboutCategories = (((categories?.length ?? 0) > 0 ? categories : null)
    ? (categories as Category[]).map(c => ({
      ...c,
      imageUrl: (c.coverImage && sanityEnabled)
        ? (typeof c.coverImage === "string" ? c.coverImage : urlFor(c.coverImage)?.width(1600).height(1000).url() ?? null)
        : (typeof c.coverImage === "string" ? c.coverImage : null)
    }))
    : portfolioCategories.map((c) => ({
      _id: `portfolio:${c.slug}`,
      title: c.title,
      slug: c.slug,
      description: c.description,
      imageUrl: c.image,
    }))).slice(0, 3);

  return (
    <>
      <main className="flex-1 bg-white text-zinc-900">
        {/* Hero Section */}
        <section className="px-4 pb-8 pt-32 sm:px-8 sm:pb-12 sm:pt-40 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1440px]">
            <Reveal>
              <div className="max-w-3xl">
                <h1 className="font-heading mt-4 text-xl font-semibold uppercase leading-tight tracking-tight text-zinc-900 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                  {aboutContent.title}
                </h1>
              </div>
            </Reveal>

            {/* Content Section */}
            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal delayMs={100}>
                <div className="space-y-6">
                  <p className="font-body text-sm leading-relaxed text-zinc-600 sm:text-base md:text-lg lg:text-xl">
                    Rabin Son is a Nepal-based filmmaker and photographer whose creative identity was forged in the thin air of the Himalayas. For over six years, he has embedded himself in some of the world&apos;s most remote and unforgiving terrains — not to conquer them, but to listen.
                  </p>
                  <p className="font-body text-xs leading-relaxed text-zinc-500 sm:text-sm md:text-base">
                    His camera is a tool of observation, trained on the quiet dramas that unfold at altitude: a porter&apos;s weathered hands, the last light on an ice wall, the stillness before a summit push. His philosophy rejects spectacle in favour of truth. Where others direct, Rabin Son waits.
                  </p>
                </div>
              </Reveal>

              <Reveal delayMs={200}>
                <div className="space-y-6 text-xs font-body leading-relaxed text-zinc-500 sm:text-sm md:text-base">
                  <p>
                    Years of working in extreme conditions have distilled his visual language into a balance between raw, visceral authenticity and quiet, considered elegance. Every frame is stripped of excess — no artificial colour grading, no forced compositions — leaving only what matters.
                  </p>
                  <p>
                    Whether documenting a 6,000-metre expedition, capturing the personality of a luxury vehicle, or directing an intimate studio portrait session, Rabin Son brings the same unwavering standard: technical precision and a deep reverence for the story in front of him.
                  </p>

                </div>
              </Reveal>
            </div>

            {/* CTAs */}
            <Reveal delayMs={300}>
              <div className="mt-12 flex flex-wrap gap-4 pt-10 border-t border-zinc-50">
                <Link
                  href="/#contact"
                  className="font-body inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-zinc-800 md:h-12 md:px-8"
                >
                  Start your inquiry
                </Link>
                <Link
                  href="/gallery"
                  className="font-body inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 px-6 text-xs font-bold uppercase tracking-widest text-zinc-900 transition hover:border-zinc-900 md:h-12 md:px-8"
                >
                  Explore the gallery
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Dynamic Category Showcase matching Home Page */}
        <section className="bg-white px-4 py-8 sm:px-8 sm:py-12 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-7xl">

            <HomeCategories categories={aboutCategories} />

            <Reveal delayMs={300}>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/gallery"
                  className="font-heading group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-black"
                >
                  View Full Gallery
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
