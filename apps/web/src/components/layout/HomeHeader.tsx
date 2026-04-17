"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

type SocialLink = {
  label: string;
  url: string;
};

export function HomeHeader({
  siteTitle,
  email,
  phoneNumber,
  instagramLinks
}: {
  siteTitle: string;
  email?: string;
  phoneNumber?: string;
  instagramLinks?: SocialLink[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    };
  }, [isMenuOpen]);

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
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12 xl:px-16">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-48 sm:w-64 md:w-80 h-6 sm:h-8 flex items-center transition-opacity group-hover:opacity-70">
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6 md:-left-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-[calc(100%+4rem)] h-[60px] sm:h-[80px] md:h-[100px]">
                <Image
                  src="/brand/rabinson_logo-Photoroom.png"
                  alt={`${siteTitle} Logo`}
                  fill
                  sizes="(max-width: 768px) 250px, 400px"
                  className="object-contain object-left brightness-0 invert"
                  unoptimized
                  priority
                />
              </div>
            </div>
          </Link>

          <nav className="relative z-10 hidden items-center gap-6 text-sm font-medium text-white/90 sm:text-base lg:text-sm lg:flex">
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
          "fixed inset-y-0 right-0 z-[70] w-[85%] sm:w-[70%] border-l border-white/5 bg-zinc-950 shadow-2xl transition-transform duration-500 ease-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col px-6 sm:px-10 py-10 sm:py-12 text-white">
          <div className="flex shrink-0 items-center justify-end">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xl transition hover:bg-white/5"
            >
              ×
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-10 overflow-y-auto py-6">
            {/* Navigation */}
            <nav className="flex flex-col gap-5">
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
                  className="text-sm font-body tracking-wide text-zinc-300 transition-colors hover:text-white"
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            {/* Contact */}
            <div className="space-y-4 border-t border-white/5 pt-8">
              <p className="text-xs font-body font-medium uppercase tracking-[0.12em] text-zinc-500">
                Contact
              </p>
              <div className="flex flex-col gap-4">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="group flex items-center gap-3 text-zinc-300 transition-colors hover:text-white"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-white transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                    </div>
                    <span className="text-sm font-body tracking-wide">
                      {email}
                    </span>
                  </a>
                )}
                {phoneNumber && (
                  <a
                    href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-zinc-300 transition-colors hover:text-white"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-zinc-400 group-hover:bg-[#25D366] group-hover:text-white transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                        <path d="M12 21a9 9 0 0 1-4.2-1.04L3 21l1.1-4.2A9 9 0 1 1 12 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M9.05 8.9c.2-.49.4-.5.74-.5h.6c.17 0 .39.06.6.47.2.41.7 1.7.76 1.82.06.12.1.27.02.43-.08.16-.12.27-.25.41-.12.14-.26.32-.37.43-.12.12-.24.24-.1.47.14.23.64 1.04 1.38 1.68.95.83 1.75 1.09 1.98 1.21.23.12.36.1.49-.06.14-.16.56-.65.71-.87.14-.22.29-.18.49-.1.2.08 1.28.6 1.5.71.22.1.37.16.43.25.06.08.06.49-.12.96-.18.47-1.02.92-1.42.97-.39.05-.88.07-1.42-.1-.33-.1-.76-.25-1.3-.49-2.29-1-3.78-3.33-3.9-3.49-.12-.16-.93-1.23-.93-2.35s.58-1.67.79-1.9Z" fill="currentColor" />
                      </svg>
                    </div>
                    <span className="text-sm font-body tracking-wide">
                      {phoneNumber}
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* Socials */}
            <div className="space-y-4 border-t border-white/5 pt-8">
              <p className="text-xs font-body font-medium uppercase tracking-[0.12em] text-zinc-500">
                Socials
              </p>
              <div className="flex flex-col gap-4">
                {instagramLinks?.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-zinc-400 transition-colors hover:text-white"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-zinc-400 group-hover:bg-gradient-to-tr group-hover:from-[#f9ce34] group-hover:via-[#ee2a7b] group-hover:to-[#6228d7] group-hover:text-white transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </div>
                    <span className="text-sm font-body tracking-wide">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
