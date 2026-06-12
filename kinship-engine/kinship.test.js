/**
 * Kinship Engine test suite — scenarios taken from the Phase 1 & 2 research docs.
 * Run with:  node kinship.test.js
 * Every line prints PASS or FAIL. Exit code 1 if anything fails.
 */

const { computeKinship } = require("./kinship.js");

// ---------- Sample family: 5 generations, includes polygamy + in-laws ----------
//
// Gen1  Awang (M,1900) ⚭ Aminah (F,1903)
// Gen2  ├─ Hashim (M,1925) ⚭ Saloma (F,1928)
//       ├─ Halimah (F,1928) ⚭ Dollah (M,1925)
//       └─ Hussin (M,1930) ⚭ Tipah (F,1932)  &  ⚭ Timah (F,1940)  ← polygamous
// Gen3  Hashim's: Ahmad (M,1950) ⚭ Zainab (F,1952), Aishah (F,1953) ⚭ Kassim (M,1950)
//       Halimah's: Bakar (M,1952) ⚭ Bedah (F,1954)
//       Hussin+Tipah: Cempaka (F,1955) | Hussin+Timah: Lokman (M,1960) ← half-siblings
// Gen4  Ahmad's: Daud (M,1975) ⚭ Delima (F,1977), Dahlia (F,1978)
//       Aishah's: Eddy (M,1976) ⚭ Esah (F,1978)
//       Bakar's: Faridah (F,1977)
// Gen5  Daud's: Ghani (M,2000) | Eddy's: Hana (F,2002)
// Zainab's parents: Zaki (M,1925) ⚭ Zaiton (F,1930)   ← for besan/mertua tests

const P = (name, sex, birthYear) => ({ name, sex, birthYear });

const family = {
  persons: {
    awang: P("Awang", "M", 1900), aminah: P("Aminah", "F", 1903),
    hashim: P("Hashim", "M", 1925), saloma: P("Saloma", "F", 1928),
    halimah: P("Halimah", "F", 1928), dollah: P("Dollah", "M", 1925),
    hussin: P("Hussin", "M", 1930), tipah: P("Tipah", "F", 1932), timah: P("Timah", "F", 1940),
    ahmad: P("Ahmad", "M", 1950), zainab: P("Zainab", "F", 1952),
    aishah: P("Aishah", "F", 1953), kassim: P("Kassim", "M", 1950),
    bakar: P("Bakar", "M", 1952), bedah: P("Bedah", "F", 1954),
    cempaka: P("Cempaka", "F", 1955), lokman: P("Lokman", "M", 1960),
    daud: P("Daud", "M", 1975), delima: P("Delima", "F", 1977),
    dahlia: P("Dahlia", "F", 1978),
    eddy: P("Eddy", "M", 1976), esah: P("Esah", "F", 1978),
    faridah: P("Faridah", "F", 1977),
    ghani: P("Ghani", "M", 2000), hana: P("Hana", "F", 2002),
    zaki: P("Zaki", "M", 1925), zaiton: P("Zaiton", "F", 1930),
    rohana: P("Rohana", "F", 1953), // Bakar's first wife — divorced
  },
  children: [
    // Gen1 → Gen2
    { parent: "awang", child: "hashim" }, { parent: "aminah", child: "hashim" },
    { parent: "awang", child: "halimah" }, { parent: "aminah", child: "halimah" },
    { parent: "awang", child: "hussin" }, { parent: "aminah", child: "hussin" },
    // Gen2 → Gen3
    { parent: "hashim", child: "ahmad" }, { parent: "saloma", child: "ahmad" },
    { parent: "hashim", child: "aishah" }, { parent: "saloma", child: "aishah" },
    { parent: "halimah", child: "bakar" }, { parent: "dollah", child: "bakar" },
    { parent: "hussin", child: "cempaka" }, { parent: "tipah", child: "cempaka" },
    { parent: "hussin", child: "lokman" }, { parent: "timah", child: "lokman" },
    // Zainab's parents
    { parent: "zaki", child: "zainab" }, { parent: "zaiton", child: "zainab" },
    // Gen3 → Gen4
    { parent: "ahmad", child: "daud" }, { parent: "zainab", child: "daud" },
    { parent: "ahmad", child: "dahlia" }, { parent: "zainab", child: "dahlia" },
    { parent: "aishah", child: "eddy" }, { parent: "kassim", child: "eddy" },
    { parent: "bakar", child: "faridah" }, { parent: "bedah", child: "faridah" },
    // Gen4 → Gen5
    { parent: "daud", child: "ghani" }, { parent: "delima", child: "ghani" },
    { parent: "eddy", child: "hana" }, { parent: "esah", child: "hana" },
  ],
  unions: [
    { partners: ["awang", "aminah"], status: "kematian" }, // marriage ended by death
    { partners: ["bakar", "rohana"], status: "cerai", nikahYear: 1971, ceraiYear: 1974 },
    { partners: ["hashim", "saloma"] },
    { partners: ["halimah", "dollah"] },
    { partners: ["hussin", "tipah"] },
    { partners: ["hussin", "timah"] },
    { partners: ["ahmad", "zainab"] },
    { partners: ["aishah", "kassim"] },
    { partners: ["bakar", "bedah"] },
    { partners: ["daud", "delima"] },
    { partners: ["eddy", "esah"] },
    { partners: ["zaki", "zaiton"] },
  ],
};

