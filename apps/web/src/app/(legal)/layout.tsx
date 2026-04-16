import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 bg-black text-white/80">
      <section className="px-4 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-24 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-3xl">
          {children}

          <div className="mt-24 flex justify-center sm:mt-40">
            <Link
              href="/"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:border-white/20 hover:bg-white/10 md:h-12 md:px-8"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:-translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M12 19l-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              BACK TO HOME
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
