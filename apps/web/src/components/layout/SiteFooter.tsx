import Image from "next/image";
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
    <footer className="relative z-0 mt-16 w-full overflow-hidden border-t border-white/10 bg-black pb-12 pt-24 text-zinc-100">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-20">
        <div className="mb-24 grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
          <div className="flex flex-col space-y-8 lg:col-span-5">
            <Image
              src="/brand/rabinson-photographs-light.svg"
              alt={siteTitle}
              width={304}
              height={67}
              className="h-10 w-auto"
            />

            <p className="max-w-md text-base font-light leading-relaxed text-zinc-400">
              A refined photography experience for weddings, portraits, and
              commercial stories—crafted with calm direction, timeless light,
              and honest detail.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/#contact"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white hover:bg-white hover:text-black"
              >
                Book a shoot
              </Link>
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white hover:bg-white hover:text-black"
                >
                  Email us
                </a>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-6 pt-6 text-sm uppercase tracking-[0.18em] text-zinc-500">
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
            <div className="grid grid-cols-2 gap-x-16 gap-y-6 text-left md:text-right">
              <Link
                href="/#work"
                className="block text-sm uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
              >
                Featured Work
              </Link>
              <Link
                href="/#categories"
                className="block text-sm uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="block text-sm uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
              >
                About
              </Link>
              <Link
                href="/#services"
                className="block text-sm uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
              >
                Services
              </Link>
              <Link
                href="/#contact"
                className="block text-sm uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
              >
                Contact
              </Link>
              <Link
                href="/studio"
                className="block text-sm uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
              >
                Studio
              </Link>
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="block text-sm uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
                >
                  Email
                </a>
              ) : null}
              <a
                href="#top"
                className="block text-sm uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
              >
                Back to Top
              </a>
            </div>
          </div>
        </div>

        <div className="pointer-events-none mb-8 mt-12 w-full select-none overflow-hidden leading-none opacity-30 mix-blend-overlay">
          <h1
            className="whitespace-nowrap text-center text-[8.5vw] font-bold text-transparent"
            style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.8)" }}
          >
            RABINSON PHOTOGRAPHS
          </h1>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-white/5 py-8">
          <div className="flex gap-8">
            <Link
              href="/about"
              className="text-xs uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-white"
            >
              About
            </Link>
            <Link
              href="/#services"
              className="text-xs uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-white"
            >
              Services
            </Link>
            <Link
              href="/#contact"
              className="text-xs uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>
          <p className="text-center text-xs tracking-wide text-zinc-600">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
