/**
 * SusurGalur Kinship Engine — v0.1
 * ---------------------------------
 * A pure function: family structure in → Malay kinship labels out.
 * No database, no internet, no framework. This makes it easy to test
 * and impossible to break from the outside.
 *
 * WHAT IT DOES (plain English):
 *   Given two people in a family tree, it works out what person A calls
 *   person B (and the reverse) in Malay — e.g. Sepupu, Anak saudara,
 *   Nenek saudara, Bapa mertua, Biras.
 *
 * HOW IT WORKS (plain English):
 *   1. Climb up from both people to find their nearest shared ancestor.
 *   2. Count how many generations each person is below that ancestor.
 *      - The DIFFERENCE between those numbers  = generation gap.
 *      - The SMALLER of those numbers          = how "sideways" they are
 *        (0 = direct line, 1 = via a sibling, 2 = via a cousin, ...).
 *   3. Those two numbers pick the right Malay term from a small grammar.
 *   4. If there is no blood link, check marriage links (spouse, mertua,
 *      menantu, ipar, biras, besan).
 *
 * DATA SHAPE expected:
 *   family = {
 *     persons:  { id: { name, sex: "M"|"F", birthYear? } },
 *     children: [ { parent: id, child: id, basis?: "biological"|"angkat"|"tiri" } ],
 *     unions:   [ { partners: [id, id], status?: "active"|"cerai"|"kematian" } ]
 *   }
 *
 * Kinship labels are ALWAYS computed, never stored (project rule).
 */

