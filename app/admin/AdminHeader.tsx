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
      <nav className="flex gap-4 text-sm">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className={
              t.key === current
                ? "font-medium underline"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="text-sm text-muted-foreground underline"
      >
        Log out
      </button>
    </div>
  );
}
