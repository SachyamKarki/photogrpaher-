"use client";

import { useMemo, useState } from "react";

type Props = {
  categories: { title: string; slug: string }[];
};

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm({ categories }: Props) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const isValid = useMemo(() => {
    if (!name.trim()) return false;
    if (!email.trim()) return false;
    if (message.trim().length < 10) return false;
    return true;
  }, [name, email, message]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setState("submitting");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          category: category || undefined,
          message,
        }),
      });

      const json: unknown = await res.json().catch(() => null);
      const ok = Boolean(
        json &&
          typeof json === "object" &&
          "ok" in json &&
          (json as { ok?: unknown }).ok === true,
      );

      if (!res.ok || !ok) {
        setState("error");
        const message =
          json && typeof json === "object" && "error" in json
            ? String((json as { error?: unknown }).error ?? "")
            : "";
        setError(message || "Could not send your message. Please try again.");
        return;
      }

      setState("success");
      setName("");
      setEmail("");
      setCategory("");
      setMessage("");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold tracking-tight">Contact</h3>
        <p className="text-sm text-zinc-600">
          Tell me about your shoot—timeline, location, and the vibe you want.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-zinc-800">Name</span>
          <input
            className="h-11 rounded-xl border border-zinc-200 bg-white px-4 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Your name"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-zinc-800">Email</span>
          <input
            className="h-11 rounded-xl border border-zinc-200 bg-white px-4 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            type="email"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span className="font-medium text-zinc-800">Category (optional)</span>
          <select
            className="h-11 rounded-xl border border-zinc-200 bg-white px-4 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category…</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm sm:col-span-2">
          <span className="font-medium text-zinc-800">Message</span>
          <textarea
            className="min-h-[140px] resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="I’d love a couple’s shoot in late May…"
            required
          />
        </label>
      </div>

      {state === "success" ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Message sent. I’ll get back to you soon.
        </div>
      ) : null}

      {state === "error" && error ? (
        <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {error}
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-xs text-zinc-500">
          By submitting, you agree to be contacted about your request.
        </p>
        <button
          className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!isValid || state === "submitting"}
          type="submit"
        >
          {state === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
