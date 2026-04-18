import type { Metadata } from "next";
import { footerContent } from "@/lib/portfolio/data";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Learn about how cookies and similar technologies are used on the RabinSon Photography website.",
  robots: { index: true, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <article className="space-y-10 sm:space-y-16">
      <header className="space-y-4">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
          Cookie Policy
        </h1>
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          Effective date: April 12, 2026
        </p>
      </header>

      <section className="space-y-6 text-base leading-8 text-zinc-600">
        <p>
          Cookies are small files stored on your device. This site may use
          cookies and similar technologies to improve performance and provide a
          smoother browsing experience.
        </p>
      </section>

      <div className="space-y-12">
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-zinc-900">
            Types of Cookies
          </h2>
          <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-zinc-500">
            <li>
              Essential: required for basic site functionality and security.
            </li>
            <li>
              Preferences: remember choices that improve your experience.
            </li>
            <li>
              Analytics (optional): helps understand traffic and improve content.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-zinc-900">
            Managing Cookies
          </h2>
          <p className="text-sm leading-7 text-zinc-500">
            You can control cookies through your browser settings. Disabling
            certain cookies may affect site functionality.
          </p>
        </section>

        <section className="space-y-4 border-t border-zinc-200 pt-12">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900">
            Contact
          </h2>
          <p className="text-sm leading-7 text-zinc-500">
            For questions about cookies, contact{" "}
            <a
              className="text-zinc-900 underline underline-offset-4 transition-colors hover:text-zinc-600"
              href={`mailto:${footerContent.email}`}
            >
              {footerContent.email}
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
