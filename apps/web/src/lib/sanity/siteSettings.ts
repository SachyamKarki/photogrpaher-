import "server-only";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import { sanityServerClient } from "@/lib/sanity/serverClient";

export type InstagramLink = {
  label?: string;
  url?: string;
};

export type SiteSettings = {
  _id?: string;
  title?: string;
  description?: string;
  logo?: SanityImageSource;
  heroTitle?: string;
  heroSubtitle?: string;
  heroMediaType?: "image" | "video" | "none";
  heroImage?: SanityImageSource;
  heroVideoUrl?: string;
  servicesTitle?: string;
  servicesIntro?: string;
  services?: { title?: string; description?: string; details?: string[] }[];
  aboutTitle?: string;
  aboutBody?: string;
  aboutLongBody?: string[];
  aboutPrinciples?: string[];
  availabilityNote?: string;
  email?: string;
  instagram?: string;
  instagramLinks?: InstagramLink[];
  facebook?: string;
  whatsapp?: string;
  phoneNumber?: string;
  locationLine?: string;
  partnerOrder?: {
    _id: string;
    name: string;
    logo?: { asset?: { _id: string; url: string } } | null;
    website?: string;
    order?: number;
  }[];
};

export async function getSiteSettings() {
  if (!sanityServerClient) {
    return null;
  }

  try {
    return await sanityServerClient.fetch<SiteSettings>(SITE_SETTINGS_QUERY);
  } catch {
    return null;
  }
}

export async function getRequiredSiteSettings() {
  const settings = await getSiteSettings();

  if (!settings?._id) {
    throw new Error("Missing published Sanity site settings");
  }

  return settings;
}

export function normalizeInstagramLinks(settings: SiteSettings) {
  const links =
    settings.instagramLinks
      ?.filter((link) => link?.label && link?.url)
      .map((link) => ({
        label: link.label!.trim(),
        url: link.url!.trim(),
      })) ?? [];

  if (links.length > 0) {
    return links;
  }

  if (settings.instagram) {
    return [{ label: "Instagram", url: settings.instagram.trim() }];
  }

  return [];
}
