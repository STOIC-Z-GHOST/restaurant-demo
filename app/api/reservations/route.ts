import { db } from "@/db";
import { reservations } from "@/db/schema";
import { NextResponse } from "next/server";
import { and, eq, gte, lt } from "drizzle-orm";
import {
  getSlotWindow,
  MAX_BOOKING_DAYS_AHEAD,
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  MAX_NOTES_LENGTH,
  MAX_PARTY_SIZE,
  MAX_PHONE_LENGTH,
  MAX_SEATS_PER_SLOT,
} from "@/lib/reservation-config";
import { purgeOldReservations } from "@/lib/reservation-privacy";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

// Deliberately simple: one @, no spaces, a dot in the domain. Real
// verification is "did the confirmation email arrive", not a regex.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

function asTrimmedString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

async function bookedSeatsInSlot(start: Date, end: Date): Promise<number> {
  const rows = await db
    .select({ partySize: reservations.partySize })
    .from(reservations)
    .where(and(gte(reservations.date, start), lt(reservations.date, end)));
  return rows.reduce((sum, r) => sum + r.partySize, 0);
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return bad("Too many requests — please wait a bit and try again.", 429);
  }

  // Malformed JSON used to throw -> 500. Now it's a clean 400.
  let body: Record<string, unknown>;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return bad("Invalid request body");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return bad("Invalid request body");
  }

  // Honeypot: a hidden field real visitors never fill in. Bots that
  // autofill every input do -- pretend to succeed so they don't adapt.
  if (body._hp) {
    return NextResponse.json({ reservation: { id: 0 } }, { status: 201 });
  }

  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const phone = asTrimmedString(body.phone);
  const notes = asTrimmedString(body.notes);

  if (!name || !email || body.partySize == null || !body.date) {
    return bad("Missing required fields");
  }
  if (name.length > MAX_NAME_LENGTH) {
    return bad(`Name must be ${MAX_NAME_LENGTH} characters or fewer`);
  }
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
    return bad("Please enter a valid email address");
  }
  if (phone.length > MAX_PHONE_LENGTH) {
    return bad(`Phone must be ${MAX_PHONE_LENGTH} characters or fewer`);
  }
  if (notes.length > MAX_NOTES_LENGTH) {
    return bad(`Notes must be ${MAX_NOTES_LENGTH} characters or fewer`);
  }

  // 2.5, "abc", NaN, Infinity, 0 and negatives all land here instead of
  // reaching Postgres (where 2.5 into an integer column was a 500).
  const size = Number(body.partySize);
  if (!Number.isInteger(size) || size < 1 || size > MAX_PARTY_SIZE) {
    return bad(`Party size must be a whole number from 1 to ${MAX_PARTY_SIZE}`);
  }

  const parsedDate = new Date(String(body.date));
  if (Number.isNaN(parsedDate.getTime())) {
    return bad("Invalid date");
  }
  const now = Date.now();
  if (parsedDate.getTime() <= now) {
    return bad("Please choose a date and time in the future");
  }
  if (parsedDate.getTime() > now + MAX_BOOKING_DAYS_AHEAD * 24 * 60 * 60 * 1000) {
    return bad(`Bookings open up to ${MAX_BOOKING_DAYS_AHEAD} days ahead`);
  }

  // Keep strangers' details from piling up (see RESERVATION_RETENTION_DAYS).
  await purgeOldReservations().catch(() => {});

  const { start, end } = getSlotWindow(parsedDate);
  const full = () =>
    bad("That time is fully booked -- please choose a different time.", 409);

  // Fast path: reject obviously-full slots without writing anything.
  if ((await bookedSeatsInSlot(start, end)) + size > MAX_SEATS_PER_SLOT) {
    return full();
  }

  // Making the capacity check atomic.
  // The Neon HTTP driver can't hold an interactive transaction or a lock
  // across statements, so "check, then insert" lets two simultaneous
  // bookings both pass. Instead: insert first, then re-count the slot. If
  // it's now over capacity, take our own row back out and report full.
  // Whichever request commits last is guaranteed to see the other one, so
  // the slot can never settle above capacity. Under a true photo-finish
  // both can be turned away (safe) rather than both accepted (overbooked).
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

  if ((await bookedSeatsInSlot(start, end)) > MAX_SEATS_PER_SLOT) {
    await db.delete(reservations).where(eq(reservations.id, reservation.id));
    return full();
  }

  // No notification wiring for this demo -- just persists.
  // A real build would fire an email/SMS confirmation here (same pattern
  // as EcoFurnish's Resend-based order status emails).

  // Return only what the form needs, not the stored row.
  return NextResponse.json(
    { reservation: { id: reservation.id } },
    { status: 201 }
  );
}
