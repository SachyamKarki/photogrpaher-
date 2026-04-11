import Link from "next/link";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { ContactForm } from "@/components/contact/ContactForm";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ServicesAccordion } from "@/components/home/ServicesAccordion";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GallerySection } from "@/components/home/GallerySection";
import { BrandsSection } from "@/components/home/BrandsSection";
import { HomeCategories } from "@/components/home/HomeCategories";
import { ReviewsSection, type Review } from "@/components/home/ReviewsSection";
import {
  demoAbout,
  demoCategories,
  demoHero,
  demoProjects,
  demoServices,
  demoReviews,
  demoFooter,
} from "@/lib/demo/content";
import { isSanityConfigured } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";
import { sanityServerClient } from "@/lib/sanity/serverClient";
import { getAllGalleryImages } from "@/lib/gallery";
import {
  HOME_CATEGORIES_QUERY,
  PROJECTS_QUERY,
  SITE_SETTINGS_QUERY,
  REVIEWS_QUERY,
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
  services?: { title?: string; description?: string; details?: string[] }[];
  email?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
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
  category?: { title: string; slug: string };
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

  return "A refined end to end process shaped around your story and goals.";
}

function getServiceDetails(title?: string) {
  const normalized = title?.toLowerCase() ?? "";

  if (normalized.includes("plan")) {
    return [
      "We begin with a short consultation to align on mood, priorities, and the kind of images you want to live with long-term. From that, we build a simple plan that keeps the session calm and efficient.",
      "You’ll get guidance on location, timing (best light), and styling that fits your theme. If it’s an event, we’ll map the flow and key moments so nothing important gets missed.",
      "Expect a clear approach, not a complicated process. We add just enough structure to make the day feel easy while keeping the results intentional and editorial.",
    ];
  }

  if (normalized.includes("capture") || normalized.includes("shoot")) {
    return [
      "On the day, the direction is simple and confident. You never feel awkward, and the images never feel forced. We guide posture, movement, and pacing without interrupting the moment.",
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
      "Editing is crafted for longevity. We keep true skin tones, clean contrast, and color that stays elegant over time. Retouching is subtle and realistic (no plastic look).",
      "You receive a clean online gallery with high-resolution exports for print and optimized sizes for web. Everything is delivered organized and ready to share.",
      "Turnaround depends on the project, but the standard is fast communication, a consistent look, and files that are ready for real use, not just viewing.",
    ];
  }

  return [
    "Every project is shaped around the story and the purpose of the work. Personal, editorial, or commercial, the final images should feel intentional and never generic.",
    "We keep communication clear, the shoot calm, and delivery clean. The result is a gallery that feels cohesive from first frame to last.",
  ];
}

