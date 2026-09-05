// Detect which hostile type the entity is
export function getHostileType(entity) {
  try {
    if (entity.matches({ families: ["illager"] })) return "illager";
    if (entity.matches({ families: ["piglin"] }))  return "piglin";
    if (entity.matches({ families: ["witch"] }))   return "witch";
  } catch {}
  return null;
}

// Check if entity is a supported hostile
export function isHostile(entity) {
  return getHostileType(entity) !== null;
}