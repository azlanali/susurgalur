# SusurGalur — Operations: Dashboard, Monitoring & the Jaga Agent
**How one person runs an app with thousands of users without being on call 24/7.**
Last updated: 11 June 2026.

---

## 1. The three-layer dashboard

You don't build one giant dashboard — you wire together three layers, two of which already exist.

### Layer 1 — `/admin` (built into the app — scaffolded)
Your product dashboard, at `web/app/admin/`. Only emails listed in the `ADMIN_EMAILS` env var can open it. Shows what *no external tool can know* — numbers straight from your own database:

| Metric | Why it matters |
|---|---|
| Sign-ups today / 7 days / total | Growth pulse |
| Trees created · median tree size · trees ≥ 50 people | Real engagement (a 3-person tree is a bounce; a 50-person tree is a family) |
| **Family activation**: trees with ≥3 members joined within 14 days | The #1 metric from the app plan §6 |
| Invites sent → accepted (K-factor proxy) | Is the viral loop working |
| Calculator runs → sign-up conversion | Is the hook converting |
| Storage used per tree · biggest trees | Cost watch + abuse watch |

The scaffold ships with the page and a `/api/admin/stats` route that returns live counts once Supabase is connected (and clearly labelled demo numbers until then).

### Layer 2 — PostHog (free tier: 1M events, 100k errors, 5k session replays/mo)
One snippet in the app layout gives you: page analytics, funnels (calculator → sign-up → invite), session replays for debugging confused users, **and error tracking** — so you don't need Sentry in v1. Set up two alerts: error spike, and sign-up funnel drop.

### Layer 3 — the platforms you already pay for
- **Supabase dashboard**: DB size, slow queries, auth attempts, advisories (it literally tells you if an RLS policy is missing).
- **Vercel dashboard**: deploys, function errors, p95 latency, bandwidth.
Nothing to build here — just know these exist and check them weekly.

### Uptime (external heartbeat)
`/api/health` (scaffolded) returns app + DB status. A GitHub Actions cron (`health-watch.yml`, included) pings it every 15 minutes and opens a GitHub issue + emails you when it fails twice in a row. Free, no third-party service needed (UptimeRobot free tier is an optional extra).

---

## 2. "Jaga" — the ops agent that monitors and fixes

Named for its job: *menjaga* the app. Built on the **Claude Agent SDK** (TypeScript/Python, GitHub Actions integration via `claude-code-action`). From 15 June 2026 Agent SDK usage is metered separately and a Claude Pro plan includes **$20/mo of Agent SDK credit** — enough for this workload.

Build it in three stages. Each stage is useful alone; don't build stage 3 first.

### Stage 1 — Watch & report (launch week)
A scheduled GitHub Action (every 15–30 min):
1. Curl `/api/health` — app up? DB reachable?
2. Query PostHog API — error count last 30 min vs baseline
3. If something's wrong → **open a GitHub issue with the evidence** + send Telegram message (reuse the Telethon pattern from the farm project — you already know this stack)

No AI needed yet. This is `health-watch.yml`, included in the scaffold.

### Stage 2 — Diagnose & propose (weeks after launch)
When a GitHub issue is labelled `incident` (by Stage 1 or by you), `ops-agent.yml` triggers a Claude Agent SDK run that:
1. Reads the issue, pulls the matching PostHog error details + stack trace
2. Reads the repo, `git log` since last good deploy, finds the likely cause
3. Writes a diagnosis comment: *what broke, when, which commit, suggested fix*
4. If confident, **opens a pull request** with the fix + a test that reproduces the bug

**Hard rule: the agent never merges.** You review every PR on your phone, one tap to approve. This matches your existing safety rules — nothing ships without you.

### Stage 3 — Safe self-healing (only after Stage 2 has earned trust)
A small allowlist of *reversible* actions the agent may take alone, each one audit-logged and reported after the fact:
- Re-deploy last known-good build (Vercel API rollback)
- Re-run a failed scheduled job
- Temporarily tighten a rate limit during an abuse spike
Never on the allowlist: anything touching the production database, user data, secrets, or billing.

### Guardrails (all three stages)
- Agent runs in GitHub Actions with **read-only** tokens for PostHog/Vercel/Supabase status APIs; repo write limited to branches + issues + PRs
- No production DB credentials in any agent environment, ever
- Every run posts a summary — silence is never assumed to be success
- Costs capped: Agent SDK credit + GitHub Actions free minutes; a runaway loop hits the cap, not your card

---

## 3. Launch checklist (the gates — don't launch with any box unticked)

**Security & compliance**
- [ ] RLS policies have their own test file (try to read another family's tree — must fail)
- [ ] Supabase hardening on: leaked-password protection, captcha, auth rate limits
- [ ] Signed expiring URLs on all media buckets verified
- [ ] **PDPA incident one-pager written** (72 h Commissioner notice / 7-day user notice templates — required since 1 June 2025, fines to RM1M)
- [ ] Dependabot enabled; secrets in env vars only; separate staging/production Supabase projects

**Reliability**
- [ ] Supabase Pro (enables backups) + a restore actually tested once
- [ ] `health-watch.yml` live and alerting to Telegram
- [ ] Load smoke test: 500 concurrent users on the calculator page + 50 concurrent sign-ups (k6, one afternoon)

**Business**
- [ ] Vercel Pro upgrade (Hobby prohibits commercial use — this is a licence issue, not a performance one)
- [ ] Stripe live keys + test purchase + refund tested
- [ ] PostHog funnels + the two alerts configured
- [ ] `/admin` reachable only by `ADMIN_EMAILS` (verified from a non-admin account)

---

## 4. The weekly 20-minute ops routine
Monday with kopi: `/admin` growth numbers → PostHog top errors (file issues for Jaga) → Supabase advisories tab → Vercel bandwidth. Done. Everything urgent finds *you* via Telegram — you never need to watch dashboards live.
