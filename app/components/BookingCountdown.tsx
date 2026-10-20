"use client";

import { useEffect, useState } from "react";

// Booking window: opens Saturday 00:00, closes end of Sunday (23:59:59),
// in the restaurant's local time — Africa/Addis_Ababa, EAT, fixed UTC+3
// (no daylight saving in Ethiopia, so a fixed offset is safe here).
const EAT_OFFSET_MINUTES = 3 * 60;

function nowInEAT(): Date {
  const utcMs = Date.now();
  return new Date(utcMs + EAT_OFFSET_MINUTES * 60 * 1000);
}

function getWindowState(eatNow: Date) {
  const day = eatNow.getUTCDay(); // using UTC getters on our shifted date = EAT wall-clock fields
  const isOpen = day === 6 || day === 0; // Saturday=6, Sunday=0

  // find the boundary (window close if open, window open if closed)
  const target = new Date(eatNow);
  target.setUTCHours(0, 0, 0, 0);

  if (isOpen) {
    // closes at end of Sunday
    const daysUntilSunday = day === 6 ? 1 : 0;
    target.setUTCDate(target.getUTCDate() + daysUntilSunday);
    target.setUTCHours(23, 59, 59, 999);
  } else {
    // opens next Saturday
    const daysUntilSaturday = (6 - day + 7) % 7 || 7;
    target.setUTCDate(target.getUTCDate() + daysUntilSaturday);
    target.setUTCHours(0, 0, 0, 0);
  }

  const diffMs = target.getTime() - eatNow.getTime();
  return { isOpen, diffMs };
}

function formatDiff(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export default function BookingCountdown() {
  const [state, setState] = useState<{ isOpen: boolean; diffMs: number } | null>(null);

  useEffect(() => {
    function tick() {
      setState(getWindowState(nowInEAT()));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!state) return null;

  const { days, hours, minutes, seconds } = formatDiff(state.diffMs);

  return (
    <div className="border border-line-strong rounded-sm px-6 py-5 font-serif">
      <p className="text-xs tracking-[0.25em] text-muted-foreground mb-3">
        {state.isOpen ? "BOOKING WINDOW CLOSES IN" : "BOOKING OPENS IN"}
      </p>
      <div className="flex gap-6">
        {[
          { label: "Days", value: days },
          { label: "Hours", value: hours },
          { label: "Min", value: minutes },
          { label: "Sec", value: seconds },
        ].map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="text-2xl text-foreground-strong tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="text-[10px] tracking-wider text-muted-foreground mt-1">
              {unit.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
        {state.isOpen
          ? "Reservations are open now — book before the window closes Sunday night."
          : "Reservations open every Saturday and close Sunday night."}
      </p>
    </div>
  );
}
