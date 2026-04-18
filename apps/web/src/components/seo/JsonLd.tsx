export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export function PhotographerJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": SITE_URL,
    name: "Rabin Son Photography",
    url: SITE_URL,
    description:
      "Nepal-based professional photographer specializing in high altitude, Himalayan adventure, automobile, studio portrait, and wedding photography.",
    image: `${SITE_URL}/content/hero.jpg`,
    telephone: "+977-980-3612055",
    email: "Rabinson2055@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NP",
      addressLocality: "Nepal",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.7172,
      longitude: 85.324,
    },
    sameAs: [
      "https://www.instagram.com/art_of_rabinson",
      "https://www.instagram.com/autovibes_nepal",
      "https://www.instagram.com/rabinson01",
    ],
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "06:00",
      closes: "20:00",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Photography Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "High Altitude & Mountain Photography",
            description:
              "Raw, immersive storytelling across the Himalayas and world's most challenging terrains. Expert in logistics and capture in extreme environments.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Automobile Photography",
            description:
              "High-performance visuals emphasizing form, engineering, and presence in cinematic compositions. Specializing in lifestyle and action automotive shoots.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Editorial & Studio Portraits",
            description:
              "Intentional, character-driven portraiture with genuine expression and clean composition for brands and individuals.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Adventure Wedding Photography",
            description:
              "Editorial wedding photography merging landscape grandeur with intimate connection in remote locations.",
          },
        },
      ],
    },
    knowsAbout: [
      "High Altitude Photography",
      "Cinematic Automotive Photography",
      "Editorial Storytelling",
      "Documentary Portraiture",
      "Himalayan Logistics",
      "Natural Light Shaping",
      "Drone Photography",
      "Commercial Brand Strategy",
    ],
    brand: {
      "@type": "Brand",
      name: "Rabin Son",
      logo: `${SITE_URL}/icon.png`,
    },
  };

  return <JsonLd data={data} />;
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rabin Son Photography",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/gallery?category={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

export function ImageGalleryJsonLd({
  images,
}: {
  images: { url: string; name: string; description?: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Rabin Son Photography Gallery",
    description:
      "Professional photography gallery featuring Himalayan landscapes, automobile photography, studio portraits, and editorial work.",
    url: `${SITE_URL}/gallery`,
    image: images.slice(0, 20).map((img) => ({
      "@type": "ImageObject",
      url: img.url.startsWith("http") ? img.url : `${SITE_URL}${img.url}`,
      name: img.name,
      description: img.description || `Professional photograph by Rabin Son`,
      author: {
        "@type": "Person",
        name: "Rabin Son",
      },
    })),
  };

  return <JsonLd data={data} />;
}
