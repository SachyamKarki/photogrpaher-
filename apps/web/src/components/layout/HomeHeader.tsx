"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HomeHeader({ siteTitle }: { siteTitle: string }) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const onScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const nextCompact = window.scrollY > 56;
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
    </header>
  );
}
