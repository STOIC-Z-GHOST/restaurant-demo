import { db } from "@/db";
import { reservations } from "@/db/schema";
import { lt } from "drizzle-orm";
import { RESERVATION_RETENTION_DAYS } from "./reservation-config";

/** Deletes reservations older than the retention window. Cheap; call it opportunistically. */
export async function purgeOldReservations(): Promise<void> {
  const cutoff = new Date(
    Date.now() - RESERVATION_RETENTION_DAYS * 24 * 60 * 60 * 1000
  );
  await db.delete(reservations).where(lt(reservations.createdAt, cutoff));
}

/** "Jane Doe" -> "J*** D***" */
export function maskName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => (part ? `${part[0]}***` : ""))
    .join(" ");
}

/** "jane@gmail.com" -> "j***@gmail.com" */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 1) return "***";
  return `${email[0]}***${email.slice(at)}`;
}

/** "+251 91 234 5678" -> "••• ••• 78" (last two digits only) */
export function maskPhone(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 2 ? `••• ••• ${digits.slice(-2)}` : "•••";
}
