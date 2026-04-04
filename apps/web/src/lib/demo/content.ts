export type DemoCategory = {
  title: string;
  slug: string;
  description: string;
  image: string;
};

export type DemoProject = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  gallery: string[];
  categorySlug: string;
};

export const demoHero = {
  title: "Quiet frames. Lasting stories.",
  subtitle: "Wedding, portrait, and commercial photography.",
  mediaType: "image" as const,
  image: "/demo/hero.jpg",
};

export const demoCategories: DemoCategory[] = [
  {
    title: "Weddings",
    slug: "weddings",
    description: "Candid storytelling, timeless portraits, and elegant details.",
    image: "/demo/category-weddings.jpg",
  },
  {
    title: "Portraits",
    slug: "portraits",
    description: "Studio and natural light portraits with refined direction.",
    image: "/demo/category-portraits.jpg",
  },
  {
    title: "Commercial",
    slug: "commercial",
    description: "Brand, product, and lifestyle imagery designed to convert.",
    image: "/demo/category-commercial.jpg",
  },
];

export const demoServices = {
  title: "What we do",
  intro:
    "A premium photography experience—from planning to delivery—tailored to your story.",
  items: [
    {
      title: "Pre-shoot planning",
      description:
        "Locations, styling, schedules, and shot lists to make the day effortless.",
    },
    {
      title: "Professional capture",
      description:
        "A calm, guided shoot with an editorial approach and attention to light.",
    },
    {
      title: "Retouch & delivery",
      description:
        "Color grading, retouching, and a beautiful gallery with print-ready exports.",
    },
  ],
};

export const demoAbout = {
  eyebrow: "About",
  title: "A quiet, editorial approach to modern photography.",
  body:
    "Rabinson Photographs focuses on honest light, strong composition, and images that feel refined without losing emotion. Each project is approached with calm direction, careful pacing, and a clean visual language built to last.",
  note:
    "Available for weddings, portraits, and selected commercial commissions.",
};

export const demoFooter = {
  email: "hello@example.com",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  locationLine: "Based in Kathmandu • Available worldwide",
};

export const demoProjects: DemoProject[] = [
  {
    title: "Golden Hour Ceremony",
    slug: "golden-hour-ceremony",
    excerpt: "Warm light, natural emotion, and a cinematic finish.",
    coverImage: "/demo/bento-1.jpg",
    gallery: ["/demo/bento-1.jpg", "/demo/bento-2.jpg", "/demo/bento-3.jpg"],
    categorySlug: "weddings",
  },
  {
    title: "Modern Portrait Session",
    slug: "modern-portrait-session",
    excerpt: "Clean frames with confident direction and texture.",
    coverImage: "/demo/bento-2.jpg",
    gallery: ["/demo/bento-2.jpg", "/demo/bento-4.jpg", "/demo/bento-5.jpg"],
    categorySlug: "portraits",
  },
  {
    title: "Editorial Couple Shoot",
    slug: "editorial-couple-shoot",
    excerpt: "Minimal styling and strong composition for timeless images.",
    coverImage: "/demo/bento-3.jpg",
    gallery: ["/demo/bento-3.jpg", "/demo/bento-1.jpg", "/demo/bento-6.jpg"],
    categorySlug: "weddings",
  },
  {
    title: "Product Studio Set",
    slug: "product-studio-set",
    excerpt: "High-contrast lighting and premium product detail.",
    coverImage: "/demo/bento-4.jpg",
    gallery: ["/demo/bento-4.jpg", "/demo/bento-5.jpg", "/demo/bento-6.jpg"],
    categorySlug: "commercial",
  },
  {
    title: "Lifestyle Brand Story",
    slug: "lifestyle-brand-story",
    excerpt: "Natural moments, true color, and modern brand presence.",
    coverImage: "/demo/bento-5.jpg",
    gallery: ["/demo/bento-5.jpg", "/demo/bento-2.jpg", "/demo/bento-1.jpg"],
    categorySlug: "commercial",
  },
  {
    title: "Black & White Portraits",
    slug: "black-and-white-portraits",
    excerpt: "Classic monochrome with modern edge and soft contrast.",
    coverImage: "/demo/bento-6.jpg",
    gallery: ["/demo/bento-6.jpg", "/demo/bento-2.jpg", "/demo/bento-3.jpg"],
    categorySlug: "portraits",
  },
];
