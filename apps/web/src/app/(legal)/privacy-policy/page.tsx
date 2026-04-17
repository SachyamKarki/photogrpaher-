import type { Metadata } from "next";
import { footerContent } from "@/lib/portfolio/data";

export const metadata: Metadata = {
  title: "Privacy Policy | Rabin Son Photography",
  description: "Privacy Policy for Rabin Son Photography.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="space-y-16">
      <header className="space-y-4">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-xs uppercase tracking-widest text-white/40">
          Effective date: April 12, 2026
        </p>
      </header>

      <section className="space-y-6 text-base leading-8 text-white/70">
        <p>
          This Privacy Policy explains how we collect, use, and protect your
          information when you visit this website or contact us for photography
          services.
        </p>
      </section>

      <div className="space-y-12">
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">
            Information We Collect
          </h2>
          <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-white/60">
            <li>Contact details you submit (name, email, phone number).</li>
            <li>Inquiry details (event date, location, preferences, budget notes).</li>
            <li>
              Basic technical data (device and browser information) used for
              security and performance.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">
            How We Use Information
          </h2>
          <ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-white/60">
            <li>To respond to inquiries and provide quotes and availability.</li>
            <li>To plan and deliver photography services you request.</li>
            <li>To improve site reliability, prevent abuse, and troubleshoot issues.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">
            Sharing & Third Parties
          </h2>
          <p className="text-sm leading-7 text-white/60">
            We do not sell your personal information. We may share information
            with service providers only when necessary to operate the website or
            deliver services (for example: hosting, email delivery). These
            providers are expected to protect your data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">
            Data Retention
          </h2>
          <p className="text-sm leading-7 text-white/60">
            We keep inquiry information only as long as needed to respond, provide
            services, maintain records, or meet legal obligations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">
            Your Choices
          </h2>
          <p className="text-sm leading-7 text-white/60">
            You can request access, correction, or deletion of your information by
            contacting us.
          </p>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-12">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-white">
            Contact
          </h2>
          <p className="text-sm leading-7 text-white/60">
            For privacy questions, contact{" "}
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
