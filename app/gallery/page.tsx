import { db } from "@/db";
import { galleryImages } from "@/db/schema";
import { asc } from "drizzle-orm";
import Image from "next/image";
import SectionDivider from "../components/SectionDivider";
import SiteHeader from "../components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const images = await db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder));

  return (
    <>
      <SiteHeader />
      <main className="theme-light min-h-screen px-6 pt-14 pb-20 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="font-serif text-4xl sm:text-5xl tracking-[0.2em] text-foreground-strong">
              GALLERY
            </h1>
            <SectionDivider className="mt-6 mb-12 mx-auto max-w-[220px]" />
          </div>

          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <figure key={img.id} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line bg-muted">
                  <Image
                    src={img.imageUrl}
                    alt={img.caption ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                {img.caption && (
                  <figcaption className="font-serif italic text-lg text-secondary mt-3">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
