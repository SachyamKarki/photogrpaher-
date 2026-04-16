export type PortfolioCategory = {
  title: string;
  slug: string;
  description: string;
  image: string;
};

export type PortfolioProject = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  gallery: string[];
  categorySlug: string;
};

export type SocialLink = {
  label: string;
  url: string;
};

export type Review = {
  _id: string;
  author: string;
  role: string;
  quote: string;
};

export interface SanityImage {
  asset?: {
    _ref?: string;
    _type?: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  camera?: string;
  lens?: string;
  settings?: string;
  description?: string;
}

export type SanityImageSourcePlus = import("@sanity/image-url/lib/types/types").SanityImageSource & SanityImage;

export interface SanityProject {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImageSourcePlus;
  gallery?: SanityImageSourcePlus[];
  category?: { title: string; slug: string };
  categorySlug?: string;
}

export interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface GalleryImage {
  _id: string;
  title: string;
  imageUrl: string;
  aspectRatio: number;
  category?: { title: string; slug: string };
  metadata: {
    camera: string;
    lens: string;
    settings: string;
    description: string;
  };
}
