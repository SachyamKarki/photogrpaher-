"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryTransition } from "@/components/ui/CategoryTransition";

export function GalleryTransitionWrapper() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [isVisible, setIsVisible] = useState(true);
  const [title, setTitle] = useState("");

  useEffect(() => {
    // If we have a category in the URL, try to format its title for the transition
    if (categorySlug) {
      const formattedTitle = categorySlug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setTitle(formattedTitle);
    }

    // Small delay to ensure the page has started rendering behind the curtain
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [categorySlug]);

  return <CategoryTransition isVisible={isVisible} title={title} />;
}
