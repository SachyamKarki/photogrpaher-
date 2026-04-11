import { defineQuery } from "groq";

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id in ["siteSettings", "drafts.siteSettings"]][0]{
    _id,
    title,
    description,
    heroTitle,
    heroSubtitle,
    heroMediaType,
    heroImage,
    "heroVideoUrl": heroVideo.asset->url,
    servicesTitle,
    servicesIntro,
    services,
    email,
    instagram,
    facebook,
    whatsapp
  }
`);

export const HOME_CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current) && featuredOnHome == true]
  | order(homeOrder asc, _createdAt asc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage
  }
`);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage
  }
`);

export const PROJECTS_BY_CATEGORY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current) && category->slug.current == $slug]
  | order(publishedAt desc)[0...24]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    publishedAt
  }
`);

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  | order(publishedAt desc)[0...12]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    "category": category->{title, "slug": slug.current},
    publishedAt
  }
`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    gallery,
    publishedAt
  }
`);
export const GALLERY_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  | order(publishedAt desc)[0...100]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage {
      ...,
      "dimensions": asset->metadata.dimensions
    },
    gallery[] {
      ...,
      "dimensions": asset->metadata.dimensions
    },
    "category": category->{title, "slug": slug.current},
    publishedAt
  }
`);

export const REVIEWS_QUERY = defineQuery(`
  *[_type == "review" && featured == true] | order(_createdAt desc) {
    _id,
    author,
    role,
    quote
  }
`);
