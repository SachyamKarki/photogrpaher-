
import { sanityServerClient } from "@/lib/sanity/serverClient";
import { isSanityConfigured } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";
import {
  GALLERY_PROJECTS_QUERY,
  HOME_CATEGORIES_QUERY,
} from "@/lib/sanity/queries";
import { portfolioCategories, portfolioProjects } from "@/lib/portfolio/data";
import { 
  SanityProject, 
  SanityCategory, 
  GalleryImage, 
  SanityImageSourcePlus, 
  SanityImage 
} from "@/types";

export async function getAllGalleryImages() {
  const sanityEnabled = Boolean(sanityServerClient && isSanityConfigured);

  let rawProjects: SanityProject[] = [];
  let rawCategories: SanityCategory[] = [];

  if (sanityEnabled) {
    try {
      const [projectsData, categoriesData] = await Promise.all([
        sanityServerClient!.fetch(GALLERY_PROJECTS_QUERY),
        sanityServerClient!.fetch(HOME_CATEGORIES_QUERY),
      ]);
      rawProjects = Array.isArray(projectsData) ? projectsData : [];
      rawCategories = Array.isArray(categoriesData) ? categoriesData : [];
    } catch (e) {
      console.error("Gallery Resource: Sanity Fetch Error", e);
      rawProjects = [];
      rawCategories = [];
    }
  }

  const processedCategories = (rawCategories && rawCategories.length > 0)
    ? rawCategories.map((c: SanityCategory) => ({
        _id: c?._id || Math.random().toString(),
        title: c?.title || "Untitled",
        slug: c?.slug || "uncategorized",
      }))
    : portfolioCategories.map((c) => ({
        _id: `portfolio:${c.slug}`,
        title: c.title,
        slug: c.slug,
      }));

  const allImages: GalleryImage[] = [];
  const handledImageUrls = new Set<string>();

  const addImage = (id: string, title: string, source: SanityImageSourcePlus, project: SanityProject, forceFeatured = false) => {
    let imageUrl: string | null = null;
    let aspectRatio = 1.0; 

    // 1. Compute Image URL first to check for duplicates
    if (typeof source === "string") {
      imageUrl = source;
    } else if (sanityEnabled && source) {
      try {
        imageUrl = urlFor(source)?.width(2800).url() ?? null;
      } catch (e) {
        console.error("Gallery Resource: Image Processing Error", e);
      }
    }

    // 2. Skip if we don't have a URL or if we've already handled this image
    if (!imageUrl || handledImageUrls.has(imageUrl)) {
      return;
    }

    // 3. Mark image as handled
    handledImageUrls.add(imageUrl);

    // Metadata extraction
    const dimensions = (source as SanityImage & { dimensions?: { width: number; height: number } }).dimensions
      ?? source?.asset?.metadata?.dimensions;
    if (dimensions?.width && dimensions?.height) {
      aspectRatio = dimensions.width / dimensions.height;
    } else {
      aspectRatio = 1.5; 
      if (typeof source === "string") {
        if (source.includes("bento-1") || source.includes("bento-2")) aspectRatio = 0.66;
        else if (source.includes("bento-3")) aspectRatio = 1.6;
      }
    }

    // Professional Standards Metadata
    const metadata = {
      camera: (source as SanityImage).camera || "Sony α7R V",
      lens: (source as SanityImage).lens || "FE 35mm f/1.4 GM",
      settings: (source as SanityImage).settings || "f/1.4 • 1/250s • ISO 100",
      description: (source as SanityImage).description || project?.excerpt || "A focus on honest light and careful composition to create a timeless, editorial aesthetic."
    };

    allImages.push({
      _id: id,
      title: title || "Untitled Image",
      imageUrl,
      aspectRatio,
      metadata,
      category: project?.category || { 
        title: project?.categorySlug || "Photography", 
        slug: project?.categorySlug || "photography" 
      },
      isFeatured: forceFeatured || (source as any)?.isFeatured === true || typeof (source as any)?.featuredOrder === "number",
      featuredOrder: typeof (source as any)?.featuredOrder === "number" ? (source as any).featuredOrder : null,
    });
  };

  if (rawProjects && rawProjects.length > 0) {
    rawProjects.forEach((project: SanityProject) => {
      if (!project) return;
      if (project.coverImage) {
        addImage(`${project.slug}-cover`, project.title, project.coverImage, project);
      }
      if (Array.isArray(project.gallery)) {
        project.gallery.forEach((img: SanityImageSourcePlus, idx: number) => {
          if (!img) return;
          addImage(`${project.slug}-${idx + 1}`, `${project.title || "Project"} - Photo ${idx + 1}`, img, project);
        });
      }
    });
  }

  if (allImages.length === 0) {
    portfolioProjects.forEach((p, pIdx) => {
      // Force feature the first few mock images so the bento grid isn't empty locally
      const isFeaturedProj = pIdx < 4;
      addImage(`portfolio-${p.slug}-cover`, p.title, p.coverImage as SanityImageSourcePlus, p as unknown as SanityProject, isFeaturedProj);
      if (Array.isArray(p.gallery)) {
        p.gallery.forEach((img, idx) => {
          addImage(`portfolio-${p.slug}-gal-${idx}`, `${p.title} - ${idx + 1}`, img as SanityImageSourcePlus, p as unknown as SanityProject, isFeaturedProj && idx < 2);
        });
      }
    });
  }

  // --- AUTO-CURATOR ---
  // If the admin hasn't explicitly ticked any "Featured" checkboxes in Sanity yet,
  // we will artificially select 10 images automatically so the Homepage Bento Grid isn't blank.
  const hasFeatures = allImages.some((img: any) => img.isFeatured);
  if (!hasFeatures && allImages.length > 0) {
    // Group explicitly to ensure category diversity
    const groupedByCategory = allImages.reduce((acc, img) => {
        const slug = img.category?.slug || 'generic';
        if (!acc[slug]) acc[slug] = [];
        acc[slug].push(img);
        return acc;
    }, {} as Record<string, typeof allImages>);

    const keys = Object.keys(groupedByCategory);
    let i = 0;
    let count = 0;
    
    // Round-robin selection: pull exactly one image from each category in a loop until 10 slots are populated
    while (count < 10 && keys.length > 0) {
        const key = keys[i % keys.length];
        const arr = groupedByCategory[key];
        
        if (arr && arr.length > 0) {
            const img = arr.shift()!;
            (img as any).isFeatured = true; // Auto-feature the image
            count++;
            i++;
        } else {
            // Remove depleted categories from the rotation entirely
            keys.splice(i % keys.length, 1);
        }
    }
  }

  return { allImages, processedCategories };
}
