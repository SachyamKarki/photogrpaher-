import type { Metadata } from "next";
import { footerContent } from "@/lib/portfolio/data";

export const metadata: Metadata = {
  title: "Privacy Policy | Rabin Son Photography",
  description: "Privacy Policy for Rabin Son Photography.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-zinc-600">
          Effective date: April 12, 2026
        </p>
      </header>

      <section className="space-y-3 text-sm leading-7 text-zinc-700 sm:text-[15px]">
        <p>
          This Privacy Policy explains how we collect, use, and protect your
          information when you visit this website or contact us for photography
          services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Information We Collect
        </h2>
        <ul className="space-y-2 text-sm leading-7 text-zinc-700 sm:text-[15px]">
          <li>Contact details you submit (name, email, phone number).</li>
          <li>Inquiry details (event date, location, preferences, budget notes).</li>
          <li>
            Basic technical data (device and browser information) used for
            security and performance.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          How We Use Information
        </h2>
        <ul className="space-y-2 text-sm leading-7 text-zinc-700 sm:text-[15px]">
          <li>To respond to inquiries and provide quotes and availability.</li>
          <li>To plan and deliver photography services you request.</li>
          <li>To improve site reliability, prevent abuse, and troubleshoot issues.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Sharing & Third Parties
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          We do not sell your personal information. We may share information
          with service providers only when necessary to operate the website or
          deliver services (for example: hosting, email delivery). These
          providers are expected to protect your data.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Data Retention
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          We keep inquiry information only as long as needed to respond, provide
          services, maintain records, or meet legal obligations.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Your Choices
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          You can request access, correction, or deletion of your information by
          contacting us.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
          Contact
        </h2>
        <p className="text-sm leading-7 text-zinc-700 sm:text-[15px]">
          For privacy questions, contact{" "}
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
