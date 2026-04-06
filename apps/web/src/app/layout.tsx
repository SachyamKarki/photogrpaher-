import type { Metadata } from "next";
import { Pinyon_Script } from "next/font/google";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ScrollToTopOnNav } from "@/components/layout/ScrollToTopOnNav";
import { demoFooter } from "@/lib/demo/content";

const calligraphy = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-calligraphy",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rabinson Photography",
  description: "A professional photography portfolio powered by Next.js and Sanity.",
};

const siteTitle = "Rabinson Photography";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${calligraphy.variable} font-sans bg-white text-zinc-950 antialiased`}
      >
        {children}
        <SiteFooter
          siteTitle={siteTitle}
          email={demoFooter.email}
          instagram={demoFooter.instagram}
          facebook={demoFooter.facebook}
          whatsapp={demoFooter.whatsapp}
        />
        <ScrollToTop />
      </body>
    </html>
  );
}
