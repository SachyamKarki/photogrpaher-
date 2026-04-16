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

export function ContactForm({ categories, whatsappNumber = "9779800000000" }: Props) {
  const [state, setState] = useState<FormState>("idle");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("email");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (contactMethod === "email" && !email.trim()) return false;
    if (message.trim().length < 10) return false;
    return true;
  }, [name, email, message, contactMethod]);

  function openWhatsApp() {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
    const lines = [
      `Hi, I'm *${name.trim()}*.`,
      category ? `I'm interested in: *${category}*` : "",
      "",
      message.trim(),
    ].filter(Boolean);

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
        <div className="relative inline-grid grid-cols-2 w-64 rounded-full border border-zinc-200 bg-zinc-100 p-1">
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
        {contactMethod === "whatsapp" && (
          <p className="mt-3 text-xs font-medium text-emerald-600 animate-in fade-in slide-in-from-top-1">
            Direct to Nepal (+977) — {whatsappNumber.slice(-10).replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
          </p>
        )}
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
