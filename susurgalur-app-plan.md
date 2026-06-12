# SusurGalur — Comprehensive App Plan
**A family tree app built for Malaysian Muslim culture**
**Benchmark: Ancestry.com · Last updated: June 2026**

---

## 1. Vision

Ancestry, MyHeritage and FamilySearch all assume a Western family model: surnames, Gregorian dates, church/civil records, "1st cousin once removed". None of them can tell a Malaysian that someone is their *Anak Sepupu*, that their Pak Lang is the 3rd child, or that a paternal uncle's son is a potential *waris asabah*.

**SusurGalur is a secure, Malaysian-first family tree app whose mission is a comeback for salasilah-keeping among Muslims and Malaysians** — making it normal again for a family to know its keturunan, and raising practical understanding of nasab (lineage in the Islamic sense: who you descend from, who your mahram are, who your waris and wali are). The tree is the database; the kinship engine is the product; trust and security are the licence to operate.

Mission in three commitments:
1. **Preserve** — capture salasilah, names, voices and documents before the older generation is gone.
2. **Educate** — every interaction teaches a kinship term, a nasab rule, or a faraid concept in passing.
3. **Protect** — family data is amanah; security is a feature users can see, not a checkbox.

**One-line pitch:** *"Tahu nama moyang kau? App ni tahu apa kau patut panggil semua orang kat kenduri."*

---

## 2. Target Users

| Segment | Need | Role in growth |
|---|---|---|
| **Family record-keeper** (40–65) | Preserve salasilah before elders pass | Content creator — builds the tree |
| **Young Malaysians** (16–30) | Identity, fun, "who am I at this kenduri" | Distribution — shares to social media |
| **Kenduri/Raya organisers** | Invite lists, who-is-who | Activation moments (Raya = peak season) |
| **Faraid/estate planners, ustaz** | Heir identification | Credibility + premium revenue |
| **Diaspora Malaysians** | Stay connected to kampung roots | International spread |

The two-sided dynamic matters: **elders supply data, youth supply distribution.** Every feature should serve at least one side.

---

## 3. Benchmark: What Ancestry Does (and what we adopt, adapt, or skip)

| Ancestry feature | SusurGalur decision |
|---|---|
| Tree builder (people, unions, events) | **Adopt** — core MVP |
| Record hints ("shaky leaf", 70B+ records) | **Adapt** — Malaysia has no public searchable JPN records; hints v1 = matches against *other users' trees*, not archives |
| DNA + ThruLines | **Skip for now** — no lab ops; revisit via partnership later |
| GEDCOM import/export | **Adopt** — day-one requirement (see §7) |
| Public/private trees, invite collaborators | **Adopt** — with Malaysian privacy defaults (living people hidden) |
| Memories: photos, stories, audio | **Adapt** — "Rakam Suara Nenek" voice-story recording is a flagship feature, not an extra |
| Mobile app + web | **Adopt** — web first, app later |
| Subscription model | **Adapt** — freemium, family-plan pricing (see §10) |

**What Ancestry cannot do that we will:** Malay kinship labels in both directions, gelaran, bin/binti name logic, hijri dates, faraid/wali views, polygamous unions handled respectfully, kenduri tools, Jawi.

---

## 4. Core Features by Phase

