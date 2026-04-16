"use client";

import { useMemo, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

type Props = {
  categories: { title: string; slug: string }[];
  whatsappNumber?: string;
};

type FormState = "idle" | "submitting" | "success" | "error";
type ContactMethod = "email" | "whatsapp";

const countryCodes = [
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
];

export function ContactForm({ categories, whatsappNumber = "9779800000000" }: Props) {
  const [state, setState] = useState<FormState>("idle");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+977");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (contactMethod === "email" && !email.trim()) return false;
    if (contactMethod === "whatsapp" && !phone.trim()) return false;
    if (message.trim().length < 10) return false;
    return true;
  }, [name, email, phone, message, contactMethod]);

  function openWhatsApp() {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
    const senderNumber = `${countryCode} ${phone.replace(/[^0-9]/g, "")}`;
    const lines = [
      `--- New Inquiry ---`,
      ``,
      `Name: ${name.trim()}`,
      `Phone: ${senderNumber}`,
      category ? `Category: ${category}` : "",
      ``,
      `Message:`,
      message.trim(),
      ``,
      `--- Sent from rabinson.com ---`,
    ].filter((line) => line !== false && line !== null && line !== undefined);

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, "_blank");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setState("submitting");

    // WhatsApp path: open WhatsApp directly
    if (contactMethod === "whatsapp") {
      try {
        openWhatsApp();
        toast.success("Opening WhatsApp — your message is ready!");
        setState("success");
        setName("");
        setEmail("");
        setPhone("");
        setCategory("");
        setMessage("");
      } catch {
        toast.error("Could not open WhatsApp. Please try again.");
        setState("error");
      }
      return;
    }

    // Email path: submit to API
    const promise = fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        category: category || undefined,
        message,
      }),
    }).then(async (res) => {
      const json: unknown = await res.json().catch(() => null);
      const ok = Boolean(
        json &&
          typeof json === "object" &&
          "ok" in json &&
          (json as { ok?: unknown }).ok === true,
      );

      if (!res.ok || !ok) {
        const errorMsg =
          json && typeof json === "object" && "error" in json
            ? String((json as { error?: unknown }).error ?? "")
            : "Could not send your message. Please try again.";
        throw new Error(errorMsg);
      }
      
      setState("success");
      setName("");
      setEmail("");
      setPhone("");
      setCategory("");
      setMessage("");
      return json;
    });

    toast.promise(promise, {
      loading: "Sending your inquiry...",
      success: "Message sent! We'll get back to you soon.",
      error: (err) => err instanceof Error ? err.message : "Failed to send message",
    });

    try {
      await promise;
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
        <div className="flex flex-col items-center justify-center py-6 sm:py-10 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="font-heading text-xl font-semibold tracking-tight text-zinc-900">
            Thank you for reaching out!
          </h3>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            We&apos;ve received your inquiry and will get back to you within 24–48 hours. Looking forward to working with you.
          </p>
          <button
            type="button"
            onClick={() => {
              setState("idle");
              setContactMethod("email");
            }}
            className="mt-8 inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Send another inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 md:p-10"
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-heading text-xl font-semibold tracking-tight">
          Send an inquiry
        </h3>
        <p className="text-sm text-zinc-600">
          Share the essentials and we&apos;ll reply with availability and next steps.
        </p>
      </div>

      {/* Contact Method — Segmented Control */}
      <div className="mt-8">
        <span className="mb-3 block text-sm font-medium text-zinc-800">
          How would you like to reach us?
        </span>
        <div className="relative inline-grid grid-cols-2 w-full sm:w-64 rounded-full border border-zinc-200 bg-zinc-100 p-1">
          {/* Sliding indicator */}
          <div
            className={[
              "absolute top-1 bottom-1 rounded-full shadow-sm transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
              contactMethod === "email"
                ? "left-1 right-[calc(50%+2px)] bg-zinc-900"
                : "left-[calc(50%+2px)] right-1 bg-emerald-600",
            ].join(" ")}
          />
          <button
            type="button"
            onClick={() => setContactMethod("email")}
            className={[
              "relative z-10 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors duration-300",
              contactMethod === "email"
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setContactMethod("whatsapp")}
            className={[
              "relative z-10 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors duration-300",
              contactMethod === "whatsapp"
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-zinc-800">Name</span>
          <input
            className="h-11 rounded-xl border border-zinc-200 bg-white px-4 outline-none transition focus:border-zinc-200 focus:ring-0"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </label>

        {contactMethod === "email" && (
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-zinc-800">Email</span>
            <input
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 outline-none transition focus:border-zinc-200 focus:ring-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              type="email"
              required
            />
          </label>
        )}

        {contactMethod === "whatsapp" && (
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-zinc-800">Your Phone Number</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                className="h-11 w-full sm:w-[130px] shrink-0 rounded-xl border border-zinc-200 bg-white px-2 text-sm outline-none transition focus:border-zinc-200 focus:ring-0"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} {c.country}
                  </option>
                ))}
              </select>
              <input
                className="h-11 flex-1 rounded-xl border border-zinc-200 bg-white px-4 outline-none transition focus:border-zinc-200 focus:ring-0"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="98XXXXXXXX"
                type="tel"
                required
              />
            </div>
          </label>
        )}

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-zinc-800">Category</span>
          <select
            className="h-11 rounded-xl border border-zinc-200 bg-white px-4 outline-none transition focus:border-zinc-200 focus:ring-0"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category…</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm lg:col-span-2">
          <span className="font-medium text-zinc-800">Message</span>
          <textarea
            className="min-h-[120px] resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none transition focus:border-zinc-200 focus:ring-0 sm:min-h-[160px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Date, location, and what you're looking for…"
            required
          />
        </label>
      </div>



      <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-xs text-zinc-500">
          By submitting, you agree to be contacted about your request.
        </p>
        <button
          className={[
            "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
            contactMethod === "whatsapp"
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-zinc-900 text-white hover:bg-zinc-800",
          ].join(" ")}
          disabled={!isValid || state === "submitting"}
          type="submit"
        >
          {contactMethod === "whatsapp" ? (
            <>
              <MessageCircle className="h-4 w-4" />
              {state === "submitting" ? "Opening…" : "Send via WhatsApp"}
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              {state === "submitting" ? "Sending…" : "Send inquiry"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

