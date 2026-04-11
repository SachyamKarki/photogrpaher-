"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ScrollToTopOnNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    // Wait a frame so the new page content is mounted before snapping.
    const raf = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0 });
      html.style.scrollBehavior = previous;
    });

    return () => {
      window.cancelAnimationFrame(raf);
      html.style.scrollBehavior = previous;
    };
  }, [pathname, searchParams.toString()]);

  return null;
}
