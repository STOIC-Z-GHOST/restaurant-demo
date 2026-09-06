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
