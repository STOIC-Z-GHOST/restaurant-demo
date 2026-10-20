import "dotenv/config";
import { db } from "../db";
import { menuItems, galleryImages } from "../db/schema";

async function seed() {
  console.log("Seeding menu items...");

  await db.insert(menuItems).values([
    // ---------- breakfast ----------
    {
      name: "Avocado Toast",
      description: "Smashed avocado over toasted sourdough, topped with a poached egg and chili flakes.",
      price: 1200,
      category: "breakfast",
      ingredients: ["Sourdough bread", "Avocado", "Poached egg", "Chili flakes"],
      dietaryTags: ["vegetarian"],
      imageUrl: "/images/menu/avocado-toast.jpg",
      available: true,
    },
    {
      name: "Greek Yogurt Bowl",
      description: "Creamy yogurt with seasonal fruit, feta, and a drizzle of honey.",
      price: 900,
      category: "breakfast",
      ingredients: ["Feta", "Seasonal vegetables"],
      dietaryTags: ["vegetarian", "gluten-free"],
      imageUrl: "/images/menu/yogurt-bowl.jpg",
      available: true,
    },

    // ---------- lunch ----------
    {
      name: "Grilled Chicken Salad",
      description: "Grilled chicken breast over mixed greens with a balsamic glaze.",
      price: 1450,
      category: "lunch",
      ingredients: ["Grilled chicken", "Mixed greens", "Balsamic glaze"],
      dietaryTags: ["gluten-free"],
      imageUrl: "/images/menu/chicken-salad.jpg",
      available: true,
    },
    {
      name: "Pesto Penne",
      description: "Penne pasta tossed in house-made basil pesto with shaved parmesan.",
      price: 1350,
      category: "lunch",
      ingredients: ["Penne pasta", "Basil pesto", "Parmesan"],
      dietaryTags: ["vegetarian"],
      imageUrl: "/images/menu/pesto-penne.jpg",
      available: true,
    },

    // ---------- dinner ----------
    {
      name: "Pan-Seared Salmon",
      description: "Salmon fillet in lemon butter sauce, served with seasonal vegetables.",
      price: 2200,
      category: "dinner",
      ingredients: ["Salmon", "Lemon butter", "Seasonal vegetables"],
      dietaryTags: ["gluten-free"],
      imageUrl: "/images/menu/salmon.jpg",
      available: true,
    },
    {
      name: "Ribeye Steak",
      description: "21-day dry-aged ribeye with roasted potatoes and red wine jus.",
      price: 3200,
      category: "dinner",
      ingredients: ["Ribeye steak", "Roasted potatoes", "Red wine jus"],
      dietaryTags: ["gluten-free"],
      imageUrl: "/images/menu/ribeye.jpg",
      available: true,
    },
    {
      name: "Wild Mushroom Risotto",
      description: "Slow-cooked arborio rice with a wild mushroom blend, finished with truffle oil.",
      price: 1900,
      category: "dinner",
      ingredients: ["Mushroom risotto", "Truffle oil", "Parmesan"],
      dietaryTags: ["vegetarian", "gluten-free"],
      imageUrl: "/images/menu/risotto.jpg",
      available: true,
    },

    // ---------- drinks ----------
    {
      name: "Espresso",
      description: "A classic double shot, locally roasted.",
      price: 350,
      category: "drinks",
      ingredients: ["Espresso"],
      dietaryTags: ["vegan", "vegetarian", "gluten-free"],
      imageUrl: "/images/menu/espresso.jpg",
      available: true,
    },
    {
      name: "Oat Milk Latte",
      description: "Espresso steamed with oat milk.",
      price: 500,
      category: "drinks",
      ingredients: ["Espresso", "Oat milk"],
      dietaryTags: ["vegan", "vegetarian"],
      imageUrl: "/images/menu/oat-latte.jpg",
      available: true,
    },
    {
      name: "Sparkling Lime",
      description: "House-carbonated water with fresh lime and mint.",
      price: 400,
      category: "drinks",
      ingredients: ["Sparkling water", "Fresh lime", "Mint leaves"],
      dietaryTags: ["vegan", "vegetarian", "gluten-free"],
      imageUrl: "/images/menu/sparkling-lime.jpg",
      available: true,
    },

    // ---------- desserts ----------
    {
      name: "Dark Chocolate Lava Cake",
      description: "Warm chocolate cake with a molten center, served with vanilla ice cream.",
      price: 1100,
      category: "desserts",
      ingredients: ["Dark chocolate", "Vanilla ice cream", "Mint leaves"],
      dietaryTags: ["vegetarian"],
      imageUrl: "/images/menu/lava-cake.jpg",
      available: true,
    },
  ]);

  console.log("Seeding gallery images...");

  await db.insert(galleryImages).values([
    { imageUrl: "/images/hero-bg.png", caption: "The marble island, evenings", sortOrder: 1 },
    { imageUrl: "/images/gallery/open-shelving.png", caption: "Open shelving, kitchenside", sortOrder: 2 },
    { imageUrl: "/images/gallery/bar-shelving.png", caption: "The bar", sortOrder: 3 },
  ]);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
