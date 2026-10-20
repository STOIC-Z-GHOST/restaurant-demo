import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="max-w-sm mx-auto px-4 py-24">
      <h1 className="text-2xl font-semibold mb-6">Admin</h1>
      <div className="space-y-3">
        <Link
          href="/admin/menu-items"
          className="block rounded-md px-5 py-4 bg-[#120e0a] text-[#f1e9d8] border border-[#3d3223] hover:border-[#c9a66b] hover:text-[#c9a66b] transition-colors"
        >
          Menu items
        </Link>
        <Link
          href="/admin/gallery"
          className="block rounded-md px-5 py-4 bg-[#120e0a] text-[#f1e9d8] border border-[#3d3223] hover:border-[#c9a66b] hover:text-[#c9a66b] transition-colors"
        >
          Gallery
        </Link>
        <Link
          href="/admin/reservations"
          className="block rounded-md px-5 py-4 bg-[#120e0a] text-[#f1e9d8] border border-[#3d3223] hover:border-[#c9a66b] hover:text-[#c9a66b] transition-colors"
        >
          Reservations
        </Link>
      </div>
    </main>
  );
}
