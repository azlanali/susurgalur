# Malay Kinship & Susur Galur — Phase 2 Research
**Project:** SusurGalur App (Malaysian Muslim Family Tree)
**Status:** Phase 2 — Deep Research & Open Question Resolution
**Last Updated:** June 2026
**Builds on:** `malay-kinship-research.md` (Phase 1)

---

## 1. Answers to the Phase 1 Open Questions

Each answer is tagged with a confidence level: ✅ verified, 🟡 strong consensus but unstandardised, 🔴 needs ethnographic validation.

### Q1. Directional asymmetry by age (same distance) — 🟡
Yes, but only at Gap=0. Among siblings and sepupu, the older party is addressed as Abang/Kakak (often with name or gelaran) and the younger as Adik or by name. The *formal label* (sepupu) does not change — only the *address term*. The app therefore needs two output fields per relationship: **label** (formal, symmetric within a generation) and **panggilan** (address term, asymmetric by relative age).

### Q2. Maternal vs paternal side distinction — 🟡
Standard Malaysian Malay does **not** formally distinguish parallel vs cross cousins — both are sepupu. Side matters in three places only: (a) faraid, where agnatic (sebelah bapa) line determines asabah status; (b) wali nasab for marriage (paternal male line only); (c) adat perpatih in Negeri Sembilan, where the maternal line (suku) carries clan membership and customary land. **App rule:** always store which parent links the relationship; surface it only in faraid/wali/adat views.

### Q3. Gelaran regional database — ✅ (that it varies), 🔴 (complete state mapping)
Confirmed: there is **no single national standard**. Live examples found:
- One widely-shared sequence: Along, Angah, **Uda (3rd)**, Alang (4th), Ateh, Anjang, Atam, Andak, Acik, Usu — conflicts with the DBP-style order in Phase 1 (where Uda is 8th).
- Perak: Uda commonly 3rd; historical Pandak (male) / Andak (female); Alang strongly associated with 4th.
- Kelantan: eldest daughter often "Kak Nik"; Nik/Wan/Che prefixes interact with gelaran.
- Sarawak Malay: Pakwo, Pakjang, Udak, Makmok variants.
Only **Along (1st)** and **Busu/Usu (last)** are reliable anchors nationally.
**App rule:** ship gelaran as *editable presets* — offer a default sequence plus state presets, but every gelaran must be manually overridable per person. Never hard-compute gelaran from birth order alone.

### Q4. In-law + blood compounding — 🟡
There is no productive formal term for "spouse's cousin's child". Affinal chains beyond ipar/biras/mertua/menantu collapse immediately to generation-based address (Pakcik/Makcik/Abang/Kakak). **App rule:** affinal track only computes: mertua, menantu, ipar (with abang/kakak/adik prefix), biras, besan (the two sets of parents-in-law to each other — missing from Phase 1, add it). Everything further collapses to generation address.

