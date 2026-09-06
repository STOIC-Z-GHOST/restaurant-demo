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

const CATEGORY_IMAGES: Record<string, string> = {
  breakfast: "/images/categories/breakfast.png",
  lunch: "/images/categories/lunch.png",
  dinner: "/images/categories/dinner.png",
  drinks: "/images/categories/drinks.png",
  desserts: "/images/categories/desserts-v2.png",
};

// each category gets its own time-of-day mood instead of one flat dark filter
const CATEGORY_TONE: Record<
  string,
  { filter: string; overlay: string }
> = {
  breakfast: {
    // bright, warm, morning light — barely darkened
    filter: "saturate(1.05) brightness(0.95) contrast(1.02)",
    overlay:
      "linear-gradient(180deg, rgba(20,14,6,0.15) 0%, rgba(20,14,6,0.55) 100%)",
  },
  lunch: {
    // bright midday sun — distinct from breakfast's soft warm glow: cooler,
    // higher contrast, closer to full daylight
    filter: "saturate(1.08) brightness(1.02) contrast(1.08)",
    overlay:
      "linear-gradient(180deg, rgba(10,10,8,0.08) 0%, rgba(10,10,8,0.45) 100%)",
  },
  dinner: {
    // dark, moody, evening — eased up slightly from too-dark
    filter: "grayscale(0.3) sepia(0.22) brightness(0.55) contrast(1.05)",
    overlay:
      "linear-gradient(180deg, rgba(8,6,3,0.3) 0%, rgba(8,6,3,0.7) 100%)",
  },
  drinks: {
    // cool, clean, sparkling — less sepia, higher clarity
    filter: "saturate(1.1) brightness(0.7) hue-rotate(-4deg) contrast(1.05)",
    overlay:
      "linear-gradient(180deg, rgba(10,14,16,0.25) 0%, rgba(10,12,14,0.68) 100%)",
  },
  desserts: {
    // light but golden
    filter: "saturate(1.1) sepia(0.15) brightness(0.88) contrast(1.02)",
    overlay:
      "linear-gradient(180deg, rgba(24,16,4,0.2) 0%, rgba(24,16,4,0.58) 100%)",
  },
};

// how each banner photo is cropped within its short wide frame —
// most look fine centered, but the dessert shot has its subject
// (the glass) lower in the frame, so its default center-crop was
// cutting it off
const CATEGORY_POSITION: Record<string, string> = {
  breakfast: "center",
  lunch: "center",
  dinner: "center",
  drinks: "center",
  desserts: "center",
};

export default async function MenuPage() {
  const items = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.available, true));

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    image: CATEGORY_IMAGES[cat],
    tone: CATEGORY_TONE[cat],
    position: CATEGORY_POSITION[cat],
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
          {/* category banner — capped height so it can't balloon on wide
              screens; below ~960px wide it's still a true 3:1 band, above
              that the height holds steady and the crop just gets wider */}
          <div className="relative aspect-[3/1] max-h-80 overflow-hidden">
            {group.image ? (
              <>
                <Image
                  src={group.image}
                  alt=""
                  fill
                  className="object-cover"
                  style={{
                    filter: group.tone?.filter,
                    objectPosition: group.position,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: group.tone?.overlay,
                  }}
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
            <div className="relative z-10 h-full flex items-center px-6 sm:px-12">
              {/* frosted glass plate — same treatment regardless of how
                  bright the photo behind it is, so legibility never
                  depends on which category this happens to be */}
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
                  className="block border border-line rounded-sm overflow-hidden hover:border-accent/50 transition-colors font-serif"
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
