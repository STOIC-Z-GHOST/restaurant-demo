import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const [item] = await db.select().from(menuItems).where(eq(menuItems.id, Number(params.id)));
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

// Demo mode: writes disabled — see the note in ../route.ts
export async function PATCH() {
  return NextResponse.json(
    {
      error:
        "Demo mode: writes to the shared menu are disabled. Changes are saved to your browser only.",
    },
    { status: 403 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      error:
        "Demo mode: writes to the shared menu are disabled. Changes are saved to your browser only.",
    },
    { status: 403 }
  );
}
