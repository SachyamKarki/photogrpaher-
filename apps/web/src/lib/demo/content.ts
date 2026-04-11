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
    description: "Candid storytelling, timeless moments, and cultural traditions.",
    image: "/demo/category-weddings.png",
  },
  {
    title: "Mountain",
    slug: "mountain",
    description: "Breathtaking landscapes and rugged terrains of the Himalayas.",
    image: "/demo/category-mountain.jpg",
  },
  {
    title: "Automobile",
    slug: "automobile",
    description: "Classic machines exploring the diverse roads of Nepal.",
    image: "https://cdn.sanity.io/images/8gy5kmv3/production/e8e491d3880e3c9a680bf94461822e76a7771b4c-7437x4960.jpg?rect=0,156,7437,4648&w=1600&h=1000",
  },
];

export const demoServices = {
  title: "Things We Do",
  intro:
    "A premium photography experience, from planning to delivery, tailored to your story.",
  items: [
    {
      title: "Mountains & High Altitude",
      description:
        "Specializing in raw, immersive storytelling across the world's most challenging terrains. We capture the grand scale of the Himalayas and the intimate endurance of the people within them, shaped by natural light and absolute technical precision.",
      details: [
        "Capture breathtaking landscapes from the Himalayas to remote alpine valleys.",
        "Document the journey, struggle, and triumph of high altitude adventures.",
        "Blend cinematic storytelling with technical precision for epic visuals.",
        "Highlight the raw beauty and solitude of extreme mountain environments.",
        "Create imagery that immerses viewers in the adventure, not just the scene.",
      ],
    },
    {
      title: "Automotive photography",
      description:
        "High-performance visuals that emphasize form, engineering, and presence. From rugged mountain passes to studio environments, we blend motion and light to tell the definitive story of every machine.",
      details: [
        "Showcase cars and bikes in cinematic, dynamic compositions.",
        "Emphasize performance, design, and engineering in every shot.",
        "Capture vehicles in rugged, natural, or adventurous landscapes.",
        "Blend motion, light, and environment to tell a visual story.",
      ],
    },
    {
      title: "Studio Portraits",
      description:
        "Intentional, character-driven portraiture that prioritizes simplicity and genuine expression. We focus on capturing quiet, enduring moments that reflect the soul of the subject against any backdrop.",
      details: [
        "Create cinematic portraits against breathtaking high altitude backdrops.",
        "Capture personalities, emotions, and intimate moments in adventure settings.",
        "Combine storytelling with visual artistry to create memorable imagery.",
      ],
    },
    {
      title: "Pre-Wedding & Weddings",
      description:
        "Deeply personal, editorial wedding photography that merges the grandeur of the landscape with the intimacy of your connection. We stage and capture love stories that feel both timeless and epic.",
      details: [
        "Tell love stories against the grandeur of Himalayan landscapes.",
        "Merge storytelling, emotion, and adventure into unforgettable visuals.",
        "Stage and capture moments that feel both intimate and epic.",
      ],
    },
  ],
};

export const demoAbout = {
  eyebrow: "About",
  title: "Remote landscapes. High altitudes.",
  body:
    "Rabinson is a Nepal based travel filmmaker and photographer working across remote landscapes and high altitude environments. His work is defined by a quiet, observational approach, rooted in natural light, restrained composition, and a sensitivity to the moments that exist between action. Rather than directing, he allows scenes to unfold, creating imagery that feels both immediate and enduring.",
  note:
    "Available for travel, editorial, and selected commercial commissions.",
};

export const demoFooter = {
  email: "hello@example.com",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  whatsapp: "https://wa.me/9779800000000",
  locationLine: "Based in Kathmandu • Available worldwide",
};

export const demoBrands = [
  { name: "Toyota", logo: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/toyota.svg" },
  { name: "Ather", logo: "" }, // Typographic fallback
  { name: "Pelliot", logo: "" },
  { name: "Seven Summit", logo: "" },
  { name: "NMA", logo: "" },
  { name: "NNMGA", logo: "" },
  { name: "Freedom Adventure", logo: "" },
  { name: "Freedom Foundation", logo: "" }
];

export const demoReviews = [
  {
    _id: "rev1",
    author: "Sarah & James",
    role: "Wedding Clients",
    quote: "Working with Rabinson was the best decision we made for our wedding. The images aren't just photos; they're absolute art. He managed to capture the quiet, unseen moments perfectly without ever feeling intrusive.",
  },
  {
    _id: "rev2",
    author: "Alex Mercer",
    role: "Creative Director, Kinfolk",
    quote: "Rabinson brings an incredible eye for light and composition to every set. The resulting editorial spreads were flawless and delivered exactly what the brand needed. True professional.",
  },
  {
    _id: "rev3",
    author: "Elena Rostova",
    role: "Portrait Session",
    quote: "I usually hate having my picture taken, but the session was incredibly calm and natural. When I saw the final gallery, I was speechless. These are images I will cherish for the rest of my life.",
  }
];

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
    excerpt: "High contrast lighting and premium product detail.",
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
    title: "Black and White Portraits",
    slug: "black-and-white-portraits",
    excerpt: "Classic monochrome with modern edge and soft contrast.",
    coverImage: "/demo/bento-6.jpg",
    gallery: ["/demo/bento-6.jpg", "/demo/bento-2.jpg", "/demo/bento-3.jpg"],
    categorySlug: "portraits",
  },
];
