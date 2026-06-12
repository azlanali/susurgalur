# SusurGalur — Session Status (11 June 2026, evening)
**Read this first when continuing the project.**

## What this project is
Secure, Malaysian-first family tree app for Muslims — mission: revive salasilah-keeping, improve understanding of keturunan & nasab. Benchmark: Ancestry.com. The kinship engine is the product; trust/security is the licence to operate.

## NEW (11 June, evening session) — production streamlining done
- **`docs/ARCHITECTURE.md`** — verified stack (Next.js 16.2.7 LTS, Supabase Pro 100k MAU, Vercel Pro, PostHog free tier replaces Sentry), scale maths for 10k users (8× headroom everywhere), cost table (~USD 45/mo at launch), repo layout, Stage 2 build order.
- **`docs/OPERATIONS.md`** — 3-layer monitoring dashboard (/admin + PostHog + platform dashboards), **Jaga ops agent** (3 stages: watch→diagnose→safe self-heal, Claude Agent SDK + GitHub Actions, never merges), launch checklist incl. PDPA gates.
- **`web/`** — the production Next.js scaffold, runnable now: `npm install && npm test && npm run dev`. Engine + avatars ported (canonical copies in `web/lib/`, 31/31 tests pass from new location), `/semak` calculator page (browser-side, the viral hook), `/admin` dashboard with `/api/admin/stats`, `/api/health` heartbeat, Supabase clients, **`supabase/migrations/0001_init.sql`** (full schema: trees/memberships/persons/edges/unions/audit + RLS walls + roles + soft-delete-only + creator-becomes-penjaga trigger).
- **`.github/workflows/`** — ci.yml (engine tests on push), health-watch.yml (15-min uptime → opens "incident" issue), ops-agent.yml (Jaga Stage 2 template, deactivated until configured).
- **`README.md`** (root) — front door / file map.
- All dependency versions verified live on npm (next 16.2.9 will install). **Rule: `web/lib/` is now the canonical engine; `kinship-engine/` is the frozen prototype.**

## Files in this folder
| File | What it is |
|---|---|
| `susurgalur-app-plan.md` | **The master plan** — features, marketing, import/export, data model, tech stack, §8b access control, §8c community verification, §8d deletion protection |
| `malay-kinship-research-phase2.md` | Phase 2 research — answers to all 10 open questions, faraid classes, gelaran variants |
| `../files/malay-kinship-research.md` | Phase 1 kinship research (original) |
| `kinship-engine/kinship.js` | **The crown jewel** — pure kinship engine, computes Malay labels both directions |
| `kinship-engine/kinship.test.js` | 26 tests from research scenarios — **all passing** (`node kinship.test.js`) |
| `kinship-engine/demo.html` | Two-person picker demo over sample 5-gen family |
| `kinship-engine/app.html` | **Working prototype** — full data-entry UI in BM |
| `kinship-engine/avatar.js` | Full-body SVG avatars — traditional Malay dress by gender + age band, deterministic colours per person, fully offline |
| `kinship-engine/avatar-preview.html` | Gallery page to eyeball avatars across ages/genders |

