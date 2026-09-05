const C = "\u00A7";

// Effect config per event
export const eventEffects = {
  festival: {
    effect:     "hero_of_the_village",
    amplifier:  0,
    message:    `${C}e✦ Festival Discount! Trades are cheaper today!`,
  },
  market: {
    effect:     "hero_of_the_village",
    amplifier:  2,
    message:    `${C}6✦ Market Day! Big discounts on all trades!`,
  },
  harvest: {
    effect:     "hero_of_the_village",
    amplifier:  1,
    message:    `${C}a✦ Harvest Day! Enjoy discounted trades!`,
  },
  wanderer_arrival: {
    effect:     "hero_of_the_village",
    amplifier:  0,
    message:    `${C}b✦ Trader Arrived! Special trade prices today!`,
  },
  // No effect events
  storm:      { effect: null, amplifier: 0, message: null },
  full_moon:  { effect: null, amplifier: 0, message: null },
  raid_alert: { effect: null, amplifier: 0, message: null },
};

// Apply effect to all overworld players when event starts
export function applyEventEffect(event, players) {
  const config = eventEffects[event.id];
  if (!config || !config.effect) return;

  for (const player of players) {
    try {
      if (player.dimension.id !== "minecraft:overworld") continue;
      player.addEffect(
        config.effect,
        event.duration,
        {
          amplifier:     config.amplifier,
          showParticles: false
        }
      );
      // Notify player of discount
      if (config.message) {
        player.sendMessage(config.message);
      }
    } catch {}
  }
}

// Remove effect from all overworld players when event ends
export function removeEventEffect(event, players) {
  const config = eventEffects[event.id];
  if (!config || !config.effect) return;

  for (const player of players) {
    try {
      if (player.dimension.id !== "minecraft:overworld") continue;
      player.removeEffect(config.effect);
      player.sendMessage(
        `${C}7✦ The ${event.name} has ended. Prices are back to normal.`
      );
    } catch {}
  }
}

// Reapply effect to a player who joins mid-event
export function reapplyEventEffect(event, player, ticksRemaining) {
  const config = eventEffects[event.id];
  if (!config || !config.effect) return;

  try {
    if (player.dimension.id !== "minecraft:overworld") return;
    player.addEffect(
      config.effect,
      ticksRemaining,
      {
        amplifier:     config.amplifier,
        showParticles: false
      }
    );
  } catch {}
}