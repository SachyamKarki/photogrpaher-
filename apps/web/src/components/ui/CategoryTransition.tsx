"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface CategoryTransitionProps {
  title: string;
  imageUrl?: string | null;
  isVisible: boolean;
  mode?: "expand" | "reveal";
}

export function CategoryTransition({ title, imageUrl, isVisible, mode = "expand" }: CategoryTransitionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState<boolean>(isVisible || mode === "reveal");

  useEffect(() => {
    if (isVisible) setIsMounted(true);
    if (mode === "reveal") setIsMounted(true);
  }, [isVisible, mode]);

  useEffect(() => {
    if (!isMounted) return;
    if (isVisible) return;

    // Failsafe: some browsers can be flaky with `clip-path` completion callbacks.
    const timeout = window.setTimeout(() => setIsMounted(false), prefersReducedMotion ? 0 : 900);
    return () => window.clearTimeout(timeout);
  }, [isMounted, isVisible, prefersReducedMotion]);

  useEffect(() => {
    if (!isMounted) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [isMounted]);

  const portalInsets = useMemo(() => {
    // ~40vw x 60vh centered “window”
    const insetTop = "20vh";
    const insetSide = "30vw";
    const radius = "96px";
    return {
      closed: `inset(${insetTop} ${insetSide} ${insetTop} ${insetSide} round ${radius})`,
      open: "inset(0vh 0vw 0vh 0vw round 0px)",
    };
  }, []);

  const transitionOpen = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 160, damping: 24, mass: 0.9 };

  const transitionExit = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  const portalInitial =
    mode === "reveal"
      ? { clipPath: portalInsets.open, opacity: 1, scale: 1, filter: "blur(0px)" }
      : { clipPath: portalInsets.closed, opacity: 0, scale: 0.985, filter: "blur(10px)" };

  const portalAnimate = isVisible
    ? { clipPath: portalInsets.open, opacity: 1, scale: 1, filter: "blur(0px)" }
    : mode === "reveal"
      ? // On the gallery page: keep it full-screen and simply dissolve away.
        { clipPath: portalInsets.open, opacity: 0, scale: 1.01, filter: "blur(6px)" }
      : { clipPath: portalInsets.closed, opacity: 0, scale: 0.985, filter: "blur(12px)" };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none ${isMounted ? "block" : "hidden"}`}
    >
      {/* Background Dim */}
      <motion.div
        initial={{ opacity: mode === "reveal" ? 0.6 : 0 }}
        animate={{ opacity: isVisible ? (mode === "reveal" ? 0.55 : 1) : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
      />

      {/* The "Airplane Window" Portal */}
      <motion.div
        initial={portalInitial}
        animate={portalAnimate}
        transition={isVisible ? transitionOpen : transitionExit}
        onAnimationComplete={() => {
          if (!isVisible) setIsMounted(false);
        }}
        className="absolute inset-0 overflow-hidden bg-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_90px_rgba(0,0,0,0.75)] will-change-[clip-path,transform,filter,opacity]"
      >
        <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
        {/* Category Image inside the portal */}
        {imageUrl ? (
          <motion.div
            initial={{ scale: mode === "reveal" ? 1 : 1.06 }}
            animate={{ scale: isVisible ? 1 : 1.03 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: isVisible ? 0.9 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover opacity-65"
              priority
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06),transparent_55%)]" />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-6">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: isVisible ? 0 : 50, opacity: isVisible ? 1 : 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { delay: isVisible ? 0.12 : 0, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
            className="font-heading text-4xl md:text-6xl xl:text-8xl font-bold uppercase tracking-tighter text-white"
          >
            {title}
          </motion.h2>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isVisible ? "100%" : 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { delay: isVisible ? 0.22 : 0, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
            className="mx-auto h-px bg-white/20 mt-8 max-w-xs"
          />
        </div>
      </motion.div>
    </div>
  );
}
