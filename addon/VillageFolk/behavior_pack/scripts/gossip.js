const GOSSIP_RADIUS   = 32; // blocks to scan for nearby villagers
const GOSSIP_CHANCE   = 0.25; // 25% chance to gossip instead of normal dialogue

// Get a random nearby villager that is not the speaker
export function getNearbyVillager(speaker, dim) {
  try {
    const candidates = dim.getEntities({
      families: ["villager"],
      location: speaker.location,
      maxDistance: GOSSIP_RADIUS,
    });

    // Filter out the speaker and unnamed villagers
    const others = candidates.filter(v => {
      if (v.id === speaker.id) return false;
      if (!v.nameTag) return false;
      return true;
    });

    if (others.length === 0) return null;

    return others[Math.floor(Math.random() * others.length)];
  } catch {
    return null;
  }
}

// Decide whether to gossip this dialogue tick
export function shouldGossip() {
  return Math.random() < GOSSIP_CHANCE;
}