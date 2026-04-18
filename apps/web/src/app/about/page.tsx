import type { Metadata } from "next";
import Link from "next/link";

import { HomeCategories } from "@/components/home/HomeCategories";
import { isSanityConfigured } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";
import { HOME_CATEGORIES_QUERY } from "@/lib/sanity/queries";
import { getRequiredSiteSettings, normalizeInstagramLinks } from "@/lib/sanity/siteSettings";
import { sanityServerClient } from "@/lib/sanity/serverClient";

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: unknown;
  imageUrl?: string | null;
};

export const dynamic = "force-dynamic";

async function getAboutSettings() {
  return getRequiredSiteSettings();
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAboutSettings();
  const aboutTitle = settings.aboutTitle?.trim() || "About";
  const aboutBody = settings.aboutBody?.trim() || "";

  return {
    title: aboutTitle,
    description: aboutBody,
    openGraph: {
      title: aboutTitle,
      description: aboutBody,
      images: [{ url: "/content/hero.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function AboutPage() {
  const sanityEnabled = Boolean(sanityServerClient && isSanityConfigured);
  let categories: Category[] | null = null;
  const settings = await getAboutSettings();

  if (sanityEnabled) {
    try {
      [categories] = await Promise.all([
        sanityServerClient!.fetch<Category[]>(HOME_CATEGORIES_QUERY),
      ]);
    } catch {
      categories = null;
    }
  }

  const aboutTitle = settings.aboutTitle ?? "";
  const aboutBody = settings.aboutBody ?? "";
  const aboutLongBody = settings.aboutLongBody?.filter(Boolean) ?? [];
  const aboutPrinciples = settings.aboutPrinciples?.filter(Boolean) ?? [];
  const availabilityNote = settings.availabilityNote ?? "";
  const email = settings.email;
  const phoneNumber = settings.phoneNumber;
  const whatsapp = settings.whatsapp;
  const locationLine = settings.locationLine;
  const instagramLinks = normalizeInstagramLinks(settings);
  const services = settings.services ?? [];
  const servicesIntro = settings.servicesIntro ?? "";

  const aboutCategories = (categories ?? []).map((c) => ({
      ...c,
      imageUrl:
        c.coverImage && sanityEnabled
          ? typeof c.coverImage === "string"
            ? c.coverImage
            : urlFor(c.coverImage)?.width(1600).height(1000).url() ?? null
          : typeof c.coverImage === "string"
            ? c.coverImage
            : null,
    })).slice(0, 3);

  const sectionTitleClassName =
    "font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl";
  const sectionTextClassName =
    "text-sm leading-7 text-zinc-600 sm:text-[15px]";

  return (
    <main className="flex-1 bg-white text-zinc-900">
      <section className="px-6 pb-12 pt-20 sm:px-8 sm:pb-14 sm:pt-24 lg:px-12 xl:px-16">
        <div className="w-full max-w-none">
          <div className="w-full">
            <h1 className="font-heading mt-4 text-3xl font-semibold leading-[1.08] tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
              {aboutTitle}
            </h1>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base lg:text-[17px] lg:leading-8">
              <p>{aboutBody}</p>
              {aboutLongBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-zinc-200 pt-8 sm:mt-12 sm:pt-10">
            <div className="w-full">
              {aboutPrinciples.length ? (
                <section aria-labelledby="about-principles" className="py-2">
                  <h2 id="about-principles" className={sectionTitleClassName}>
                    Working style
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {aboutPrinciples.map((principle) => (
                      <li key={principle} className={`${sectionTextClassName} flex gap-3`}>
                        <span
                          className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-zinc-400"
                          aria-hidden="true"
                        />
                        <span>{principle}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section aria-labelledby="about-services" className="border-t border-zinc-100 py-8">
                <h2 id="about-services" className={sectionTitleClassName}>
                  What WE DO
                </h2>
                <p className={`mt-3 ${sectionTextClassName}`}>
                  {servicesIntro}
                </p>

                <dl className="mt-5 space-y-5">
                  {services.map((service) => (
                    <div key={service.title} className="space-y-2">
                      <dt className="text-sm font-semibold tracking-tight text-zinc-900 sm:text-[15px]">
                        {service.title}
                      </dt>
                      <dd className={sectionTextClassName}>
                        {service.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section aria-labelledby="about-availability" className="border-t border-zinc-100 py-8">
                <h2 id="about-availability" className={sectionTitleClassName}>
                  Availability
                </h2>
                <p className={`mt-3 ${sectionTextClassName}`}>
                  {availabilityNote}
                </p>
                {locationLine ? (
                  <p className={`mt-2 ${sectionTextClassName}`}>
                    {locationLine}
                  </p>
                ) : null}
              </section>
            </div>

            <div className="w-full">
              <section aria-labelledby="about-contact" className="border-t border-zinc-100 py-8">
                <h2 id="about-contact" className={sectionTitleClassName}>
                  Contact
                </h2>

                <ul className={`mt-4 space-y-2.5 ${sectionTextClassName}`}>
                  <li>
                    <span className="font-medium text-zinc-900">Email:</span>{" "}
                    <a
                      className="underline underline-offset-4 hover:text-zinc-900"
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                  </li>
                  {phoneNumber ? (
                    <li>
                      <span className="font-medium text-zinc-900">Phone:</span>{" "}
                      <a
                        className="underline underline-offset-4 hover:text-zinc-900"
                        href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
                      >
                        {phoneNumber}
                      </a>
                    </li>
                  ) : null}
                  {whatsapp ? (
                    <li>
                      <span className="font-medium text-zinc-900">WhatsApp:</span>{" "}
                      <a
                        className="underline underline-offset-4 hover:text-zinc-900"
                        href={whatsapp}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Message on WhatsApp
                      </a>
                    </li>
                  ) : null}
                  {instagramLinks?.length ? (
                    <li>
                      <span className="font-medium text-zinc-900">Instagram:</span>{" "}
                      {instagramLinks.map((link, index) => (
                        <span key={link.url}>
                          <a
                            className="underline underline-offset-4 hover:text-zinc-900"
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {link.label}
                          </a>
                          {index < instagramLinks.length - 1 ? (
                            <span className="text-zinc-400"> • </span>
                          ) : null}
                        </span>
                      ))}
                    </li>
                  ) : null}
                </ul>
              </section>

              <section aria-label="About actions" className="border-t border-zinc-100 py-8">
                <Link
                  href="/gallery"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-900 transition hover:bg-zinc-50 md:h-12 md:px-8"
                >
                  View gallery
                </Link>
              </section>
            </div>

            <section aria-labelledby="about-categories" className="border-t border-zinc-100 py-8">
              <div id="about-categories">
                <HomeCategories
                  categories={aboutCategories}
                  title="Explore by category"
                  subtitle="A curated selection of work across distinct photographic styles."
                  sectionClassName="scroll-mt-24 py-0"
                  headingContainerClassName="mb-4 sm:mb-6"
                />
              </div>
            </section>

            <section aria-label="Primary actions">
              <div className="mt-24 flex justify-center sm:mt-40">
                <Link
                  href="/"
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-6 text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-100 md:h-12 md:px-8"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path d="M12 19l-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  BACK TO HOME
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
