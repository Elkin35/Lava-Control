import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const refPayco = searchParams.get("ref_payco");

  if (!refPayco) {
    return NextResponse.json({ valid: false });
  }

  const { rows } = await sql`
    SELECT * FROM fichas WHERE ref_payco = ${refPayco}
  `;

  const ficha = rows[0];

  if (!ficha) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true, ficha });
}
