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

    // Small delay to ensure the page has started rendering behind the curtain
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [categorySlug]);

  if (!categorySlug) return null;

  return <CategoryTransition isVisible={isVisible} title={title} imageUrl={imageUrl} mode="reveal" />;
}
