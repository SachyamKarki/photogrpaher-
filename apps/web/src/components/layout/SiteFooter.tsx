import Link from "next/link";

type Props = {
  siteTitle: string;
  email?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
  locationLine?: string | null;
};

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9A4.5 4.5 0 0 1 16.5 21h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M17.4 6.9h.01"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        d="M13.5 21v-7.3h2.45l.37-2.85H13.5V9.03c0-.83.23-1.4 1.42-1.4h1.52V5.07c-.26-.04-1.16-.11-2.21-.11-2.19 0-3.69 1.34-3.69 3.8v2.12H8.06v2.85h2.48V21h2.96Z"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M12 21a9 9 0 0 1-4.2-1.04L3 21l1.1-4.2A9 9 0 1 1 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.05 8.9c.2-.49.4-.5.74-.5h.6c.17 0 .39.06.6.47.2.41.7 1.7.76 1.82.06.12.1.27.02.43-.08.16-.12.27-.25.41-.12.14-.26.32-.37.43-.12.12-.24.24-.1.47.14.23.64 1.04 1.38 1.68.95.83 1.75 1.09 1.98 1.21.23.12.36.1.49-.06.14-.16.56-.65.71-.87.14-.22.29-.18.49-.1.2.08 1.28.6 1.5.71.22.1.37.16.43.25.06.08.06.49-.12.96-.18.47-1.02.92-1.42.97-.39.05-.88.07-1.42-.1-.33-.1-.76-.25-1.3-.49-2.29-1-3.78-3.33-3.9-3.49-.12-.16-.93-1.23-.93-2.35s.58-1.67.79-1.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SiteFooter({
  siteTitle,
  email,
  instagram,
  facebook,
  whatsapp,
}: Props) {
  return (
    <footer className="relative z-0 mt-20 w-full overflow-hidden border-t border-white/10 bg-black pb-12 pt-16 text-white/90 uppercase font-semibold">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="pointer-events-none mb-10 w-full select-none text-center">
          <h2
            className="font-calligraphy normal-case whitespace-nowrap py-2 text-[clamp(2.5rem,8.5vw,11rem)] font-normal tracking-wide text-white"
          >
            {siteTitle}
          </h2>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Brand Info & Actions */}
          <div className="flex flex-col gap-12 md:col-span-7 lg:col-span-8">
            <p className="max-w-md text-[13px] normal-case leading-[1.8] text-white/50 tracking-wide">
              A refined photography experience for weddings, portraits, and
              commercial stories. Crafted with calm direction, timeless light,
              and honest detail.
            </p>

            <div className="flex flex-col gap-10">
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#contact"
                  className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-[11px] font-bold text-white transition-all hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15"
                >
                  BOOK A SHOOT
                </Link>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-[11px] font-bold text-white transition-all hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/15"
                  >
                    EMAIL US
                  </a>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-5">
                {facebook && isExternalUrl(facebook) ? (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white hover:bg-white hover:text-black"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                ) : null}
                {instagram && isExternalUrl(instagram) ? (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white hover:bg-white hover:text-black"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                ) : null}
                {whatsapp && isExternalUrl(whatsapp) ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-all hover:border-white hover:bg-white hover:text-black"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right Column: Navigation & Back to Top */}
          <div className="flex flex-col gap-16 md:col-span-5 md:items-end lg:col-span-4">
            <nav aria-label="Footer">
              <ul className="grid grid-cols-2 gap-x-12 gap-y-6 text-left md:gap-x-16 md:text-right">
                <li>
                  <a
                    href="/#work"
                    className="font-heading block text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-white"
                  >
                    Featured Work
                  </a>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="font-heading block text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-white"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <a
                    href="/#categories"
                    className="font-heading block text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-white"
                  >
                    Categories
                  </a>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="font-heading block text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a
                    href="/#services"
                    className="font-heading block text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-white"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="/#contact"
                    className="font-heading block text-[11px] font-bold uppercase tracking-[0.25em] text-white/90 transition-colors hover:text-white"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>

            <a
              href="#top"
              aria-label="Back to top"
              className="group inline-flex items-center justify-center transition-opacity hover:opacity-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 transition-all group-hover:border-white group-hover:bg-white group-hover:text-black">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform group-hover:-translate-y-0.5"
                >
                  <path
                    d="M1 6L6 1L11 6M6 1V11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-20 border-t border-white/5 pt-10 pb-6 text-center">
          <p className="text-[10px] tracking-[0.15em] text-white/70 uppercase font-bold">
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
