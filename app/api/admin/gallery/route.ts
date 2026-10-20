import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const images = await db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder));
  return NextResponse.json({ images });
}

// Demo mode: same reasoning as the menu-items route — the admin UI keeps
// its own browser-local copy, and this route refuses real writes even if
// called directly.
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Demo mode: writes to the shared gallery are disabled. Changes are saved to your browser only.",
    },
    { status: 403 }
  );
}
