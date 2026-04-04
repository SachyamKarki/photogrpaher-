import Image from "next/image";
import Link from "next/link";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { ContactForm } from "@/components/contact/ContactForm";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ServicesAccordion } from "@/components/home/ServicesAccordion";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  demoAbout,
  demoCategories,
  demoFooter,
  demoHero,
  demoProjects,
  demoServices,
} from "@/lib/demo/content";
import { isSanityConfigured } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";
import { sanityServerClient } from "@/lib/sanity/serverClient";
import {
  HOME_CATEGORIES_QUERY,
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";

type SiteSettings = {
  title?: string;
  description?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroMediaType?: "image" | "video" | "none";
  heroImage?: SanityImageSource;
  heroVideoUrl?: string;
  servicesTitle?: string;
  servicesIntro?: string;
  services?: { title?: string; description?: string }[];
  email?: string;
  instagram?: string;
  facebook?: string;
};

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: SanityImageSource | string;
};

type ProjectListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImageSource | string;
  publishedAt?: string;
};

function getServiceSummary(title?: string) {
  const normalized = title?.toLowerCase() ?? "";

  if (normalized.includes("plan")) {
    return "A clear plan for locations, timing, styling, and a calm shoot day.";
  }

  if (normalized.includes("capture") || normalized.includes("shoot")) {
    return "Confident direction, clean composition, and natural moments that feel effortless.";
  }

  if (
    normalized.includes("retouch") ||
    normalized.includes("delivery") ||
    normalized.includes("edit")
  ) {
    return "Timeless editing, true-to-life color, and delivery ready for web and print.";
  }

  return "A refined end-to-end process shaped around your story and goals.";
}

function getServiceDetails(title?: string) {
  const normalized = title?.toLowerCase() ?? "";

  if (normalized.includes("plan")) {
    return [
      "We begin with a short consultation to align on mood, priorities, and the kind of images you want to live with long-term. From that, we build a simple plan that keeps the session calm and efficient.",
      "You’ll get guidance on location, timing (best light), and styling that fits your theme. If it’s an event, we’ll map the flow and key moments so nothing important gets missed.",
      "Expect a clear approach, not a complicated process—just enough structure to make the day feel easy while the results stay intentional and editorial.",
    ];
  }

  if (normalized.includes("capture") || normalized.includes("shoot")) {
    return [
      "On the day, the direction is simple and confident—so you never feel awkward, and the images never feel forced. We guide posture, movement, and pacing without interrupting the moment.",
      "We prioritize clean light and strong composition, then build the story with details and transitions. That’s what makes a gallery feel cohesive, not random.",
      "If you’re a brand, we focus on consistency: tones, framing, and a repeatable visual language that works across web, socials, and campaigns.",
    ];
  }

  if (
    normalized.includes("retouch") ||
    normalized.includes("delivery") ||
    normalized.includes("edit")
  ) {
    return [
      "Editing is crafted for longevity—true skin tones, clean contrast, and color that stays elegant over time. Retouching is subtle and realistic (no plastic look).",
      "You receive a clean online gallery with high-resolution exports for print and optimized sizes for web. Everything is delivered organized and ready to share.",
      "Turnaround depends on the project, but the standard is: fast communication, a consistent look, and files that are ready for real use—not just viewing.",
    ];
  }

  return [
    "Every project is shaped around the story and the purpose of the work—personal, editorial, or commercial—so the final images feel intentional, not generic.",
    "We keep communication clear, the shoot calm, and delivery clean. The result is a gallery that feels cohesive from first frame to last.",
  ];
}

