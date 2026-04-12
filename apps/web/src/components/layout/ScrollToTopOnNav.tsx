"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function scrollToHashTarget(): boolean {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return false;

  const id = decodeURIComponent(hash.slice(1));
  const element = document.getElementById(id);
  if (!element) return false;

  // Keep consistent with header offset used elsewhere.
  const headerOffset = 100;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({ top: offsetPosition, left: 0, behavior: "smooth" });
  return true;
}

export function ScrollToTopOnNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;

    let raf = 0;
    let tries = 0;

    const tick = () => {
      // If we navigated to a hash (e.g. "/#contact"), scroll to it smoothly
      // instead of snapping to the top.
      if (scrollToHashTarget()) {
        html.style.scrollBehavior = previous;
        return;
      }

      // Retry briefly in case the section mounts after data/components load.
      if (window.location.hash && tries < 24) {
        tries += 1;
        raf = window.requestAnimationFrame(tick);
        return;
      }

      // Default behavior: snap to top on route/search changes.
      html.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0 });
      html.style.scrollBehavior = previous;
    };

    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      html.style.scrollBehavior = previous;
    };
  }, [pathname, searchParams.toString()]);

  return null;
}
