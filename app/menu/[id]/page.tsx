import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import IngredientDetailClient from "./IngredientDetailClient";

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
    <main className="min-h-screen bg-background text-foreground px-6 py-16 sm:px-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/menu"
          className="font-serif text-xs tracking-[0.3em] text-accent hover:text-foreground-strong transition-colors"
        >
          ← MENU
        </Link>

        {item.imageUrl && (
          <div className="relative w-full aspect-[16/9] mt-6 rounded-sm overflow-hidden">
            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
          </div>
        )}

        <div className="mt-8">
          <IngredientDetailClient item={item} />
        </div>

        {/* prev / next within category */}
        {(prev || next) && (
          <div className="flex justify-between items-center mt-14 pt-6 border-t border-line font-serif">
            {prev ? (
              <Link
                href={`/menu/${prev.id}`}
                className="text-sm text-muted-foreground hover:text-foreground-strong transition-colors"
              >
                ← {prev.name}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/menu/${next.id}`}
                className="text-sm text-muted-foreground hover:text-foreground-strong transition-colors text-right"
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
          <div className="mt-12 font-serif">
            <h2 className="text-xs tracking-[0.3em] text-muted-foreground mb-4">
              MORE FROM {item.category.toUpperCase()}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.id}
                  href={`/menu/${o.id}`}
                  className="border border-line rounded-sm p-4 hover:border-accent/50 transition-colors flex justify-between items-center gap-3"
                >
                  <span className="text-sm text-secondary">{o.name}</span>
                  <span className="text-xs text-accent whitespace-nowrap">
                    ${(o.price / 100).toFixed(2)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
