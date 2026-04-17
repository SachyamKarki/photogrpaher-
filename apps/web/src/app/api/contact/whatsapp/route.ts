import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text") || "";
  
  // Hardcoded in server so client bundle never sees the target number
  // It is highly recommended to migrate this to an environment variable in production
  const number = process.env.CONTACT_WHATSAPP_NUMBER || "9779800000000";
  const cleanNumber = number.replace(/[^0-9]/g, "");

  const url = `https://wa.me/${cleanNumber}?text=${text}`;
  
  return NextResponse.redirect(url, 302);
}
