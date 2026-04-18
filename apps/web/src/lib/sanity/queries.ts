import { defineQuery } from "groq";

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id in ["siteSettings", "drafts.siteSettings"]][0]{
    _id,
    title,
    description,
    logo,
    heroTitle,
    heroSubtitle,
    heroMediaType,
    heroImage,
    "heroVideoUrl": heroVideo.asset->url,
    servicesTitle,
    servicesIntro,
    services,
    aboutTitle,
    aboutBody,
    aboutLongBody,
    aboutPrinciples,
    availabilityNote,
    email,
    instagram,
    instagramLinks,
    facebook,
    whatsapp,
    phoneNumber,
    locationLine
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
  | order(publishedAt desc)[$start...$end]{
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

export const FEATURED_IMAGES_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current) && (coverImage.isFeatured == true || defined(coverImage.featuredOrder) || count(gallery[isFeatured == true || defined(featuredOrder)]) > 0)]
  | order(publishedAt desc)[0...50]{
    _id,
    title,
    "category": category->{title, "slug": slug.current},
    coverImage,
    gallery
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

export const PARTNERS_QUERY = defineQuery(`
  *[_type == "partner"] | order(order asc, _createdAt desc) {
    _id,
    name,
    logo {
      asset->{
        _id,
        url
      }
    },
    website,
    order
  }
`);
