const C = "\u00A7";

export const professions = {
  farmer:        { color: `${C}a`, label: "Farmer" },
  fisherman:     { color: `${C}b`, label: "Fisherman" },
  shepherd:      { color: `${C}d`, label: "Shepherd" },
  fletcher:      { color: `${C}e`, label: "Fletcher" },
  librarian:     { color: `${C}9`, label: "Librarian" },
  cartographer:  { color: `${C}3`, label: "Cartographer" },
  cleric:        { color: `${C}5`, label: "Cleric" },
  armorer:       { color: `${C}7`, label: "Armorer" },
  weaponsmith:   { color: `${C}c`, label: "Weaponsmith" },
  toolsmith:     { color: `${C}6`, label: "Toolsmith" },
  butcher:       { color: `${C}4`, label: "Butcher" },
  leatherworker: { color: `${C}8`, label: "Leatherworker" },
  mason:         { color: `${C}f`, label: "Mason" },
  nitwit:        { color: `${C}2`, label: "Nitwit" },
};

export function getProfessionData(entity) {
  try {
    for (const [key, data] of Object.entries(professions)) {
      if (entity.matches({ families: [key] })) {
        return data;
      }
    }
  } catch {}
  return { color: `${C}7`, label: "Unemployed" };
}

export function stripColor(name) {
  return name.replace(/\u00A7[0-9a-fk-or]/g, "").split("\n")[0].trim();
}