import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/ui/Reveal";
import { demoAbout, demoFooter } from "@/lib/demo/content";

export default function AboutPage() {
  return (
    <>
      <main className="flex-1 bg-[#f8f5f0] text-zinc-900">
        <section className="px-6 pb-16 pt-28 sm:px-10 sm:pb-20 sm:pt-32 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="max-w-3xl">
                <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {demoAbout.title}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
                  {demoAbout.body}
                </p>
                <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
                  Every session is built around calm direction, thoughtful
                  planning, and a visual style that feels timeless rather than
                  overdone. The goal is simple: create photographs that feel
                  personal, elevated, and easy to return to for years.
                </p>
                <p className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
                  {demoAbout.note}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/#contact"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    Start your inquiry
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-900 transition hover:border-zinc-900"
                  >
                    Back to home
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter
        siteTitle="Rabinson Photographs"
        email={demoFooter.email}
        instagram={demoFooter.instagram}
        facebook={demoFooter.facebook}
      />
    </>
  );
}
