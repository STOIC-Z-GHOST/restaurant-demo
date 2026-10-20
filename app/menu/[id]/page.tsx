import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import IngredientDetailClient from "./IngredientDetailClient";
import SiteHeader from "../../components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function MenuItemPage({
  params,
}: {
  params: { id: string };
}) {
  const [item] = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.id, Number(params.id)));

  if (!item) notFound();

  // sibling items in the same category, for prev/next + "more like this"
  const siblings = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.category, item.category))
    .orderBy(asc(menuItems.id));

  const currentIndex = siblings.findIndex((s) => s.id === item.id);
  const prev = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < siblings.length - 1
      ? siblings[currentIndex + 1]
      : null;
  const others = siblings.filter((s) => s.id !== item.id);

  return (
    <>
      <SiteHeader />
      <main className="theme-light min-h-screen px-6 py-10 sm:px-12 sm:py-14">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/menu"
            className="font-body text-sm text-accent hover:text-foreground-strong transition-colors"
          >
            ← Back to menu
          </Link>

          {item.imageUrl && (
            // natural proportions: the whole photo, never cropped
            <div className="mt-6 rounded-sm overflow-hidden border border-line bg-muted">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={1400}
                height={1400}
                priority
                sizes="(min-width: 672px) 672px, 100vw"
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
          )}

          <div className="mt-10">
            <IngredientDetailClient item={item} />
          </div>

          {/* previous / next within the category */}
          {(prev || next) && (
            <div className="flex justify-between items-center gap-4 mt-14 pt-6 border-t border-line font-body">
              {prev ? (
                <Link
                  href={`/menu/${prev.id}`}
                  className="text-sm text-secondary hover:text-accent transition-colors"
                >
                  ← {prev.name}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/menu/${next.id}`}
                  className="text-sm text-secondary hover:text-accent transition-colors text-right"
                >
                  {next.name} →
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}

          {/* more from this category */}
          {others.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-2xl tracking-wide text-foreground-strong mb-5 capitalize">
                More {item.category}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {others.map((o) => (
                  <Link
                    key={o.id}
                    href={`/menu/${o.id}`}
                    className="bg-surface border border-line rounded-sm p-4 hover:border-accent transition-colors flex justify-between items-baseline gap-3"
                  >
                    <span className="font-serif text-lg text-foreground-strong">{o.name}</span>
                    <span className="font-serif text-accent whitespace-nowrap">
                      ${(o.price / 100).toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
