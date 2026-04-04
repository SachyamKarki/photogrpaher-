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

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-30 transition-all duration-500 will-change-transform",
        isCompact ? "pointer-events-none pt-0" : "pt-0",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex items-center px-6 sm:px-10",
          isCompact
            ? "max-w-6xl justify-between py-0 opacity-0"
            : "max-w-6xl justify-between py-6",
        ].join(" ")}
      >
        <Link
          href="/"
          className={[
            "relative block h-10 w-[19rem] transition-all duration-500 sm:w-[20rem]",
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
              src="/brand/rabinson-photographs-light.svg"
              alt={siteTitle}
              width={304}
              height={67}
              className="h-10 w-auto drop-shadow-sm"
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
            "hidden items-center gap-6 text-sm transition-all duration-500 will-change-transform sm:flex",
            isCompact
              ? "pointer-events-none translate-y-1 opacity-0"
              : "translate-y-0 text-white/90 opacity-100",
          ].join(" ")}
        >
          <a className="hover:text-white" href="#work">
            Work
          </a>
          <a className="hover:text-white" href="#categories">
            Categories
          </a>
          <a className="hover:text-white" href="#services">
            Services
          </a>
          <a className="hover:text-white" href="#contact">
            Contact
          </a>
        </nav>
      </div>

      <div
        className={[
          "mx-auto max-w-6xl px-6 sm:hidden",
          isCompact || !isMenuOpen ? "pointer-events-none opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-4 backdrop-blur">
          <div className="flex flex-col gap-3 text-sm text-white/90">
            <a
              href="#work"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-3 py-2 hover:bg-white/10"
            >
              Work
            </a>
            <a
              href="#categories"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-3 py-2 hover:bg-white/10"
            >
              Categories
            </a>
            <a
              href="#services"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl px-3 py-2 hover:bg-white/10"
            >
              Services
            </a>
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
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
