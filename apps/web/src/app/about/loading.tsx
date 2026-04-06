import { Skeleton } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
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

      <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        {/* Hero image */}
        <Skeleton className="h-[400px] w-full !rounded-[2rem] sm:h-[500px]" />

        {/* Title + Bio */}
        <div className="mt-12 text-center">
          <Skeleton className="mx-auto h-10 w-72 sm:h-12" />
          <Skeleton className="mx-auto mt-6 h-4 w-full max-w-xl" />
          <Skeleton className="mx-auto mt-2 h-4 w-5/6 max-w-xl" />
          <Skeleton className="mx-auto mt-2 h-4 w-4/6 max-w-xl" />
          <Skeleton className="mx-auto mt-2 h-4 w-3/5 max-w-xl" />
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="mx-auto h-10 w-16" />
              <Skeleton className="mx-auto mt-2 h-3 w-20" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
