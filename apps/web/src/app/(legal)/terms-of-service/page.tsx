import type { Metadata } from "next";
import { footerContent } from "@/lib/portfolio/data";

export const metadata: Metadata = {
  title: "Terms of Service | Rabin Son Photography",
  description: "Terms of Service for Rabin Son Photography.",
};

export default function TermsOfServicePage() {
  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-sm text-zinc-600">
          Effective date: April 12, 2026
        </p>
      </header>

      <section className="space-y-3 text-sm leading-7 text-zinc-700 sm:text-[15px]">
        <p>
          These Terms govern your use of this website and any inquiries you send
          through it. By using the site, you agree to these Terms.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Use of the Website
        </h2>
        <ul className="space-y-2 text-sm leading-7 text-zinc-700 sm:text-[15px]">
          <li>Use the site for lawful purposes only.</li>
          <li>Do not attempt to disrupt, scrape, or misuse the site.</li>
          <li>We may update or discontinue features at any time.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Intellectual Property
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          Photos, text, and design on this site are protected. You may not copy,
          reproduce, or redistribute content without permission.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Booking & Deliverables
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          Inquiries submitted through the site are not a confirmed booking.
          Final pricing, dates, deliverables, and usage rights are confirmed via
          a written agreement.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Third-Party Links
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          The site may link to third-party services (for example social
          platforms). We are not responsible for their content or policies.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Disclaimer
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          The website is provided “as is” without warranties of any kind to the
          fullest extent permitted by law.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Contact
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          For questions about these Terms, contact{" "}
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
