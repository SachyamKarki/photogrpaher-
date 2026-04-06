import { Skeleton } from "@/components/ui/Skeleton";

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header placeholder */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Skeleton className="h-6 w-40" />
          <div className="hidden md:flex gap-6">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-20">
        {/* Title */}
        <div className="mb-12">
          <Skeleton className="h-10 w-48 sm:h-12" />
          <Skeleton className="mt-4 h-4 w-96 max-w-full" />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-24 !rounded-full" />
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {Array.from({ length: 9 }).map((_, i) => {
            const heights = ["h-[280px]", "h-[360px]", "h-[240px]", "h-[320px]", "h-[400px]", "h-[260px]"];
            return (
              <Skeleton
                key={i}
                className={`mb-4 w-full !rounded-2xl ${heights[i % heights.length]}`}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