export default async function Home() {
  const sanityEnabled = Boolean(sanityServerClient && isSanityConfigured);

  let settings: SiteSettings | null = null;
  let projects: ProjectListItem[] | null = null;
  let categories: Category[] | null = null;
  let reviews: Review[] | null = null;

  if (sanityEnabled) {
    try {
      [settings, projects, categories, reviews] = await Promise.all([
        sanityServerClient!.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
        sanityServerClient!.fetch<ProjectListItem[]>(PROJECTS_QUERY),
        sanityServerClient!.fetch<Category[]>(HOME_CATEGORIES_QUERY),
        sanityServerClient!.fetch<Review[]>(REVIEWS_QUERY),
      ]);
    } catch {
      settings = null;
      projects = null;
      categories = null;
      reviews = null;
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
    details: service.details ?? getServiceDetails(service.title),
  }));

  const allProjects = (projects?.length ? projects : null)
    ? (projects as ProjectListItem[]).map(p => ({
        ...p,
        imageUrl: (p.coverImage && sanityEnabled)
          ? (typeof p.coverImage === "string" ? p.coverImage : urlFor(p.coverImage)?.width(1600).height(1200).url() ?? null)
          : (typeof p.coverImage === "string" ? p.coverImage : null)
      }))
    : demoProjects.map((p) => ({
        _id: `demo:${p.slug}`,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        imageUrl: p.coverImage,
        category: p.categorySlug ? { title: p.categorySlug, slug: p.categorySlug } : undefined,
      }));

  const homeCategories = (((categories?.length ?? 0) > 0 ? categories : null)
    ? (categories as Category[]).map(c => ({
        ...c,
        imageUrl: (c.coverImage && sanityEnabled)
          ? (typeof c.coverImage === "string" ? c.coverImage : urlFor(c.coverImage)?.width(1600).height(1000).url() ?? null)
          : (typeof c.coverImage === "string" ? c.coverImage : null)
      }))
    : demoCategories.map((c) => ({
        _id: `demo:${c.slug}`,
        title: c.title,
        slug: c.slug,
        description: c.description,
        imageUrl: c.image,
      }))).slice(0, 3);

  const contactCategories = homeCategories.map((c) => ({
    title: c.title,
    slug: c.slug,
  }));

  const safeReviews = (reviews?.length ? reviews : null) ?? demoReviews;

  const siteTitle = settings?.title ?? "Rabinson Photography";
  const heroTitle = settings?.heroTitle ?? demoHero.title;
  const heroSubtitle = settings?.heroSubtitle ?? demoHero.subtitle;
  const socialLinks = {
    email: settings?.email ?? demoFooter.email,
    instagram: settings?.instagram ?? demoFooter.instagram,
    facebook: settings?.facebook ?? demoFooter.facebook,
    whatsapp: settings?.whatsapp ?? demoFooter.whatsapp,
  };
  
  const heroSlides = allProjects
    .map((project) => {
      const image = project.imageUrl;

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

  const baseSlides = heroSlides.length ? heroSlides : fallbackHeroSlides;

  const slides = [
    { src: "/demo/wedding.jpg", alt: "Editorial Wedding" },
    { src: "/demo/himalaya.jpg", alt: "Himalayas Landscape" },
    ...baseSlides.slice(0, 2),
  ];

  const { allImages: rawGalleryImages } = await getAllGalleryImages();
  const validGalleryImages = rawGalleryImages.filter(img => !img._id.endsWith("-cover"));
  
  // Pick a beautifully curated variety of images across all domains (Studio, Himalayas, Automobile)
  const mixIndices = [12, 35, 6, 45, 60, 28]; 
  const mixedSelection = mixIndices
    .map(i => validGalleryImages[i])
    .filter(Boolean);

  const finalBentoImages = mixedSelection.length === 6 
    ? mixedSelection 
    : validGalleryImages.slice(0, 6);

  const bentoGridImages = finalBentoImages.map((img) => ({
      _id: img._id,
      title: img.category?.title || "Featured",
      slug: "gallery",
      imageUrl: img.imageUrl,
      category: { title: "Project", slug: "project" }
  }));

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <HomeHeader siteTitle={siteTitle} />

      <main className="w-full">
        <section className="relative min-h-[100svh] overflow-hidden bg-zinc-900 md:min-h-screen">
          <div className="absolute inset-0">
            <HeroCarousel slides={slides} siteTitle={siteTitle} />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-zinc-950/35" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] items-end px-4 pb-20 pt-24 sm:px-8 sm:pb-16 sm:pt-28 md:min-h-screen lg:px-12 xl:px-16">
            <Reveal className="max-w-3xl">
              <h1 className="font-heading text-xl font-semibold uppercase leading-tight tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                {heroTitle}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base md:text-lg lg:text-xl max-w-2xl">
                {heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
                <a
                  href="#contact"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-100 md:h-12 md:px-8 md:text-base"
                >
                  Book a shoot
                </a>
                <a
                  href="#work"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15 md:h-12 md:px-8 md:text-base"
                >
                  Explore work
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12 xl:px-16">
          {/* Integrated Gallery Section - now receives pre-processed image URLs */}
          {/* Integrated Gallery Section - uniquely curated mixed bento ignoring category covers */}
          <GallerySection 
            initialProjects={bentoGridImages}
            initialCategories={homeCategories}
          />

          <section id="about" className="scroll-mt-24 pt-16 sm:pt-32 xl:pt-40 pb-8 sm:pb-12">
            <Reveal>
              <div className="mx-auto max-w-5xl text-center">
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

          <HomeCategories categories={homeCategories} />

          <BrandsSection />

          <section id="services" className="scroll-mt-24 py-16 sm:py-32 xl:py-40">
            <Reveal>
              <div className="rounded-[2rem] bg-[#f7f3ee] px-4 py-10 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-24">
                <SectionHeading
                  title={serviceTitle}
                  subtitle={serviceIntro}
                />

                <div className="mx-auto mt-10 max-w-5xl sm:mt-16">
                  <ServicesAccordion items={servicePanels} />
                </div>
              </div>
            </Reveal>
          </section>

          <ReviewsSection reviews={safeReviews} />

          <section id="contact" className="scroll-mt-24 py-16 sm:py-32 xl:py-40">
            <Reveal>
              <div>
                <SectionHeading
                  title="Contact us"
                  subtitle="Share your date, location, and what you need. You’ll receive availability and a tailored quote within 24 to 48 hours."
                />

                <div className="mx-auto mt-10 w-full max-w-7xl sm:mt-16">
                  <ContactForm categories={contactCategories} />
                </div>
              </div>
            </Reveal>
          </section>
        </div>
      </main>
    </div>
  );
}
