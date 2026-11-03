// Simple seating-capacity model for the reservation demo.
// Bump these to match a real dining room if this ever seats real guests.

export const SLOT_MINUTES = 30; // reservations are bucketed into 30-minute windows
export const MAX_SEATS_PER_SLOT = 40; // total seats considered "full" for one window

/** Rounds a date down to its slot boundary and returns [start, end). */
export function getSlotWindow(date: Date): { start: Date; end: Date } {
  const ms = SLOT_MINUTES * 60 * 1000;
  const start = new Date(Math.floor(date.getTime() / ms) * ms);
  const end = new Date(start.getTime() + ms);
  return { start, end };
}

// --- demo data retention -------------------------------------------------
// This demo is open to anyone, so reservations contain strangers' details.
// They're deleted this many days after being submitted (see purgeOldReservations)
// and the booking form says so.
export const RESERVATION_RETENTION_DAYS = 3;

// --- input limits (shared by the API and the form) ------------------------
export const MAX_PARTY_SIZE = 20; // must stay <= MAX_SEATS_PER_SLOT
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_PHONE_LENGTH = 30;
export const MAX_NOTES_LENGTH = 500;
export const MAX_BOOKING_DAYS_AHEAD = 180;
