import type { Metadata } from "next";
import { Outfit, Lato, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ScrollToTopOnNav } from "@/components/layout/ScrollToTopOnNav";
import { footerContent } from "@/lib/portfolio/data";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rabin Son Photography | Himalayan Adventure & Automobile Photographer",
    template: "%s | Rabin Son Photography",
  },
  description:
    "Rabin Son is an elite Nepal-based photographer specializing in high-altitude Himalayan adventure, cinematic automobile storytelling, and editorial portraiture. Delivering timeless visuals with absolute technical precision.",
  keywords: [
    "Rabin Son Photography",
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
  authors: [{ name: "Rabin Son", url: SITE_URL }],
  creator: "Rabin Son",
  publisher: "Rabin Son Photography",
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
    siteName: "Rabin Son Photography",
    title: "Rabin Son Photography | Himalayan Adventure & Automobile Photographer",
    description:
      "Capturing honest light and timeless detail across the Himalayas. Specializing in high-altitude adventure, automotive, and refined editorial photography.",
    images: [
      {
        url: "/content/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Rabin Son Photography — Himalayan Adventure & Automobile Photographer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rabin Son Photography | High Altitude & Adventure Photographer",
    description:
      "Nepal-based professional photographer specializing in Himalayan adventure, automobile, and editorial storytelling.",
    images: ["/content/hero.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  category: "Photography",
};

const siteTitle = "RabinSon Photography";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          email={footerContent.email}
          instagramLinks={footerContent.instagramLinks}
          phoneNumber={footerContent.phoneNumber}
          locationLine={footerContent.locationLine}
        />
        <ScrollToTop />
      </body>
    </html>
  );
}
