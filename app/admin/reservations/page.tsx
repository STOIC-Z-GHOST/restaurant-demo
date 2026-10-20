"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../AdminHeader";
import { MAX_SEATS_PER_SLOT, SLOT_MINUTES } from "@/lib/reservation-config";

type Reservation = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  partySize: number;
  date: string;
  notes: string | null;
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reservations")
      .then((res) => res.json())
      .then((data) => setReservations(data.reservations ?? []))
      .finally(() => setLoading(false));
  }, []);

  const now = Date.now();
  const upcoming = reservations.filter((r) => new Date(r.date).getTime() >= now);
  const past = reservations.filter((r) => new Date(r.date).getTime() < now);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <AdminHeader current="reservations" />

      <h1 className="text-2xl font-semibold mb-2">Reservations</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Real, live reservations from the booking form — this view is
        read-only. Each {SLOT_MINUTES}-minute window holds up to{" "}
        {MAX_SEATS_PER_SLOT} seats before the booking form starts rejecting
        new requests for that time.
      </p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : reservations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reservations yet.</p>
      ) : (
        <>
          <ReservationList title={`Upcoming (${upcoming.length})`} rows={upcoming} />
          {past.length > 0 && (
            <ReservationList title={`Past (${past.length})`} rows={past} />
          )}
        </>
      )}
    </main>
  );
}

function ReservationList({ title, rows }: { title: string; rows: Reservation[] }) {
  return (
    <div className="mb-8">
      <h2 className="font-medium mb-3">{title}</h2>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="border rounded-md p-3">
            <div className="flex justify-between gap-4">
              <div className="font-medium">{r.name}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(r.date).toLocaleString()}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Party of {r.partySize} · {r.email}
              {r.phone ? ` · ${r.phone}` : ""}
            </div>
            {r.notes && <div className="text-sm mt-1">{r.notes}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
