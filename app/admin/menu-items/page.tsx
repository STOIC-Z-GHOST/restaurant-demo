"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../AdminHeader";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  dietaryTags: string[];
  imageUrl: string | null;
  available: boolean;
};

const CATEGORIES = ["breakfast", "lunch", "dinner", "drinks", "desserts"];
const DIETARY_TAGS = ["vegetarian", "vegan", "spicy", "gluten-free"];

// Demo mode: everything here lives in localStorage, never on the server.
// The real /api/admin/menu-items POST/PATCH/DELETE routes are blocked
// server-side too (see those files), so this is belt-and-suspenders —
// nobody can touch the shared menu no matter what they do in this UI
// or by calling the API directly.
const STORAGE_KEY = "ahadu_demo_menu_items";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "breakfast",
  ingredients: "",
  dietaryTags: [] as string[],
  imageUrl: "",
  available: true,
};

let nextTempId = -1; // negative ids so demo additions never collide with real ones

function loadOverlay(): MenuItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MenuItem[]) : null;
  } catch {
    return null;
  }
}

function saveOverlay(items: MenuItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore (e.g. private-browsing storage limits)
  }
}

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const overlay = loadOverlay();
      if (overlay) {
        setItems(overlay);
        setLoading(false);
        return;
      }
      const res = await fetch("/api/admin/menu-items");
      const data = await res.json();
      const real = (data.items ?? []) as MenuItem[];
      setItems(real);
      saveOverlay(real);
      setLoading(false);
    }
    load();
  }, []);

  function persist(next: MenuItem[]) {
    setItems(next);
    saveOverlay(next);
  }

  function startEdit(item: MenuItem) {
    setEditingId(item.id);
    setFormError(null);
    setForm({
      name: item.name,
      description: item.description,
      price: (item.price / 100).toString(),
      category: item.category,
      ingredients: item.ingredients.join(", "),
      dietaryTags: item.dietaryTags,
      imageUrl: item.imageUrl ?? "",
      available: item.available,
    });
  }

  function resetForm() {
    setEditingId(null);
    setFormError(null);
    setForm(emptyForm);
  }

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      dietaryTags: f.dietaryTags.includes(tag)
        ? f.dietaryTags.filter((t) => t !== tag)
        : [...f.dietaryTags, tag],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.description.trim()) {
      setFormError("Name and description are required.");
      return;
    }
    if (!CATEGORIES.includes(form.category)) {
      setFormError("Pick a valid category.");
      return;
    }
    const price = Math.round(parseFloat(form.price) * 100);
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Enter a valid, non-negative price.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category,
      ingredients: form.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      dietaryTags: form.dietaryTags,
      imageUrl: form.imageUrl.trim() || null,
      available: form.available,
    };

    if (editingId) {
      persist(
        items.map((it) => (it.id === editingId ? { ...it, ...payload } : it))
      );
    } else {
      const newItem: MenuItem = { id: nextTempId--, ...payload };
      persist([newItem, ...items]);
    }

    resetForm();
  }

  function handleDelete(id: number) {
    if (
      !confirm(
        "Remove this item? (Only from your browser's demo copy — nothing real is deleted.)"
      )
    )
      return;
    persist(items.filter((it) => it.id !== id));
  }

  function handleResetDemo() {
    if (
      !confirm(
        "Reset back to the real menu? This clears anything you've changed in this browser."
      )
    )
      return;
    window.localStorage.removeItem(STORAGE_KEY);
    setLoading(true);
    fetch("/api/admin/menu-items")
      .then((res) => res.json())
      .then((data) => {
        const real = (data.items ?? []) as MenuItem[];
        setItems(real);
        saveOverlay(real);
      })
      .finally(() => setLoading(false));
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <AdminHeader current="menu-items" />

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl font-semibold">Menu Items</h1>
        <button
          onClick={handleResetDemo}
          className="text-xs text-muted-foreground underline shrink-0 mt-2"
        >
          Reset to real menu
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Demo mode — everything below is saved only in your browser
        (localStorage). Nothing here ever touches the live database, even if
        you call the API directly.
      </p>

      <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-8 space-y-3">
        <h2 className="font-medium">{editingId ? "Edit item" : "Add new item"}</h2>

        <div className="grid sm:grid-cols-2 gap-3">
          <input
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded-md p-2"
          />
          <input
            placeholder="Price (e.g. 12.00)"
            type="number"
            step="0.01"
            min="0"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border rounded-md p-2"
          />
        </div>

        <textarea
          placeholder="Description"
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-md p-2"
          rows={2}
        />

        <input
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="w-full border rounded-md p-2"
        />
        {form.imageUrl && (
          // plain <img>, not next/image — demo image URLs can come from
          // any host, and this preview never needs to be perf-optimized
          <img
            src={form.imageUrl}
            alt=""
            className="h-24 w-auto rounded-md border object-cover"
          />
        )}

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border rounded-md p-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          placeholder="Ingredients (comma-separated)"
          value={form.ingredients}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          className="w-full border rounded-md p-2"
        />

        <div className="flex gap-3 flex-wrap">
          {DIETARY_TAGS.map((tag) => (
            <label key={tag} className="text-sm flex items-center gap-1">
              <input
                type="checkbox"
                checked={form.dietaryTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              {tag}
            </label>
          ))}
        </div>

        <label className="text-sm flex items-center gap-1">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
          />
          Available on menu
        </label>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-foreground text-background rounded-md px-4 py-2 text-sm font-medium"
          >
            {editingId ? "Save changes" : "Add item"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-muted-foreground underline"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-md p-3 flex justify-between items-center gap-4"
            >
              <div>
                <div className="font-medium flex items-center gap-2">
                  {item.name}
                  {!item.available && (
                    <span className="text-xs text-muted-foreground">(hidden)</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.category} · ${(item.price / 100).toFixed(2)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(item)} className="text-sm underline">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
