import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { asc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import SectionDivider from "../components/SectionDivider";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder));

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16 sm:px-12">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="font-serif text-xs tracking-[0.3em] text-accent hover:text-foreground-strong transition-colors"
        >
          ← AHADU
        </Link>

        <h1 className="font-serif text-4xl tracking-[0.2em] mt-8">GALLERY</h1>
        <SectionDivider className="mt-6 mb-12 max-w-xs" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <figure
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm"
            >
              <Image
                src={img.imageUrl}
                alt={img.caption ?? ""}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {img.caption && (
                <figcaption className="absolute bottom-4 left-4 font-serif text-sm tracking-wide text-foreground-strong opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
