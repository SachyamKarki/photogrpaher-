import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rabin Son Photography",
  description: "A professional photography portfolio powered by Next.js and Sanity.",
};

const siteTitle = "Rabin Son Photography";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${inter.variable} bg-white text-zinc-950 antialiased font-body`}
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
