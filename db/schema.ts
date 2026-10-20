import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// ---------- enums ----------

export const categoryEnum = pgEnum("category", [
  "breakfast",
  "lunch",
  "dinner",
  "drinks",
  "desserts",
]);

// ---------- menu items ----------

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // stored in cents, format on display
  category: categoryEnum("category").notNull(),
  ingredients: text("ingredients").array().notNull().default([]),
  // 'vegetarian' | 'vegan' | 'spicy' | 'gluten-free' — set manually in admin, never derived
  dietaryTags: text("dietary_tags").array().notNull().default([]),
  imageUrl: text("image_url"),
  available: boolean("available").notNull().default(true), // lets admin "86" an item without deleting it
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- gallery ----------

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ---------- reservations ----------

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  partySize: integer("party_size").notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
