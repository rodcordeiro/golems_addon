import { world, system } from "@minecraft/server";
import { villagerNames } from "./names.js";
import { getProfessionData, stripColor } from "./professions.js";
import { getDialogueLine } from "./dialogue.js";
import { MOODS, detectMood, getMoodDialogueLine } from "./moods.js";
import {
  getWandererName,
  getWandererDialogue,
  buildWandererNameTag
} from "./wanderingtrader.js";
import {
  isHostile,
  getHostileType,
} from "./hostiles.js";
import { getHostileDialogue } from "./hostilesdialogue.js";
import {
  tryStartEvent,
  updateEvent,
  getActiveEvent,
  getEventDialogue,
  getEventAnnouncement,
  loadEventState,
  getEventTimeRemaining,
  getEventEndTick,
} from "./villageevent.js";
import {
  applyEventEffect,
  removeEventEffect,
  reapplyEventEffect,
} from "./eventeffects.js";
import { getNearbyVillager, shouldGossip } from "./gossip.js";
import { getGossipLine, pickGossipType } from "./gossipdialogue.js";

const C = "\u00A7";
const TALK_RADIUS      = 4;
const TALK_COOLDOWN    = 200;
const WANDERER_DESPAWN = 3600;
const WANDERER_WARN    = 3000;

const talkCooldowns     = new Map();
const villagerMoods     = new Map();
const wandererSpawnTick = new Map();

let lastActiveEventId = null;
let eventStartTick    = 0;

// Load event state after world is ready
system.run(() => {
  loadEventState();
});

function isWanderer(entity) {
  return entity.typeId === "minecraft:wandering_trader";
}

function getVillagersInDim(dim) {
  try { return dim.getEntities({ families: ["villager"] }); }
  catch { return []; }
}

function getWanderersInDim(dim) {
  try { return dim.getEntities({ type: "minecraft:wandering_trader" }); }
  catch { return []; }
}

function getHostilesInDim(dim) {
  try {
    const seen = new Set();
    const results = [];
    const candidates = [
      ...dim.getEntities({ families: ["illager"] }),
      ...dim.getEntities({ families: ["piglin"] }),
      ...dim.getEntities({ type: "minecraft:witch" }),
    ];
    for (const e of candidates) {
      if (!seen.has(e.id)) {
        seen.add(e.id);
        results.push(e);
      }
    }
    return results;
  } catch { return []; }
}

function getUsedNames() {
  const used = new Set();
  const dimensions = ["overworld", "nether", "the_end"];
  for (const dimId of dimensions) {
    try {
      const dim = world.getDimension(dimId);
      for (const v of getVillagersInDim(dim)) {
        if (v.nameTag) used.add(stripColor(v.nameTag));
      }
      for (const w of getWanderersInDim(dim)) {
        if (w.nameTag) used.add(stripColor(w.nameTag));
      }
    } catch {}
  }
  return used;
}

function getUniqueName(usedNames) {
  const available = villagerNames.filter(name => !usedNames.has(name));
  if (available.length === 0) {
    let compound;
    do {
      const a = villagerNames[Math.floor(Math.random() * villagerNames.length)];
      const b = villagerNames[Math.floor(Math.random() * villagerNames.length)];
      compound = `${a} ${b}`;
    } while (usedNames.has(compound));
    return compound;
  }
  return available[Math.floor(Math.random() * available.length)];
}

function buildNameTag(name, profColor, profLabel, mood) {
  const moodData = MOODS[mood] ?? MOODS.neutral;
  return (
    `${profColor}${name}\n` +
    `${C}7${profLabel}  ${moodData.symbol} ${moodData.color}${moodData.label}`
  );
}

function updateVillagerName(entity, dim) {
  const { color, label } = getProfessionData(entity);
  const mood = detectMood(entity, dim);
  villagerMoods.set(entity.id, mood);

  try {
    const storedName   = entity.getDynamicProperty("vf_name");
    const currentPlain = entity.nameTag
      ? stripColor(entity.nameTag)
      : null;

    if (!storedName || storedName === "") {
      const name = getUniqueName(getUsedNames());
      entity.setDynamicProperty("vf_name", name);
      entity.nameTag = buildNameTag(name, color, label, mood);
    } else if (currentPlain && currentPlain !== storedName) {
      entity.setDynamicProperty("vf_name", currentPlain);
      entity.nameTag = buildNameTag(currentPlain, color, label, mood);
    } else {
      entity.nameTag = buildNameTag(storedName, color, label, mood);
    }
  } catch {}
}

function updateWandererName(entity, dim) {
  const mood = detectMood(entity, dim);
  villagerMoods.set(entity.id, mood);

  try {
    const storedName   = entity.getDynamicProperty("vf_name");
    const currentPlain = entity.nameTag
      ? stripColor(entity.nameTag)
      : null;

    if (!storedName || storedName === "") {
      const name = getWandererName(getUsedNames());
      entity.setDynamicProperty("vf_name", name);
      entity.nameTag = buildWandererNameTag(name, mood);
    } else if (currentPlain && currentPlain !== storedName) {
      entity.setDynamicProperty("vf_name", currentPlain);
      entity.nameTag = buildWandererNameTag(currentPlain, mood);
    } else {
      entity.nameTag = buildWandererNameTag(storedName, mood);
    }
  } catch {}
}