### Q5. Adopted child (anak angkat) — ✅ for law, 🟡 for address
Socially, an anak angkat usually receives full kinship address through the adoptive tree (calls adoptive parents' siblings Pakcik/Makcik etc.). Legally under Islamic law: adoption does **not** create nasab — the child keeps the biological father's bin/binti, does not become mahram, and does **not inherit under faraid** (provision only via hibah or wasiat, max 1/3 of estate without heirs' consent). **App rule:** store `relationship_basis: biological | angkat | tiri | susuan` on every parent-child edge. Kinship labels propagate normally; faraid and wali calculations exclude angkat lines automatically. Also add **susuan** (milk kinship) — creates mahram status but no inheritance; genealogically significant for Muslims and absent from Phase 1.

### Q6. Half-sibling terms — ✅
Yes, distinct terms exist: **saudara/adik-beradik seibu** (same mother) and **sebapa** (same father). This is not cosmetic — faraid gives different shares to full (kandung), consanguine (sebapa), and uterine (seibu) siblings. *Anak tiri* (stepchild, no blood) is a separate category entirely. **App rule:** half-siblings are derived automatically from shared-parent analysis; never ask the user to declare "half-sibling" manually.

### Q7. Biras depth — 🟡
Biras = two people whose spouses are siblings. It does not extend further (my sibling's spouse's sibling is not biras — no term; collapses to name/generation address). Add **besan**: my child's spouse's parents. Both are dead-end terms — they do not compound.

### Q8. Cousins marry — 🟡
When two sepupu marry, blood term and affinal term coexist; in address, the **affinal term takes precedence where it confers seniority** (a sepupu who marries your abang becomes Kakak ipar in address), but blood relationship remains for faraid. **App rule:** store both edges; display blood label as primary in the tree, affinal label as secondary chip; let the user pin which one shows.

### Q9. Honorific override — 🟡
Inside the family, kinship address normally survives honorifics (a Pakcik who becomes Datuk is still Pak Lang to nephews). Formal/written contexts stack: "Datuk (Pakcik) Ahmad". Hereditary/royal prefixes (Nik, Wan, Raja, Tengku, Syed/Sharifah, Megat, Che) are part of the *name*, not the kinship term, and matter for lineage tracking (e.g. Syed/Sharifah marks claimed descent from the Prophet's family — directly relevant to a susur galur app). **App rule:** separate fields — `hereditary_title`, `conferred_title` (Tan Sri/Datuk/Datin), `religious_title` (Haji/Hajjah), never mixed into the kinship engine.

### Q10. Generational compression — 🟡
Formally the kinship term follows generation, not age (a 5-year-old Pak Su is still Pakcik to a 20-year-old grandchild). In practice families negotiate (name-based or abang/kakak address). **App rule:** compute the formal term; allow per-pair address override. This override table ("in this family, X calls Y 'Abang Su'") is a feature no Western app has and is high cultural value.

---

## 2. Faraid Classification (verified structure)

Three heir categories, confirmed against Malaysian syariah references:

1. **Ashab al-furud** (fixed shares: 1/2, 1/3, 1/4, 2/3, 1/6, 1/8): spouse, mother, father, grandmother/grandfather (in some positions), daughters, granddaughters (son's daughters), sisters (full/consanguine/uterine in defined cases).
2. **Asabah** (residuary): sons and the agnatic male line — including **anak lelaki bapa saudara sebelah bapa** (paternal uncle's son, i.e. the male paternal-line sepupu). So a first cousin *can* be a real heir — but only the male, paternal-parallel one. This is why the app must track line-of-connection, not just "sepupu".
3. **Dhawil arham** (uterine kin): inherit only when the first two classes are absent — includes maternal-line cousins, sister's children, mother's siblings' lines, etc.

Key rulings for the app:
- **Anak angkat:** no faraid share; hibah/wasiat only (≤1/3 without consent of heirs).
- **Anak tiri:** no share.
- Distance alone doesn't disqualify a cousin — *line and gender* do. There is no simple "2nd cousins can't inherit" cutoff; the asabah chain can run deep down the agnatic line.
- Practical scope: the app should **flag potential waris and classify the line (asabah/furud/dhawil arham)** but defer actual share calculation to certified tools/syariah officers (liability). Link out to e-Faraid (MAIS) or similar.

---

## 3. Malaysian Record Sources (for a future "hints" feature)

- **JPN (Jabatan Pendaftaran Negara):** civil registration since ~1859 in the Straits Settlements; compulsory for all from 1961 (Muslims earlier governed by Muslim Ordinance 1957 for marriage). Records are not publicly searchable online — next-of-kin application only. So an Ancestry-style automated record-hint engine is **not feasible at launch** in Malaysia.
- **Muslim marriage/divorce:** state Islamic religious departments (JAIS/JAIN per state), kariah mosque records.
- **National Archives (Arkib Negara), FamilySearch Malaysia collections, MyHeritage Malaysia vital records:** limited digitised coverage, mostly colonial-era.
- Implication: SusurGalur's moat is **crowdsourced family knowledge + the kinship engine**, not record archives. Hints v1 = matching against other users' trees (like FamilySearch's shared tree model), not record scanning.

---

## 4. Corrections to Phase 1

1. Phase 1's gelaran table presented one sequence as "the DBP standard" — treat positions 3–9 as regional presets, not a standard (see Q3).
2. Phase 1 in-law table is missing **besan** and **saudara susuan** — both now added.
3. Phase 1 formula needs a third axis: in addition to generationGap and bloodDistance, every edge needs **basis** (biological/angkat/tiri/susuan/affinal) and **link-parent gender path** (for faraid/wali). The label formula is unchanged; the legal/religious views consume the extra axes.

---

## 5. Remaining Gaps (Phase 3 candidates)

- Complete state-by-state gelaran table verified with native speakers per state (crowdsource inside the app itself — "what does your family call the 3rd child?").
- Adat perpatih (Negeri Sembilan) term set and suku (clan) data model.
- Sabah/Sarawak Muslim Bumiputera kinship sets (Bajau, Melanau) if scope expands beyond Malay.
- Jawi rendering of kinship terms and names.

---

## Sources
- [Threads — gelaran sequence variant](https://www.threads.com/@drdatinhjhmahidah/post/DL9oaEPhIkl/) · [OrangPerak — sistem panggilan Perak](https://www.orangperak.com/sistem-nama-panggilan-anak-anak-kelahiran-perak.html) · [Budak Pening — gelaran adik beradik](https://www.budakpening.com/2016/02/gelaran-adik-beradik-yang-betul.html)
- [E-FARAID MAIS — Siapa Waris Si Mati](https://efaraid.mais.gov.my/siapa-waris-si-mati/) · [Kelantan Syariah — Faraid](https://syariah.kelantan.gov.my/index.php/component/content/article/21-joomla/components/215-faraid?Itemid=951) · [Malay Mail — faraid explainer](https://www.malaymail.com/news/life/2025/01/16/what-to-know-about-faraid-how-islamic-inheritance-laws-help-resolve-family-conflicts-and-ensure-fair-asset-distribution/163416)
- [FamilySearch — Malaysia Civil Registration](https://www.familysearch.org/en/wiki/Malaysia_Civil_Registration) · [FamilySearch — Malaysia Genealogy](https://www.familysearch.org/en/wiki/Malaysia_Genealogy)
- [Wikipedia BM — Salasilah keluarga](https://ms.wikipedia.org/wiki/Salasilah_keluarga) · [Galur.id (Indonesian comparator)](https://galur.id/)
