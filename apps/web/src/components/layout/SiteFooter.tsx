import Link from "next/link";

type Props = {
  siteTitle: string;
  email?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  locationLine?: string | null;
};

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export function SiteFooter({
  siteTitle,
  email,
  instagram,
  facebook,
  locationLine,
}: Props) {
  return (
    <footer className="relative z-0 mt-16 w-full overflow-hidden border-t border-white/10 bg-black pb-10 pt-20 text-zinc-100 sm:pb-12 sm:pt-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <div className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="flex flex-col space-y-6 lg:col-span-5">
            <div className="text-xl font-black uppercase tracking-[0.18em] text-white sm:text-2xl">
              {siteTitle}
            </div>

            <p className="max-w-md text-sm leading-7 text-zinc-400 sm:text-[15px]">
              A refined photography experience for weddings, portraits, and
              commercial stories—crafted with calm direction, timeless light,
              and honest detail.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/#contact"
                className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 text-sm font-medium text-white transition-all hover:border-white hover:bg-white hover:text-black"
              >
                Book a shoot
              </Link>
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 text-sm font-medium text-white transition-all hover:border-white hover:bg-white hover:text-black"
                >
                  Email us
                </a>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-5 pt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500 sm:text-xs">
              {instagram && isExternalUrl(instagram) ? (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Instagram
                </a>
              ) : null}
              {facebook && isExternalUrl(facebook) ? (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Facebook
                </a>
              ) : null}
              {locationLine ? <span>{locationLine}</span> : null}
            </div>
          </div>

          <div className="flex flex-col justify-start md:items-end lg:col-span-7">
            <div className="grid grid-cols-1 gap-x-12 gap-y-5 text-left sm:grid-cols-2 md:text-right">
              <Link
                href="/#work"
                className="block text-xs uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-white sm:text-sm"
              >
                Featured Work
              </Link>
              <Link
                href="/#categories"
                className="block text-xs uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-white sm:text-sm"
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="block text-xs uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-white sm:text-sm"
              >
                About
              </Link>
              <Link
                href="/#services"
                className="block text-xs uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-white sm:text-sm"
              >
                Services
              </Link>
              <Link
                href="/#contact"
                className="block text-xs uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-white sm:text-sm"
              >
                Contact
              </Link>
              <a
                href="#top"
                className="block text-xs uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-white sm:text-sm"
              >
                Back to Top
              </a>
            </div>
          </div>
        </div>

        <div className="pointer-events-none mb-5 mt-8 w-full select-none overflow-hidden leading-none opacity-25 mix-blend-overlay">
          <h1
            className="whitespace-nowrap text-center text-[7.2vw] font-black uppercase tracking-[0.08em] text-transparent"
            style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.8)" }}
          >
            {siteTitle.toUpperCase()}
          </h1>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 border-t border-white/5 py-6">
          <p className="text-center text-[11px] tracking-[0.08em] text-zinc-600 sm:text-xs">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
          <p className="font-heading text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:text-sm">
            {siteTitle}
          </p>
        </div>
      </div>
    </footer>
  );
}
