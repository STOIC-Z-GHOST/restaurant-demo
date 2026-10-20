import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

// Always run at request time — never prerender this at build, since it reads the database.
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await db.select().from(menuItems).orderBy(desc(menuItems.createdAt));
  return NextResponse.json({ items });
}

// Demo mode: the admin UI never calls this — it manages a browser-local
// copy instead (see app/admin/menu-items/page.tsx) so no visitor can change
// the real, shared menu. This route is blocked as a second layer of
// protection in case it's ever hit directly (curl, Postman, etc.).
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Demo mode: writes to the shared menu are disabled. Changes are saved to your browser only.",
    },
    { status: 403 }
  );
}
