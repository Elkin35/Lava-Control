import { NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const refPayco = searchParams.get("ref_payco");

  if (!refPayco) {
    return NextResponse.json({ success: false });
  }

  const ficha = db.prepare("SELECT * FROM fichas WHERE ref_payco = ?").get(refPayco);

  if (!ficha) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({ success: true, ficha });
}
