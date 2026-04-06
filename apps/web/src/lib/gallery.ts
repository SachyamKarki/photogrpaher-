import { sanityServerClient } from "@/lib/sanity/serverClient";
import { isSanityConfigured } from "@/lib/sanity/config";
import { urlFor } from "@/lib/sanity/image";
import {
  GALLERY_PROJECTS_QUERY,
  HOME_CATEGORIES_QUERY,
} from "@/lib/sanity/queries";
import { demoCategories, demoProjects } from "@/lib/demo/content";

export async function getAllGalleryImages() {
  const sanityEnabled = Boolean(sanityServerClient && isSanityConfigured);

  let rawProjects: any[] = [];
  let rawCategories: any[] = [];

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
    ? rawCategories.map((c: any) => ({
        _id: c?._id || Math.random().toString(),
        title: c?.title || "Untitled",
        slug: c?.slug || "uncategorized",
      }))
    : demoCategories.map((c) => ({
        _id: `demo:${c.slug}`,
        title: c.title,
        slug: c.slug,
      }));

  let allImages: any[] = [];

  const addImage = (id: string, title: string, source: any, project: any) => {
    let imageUrl = null;
    let aspectRatio = 1.0; 

    // Metadata extraction
    const dimensions = source?.asset?.metadata?.dimensions;
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
      camera: source?.camera || "Sony α7R V",
      lens: source?.lens || "FE 35mm f/1.4 GM",
      settings: source?.settings || "f/1.4 • 1/250s • ISO 100",
      description: source?.description || project?.excerpt || "A focus on honest light and careful composition to create a timeless, editorial aesthetic."
    };

    if (typeof source === "string") {
      imageUrl = source;
    } else if (sanityEnabled && source) {
      try {
        imageUrl = urlFor(source)?.width(1600).url() ?? null;
      } catch (e) {
        console.error("Gallery Resource: Image Processing Error", e);
      }
    }

    if (imageUrl) {
      allImages.push({
        _id: id,
        title: title || "Untitled Image",
        imageUrl,
        aspectRatio,
        metadata,
        category: project?.category || { title: project?.categorySlug, slug: project?.categorySlug },
      });
    }
  };

  if (rawProjects && rawProjects.length > 0) {
    rawProjects.forEach((project: any) => {
      if (!project) return;
      if (project.coverImage) {
        addImage(`${project._id}-cover`, project.title, project.coverImage, project);
      }
      if (Array.isArray(project.gallery)) {
        project.gallery.forEach((img: any, idx: number) => {
          if (!img) return;
          addImage(`${project._id}-gal-${idx}`, `${project.title || "Project"} - Photo ${idx + 1}`, img, project);
        });
      }
    });
  }

  if (allImages.length === 0) {
    demoProjects.forEach((p) => {
      addImage(`demo-${p.slug}-cover`, p.title, p.coverImage, p);
      if (Array.isArray(p.gallery)) {
        p.gallery.forEach((img, idx) => {
          addImage(`demo-${p.slug}-gal-${idx}`, `${p.title} - ${idx + 1}`, img, p);
        });
      }
    });
  }

  return { allImages, processedCategories };
}
