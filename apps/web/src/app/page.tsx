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

function getServiceDetails(title?: string) {
  const normalized = title?.toLowerCase() ?? "";

  if (normalized.includes("plan")) {
    return [
      "Creative consultation and visual direction before the shoot",
      "Location, timeline, and styling guidance tailored to the session",
      "A clear approach that keeps the day calm and well organized",
    ];
  }

  if (normalized.includes("capture") || normalized.includes("shoot")) {
    return [
      "Natural direction that keeps images refined without feeling forced",
      "Attention to light, composition, and consistent storytelling",
      "A relaxed working rhythm for portraits, events, and brand sessions",
    ];
  }

  if (
    normalized.includes("retouch") ||
    normalized.includes("delivery") ||
    normalized.includes("edit")
  ) {
    return [
      "Careful color grading and retouching with a timeless finish",
      "High-resolution delivery prepared for web, print, and sharing",
      "A clean gallery experience that makes final selection effortless",
    ];
  }

  return [
    "A tailored process shaped around the story, style, and purpose of the work",
    "Clear communication from planning through final delivery",
    "Refined execution designed to keep the experience smooth and professional",
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
      service.description ??
      "A considered photography process shaped around your story and goals.",
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
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
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

        <section id="work" className="mt-16 scroll-mt-24 sm:mt-24">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Featured work
                </h2>
                <p className="mt-4 text-zinc-600">
                  A bento-style grid to highlight signature images and recent
                  projects.
                </p>
              </div>
              <Link
                className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-900 sm:inline"
                href="/studio"
              >
                Manage in Studio →
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 sm:mt-12">
            <Reveal delayMs={80}>
              <FeaturedGrid tiles={bentoTiles} />
            </Reveal>
          </div>
        </section>

        <section id="categories" className="mt-16 scroll-mt-24 font-sans sm:mt-24">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Categories
              </h2>
              <p className="mt-4 text-zinc-600">
                Explore focused collections. Each category opens into a dedicated
                page with its own curated work.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 overflow-hidden rounded-[1.75rem] bg-white sm:mt-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                <Reveal
                  key={c._id}
                  delayMs={idx * 80}
                  className=""
                >
                  <Link
                    href={`/categories/${c.slug}`}
                    className={[
                      "group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white font-sans transition hover:bg-zinc-50/70",
                    ].join(" ")}
                  >
                    <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                      <div
                        className={[
                          "relative overflow-hidden bg-zinc-100",
                          "rounded-[1rem]",
                          "h-[24rem] sm:h-[28rem] md:h-[26rem] lg:h-[30rem]",
                        ].join(" ")}
                      >
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
                      <div className="flex-1 text-zinc-900">
                        <div className="flex items-start justify-between gap-4">
                          <div className="font-sans text-lg font-semibold tracking-tight sm:text-xl">
                            {c.title}
                          </div>
                          <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        {c.description ? (
                          <p className="mt-3 max-w-sm font-sans text-sm leading-6 text-zinc-600">
                            {c.description}
                          </p>
                        ) : null}
                      </div>
                      <div className="mt-6 flex items-center justify-between pt-2">
                        <span className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                          Curated collection
                        </span>
                        <span className="font-sans text-sm font-medium text-zinc-900 transition group-hover:translate-x-0.5 motion-reduce:transition-none">
                          View gallery →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
            </div>
          </div>
        </section>

        <section id="about" className="mt-16 scroll-mt-24 sm:mt-24">
          <Reveal>
            <div className="mx-auto max-w-4xl border-y border-zinc-200 py-12 text-center sm:py-14">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                {demoAbout.eyebrow}
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                {demoAbout.title}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                {demoAbout.body}
              </p>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-900 px-6 text-sm font-medium tracking-[0.02em] text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
                >
                  Read more
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="services" className="mt-16 scroll-mt-24 sm:mt-24">
          <Reveal>
            <div className="rounded-[2rem] bg-[#f7f3ee] px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
                <div className="max-w-xl lg:col-span-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                    Services
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                    {serviceTitle}
                  </h2>
                  <p className="mt-4 text-zinc-600">{serviceIntro}</p>
                </div>

                <div className="lg:col-span-7">
                  <ServicesAccordion items={servicePanels} />
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="mt-16 scroll-mt-24 sm:mt-24">
          <Reveal>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
              <div className="max-w-xl pt-1">
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Let’s work together
                </h2>
                <p className="mt-4 text-zinc-600">
                  Share your date, location, and what you’re envisioning. I’ll
                  reply with availability and a tailored package.
                </p>
                {!sanityEnabled ? (
                  <div className="mt-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
                    Tip: connect Sanity to manage hero, categories, and projects.
                  </div>
                ) : null}
              </div>
              <ContactForm categories={contactCategories} />
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
