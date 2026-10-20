import { db } from "@/db";
import { reservations } from "@/db/schema";
import { NextResponse } from "next/server";
import { and, gte, lt } from "drizzle-orm";
import { getSlotWindow, MAX_SEATS_PER_SLOT } from "@/lib/reservation-config";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a bit and try again." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { name, email, phone, partySize, date, notes, _hp } = body;

  // Honeypot: a hidden field real visitors never fill in. Bots that
  // autofill every input do -- pretend to succeed so they don't adapt.
  if (_hp) {
    return NextResponse.json({ reservation: { id: 0 } }, { status: 201 });
  }

  if (!name || !email || !partySize || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const size = Number(partySize);
  if (!Number.isFinite(size) || size < 1) {
    return NextResponse.json({ error: "Invalid party size" }, { status: 400 });
  }

  const { start, end } = getSlotWindow(parsedDate);
  const existing = await db
    .select({ partySize: reservations.partySize })
    .from(reservations)
    .where(and(gte(reservations.date, start), lt(reservations.date, end)));

  const bookedSeats = existing.reduce((sum, r) => sum + r.partySize, 0);
  if (bookedSeats + size > MAX_SEATS_PER_SLOT) {
    return NextResponse.json(
      { error: "That time is fully booked -- please choose a different time." },
      { status: 409 }
    );
  }

  const [reservation] = await db
    .insert(reservations)
    .values({
      name,
      email,
      phone: phone || null,
      partySize: size,
      date: parsedDate,
      notes: notes || null,
    })
    .returning();

  // No notification wiring for this demo -- just persists.
  // A real build would fire an email/SMS confirmation here (same pattern
  // as EcoFurnish's Resend-based order status emails).

  return NextResponse.json({ reservation }, { status: 201 });
}
