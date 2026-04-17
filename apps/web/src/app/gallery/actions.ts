"use server";

import { getAllGalleryImages } from "@/lib/gallery";

/**
 * Server Action to fetch additional images for the gallery.
 * This allows for incremental loading without page refreshes.
 */
export async function getMoreGalleryImages(start: number, end: number) {
  try {
    const { allImages } = await getAllGalleryImages(start, end);
    return { success: true, images: allImages };
  } catch (error) {
    console.error("[Gallery Action] Failed to fetch more images:", error);
    return { success: false, images: [], error: "Failed to load more images" };
  }
}
