import type { Metadata } from "next";
import { footerContent } from "@/lib/portfolio/data";

export const metadata: Metadata = {
  title: "Terms of Service | Rabin Son Photography",
  description: "Terms of Service for Rabin Son Photography.",
};

export default function TermsOfServicePage() {
  return (
    <article className="space-y-16">
      <header className="space-y-4">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Terms of Service
        </h1>
        <p className="text-xs uppercase tracking-widest text-white/40">
          Effective date: April 12, 2026
        </p>
      </header>

      <section className="space-y-6 text-base leading-8 text-white/70">
        <p>
          These Terms govern your use of this website and any inquiries you send
          through it. By using the site, you agree to these Terms.
        </p>
      </section>

      <div className="space-y-12">
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">
            Use of the Website
          </h2>
          <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-white/60">
            <li>Use the site for lawful purposes only.</li>
            <li>Do not attempt to disrupt, scrape, or misuse the site.</li>
            <li>We may update or discontinue features at any time.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">
            Intellectual Property
          </h2>
          <p className="text-sm leading-7 text-white/60">
            Photos, text, and design on this site are protected. You may not copy,
            reproduce, or redistribute content without permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">
            Booking & Deliverables
          </h2>
          <p className="text-sm leading-7 text-white/60">
            Inquiries submitted through the site are not a confirmed booking.
            Final pricing, dates, deliverables, and usage rights are confirmed via
            a written agreement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">
            Third-Party Links
          </h2>
          <p className="text-sm leading-7 text-white/60">
            The site may link to third-party services (for example social
            platforms). We are not responsible for their content or policies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">
            Disclaimer
          </h2>
          <p className="text-sm leading-7 text-white/60">
            The website is provided “as is” without warranties of any kind to the
            fullest extent permitted by law.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-12">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-white">
            Contact
          </h2>
          <p className="text-sm leading-7 text-white/60">
            For questions about these Terms, contact{" "}
            <a
              className="text-white underline underline-offset-4 transition-colors hover:text-white/80"
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
