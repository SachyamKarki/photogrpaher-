"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryTransition } from "@/components/ui/CategoryTransition";
import { demoCategories } from "@/lib/demo/content";

export function GalleryTransitionWrapper() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [isVisible, setIsVisible] = useState(true);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) return;

    // Force scroll to top instantly while the curtain is opaque
    window.scrollTo({ top: 0, behavior: "instant" });

    // Ensure we start fully covered when navigating between categories.
    setIsVisible(true);

    // If we have a category in the URL, lookup its data
    if (categorySlug) {
      const category = demoCategories.find(c => c.slug === categorySlug);
      if (category) {
        setTitle(category.title);
        setImageUrl(category.image);
      } else {
        // Fallback title formatting if not found in demo data
        const formattedTitle = categorySlug
          .split("-")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        setTitle(formattedTitle);
      }
    }

    // Let the new page paint behind the overlay (2 frames), then dissolve it.
    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setIsVisible(false);
      });
    });

    return () => {
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
    };
  }, [categorySlug]);

  if (!categorySlug) return null;

  return <CategoryTransition isVisible={isVisible} title={title} imageUrl={imageUrl} mode="reveal" />;
}
