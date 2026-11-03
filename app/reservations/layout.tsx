import type { Metadata } from "next";

// The page itself is a client component (form state), which can't export
// metadata — so the title and description live in this tiny server layout.
export const metadata: Metadata = {
  title: "Reserve a table",
  description:
    "Request a table at AHADU, open 6 AM to midnight in Bole, Addis Ababa.",
};

export default function ReservationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
