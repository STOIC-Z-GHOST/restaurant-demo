// One-off: point existing DB rows at the compressed .webp images.
//
// The big originals in public/images were converted from .png/.jpg to .webp,
// so rows saved with the old paths (menu_items.image_url, gallery_images.image_url)
// would 404. Run once, right after deploying: `pnpm db:migrate-images`.
// Safe to re-run — rows already on .webp are left alone.
import "dotenv/config";
import { db } from "./index";
import { menuItems, galleryImages } from "./schema";
import { eq } from "drizzle-orm";

const MAP: Record<string, string> = {
  "/images/ahadu-glass.png": "/images/ahadu-glass.webp",
  "/images/categories/breakfast.png": "/images/categories/breakfast.webp",
  "/images/categories/desserts-v2.png": "/images/categories/desserts-v2.webp",
  "/images/categories/dinner.png": "/images/categories/dinner.webp",
  "/images/categories/drinks.png": "/images/categories/drinks.webp",
  "/images/categories/lunch.png": "/images/categories/lunch.webp",
  "/images/gallery/bar-shelving.png": "/images/gallery/bar-shelving.webp",
  "/images/gallery/marble-island.png": "/images/gallery/marble-island.webp",
  "/images/gallery/open-shelving.png": "/images/gallery/open-shelving.webp",
  "/images/hero-bg.png": "/images/hero-bg.webp",
  "/images/logo.png": "/images/logo.webp",
  "/images/menu/avocado-toast.jpg": "/images/menu/avocado-toast.webp",
  "/images/menu/chicken-salad.jpg": "/images/menu/chicken-salad.webp",
  "/images/menu/espresso.jpg": "/images/menu/espresso.webp",
  "/images/menu/logo.png": "/images/menu/logo.webp",
  "/images/menu/oat-latte.jpg": "/images/menu/oat-latte.webp",
  "/images/menu/pesto-penne.jpg": "/images/menu/pesto-penne.webp",
  "/images/menu/ribeye.jpg": "/images/menu/ribeye.webp",
  "/images/menu/risotto.jpg": "/images/menu/risotto.webp",
  "/images/menu/salmon.jpg": "/images/menu/salmon.webp",
  "/images/menu/yogurt-bowl.jpg": "/images/menu/yogurt-bowl.webp",
  "/images/splash/glyph.png": "/images/splash/glyph.webp",
};

async function main() {
  let changed = 0;

  for (const row of await db.select().from(menuItems)) {
    const next = row.imageUrl && MAP[row.imageUrl];
    if (next) {
      await db.update(menuItems).set({ imageUrl: next }).where(eq(menuItems.id, row.id));
      changed++;
    }
  }
  for (const row of await db.select().from(galleryImages)) {
    const next = MAP[row.imageUrl];
    if (next) {
      await db.update(galleryImages).set({ imageUrl: next }).where(eq(galleryImages.id, row.id));
      changed++;
    }
  }

  console.log(`Updated ${changed} row(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
