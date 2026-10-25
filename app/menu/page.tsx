import { db } from "@/db";
import { menuItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import Diamond from "../components/Diamond";
import SectionDivider from "../components/SectionDivider";
import SiteHeader from "../components/SiteHeader";
import CategoryNav from "./CategoryNav";

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

function tagLabel(tag: string) {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

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
    <>
      <SiteHeader />
      <main className="theme-light min-h-screen">
        <div className="px-6 pt-14 pb-10 sm:px-12 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl tracking-[0.2em] text-foreground-strong">
            MENU
          </h1>
          <SectionDivider className="mt-6 mx-auto max-w-[220px]" />
          <p className="font-body text-base text-secondary mt-6 max-w-md mx-auto leading-relaxed">
            From breakfast to dessert. Select a dish to see what goes into it.
          </p>
        </div>

        <CategoryNav
          categories={grouped.map((g) => ({ id: g.category, label: g.label }))}
        />

        {grouped.map((group) => (
          <section
            key={group.category}
            id={group.category}
            className="scroll-mt-32 pt-12"
          >
            {/* category banner — painted, not photographed, so it looks
                intentional at any height; see note above */}
            <div
              className="relative h-28 sm:h-36 overflow-hidden"
              style={{
                background: group.background,
                backgroundSize: group.backgroundSize,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="relative z-10 mx-auto h-full max-w-6xl flex items-center px-6 sm:px-12">
                {/* frosted plate keeps the title legible over any banner */}
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-sm border"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    borderColor: "var(--glass-border)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  }}
                >
                  <Diamond />
                  <h2
                    className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-[#f1e9d8]"
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
                  >
                    {group.label.toUpperCase()}
                  </h2>
                  <Diamond />
                </div>
              </div>
            </div>

            {/* dishes */}
            <div className="mx-auto max-w-6xl px-6 py-10 sm:px-12">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={`/menu/${item.id}`}
                    className="group flex flex-col bg-surface border border-line rounded-sm overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-[0_10px_30px_rgba(60,40,10,0.12)]"
                  >
                    {item.imageUrl && (
                      // Whole photo, never cropped: it sits centred in a square, and
                      // a blurred copy of the same photo fills any leftover space.
                      <div className="relative w-full aspect-square overflow-hidden bg-muted">
                        <Image
                          src={item.imageUrl}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="64px"
                          className="object-cover scale-125 blur-2xl opacity-70"
                        />
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex justify-between items-baseline gap-4">
                        <h3 className="font-serif text-xl tracking-wide text-foreground-strong">
                          {item.name}
                        </h3>
                        <span className="font-serif text-lg text-accent whitespace-nowrap">
                          ${(item.price / 100).toFixed(2)}
                        </span>
                      </div>
                      <p className="font-body text-[15px] text-secondary mt-3 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-auto pt-5 flex items-center justify-between gap-3">
                        <div className="flex gap-2 flex-wrap">
                          {item.dietaryTags.map((tag) => (
                            <span
                              key={tag}
                              className="font-body text-xs px-2.5 py-0.5 rounded-full border border-line-strong text-muted-foreground bg-background"
                            >
                              {tagLabel(tag)}
                            </span>
                          ))}
                        </div>
                        <span className="font-body text-sm text-accent whitespace-nowrap underline-offset-4 group-hover:underline">
                          See ingredients
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}

        <div className="pb-16" />
      </main>
    </>
  );
}
