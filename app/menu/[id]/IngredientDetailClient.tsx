"use client";

import { useEffect, useState } from "react";
import { getIngredientInfo } from "@/lib/ingredient-info";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  dietaryTags: string[];
  imageUrl: string | null;
};

function tagLabel(tag: string) {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

export default function IngredientDetailClient({ item }: { item: MenuItem }) {
  const [selected, setSelected] = useState<string | null>(null);
  const info = selected ? getIngredientInfo(selected) : null;

  // Escape closes the ingredient panel
  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div>
      <div className="flex justify-between items-baseline gap-6">
        <h1 className="font-serif text-3xl sm:text-4xl tracking-wide text-foreground-strong">
          {item.name}
        </h1>
        <span className="font-serif text-2xl text-accent whitespace-nowrap">
          ${(item.price / 100).toFixed(2)}
        </span>
      </div>

      <p className="font-body text-base text-secondary mt-4 leading-relaxed">
        {item.description}
      </p>

      {item.dietaryTags.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-5">
          {item.dietaryTags.map((tag) => (
            <span
              key={tag}
              className="font-body text-xs px-2.5 py-0.5 rounded-full border border-line-strong text-muted-foreground bg-surface"
            >
              {tagLabel(tag)}
            </span>
          ))}
        </div>
      )}

      <h2 className="font-serif text-2xl tracking-wide text-foreground-strong mt-12">
        Ingredients
      </h2>
      <p className="font-body text-sm text-muted-foreground mt-1 mb-4">
        Select an ingredient to learn more about it.
      </p>
      <ul className="flex flex-wrap gap-2">
        {item.ingredients.map((ing) => (
          <li key={ing}>
            <button
              onClick={() => setSelected(ing)}
              className="font-body text-sm px-4 py-2 rounded-full border border-line-strong bg-surface text-secondary hover:border-accent hover:text-foreground-strong transition-colors"
            >
              {ing}
            </button>
          </li>
        ))}
      </ul>

      {selected && info && (
        <div
          className="fixed inset-0 bg-[#120e0a]/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected}
            className="bg-surface border border-line-strong rounded-sm p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(18,14,10,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl tracking-wide text-foreground-strong">
              {selected}
            </h3>
            <p className="font-body text-[15px] text-secondary mt-3 leading-relaxed">
              {info.description}
            </p>
            {info.origin && (
              <p className="font-body text-sm text-accent mt-4">{info.origin}</p>
            )}
            {info.allergen && (
              <p className="font-body text-sm mt-2 text-secondary">{info.allergen}</p>
            )}
            <button
              autoFocus
              onClick={() => setSelected(null)}
              className="mt-6 font-body text-sm px-5 py-2 rounded-full border border-line-strong text-secondary hover:border-accent hover:text-foreground-strong transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
