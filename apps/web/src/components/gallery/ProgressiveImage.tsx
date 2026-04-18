"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ProgressiveImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  highQuality?: number;
  lowQuality?: number;
  priority?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  draggable?: boolean;
};

function lowQualityLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}) {
  try {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fm", "webp");
    url.searchParams.set("fit", "max");
    url.searchParams.set("w", Math.min(width, 640).toString());
    url.searchParams.set("q", "28");
    return url.toString();
  } catch {
    return src;
  }
}

export function ProgressiveImage({
  src,
  alt,
  sizes,
  className,
  highQuality = 88,
  lowQuality = 28,
  priority = false,
  fetchPriority = "auto",
  draggable = false,
}: ProgressiveImageProps) {
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    setIsHighQualityLoaded(false);
  }, [src]);

  return (
    <>
      <Image
        loader={lowQualityLoader}
        src={src}
        alt=""
        aria-hidden="true"
        fill
        priority={priority}
        fetchPriority={fetchPriority}
        quality={lowQuality}
        className={[
          className ?? "",
          "scale-[1.02] blur-xl transition-opacity duration-300",
          isHighQualityLoaded ? "opacity-0" : "opacity-100",
        ].join(" ").trim()}
        sizes={sizes}
        draggable={false}
      />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        fetchPriority={fetchPriority}
        quality={highQuality}
        className={[
          className ?? "",
          "transition-opacity duration-500",
          isHighQualityLoaded ? "opacity-100" : "opacity-0",
        ].join(" ").trim()}
        sizes={sizes}
        draggable={draggable}
        onLoad={() => setIsHighQualityLoaded(true)}
      />
    </>
  );
}
