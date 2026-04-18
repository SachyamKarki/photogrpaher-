import { NextResponse } from "next/server";
import { footerContent } from "@/lib/portfolio/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "";

  // Extract the number from the single source of truth (footerContent.whatsapp)
  // footerContent.whatsapp is "https://wa.me/9779803612055" — strip the prefix to get the raw number
  const number = footerContent.whatsapp.replace("https://wa.me/", "").replace(/[^0-9]/g, "");

  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return NextResponse.redirect(url, 302);
}
