"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../AdminHeader";

type GalleryImage = {
  id: number;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
};

// Demo mode — same pattern as the menu items admin page: writes live only
// in this browser's localStorage. The real API's write routes are blocked
// server-side too, so the live gallery can't be touched from here.
const STORAGE_KEY = "ahadu_demo_gallery_images";

const emptyForm = { imageUrl: "", caption: "", sortOrder: "0" };

let nextTempId = -1;

function loadOverlay(): GalleryImage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GalleryImage[]) : null;
  } catch {
    return null;
  }
}

function saveOverlay(images: GalleryImage[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch {
    // ignore
  }
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const overlay = loadOverlay();
      if (overlay) {
        setImages(overlay);
        setLoading(false);
        return;
      }
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      const real = (data.images ?? []) as GalleryImage[];
      setImages(real);
      saveOverlay(real);
      setLoading(false);
    }
    load();
  }, []);

  function persist(next: GalleryImage[]) {
    const sorted = [...next].sort((a, b) => a.sortOrder - b.sortOrder);
    setImages(sorted);
    saveOverlay(sorted);
  }

  function startEdit(img: GalleryImage) {
    setEditingId(img.id);
    setFormError(null);
    setForm({
      imageUrl: img.imageUrl,
      caption: img.caption ?? "",
      sortOrder: String(img.sortOrder),
    });
  }

  function resetForm() {
    setEditingId(null);
    setFormError(null);
    setForm(emptyForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.imageUrl.trim()) {
      setFormError("Image URL is required.");
      return;
    }

    const payload = {
      imageUrl: form.imageUrl.trim(),
      caption: form.caption.trim() || null,
      sortOrder: Number(form.sortOrder) || 0,
    };

    if (editingId) {
      persist(
        images.map((img) => (img.id === editingId ? { ...img, ...payload } : img))
      );
    } else {
      persist([...images, { id: nextTempId--, ...payload }]);
    }

    resetForm();
  }

  function handleDelete(id: number) {
    if (!confirm("Remove this image? (Only from your browser's demo copy.)")) return;
    persist(images.filter((img) => img.id !== id));
  }

  function handleResetDemo() {
    if (!confirm("Reset back to the real gallery? This clears anything you've changed.")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setLoading(true);
    fetch("/api/admin/gallery")
      .then((res) => res.json())
      .then((data) => {
        const real = (data.images ?? []) as GalleryImage[];
        setImages(real);
        saveOverlay(real);
      })
      .finally(() => setLoading(false));
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <AdminHeader current="gallery" />

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <button
          onClick={handleResetDemo}
          className="text-xs text-muted-foreground underline shrink-0 mt-2"
        >
          Reset to real gallery
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Demo mode — saved only in your browser. Nothing here touches the live
        gallery, even via the API directly.
      </p>

      <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-8 space-y-3">
        <h2 className="font-medium">{editingId ? "Edit image" : "Add image"}</h2>

        <input
          placeholder="Image URL"
          required
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          className="w-full border rounded-md p-2"
        />
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt=""
            className="h-28 w-auto rounded-md border object-cover"
          />
        )}
        <input
          placeholder="Caption (optional)"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          className="w-full border rounded-md p-2"
        />
        <input
          type="number"
          placeholder="Sort order"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
          className="w-full border rounded-md p-2"
        />

        {formError && <p className="text-sm text-red-800">{formError}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-foreground text-background rounded-md px-4 py-2 text-sm font-medium"
          >
            {editingId ? "Save changes" : "Add image"}
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
        <div className="grid sm:grid-cols-2 gap-3">
          {images.map((img) => (
            <div key={img.id} className="border rounded-md p-3 flex gap-3 items-center">
              <img
                src={img.imageUrl}
                alt=""
                className="h-16 w-16 object-cover rounded-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{img.caption || "—"}</div>
                <div className="text-xs text-muted-foreground">
                  sort: {img.sortOrder}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(img)} className="text-sm underline">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="text-sm text-red-800 underline"
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
