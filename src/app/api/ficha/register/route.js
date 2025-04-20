import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db.ts";

export async function POST(req) {
  const { ref_payco } = await req.json();

  if (!ref_payco) {
    return NextResponse.json({ success: false, message: "Missing ref_payco" });
  }

  try {
    db.prepare("INSERT INTO fichas (ref_payco) VALUES (?)").run(ref_payco);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting ficha:", error);
    return NextResponse.json({ success: false, message: "Error inserting ficha" });
  }
}