(function (root) {
  "use strict";

  // ---------- small helpers ----------

  const KALI = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "lapan", "sembilan", "sepuluh"];

  function kaliWord(n) {
    return KALI[n] || String(n);
  }

  // "sepupu", "sepupu dua kali", "sepupu tiga kali" — degree = lateral - 1
  function sepupuWord(lateral) {
    const degree = lateral - 1;
    return degree > 1 ? `sepupu ${kaliWord(degree)} kali` : "sepupu";
  }

  function bySex(sex, male, female, both) {
    if (sex === "M") return male;
    if (sex === "F") return female;
    return both || `${male}/${female}`;
  }

  // Is A older than B? true / false / null (unknown)
  function isOlder(pa, pb) {
    if (pa.birthYear == null || pb.birthYear == null) return null;
    if (pa.birthYear === pb.birthYear) return null;
    return pa.birthYear < pb.birthYear;
  }

  // ---------- graph plumbing ----------

  // Edges that carry nasab/lineage for naming purposes.
  // "angkat" is included for ADDRESS terms (research Phase 2, Q5) —
  // legal views (faraid/wali) must filter it out separately.
  function lineageParents(family, id) {
    return family.children
      .filter((e) => e.child === id && (e.basis === undefined || e.basis === "biological" || e.basis === "angkat"))
      .map((e) => e.parent);
  }

  function parentsOf(family, id, basisFilter) {
    return family.children
      .filter((e) => e.child === id && (!basisFilter || basisFilter(e.basis || "biological")))
      .map((e) => e.parent);
  }

  function childrenOf(family, id) {
    return family.children
      .filter((e) => e.parent === id && (e.basis === undefined || e.basis === "biological" || e.basis === "angkat"))
      .map((e) => e.child);
  }

  function spousesOf(family, id) {
    const out = [];
    for (const u of family.unions || []) {
      if (u.partners.includes(id)) {
        for (const p of u.partners) if (p !== id) out.push({ id: p, status: u.status || "active" });
      }
    }
    return out;
  }

  // Map of { ancestorId: minimum generations above this person }, self included at 0.
  function ancestorDepths(family, id) {
    const depths = new Map([[id, 0]]);
    let frontier = [id];
    let depth = 0;
    while (frontier.length) {
      depth += 1;
      const next = [];
      for (const f of frontier) {
        for (const p of lineageParents(family, f)) {
          if (!depths.has(p) || depths.get(p) > depth) {
            depths.set(p, depth);
            next.push(p);
          }
        }
      }
      frontier = next;
    }
    return depths;
  }

  // Nearest common ancestor: minimise (depthA + depthB), tie-break on smaller max.
  function nearestCommonAncestor(family, aId, bId) {
    const da = ancestorDepths(family, aId);
    const db = ancestorDepths(family, bId);
    let best = null;
    for (const [anc, depthA] of da) {
      if (!db.has(anc)) continue;
      const depthB = db.get(anc);
      const score = depthA + depthB;
      const tie = Math.max(depthA, depthB);
      if (!best || score < best.score || (score === best.score && tie < best.tie)) {
        best = { anc, depthA, depthB, score, tie };
      }
    }
    return best;
  }

  // ---------- the label grammar ----------

  // What A calls B when B is in a HIGHER generation.
  // gap = generations between them, lateral = sideways distance, sex = B's sex.
  function upTerm(gap, lateral, sex) {
    if (lateral === 0) {
      if (gap === 1) return bySex(sex, "Ayah", "Ibu");
      if (gap === 2) return bySex(sex, "Datuk", "Nenek");
      if (gap === 3) return "Moyang";
      return "Moyang Besar";
    }
    if (lateral === 1) {
      if (gap === 1) return bySex(sex, "Pakcik", "Makcik");
      if (gap === 2) return bySex(sex, "Datuk saudara", "Nenek saudara");
      return "Moyang saudara";
    }
    // lateral >= 2 → via a cousin line
    const base =
      gap === 1 ? bySex(sex, "Pakcik", "Makcik") : gap === 2 ? bySex(sex, "Datuk", "Nenek") : "Moyang";
    return `${base} ${sepupuWord(lateral)}`;
  }

  // What A calls B when B is in a LOWER generation.
  function downTerm(gap, lateral, sex) {
    const gen = gap === 1 ? "Anak" : gap === 2 ? "Cucu" : gap === 3 ? "Cicit" : "Piut";
    if (lateral === 0) {
      // Only Anak and Cucu take a gender suffix; Cicit and Piut do not (Phase 1 §3.2)
      if (gap <= 2) {
        const g = bySex(sex, "lelaki", "perempuan", "");
        return g ? `${gen} ${g}` : gen;
      }
      return gen;
    }
    if (lateral === 1) return `${gen} saudara`;
    return `${gen} ${sepupuWord(lateral)}`;
  }

  // Same generation: siblings or cousins of some degree.
  function sameGenTerm(family, aId, bId, lateral) {
    const pa = family.persons[aId];
    const pb = family.persons[bId];
    const bOlder = isOlder(pb, pa); // is B older than A?

    if (lateral === 1) {
      // Sibling. Full vs half detected from shared parents (faraid-relevant).
      const sharedParents = lineageParents(family, aId).filter((p) => lineageParents(family, bId).includes(p));
      let halfNote = "";
      if (sharedParents.length === 1) {
        const sp = family.persons[sharedParents[0]];
        halfNote = sp && sp.sex === "F" ? " (seibu)" : " (sebapa)";
      }
      let label;
      if (bOlder === true) label = bySex(pb.sex, "Abang", "Kakak");
      else if (bOlder === false) label = `Adik ${bySex(pb.sex, "lelaki", "perempuan", "")}`.trim();
      else label = "Adik-beradik";
      return { label: label + halfNote, panggilan: bOlder ? label : pb.name };
    }

    // Cousins
    const label = sepupuWord(lateral).replace(/^s/, "S");
    const panggilan = bOlder === true ? `${bySex(pb.sex, "Abang", "Kakak")} sepupu` : pb.name;
    return { label, panggilan };
  }

  // ---------- blood relationship ----------

  function bloodLabel(family, aId, bId) {
    const nca = nearestCommonAncestor(family, aId, bId);
    if (!nca) return null;

    const { depthA, depthB } = nca; // generations A and B sit below the shared ancestor
    const gap = Math.abs(depthA - depthB);
    const lateral = Math.min(depthA, depthB);
    const pb = family.persons[bId];

    if (gap === 0) {
      if (lateral === 0) return { label: "Orang yang sama", panggilan: "—", gap, lateral };
      const t = sameGenTerm(family, aId, bId, lateral);
      return { ...t, gap, lateral };
    }

    // B above A or below A?
    const bIsAbove = depthB < depthA;
    const label = bIsAbove ? upTerm(gap, lateral, pb.sex) : downTerm(gap, lateral, pb.sex);
    return { label, panggilan: label, gap, lateral };
  }

  // ---------- marriage (affinal) relationships ----------

  // Spouses whose union is still "kinship-active": current marriages and
  // marriages ended by death. A divorced (cerai) union no longer carries
  // in-law chains (mertua/ipar/biras), though the ex-spouse label remains.
  function currentSpousesOf(family, id) {
    return spousesOf(family, id).filter((s) => s.status !== "cerai");
  }

  function affinalLabel(family, aId, bId) {
    const pa = family.persons[aId];
    const pb = family.persons[bId];

    // 1. Spouse (current, widowed, or divorced)
    const direct = spousesOf(family, aId).find((s) => s.id === bId);
    if (direct) {
      if (direct.status === "cerai") {
        return { label: bySex(pb.sex, "Bekas suami", "Bekas isteri"), panggilan: pb.name };
      }
      return { label: bySex(pb.sex, "Suami", "Isteri"), panggilan: bySex(pb.sex, "Abang", pb.name) };
    }

    const aSpouses = currentSpousesOf(family, aId).map((s) => s.id);

    // 2. Mertua — B is a parent of A's spouse
    for (const s of aSpouses) {
      if (lineageParents(family, s).includes(bId)) {
        return { label: bySex(pb.sex, "Bapa mertua", "Ibu mertua"), panggilan: bySex(pb.sex, "Ayah", "Ibu") };
      }
    }

    // 3. Menantu — B is the spouse of A's child (current/widowed union)
    for (const c of childrenOf(family, aId)) {
      if (currentSpousesOf(family, c).some((s) => s.id === bId)) {
        return { label: `Menantu ${bySex(pb.sex, "lelaki", "perempuan", "")}`.trim(), panggilan: pb.name };
      }
    }

    // 4. Ipar — B is A's spouse's sibling, or B is the spouse of A's sibling
    const olderB = isOlder(pb, pa);
    const iparLabel = () =>
      olderB === true
        ? `${bySex(pb.sex, "Abang", "Kakak")} ipar`
        : olderB === false
        ? "Adik ipar"
        : "Ipar";
    for (const s of aSpouses) {
      const sibOfSpouse = bloodLabel(family, s, bId);
      if (sibOfSpouse && sibOfSpouse.gap === 0 && sibOfSpouse.lateral === 1) {
        return { label: iparLabel(), panggilan: iparLabel() };
      }
    }
    const sibOfA = (id) => {
      const r = bloodLabel(family, aId, id);
      return r && r.gap === 0 && r.lateral === 1;
    };
    for (const sp of currentSpousesOf(family, bId)) {
      if (sibOfA(sp.id)) return { label: iparLabel(), panggilan: iparLabel() };
    }

    // 5. Biras — A's spouse's sibling's spouse (two people married to two siblings)
    for (const s of aSpouses) {
      for (const bSp of currentSpousesOf(family, bId)) {
        const r = bloodLabel(family, s, bSp.id);
        if (r && r.gap === 0 && r.lateral === 1) return { label: "Biras", panggilan: "Biras" };
      }
    }

    // 5b. Madu — co-wives: A and B are married to the same person (polygamy)
    for (const s of aSpouses) {
      if (currentSpousesOf(family, s).some((x) => x.id === bId)) {
        return { label: "Madu", panggilan: "Madu" };
      }
    }

    // 6. Besan — B is a parent of A's child's spouse (current/widowed union)
    for (const c of childrenOf(family, aId)) {
      for (const cSp of currentSpousesOf(family, c)) {
        if (lineageParents(family, cSp.id).includes(bId)) {
          return { label: "Besan", panggilan: "Besan" };
        }
      }
    }

    // 7. Step relations (tiri) — direct edges only
    const stepParents = parentsOf(family, aId, (b) => b === "tiri");
    if (stepParents.includes(bId)) {
      return { label: bySex(pb.sex, "Bapa tiri", "Ibu tiri"), panggilan: bySex(pb.sex, "Ayah", "Ibu") };
    }
    const stepChildren = family.children
      .filter((e) => e.parent === aId && e.basis === "tiri")
      .map((e) => e.child);
    if (stepChildren.includes(bId)) {
      return { label: "Anak tiri", panggilan: pb.name };
    }

    // 8. General "married into the bloodline": B is the spouse of a blood relative of A.
    //    Research rule: address follows the blood relative's generation, gender-swapped.
    for (const bSp of currentSpousesOf(family, bId)) {
      const r = bloodLabel(family, aId, bSp.id);
      if (r && !(r.gap === 0 && r.lateral === 0)) {
        if (r.gap === 0) {
          // spouse of my sepupu → no formal term; collapses (Phase 2, Q4)
          return { label: `${bySex(pb.sex, "Suami", "Isteri")} ${r.label.toLowerCase()}`, panggilan: olderB ? bySex(pb.sex, "Abang", "Kakak") : pb.name };
        }
        const swapped = bloodLabel(family, aId, bSp.id); // recompute, then re-gender for B
        const base = swapped.label
          .replace(/^Pakcik/, bySex(pb.sex, "Pakcik", "Makcik"))
          .replace(/^Makcik/, bySex(pb.sex, "Pakcik", "Makcik"))
          .replace(/^Datuk(?! saudara)/, bySex(pb.sex, "Datuk", "Nenek"))
          .replace(/^Nenek(?! saudara)/, bySex(pb.sex, "Datuk", "Nenek"))
          .replace(/^Ayah$/, bySex(pb.sex, "Ayah", "Ibu"))
          .replace(/^Ibu$/, bySex(pb.sex, "Ayah", "Ibu"));
        return { label: `${base} (melalui perkahwinan)`, panggilan: base.split(" (")[0] };
      }
    }

    // 9. Blood relative OF my spouse, beyond the patterns above
    for (const s of aSpouses) {
      const r = bloodLabel(family, s, bId);
      if (r && !(r.gap === 0 && r.lateral === 0)) {
        return { label: `${r.label} (sebelah ${bySex(family.persons[s].sex, "suami", "isteri")})`, panggilan: r.panggilan };
      }
    }

    return null;
  }

  // ---------- public API ----------

  /**
   * computeKinship(family, aId, bId)
   * Returns { aCallsB, bCallsA }, each { label, panggilan, gap?, lateral? }.
   * label     = formal written term
   * panggilan = everyday address term (best-effort v0.1)
   */
  function computeKinship(family, aId, bId) {
    if (!family.persons[aId] || !family.persons[bId]) {
      throw new Error("Unknown person id");
    }
    if (aId === bId) {
      const same = { label: "Orang yang sama", panggilan: "—" };
      return { aCallsB: same, bCallsA: same };
    }

    const oneWay = (x, y) =>
      bloodLabel(family, x, y) ||
      affinalLabel(family, x, y) || { label: "Tiada hubungan ditemui dalam pokok ini", panggilan: "—" };

    // Blood takes precedence over marriage (Phase 2, Q8) — bloodLabel is tried first.
    return { aCallsB: oneWay(aId, bId), bCallsA: oneWay(bId, aId) };
  }

  const api = { computeKinship, _internal: { ancestorDepths, nearestCommonAncestor, upTerm, downTerm } };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api; // Node (tests)
  } else {
    root.Kinship = api; // Browser (demo.html)
  }
})(typeof self !== "undefined" ? self : this);
