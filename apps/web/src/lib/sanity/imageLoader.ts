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
  // If the image is natively hosted (relative) or not Sanity, bypass our custom string processing
  if (!src.startsWith("http") || !src.includes("cdn.sanity.io")) {
    return src;
  }

  try {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    url.searchParams.set("w", width.toString());
    url.searchParams.set("q", (quality || 75).toString());
    return url.toString();
  } catch {
    return src;
  }
}
