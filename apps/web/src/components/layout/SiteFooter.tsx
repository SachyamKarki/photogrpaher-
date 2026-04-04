import Link from "next/link";

import { LogoMark } from "@/components/brand/LogoMark";

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
    <footer className="mt-16 border-t border-white/10 bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xl font-semibold tracking-tight">
              Ready to create something timeless?
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              Share your date, location, and vision—I&apos;ll reply with
              availability.
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            >
              Book a shoot
            </Link>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/0 px-6 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
              >
                Email
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-semibold text-zinc-950">
                <LogoMark className="h-5 w-5 text-zinc-950" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold tracking-tight">{siteTitle}</div>
                <div className="text-sm text-zinc-400">Photography</div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-zinc-300">
              Premium photography for weddings, portraits, and commercial
              projects—crafted with intention, light, and story.
            </p>
            {locationLine ? (
              <p className="mt-3 text-sm text-zinc-400">{locationLine}</p>
            ) : null}
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Explore</div>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-zinc-300">
              <li>
                <Link className="hover:text-white" href="/#work">
                  Work
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/#categories">
                  Categories
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/#services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/#contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/studio">
                  Studio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Contact</div>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-zinc-300">
              {email ? (
                <li>
                  <a className="hover:text-white" href={`mailto:${email}`}>
                    {email}
                  </a>
                </li>
              ) : null}

              {instagram && isExternalUrl(instagram) ? (
                <li>
                  <a
                    className="hover:text-white"
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              ) : null}

              {facebook && isExternalUrl(facebook) ? (
                <li>
                  <a
                    className="hover:text-white"
                    href={facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteTitle}. All rights reserved.</p>
          <div className="flex flex-col gap-2 text-zinc-500 sm:flex-row sm:items-center sm:gap-6">
            <a className="hover:text-zinc-300" href="#top">
              Back to top
            </a>
            <p>Built with Next.js, Tailwind CSS, and Sanity.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