// ---------- tiny test runner ----------
let pass = 0, fail = 0;
function check(desc, a, b, expectAtoB, expectBtoA) {
  const r = computeKinship(family, a, b);
  const okA = r.aCallsB.label === expectAtoB;
  const okB = expectBtoA === undefined || r.bCallsA.label === expectBtoA;
  if (okA && okB) {
    pass++;
    console.log(`PASS  ${desc}`);
  } else {
    fail++;
    console.log(`FAIL  ${desc}`);
    if (!okA) console.log(`      A→B expected "${expectAtoB}", got "${r.aCallsB.label}"`);
    if (!okB) console.log(`      B→A expected "${expectBtoA}", got "${r.bCallsA.label}"`);
  }
}

console.log("\n— Same generation —");
check("Ahmad → Aishah (younger sister)", "ahmad", "aishah", "Adik perempuan", "Abang");
check("Aishah → Ahmad (older brother)", "aishah", "ahmad", "Abang", "Adik perempuan");
check("Ahmad ↔ Bakar (cousins)", "ahmad", "bakar", "Sepupu", "Sepupu");
check("Daud ↔ Eddy (cousins via Hashim)", "daud", "eddy", "Sepupu", "Sepupu");
check("Daud ↔ Faridah (2nd cousins via Awang)", "daud", "faridah", "Sepupu dua kali", "Sepupu dua kali");
check("Ghani ↔ Hana (2nd cousins)", "ghani", "hana", "Sepupu dua kali", "Sepupu dua kali");
check("Cempaka ↔ Lokman (half-siblings, same father)", "cempaka", "lokman", "Adik lelaki (sebapa)", "Kakak (sebapa)");

console.log("\n— Direct line —");
check("Ahmad → Saloma (mother)", "ahmad", "saloma", "Ibu", "Anak lelaki");
check("Ahmad → Awang (grandfather)", "ahmad", "awang", "Datuk", "Cucu lelaki");
check("Ghani → Ahmad (grandfather)", "ghani", "ahmad", "Datuk", "Cucu lelaki");
check("Ghani → Hashim (great-grandfather)", "ghani", "hashim", "Moyang", "Cicit");
check("Ghani → Awang (great-great-grandfather)", "ghani", "awang", "Moyang Besar", "Piut");

console.log("\n— Diagonal (research §5 worked examples) —");
check("Ahmad → Halimah (father's sister)", "ahmad", "halimah", "Makcik", "Anak saudara");
check("Cempaka → Hashim (father's brother)", "cempaka", "hashim", "Pakcik", "Anak saudara");
check("Ex C: Ghani → Aishah (datuk's sibling)", "ghani", "aishah", "Nenek saudara", "Cucu saudara");
check("Ex A: Ahmad → Faridah (cousin's child)", "ahmad", "faridah", "Anak sepupu", "Pakcik sepupu");
check("Ex B: Daud → Bakar (father's cousin)", "daud", "bakar", "Pakcik sepupu", "Anak sepupu");
check("Ex D: Ahmad → Ghani's view reversed — Ghani → Bakar (pakcik's grandchild's view up)", "ghani", "bakar", "Datuk sepupu", "Cucu sepupu");

console.log("\n— Marriage (affinal) —");
check("Ahmad → Zainab (wife)", "ahmad", "zainab", "Isteri", "Suami");
check("Zainab → Hashim (husband's father)", "zainab", "hashim", "Bapa mertua", "Menantu perempuan");
check("Hashim → Zainab (son's wife)", "hashim", "zainab", "Menantu perempuan", "Bapa mertua");
check("Zainab → Aishah (husband's younger sister)", "zainab", "aishah", "Adik ipar", "Kakak ipar");
check("Zainab → Kassim (husband's sister's husband)", "zainab", "kassim", "Biras", "Biras");
check("Hashim → Zaki (son's wife's father)", "hashim", "zaki", "Besan", "Besan");
check("Ahmad → Tipah (uncle's wife)", "ahmad", "tipah", "Makcik (melalui perkahwinan)");
check("Ahmad → Bedah (cousin's wife)", "ahmad", "bedah", "Isteri sepupu");

console.log("\n— Polygamy, divorce & widowhood —");
check("Tipah ↔ Timah (co-wives of Hussin)", "tipah", "timah", "Madu", "Madu");
check("Bakar → Rohana (divorced)", "bakar", "rohana", "Bekas isteri", "Bekas suami");
check("Rohana → Halimah (ex-mother-in-law — chain dissolved)", "rohana", "halimah",
      "Tiada hubungan ditemui dalam pokok ini");
check("Awang → Aminah (marriage ended by death — label kept)", "awang", "aminah", "Isteri", "Suami");
check("Faridah → Rohana (father's ex-wife, no blood)", "faridah", "rohana",
      "Tiada hubungan ditemui dalam pokok ini");

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
