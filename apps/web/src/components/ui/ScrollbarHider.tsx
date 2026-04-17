"use client";

import { useEffect } from "react";

/**
 * ScrollbarHider is a utility component that hides the main window scrollbar
 * when rendered. It's intended for immersive pages like the Gallery.
 */
export function ScrollbarHider() {
  useEffect(() => {
    // Hide the viewport scrollbar reliably across browsers by applying the
    // class to both the root element and body (different engines attach the
    // scrolling element differently).
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");
    
    // Cleanup: remove the class when the component unmounts
    return () => {
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  return null;
}
