import { NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity/writeClient";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getStringField(
  record: Record<string, unknown>,
  field: string,
): string {
  const value = record[field];
  return typeof value === "string" ? value : "";
}

export async function POST(req: Request) {
  if (!sanityWriteClient) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Contact API not configured. Set SANITY_API_WRITE_TOKEN (and Sanity env vars) in .env.",
      },
      { status: 501 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;

  const name = getStringField(data, "name");
  const email = getStringField(data, "email");
  const message = getStringField(data, "message");
  const category = getStringField(data, "category");

  if (!name.trim() || name.trim().length > 120) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name." },
      { status: 400 },
    );
  }

  if (!email.trim() || !isValidEmail(email.trim()) || email.length > 200) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!message.trim() || message.trim().length < 10 || message.length > 4000) {
    return NextResponse.json(
      { ok: false, error: "Please enter a message (min 10 characters)." },
      { status: 400 },
    );
  }

  try {
    await sanityWriteClient.create({
      _type: "contactSubmission",
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      category: category.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: message || "Failed to submit." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
