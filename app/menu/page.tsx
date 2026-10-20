import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import Diamond from "../components/Diamond";
import SectionDivider from "../components/SectionDivider";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  drinks: "Drinks",
  desserts: "Desserts",
};

const CATEGORY_ORDER = ["breakfast", "lunch", "dinner", "drinks", "desserts"];

// Category banners are painted, not photographed. A photo has one "correct"
// height it was composed for -- crop it shorter and it reads as cut off.
// A gradient or generated texture has no such thing, so it looks intentional
// at any height, including the capped max-h below on wide screens.
//
// breakfast/lunch/dinner: a straight time-of-day gradient wash, lightest to
// darkest in that order (matches the old photo treatment's mood progression).
// dessert/drinks: a generated low-poly "facet" texture in the site's own
// gold/espresso/wine palette -- dessert denser and more colorful ("mix of
// different colors, brown with some mix"), drinks sparser with brighter
// glints along a diagonal sweep, like light catching a glass edge. Both are
// biased dark-to-light left-to-right so the title plate (which sits at the
// left) always lands on the calmer, darker side of the pattern.
const CATEGORY_BACKGROUND: Record<string, string> = {
  breakfast: "linear-gradient(160deg, #7a5a34 0%, #40301c 45%, #201408 100%)",
  lunch: "linear-gradient(160deg, #9c7c48 0%, #5c4020 45%, #2e1f10 100%)",
  dinner: "linear-gradient(160deg, #241810 0%, #120c07 50%, #08050a 100%)",
  drinks: "url(/images/categories/facets-drinks.svg)",
  desserts: "url(/images/categories/facets-dessert.svg)",
};

const CATEGORY_BACKGROUND_SIZE: Record<string, string> = {
  drinks: "100% 100%",
  desserts: "100% 100%",
};

export default async function MenuPage() {
  const items = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.available, true));

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    background: CATEGORY_BACKGROUND[cat],
    backgroundSize: CATEGORY_BACKGROUND_SIZE[cat] ?? "cover",
    items: items.filter((i) => i.category === cat),
  })).filter((group) => group.items.length > 0);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="px-6 py-10 sm:px-12">
        <Link
          href="/"
          className="font-serif text-xs tracking-[0.3em] text-accent hover:text-foreground-strong transition-colors"
        >
          ← AHADU
        </Link>
        <h1 className="font-serif text-4xl tracking-[0.2em] mt-8">MENU</h1>
        <SectionDivider className="mt-6 max-w-xs" />
      </div>

      {grouped.map((group) => (
        <section key={group.category} className="mb-4">
          {/* category banner -- capped height so it can't balloon on wide
              screens; painted rather than photographed, see note above */}
          <div
            className="relative aspect-[3/1] max-h-80 overflow-hidden"
            style={{
              background: group.background,
              backgroundSize: group.backgroundSize,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="relative z-10 h-full flex items-center px-6 sm:px-12">
              {/* frosted glass plate -- same treatment regardless of what's
                  behind it, so legibility never depends on the background */}
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-sm border"
                style={{
                  backgroundColor: "var(--glass-bg)",
                  borderColor: "var(--glass-border)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.35)",
                }}
              >
                <Diamond />
                <h2
                  className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-foreground-strong"
                  style={{
                    textShadow: "0 2px 16px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)",
                  }}
                >
                  {group.label.toUpperCase()}
                </h2>
                <Diamond />
              </div>
            </div>
          </div>

          {/* items */}
          <div className="px-6 py-10 sm:px-12">
            <div className="grid gap-4 sm:grid-cols-2 max-w-5xl">
              {group.items.map((item) => (
                <Link
                  key={item.id}
                  href={`/menu/${item.id}`}
                  className="block border border-line rounded-sm overflow-hidden font-serif transition-all duration-500 ease-out hover:border-accent/70 hover:scale-[1.015] hover:shadow-[0_0_28px_rgba(201,166,107,0.28)]"
                >
                  {item.imageUrl && (
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="text-foreground-strong tracking-wide">{item.name}</h3>
                      <span className="text-sm text-accent whitespace-nowrap">
                        ${(item.price / 100).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                    {item.dietaryTags.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-3">
                        {item.dietaryTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] tracking-wider px-2 py-0.5 rounded-full border border-line-strong text-muted-foreground"
                          >
                            {tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
