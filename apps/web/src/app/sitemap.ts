import type { MetadataRoute } from "next";
import { getAllGalleryImages } from "@/lib/gallery";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Dynamic category pages
  const { processedCategories } = await getAllGalleryImages();
  const categoryPages: MetadataRoute.Sitemap = processedCategories.map(
    (cat) => ({
      url: `${SITE_URL}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  // Dynamic photo pages
  const { allImages } = await getAllGalleryImages();
  const photoPages: MetadataRoute.Sitemap = allImages.slice(0, 200).map(
    (img) => ({
      url: `${SITE_URL}/photo/${img._id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })
  );

  return [...staticPages, ...categoryPages, ...photoPages];
}
