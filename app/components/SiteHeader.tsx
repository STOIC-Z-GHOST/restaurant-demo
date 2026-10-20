"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Always dark, on purpose: it carries the home page's espresso-and-gold
// look across every inner page, and gives each one the same way back.
const LINKS = [
  { label: "Menu", short: "Menu", href: "/menu" },
  { label: "Gallery", short: "Gallery", href: "/gallery" },
  { label: "Reservations", short: "Reserve", href: "/reservations" },
];

export default function SiteHeader() {
  const pathname = usePathname() ?? "";

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#120e0a] border-b border-[#3d3223]">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6 sm:px-12">
        <Link
          href="/"
          aria-label="AHADU — home"
          className="font-serif text-base sm:text-xl tracking-[0.3em] sm:tracking-[0.35em] text-[#f1e9d8] hover:text-[#c9a66b] transition-colors"
        >
          AHADU
        </Link>

        <nav aria-label="Main" className="flex items-center gap-4 sm:gap-9">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`font-body text-[13px] sm:text-sm tracking-[0.08em] py-1 border-b transition-colors ${
                  active
                    ? "text-[#c9a66b] border-[#c9a66b]"
                    : "text-[#d8cbb0] border-transparent hover:text-[#f1e9d8]"
                }`}
              >
                <span className="sm:hidden">{link.short}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
