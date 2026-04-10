import Link from "next/link";
import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { demoAbout, demoProjects } from "@/lib/demo/content";

export default function AboutPage() {
  // Taking a few choice images for the recommendation section
  const highlights = demoProjects.slice(0, 3);

  return (
    <>
      <main className="flex-1 bg-white text-zinc-900">
        <section className="px-6 pb-16 pt-28 sm:px-10 sm:pb-20 sm:pt-32 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div className="max-w-4xl">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  {demoAbout.eyebrow}
                </span>
                <h1 className="font-heading mt-6 text-4xl font-semibold tracking-tight sm:text-6xl text-balance">
                  {demoAbout.title}
                </h1>
                
                <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
                  <div className="space-y-6 text-zinc-600 leading-relaxed text-lg">
                    <p>
                      Based in the heart of Nepal, Rabinson is a filmmaker and
                      photographer whose work is deeply intertwined with the 
                      remote landscapes of the Himalayas. For over six years, 
                      he has traversed high-altitude environments, documenting 
                      not just the scale of the mountains, but the intimate, 
                      human stories that reside within them.
                    </p>
                    <p>
                      His practice is rooted in a quiet, observational philosophy. 
                      Eschewing the traditional &quot;director&quot; role, Rabinson allows 
                      scenes to breathe and unfold naturally. This approach 
                      relies on a mastery of natural light and a restrained 
                      sense of composition, capturing the subtle nuances that 
                      exist in the moments between action.
                    </p>
                  </div>
                  <div className="space-y-6 text-zinc-600 leading-relaxed text-lg">
                    <p>
                      The harsh beauty of remote environments has refined his 
                      visual language—a balance of raw authenticity and 
                      sophisticated simplicity. His work seeks the 
                      &quot;essential,&quot; stripping away noise to focus on 
                      timeless tones and genuine feeling.
                    </p>
                    <p>
                      Every project, whether editorial or commercial, is approached 
                      with a rigorous intentionality and a commitment to elevated 
                      execution. The result is imagery that feels honest, 
                      immediate, and enduring.
                    </p>
                    <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">
                      {demoAbout.note}
                    </p>
                  </div>
                </div>

                <div className="mt-12 flex flex-wrap gap-4">
                  <Link
                    href="/#contact"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    Start your inquiry
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-zinc-300 px-8 text-sm font-medium text-zinc-900 transition hover:border-zinc-900"
                  >
                    Back to home
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Gallery Recommendations Section */}
        <section className="bg-zinc-50 px-6 py-24 sm:px-10 lg:px-16 border-t border-zinc-100">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <SectionHeading
                  title="Explore the Collection"
                  subtitle="A curated selection of our most recent work. Dive deeper into individual projects in the full gallery."
                  align="left"
                  containerClassName="max-w-xl"
                />
                <Link
                  href="/gallery"
                  className="group inline-flex items-center text-sm font-semibold uppercase tracking-widest text-zinc-900"
                >
                  View full gallery
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {highlights.map((project, idx) => (
                <Reveal key={project.slug} delayMs={idx * 100}>
                  <Link href={`/projects/${project.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-200">
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 transition group-hover:opacity-100" />
                    </div>
                    <div className="mt-6">
                      <h3 className="text-xl font-medium text-zinc-900">{project.title}</h3>
                      <p className="mt-2 text-sm text-zinc-500 uppercase tracking-widest">{project.categorySlug}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