function announceToNearby(entity, message, radius = 16) {
  try {
    for (const player of world.getAllPlayers()) {
      if (player.dimension.id !== entity.dimension.id) continue;
      const dx = player.location.x - entity.location.x;
      const dy = player.location.y - entity.location.y;
      const dz = player.location.z - entity.location.z;
      if (Math.sqrt(dx*dx + dy*dy + dz*dz) <= radius) {
        player.onScreenDisplay.setActionBar(message);
      }
    }
  } catch {}
}

function checkWandererDespawn() {
  const currentTick = system.currentTick;
  const dimensions  = ["overworld", "nether", "the_end"];

  for (const dimId of dimensions) {
    try {
      const dim = world.getDimension(dimId);
      for (const wanderer of getWanderersInDim(dim)) {
        const id        = wanderer.id;
        const spawnTick = wandererSpawnTick.get(id);

        if (spawnTick === undefined) {
          wandererSpawnTick.set(id, currentTick);
          continue;
        }

        const elapsed = currentTick - spawnTick;
        const name    = stripColor(wanderer.nameTag ?? "Wandering Trader");

        if (elapsed >= 40 && elapsed < 80) {
          announceToNearby(
            wanderer,
            `${C}b${name}${C}7: ${C}fGreetings traveler! I won't be here long, come trade!`,
            24
          );
        }

        if (elapsed >= WANDERER_WARN && elapsed < WANDERER_WARN + 40) {
          announceToNearby(
            wanderer,
            `${C}b${name}${C}7: ${C}eI must be on my way soon, last chance to trade!`,
            24
          );
        }

        if (elapsed >= WANDERER_DESPAWN - 60 && elapsed < WANDERER_DESPAWN - 20) {
          announceToNearby(
            wanderer,
            `${C}b${name}${C}7: ${C}7Farewell traveler, until we meet again!`,
            24
          );
        }

        if (elapsed >= WANDERER_DESPAWN) {
          try {
            wanderer.remove();
            wandererSpawnTick.delete(id);
            villagerMoods.delete(id);
            talkCooldowns.delete(id);
          } catch {}
        }
      }
    } catch {}
  }
}

function getDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  const dz = pos1.z - pos2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function checkDialogue() {
  const players     = world.getAllPlayers();
  const dimensions  = ["overworld", "nether", "the_end"];
  const currentTick = system.currentTick;
  const activeEvent = getActiveEvent();

  for (const player of players) {
    for (const dimId of dimensions) {
      try {
        const dim = world.getDimension(dimId);
        const allEntities = [
          ...getVillagersInDim(dim),
          ...getWanderersInDim(dim),
          ...getHostilesInDim(dim),
        ];

        for (const entity of allEntities) {
          if (player.dimension.id !== entity.dimension.id) continue;

          const dist = getDistance(player.location, entity.location);
          if (dist <= TALK_RADIUS) {
            const id       = entity.id;
            const lastTalk = talkCooldowns.get(id) ?? 0;

            if (currentTick - lastTalk >= TALK_COOLDOWN) {
              talkCooldowns.set(id, currentTick);

              let line;
              let displayName;

              if (isHostile(entity)) {
                const type  = getHostileType(entity);
                displayName = type.charAt(0).toUpperCase() + type.slice(1);
                line        = getHostileDialogue(type);

              } else if (isWanderer(entity)) {
                displayName = entity.nameTag
                  ? stripColor(entity.nameTag)
                  : "Wandering Trader";

                const spawnTick = wandererSpawnTick.get(id);
                const elapsed   = spawnTick ? currentTick - spawnTick : 0;
                const remaining = Math.max(
                  0, Math.floor((WANDERER_DESPAWN - elapsed) / 20)
                );

                const mood = villagerMoods.get(id) ?? "neutral";
                line = remaining <= 60
                  ? `I only have ${remaining}s left here, trade fast!`
                  : activeEvent
                    ? getEventDialogue(activeEvent)
                    : getWandererDialogue(mood);

              } else {
                // Villager dialogue with gossip system
                displayName = entity.nameTag
                  ? stripColor(entity.nameTag)
                  : "Villager";

                const mood = villagerMoods.get(id) ?? "neutral";

                if (activeEvent) {
                  // Event dialogue takes highest priority
                  line = getEventDialogue(activeEvent);

                } else if (mood === "scared" || mood === "sad") {
                  // Mood dialogue takes second priority
                  line = getMoodDialogueLine(mood);

                } else if (shouldGossip()) {
                  // Gossip — try to find a nearby villager to gossip about
                  const target = getNearbyVillager(entity, dim);

                  if (target) {
                    const targetName   = stripColor(target.nameTag);
                    const targetLabel  = getProfessionData(target).label;
                    const gossipType   = pickGossipType();
                    line = getGossipLine(gossipType, targetName, targetLabel);
                  } else {
                    // No nearby villager found — fall back to profession dialogue
                    line = getDialogueLine(getProfessionData(entity).label);
                  }

                } else {
                  // Normal profession dialogue
                  line = getDialogueLine(getProfessionData(entity).label);
                }
              }

              player.onScreenDisplay.setActionBar(
                `${C}e${displayName}${C}7: ${C}f${line}`
              );
            }
          }
        }
      } catch {}
    }
  }
}

