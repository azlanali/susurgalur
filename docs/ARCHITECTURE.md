# SusurGalur — Production Architecture
**Goal: a stack that comfortably serves thousands of users on launch day, run by one person.**
Verified against live pricing/limits, 11 June 2026.

---

## 1. The shape of the system

```
User's browser
   │
   ├── Next.js web app (Vercel CDN + serverless)
   │     ├── Kinship engine runs IN THE BROWSER (lib/kinship.js)
   │     ├── Share cards rendered at the edge, cached
   │     └── /api/* routes for anything needing secrets
   │
   ├── Supabase (one project)
   │     ├── Postgres + Row-Level Security  ← the walls between families
   │     ├── Auth (Google + email OTP)
   │     └── Storage (photos, voice notes — signed expiring URLs)
   │
   ├── Stripe Malaysia (checkout hosted by Stripe — card data never ours)
   │
   └── Observability: PostHog (analytics + errors) · /admin dashboard · Jaga ops agent
```

**The single most important scale decision is already made and it's free:** the kinship engine is a pure function that runs in the user's browser. The viral-hook page (free calculator) costs us almost nothing per user — it's a static page on a CDN. A TikTok spike of 100,000 visitors hits Vercel's cache, not our database.

---

## 2. Verified stack (June 2026)

| Layer | Choice | Version/plan checked | Verdict |
|---|---|---|---|
| Framework | **Next.js** | 16.2.7 LTS (current, June 2026) | Available, LTS — pin to 16.2.x |
| Hosting | **Vercel** | Hobby free → **Pro $20/mo at launch** | Hobby bans commercial use — upgrade before charging anyone. Pro: 1 TB transfer/mo |
| Backend | **Supabase** | Free → **Pro $25/mo at launch** | Free: 50k MAU, 500 MB DB (beta is fine). Pro: 100k MAU, 8 GB DB, 100 GB storage, backups |
| Analytics + errors | **PostHog** | Free tier: 1M events, 100k errors, 5k replays/mo | One tool instead of two — skip Sentry for v1 (its free tier is 5k errors/1 user; PostHog's error tracking is 20× more generous) |
| Payments | **Stripe Malaysia** | Cards recurring + FPX one-off annual | Confirmed earlier (§10b of app plan); Curlec only if monthly ever needed |
| Ops agent | **Claude Agent SDK + GitHub Actions** | Metered separately from 15 June 2026; Pro plan includes $20/mo Agent SDK credit | Available — see OPERATIONS.md |

No gaps. Every layer exists, is maintained, and has a free tier for beta plus a paid tier that covers thousands of users without re-architecture.

## 3. Will it hold thousands of users? (the honest maths)

Design envelope: **10,000 registered users, 1,000 trees, average 150 people per tree.**

| Resource | Load at envelope | Limit (Pro tiers) | Headroom |
|---|---|---|---|
| Postgres rows | ~150k persons + ~400k edges/unions ≈ **<1 GB** | 8 GB disk | ~8× |
| Monthly active users | 10k (all of them, worst case) | 100k MAU | 10× |
| Photos/voice storage | ~45k photos ≈ **~25 GB** (originals capped 2 MB, thumbs ~30 KB) | 100 GB | 4× |
| Page traffic | Viral spike → static pages on CDN | 1 TB transfer/mo | Effectively unbounded for static |
| Kinship computations | Client-side | User's phone | Free forever |

Postgres handles millions of rows without noticing; a family tree is *small data*. The things that actually break apps at this scale are listed below — each has a rule.

### Performance rules (build these in from day one)

1. **Every table carries `tree_id`, every query filters on it, every `tree_id` column is indexed.** RLS policies then cost almost nothing.
2. **Recursive ancestor queries are capped** (e.g. 12 generations) so a malformed tree can't loop the database.
3. **Engine stays in the browser.** The server never computes kinship labels. Tree data for one family (~150 people ≈ 100 KB JSON) loads once, the engine works locally.
4. **Images resized client-side before upload** (the prototype already does 240 px thumbnails — keep that pattern; originals capped at 2 MB).
5. **Share cards are generated at the edge and cached immutably** — one render per card, not per view.
6. **Rate limiting on auth and invite endpoints** (Supabase built-in auth rate limits + captcha on sign-up, already decided §10b).
7. **No Realtime subscriptions in v1** — polling/refresh is fine for a family tree; removes a whole class of connection limits.

### What changes at 50k+ users (not now — just so it's written down)
Supabase compute upgrade (~$10–60/mo), read replicas if reports get heavy, move share-card render cache to R2/storage. No re-architecture — the RLS multi-tenant design (§8b of app plan) is exactly what these platforms scale.

---

## 4. Running cost by stage

| Stage | Monthly cost | Notes |
|---|---|---|
| Beta (now → ~20 families) | **RM 0** | Supabase Free + Vercel Hobby (non-commercial beta) + PostHog Free |
| Launch (charging users) | **~USD 45 (~RM 210)** | Vercel Pro $20 + Supabase Pro $25; domain ~$12/yr |
| 10k users | **~USD 60–90** | + compute credits/egress as usage grows |
| Ops agent | $0–20 | Covered by Claude Pro plan's Agent SDK credit |

Revenue check: at RM 60–80/year per family plan, ~50 paying families cover the entire launch infrastructure. The cost structure cannot bankrupt you.

---

## 5. Repository layout (the streamlined shape)

```
SusurGalur/                     ← becomes the git repo
├── README.md                   ← front door: what is where, how to run
├── SESSION-STATUS.md            ← living status doc
├── docs/
│   ├── ARCHITECTURE.md          ← this file
│   └── OPERATIONS.md            ← dashboard + monitoring + Jaga agent
├── susurgalur-app-plan.md       ← product master plan (features, marketing, §8 access control)
├── malay-kinship-research-phase2.md
├── kinship-engine/              ← v0 prototype (stays as reference; app.html still works offline)
├── web/                         ← THE PRODUCT — Next.js app (see web/README.md)
│   ├── app/                     ← pages: / (landing+calculator), /semak, /admin, /api/health, /api/admin/stats
│   ├── lib/                     ← kinship.js + avatar.js (canonical copies now live here) + supabase clients
│   ├── supabase/migrations/     ← 0001_init.sql — schema + RLS, ready for `supabase db push`
│   └── tests/                   ← engine tests (npm test)
└── .github/workflows/           ← ci.yml (tests on push) + health-watch.yml + ops-agent.yml
```

**Rule from today: `web/lib/` is the canonical engine.** The `kinship-engine/` folder is the frozen prototype — fix bugs in `web/lib/` first, back-port only if you still use app.html.

---

## 6. Stage 2 build order (unchanged from plan §9, now with scaffold done)

1. ~~Scaffold Next.js + port engine~~ ✅ done (this session)
2. Create GitHub repo, push; create Supabase project; `supabase db push` the migration; connect Vercel
3. Auth (Google + email OTP) + tree CRUD against Postgres
4. Invite flow + roles (Penjaga/Penyunting/Penyumbang/Pemerhati)
5. Tree view (family-chart / react-flow) — do not hand-build layout
6. Share card v1 + free calculator public page → beta families
7. GEDCOM import, verification UI, gelaran presets — after beta feedback
