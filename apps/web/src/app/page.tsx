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
  aboutContent,
  portfolioCategories,
  siteHero,
  siteServices,
  clientReviews,
  footerContent,
} from "@/lib/portfolio/data";
import { isSanityConfigured } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";
import { sanityServerClient } from "@/lib/sanity/serverClient";
import { getAllGalleryImages } from "@/lib/gallery";
import {
  HOME_CATEGORIES_QUERY,
  SITE_SETTINGS_QUERY,
  REVIEWS_QUERY,
  PARTNERS_QUERY,
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

type Partner = {
  _id: string;
  name: string;
  logo?: { asset?: { _id: string; url: string } } | null;
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
  let categories: Category[] | null = null;
  let reviews: Review[] | null = null;
  let partners: Partner[] | null = null;

  if (sanityEnabled) {
    try {
      [settings, categories, reviews, partners] = await Promise.all([
        sanityServerClient!.fetch<SiteSettings>(SITE_SETTINGS_QUERY),
        sanityServerClient!.fetch<Category[]>(HOME_CATEGORIES_QUERY),
        sanityServerClient!.fetch<Review[]>(REVIEWS_QUERY),
        sanityServerClient!.fetch<Partner[]>(PARTNERS_QUERY),
      ]);
    } catch {
      settings = null;
      categories = null;
      reviews = null;
      partners = null;
    }
  }

  const serviceTitle = settings?.servicesTitle ?? siteServices.title;
  const serviceIntro = settings?.servicesIntro ?? siteServices.intro;
  const serviceItems =
    settings?.services?.length && settings.services.some((s) => s?.title)
      ? settings.services
      : siteServices.items;
  const servicePanels = serviceItems.map((service) => ({
    title: service.title ?? "Service",
    description:
      service.description ?? getServiceSummary(service.title),
    details: service.details ?? getServiceDetails(service.title),
  }));

  const homeCategories = (((categories?.length ?? 0) > 0 ? categories : null)
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

  const contactCategories = homeCategories.map((c) => ({
    title: c.title,
    slug: c.slug,
  }));

  const safeReviews = (reviews?.length ? reviews : null) ?? clientReviews;

  const siteTitle = settings?.title ?? "Rabin Son Photography";
  const heroTitle = settings?.heroTitle ?? siteHero.title;
  const heroSubtitle = settings?.heroSubtitle ?? siteHero.subtitle;
  const socialLinks = {
    email: settings?.email ?? footerContent.email,
    whatsapp: settings?.whatsapp ?? footerContent.whatsapp,
  };

  const { allImages: rawGalleryImages } = await getAllGalleryImages();
  const validGalleryImages = rawGalleryImages.filter(img => !img._id.endsWith("-cover"));

  const getImagesForCategory = (slugs: string[]) =>
    validGalleryImages.filter((img) => {
      const imgSlug = img.category?.slug;
      return Boolean(imgSlug && slugs.includes(imgSlug));
    });

  // Explicitly curate the hero content as requested by the user
  const curatedHeroIds = ["mountain-3", "mountain-15", "mountain-17"];
  const slides = curatedHeroIds
    .map((id) => {
      const img = validGalleryImages.find((i) => i._id === id);
      return img ? { src: img.imageUrl, alt: img.category?.title || "Himalayas" } : null;
    })
    .filter((s): s is { src: string; alt: string } => s !== null);

  // If we couldn't find the curated images, fall back to a safe list of high-quality defaults
  if (slides.length === 0) {
    slides.push(
      { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format", alt: "Himalayas" },
      { src: "https://images.unsplash.com/photo-1549492423-40026e5fc53a?auto=format", alt: "Vehicles" },
      { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format", alt: "Portraits" }
    );
  }

  // Programmatically pick a balanced mix (2 from each category if possible)
  const categoriesToFind = [
    ["himalayas", "mountain"],
    ["automobile", "vehicles", "automotive"],
    ["studio-portraits", "portraits"],
  ];
  const bentoSelection: typeof validGalleryImages = [];

  categoriesToFind.forEach((slugs) => {
    const catImages = getImagesForCategory(slugs);
    if (catImages.length > 5) {
      // Pick images from different parts of the gallery for visual variety
      bentoSelection.push(catImages[2]);  // Near start
      bentoSelection.push(catImages[Math.floor(catImages.length / 2)]); // Middle
    } else {
      bentoSelection.push(...catImages.slice(0, 2));
    }
  });

  const finalBentoImages = bentoSelection.length >= 6
    ? bentoSelection.slice(0, 6)
    : validGalleryImages.slice(0, 6);

  const bentoGridImages = finalBentoImages.map((img) => ({
    _id: img._id,
    title: img.category?.title || "Featured",
    slug: "gallery",
    imageUrl: img.imageUrl,
    category: {
      title: img.category?.title || "Editorial",
      slug: img.category?.slug || "editorial"
    }
  }));

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <HomeHeader
        siteTitle={siteTitle}
        email={footerContent.email}
        phoneNumber={footerContent.phoneNumber}
        instagramLinks={footerContent.instagramLinks}
      />

      <main className="w-full">
        <section className="relative min-h-[100svh] overflow-hidden bg-zinc-900 md:min-h-screen">
          <div className="absolute inset-0">
            <HeroCarousel slides={slides} siteTitle={siteTitle} />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-zinc-950/35" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] items-end px-4 pb-14 sm:px-8 sm:pb-16 md:min-h-screen md:pb-20 lg:px-12 lg:pb-24 xl:px-16">
            <Reveal className="max-w-2xl">
              <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl">
                {heroTitle}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg line-clamp-3">
                {heroSubtitle}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 sm:mt-7">
                <a
                  href="#contact"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-xs font-bold uppercase tracking-[0.05em] text-zinc-900 shadow-sm transition hover:bg-zinc-100 md:h-13 md:px-10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Book a shoot
                </a>
                <a
                  href={`https://wa.me/${footerContent.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 text-xs font-bold uppercase tracking-[0.05em] text-white backdrop-blur transition hover:bg-white/15 md:h-13 md:px-10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  WhatsApp Us
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
          />

          <section id="about" className="scroll-mt-24 py-8 sm:py-16 xl:py-20">
            <Reveal>
              <div className="mx-auto max-w-5xl text-center">
                <SectionHeading
                  title={aboutContent.title}
                  subtitle={aboutContent.body}
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

          <section className="py-8 sm:py-16 xl:py-20">
            <HomeCategories categories={homeCategories} />
          </section>

          <section className="py-8 sm:py-16 xl:py-20">
            <BrandsSection partners={partners} />
          </section>

          <section id="services" className="scroll-mt-24 py-8 sm:py-16 xl:py-20">
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

          <section id="contact" className="scroll-mt-24 py-8 sm:py-16 xl:py-20">
            <Reveal>
              <div>
                <SectionHeading
                  title="Contact"
                  subtitle="Share your date, location, and what you need. You’ll receive availability and a tailored quote within 24 to 48 hours."
                />

                <div className="mx-auto mt-10 w-full max-w-7xl sm:mt-16">
                  <ContactForm
                    categories={contactCategories}
                    whatsappNumber={socialLinks.whatsapp?.replace("https://wa.me/", "") || "9779800000000"}
                  />
                </div>
              </div>
            </Reveal>
          </section>
        </div>
      </main>
    </div>
  );
}