function announceEvent(event) {
  const players = world.getAllPlayers();
  try {
    for (const player of players) {
      if (player.dimension.id === "minecraft:overworld") {
        player.sendMessage(
          `${C}7[ ${getEventAnnouncement(event)} ${C}7]`
        );
      }
    }
    applyEventEffect(event, players);
  } catch {}
}

world.afterEvents.entitySpawn.subscribe((event) => {
  const entity = event.entity;
  try {
    const dim = world.getDimension(entity.dimension.id);
    if (isWanderer(entity)) {
      updateWandererName(entity, dim);
      wandererSpawnTick.set(entity.id, system.currentTick);

      if (entity.dimension.id === "minecraft:overworld") {
        system.runTimeout(() => {
          try {
            if (!entity.isValid()) return;
            const name = stripColor(entity.nameTag ?? "Wandering Trader");
            for (const player of world.getAllPlayers()) {
              if (player.dimension.id === "minecraft:overworld") {
                player.sendMessage(
                  `${C}7[ ${C}b${C}l${name} ${C}7has arrived! They won't stay long! ]`
                );
              }
            }
          } catch {}
        }, 20);
      }

    } else if (entity.matches({ families: ["villager"] })) {
      updateVillagerName(entity, dim);
    }
  } catch {}
});

world.afterEvents.entityDie.subscribe((event) => {
  const id = event.deadEntity.id;
  talkCooldowns.delete(id);
  villagerMoods.delete(id);
  wandererSpawnTick.delete(id);
});

system.runInterval(() => {
  const dimensions = ["overworld", "nether", "the_end"];
  for (const dimId of dimensions) {
    try {
      const dim = world.getDimension(dimId);
      for (const v of getVillagersInDim(dim)) updateVillagerName(v, dim);
      for (const w of getWanderersInDim(dim)) updateWandererName(w, dim);
    } catch {}
  }
}, 100);

system.runInterval(() => {
  checkWandererDespawn();
}, 20);

system.runInterval(() => {
  for (const [id] of wandererSpawnTick) {
    let found = false;
    try {
      const dim = world.getDimension("overworld");
      found = getWanderersInDim(dim).some(w => w.id === id);
    } catch {}
    if (!found) {
      wandererSpawnTick.delete(id);
      villagerMoods.delete(id);
      talkCooldowns.delete(id);
    }
  }
}, 200);

system.runInterval(() => {
  const currentTick = system.currentTick;
  const prevEvent   = getActiveEvent();
  updateEvent(currentTick);
  const activeEvent = getActiveEvent();
  const newEvent    = tryStartEvent(currentTick);

  if (prevEvent && !activeEvent) {
    removeEventEffect(prevEvent, world.getAllPlayers());
    lastActiveEventId = null;
  }

  if (newEvent) {
    announceEvent(newEvent);
    lastActiveEventId = newEvent.id;
    eventStartTick    = currentTick;
  }
}, 600);

world.afterEvents.playerSpawn.subscribe((event) => {
  const player      = event.player;
  const activeEvent = getActiveEvent();
  if (!activeEvent) return;

  try {
    const currentTick    = system.currentTick;
    const ticksRemaining = Math.max(0, getEventEndTick() - currentTick);
    reapplyEventEffect(activeEvent, player, ticksRemaining);
  } catch {}
});

system.runInterval(() => {
  const activeEvent = getActiveEvent();
  if (!activeEvent) return;

  const currentTick = system.currentTick;
  const elapsed     = currentTick - eventStartTick;
  const remaining   = Math.max(0, getEventEndTick() - currentTick);

  const inStartWindow = elapsed <= 60;
  const inEndWindow   = remaining <= 60;

  if (!inStartWindow && !inEndWindow) return;

  const timeLeft = getEventTimeRemaining(currentTick);

  for (const player of world.getAllPlayers()) {
    if (player.dimension.id !== "minecraft:overworld") continue;
    try {
      player.onScreenDisplay.setTitle(
        activeEvent.title,
        {
          subtitle: inEndWindow
            ? `${C}c${C}lEnding in ${C}e${timeLeft}`
            : `${C}7Ends in ${C}e${timeLeft}`,
          fadeInDuration:  0,
          stayDuration:    20,
          fadeOutDuration: 5,
        }
      );
    } catch {}
  }
}, 20);

system.runInterval(() => {
  checkDialogue();
}, 10);