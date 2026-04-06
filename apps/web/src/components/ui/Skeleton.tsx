"use client";

import React from "react";

type SkeletonProps = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Base skeleton shimmer block — white themed.
 * Use `className` to set width, height, and border-radius.
 */
export function Skeleton({ className = "", children }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer rounded-lg ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

/* ── Hero skeleton ── */
export function HeroSkeleton() {
  return (
    <section className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-white">
      <div className="absolute inset-0 skeleton-shimmer" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-end px-6 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-36">
        <div className="max-w-2xl w-full">
          <Skeleton className="h-12 w-3/4 sm:h-16" />
          <Skeleton className="mt-5 h-5 w-full max-w-xl" />
          <Skeleton className="mt-2 h-5 w-2/3 max-w-xl" />
          <div className="mt-8 flex gap-3">
            <Skeleton className="h-11 w-36 !rounded-full" />
            <Skeleton className="h-11 w-36 !rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Gallery / Featured Work skeleton ── */
export function GallerySkeleton() {
  return (
    <section className="py-16 sm:py-32">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Skeleton className="h-4 w-16 mb-4" />
          <Skeleton className="h-8 w-56 sm:h-10" />
          <Skeleton className="mt-3 h-4 w-80" />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:auto-rows-[180px]">
        <Skeleton className="min-h-[320px] sm:col-span-7 sm:row-span-3 sm:min-h-0 !rounded-[2rem]" />
        <Skeleton className="min-h-[240px] sm:col-span-5 sm:row-span-2 sm:min-h-0 !rounded-[2rem]" />
        <Skeleton className="min-h-[220px] sm:col-span-5 sm:row-span-1 sm:min-h-0 !rounded-[2rem]" />
        <Skeleton className="min-h-[220px] sm:col-span-4 sm:row-span-1 sm:min-h-0 !rounded-[2rem]" />
        <Skeleton className="min-h-[220px] sm:col-span-4 sm:row-span-1 sm:min-h-0 !rounded-[2rem]" />
        <Skeleton className="min-h-[220px] sm:col-span-4 sm:row-span-1 sm:min-h-0 !rounded-[2rem]" />
      </div>
    </section>
  );
}

/* ── Categories Showcase skeleton ── */
export function CategoriesSkeleton() {
  return (
    <section className="py-16 sm:py-32">
      <div className="mb-12 sm:mb-20">
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-8 w-64 sm:h-10" />
      </div>

      <div className="hidden md:block space-y-0">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-6 py-10 border-t border-zinc-100 first:border-t-0">
            <Skeleton className="h-4 w-8 shrink-0" />
            <Skeleton className="h-14 flex-1 max-w-lg sm:h-20 !rounded-xl" />
            <Skeleton className="h-12 w-12 !rounded-full shrink-0" />
          </div>
        ))}
        <div className="border-t border-zinc-100" />
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[280px] w-full !rounded-2xl" />
        ))}
      </div>
    </section>
  );
}

/* ── About section skeleton ── */
export function AboutSkeleton() {
  return (
    <section className="py-16 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <Skeleton className="mx-auto h-3 w-16 mb-4" />
        <Skeleton className="mx-auto h-8 w-96 max-w-full sm:h-10" />
        <Skeleton className="mx-auto mt-5 h-4 w-full max-w-2xl" />
        <Skeleton className="mx-auto mt-2 h-4 w-4/5 max-w-2xl" />
        <Skeleton className="mx-auto mt-2 h-4 w-3/5 max-w-2xl" />
        <Skeleton className="mx-auto mt-8 h-11 w-32 !rounded-full" />
      </div>
    </section>
  );
}

/* ── Brands marquee skeleton ── */
export function BrandsSkeleton() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 py-12 sm:py-16 overflow-hidden flex flex-col items-center">
      <Skeleton className="h-3 w-48 mb-8 md:mb-12" />
      <div className="flex gap-16 md:gap-24 items-center w-full px-16">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 md:w-32 shrink-0" />
        ))}
      </div>
    </section>
  );
}

/* ── Services skeleton ── */
export function ServicesSkeleton() {
  return (
    <section className="py-16 sm:py-32">
      <div className="rounded-[2rem] bg-white px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <Skeleton className="h-3 w-16 mb-4" />
        <Skeleton className="h-8 w-48 sm:h-10" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />

        <div className="mx-auto mt-10 max-w-4xl space-y-4 sm:mt-12">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full !rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Reviews skeleton ── */
export function ReviewsSkeleton() {
  return (
    <section className="py-16 sm:py-32">
      <Skeleton className="h-3 w-16 mb-4" />
      <Skeleton className="h-8 w-40 sm:h-10" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="p-8 rounded-[2rem] bg-white border border-zinc-100">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <div className="mt-8 pt-6 border-t border-zinc-100">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Contact skeleton ── */
export function ContactSkeleton() {
  return (
    <section className="py-16 sm:py-32">
      <Skeleton className="h-3 w-16 mb-4" />
      <Skeleton className="h-8 w-36 sm:h-10" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />

      <div className="mx-auto mt-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:mt-12">
        <Skeleton className="h-12 w-full !rounded-xl" />
        <Skeleton className="h-12 w-full !rounded-xl" />
        <Skeleton className="h-12 w-full !rounded-xl" />
        <Skeleton className="h-12 w-full !rounded-xl" />
        <Skeleton className="md:col-span-2 h-32 w-full !rounded-xl" />
        <Skeleton className="h-12 w-40 !rounded-full" />
      </div>
    </section>
  );
}

/* ── Full page skeleton (all sections combined) ── */
/* Uses CSS animation-delay so skeleton only becomes visible after 400ms */
export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 skeleton-delay-wrapper">
      {/* Header skeleton */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Skeleton className="h-6 w-40" />
          <div className="hidden md:flex gap-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-0">
        <HeroSkeleton />
        <GallerySkeleton />
        <CategoriesSkeleton />
        <AboutSkeleton />
        <BrandsSkeleton />
        <ServicesSkeleton />
        <ReviewsSkeleton />
        <ContactSkeleton />
      </main>
    </div>
  );
}
