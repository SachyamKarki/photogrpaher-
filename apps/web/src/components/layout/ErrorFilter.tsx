"use client";

import { useEffect } from "react";

/**
 * Filter to ignore known non-critical browser extension errors (Safari/WebKit)
 * that can clutter the logs but do not impact site functionality.
 */
export function ErrorFilter() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Ignore ANY error originating from Safari/WebKit extensions or content blockers
      const isExtensionError = 
        event.filename?.includes("webkit-masked-url") ||
        event.message?.includes("resp.payload") ||
        event.message?.includes("Can't find variable: output") ||
        (event.error?.stack && event.error.stack.includes("webkit-masked-url"));

      if (isExtensionError) {
        // Prevent the error from bubbling up or appearing in the console
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    };

    // Attach to the global error event
    window.addEventListener("error", handleError, true);
    
    // Also catch promise rejections if the extension uses them
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.stack?.includes("webkit-masked-url")) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
