"use client";

import { useState } from "react";
import Link from "next/link";
import BookingCountdown from "../components/BookingCountdown";
import SectionDivider from "../components/SectionDivider";
import SiteHeader from "../components/SiteHeader";

export default function ReservationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      partySize: Number(form.get("partySize")),
      date: form.get("date"),
      notes: form.get("notes"),
      _hp: form.get("_hp"), // honeypot — real visitors never fill this in
    };

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit reservation");
      }
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong — please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="theme-light min-h-screen px-6 pt-14 pb-20 sm:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h1 className="font-serif text-4xl sm:text-5xl tracking-[0.15em] text-foreground-strong">
              RESERVE A TABLE
            </h1>
            <SectionDivider className="mt-6 mb-12 mx-auto max-w-[220px]" />
          </div>

          <div className="grid md:grid-cols-5 gap-10 md:gap-12 items-start">
            {/* form */}
            <div className="md:col-span-3">
              <div className="mb-8">
                <BookingCountdown />
              </div>

              {submitted ? (
                <div className="bg-surface border border-line-strong border-l-4 border-l-accent rounded-sm p-8">
                  <h2 className="font-serif text-2xl text-foreground-strong">
                    Reservation received
                  </h2>
                  <p className="font-body text-base text-secondary mt-3 leading-relaxed">
                    Thank you. We&apos;ve saved your request and will be in touch to confirm.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-surface border border-line rounded-sm p-6 sm:p-8 space-y-5"
                >
                  {/* honeypot: hidden from real visitors, bots that
                      autofill every field tend to fill this in too */}
                  <input
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: 1,
                      height: 1,
                      opacity: 0,
                    }}
                  />

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="font-body text-sm text-secondary">Name</label>
                      <input id="name" name="name" required className="w-full bg-background border border-line-strong rounded-sm px-4 py-3 mt-1.5 font-body text-base text-foreground-strong outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="email" className="font-body text-sm text-secondary">Email</label>
                      <input id="email" name="email" type="email" required className="w-full bg-background border border-line-strong rounded-sm px-4 py-3 mt-1.5 font-body text-base text-foreground-strong outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="font-body text-sm text-secondary">Phone (optional)</label>
                      <input id="phone" name="phone" className="w-full bg-background border border-line-strong rounded-sm px-4 py-3 mt-1.5 font-body text-base text-foreground-strong outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="partySize" className="font-body text-sm text-secondary">Party size</label>
                      <input id="partySize" name="partySize" type="number" min={1} required className="w-full bg-background border border-line-strong rounded-sm px-4 py-3 mt-1.5 font-body text-base text-foreground-strong outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date" className="font-body text-sm text-secondary">Date and time</label>
                    <input
                      id="date"
                      name="date"
                      type="datetime-local"
                      required
                      className="w-full bg-background border border-line-strong rounded-sm px-4 py-3 mt-1.5 font-body text-base text-foreground-strong outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                      style={{ colorScheme: "light" }}
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="font-body text-sm text-secondary">Notes (optional)</label>
                    <textarea id="notes" name="notes" rows={3} className="w-full bg-background border border-line-strong rounded-sm px-4 py-3 mt-1.5 font-body text-base text-foreground-strong outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none" />
                  </div>

                  {error && (
                    <p role="alert" className="font-body text-sm text-red-800">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-foreground-strong text-[#f1e9d8] hover:bg-accent hover:text-white font-body tracking-[0.12em] text-sm px-10 py-3.5 rounded-sm transition-colors disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Request reservation"}
                  </button>
                </form>
              )}
            </div>

            {/* visit us — the one dark panel on the page, echoing the home screen */}
            <aside className="md:col-span-2 bg-[#120e0a] text-[#d8cbb0] rounded-sm p-8 md:sticky md:top-24">
              <h2 className="font-serif text-2xl tracking-wide text-[#f1e9d8]">Visit us</h2>
              <div className="h-px bg-[#3d3223] my-5" />

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg text-[#c9a66b]">Hours</h3>
                  <p className="font-body text-[15px] leading-relaxed mt-1">
                    6:00 AM – 12:00 AM
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-[#c9a66b]">Location</h3>
                  <p className="font-body text-[15px] leading-relaxed mt-1">
                    Bole, Addis Ababa, Ethiopia
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-[#c9a66b]">Contact</h3>
                  <p className="font-body text-[15px] leading-relaxed mt-1">
                    +251 91 234 5678
                    <br />
                    <a
                      href="mailto:admin@ahadu.adrnds.com"
                      className="underline underline-offset-4 decoration-[#6b5a3a] hover:text-[#c9a66b] transition-colors"
                    >
                      admin@ahadu.adrnds.com
                    </a>
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
