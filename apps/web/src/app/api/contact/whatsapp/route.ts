import { NextResponse } from "next/server";
import { getRequiredSiteSettings } from "@/lib/sanity/siteSettings";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "";
  const settings = await getRequiredSiteSettings();

  if (!settings.whatsapp) {
    return NextResponse.json({ error: "WhatsApp link is not configured" }, { status: 500 });
  }

  const number = settings.whatsapp.replace("https://wa.me/", "").replace(/[^0-9]/g, "");

  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return NextResponse.redirect(url, 302);
}
