import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { menuItems } from "../db/schema";

// Updates the wording, ingredients and dietary tags of the EXISTING menu rows
// (matched by dish name) so they describe the new photos. Unlike db:seed it
// inserts nothing and deletes nothing, so reservations, prices, images and
// gallery rows are left exactly as they are. Safe to run more than once.
const updates = [
  {
    name: "Avocado Toast",
    description: "Smashed avocado on toasted seeded sourdough, topped with a fried egg, chili flakes and fresh chives.",
    ingredients: ["Sourdough bread", "Avocado", "Fried egg", "Chili flakes", "Chives"],
    dietaryTags: ["vegetarian"],
  },
  {
    name: "Greek Yogurt Bowl",
    description: "Thick Greek yogurt topped with raspberries, blackberries and blueberries, finished with crunchy granola.",
    ingredients: ["Greek yogurt", "Mixed berries", "Granola"],
    dietaryTags: ["vegetarian"],
  },
  {
    name: "Grilled Chicken Salad",
    description: "Grilled chicken breast over mixed greens with boiled egg, crumbled cheese, cucumber, tomatoes and croutons, in a balsamic vinaigrette.",
    ingredients: ["Grilled chicken", "Mixed greens", "Boiled egg", "Crumbled cheese", "Cucumber", "Cherry tomatoes", "Croutons", "Balsamic vinaigrette"],
    dietaryTags: [],
  },
  {
    name: "Pesto Penne",
    description: "Penne tossed in house-made basil pesto with pine nuts and shaved parmesan.",
    ingredients: ["Penne pasta", "Basil pesto", "Pine nuts", "Parmesan"],
    dietaryTags: ["vegetarian"],
  },
  {
    name: "Pan-Seared Salmon",
    description: "Spice-crusted salmon fillets with asparagus, peas, baby potatoes and cherry tomatoes, finished with fresh lemon and herbs.",
    ingredients: ["Salmon", "Asparagus", "Green peas", "Baby potatoes", "Cherry tomatoes", "Lemon"],
    dietaryTags: ["gluten-free"],
  },
  {
    name: "Ribeye Steak",
    description: "21-day dry-aged ribeye, grilled and finished with rosemary butter and roasted garlic.",
    ingredients: ["Ribeye steak", "Rosemary butter", "Roasted garlic"],
    dietaryTags: ["gluten-free"],
  },
  {
    name: "Wild Mushroom Risotto",
    description: "Slow-cooked arborio rice with chanterelle and wild mushrooms, finished with butter, parmesan and truffle oil.",
    ingredients: ["Arborio rice", "Wild mushrooms", "Truffle oil", "Parmesan"],
    dietaryTags: ["vegetarian", "gluten-free"],
  },
  {
    name: "Espresso",
    description: "A classic double shot, locally roasted.",
    ingredients: ["Espresso"],
    dietaryTags: ["vegan", "vegetarian", "gluten-free"],
  },
  {
    name: "Oat Milk Latte",
    description: "Espresso steamed with oat milk.",
    ingredients: ["Espresso", "Oat milk"],
    dietaryTags: ["vegan", "vegetarian"],
  },
  {
    name: "Sparkling Lime",
    description: "House-carbonated water with fresh lime, orange slices and mint.",
    ingredients: ["Sparkling water", "Fresh lime", "Orange slices", "Mint leaves"],
    dietaryTags: ["vegan", "vegetarian", "gluten-free"],
  },
  {
    name: "Dark Chocolate Lava Cake",
    description: "Warm dark chocolate cake with a molten center, served with vanilla ice cream and fresh raspberries.",
    ingredients: ["Dark chocolate", "Vanilla ice cream", "Raspberries", "Mint leaves"],
    dietaryTags: ["vegetarian"],
  },
];

async function run() {
  for (const u of updates) {
    const rows = await db
      .update(menuItems)
      .set({
        description: u.description,
        ingredients: u.ingredients,
        dietaryTags: u.dietaryTags,
        updatedAt: new Date(),
      })
      .where(eq(menuItems.name, u.name))
      .returning({ id: menuItems.id });
    console.log(`${rows.length ? "updated" : "NOT FOUND"}: ${u.name}`);
  }
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
