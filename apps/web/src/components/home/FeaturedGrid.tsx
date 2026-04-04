import Image from "next/image";
import Link from "next/link";

type Tile = {
  key: string;
  title: string;
  subtitle?: string;
  href: string;
  image: string | null;
};

function TileCard({
  tile,
  className,
  priority,
}: {
  tile: Tile;
  className: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={tile.href}
      className={[
        "group relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-900",
        "shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        "motion-reduce:hover:translate-y-0 motion-reduce:transition-none",
        className,
      ].join(" ")}
    >
      <div className="absolute inset-0">
        {tile.image ? (
          <Image
            src={tile.image}
            alt={tile.title}
            fill
            priority={priority}
            className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
          Highlight
        </div>

        <div>
          <div className="text-white">
            <div className="text-base font-semibold tracking-tight sm:text-lg">
              {tile.title}
            </div>
            {tile.subtitle ? (
              <div className="mt-1 line-clamp-2 text-sm text-zinc-200/90">
                {tile.subtitle}
              </div>
            ) : null}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/90">
            View project
            <span className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedGrid({ tiles }: { tiles: Tile[] }) {
  const t = tiles.slice(0, 6);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:auto-rows-[180px]">
      <TileCard
        tile={t[0] ?? { key: "0", title: "Project", href: "/", image: null }}
        className="min-h-[320px] sm:col-span-7 sm:row-span-3 sm:min-h-0"
        priority
      />

      <TileCard
        tile={t[1] ?? { key: "1", title: "Project", href: "/", image: null }}
        className="min-h-[240px] sm:col-span-5 sm:row-span-2 sm:min-h-0"
      />
      <TileCard
        tile={t[2] ?? { key: "2", title: "Project", href: "/", image: null }}
        className="min-h-[220px] sm:col-span-5 sm:row-span-1 sm:min-h-0"
      />

      <TileCard
        tile={t[3] ?? { key: "3", title: "Project", href: "/", image: null }}
        className="min-h-[220px] sm:col-span-4 sm:row-span-1 sm:min-h-0"
      />
      <TileCard
        tile={t[4] ?? { key: "4", title: "Project", href: "/", image: null }}
        className="min-h-[220px] sm:col-span-4 sm:row-span-1 sm:min-h-0"
      />
      <TileCard
        tile={t[5] ?? { key: "5", title: "Project", href: "/", image: null }}
        className="min-h-[220px] sm:col-span-4 sm:row-span-1 sm:min-h-0"
      />
    </div>
  );
}

