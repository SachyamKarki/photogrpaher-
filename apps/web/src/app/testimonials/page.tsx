import type { Metadata } from "next";
import Link from "next/link";

import { ReviewsSection, type Review } from "@/components/home/ReviewsSection";
import { Reveal } from "@/components/ui/Reveal";
import { sanityServerClient } from "@/lib/sanity/serverClient";
import { REVIEWS_QUERY } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read what clients and collaborators say about working with RabinSon Photography across editorial, portrait, automotive, and adventure projects.",
  openGraph: {
    title: "Testimonials | RabinSon Photography",
    description:
      "Client and collaborator testimonials for RabinSon Photography.",
    images: [{ url: "/content/hero.jpg", width: 1200, height: 630 }],
  },
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const reviews = sanityServerClient
    ? await sanityServerClient.fetch<Review[]>(REVIEWS_QUERY)
    : [];

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28 xl:px-16">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Social Proof
            </p>
            <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Testimonials
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
              A closer look at what clients, collaborators, and portrait subjects
              say about the experience and the final work.
            </p>
          </div>
        </Reveal>

        <ReviewsSection reviews={reviews} />

        <Reveal delayMs={100}>
          <div className="mt-8 flex justify-center">
            <Link
              href="/#contact"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-900 px-6 text-sm font-medium tracking-[0.02em] text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
            >
              Start your inquiry
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
