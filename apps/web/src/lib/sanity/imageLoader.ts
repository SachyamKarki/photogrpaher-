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

      // Keep large visuals crisp without requesting oversized originals.
      const finalWidth = width >= 1200 ? Math.min(width, 2800) : width;
      url.searchParams.set("w", finalWidth.toString());

      const finalQuality = Math.min(Math.max(quality || 82, 68), 88);
      url.searchParams.set("q", finalQuality.toString());

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
      url.searchParams.set("q", Math.min(Math.max(quality || 82, 68), 88).toString());
      url.searchParams.set("w", width.toString());
      url.searchParams.set("fit", "max");
      return url.toString();
    } catch {
      return src;
    }
  }

  return src;
}
