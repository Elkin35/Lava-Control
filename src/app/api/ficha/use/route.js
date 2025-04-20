import { NextRequest, NextResponse } from "next/server";
import db from "../../../../lib/db.ts";

export async function POST(req) {
  const { ref_payco } = await req.json();

  if (!ref_payco) {
    return NextResponse.json({ error: "Missing ref_payco" }, { status: 400 });
  }

  try {
    db.prepare("UPDATE fichas SET usada = 1 WHERE ref_payco = ?").run(ref_payco);
    return NextResponse.json({ message: "Ficha marcada como usada" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error marcando ficha como usada" }, { status: 500 });
  }
}
