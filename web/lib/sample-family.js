/**
 * Sample 5-generation family for the public calculator (/semak).
 * Same family as the engine test suite — includes polygamy, divorce,
 * half-siblings and in-laws, so visitors can explore real cases.
 */
const P = (name, sex, birthYear) => ({ name, sex, birthYear });

export const sampleFamily = {
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
    rohana: P("Rohana", "F", 1953),
  },
  children: [
    { parent: "awang", child: "hashim" }, { parent: "aminah", child: "hashim" },
    { parent: "awang", child: "halimah" }, { parent: "aminah", child: "halimah" },
    { parent: "awang", child: "hussin" }, { parent: "aminah", child: "hussin" },
    { parent: "hashim", child: "ahmad" }, { parent: "saloma", child: "ahmad" },
    { parent: "hashim", child: "aishah" }, { parent: "saloma", child: "aishah" },
    { parent: "halimah", child: "bakar" }, { parent: "dollah", child: "bakar" },
    { parent: "hussin", child: "cempaka" }, { parent: "tipah", child: "cempaka" },
    { parent: "hussin", child: "lokman" }, { parent: "timah", child: "lokman" },
    { parent: "zaki", child: "zainab" }, { parent: "zaiton", child: "zainab" },
    { parent: "ahmad", child: "daud" }, { parent: "zainab", child: "daud" },
    { parent: "ahmad", child: "dahlia" }, { parent: "zainab", child: "dahlia" },
    { parent: "aishah", child: "eddy" }, { parent: "kassim", child: "eddy" },
    { parent: "bakar", child: "faridah" }, { parent: "bedah", child: "faridah" },
    { parent: "daud", child: "ghani" }, { parent: "delima", child: "ghani" },
    { parent: "eddy", child: "hana" }, { parent: "esah", child: "hana" },
  ],
  unions: [
    { partners: ["awang", "aminah"], status: "kematian" },
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
