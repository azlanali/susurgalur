"use strict";
/* ============================================================
   SusurGalur — Avatar v0.4
   Full-body cartoon avatars in traditional Malay dress, with a
   soft 3D look (gradients, sheen, ground shadow).
   Pure function: person in → SVG string out. Nothing stored,
   nothing fetched — works fully offline, deterministic per person.

   Male   : songkok + baju melayu (cekak musang) + kain samping
            attire "jubah" → long soft-colour robe
            attire "jubahputih" → white jubah
   Female : baju kurung + tudung (girls <10: hair + flower clip)
            attire "niqab" → tudung + eyes-only veil (age 13+)
            attire "niqabhitam" → black niqab + black abaya (age 13+)
   OKU    : "kerusiroda" → seated in wheelchair (front view)
            "penglihatan" → dark glasses + white cane (red band)
            "tongkat"     → wooden walking cane
   Age    : child / teen / adult / middle / elder (from birth year)

   SECURITY: no user text is ever placed inside the SVG. Inputs
   used are: sex/attire/oku (validated enums), years (numbers),
   id+name (hashed to a number only). Output is safe for innerHTML.
   ============================================================ */

const Avatar = (() => {

  // ---------- deterministic hash (id+name → number) ----------
  function hash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
    return h;
  }

  // ---------- colour helpers ----------
  function mix(hex, target, t) { // blend hex toward target (both "#rrggbb")
    const a = parseInt(hex.slice(1), 16), b = parseInt(target.slice(1), 16);
    const ch = (sh) => Math.round(((a >> sh & 255) * (1 - t)) + ((b >> sh & 255) * t));
    return "#" + ((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0");
  }
  const soften = (c) => mix(c, "#f5f0e6", 0.42);   // elders: gentle, dignified tones
  const darken = (c) => mix(c, "#000000", 0.22);
  const lighten = (c, t = 0.28) => mix(c, "#ffffff", t);

  // Festive Raya palettes — male: a=baju, s=samping base, m=samping motif
  const PAL_M = [
    { a: "#1d7a5c", s: "#10503b", m: "#dcab3c" },
    { a: "#2d4f9e", s: "#1e3a7a", m: "#d9a93c" },
    { a: "#8a3046", s: "#5e1f30", m: "#e3b54e" },
    { a: "#5c4a9e", s: "#3f3076", m: "#cdb6e8" },
    { a: "#20707e", s: "#144f5a", m: "#e8c45e" },
    { a: "#a8762a", s: "#6d4a14", m: "#ecd9a0" },
    { a: "#3f7a3f", s: "#2a5a2a", m: "#e0c060" },
    { a: "#536878", s: "#394a57", m: "#d9a93c" },
  ];
  // female: a=kurung top, b=skirt, t=tudung
  const PAL_F = [
    { a: "#d98ca0", b: "#94455c", t: "#b85c74" },
    { a: "#6fae8f", b: "#2f6e54", t: "#458a6c" },
    { a: "#8fa3d9", b: "#46588f", t: "#6478b8" },
    { a: "#b39ddb", b: "#65488f", t: "#8a6cb8" },
    { a: "#e0a878", b: "#a8643c", t: "#c08458" },
    { a: "#7fbcbc", b: "#2f7575", t: "#509494" },
    { a: "#dbb963", b: "#94742c", t: "#bb9c44" },
    { a: "#c46278", b: "#7c2f44", t: "#a04c60" },
  ];
  const SKIN = ["#f5cfa6", "#eaba8d", "#dca87e", "#c89066"];
  const CHAIR = { dark: "#2e2e36", frame: "#3c3c46", rim: "#9a9aa6", spoke: "#5a5a66", hub: "#8a8a96", tyre: "#23232a" };

  // ---------- age bands ----------
  function ageOf(p, nowYear) {
    if (!p || !p.birthYear) return 35;                    // unknown → adult
    const ref = p.deathYear || nowYear;
    return Math.max(0, ref - p.birthYear);
  }
  function bandOf(age) {
    return age < 13 ? "child" : age < 20 ? "teen" : age < 47 ? "adult"
         : age < 63 ? "middle" : "elder";
  }
  // body dimensions per band (head stays similar → kids look cutely big-headed)
  const DIMS = {
    child:  { hry: 17, torso: 38, leg: 22, armW: 10, flare: 3 },
    teen:   { hry: 17.5, torso: 50, leg: 34, armW: 10.5, flare: 4 },
    adult:  { hry: 18, torso: 57, leg: 41, armW: 11, flare: 5 },
    middle: { hry: 18, torso: 57, leg: 40, armW: 11.5, flare: 6 },
    elder:  { hry: 18, torso: 54, leg: 38, armW: 11, flare: 5 },
  };

  // ---------- face (shared) ----------
  // eyesOnly: used for niqab — draws brows, eyes, lashes, glasses; skips the rest
  function face(cx, cy, sex, bandName, skin, eyesOnly) {
    const elder = bandName === "elder", middle = bandName === "middle";
    const browC = elder ? "#cfc8ba" : "#4a3220";
    const eyeY = cy - 1.5, eyeDx = 6.5;
    let s = "";
    // brows — gentle arcs
    s += `<path d="M${cx - eyeDx - 3.4},${eyeY - 5} q3.4,-2.6 6.8,-0.6" stroke="${browC}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M${cx + eyeDx - 3.4},${eyeY - 5.6} q3.4,-2 6.8,0.6" stroke="${browC}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    // eyes — warm dark, with light glint
    for (const dx of [-eyeDx, eyeDx]) {
      s += `<ellipse cx="${cx + dx}" cy="${eyeY}" rx="2.5" ry="3" fill="#33231a"/>`;
      s += `<circle cx="${cx + dx - 0.9}" cy="${eyeY - 1}" r="0.85" fill="#fff" opacity=".9"/>`;
      if (sex === "F") // lashes
        s += `<path d="M${cx + dx - 2.8},${eyeY - 2.6} q2.8,-2.2 5.6,0" stroke="#2a1a10" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
    }
    if (!eyesOnly) {
      // nose — small soft curve
      s += `<path d="M${cx - 1},${cy + 3.5} q1.6,2.2 3,0.6" stroke="${darken(skin)}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
      // smile
      s += `<path d="M${cx - 4.6},${cy + 8.6} q4.6,4.4 9.2,0" stroke="#8a4a3a" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
      // blush
      s += `<ellipse cx="${cx - 10}" cy="${cy + 5.5}" rx="3.2" ry="1.9" fill="#f08a72" opacity=".30"/>`;
      s += `<ellipse cx="${cx + 10}" cy="${cy + 5.5}" rx="3.2" ry="1.9" fill="#f08a72" opacity=".30"/>`;
      // moustache (middle-aged men)
      if (sex === "M" && middle)
        s += `<path d="M${cx - 4.6},${cy + 7.4} q4.6,2.6 9.2,0 q-4.6,4 -9.2,0 z" fill="#4a3220" opacity=".85"/>`;
    }
    // glasses (elders)
    if (elder) {
      s += `<g stroke="#6b5a42" stroke-width="1.3" fill="none" opacity=".9">
        <circle cx="${cx - eyeDx}" cy="${eyeY}" r="5.4"/><circle cx="${cx + eyeDx}" cy="${eyeY}" r="5.4"/>
        <path d="M${cx - 1.2},${eyeY} h2.4"/></g>`;
    }
    return s;
  }

  // ---------- shared OKU pieces ----------
  // dark glasses for blind/low-vision (drawn over the face, replaces elder specs visually)
  function darkGlasses(cx, faceCy) {
    const eyeY = faceCy - 1.5;
    return `<g>
      <rect x="${cx - 12.2}" y="${eyeY - 4.8}" width="10.8" height="8.6" rx="4" fill="#23232a" stroke="#111114" stroke-width=".8"/>
      <rect x="${cx + 1.4}" y="${eyeY - 4.8}" width="10.8" height="8.6" rx="4" fill="#23232a" stroke="#111114" stroke-width=".8"/>
      <path d="M${cx - 1.4},${eyeY - 1} h2.8" stroke="#111114" stroke-width="1.4"/>
      <circle cx="${cx - 9}" cy="${eyeY - 2}" r="1.1" fill="#fff" opacity=".25"/>
      <circle cx="${cx + 4.6}" cy="${eyeY - 2}" r="1.1" fill="#fff" opacity=".25"/>
    </g>`;
  }
  // white cane (tongkat putih) — from right hand to the ground, red band near tip
  function whiteCane(hx, hy, groundY) {
    const gx = hx + 11, gy = groundY - 1;
    const bx = hx + (gx - hx) * 0.8, by = hy + (gy - hy) * 0.8;
    return `<line x1="${hx + 1.5}" y1="${hy + 1.5}" x2="${gx}" y2="${gy}" stroke="#f2f1ea" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="${bx}" y1="${by}" x2="${gx - 1}" y2="${gy - 1.2}" stroke="#c43a3a" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="${gx}" cy="${gy}" r="1.7" fill="#2c2c33"/>`;
  }
  // wooden walking cane with curved handle
  function woodCane(hx, hy, groundY) {
    return `<path d="M${hx - 4},${hy - 1} q5,-5 9,0 L${hx + 5.5},${groundY - 1}"
      stroke="#8a5a2c" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <ellipse cx="${hx + 5.5}" cy="${groundY - 0.5}" rx="2" ry="1" fill="#6d4520"/>`;
  }
  // wheelchair (front view): backrest behind torso, big wheels both sides,
  // then caller draws lap/shins/shoes over, then footplate + side frames
  function chairBack(cx, tTop, seatY) {
    return `<rect x="${cx - 17.5}" y="${tTop + 3}" width="35" height="${seatY - tTop + 2}" rx="6" fill="${CHAIR.dark}"/>
      <rect x="${cx - 20.5}" y="${tTop + 1}" width="4" height="7" rx="2" fill="${CHAIR.frame}"/>
      <rect x="${cx + 16.5}" y="${tTop + 1}" width="4" height="7" rx="2" fill="${CHAIR.frame}"/>`;
  }
  function chairWheels(cx, wCy, wR) {
    let s = "";
    for (const wx of [cx - 21.5, cx + 21.5]) {
      s += `<circle cx="${wx}" cy="${wCy}" r="${wR}" fill="${CHAIR.tyre}" stroke="${CHAIR.frame}" stroke-width="3"/>`;
      s += `<circle cx="${wx}" cy="${wCy}" r="${wR - 4.5}" fill="none" stroke="${CHAIR.rim}" stroke-width="1.6"/>`;
      s += `<path d="M${wx - wR + 6},${wCy} h${2 * wR - 12} M${wx},${wCy - wR + 6} v${2 * wR - 12}" stroke="${CHAIR.spoke}" stroke-width="1.4"/>`;
      s += `<circle cx="${wx}" cy="${wCy}" r="2.4" fill="${CHAIR.hub}"/>`;
      s += `<path d="M${wx - wR + 3.5},${wCy - 5} q2,-4.5 6,-6.5" stroke="#fff" stroke-width="1.2" fill="none" opacity=".25"/>`;
    }
    return s;
  }
  function chairFront(cx, seatY, footY) {
    return `<rect x="${cx - 14}" y="${footY + 5}" width="28" height="2.8" rx="1.4" fill="${CHAIR.frame}"/>
      <path d="M${cx - 13},${footY + 5.5} L${cx - 16},${seatY + 8} M${cx + 13},${footY + 5.5} L${cx + 16},${seatY + 8}"
        stroke="${CHAIR.frame}" stroke-width="2" fill="none"/>`;
  }

  // ---------- MALE ----------
  // jubah=true → long soft robe instead of baju melayu + samping
  function male(d, pal, skin, bandName, uid, jubah, oku) {
    const cx = 60, y0 = 12;
    const elder = bandName === "elder";
    const base = elder ? soften(pal.a) : pal.a;
    const baju = jubah === "jubahputih" ? "#f2eee2"           // white jubah
               : jubah ? mix(base, "#f7f2e6", 0.38) : base;   // jubah: gentle, dignified
    const bajuD = darken(baju);
    const headTop = y0 + 13;                 // songkok overlaps head
    const cy = headTop + d.hry - 2;          // head centre
    const headBot = cy + d.hry;
    const tTop = headBot + 3;                // torso top (neck overlapped)
    const tBot = tTop + d.torso;
    const sampTop = tTop + d.torso * 0.60;
    const sampBot = tBot + 16;
    const legBot = sampBot + d.leg;
    const wheel = oku === "kerusiroda";
    const armTop = tTop + 6;
    const armBot = wheel ? tBot + 2 : tTop + d.torso * 0.92;
    const shade = `url(#sh${uid})`, skinF = `url(#sk${uid})`;
    let s = "";
    // defs: batik pattern for samping
    s += `<defs><pattern id="bk${uid}" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="9" height="9" fill="${pal.s}"/>
      <rect width="9" height="2.6" fill="${pal.m}" opacity=".85"/>
      <circle cx="4.5" cy="6.4" r="1.1" fill="${pal.m}" opacity=".55"/>
    </pattern></defs>`;
    let feet;

    if (wheel) {
      // ----- seated in wheelchair -----
      const seatY = tBot;
      const wCy = seatY + 9, wR = 17;
      const footY = seatY + 24;
      feet = Math.max(wCy + wR, footY + 7);
      s += chairBack(cx, tTop, seatY);
      s += chairWheels(cx, wCy, wR);
      // lap: samping batik over the thighs (or robe colour for jubah)
      if (jubah) {
        s += `<rect x="${cx - 14}" y="${seatY - 2}" width="28" height="${footY - seatY - 2}" rx="4" fill="${baju}"/>`;
        s += `<rect x="${cx - 14}" y="${seatY - 2}" width="28" height="${footY - seatY - 2}" rx="4" fill="${shade}"/>`;
      } else {
        s += `<rect x="${cx - 14}" y="${seatY - 2}" width="28" height="11" rx="4" fill="url(#bk${uid})" stroke="${darken(pal.s)}" stroke-width=".8"/>`;
        s += `<rect x="${cx - 14}" y="${seatY - 2}" width="28" height="11" rx="4" fill="${shade}"/>`;
        // shins (trousers)
        s += `<rect x="${cx - 11.5}" y="${seatY + 7}" width="9" height="${footY - seatY - 6}" rx="3" fill="${bajuD}"/>`;
        s += `<rect x="${cx + 2.5}" y="${seatY + 7}" width="9" height="${footY - seatY - 6}" rx="3" fill="${bajuD}"/>`;
      }
      // shoes on the footplate
      s += `<ellipse cx="${cx - 7}" cy="${footY + 3}" rx="7.5" ry="3.4" fill="#3a2a1e"/>`;
      s += `<ellipse cx="${cx + 8}" cy="${footY + 3}" rx="7.5" ry="3.4" fill="#3a2a1e"/>`;
      s += chairFront(cx, seatY, footY);
    } else {
      // ----- standing -----
      feet = legBot + 7;
      if (!jubah) { // trousers (robe covers legs otherwise)
        for (const lx of [cx - 13, cx + 2.5]) {
          s += `<rect x="${lx}" y="${sampBot - 6}" width="10.5" height="${legBot - sampBot + 6}" rx="3.5" fill="${bajuD}"/>`;
          s += `<rect x="${lx}" y="${sampBot - 6}" width="10.5" height="${legBot - sampBot + 6}" rx="3.5" fill="${shade}"/>`;
        }
      }
      // capal / shoes
      s += `<ellipse cx="${cx - 7.5}" cy="${legBot + 3}" rx="8" ry="3.6" fill="#3a2a1e"/>`;
      s += `<ellipse cx="${cx + 8.5}" cy="${legBot + 3}" rx="8" ry="3.6" fill="#3a2a1e"/>`;
      s += `<ellipse cx="${cx - 9.5}" cy="${legBot + 1.8}" rx="3" ry="1.1" fill="#fff" opacity=".18"/>`;
      s += `<ellipse cx="${cx + 6.5}" cy="${legBot + 1.8}" rx="3" ry="1.1" fill="#fff" opacity=".18"/>`;
    }

    // arms
    for (const ax of [cx - 22 - d.armW / 2, cx + 22 - d.armW / 2]) {
      s += `<rect x="${ax}" y="${armTop}" width="${d.armW}" height="${armBot - armTop}" rx="${d.armW / 2}" fill="${baju}"/>`;
      s += `<rect x="${ax}" y="${armTop}" width="${d.armW}" height="${armBot - armTop}" rx="${d.armW / 2}" fill="${shade}"/>`;
    }
    // hands
    s += `<circle cx="${cx - 22}" cy="${armBot + 2}" r="4.4" fill="${skinF}"/>`;
    s += `<circle cx="${cx + 22}" cy="${armBot + 2}" r="4.4" fill="${skinF}"/>`;
    // neck
    s += `<rect x="${cx - 4.5}" y="${headBot - 5}" width="9" height="10" fill="${darken(skin)}"/>`;

    // torso — baju melayu (to hip) or jubah (to ankles)
    if (jubah) {
      const robeBot = wheel ? tBot + 4 : legBot;
      const dRobe = wheel
        ? `M${cx - 16},${tTop + 1} C${cx - 8},${tTop - 3} ${cx + 8},${tTop - 3} ${cx + 16},${tTop + 1}
           L${cx + 17},${robeBot} L${cx - 17},${robeBot} Z`
        : `M${cx - 16},${tTop + 1} C${cx - 8},${tTop - 3} ${cx + 8},${tTop - 3} ${cx + 16},${tTop + 1}
           L${cx + 23 + d.flare},${robeBot} Q${cx},${robeBot + 5} ${cx - 23 - d.flare},${robeBot} Z`;
      s += `<path d="${dRobe}" fill="${baju}"/><path d="${dRobe}" fill="${shade}"/>`;
      // front placket + buttons
      const plBot = wheel ? tBot - 2 : tTop + d.torso * 1.1;
      s += `<line x1="${cx}" y1="${tTop + 6}" x2="${cx}" y2="${plBot}" stroke="${bajuD}" stroke-width="1" opacity=".5"/>`;
      for (let i = 0; i < 4; i++) s += `<circle cx="${cx}" cy="${tTop + 9 + i * 8}" r="1.4" fill="#e8c45e"/>`;
    } else {
      const dTorso = `M${cx - 16},${tTop + 1} C${cx - 8},${tTop - 3} ${cx + 8},${tTop - 3} ${cx + 16},${tTop + 1}
        L${cx + 19 + d.flare},${tBot} L${cx - 19 - d.flare},${tBot} Z`;
      s += `<path d="${dTorso}" fill="${baju}"/><path d="${dTorso}" fill="${shade}"/>`;
      for (let i = 0; i < 3; i++) s += `<circle cx="${cx}" cy="${tTop + 9 + i * 7}" r="1.5" fill="#e8c45e"/>`;
      if (!wheel) {
        // side pocket hints
        s += `<path d="M${cx - 15},${sampTop - 6} q3,1.5 6,0" stroke="${bajuD}" stroke-width="1" fill="none" opacity=".5"/>`;
        s += `<path d="M${cx + 9},${sampTop - 6} q3,1.5 6,0" stroke="${bajuD}" stroke-width="1" fill="none" opacity=".5"/>`;
        // kain samping (batik) + gold hem
        const dSamp = `M${cx - 18 - d.flare},${sampTop} L${cx + 18 + d.flare},${sampTop}
          L${cx + 21 + d.flare},${sampBot} L${cx - 21 - d.flare},${sampBot} Z`;
        s += `<path d="${dSamp}" fill="url(#bk${uid})" stroke="${darken(pal.s)}" stroke-width="1"/>`;
        s += `<path d="${dSamp}" fill="${shade}"/>`;
        s += `<rect x="${cx - 21 - d.flare}" y="${sampBot - 3.5}" width="${42 + 2 * d.flare}" height="3.5" fill="${pal.m}" opacity=".9"/>`;
        s += `<path d="M${cx - 4},${sampTop} L${cx - 8},${sampBot - 4}" stroke="${darken(pal.s)}" stroke-width="1.2" opacity=".5" fill="none"/>`;
      }
    }
    // collar (cekak musang)
    s += `<rect x="${cx - 6}" y="${tTop - 1.5}" width="12" height="5.5" rx="2.2" fill="${baju}" stroke="${bajuD}" stroke-width="1.2"/>`;

    // ears
    s += `<circle cx="${cx - 15.5}" cy="${cy + 1}" r="3.4" fill="${skinF}"/>`;
    s += `<circle cx="${cx + 15.5}" cy="${cy + 1}" r="3.4" fill="${skinF}"/>`;
    // sideburns/hair edge under songkok
    const hairC = elder ? "#d8d2c4" : "#2a1a10";
    s += `<path d="M${cx - 15.5},${headTop + 6} q-1,6 0.5,10 l3,-1 q-1.5,-5 -0.5,-9 z" fill="${hairC}"/>`;
    s += `<path d="M${cx + 15.5},${headTop + 6} q1,6 -0.5,10 l-3,-1 q1.5,-5 0.5,-9 z" fill="${hairC}"/>`;
    // head
    s += `<ellipse cx="${cx}" cy="${cy}" rx="15.5" ry="${d.hry}" fill="${skinF}"/>`;
    s += `<ellipse cx="${cx - 5}" cy="${cy - 7}" rx="6" ry="4" fill="#fff" opacity=".12"/>`;
    // elder beard — neat white crescent
    if (elder) s += `<path d="M${cx - 13.5},${cy + 5} Q${cx},${cy + d.hry + 10} ${cx + 13.5},${cy + 5}
      Q${cx},${cy + d.hry - 2} ${cx - 13.5},${cy + 5} Z" fill="#eee8da" stroke="#d8d0bc" stroke-width="0.8"/>`;
    // songkok (velvet sheen + side seam)
    const dSongkok = `M${cx - 17},${headTop + 7} L${cx - 16},${y0 + 5} Q${cx - 16},${y0} ${cx - 10},${y0}
      L${cx + 10},${y0} Q${cx + 16},${y0} ${cx + 16},${y0 + 5} L${cx + 17},${headTop + 7}
      Q${cx},${headTop + 12} ${cx - 17},${headTop + 7} Z`;
    s += `<path d="${dSongkok}" fill="#1c1c20"/><path d="${dSongkok}" fill="${shade}" opacity=".55"/>`;
    s += `<ellipse cx="${cx - 6}" cy="${y0 + 5}" rx="6.5" ry="2.6" fill="#fff" opacity=".10"/>`;
    s += `<path d="M${cx - 13},${y0 + 3} Q${cx - 13.5},${y0 + 12} ${cx - 12.5},${headTop + 5}" stroke="#3c3c44" stroke-width="1.4" fill="none"/>`;
    // face
    s += face(cx, cy, "M", bandName, skin, false);

    // OKU extras (over everything)
    if (oku === "penglihatan") {
      s += darkGlasses(cx, cy);
      if (!wheel) s += whiteCane(cx + 22, armBot + 2, feet - 1);
    } else if (oku === "tongkat" && !wheel) {
      s += woodCane(cx + 22, armBot + 2, feet - 1);
    }
    return { svg: s, feet };
  }

  // ---------- FEMALE ----------
  // niqab=true → tudung + eyes-only veil (applied for age 13+ by caller)
  function female(d, pal, skin, bandName, age, uid, niqab, oku) {
    const cx = 60, y0 = 12;
    const elder = bandName === "elder";
    const girl = age < 10;                       // young girls: hair, no tudung
    const black = niqab === "niqabhitam";        // black niqab = full black abaya look
    const top = black ? "#30303a" : elder ? soften(pal.a) : pal.a;
    const skirt = black ? "#262630" : elder ? soften(pal.b) : pal.b;
    const tud = black ? "#2a2a34" : elder ? soften(pal.t) : pal.t;
    // on black fabric, dark fold lines vanish — use a lifted grey instead
    const tudLine = black ? "#565664" : darken(tud);
    const topLine = black ? "#565664" : darken(top);
    const dotOp = black ? [0.10, 0.07] : [0.30, 0.22];
    const cy = y0 + 9 + d.hry;
    const headBot = cy + d.hry;
    const tTop = headBot + 3;
    const hip = tTop + d.torso * 0.78;           // kurung top falls past hips
    const kurungHem = tTop + d.torso + 6;
    const legBot = kurungHem + d.leg + 4;        // skirt to ankles
    const wheel = oku === "kerusiroda";
    const armTop = tTop + 6;
    const armBot = wheel ? hip + 2 : tTop + d.torso * 0.92;
    const shade = `url(#sh${uid})`, skinF = `url(#sk${uid})`;
    let s = "";
    s += `<defs><pattern id="fl${uid}" width="14" height="14" patternUnits="userSpaceOnUse">
      <rect width="14" height="14" fill="${skirt}"/>
      <circle cx="4" cy="4" r="1.4" fill="#fff" opacity="${dotOp[0]}"/>
      <circle cx="11" cy="10" r="1.4" fill="#fff" opacity="${dotOp[1]}"/>
    </pattern></defs>`;
    let feet;

    if (wheel) {
      // ----- seated in wheelchair -----
      const seatY = hip;
      const wCy = seatY + 9, wR = 17;
      const footY = seatY + 24;
      feet = Math.max(wCy + wR, footY + 7);
      s += chairBack(cx, tTop, seatY);
      s += chairWheels(cx, wCy, wR);
      // skirt drapes over lap down to the ankles
      s += `<rect x="${cx - 14.5}" y="${seatY - 2}" width="29" height="${footY - seatY + 1}" rx="5" fill="url(#fl${uid})"/>`;
      s += `<rect x="${cx - 14.5}" y="${seatY - 2}" width="29" height="${footY - seatY + 1}" rx="5" fill="${shade}"/>`;
      s += `<ellipse cx="${cx - 6.5}" cy="${footY + 3}" rx="6.5" ry="3" fill="#5e4434"/>`;
      s += `<ellipse cx="${cx + 6.5}" cy="${footY + 3}" rx="6.5" ry="3" fill="#5e4434"/>`;
      s += chairFront(cx, seatY, footY);
    } else {
      // ----- standing -----
      feet = legBot + 5;
      // shoes peeking under skirt
      s += `<ellipse cx="${cx - 7}" cy="${legBot + 2}" rx="6.5" ry="3" fill="#5e4434"/>`;
      s += `<ellipse cx="${cx + 7}" cy="${legBot + 2}" rx="6.5" ry="3" fill="#5e4434"/>`;
      // skirt (kain) — gentle A-line
      const dSkirt = `M${cx - 17 - d.flare * 0.4},${hip} L${cx + 17 + d.flare * 0.4},${hip}
        L${cx + 22 + d.flare},${legBot} Q${cx},${legBot + 5} ${cx - 22 - d.flare},${legBot} Z`;
      s += `<path d="${dSkirt}" fill="url(#fl${uid})"/><path d="${dSkirt}" fill="${shade}"/>`;
    }

    // arms
    for (const ax of [cx - 21 - d.armW / 2, cx + 21 - d.armW / 2]) {
      s += `<rect x="${ax}" y="${armTop}" width="${d.armW}" height="${armBot - armTop}" rx="${d.armW / 2}" fill="${top}"/>`;
      s += `<rect x="${ax}" y="${armTop}" width="${d.armW}" height="${armBot - armTop}" rx="${d.armW / 2}" fill="${shade}"/>`;
    }
    s += `<circle cx="${cx - 21}" cy="${armBot + 2}" r="4.2" fill="${skinF}"/>`;
    s += `<circle cx="${cx + 21}" cy="${armBot + 2}" r="4.2" fill="${skinF}"/>`;
    // neck
    s += `<rect x="${cx - 4.5}" y="${headBot - 5}" width="9" height="10" fill="${darken(skin)}"/>`;
    // kurung top — loose, past hips (seated: ends at the seat)
    const kBot = wheel ? hip + 4 : kurungHem;
    const dKurung = `M${cx - 15},${tTop + 1} C${cx - 8},${tTop - 3} ${cx + 8},${tTop - 3} ${cx + 15},${tTop + 1}
      L${cx + 18 + d.flare * 0.6},${kBot} L${cx - 18 - d.flare * 0.6},${kBot} Z`;
    s += `<path d="${dKurung}" fill="${top}"/><path d="${dKurung}" fill="${shade}"/>`;
    // neckline trim
    s += `<path d="M${cx - 5},${tTop} q5,4 10,0" stroke="${topLine}" stroke-width="1.2" fill="none" opacity=".6"/>`;

    if (girl) {
      // hair: soft cap + fringe + two buns with a flower clip
      const hairC = "#2a1a10";
      s += `<path d="M${cx - 16},${cy + 3} Q${cx - 17},${cy - d.hry - 4} ${cx},${cy - d.hry - 5}
        Q${cx + 17},${cy - d.hry - 4} ${cx + 16},${cy + 3} L${cx + 13},${cy + 1}
        Q${cx + 13},${cy - d.hry + 2} ${cx},${cy - d.hry + 2} Q${cx - 13},${cy - d.hry + 2} ${cx - 13},${cy + 1} Z" fill="${hairC}"/>`;
      s += `<circle cx="${cx - 15}" cy="${cy - d.hry + 2}" r="5.4" fill="${hairC}"/>`;
      s += `<circle cx="${cx + 15}" cy="${cy - d.hry + 2}" r="5.4" fill="${hairC}"/>`;
      s += `<circle cx="${cx - 16.5}" cy="${cy - d.hry + 0.5}" r="1.6" fill="#fff" opacity=".22"/>`;
      s += `<ellipse cx="${cx}" cy="${cy}" rx="14.5" ry="${d.hry - 0.5}" fill="${skinF}"/>`;
      s += `<path d="M${cx - 13},${cy - 6} Q${cx - 6},${cy - d.hry - 1} ${cx + 2},${cy - 8}
        Q${cx + 9},${cy - d.hry - 1} ${cx + 13},${cy - 5} L${cx + 13},${cy - d.hry + 1}
        Q${cx},${cy - d.hry - 3} ${cx - 13},${cy - d.hry + 1} Z" fill="${hairC}"/>`;
      // flower clip
      for (const [fx, fy] of [[0, -2.2], [2.1, 0.8], [-2.1, 0.8], [1.4, 2.4], [-1.4, 2.4]])
        s += `<circle cx="${cx + 15 + fx}" cy="${cy - d.hry + 1 + fy}" r="1.6" fill="#f2a3b3"/>`;
      s += `<circle cx="${cx + 15}" cy="${cy - d.hry + 1.6}" r="1.2" fill="#e8c45e"/>`;
    } else {
      // tudung — smooth dome, drapes over shoulders to chest
      const dTud = `M${cx - 19},${cy + 4} Q${cx - 20},${cy - d.hry - 8} ${cx},${cy - d.hry - 8}
        Q${cx + 20},${cy - d.hry - 8} ${cx + 19},${cy + 4}
        L${cx + 24},${tTop + 22} Q${cx},${tTop + 34} ${cx - 24},${tTop + 22} Z`;
      s += `<path d="${dTud}" fill="${tud}"/><path d="${dTud}" fill="${shade}"/>`;
      s += `<ellipse cx="${cx - 7}" cy="${cy - d.hry - 1}" rx="7" ry="3" fill="#fff" opacity=".15"/>`;
      // subtle fold lines
      s += `<path d="M${cx - 17},${cy + 8} Q${cx - 14},${tTop + 16} ${cx - 8},${tTop + 24}" stroke="${tudLine}" stroke-width="1" fill="none" opacity=".4"/>`;
      s += `<path d="M${cx + 17},${cy + 8} Q${cx + 14},${tTop + 16} ${cx + 8},${tTop + 24}" stroke="${tudLine}" stroke-width="1" fill="none" opacity=".4"/>`;
      // brooch
      s += `<circle cx="${cx}" cy="${tTop + 10}" r="2.2" fill="#e8c45e"/><circle cx="${cx}" cy="${tTop + 10}" r="1" fill="#fff" opacity=".7"/>`;
      if (niqab) {
        // niqab: only the eyes show — soft slot + seam line below
        s += `<rect x="${cx - 11.5}" y="${cy - 7}" width="23" height="11.5" rx="5.5" fill="${skinF}"/>`;
        s += `<rect x="${cx - 11.5}" y="${cy - 7}" width="23" height="11.5" rx="5.5" fill="none" stroke="${tudLine}" stroke-width="1" opacity=".4"/>`;
        s += `<path d="M${cx - 12},${cy + 8} q12,3.5 24,0" stroke="${tudLine}" stroke-width="1" fill="none" opacity=".35"/>`;
      } else {
        // face opening
        s += `<ellipse cx="${cx}" cy="${cy + 1}" rx="12.5" ry="${d.hry - 2}" fill="${skinF}"/>`;
        s += `<ellipse cx="${cx - 4}" cy="${cy - 6}" rx="5" ry="3.4" fill="#fff" opacity=".12"/>`;
        s += `<ellipse cx="${cx}" cy="${cy + 1}" rx="12.5" ry="${d.hry - 2}" fill="none" stroke="${tudLine}" stroke-width="1" opacity=".35"/>`;
      }
    }
    s += face(cx, cy + 1, "F", bandName, skin, !girl && niqab);

    // OKU extras (over everything)
    if (oku === "penglihatan") {
      s += darkGlasses(cx, cy + 1);
      if (!wheel) s += whiteCane(cx + 21, armBot + 2, feet - 1);
    } else if (oku === "tongkat" && !wheel) {
      s += woodCane(cx + 21, armBot + 2, feet - 1);
    }
    return { svg: s, feet };
  }

  // ---------- public ----------
  function svg(person, opts = {}) {
    const p = person || {};
    const nowYear = opts.year || new Date().getFullYear();
    const age = ageOf(p, nowYear);
    const bandName = bandOf(age);
    const h = hash(String(p.id || "") + "|" + String(p.name || ""));
    const uid = (opts.uid !== undefined ? opts.uid : h.toString(36));
    const skin = SKIN[h % SKIN.length];
    const d = DIMS[bandName];
    const sex = p.sex === "F" ? "F" : "M";
    // validated enums only — anything else is ignored
    const attire = ["niqab", "niqabhitam", "jubah", "jubahputih"].includes(p.attire) ? p.attire : null;
    const okuRaw = String(p.oku || "").toLowerCase().replace(/[^a-z]/g, "");
    const oku = ["kerusiroda", "penglihatan", "tongkat"].includes(okuRaw) ? okuRaw : null;
    const niqabKind = (attire === "niqab" || attire === "niqabhitam") && age >= 13 ? attire : null;
    const jubahKind = attire === "jubah" || attire === "jubahputih" ? attire : null;
    const out = sex === "F"
      ? female(d, PAL_F[(h >>> 3) % PAL_F.length], skin, bandName, age, uid, niqabKind, oku)
      : male(d, PAL_M[(h >>> 3) % PAL_M.length], skin, bandName, uid, jubahKind, oku);
    // shared 3D-look defs: skin sheen, light-from-top-left shade overlay, blur
    const defs = `<defs>
      <radialGradient id="sk${uid}" cx="38%" cy="30%" r="80%">
        <stop offset="0%" stop-color="${lighten(skin, 0.30)}"/>
        <stop offset="58%" stop-color="${skin}"/>
        <stop offset="100%" stop-color="${mix(skin, "#8a5a30", 0.20)}"/>
      </radialGradient>
      <linearGradient id="sh${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity=".30"/>
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="62%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity=".22"/>
      </linearGradient>
      <filter id="bl${uid}" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2"/>
      </filter>
    </defs>`;
    // anchor feet to a common baseline so families line up nicely
    const shift = 218 - out.feet;
    return `<svg viewBox="0 0 120 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      ${defs}
      <ellipse cx="60" cy="221" rx="27" ry="4.5" fill="#000" opacity=".12" filter="url(#bl${uid})"/>
      <g transform="translate(0,${shift})">${out.svg}</g></svg>`;
  }

  return { svg, _ageOf: ageOf, _bandOf: bandOf };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Avatar;
