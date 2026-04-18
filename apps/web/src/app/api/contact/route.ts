import { NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity/writeClient";
import { sendContactEmail, sendClientConfirmation } from "@/lib/email/nodemailer";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return '';
  // Strips generic HTML symbols preventing aggressive embedded attacks
  return str.replace(/[<>]/g, '').trim(); 
}

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 3;

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip.trim();
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

  // Deep Security Layer: DDOS & Spam Preventative Rate Limiting
  const ip = getClientIp(req);
  const now = Date.now();
  const rl = rateLimitMap.get(ip) ?? { count: 0, lastReset: now };

  if (now - rl.lastReset > RATE_LIMIT_WINDOW_MS) {
    rl.count = 0;
    rl.lastReset = now;
  }

  if (rl.count >= MAX_REQUESTS && ip !== "unknown" && ip !== "::1" && ip !== "127.0.0.1") {
    return NextResponse.json(
      { ok: false, error: "Rate limit exceeded. Please try again later." }, 
      { status: 429 }
    );
  }
  
  rl.count++;
  rateLimitMap.set(ip, rl);

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

  // Deep Security Layer: Sanitized Data
  const name = sanitizeInput(getStringField(data, "name"));
  const email = sanitizeInput(getStringField(data, "email"));
  const message = sanitizeInput(getStringField(data, "message"));
  const category = sanitizeInput(getStringField(data, "category"));
  const website = getStringField(data, "website");

  // Deep Security Layer: Honeypot Trap
  // If a bot fills out the hidden "website" field, we silently drop the request.
  if (website && website.length > 0) {
    console.warn(`[Security] Honeypot triggered by IP: ${ip}`);
    return NextResponse.json({ ok: true }); // Silent success
  }

  if (!name || name.length > 120) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name." },
      { status: 400 },
    );
  }

  if (!email || !isValidEmail(email) || email.length > 200) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!message || message.length < 10 || message.length > 4000) {
    return NextResponse.json(
      { ok: false, error: "Please enter a message (min 10 characters)." },
      { status: 400 },
    );
  }

  try {
    await sanityWriteClient.create({
      _type: "contactSubmission",
      name: name,
      email: email,
      message: message,
      category: category || undefined,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: message || "Failed to submit." },
      { status: 500 },
    );
  }

  // Send email notifications (blocking for reliability in serverless environments)
  try {
    const [adminResult, clientResult] = await Promise.all([
      sendContactEmail({
        name,
        email,
        category: category || undefined,
        message,
      }),
      sendClientConfirmation({
        name,
        email,
        message,
      })
    ]);

    console.log("[Contact API] Admin notification:", adminResult.success ? "✅ Sent" : `❌ Failed: ${adminResult.error}`);
    console.log("[Contact API] Client confirmation:", clientResult.success ? "✅ Sent" : `❌ Failed: ${clientResult.error}`);

    if (!adminResult.success) {
      return NextResponse.json(
        {
          ok: false,
          saved: true,
          error:
            "Your inquiry was saved, but the notification email could not be delivered. Please try WhatsApp if you need an immediate response.",
        },
        { status: 502 },
      );
    }

  } catch (err) {
    console.error("[Contact API] Critical email notification failure:", err);
    return NextResponse.json(
      {
        ok: false,
        saved: true,
        error:
          "Your inquiry was saved, but the mail service failed while sending notifications. Please try WhatsApp if you need an immediate response.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
