import type { Metadata } from "next";
import { Outfit, Lato, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ScrollToTopOnNav } from "@/components/layout/ScrollToTopOnNav";
import { footerContent } from "@/lib/portfolio/data";
import { sanityServerClient } from "@/lib/sanity/serverClient";
import { SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ["100", "300", "400", "700", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

type SiteSettings = {
  title?: string;
  description?: string;
  email?: string;
  instagram?: string;
  instagramLinks?: { label?: string; url?: string }[];
  phoneNumber?: string;
  locationLine?: string;
};

async function getSiteSettings() {
  if (!sanityServerClient) {
    return null;
  }

  try {
    return await sanityServerClient.fetch<SiteSettings>(SITE_SETTINGS_QUERY);
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteTitle = settings?.title?.trim() || "RabinSon Photography";
  const siteDescription =
    settings?.description?.trim() ||
    "RabinSon is an elite Nepal-based photographer specializing in high-altitude Himalayan adventure, cinematic automobile storytelling, and editorial portraiture. Delivering timeless visuals with absolute technical precision.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteTitle,
      template: `%s | ${siteTitle}`,
    },
    description: siteDescription,
    keywords: [
      "RabinSon Photography",
      "Nepal high altitude photographer",
      "Himalayan adventure photography",
      "Mount Everest photographer",
      "Automobile photographer Nepal",
      "Kathmandu editorial photographer",
      "Luxury wedding photographer Nepal",
      "Mustang adventure photography",
      "Commercial automotive photography",
      "Professional portraits Kathmandu",
      "Landscape photography Himalayas",
      "Outdoor adventure storyteller",
    ],
    authors: [{ name: siteTitle, url: SITE_URL }],
    creator: siteTitle,
    publisher: siteTitle,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: siteTitle,
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: "/content/hero.jpg",
          width: 1200,
          height: 630,
          alt: `${siteTitle} hero image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: siteDescription,
      images: ["/content/hero.jpg"],
    },
    alternates: {
      canonical: SITE_URL,
    },
    icons: {
      icon: "/icon.png",
      shortcut: "/favicon.ico",
      apple: "/apple-icon.png",
    },
    category: "Photography",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const siteTitle = settings?.title ?? "RabinSon Photography";
  const instagramLinks =
    settings?.instagramLinks?.filter((link) => link?.label && link?.url).map((link) => ({
      label: link.label!.trim(),
      url: link.url!.trim(),
    })) ??
    (settings?.instagram ? [{ label: "Instagram", url: settings.instagram }] : footerContent.instagramLinks);

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${lato.variable} ${playfair.variable} bg-white text-zinc-950 antialiased font-body`}
      >
        <Script
          id="global-error-handler"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.addEventListener('error', function(event) {
                  if (
                    event.filename?.includes('webkit-masked-url') ||
                    event.message?.includes('resp.payload') ||
                    event.message?.includes('Can\\'t find variable: output') ||
                    (event.error?.stack && event.error.stack.includes('webkit-masked-url'))
                  ) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(event) {
                  if (event.reason?.stack?.includes('webkit-masked-url')) {
                    event.preventDefault();
                  }
                });
              })();
            `,
          }}
        />
        <Toaster richColors closeButton position="bottom-right" />
        <ScrollToTopOnNav />
        {children}
        <SiteFooter
          siteTitle={siteTitle}
          email={settings?.email ?? footerContent.email}
          instagramLinks={instagramLinks}
          phoneNumber={settings?.phoneNumber ?? footerContent.phoneNumber}
          locationLine={settings?.locationLine ?? footerContent.locationLine}
        />
        <ScrollToTop />
      </body>
    </html>
  );
}