### MVP (Phase A) — "the tree that speaks Malay"
1. **Tree builder** — add people, marriages (incl. polygamous unions without hacks: a union is its own object with multiple concurrent spouses, status, and dates), parent-child edges with `basis` (biological / angkat / tiri / susuan).
2. **Kinship engine** — select any two people → formal label + colloquial *panggilan* in both directions (the Phase 1 §5.4 formula, with Phase 2's basis + line-path axes). This is the demo moment; make it one tap.
3. **Malay name model** — given name + bin/binti auto-derived from father; hereditary titles (Nik, Wan, Syed/Sharifah, Tengku…), conferred titles (Datuk, Tan Sri), religious titles (Haji/Hajjah) as separate fields.
4. **Gelaran system** — state presets, fully overridable per person; per-pair address override table ("Adik calls her Mak Ngah, but the Johor cousins say Mak Ude").
5. **GEDCOM import/export** (see §7) — so existing Ancestry/MyHeritage/FTM users can switch in.
6. **Privacy defaults** — living persons visible only to invited family; PDPA-compliant consent flow.

### Phase B — "the family joins"
7. Collaborative editing with roles (Tok Ketua = admin, members suggest edits).
8. **Voice & story capture** — record elders narrating; attach audio to people/events. Auto-transcribe (BM) later.
9. Photo/document vault per person (sijil nikah, old photos, surat tanah).
10. Hijri + Gregorian dual dates; events: kelahiran, akad nikah, kenduri, haji, kematian (with tarikh hijrah for arwah anniversaries).
11. Tree-match hints: "Another user's tree contains Hashim bin Abdullah, b. 1921 Kuala Pilah — same person?"
12. **Raya mode** — printable/shareable family chart for balik kampung, "who's who at this kenduri" quick lookup.

### Phase C — "the serious layer"
13. **Faraid view** — classify relatives into ashab al-furud / asabah / dhawil arham by line and gender, flag anak angkat (no nasab inheritance), link out to e-Faraid/syariah tools for actual share computation. Position as *educational*, not a fatwa.
14. **Wali nasab view** — ordered paternal-line wali list for a daughter's marriage.
15. Adat perpatih mode (Negeri Sembilan): suku/clan on the maternal line.
15b. **Nasab literacy layer** — bite-size education woven into the app: mahram indicator between any two people (with susuan handled), "why nasab matters in Islam" explainers, kinship-term-of-the-day, and a "tanya tentang nasab" reference section reviewed by an ustaz advisor. This is the "improve understanding of keturunan and nasab" mission made tangible.
16. Jawi name rendering; print-quality salasilah posters (A1 PDF for the kampung wall).
17. Mobile apps (wrap or rebuild once web product-market fit is proven).

---

## 5. Social & Gen-Z Features (the virality layer)

Design principle: **every emotional moment in the app must end with a beautiful, watermarked, share-sized artefact.** Vertical 9:16 for IG Stories/TikTok/Shorts, square 1:1 for feed, with the SusurGalur mark and a deep-link QR that opens "join your family's tree".

1. **"Apa Aku Panggil Dia?" card** — the kinship engine result rendered as a shareable card: two avatars, the arrow, "Kau panggil dia: *Mak Ngah Sepupu*". Funny, niche, extremely Malaysian. This is the TikTok hook.
2. **Tree Wrapped (Salasilah Wrapped)** — Spotify-Wrapped-style annual recap each Ramadan/Syawal: "Your family: 142 people, 5 generations, 12 states, oldest record 1898, 3 new babies this year." Auto-generated story sequence.
3. **Generation Depth flex card** — "I can trace 6 generations. Boleh lawan?" with an animated tree silhouette. Built-in challenge mechanic: tag a friend → they need the app to answer.
4. **Kenduri Cam / Raya group photo tagger** — upload the Raya group photo, tag faces to tree people; app overlays each person's relationship-to-you label on the photo. Instantly shareable, instantly understood.
5. **Voice reels** — 30-second cut of Nenek's recorded story with auto-captions and a vintage-photo background, exportable as a video for IG/YouTube. Emotional shares outperform funny ones for reach.
6. **"Sepupu Radar"** — when two users' trees connect, both get a "Kau ada 47 sepupu kau tak pernah jumpa" reveal card.
7. **Name origins card** — "You are the 4th Azlan in your lineage" / hereditary title lineage ("Wan line traced to 1880s Kelantan").
8. **Family quiz mode** — auto-generated quiz from the tree ("Siapa Pak Long sebelah ibu?") to play at kenduri; results shareable.
9. **Public figure/royal trees** (carefully sourced, public-domain) as explorable showcase content — search traffic magnet.

Mechanically: watermark + QR on everything, one-tap export to IG/TikTok/WhatsApp, and a referral loop — a tree only gets good when relatives join, so every share is an invite.

### 5b. Family-Connection Features (how people actually socialise now)

What the research says about current norms: younger users have moved away from public broadcasting towards **small, private, authentic spaces** — BeReal-style realness, walkie-talkie voice apps (TenTen), private-by-default accounts, photos over text. Gen Alpha ranks **family as #1 in life importance (71%)**, ahead of friends. And in Malaysia the real family network already exists: **the WhatsApp family group**. SusurGalur should not compete with WhatsApp — it should become the *memory and meaning layer* that feeds it.

1. **Ruang Keluarga (private family feed)** — a feed visible only to tree members. Not a public social network; the research is clear that intimacy beats reach. Posts auto-anchor to the tree (a photo posted about Nenek attaches to Nenek's profile forever — unlike WhatsApp where it drowns in 3 days).
2. **Voice-first interactions** — walkie-talkie style voice notes pinned to people and events (the TenTen pattern, but cross-generation). Elders prefer talking to typing anyway; this is the same mechanic as "Rakam Suara Nenek" made social.
3. **Soalan Minggu Ini (weekly family question)** — BeReal-style prompt, but for families: "Siapa masak rendang paling sedap?", "Cerita kenduri kahwin 1985?" Answers become permanent stories on the tree. Low effort, high emotional payoff, recurring reason to open the app.
4. **Hari Ini Dalam Keluarga** — birthday, anniversary and arwah-anniversary (hijri) reminders with a one-tap "hantar ucapan ke WhatsApp" button. Rides the existing WhatsApp norm instead of fighting it.
5. **Digest ke WhatsApp** — a weekly auto-summary card ("3 gambar baru, 1 cerita baru, hari lahir Pak Ngah Jumaat ini") shared into the family WhatsApp group by the admin — the app's pull mechanism living inside the family's existing habit.
6. **Kenduri module** — event page per kenduri: RSVP, who's-who chart, photo pool that auto-tags into the tree afterwards.
7. **Pengiktirafan (recognition)** — contributor badges: "Penjaga Salasilah" for the cousin who added 40 people, "Perakam Suara" for whoever interviews the elders. Gentle gamification aimed at preservation work, not streak anxiety.

---

## 6. Marketing Plan (go-viral strategy)

### Positioning
Not "genealogy software" (old, niche) — market it as **"the app that knows your whole kampung"**. Identity + humour + sentiment.

### Phase 0 — Pre-launch (build in public)
- Azlan documents the build on TikTok/X/LinkedIn ("I'm building the Malaysian Ancestry") — dev-log content performs well and recruits beta families.
- Seed 20–50 beta families, ideally large ones (>100 people) across different states — they stress-test gelaran presets *and* become case studies.
- Waitlist with referral position-jumping.

### Phase 1 — Launch hooks (organic-first)
- **Lead with the kinship engine as a free public tool**: a no-signup web page — "Dia anak sepupu kepada bapa aku. Aku panggil dia apa?" → instant answer → share card → "build your real tree" CTA. Free tools are the cheapest viral loop in existence.
- TikTok/IG content engine, 3 formats on rotation:
  1. *Comedy:* kinship quiz street interviews ("Anak kepada sepupu mak kau — panggil apa?" — everyone gets it wrong).
  2. *Sentiment:* voice-reel stories of grandparents ("Nenek cerita zaman Jepun").
  3. *Flex/challenge:* generation-depth duels between creators.
- Partner with 10–15 mid-tier Malay creators (family/comedy/history niches) rather than 1 mega-influencer — cheaper, more authentic, more formats tested.

### Phase 2 — Seasonal spikes (the calendar is the media plan)
- **Ramadan/Syawal:** Tree Wrapped + Raya mode + Kenduri Cam. Balik kampung is the single biggest data-entry *and* sharing moment of the year — everything ships before Ramadan.
- **Hari keluarga / school holidays:** family quiz mode pushes.
- **Awal Muharram / Maulidur Rasul:** heritage and nasab content angle.

### Phase 3 — Credibility & institutions
- Collab content with ustaz/asatizah on faraid & nasab (massive Malay-Muslim audiences, directly on-topic).
- Pitch to JAKIM-adjacent media, Berita Harian, Astro — "young engineer builds app to save Malay salasilah" is an easy human-interest story.
- Universiti/sekolah heritage projects; MARA/digital-economy grant angles (MDEC) for funding + PR.
- Mosque/kariah partnerships: a kariah-level family-mapping pilot.

### Metrics that matter
- K-factor of share cards (shares → installs per user), family activation (≥3 relatives joined within 14 days), trees reaching 50+ people, Ramadan retention spike, % of users who run the kinship calculator in session 1.

---

## 7. Import / Export (Ancestry files, GEDCOM, FTW)

### GEDCOM — the primary interchange (must-have, MVP)
- **Import GEDCOM 5.5.1** first: it's what Ancestry.com, MyHeritage and most tools export today. **Ancestry import path = user exports GEDCOM from Ancestry (Trees → Tree Settings → Export) and uploads the .ged** — there is no Ancestry API for tree export, so GEDCOM *is* the Ancestry import feature.
- **Import GEDCOM 7.0** as well: newer FamilySearch standard (UTF-8, cleaner spec, GEDZIP `.gdz` packages that bundle media). Parsing 7.0 is easier than 5.5.1; supporting both covers effectively everything.
- **Export both 5.5.1 and 7.0** — exporting is non-negotiable for trust ("your data is never locked in", a direct contrast to Ancestry complaints).
- Mapping plan for Malaysian fields: GEDCOM has no concept of gelaran, bin/binti, hijri dates, anak angkat basis, or polygamous-union nuance. Use custom tags (`_GELARAN`, `_BASIS`, `_HIJRI`, `_TITLE_HEREDITARY`) on export so a SusurGalur→SusurGalur round-trip is lossless; document them publicly. On import, parse `NSFX`/`_MILT`-style junk defensively and run a **bin/binti detector** on imported names to auto-split patronymics.
- Build with an existing parser library and a tolerance-first philosophy (real-world GEDCOMs are dirty); always import into a staging preview ("we found 312 people, 98 families, 14 issues") before committing.

### FTW / FTM upload (Family Tree Maker)
- `.ftw` is the **legacy binary format** of Family Tree Maker pre-2008; modern FTM uses `.ftm` (a SQLite-based container). Neither has a public spec; `.ftw` in particular is realistically not worth reverse-engineering.
- **Pragmatic approach, in order:**
  1. Accept `.ftw`/`.ftm` uploads in the UI so users don't bounce, but respond with a guided conversion flow: "Open in Family Tree Maker → File → Export → GEDCOM, then upload the .ged here." MacKiev (current FTM owner) ships a [file migration utility](https://support.mackiev.com/051362-Family-Tree-Maker-File-Migration-Utility) for old .ftw files.
  2. For users without FTM installed, point to third-party converters as a stopgap.
  3. **Later (Phase C):** server-side best-effort `.ftm` reader is feasible since modern .ftm is SQLite — open the container, read the tables, map to our model. Treat as experimental. `.ftw` stays conversion-only.
- Honest expectation to set in-app: GEDCOM is the lossless road; FTW is a detour through conversion.

---

## 8. Data Model (GEDCOM-compatible core + Malaysian extension layer)

```
Person:   id, given_name, patronymic{bin|binti, father_name}, hereditary_title,
          conferred_titles[], religious_titles[], gelaran{value, source: preset|manual},
          sex, living_flag, birth{date_greg, date_hijri, place}, death{...}, photos[], voice_notes[]

Union:    id, partners[] (supports concurrent spouses), type{nikah|civil|other},
          events[{akad, place, wali, status: active|cerai|kematian}]

ParentChildEdge: parent_id, child_id, basis{biological|angkat|tiri|susuan}

AddressOverride: (person_a, person_b) → custom panggilan   // "Abang Su" cases

KinshipResult (computed, never stored): formal_label, panggilan, direction,
          generation_gap, blood_distance, line_path, faraid_class
```

Design rules: every culturally specific field lives in an extension layer over a GEDCOM-shaped core, so import/export stays clean. Kinship labels are **always computed, never stored** — store only structure + overrides.

### 8b. Access Control & Tree Segregation (who sees what)

**The architecture question: separate databases per family?** No — the industry-standard answer (used by every serious multi-tenant product) is **one database, hard logical walls**. Every row carries a `tree_id`, and the database itself (Postgres Row-Level Security in Supabase) refuses to return rows from trees you don't belong to — enforced at the database layer, not in app code, so an app bug cannot leak another family's data. Two unconnected users can sit in the same database and be as invisible to each other as if they were on different servers. Physically separate databases would make cross-family connection (the whole point of §5 Sepupu Radar) nearly impossible, and is operationally unmanageable for thousands of families.

Think of it as one apartment building, not one shared hall: every family has its own locked unit; the building manager (RLS) checks your key at every door, every time.

**Membership roles (per tree):**

| Role | Malay name | Can do |
|---|---|---|
| Owner/admin | Penjaga | Everything: invite, approve, roles, bridges, delete |
| Editor | Penyunting | Add/edit people, photos, stories |
| Contributor | Penyumbang | Suggest edits — Penjaga approves (perfect for enthusiastic but error-prone relatives) |
| Viewer | Pemerhati | View only; living persons shown in reduced form |

Plus **profile claiming**: a user account can be verifiably linked to their own person-node in the tree, giving them control of their own photo, details and visibility — consent built in, PDPA-aligned.

**Connecting two trees (the bridge protocol):** trees stay sovereign; they never merge. When the same real person exists in two trees (typically a marriage joining Family A and Family B):

1. Either side proposes a link on that shared person (matched by name + birth + parents; internally, hashed signatures suggest candidate matches without exposing data first).
2. **Both tree Penjaga must approve** — two-key consent, nothing automatic.
3. The shared person becomes a *gateway*. Each side chooses a disclosure scope: **struktur sahaja** (names + structure only, default), **profil asas** (basic profiles), or **penuh** (full profiles). Living persons stay protected regardless of scope.
4. The kinship engine can then compute across the bridge — "you have 47 sepupu you've never met" — while photos, stories and documents stay home unless explicitly granted.
5. Either Penjaga can cut the bridge at any time; everything is audit-logged.

Two kampungs joined by a bridge with a gate on each end — each kampung keeps its own keys. This gives the network effect that makes the app spread, without ever creating one giant shared tree that nobody controls (the FamilySearch model, which trades ownership for connection — wrong trade for family data).

### 8c. Community Verification (Pengesahan Komuniti)

A tree is only as trustworthy as its weakest claim — and in Islam, falsely attributed nasab is a grave matter, so the app must distinguish *recorded* from *confirmed*. Every relationship edge (parent-child, marriage) carries a verification state, set by the family itself:

| Status | Meaning | Shown as |
|---|---|---|
| **Disahkan** | Confirmed by the community | Solid line + ✓ |
| **Belum disahkan** | Recorded by one person, awaiting confirmation | Dashed line |
| **Dipertikai** | A member has raised a dispute | Flagged to Penjaga only |

**How confirmation works:**
1. Any tree member can endorse a relationship ("Saya sahkan — Hashim memang ayah Ahmad").
2. Endorsements are **weighted by position, not volume**: confirmation from someone close to the relationship (the person themselves via a claimed profile, their sibling, child, or spouse) counts more than a distant cousin's. A practical default: confirmed when **2+ well-positioned members** endorse, or 1 endorsement + an attached document (sijil nikah, surat beranak, kad pengenalan arwah).
3. Evidence attachments live on the edge itself, so the *reason* a link is trusted survives the people who knew it.

**Disputes — handled with adab:**
- A dispute on a parentage edge goes **privately to the Penjaga**, never displayed publicly — no family shaming, especially on sensitive edges (anak angkat, anak tiri, polygamous lines).
- Penjaga opens a private discussion thread with the involved members; resolution (corrected, confirmed, or left unresolved) is audit-logged.
- The app's standing disclaimer applies: verification status is the *family's collective record*, not a syariah or legal ruling on nasab.

**Cross-tree claims:** any relationship crossing a bridge (§8b) starts as Belum disahkan and requires at least one endorsement **from each side** before it can show as Disahkan — both families must agree they're related, symmetrical with the two-key bridge consent.

**Why this also helps growth:** dashed lines are a built-in activation loop. A new member's first natural act is confirming the links they personally know — instant contribution, zero effort, and the tree visibly strengthens as more family join.

**Identity context — the data that makes verification possible.** "Sahkan: Hashim bin Awang" is unanswerable; "Sahkan: Hashim bin Awang, lahir ~1925, Kampung Parit Jawa, Muar — penoreh getah, meninggal 1989" is recognisable. Each person carries an identity-context layer:

| Field | Notes |
|---|---|
| Date of birth | Full date, year only, or **era estimate** ("sekitar 1920-an", "zaman Jepun") — old kampung records are vague and the app must accept that honestly rather than force fake precision |
| Places by life stage | Born in / grew up in / settled in / buried at — village-level (kampung, mukim, daerah). Older generations are *identified by place* ("Hashim Parit Jawa" vs "Hashim Sungai Mati") |
| Historical anecdotes | Short free-text memories: occupation, nickname, what they were known for ("jual sate depan masjid", "Tok Imam surau lama"). These are the recognition triggers for elderly verifiers — and they double as the story content of §5b |
| Death info | Date (hijri + Gregorian) and burial place — grave location is itself verifiable evidence |

These fields serve three systems at once: (1) **human verification** — the endorsement screen shows the full identity card, not just a name; (2) **automatic consistency checks** — the app flags impossible or improbable claims before they're even put to the community (child born before parent, mother under ~13 or over ~60 at child's birth, person dying before a child's birth, marriage placing two people in incompatible places/eras). Flags are warnings, not blocks — the family decides; (3) **bridge matching** (§8b) — name + birth era + kampung is the fingerprint that suggests two trees hold the same person, with anecdotes as the human tiebreaker.

The anecdote field deserves emphasis: for people born before ~1950 there is often **no paper record at all** — anecdotal memory is the *only* evidence that exists, and it dies with the rememberer. Capturing it is both the verification mechanism and the app's preservation mission in one.

### 8d. Deletion Protection (no one can quietly erase a relationship)

A salasilah's worst failure mode isn't a wrong entry — it's a *silent disappearance*: one angry or careless relative deleting a marriage or a parent-child link, and nobody noticing until the rememberer has passed. Deletion is therefore treated as the most dangerous operation in the system:

1. **Nothing is ever hard-deleted.** A "delete" is a soft delete: the record is hidden but kept, fully restorable. Genealogy data has no true delete — only *retract*.
2. **Deletion delay (tempoh bertenang).** A deletion request on any relationship or person enters a **30-day quarantine**: the item is visibly marked "dalam proses pemadaman" but still shown, and every tree member is notified. Anyone can object during the window, which freezes the request for Penjaga review. No instant disappearances, ever.
3. **Quorum matching the claim's strength.** Deleting must be at least as hard as confirming was:
   - *Belum disahkan* edge → requester + Penjaga approval, then the 30-day delay.
   - *Disahkan* edge or any person with descendants → **3+ approvals** including at least one well-positioned member (same weighting as §8c) *and* the Penjaga, then the delay.
   - A lone Penjaga can never erase a verified relationship by themselves — power is real but bounded.
4. **Notify the affected.** Members whose own lineage passes through the edge (descendants of that link, claimed profiles on either end) are notified individually, not just via a feed.
5. **Audit + tombstone.** Who requested, who approved, who objected, and why — kept forever. A deleted edge leaves a tombstone visible to Penjaga so history can't be rewritten invisibly.
6. **Exception — privacy takedowns:** a living person removing *their own* data (PDPA right) bypasses quorum but still soft-deletes, with Penjaga notified.

(The current prototype deletes instantly with a confirm dialog — acceptable for a single-user file on your own machine; this protection layer arrives with accounts in Stage 2, where it belongs.)

---

## 9. Tech Stack (kept honest for where you are as a builder)

- **Web app first.** One codebase, instant updates, shareable links (critical for the viral loop — every share card links straight into the browser, no install wall).
- Suggested: **Next.js + Supabase (Postgres + auth + storage)** — the stack with the most tutorials and AI-assistance coverage, which matters for vibe coding. Postgres recursive queries handle ancestor/descendant traversal fine at family scale.
- Tree rendering: start with an off-the-shelf library (family-chart / react-flow) — do not hand-build tree layout first.
- Kinship engine as a **pure, separately-testable function** (structure in → labels out) with a big unit-test table built from the Phase 1/2 scenario matrices. This is the crown jewel; test it like one.
- GEDCOM: use an existing open-source parser, wrap it, never write one from scratch.
- Share cards: server-rendered images (e.g. satori/og-image pattern) — also a well-trodden path.
- **Build order sanity check:** kinship engine (pure function) → tree CRUD → tree view → share card → GEDCOM import. Resist starting with the social features; they're worthless without a tree underneath.

## 10. Security, Privacy, Sensitivity, Monetisation

**Security is core product, not plumbing** — a salasilah holds exactly the data scammers use for identity verification (mother's maiden name, birthplaces, full family networks). Concrete commitments:

- Trees are **private by default and invitation-only**; no public search of living people, ever. Public sharing is opt-in per artefact (share card), never per tree.
- **No IC/MyKad numbers stored in v1 at all** — removes the most dangerous data class entirely.
- Encryption in transit and at rest; voice notes and documents in private storage buckets with signed, expiring URLs.
- Role-based access (admin/editor/viewer) per tree; full audit log of who changed and viewed what — families can see it ("siapa tengok salasilah kita").
- Account security: email/passkey login, 2FA for tree admins; deep-link invites expire and are single-family scoped.
- Data ownership: one-tap full GEDCOM + media export, true account/tree deletion. "Your family's data is amanah — we are custodians, not owners" stated plainly in the product.
- **PDPA compliance**; living people private by default, visible only to invited family; children's data guarded.
- Sensitive-label handling: never display *anak tiri/anak angkat/anak luar nikah* prominently — store basis factually, render neutrally ("anak"), reveal detail only in legal views to authorised roles. Phase 1 H3 concern, confirmed.
- Faraid/wali views carry a standing disclaimer: educational reference, consult a syariah officer. No fatwa liability.
- **Monetisation (freemium):** free = one tree, 100 people, share cards (watermarked — the watermark IS the marketing). Premium family plan (priced per family, not per user — culturally right and increases activation): unlimited people, voice vault, poster-quality PDF export, faraid/wali views, GEDCOM bulk tools. Later: printed salasilah posters/books (physical product margin), kenduri pack.

## 10b. Sign-Up, Billing & Breach Prevention (decided 11 June 2026)

### Sign-up — fewer doors, stronger doors

Supabase Auth (already in our stack) handles all of this — no separate login system to build.

- **v1 providers: Google + email (magic link / OTP code).** Google covers nearly every Malaysian smartphone user; email OTP covers everyone else without a password to forget or for us to leak. No passwords stored = a whole class of breach removed.
- **Apple Sign-In** added the day we ship an iOS app (Apple makes it mandatory then anyway).
- **No Facebook, no Instagram, no TikTok login.** Instagram isn't an identity provider; Facebook login adds Meta data-sharing questions that clash head-on with our "amanah" trust message, and every extra provider is extra attack surface and maintenance. The brand says "we guard your salasilah" — logging in through Meta undercuts that.
- **Phase B: phone/WhatsApp OTP** for elder relatives with no email (Mak Cik joins from a WhatsApp invite link, verifies with the number she already has). Costs per-SMS, so not v1.
- Already in plan, still stands: passkeys, 2FA for tree admins, expiring single-family invite links.

### Charging — annual, per family, local rails

- **Lead with an annual family plan, not monthly.** Fits the per-family pricing decision (§10), fits the Raya/kenduri yearly rhythm, and neatly sidesteps Malaysia's recurring-payment problem: Stripe's FPX support is **one-off only — FPX doesn't work with Stripe Billing/subscriptions** ([Stripe docs](https://docs.stripe.com/payments/fpx)). An annual plan IS a one-off payment, so FPX works fine.
- **v1 gateway: Stripe Malaysia** — cards (auto-renew via Stripe Billing) + FPX (annual one-off) + checkout hosted by Stripe, so card data never touches our servers (PCI burden stays theirs). We store only a Stripe customer ID.
- **If monthly plans are ever needed:** [Curlec (Razorpay)](https://curlec.com/subscriptions/) does true local recurring — FPX Direct Debit e-mandates and DuitNow AutoDebit, Bank Negara-regulated. Swap-in or add-on later; don't build for it now.
- **Web-first checkout = no app-store cut.** If native apps come later, digital subscriptions sold *inside* the app must use Apple/Google in-app purchase (15–30% cut) — another reason to keep the web app primary and let mobile apps deep-link to web checkout where rules allow.

### Breach prevention — what "security is the product" means in practice

Legal floor first: the **PDPA amendments in force since 1 June 2025** make breach notification mandatory — notify the Commissioner within **72 hours** if a breach risks significant harm, notify affected users within **7 days** after that; "significant harm" explicitly includes data combinations enabling identity fraud (exactly what a salasilah is). Fines up to **RM1,000,000** ([DLA Piper](https://privacymatters.dlapiper.com/2025/03/malaysia-guidelines-issued-on-data-breach-notification-and-data-protection-officer-appointment/), [One Asia Lawyers](https://oneasia.legal/en/6322)). So:

1. **Don't hold what you can't leak** — no IC numbers (decided), no passwords (OAuth/OTP only), no card numbers (Stripe-hosted), kinship labels computed not stored. The breach-impact of v1 is structurally small.
2. **Postgres RLS on every table, no exceptions** (decided §8b) — even if app code has a bug, the database refuses cross-family reads. Test RLS rules like the kinship engine: with a unit-test table.
3. **Supabase hardening switches on day 1:** leaked-password protection (HaveIBeenPwned check), captcha on sign-up, rate limiting on auth endpoints, signed expiring URLs for all media (decided §10).
4. **Audit log doubles as breach detection** — the "siapa tengok salasilah kita" feature (§10) is also our anomaly trail; alert on bulk reads/exports.
5. **Incident-response one-pager before launch:** who confirms a breach, the 72-hour Commissioner notice template, the 7-day user notice template. Written when calm, not during a crisis.
6. **Boring hygiene:** dependency vulnerability scanning (GitHub Dependabot, free), automated backups with a tested restore, separate staging/production keys, secrets never in code.

DPO note: mandatory DPO appointment applies above processing thresholds — not a v1 concern at family-beta scale, revisit at growth.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Kinship engine gives a wrong label → instant credibility loss | Massive test table; "report a label" button; per-family overrides |
| Gelaran presets offend regional accuracy | Always editable; crowdsource corrections in-app |
| Faraid feature attracts religious scrutiny | Educational framing, ustaz advisors, link to official tools |
| Family data = sensitive data breach | Minimal PII, no IC numbers at all in v1, encrypted storage |
| Viral spike before collaboration features ready | Gate: don't push marketing Phase 1 until invite flow is solid |
| Solo-builder scope creep | Phase A is 6 features. Ship it before touching Phase B. |

## 12. Suggested 12-Month Roadmap

1. **Months 1–3:** kinship engine + tests, tree CRUD, basic tree view. Private alpha with your own family.
2. **Months 4–5:** GEDCOM import/export, share-card v1 (kinship card), 20-family beta.
3. **Month 6:** public launch of the free kinship calculator page + waitlist.
4. **Months 7–9:** collaboration, voice capture, photo vault. Build-in-public content running throughout.
5. **Months 10–12:** Raya-season big push — Tree Wrapped, Raya mode, Kenduri Cam, creator partnerships timed to Ramadan.

---

## Sources
- [Ancestry 2025/2026 review & feature recap](https://www.ancestry.com/c/ancestry-blog/ancestry-news/rootstech-2026-and-2025-year-review) · [ThruLines](https://support.ancestry.com/s/article/AncestryDNA-ThruLines?language=en_US) · [AncestryDNA review 2026](https://knowyourdna.com/ancestry-kit-review/)
- [gedcom.io — official GEDCOM spec site](https://gedcom.io/about/)
- [FTM file migration utility (MacKiev)](https://support.mackiev.com/051362-Family-Tree-Maker-File-Migration-Utility) · [FTM GEDCOM export/import](https://support.mackiev.com/572636-Export-and-Import-of-GEDCOM-Files-in-Family-Tree-Maker) · [FTW→GED conversion discussion](https://www.wikitree.com/g2g/68434/convert-my-ftw-family-tree-maker-file-to-gedcom-format-for-me)
- [FamilySearch — Malaysia Civil Registration](https://www.familysearch.org/en/wiki/Malaysia_Civil_Registration) · [Galur.id (Indonesian comparator)](https://galur.id/) · [Wikipedia BM — Salasilah keluarga](https://ms.wikipedia.org/wiki/Salasilah_keluarga)
- Companion document: `malay-kinship-research-phase2.md` (faraid classes, gelaran variants, edge-case rulings)
