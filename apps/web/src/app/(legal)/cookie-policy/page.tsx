import type { Metadata } from "next";
import { footerContent } from "@/lib/portfolio/data";

export const metadata: Metadata = {
  title: "Cookie Policy | Rabin Son Photography",
  description: "Cookie Policy for Rabin Son Photography.",
};

export default function CookiePolicyPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Cookie Policy
        </h1>
        <p className="text-sm text-zinc-600">
          Effective date: April 12, 2026
        </p>
      </header>

      <section className="space-y-3 text-sm leading-7 text-zinc-700 sm:text-[15px]">
        <p>
          Cookies are small files stored on your device. This site may use
          cookies and similar technologies to improve performance and provide a
          smoother browsing experience.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Types of Cookies
        </h2>
        <ul className="space-y-2 text-sm leading-7 text-zinc-700 sm:text-[15px]">
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
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Managing Cookies
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          You can control cookies through your browser settings. Disabling
          certain cookies may affect site functionality.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Contact
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          For questions about cookies, contact{" "}
          <a
            className="underline underline-offset-4 hover:text-zinc-900"
            href={`mailto:${footerContent.email}`}
          >
            {footerContent.email}
          </a>
          .
        </p>
      </section>
    </article>
  );
}
