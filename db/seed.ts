import "dotenv/config";
import { db } from "../db";
import { menuItems, galleryImages } from "../db/schema";

async function seed() {
  console.log("Seeding menu items...");

  await db.insert(menuItems).values([
    // ---------- breakfast ----------
    {
      name: "Avocado Toast",
      description: "Smashed avocado on toasted seeded sourdough, topped with a fried egg, chili flakes and fresh chives.",
      price: 1200,
      category: "breakfast",
      ingredients: ["Sourdough bread", "Avocado", "Fried egg", "Chili flakes", "Chives"],
      dietaryTags: ["vegetarian"],
      imageUrl: "/images/menu/avocado-toast.jpg",
      available: true,
    },
    {
      name: "Greek Yogurt Bowl",
      description: "Thick Greek yogurt topped with raspberries, blackberries and blueberries, finished with crunchy granola.",
      price: 900,
      category: "breakfast",
      ingredients: ["Greek yogurt", "Mixed berries", "Granola"],
      dietaryTags: ["vegetarian"],
      imageUrl: "/images/menu/yogurt-bowl.jpg",
      available: true,
    },

    // ---------- lunch ----------
    {
      name: "Grilled Chicken Salad",
      description: "Grilled chicken over crisp greens with roasted butternut squash, apple, dried cranberries, pecans, bacon, crumbled cheese and a boiled egg, in a house vinaigrette.",
      price: 1450,
      category: "lunch",
      ingredients: ["Grilled chicken", "Mixed greens", "Butternut squash", "Apple", "Dried cranberries", "Pecans", "Bacon", "Crumbled cheese", "Boiled egg", "Cherry tomatoes"],
      dietaryTags: [],
      imageUrl: "/images/menu/chicken-salad.jpg",
      available: true,
    },
    {
      name: "Pesto Penne",
      description: "Penne tossed in house-made basil pesto with pine nuts and shaved parmesan.",
      price: 1350,
      category: "lunch",
      ingredients: ["Penne pasta", "Basil pesto", "Pine nuts", "Parmesan"],
      dietaryTags: ["vegetarian"],
      imageUrl: "/images/menu/pesto-penne.jpg",
      available: true,
    },

    // ---------- dinner ----------
    {
      name: "Pan-Seared Salmon",
      description: "Spice-crusted salmon fillets with asparagus, peas, baby potatoes and cherry tomatoes, finished with fresh lemon and herbs.",
      price: 2200,
      category: "dinner",
      ingredients: ["Salmon", "Asparagus", "Green peas", "Baby potatoes", "Cherry tomatoes", "Lemon"],
      dietaryTags: ["gluten-free"],
      imageUrl: "/images/menu/salmon.jpg",
      available: true,
    },
    {
      name: "Ribeye Steak",
      description: "21-day dry-aged ribeye, grilled and finished with rosemary butter and roasted garlic.",
      price: 3200,
      category: "dinner",
      ingredients: ["Ribeye steak", "Rosemary butter", "Roasted garlic"],
      dietaryTags: ["gluten-free"],
      imageUrl: "/images/menu/ribeye.jpg",
      available: true,
    },
    {
      name: "Wild Mushroom Risotto",
      description: "Slow-cooked arborio rice with chanterelle and wild mushrooms, finished with butter, parmesan and truffle oil.",
      price: 1900,
      category: "dinner",
      ingredients: ["Arborio rice", "Wild mushrooms", "Truffle oil", "Parmesan"],
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
      description: "House-carbonated water with fresh lime, orange slices and mint.",
      price: 400,
      category: "drinks",
      ingredients: ["Sparkling water", "Fresh lime", "Orange slices", "Mint leaves"],
      dietaryTags: ["vegan", "vegetarian", "gluten-free"],
      imageUrl: "/images/menu/sparkling-lime.jpg",
      available: true,
    },

    // ---------- desserts ----------
    {
      name: "Dark Chocolate Lava Cake",
      description: "Warm dark chocolate cake with a molten center, served with vanilla ice cream and fresh raspberries.",
      price: 1100,
      category: "desserts",
      ingredients: ["Dark chocolate", "Vanilla ice cream", "Raspberries", "Mint leaves"],
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
