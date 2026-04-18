import { PortfolioCategory, PortfolioProject } from "@/types";

export const siteHero = {
  title: "Honest Light. Timeless Detail.",
  subtitle: "High altitude, Adventure and Automobile photographer",
  mediaType: "image" as const,
  image: "/content/hero.jpg",
};

export const portfolioCategories: PortfolioCategory[] = [
  {
    title: "Studio",
    slug: "studio-portraits",
    description: "Candid storytelling, timeless moments, and cultural traditions.",
    image: "/content/category-portraits.jpg",
  },
  {
    title: "Himalayas",
    slug: "himalayas",
    description: "Breathtaking landscapes and rugged terrains of the Himalayas.",
    image: "/content/category-mountain.jpg",
  },
  {
    title: "Automobile",
    slug: "automobile",
    description: "Classic machines exploring the diverse roads of Nepal.",
    image: "/content/category-automobile.jpg",
  },
];

export const siteServices = {
  title: "What WE DO",
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
      title: "Studio",
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

export const aboutContent = {
  eyebrow: "The Photographer",
  title: "The Vision Behind the Frames.",
  body:
    "Rabin Son is a Nepal-based photographer focused on honest light, calm direction, and clean composition. From Himalayan passes to studio sets, the work balances documentary sincerity with an editorial finish—built to feel timeless, not trendy.",
  longBody: [
    "His approach is rooted in observation first: reading the scene, shaping small details, and letting real moments unfold. Whether photographing people, machines, or landscapes, the goal is the same—clarity, intention, and images that hold up years later.",
    "On set, direction is minimal and precise. You’ll get clear prompts, confident pacing, and enough structure to keep everything effortless while still protecting the frame. This is especially important for portraits and weddings, where comfort and tempo matter as much as light.",
    "In post-production, the edit stays true-to-life: consistent skin tones, natural contrast, and a refined color palette. Deliveries are curated—so you receive the strongest photographs, sequenced like a story, ready for print and web.",
  ],
  principles: [
    "Natural light first, with deliberate shaping when needed.",
    "Simple composition and clean backgrounds—no visual noise.",
    "True-to-life color and consistent finishing across the set.",
    "A calm experience: clear direction, no over-posing.",
  ],
  note:
    "Currently accepting commissions for travel, editorial, automotive, and adventure photography.",
};

export const footerContent = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Rabinson2055@gmail.com",
  instagramLinks: [
    { label: "Art of Rabin Son", url: "https://www.instagram.com/art_of_rabinson?igsh=bTh1Y2xpb3Zid2pz" },
    { label: "AutoVibes Nepal", url: "https://www.instagram.com/autovibes_nepal?igsh=NGhveXMzanZrZzIw" },
    { label: "Personal", url: "https://www.instagram.com/rabinson01?igsh=MXh5YTZkcm42ZHZvbA==" },
  ],
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/9779803612055",
  phoneNumber: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+977 980-3612055",
  locationLine: null,
};

export const brandPartners = [
  { name: "Toyota", logo: "/content/partners/toyota.svg" },
  { name: "Ather", logo: "/content/partners/ather.svg" },
  { name: "Pelliot", logo: "/content/partners/pelliot.png" },
  { name: "Seven Summit Treks", logo: "/content/partners/sevensummit.jpg" },
  { name: "NMA", logo: "/content/partners/nma.png" },
  { name: "NNMGA", logo: "/content/partners/nnmga.png" },
  { name: "Freedom Adventure Treks", logo: "/content/partners/freedom-adventure.png" },

];

export const clientReviews = [
  {
    _id: "rev1",
    author: "Sarah & James",
    role: "Wedding Clients",
    quote: "Working with Rabin Son was the best decision we made for our wedding. The images aren't just photos; they're absolute art. He managed to capture the quiet, unseen moments perfectly without ever feeling intrusive.",
  },
  {
    _id: "rev2",
    author: "Alex Mercer",
    role: "Creative Director, Kinfolk",
    quote: "Rabin Son brings an incredible eye for light and composition to every set. The resulting editorial spreads were flawless and delivered exactly what the brand needed. True professional.",
  },
  {
    _id: "rev3",
    author: "Elena Rostova",
    role: "Portrait Session",
    quote: "I usually hate having my picture taken, but the session was incredibly calm and natural. When I saw the final gallery, I was speechless. These are images I will cherish for the rest of my life.",
  }
];

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "Golden Hour Ceremony",
    slug: "golden-hour-ceremony",
    excerpt: "Warm light, natural emotion, and a cinematic finish.",
    coverImage: "/content/bento-1.jpg",
    gallery: ["/content/bento-1.jpg", "/content/bento-2.jpg", "/content/bento-3.jpg"],
    categorySlug: "studio-portraits",
  },
  {
    title: "Modern Portrait Session",
    slug: "modern-portrait-session",
    excerpt: "Clean frames with confident direction and texture.",
    coverImage: "/content/bento-2.jpg",
    gallery: ["/content/bento-2.jpg", "/content/bento-4.jpg", "/content/bento-5.jpg"],
    categorySlug: "studio-portraits",
  },
  {
    title: "Editorial Couple Shoot",
    slug: "editorial-couple-shoot",
    excerpt: "Minimal styling and strong composition for timeless images.",
    coverImage: "/content/bento-3.jpg",
    gallery: ["/content/bento-3.jpg", "/content/bento-1.jpg", "/content/bento-6.jpg"],
    categorySlug: "studio-portraits",
  },
  {
    title: "Product Studio Set",
    slug: "product-studio-set",
    excerpt: "High contrast lighting and premium product detail.",
    coverImage: "/content/bento-4.jpg",
    gallery: ["/content/bento-4.jpg", "/content/bento-5.jpg", "/content/bento-6.jpg"],
    categorySlug: "commercial",
  },
  {
    title: "Lifestyle Brand Story",
    slug: "lifestyle-brand-story",
    excerpt: "Natural moments, true color, and modern brand presence.",
    coverImage: "/content/bento-5.jpg",
    gallery: ["/content/bento-5.jpg", "/content/bento-2.jpg", "/content/bento-1.jpg"],
    categorySlug: "commercial",
  },
  {
    title: "Black and White Portraits",
    slug: "black-and-white-portraits",
    excerpt: "Classic monochrome with modern edge and soft contrast.",
    coverImage: "/content/bento-6.jpg",
    gallery: ["/content/bento-6.jpg", "/content/bento-2.jpg", "/content/bento-3.jpg"],
    categorySlug: "studio-portraits",
  },
];
