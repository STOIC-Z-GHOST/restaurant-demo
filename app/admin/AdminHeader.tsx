"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const TABS = [
  { key: "menu-items", label: "Menu items", href: "/admin/menu-items" },
  { key: "gallery", label: "Gallery", href: "/admin/gallery" },
  { key: "reservations", label: "Reservations", href: "/admin/reservations" },
] as const;

export default function AdminHeader({
  current,
}: {
  current: (typeof TABS)[number]["key"];
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b flex-wrap gap-3">
      <nav aria-label="Admin sections" className="flex gap-2 text-sm flex-wrap">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            aria-current={t.key === current ? "page" : undefined}
            className={`px-4 py-1.5 rounded-full border transition-colors ${
              t.key === current
                ? "bg-foreground-strong text-background border-foreground-strong"
                : "text-secondary hover:border-accent hover:text-foreground-strong"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-5 text-sm">
        <Link
          href="/"
          className="text-accent underline underline-offset-4 hover:text-foreground-strong"
        >
          View site
        </Link>
        <button
          onClick={handleLogout}
          className="text-muted-foreground underline underline-offset-4 hover:text-foreground-strong"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
