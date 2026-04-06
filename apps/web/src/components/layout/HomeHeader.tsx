"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeHeader({ siteTitle }: { siteTitle: string }) {
  const [isCompact, setIsCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const nextCompact = window.scrollY > 56;
        if (nextCompact) setIsMenuOpen(false);
        setIsCompact((current) =>
          current === nextCompact ? current : nextCompact,
        );
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

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

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-30 transition-all duration-500 will-change-transform",
        isCompact ? "pointer-events-none pt-0" : "pt-0",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex items-center px-4 sm:px-6 md:px-8",
          isCompact
            ? "max-w-6xl justify-between py-0 opacity-0"
            : "max-w-6xl justify-between py-4",
        ].join(" ")}
      >
        <Link
          href="/"
          className={[
            "relative block h-11 w-[16rem] transition-all duration-500 xs:w-[18rem] sm:w-[22rem]",
            isCompact ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100",
          ].join(" ")}
        >
          <div
            className={[
              "absolute inset-y-0 left-0 flex items-center transition-all duration-500",
              isCompact
                ? "-translate-y-1 scale-95 opacity-0"
                : "translate-y-0 scale-100 opacity-100",
            ].join(" ")}
          >
            <Image
              src="/brand/rabinson-photography-light.svg"
              alt={siteTitle}
              width={280}
              height={56}
              className="h-11 w-auto drop-shadow-sm brightness-110 contrast-125"
              priority
            />
          </div>
        </Link>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
          className={[
            "inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15 sm:hidden",
            isCompact ? "pointer-events-none opacity-0" : "opacity-100",
          ].join(" ")}
        >
          Menu
        </button>

        <nav
          className={[
            "hidden items-center gap-5 text-sm transition-all duration-500 will-change-transform sm:flex",
            isCompact
              ? "pointer-events-none translate-y-1 opacity-0"
              : "translate-y-0 text-white/90 opacity-100",
          ].join(" ")}
        >
          <Link className="hover:text-white" href="/gallery">
            Gallery
          </Link>
          <a
            className="hover:text-white"
            href="/#categories"
            onClick={(e) => scrollToSection(e, "#categories")}
          >
            Categories
          </a>
          <Link className="hover:text-white" href="/about">
            About me
          </Link>
          <a
            className="hover:text-white"
            href="#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
          >
            Contact
          </a>
        </nav>
      </div>

      <div
        className={[
          "mx-auto max-w-6xl px-4 sm:hidden",
          isCompact || !isMenuOpen ? "pointer-events-none opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-4 backdrop-blur">
          <div className="flex flex-col gap-3 text-sm text-white/90">

            <Link
              href="/gallery"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-3 py-2 hover:bg-white/10"
            >
              Gallery
            </Link>
            <a
              href="/#categories"
              onClick={(e) => {
                scrollToSection(e, "#categories");
                setIsMenuOpen(false);
              }}
              className="rounded-2xl px-3 py-2 hover:bg-white/10"
            >
              Categories
            </a>
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-3 py-2 hover:bg-white/10"
            >
              About me
            </Link>
            <a
              href="#contact"
              onClick={(e) => {
                scrollToSection(e, "#contact");
                setIsMenuOpen(false);
              }}
              className="rounded-2xl px-3 py-2 hover:bg-white/10"
            >
              Contact
            </a>
            <Link
              href="/studio"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-3 py-2 hover:bg-white/10"
            >
              Studio
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