## What app.html can do (working, tested)
- **Marriage records (Rekod Perkahwinan card):** every union tracked separately with status Berkahwin/Bercerai/Pasangan meninggal + nikah/cerai years. Polygamy fully supported; warnings if man >4 concurrent wives or woman >1 concurrent husband (warn, never block). Engine: cerai → "Bekas suami/isteri" label, dissolves ipar/mertua/biras chains (children's nasab unaffected); kematian → labels kept; co-wives = "Madu". 31/31 tests passing.
- Add/edit/delete people: name, jantina, tahun lahir/meninggal, tempat asal, catatan (anecdotes), photo (camera/gallery → auto-shrunk 240px thumbnail)
- Parents (kandung/angkat/tiri), spouses (incl. polygamy), grouped by generation
- Kinship checker on your own data
- Excel/CSV **drag-drop import**; columns: Nama*, Jantina*, TahunLahir, NamaAyah, NamaIbu, Pasangan, Hubungan, TempatAsal, TahunMeninggal, Pendidikan, Bidang, Pakaian, OKU, Catatan (link by exact name); template download
- **Education fields (11 June):** Sekolah/Universiti + Bidang pengajian per person — form, import, 🎓 shown on card
- **Fun facts (11 June):** per-person child stats on each card (jumlah anak, L/P, sulung & bongsu by birth year) + family-wide "Fakta Menarik Keluarga" card (total ahli L/P, generasi, paling ramai anak, paling berusia/muda yang masih hidup, kiraan rekod pengajian); all computed live, nothing stored
- **Semak Pertalian stats (11 June):** kinship result now shows a side-by-side fact card per person (umur/hayat, generasi, tempat asal, pendidikan, bilangan adik-beradik/perkahwinan/anak) + pair comparison panel (beza umur, moyang sepunya terdekat via `Kinship._internal.nearestCommonAncestor` with generation depths, keturunan langsung case, sama tempat asal)
- **Avatars (11 June):** when no photo, cards show a full-body avatar in traditional dress — Baju Melayu/songkok/kain samping batik (L), Baju Kurung/tudung (P); girls <10 get hair + flower clip; elders get glasses/white beard/softened colours; middle-aged men a moustache. Live preview in add/edit form; avatars in kinship results too. `avatar.js` is a pure function (person → SVG string); no user text enters the SVG (id+name only hashed to a number) — XSS-safe, offline, deterministic. **3D-style shading (same day):** radial skin gradients, light-from-top-left shade overlays on clothing, songkok velvet sheen, soft blurred ground shadow — still pure SVG, zero cost. Note: ImageMagick can't render `stop-opacity` (goes black) — preview with a browser or librsvg/sharp. **Avatar v0.3 (same day): attire + OKU variants** — per-person `attire` (niqab for women 13+, jubah for men) and `oku` (kerusi roda = seated front-view wheelchair; penglihatan = dark glasses + white cane with red band; tongkat = wooden cane with curved handle). Chosen per person in the form (Gaya pakaian avatar + OKU selects; attire options follow jantina), never assigned randomly — these reflect real people. Import columns Pakaian (niqab/purdah/jubah) + OKU (kerusi roda/penglihatan/buta/tongkat); validated enums only, sex-checked in cleanPerson. **v0.4 colour variants:** `jubahputih` (white jubah, warm white #f2eee2) + `niqabhitam` (black niqab + full black abaya; charcoal tones so 3D shading still reads, fold lines lifted grey, skirt dots dimmed); import accepts "jubah putih" / "niqab hitam" / "purdah hitam" / "abaya". **`web/lib/avatar.js` synced to v0.4** (31/31 web tests pass)
- **Tempat asal berstruktur (12 June, plan §8e slice):** kampung (free text) + Daerah/Negeri dropdowns (embedded official list: 16 negeri/WP, ~140 daerah) + optional GPS "Guna lokasi semasa" (rounded 3 dp ≈ 100 m — village-level only, Malaysia bounds enforced, OSM map link). Matching normalised (Kg./Kampung/kampong → same), kinship compare uses samePlace(), fun fact "Tempat asal paling ramai", import/template columns Daerah + Negeri (canonical negeri spelling enforced with warning), legacy free-text place values still work
- Consistency warnings: death<birth, parent <12yrs older than child
- Security: formula-injection + XSS stripped (cleanText/esc/cleanPerson), hardened JSON restore, files never executed
- localStorage autosave + JSON backup/restore

## Key decisions (don't relitigate)
1. Kinship labels **computed, never stored**; engine = pure tested function
2. Gelaran = editable state presets — no national standard exists
3. Parent-child edges carry `basis`: biological/angkat/tiri/susuan (angkat = address terms yes, faraid/wali no)
4. Import: GEDCOM 5.5.1 + 7.0 (Ancestry import = its GEDCOM export); .ftw = guided conversion only; modern .ftm = SQLite, possible Phase C reader
5. **One database, RLS walls per tree** — NOT separate DBs; bridge protocol (two-key admin consent, disclosure scopes) connects trees
6. Roles: Penjaga/Penyunting/Penyumbang/Pemerhati + profile claiming
7. Verification: Disahkan/Belum disahkan/Dipertikai; endorsements weighted by position; disputes private to Penjaga
8. Deletion: soft-delete only, 30-day quarantine, 3+ approvals for verified edges, tombstones + audit
9. No IC numbers stored v1; living people private by default; PDPA
10. Path: prototype (done) → **Stage 2: Next.js + Supabase web app** → Capacitor wrap for stores later. Web-first because share links = viral loop
11. Marketing: free no-signup kinship calculator as viral hook; share cards (Apa Aku Panggil Dia, Tree Wrapped, Kenduri Cam); everything ships before Ramadan; WhatsApp digest rides existing family-group habit
12. **Kampung network (11 June, plan §8e):** whole-kampung salasilah = endgame of §8b bridges. `Tempat` entity (canonical kampung + mukim/daerah/negeri + village-centre lat/lng) replaces free-text tempat asal in Stage 2 schema; seeded from GeoNames/OSM gazetteer, typeahead picker; missing kampung = user pin-drop (Belum disahkan) → Disahkan when 3+ unrelated trees attach it; optional GPS "Sahkan kampung anda" check-in as a Raya balik-kampung moment. Privacy: village granularity only, kampung pages list opted-in families (never people), no public family directory. Share card: Peta Asal Keluarga.
13. **Sign-up & billing (11 June, plan §10b):** login = Google + email OTP only via Supabase Auth (no Facebook/Insta — trust clash + attack surface; Apple added with iOS app; WhatsApp OTP Phase B). Billing = annual per-family plan through Stripe Malaysia (cards auto-renew; FPX as one-off annual — Stripe FPX can't do recurring). Curlec is the fallback if monthly subs ever needed. Card data never touches our DB. PDPA breach rules (live since 1 June 2025): 72h Commissioner notice / 7-day user notice / up to RM1M fines — incident-response one-pager required before launch.

## Next steps (in order)
1. **Azlan: test app.html with real family data** — kinship labels need real-world validation
2. ~~Stage 2 kickoff: Next.js project; port engine~~ ✅ done — `web/` scaffold ready
3. **Push to GitHub → create Supabase project → `supabase db push` → connect Vercel** (~30 min, steps in `web/README.md`)
4. Then: auth (Google + email OTP), tree CRUD in Postgres, invite flow, roles
5. Later: GEDCOM import, share cards, verification UI, gelaran presets

## Engine v0.1 known limits (fine for now)
- Panggilan (address terms) basic; gelaran system not yet implemented
- Affinal coverage: spouse/mertua/menantu/ipar/biras/besan + generic married-in; deeper chains collapse by design
- No Jawi, no hijri dates yet (Phase B/C)
