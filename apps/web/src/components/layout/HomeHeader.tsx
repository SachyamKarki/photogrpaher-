"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function HomeHeader({ siteTitle }: { siteTitle: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const isHomePage = window.location.pathname === "/";
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(id.replace("#", ""));
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        setIsMenuOpen(false);
      }
    }
  };

  const navLinks = [
    { title: "Gallery", href: "/gallery" },
    { title: "Categories", href: "/#categories" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-40 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 md:px-8">
          <Link href="/" className="relative block h-11 w-48 xs:w-56 sm:w-64">
            <Image
              src="/brand/rabinson-photography-light.svg"
              alt={siteTitle}
              width={280}
              height={56}
              className="h-11 w-auto drop-shadow-sm brightness-110 contrast-125"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-white/90 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                onClick={(e) => link.href.startsWith("#") || link.href.includes("/#") ? scrollToSection(e, link.href) : undefined}
                className="transition-colors hover:text-white"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center text-white transition-opacity hover:opacity-70 lg:hidden"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="7" x2="20" y2="7"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="17" x2="20" y2="17"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Drawer Overlay Backdrop */}
      <div
        className={[
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Side Drawer */}
      <aside
        className={[
          "fixed inset-y-0 right-0 z-[70] w-[70%] border-l border-white/5 bg-zinc-950 shadow-2xl transition-transform duration-500 ease-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col px-10 py-12 text-white">
          <div className="flex shrink-0 items-center justify-end">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl transition hover:bg-white/5"
            >
              ×
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center pb-24">
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("#") || link.href.includes("/#")) {
                      scrollToSection(e, link.href);
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                  className="text-[13px] font-sans font-bold uppercase tracking-[0.25em] transition-colors hover:text-zinc-400"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 flex-col gap-12 pt-12 border-t border-white/5">
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-zinc-500">Contact</p>
                <div className="flex flex-col gap-3">
                  <a href="mailto:hello@rabinson.com" className="text-[13px] font-sans text-zinc-300 hover:text-white transition-colors">hello@rabinson.com</a>
                  <a href="tel:+9779800000000" className="text-[13px] font-sans text-zinc-300 hover:text-white transition-colors">+977 980-0000000</a>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-zinc-500">Socials</p>
                <div className="flex items-center gap-7">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 transition-colors hover:text-white" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="text-zinc-400 transition-colors hover:text-white" aria-label="Behance">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 transition-colors hover:text-white" aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
