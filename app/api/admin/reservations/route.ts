import { db } from "@/db";
import { reservations } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

// Always run at request time — never prerender this at build, since it reads the database.
export const dynamic = "force-dynamic";

// Read-only on purpose: reservations are real data (the capacity check
// depends on real counts), but there's nothing to mutate here — no
// PATCH/DELETE, so there's nothing for a visitor to break.
export async function GET() {
  const rows = await db.select().from(reservations).orderBy(asc(reservations.date));
  return NextResponse.json({ reservations: rows });
}