export default async function Home() {
  const sanityEnabled = Boolean(sanityServerClient && isSanityConfigured);

  let settings: SiteSettings | null = null;
  let projects: ProjectListItem[] | null = null;
  let categories: Category[] | null = null;

  if (sanityEnabled) {
    try {
      [settings, projects, categories] = await Promise.all([
        sanityServerClient!.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
        sanityServerClient!.fetch<ProjectListItem[]>(PROJECTS_QUERY),
        sanityServerClient!.fetch<Category[]>(HOME_CATEGORIES_QUERY),
      ]);
    } catch {
      settings = null;
      projects = null;
      categories = null;
    }
  }

  const serviceTitle = settings?.servicesTitle ?? demoServices.title;
  const serviceIntro = settings?.servicesIntro ?? demoServices.intro;
  const serviceItems =
    settings?.services?.length && settings.services.some((s) => s?.title)
      ? settings.services
      : demoServices.items;
  const servicePanels = serviceItems.map((service) => ({
    title: service.title ?? "Service",
    description:
      service.description ?? getServiceSummary(service.title),
    details: getServiceDetails(service.title),
  }));

  const projectsForBento = (projects?.length ? projects : null)
    ? (projects as ProjectListItem[])
    : demoProjects.map((p) => ({
        _id: `demo:${p.slug}`,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
      }));

  const bentoTiles = projectsForBento.slice(0, 6).map((p) => ({
    key: p._id,
    title: p.title,
    subtitle: p.excerpt,
    href: `/projects/${p.slug}`,
    image: p.coverImage
      ? sanityEnabled
        ? typeof p.coverImage === "string"
          ? p.coverImage
          : urlFor(p.coverImage)?.width(1600).height(1200).url() ?? null
        : typeof p.coverImage === "string"
          ? p.coverImage
          : null
      : null,
  }));

  const homeCategories = categories?.length
    ? categories
    : demoCategories.map((c) => ({
        _id: `demo:${c.slug}`,
        title: c.title,
        slug: c.slug,
        description: c.description,
        coverImage: c.image,
      }));

  const contactCategories = homeCategories.map((c) => ({
    title: c.title,
    slug: c.slug,
  }));

  const siteTitle = settings?.title ?? "Rabinson Photographs";
  const heroTitle = settings?.heroTitle ?? demoHero.title;
  const heroSubtitle = settings?.heroSubtitle ?? demoHero.subtitle;
  const footerEmail = settings?.email ?? demoFooter.email;
  const footerInstagram = settings?.instagram ?? demoFooter.instagram;
  const footerFacebook = settings?.facebook ?? demoFooter.facebook;
  const heroSlides = projectsForBento
    .map((project) => {
      const image =
        project.coverImage && sanityEnabled
          ? typeof project.coverImage === "string"
            ? project.coverImage
            : urlFor(project.coverImage)?.width(2400).height(1600).url() ?? null
          : typeof project.coverImage === "string"
            ? project.coverImage
            : null;

      return image
        ? {
            src: image,
            alt: project.title,
          }
        : null;
    })
    .filter((slide): slide is { src: string; alt: string } => Boolean(slide))
    .slice(0, 5);

  const fallbackHeroSlides = [
    { src: demoHero.image, alt: siteTitle },
    ...demoProjects.slice(0, 4).map((project) => ({
      src: project.coverImage,
      alt: project.title,
    })),
  ];

  const slides = heroSlides.length ? heroSlides : fallbackHeroSlides;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <HomeHeader siteTitle={siteTitle} />

      <main className="mx-auto max-w-6xl px-6 py-0 sm:py-0">
        <section className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-zinc-900">
          <div className="absolute inset-0">
            <HeroCarousel slides={slides} siteTitle={siteTitle} />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-zinc-950/35" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />
          </div>

          <div className="relative mx-auto flex min-h-screen max-w-6xl items-end px-6 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-36">
            <Reveal className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-200/80">
                Rabinson Photographs
              </p>
              <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                {heroTitle}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-200 sm:text-lg sm:leading-8">
                {heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100"
                >
                  Book a shoot
                </a>
                <a
                  href="#work"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
                >
                  Explore work
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="work" className="scroll-mt-24 py-14 sm:py-20">
          <Reveal>
            <SectionHeading
              title="Featured work"
              subtitle="A curated grid to highlight signature images and recent projects."
            />
          </Reveal>

          <div className="mt-10 sm:mt-12">
            <Reveal delayMs={80}>
              <FeaturedGrid tiles={bentoTiles} />
            </Reveal>
          </div>
        </section>

        <section id="categories" className="scroll-mt-24 py-14 font-sans sm:py-20">
          <Reveal>
            <SectionHeading
              title="Explore by category"
              subtitle="Explore focused collections. Each category opens into a dedicated page with its own curated work."
            />
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 md:grid-cols-3 md:gap-6 lg:gap-8">
            {homeCategories.map((c, idx) => {
              const imageUrl = c.coverImage
                ? sanityEnabled
                  ? typeof c.coverImage === "string"
                    ? c.coverImage
                    : urlFor(c.coverImage)?.width(1600).height(1000).url() ??
                      null
                  : typeof c.coverImage === "string"
                    ? c.coverImage
                    : null
                : null;

              return (
                <Reveal key={c._id} delayMs={idx * 80}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-sm"
                  >
                    <div className="relative h-[16rem] w-full bg-zinc-100 sm:h-[18rem] md:h-[20rem] lg:h-[22rem] xl:h-[24rem]">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={c.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-200" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    <div className="flex flex-1 flex-col px-6 py-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="font-heading text-xl font-semibold tracking-tight text-zinc-900">
                            {c.title}
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        {c.description ? (
                          <p className="mt-3 text-sm leading-6 text-zinc-600">
                            {c.description}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-900 transition group-hover:translate-x-0.5 motion-reduce:transition-none">
                          View gallery →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="about" className="scroll-mt-24 py-14 sm:py-20">
          <Reveal>
            <div className="mx-auto max-w-4xl py-10 text-center sm:py-12">
              <SectionHeading
                title={demoAbout.title}
                subtitle={demoAbout.body}
                containerClassName="max-w-4xl"
                action={
                  <Link
                    href="/about"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-900 px-6 text-sm font-medium tracking-[0.02em] text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
                  >
                    Read more
                  </Link>
                }
              />
            </div>
          </Reveal>
        </section>

        <section id="services" className="scroll-mt-24 py-14 sm:py-20">
          <Reveal>
            <div className="rounded-[2rem] bg-[#f7f3ee] px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
              <SectionHeading
                title={serviceTitle}
                subtitle={serviceIntro}
              />

              <div className="mx-auto mt-10 max-w-4xl sm:mt-12">
                <ServicesAccordion items={servicePanels} />
              </div>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="scroll-mt-24 py-14 sm:py-20">
          <Reveal>
            <div>
              <SectionHeading
                title="Contact us"
                subtitle="Share your date, location, and what you need. You’ll receive availability and a tailored quote within 24–48 hours."
              />

              <div className="mx-auto mt-10 w-full max-w-6xl sm:mt-12">
                <ContactForm categories={contactCategories} />
              </div>
            </div>
          </Reveal>
        </section>

      </main>

      <SiteFooter
        siteTitle={siteTitle}
        email={footerEmail}
        instagram={footerInstagram}
        facebook={footerFacebook}
        locationLine={demoFooter.locationLine}
      />
    </div>
  );
}
