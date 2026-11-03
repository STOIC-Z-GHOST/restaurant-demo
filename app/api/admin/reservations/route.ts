import { db } from "@/db";
import { reservations } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import {
  maskEmail,
  maskName,
  maskPhone,
  purgeOldReservations,
} from "@/lib/reservation-privacy";

// Always run at request time — never prerender this at build, since it reads the database.
export const dynamic = "force-dynamic";

// Read-only on purpose: there's nothing to mutate here — no PATCH/DELETE,
// so there's nothing for a visitor to break.
//
// Masking happens HERE, on the server, so the real name/email/phone never
// leave the database in this response. Free-text notes are withheld entirely
// since people put anything in them.
export async function GET() {
  await purgeOldReservations().catch(() => {});

  const rows = await db
    .select()
    .from(reservations)
    .orderBy(asc(reservations.date));

  return NextResponse.json({
    reservations: rows.map((r) => ({
      id: r.id,
      name: maskName(r.name),
      email: maskEmail(r.email),
      phone: maskPhone(r.phone),
      partySize: r.partySize,
      date: r.date,
      hasNotes: Boolean(r.notes),
    })),
  });
}
