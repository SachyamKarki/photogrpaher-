"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LogoMark } from "@/components/brand/LogoMark";

export function HomeHeader({ siteTitle }: { siteTitle: string }) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsCompact(window.scrollY > 56);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-30 transition-all duration-300",
        isCompact ? "pt-3" : "pt-0",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-6xl items-center justify-between px-6 sm:px-10",
          isCompact ? "max-w-fit rounded-full border border-black/5 bg-white/92 px-4 py-3 shadow-lg backdrop-blur" : "py-6",
        ].join(" ")}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            className={[
              "flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300",
              isCompact
                ? "h-10 w-10 bg-zinc-950 text-white"
                : "h-11 w-11 border border-white/20 bg-black/20 text-white backdrop-blur",
            ].join(" ")}
          >
            <LogoMark className="h-6 w-6" />
          </div>

          <div
            className={[
              "overflow-hidden transition-all duration-300",
              isCompact ? "max-w-0 opacity-0" : "max-w-[12rem] opacity-100",
            ].join(" ")}
          >
            <div className="whitespace-nowrap text-sm font-semibold tracking-[0.2em] text-white drop-shadow-sm">
              {siteTitle}
            </div>
          </div>
        </Link>

        <nav
          className={[
            "hidden items-center gap-6 text-sm transition-all duration-300 sm:flex",
            isCompact
              ? "max-w-0 overflow-hidden opacity-0"
              : "max-w-[32rem] text-white/90",
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
    </header>
  );
}
