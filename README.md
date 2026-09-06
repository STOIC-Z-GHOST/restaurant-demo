# Restaurant/Cafe Demo — build notes

Sibling portfolio piece to EcoFurnish. Mostly frontend; menu admin CRUD is the
one real, persisting backend piece.

## What's here

- `db/schema.ts` — full schema for `pnpm db:push`: `menu_items`, `gallery_images`, `reservations`
- `db/index.ts` — Drizzle client (Neon HTTP driver, same pattern as EcoFurnish)
- `db/seed.ts` — repeatable seed script (`pnpm db:seed`), full seed menu + gallery
- `drizzle.config.ts` — config for `db:push`
- `lib/ingredient-info.ts` — static ingredient-detail lookup (not DB-backed by design — see scoping notes). Pre-written for every seed ingredient; fallback text only shows for ingredients not yet added here.
- `app/menu/page.tsx` — public menu grouped by category, dietary tag chips
- `app/menu/[id]/page.tsx` + `IngredientDetailClient.tsx` — item detail with clickable ingredients → modal
- `app/gallery/page.tsx` — public gallery
- `app/reservations/page.tsx` + `app/api/reservations/route.ts` — reservation form, saves to DB, shows confirmation. No notification wiring (matches scope).
- `app/admin/menu-items/page.tsx` — admin CRUD UI (add/edit/delete, toggle availability) —
  **demo mode**: writes live only in this browser's `localStorage`, never the real DB (see below)
- `app/admin/gallery/page.tsx` — same demo-mode CRUD pattern, for gallery images
- `app/admin/reservations/page.tsx` — real, read-only list of submitted reservations
- `app/api/admin/menu-items/route.ts` + `[id]/route.ts` — `GET` is real; `POST`/`PATCH`/`DELETE`
  are stubbed to always 403 (demo mode, see below)
- `app/api/admin/gallery/route.ts` + `[id]/route.ts` — same pattern as menu items
- `app/api/admin/reservations/route.ts` — real `GET` only, no mutation routes
- `middleware.ts` + `lib/admin-auth.ts` — signed-cookie session gate protecting
  everything under `/admin` and `/api/admin`
- `app/admin/login/page.tsx` + `app/api/admin/login|logout/route.ts` — password login
- `lib/reservation-config.ts` — capacity model (seats per time slot) used by both the
  public booking API and the admin reservations view
- `lib/rate-limit.ts` — basic in-memory rate limit for the public reservation endpoint

## Demo mode — why menu/gallery admin writes don't persist

This is a portfolio demo, not a real restaurant's backend, and it's meant to be
poked at by anyone reviewing it. So the admin panel is real to use (login, add,
edit, delete, toggle availability) but **structurally cannot touch the shared
data**:

- The menu-items and gallery admin pages keep their own copy of the data in
  `localStorage` and only ever read the real API (`GET`) once, on first load.
  Every add/edit/delete updates that local copy.
- The real `POST`/`PATCH`/`DELETE` routes for menu items and gallery images are
  hard-blocked server-side (return `403`) regardless of who calls them — this
  isn't just a UI convention, so calling the API directly (curl, Postman, a
  bypassed login) still can't write to Postgres.
- Reservations are the one real, persisted piece — the admin reservations view
  is read-only (no edit/delete), so there's nothing to accidentally break there.

Each demo admin page has a "Reset to real data" button that clears its
`localStorage` copy and re-syncs from the real seed data.

## Reservation capacity + spam protection

- `lib/reservation-config.ts` defines `SLOT_MINUTES` (30) and `MAX_SEATS_PER_SLOT`
  (40) — the reservation API sums party sizes already booked in the same
  30-minute window and rejects new bookings that would push it over capacity.
  Adjust both constants to match a real dining room if this ever seats real guests.
- The public reservation form has a hidden honeypot field (`_hp`) — bots that
  autofill every input tend to fill it in, and the API silently pretends to
  succeed rather than tipping them off.
