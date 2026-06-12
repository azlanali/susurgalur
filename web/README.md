# SusurGalur web app

Next.js 16 + Supabase. The kinship engine (`lib/kinship.js`) is the same tested
module as the prototype — 31/31 tests — and runs in the browser, so the free
calculator costs nothing per visitor.

## Run locally (no backend needed)

```bash
npm install
npm test       # engine tests — must say 31 passed
npm run dev    # http://localhost:3000
```

Pages that work immediately: `/` (landing), `/semak` (kinship calculator with
avatars), `/admin` (dashboard, demo numbers), `/api/health`.

## Connect the backend (Stage 2 step 2 — ~30 minutes)

1. **GitHub**: create a private repo, push this whole SusurGalur folder.
2. **Supabase**: create a project (free tier) → install the [Supabase CLI](https://supabase.com/docs/guides/cli) →
   `supabase link --project-ref <ref>` → `supabase db push` (applies
   `supabase/migrations/0001_init.sql`: tables + RLS walls + roles).
3. **Vercel**: import the GitHub repo, set root directory to `web/`,
   add the env vars from `.env.example`.
4. GitHub repo → Settings → Variables → add `HEALTH_URL` so the uptime
   watcher (`.github/workflows/health-watch.yml`) starts guarding it.

After that: `/api/health` shows `"db":"ok"` and `/admin` shows real counts.

## What's deliberately NOT here yet (build order, ARCHITECTURE.md §6)

Auth (Google + email OTP), tree CRUD UI, invite flow, tree view, share cards,
GEDCOM import. The schema is ready for all of it; build in that order.

## Folder map

```
app/            pages + API routes (App Router)
  semak/        free kinship calculator — the viral hook
  admin/        product dashboard (Layer 1, OPERATIONS.md)
  api/health    heartbeat for monitoring + Jaga
  api/admin/stats  aggregate counts (token-gated until auth lands)
lib/            kinship.js + avatar.js (canonical) + supabase clients
supabase/       migrations — schema + RLS
tests/          engine test suite (npm test)
```
