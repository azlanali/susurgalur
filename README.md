# SusurGalur

Pokok keluarga untuk keluarga Malaysia — sulit, selamat, faham budaya kita.
A Malaysian-first family tree app: revive salasilah-keeping, teach nasab, guard family data like amanah.

## Where everything is

| Path | What |
|---|---|
| `web/` | **The product** — Next.js 16 app: free kinship calculator, admin dashboard, health endpoint, Supabase schema with RLS. See `web/README.md` to run it. |
| `docs/ARCHITECTURE.md` | Production architecture — verified stack, scale maths for thousands of users, costs |
| `docs/OPERATIONS.md` | Monitoring dashboard (3 layers), the **Jaga** ops agent, launch checklist |
| `susurgalur-app-plan.md` | Product master plan — features, marketing, access control (§8b), verification (§8c), billing (§10b) |
| `malay-kinship-research-phase2.md` | Kinship research underpinning the engine |
| `kinship-engine/` | v0 prototype — `app.html` works fully offline; engine now canonical in `web/lib/` |
| `SESSION-STATUS.md` | Living status — read first when resuming work |
| `.github/workflows/` | CI (engine tests), uptime watch, ops-agent template |

## Quick start

```bash
cd web
npm install
npm test        # 31 kinship engine tests
npm run dev     # http://localhost:3000 — works without any backend configured
```

## Status (June 2026)
Prototype done and tested · production scaffold ready · next: GitHub repo → Supabase project → Vercel deploy (`docs/ARCHITECTURE.md` §6).
