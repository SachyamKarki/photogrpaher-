import type { Metadata } from "next";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rabinson Photographs",
  description: "A professional photography portfolio powered by Next.js and Sanity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body id="top" className="flex min-h-full flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
