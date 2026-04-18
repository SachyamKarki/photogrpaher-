"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Mail, MessageCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type Props = {
  categories: { title: string; slug: string }[];
  whatsappNumber?: string;
};

type FormState = "idle" | "submitting" | "success" | "error";
type ContactMethod = "email" | "whatsapp";

const countryCodes = [
  // South Asia
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  // North America
  { code: "+1", country: "USA/Canada", flag: "🇺🇸/🇨🇦" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  // Europe
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  // Oceania
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  // East & SE Asia
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  // Middle East
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  // South America
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  // Africa
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  // Other
  { code: "+7", country: "Russia/Kazakhstan", flag: "🇷🇺/🇰🇿" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
];

export function ContactForm({ categories }: Props) {
  const [state, setState] = useState<FormState>("idle");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+977");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [isCategoryOpen, setCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot field for security

  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (contactMethod === "email" && !email.trim()) return false;
    if (contactMethod === "whatsapp" && !phone.trim()) return false;
    if (message.trim().length < 10) return false;
    return true;
  }, [name, email, phone, message, contactMethod]);

  function openWhatsApp() {
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
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`/api/contact/whatsapp?text=${text}`, "_blank");
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
        setWebsite("");
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
        website, // Pass honeypot for verification
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
      setWebsite("");
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

      {/* Security Layer: Honeypot (Visually Hidden) */}
      <div className="absolute opacity-0 pointer-events-none -z-10 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
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
            <div className="flex flex-row gap-2">
              <select
                className="h-11 w-[110px] sm:w-[130px] shrink-0 rounded-xl border border-zinc-200 bg-white px-2 text-sm outline-none transition focus:border-zinc-200 focus:ring-0"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                className="h-11 flex-1 min-w-0 rounded-xl border border-zinc-200 bg-white px-4 outline-none transition focus:border-zinc-200 focus:ring-0"
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

        <div className="flex flex-col gap-2 text-sm lg:col-span-2">
          <span className="font-medium text-zinc-800">Category</span>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCategoryOpen(!isCategoryOpen)}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-zinc-300 focus:ring-0 text-left"
            >
              <span className={category ? "text-zinc-900 truncate" : "text-zinc-500 truncate"}>
                {category || "Select a category…"}
              </span>
              <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
            </button>
            <input type="hidden" name="category" value={category} />
            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-2 w-full rounded-xl border border-zinc-100 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.1)] z-50 overflow-hidden text-sm">
                {categories.map((c, i) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => { setCategory(c.title); setCategoryOpen(false); }}
                    className={`w-full text-left px-4 py-3 hover:bg-zinc-50 text-zinc-900 transition-colors ${i > 0 ? "border-t border-zinc-50" : ""}`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

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

