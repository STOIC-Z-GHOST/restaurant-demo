export type IngredientInfo = {
  description: string;
  origin?: string; // e.g. "Locally sourced", "Imported"
  allergen?: string; // display-only note — never used for dietary-tag logic
};

// Real, hand-written entries for every ingredient used in the seed menu.
// This map is intentionally NOT auto-generated — if you add a new menu item
// with a new ingredient name, add its entry here too. The fallback below
// exists for real-world use (an owner adding a dish before filling in every
// field) — it should never be what a demo visitor actually sees.
export const ingredientInfo: Record<string, IngredientInfo> = {
  "Salmon": {
    description: "Wild-caught, pan-seared to order.",
    origin: "Sourced from a local fishery",
  },
  "Lemon butter": {
    description: "House-made sauce, finished with fresh lemon and herbs.",
    allergen: "Contains dairy",
  },
  "Seasonal vegetables": {
    description: "Rotates weekly based on what's fresh at market.",
    origin: "Locally sourced",
  },
  "Sourdough bread": {
    description: "Baked fresh daily on-site using a 3-year-old starter.",
    allergen: "Contains gluten",
  },
  "Avocado": {
    description: "Ripened in-house, mashed to order with lime and sea salt.",
  },
  "Poached egg": {
    description: "Free-range eggs, poached to order.",
    allergen: "Contains egg",
  },
  "Chili flakes": {
    description: "House chili blend, adjustable on request.",
  },
  "Feta": {
    description: "Crumbled sheep's-milk feta.",
    origin: "Imported",
    allergen: "Contains dairy",
  },
  "Espresso": {
    description: "Single-origin beans, roasted locally and pulled to order.",
    origin: "Locally roasted",
  },
  "Oat milk": {
    description: "House-standard plant milk, steamed to order.",
  },
  "Basil pesto": {
    description: "Made in-house weekly with basil, pine nuts, and parmesan.",
    allergen: "Contains nuts, dairy",
  },
  "Parmesan": {
    description: "Aged 24 months, shaved to order.",
    origin: "Imported",
    allergen: "Contains dairy",
  },
  "Penne pasta": {
    description: "Dried durum wheat pasta.",
    allergen: "Contains gluten",
  },
  "Grilled chicken": {
    description: "Free-range chicken breast, marinated and grilled to order.",
  },
  "Mixed greens": {
    description: "A rotating blend of leafy greens from the weekly produce order.",
    origin: "Locally sourced",
  },
  "Balsamic glaze": {
    description: "Reduced in-house from aged balsamic vinegar.",
  },
  "Ribeye steak": {
    description: "Dry-aged 21 days, grilled to temperature.",
    origin: "Locally sourced",
  },
  "Roasted potatoes": {
    description: "Tossed in herb oil and roasted until crisp.",
  },
  "Red wine jus": {
    description: "Reduced from house red wine and pan drippings.",
  },
  "Mushroom risotto": {
    description: "Arborio rice, slow-cooked with a wild mushroom blend.",
    allergen: "Contains dairy",
  },
  "Truffle oil": {
    description: "A light finishing drizzle, added tableside.",
  },
  "Dark chocolate": {
    description: "70% single-origin dark chocolate.",
    allergen: "May contain traces of milk",
  },
  "Vanilla ice cream": {
    description: "Churned in-house with Madagascar vanilla.",
    allergen: "Contains dairy, egg",
  },
  "Mint leaves": {
    description: "Fresh-picked for garnish.",
  },
  "Sparkling water": {
    description: "House-carbonated filtered water.",
  },
  "Fresh lime": {
    description: "Hand-squeezed to order.",
  },
  "Fried egg": {
    description: "Free-range eggs, fried to order with a soft, runny yolk.",
    allergen: "Contains egg",
  },
  "Chives": {
    description: "Snipped fresh over the top just before serving.",
  },
  "Greek yogurt": {
    description: "Thick, strained yogurt with a mild tang.",
    allergen: "Contains dairy",
  },
  "Mixed berries": {
    description: "Raspberries, blackberries and blueberries, rinsed and served fresh.",
  },
  "Granola": {
    description: "Toasted oat clusters for crunch.",
    allergen: "Contains gluten; may contain nuts",
  },
  "Boiled egg": {
    description: "Cooked until just set, then halved.",
    allergen: "Contains egg",
  },
  "Crumbled cheese": {
    description: "Soft, creamy white cheese crumbled over the greens.",
    allergen: "Contains dairy",
  },
  "Cucumber": {
    description: "Sliced crisp and cool.",
  },
  "Cherry tomatoes": {
    description: "Red and yellow cherry tomatoes, halved.",
  },
  "Croutons": {
    description: "Cubed bread, toasted golden and seasoned.",
    allergen: "Contains gluten",
  },
  "Balsamic vinaigrette": {
    description: "Balsamic vinegar and olive oil, whisked with herbs.",
  },
  "Pine nuts": {
    description: "Lightly toasted and scattered over the pasta.",
    allergen: "Contains pine nuts",
  },
  "Asparagus": {
    description: "Roasted until tender with a little bite left.",
  },
  "Green peas": {
    description: "Sweet, bright and cooked just briefly.",
  },
  "Baby potatoes": {
    description: "Small new potatoes, cooked until tender.",
  },
  "Lemon": {
    description: "Zest and a squeeze of juice to finish the plate.",
  },
  "Rosemary butter": {
    description: "Butter with fresh rosemary, melted over the steak as it rests.",
    allergen: "Contains dairy",
  },
  "Roasted garlic": {
    description: "Slow-roasted until soft and sweet.",
  },
  "Arborio rice": {
    description: "Short-grain rice that turns creamy as it is slowly stirred.",
  },
  "Wild mushrooms": {
    description: "A blend of chanterelle and other wild mushrooms.",
  },
  "Orange slices": {
    description: "Fresh slices to garnish and add a touch of sweetness.",
  },
  "Raspberries": {
    description: "Fresh and served alongside the cake.",
  },
  "Butternut squash": {
    description: "Diced and roasted until caramelized at the edges.",
  },
  "Apple": {
    description: "Crisp apple, sliced thin and fanned over the salad.",
  },
  "Dried cranberries": {
    description: "Tart-sweet cranberries scattered through the greens.",
  },
  "Pecans": {
    description: "Roughly chopped for a buttery crunch.",
    allergen: "Contains tree nuts",
  },
  "Bacon": {
    description: "Crisped and crumbled over the top.",
    allergen: "Contains pork",
  },
};

export function getIngredientInfo(name: string): IngredientInfo {
  return (
    ingredientInfo[name] ?? {
      description: "Details for this ingredient haven't been added yet — ask your server for more information.",
    }
  );
}
