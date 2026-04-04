import Image from "next/image";
import Link from "next/link";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { ContactForm } from "@/components/contact/ContactForm";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/ui/Reveal";
import {
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

  const heroTitle = settings?.heroTitle ?? demoHero.title;
  const heroSubtitle = settings?.heroSubtitle ?? demoHero.subtitle;
  const heroMediaType = settings?.heroMediaType ?? demoHero.mediaType;
  const heroVideoUrl = settings?.heroVideoUrl ?? null;
  const heroImageUrl = settings?.heroImage
    ? urlFor(settings.heroImage)?.width(2800).height(1600).url()
    : demoHero.image;

  const serviceTitle = settings?.servicesTitle ?? demoServices.title;
  const serviceIntro = settings?.servicesIntro ?? demoServices.intro;
  const serviceItems =
    settings?.services?.length && settings.services.some((s) => s?.title)
      ? settings.services
      : demoServices.items;

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
  const footerEmail = settings?.email ?? demoFooter.email;
  const footerInstagram = settings?.instagram ?? demoFooter.instagram;
  const footerFacebook = settings?.facebook ?? demoFooter.facebook;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <HomeHeader siteTitle={siteTitle} />

      <main className="mx-auto max-w-6xl px-6 py-0 sm:py-0">
        <section className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-zinc-900">
          <div className="absolute inset-0">
            {heroMediaType === "video" && heroVideoUrl ? (
              <video
                className="h-full w-full object-cover opacity-75"
                src={heroVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : heroMediaType === "image" && heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt={siteTitle}
                fill
                priority
                className="object-cover opacity-80"
                sizes="(max-width: 1024px) 100vw, 1200px"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-zinc-950/35" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />
          </div>

          <div className="relative mx-auto flex min-h-screen max-w-6xl items-end px-6 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-36">
            <Reveal className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-200/80">
                Professional photographer
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                {heroTitle}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg sm:leading-8">
                {heroSubtitle}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
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
                  View work
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

        <section id="categories" className="mt-16 scroll-mt-24 sm:mt-24">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Categories
              </h2>
              <p className="mt-4 text-zinc-600">
                Explore focused collections. Each category opens into a dedicated
                page with its own curated work.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-3">
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
                    className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:hover:translate-y-0"
                  >
                    <div className="px-4 pt-4">
                      <div className="relative h-[24rem] overflow-hidden rounded-xl bg-zinc-100 sm:h-[26rem]">
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

                    <div className="border-t border-zinc-200 px-5 py-5">
                      <div className="text-zinc-900">
                        <div className="text-lg font-semibold tracking-tight sm:text-xl">
                          {c.title}
                        </div>
                        {c.description ? (
                          <p className="mt-2 text-sm leading-6 text-zinc-600">
                            {c.description}
                          </p>
                        ) : null}
                      </div>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                          Category
                        </span>
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

        <section id="services" className="mt-16 scroll-mt-24 sm:mt-24">
          <Reveal>
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {serviceTitle}
                  </h2>
                  <p className="mt-4 text-zinc-600">{serviceIntro}</p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {serviceItems.map((s, i) => (
                    <Reveal key={`${s.title ?? "service"}:${i}`} delayMs={i * 60}>
                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                        <div className="font-semibold tracking-tight">
                          {s.title ?? "Service"}
                        </div>
                        {s.description ? (
                          <p className="mt-2 text-sm text-zinc-600">
                            {s.description}
                          </p>
                        ) : null}
                      </div>
                    </Reveal>
                  ))}
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
