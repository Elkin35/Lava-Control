import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req) {
  const { ref_payco } = await req.json();

  if (!ref_payco) {
    return NextResponse.json({ success: false, message: "Missing ref_payco" });
  }

  const { rows } = await sql`
    SELECT * FROM fichas WHERE ref_payco = ${ref_payco}
  `;

  const ficha = rows[0];

  if (!ficha || ficha.used || ficha.used_dryer) {
    return NextResponse.json({ success: false, message: "Ficha inválida o secadora ya usada" });
  }

  await sql`
    UPDATE fichas SET used_dryer = CURRENT_TIMESTAMP WHERE ref_payco = ${ref_payco}
  `;

  const { rows: updatedRows } = await sql`
    SELECT * FROM fichas WHERE ref_payco = ${ref_payco}
  `;

  const updatedFicha = updatedRows[0];

  if (updatedFicha.used_washer && updatedFicha.used_dryer) {
    await sql`
      UPDATE fichas SET used = true WHERE ref_payco = ${ref_payco}
    `;
  }

  return NextResponse.json({ success: true });
}
