import type { Metadata } from "next";
import { Pinyon_Script, Montserrat } from "next/font/google";
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

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
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
      <head>
        <script
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
      </head>
      <body
        className={`${calligraphy.variable} ${montserrat.variable} font-sans bg-white text-zinc-950 antialiased`}
      >
        <ScrollToTopOnNav />
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
