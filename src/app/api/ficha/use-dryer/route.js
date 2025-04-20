import { NextResponse } from "next/server";
import db from "../../../../lib/db.ts";

export async function POST(req) {
  const { ref_payco } = await req.json();

  if (!ref_payco) {
    return NextResponse.json({ success: false, message: "Missing ref_payco" });
  }

  const ficha = db.prepare("SELECT * FROM fichas WHERE ref_payco = ?").get(ref_payco);

  if (!ficha || ficha.used === 1 || ficha.used_dryer) {
    return NextResponse.json({ success: false, message: "Ficha inválida o secadora ya usada" });
  }

  db.prepare("UPDATE fichas SET used_dryer = CURRENT_TIMESTAMP WHERE ref_payco = ?").run(ref_payco);

  const updatedFicha = db.prepare("SELECT * FROM fichas WHERE ref_payco = ?").get(ref_payco);

  if (updatedFicha.used_washer && updatedFicha.used_dryer) {
    db.prepare("UPDATE fichas SET used = 1 WHERE ref_payco = ?").run(ref_payco);
  }

  return NextResponse.json({ success: true });
}
