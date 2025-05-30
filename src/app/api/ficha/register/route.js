// app/api/ficha/register/route.js
import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req) {
  const { ref_payco } = await req.json();

  if (!ref_payco) {
    return NextResponse.json({ success: false, message: "Missing ref_payco" });
  }

  try {
    await sql`
      INSERT INTO fichas (ref_payco)
      VALUES (${ref_payco})
      ON CONFLICT (ref_payco) DO NOTHING
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting ficha:", error);
    return NextResponse.json({ success: false, message: "Error inserting ficha" });
  }
}