- The reservation API also has a basic in-memory per-IP rate limit
  (`lib/rate-limit.ts`). This is a real limitation, not just a formality: it
  resets on cold start and isn't shared across concurrent function instances,
  so treat it as a deterrent against casual spam, not a guarantee. Swap in
  Upstash Redis (or Vercel KV) with the same function signature if this needs
  to hold up for real.

## Design tokens

`app/globals.css` defines the palette as CSS variables, mapped into Tailwind
via `tailwind.config.js` (`bg-background`, `text-foreground-strong`, `border-line`,
etc.) — every page uses these now instead of repeated hex literals, so a palette
change is a one-file edit:

| Token | Value | Used for |
|---|---|---|
| `background` | `#120e0a` | page background (warm near-black, not pure black) |
| `muted` | `#1c150f` | cards, modals, elevated panels |
| `foreground` | `#e8e2d6` | body text |
| `foreground-strong` | `#f1e9d8` | headings, emphasis |
| `secondary` | `#d8cbb0` | softer supporting text |
| `muted-foreground` | `#96876f` | labels, captions |
| `accent` | `#c9a66b` | gold — links, prices, borders |
| `line` / `line-strong` | `#2a2116` / `#3d3223` | hairline borders, hover states |
| `--glass-bg` / `--glass-border` | rgba tokens | frosted panel treatment (see below) |

`Diamond.tsx` and `SectionDivider.tsx` (`app/components/`) are the small gold
diamond and the rule–diamond–rule divider — the same flourish from the
`AHADU` logo, pulled out so it's reused consistently instead of one-off.

## Category banner images — sizing & the "glass" fix

The category banner (`app/menu/page.tsx`) is `aspect-[3/1]` with `max-h-80`
(320px). Below ~960px viewport width it renders as a true 3:1 strip; past that
the height holds at 320px and the visible slice just gets wider (up to
roughly 6:1 on a very wide monitor) since `object-cover` always fills the box.

**For cropping source photos:** export at roughly **1800×600px (3:1)** and
keep the subject centered in the middle ~60% of the frame, both ways. That
gives enough margin that the subject stays in frame whether the browser is
showing the full 3:1 image or the narrower slice that appears on wide screens.

The category title now sits on a frosted glass plate (`--glass-bg` +
`--glass-border` + blur) instead of a flat low-opacity box — this was a
deliberate fix: the old box was tuned by eye and read fine on the darker
categories (dinner, drinks) but was nearly invisible on the deliberately
brighter breakfast/lunch photos. The glass plate's contrast doesn't depend on
what's behind it, so it holds up the same way regardless of the photo.



- Cart/checkout, payment integration, customer accounts — EcoFurnish already proves these
- Reservation notifications (email/SMS) — DB-only for this demo

## Scaffold (added after the first pass — was missing initially)

`app/page.tsx` (root homepage — its absence caused a 404 at `/` on the first
Vercel deploy), `app/layout.tsx`, `app/globals.css`, `tailwind.config.js`,
`postcss.config.js`, `tsconfig.json`, `next.config.js`, and a full
`package.json` (with `dev`/`build`/`start` scripts, not just `db:push`/`db:seed`).

## To wire up before deploy

1. Set `ADMIN_PASSWORD` (any string) — this is the password for `/admin/login`
   and also signs the session cookie. Required, or the admin gate throws.
2. Set `DATABASE_URL` (Neon Postgres connection string) — locally in `.env.local`,
   and in Vercel's project environment variables for the deployed site.
3. `pnpm install`, then `pnpm db:push` to create tables, then `pnpm db:seed` to seed.
4. `pnpm dev` to test locally before pushing to GitHub/Vercel.
5. Add real image files under `public/images/menu/` and `public/images/gallery/`
   matching the paths in `db/seed.ts`, or swap the `imageUrl` values.

If this ever becomes a real restaurant's site instead of a portfolio demo:
remove the demo-mode blocks in the menu-items/gallery API routes, wire real
`requireAdmin()` auth in place of (or alongside) the password gate, swap the
rate limiter for Upstash Redis, and consider redacting guest contact info in
the reservations view before sharing admin access with anyone but yourself.
