import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="max-w-sm mx-auto px-4 py-24">
      <h1 className="text-2xl font-semibold mb-6">Admin</h1>
      <div className="space-y-3">
        <Link
          href="/admin/menu-items"
          className="block border rounded-md p-3 hover:bg-muted transition-colors"
        >
          Menu items
        </Link>
        <Link
          href="/admin/gallery"
          className="block border rounded-md p-3 hover:bg-muted transition-colors"
        >
          Gallery
        </Link>
        <Link
          href="/admin/reservations"
          className="block border rounded-md p-3 hover:bg-muted transition-colors"
        >
          Reservations
        </Link>
      </div>
    </main>
  );
}
