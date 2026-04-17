"use client";

// Sanity specific custom Next.js image loader bypass
// https://nextjs.org/docs/api-reference/next/image#loader

export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Handle Sanity CDN
  if (src.includes("cdn.sanity.io")) {
    try {
      const url = new URL(src);
      url.searchParams.set("auto", "format");
      url.searchParams.set("fm", "webp");
      url.searchParams.set("fit", "max");

      // For hero/full-width images (width >= 1200), serve at high resolution
      const finalWidth = width >= 1200 ? Math.min(width, 3840) : width;
      url.searchParams.set("w", finalWidth.toString());

      // Photography portfolio: default quality to 90 for crisp images
      url.searchParams.set("q", (quality || 90).toString());

      return url.toString();
    } catch {
      return src;
    }
  }

  // Handle Unsplash
  if (src.includes("images.unsplash.com")) {
    try {
      const url = new URL(src);
      url.searchParams.set("auto", "format");
      url.searchParams.set("fm", "webp");
      url.searchParams.set("q", (quality || 90).toString());
      url.searchParams.set("w", width.toString());
      url.searchParams.set("fit", "max");
      return url.toString();
    } catch {
      return src;
    }
  }

  return src;
}
