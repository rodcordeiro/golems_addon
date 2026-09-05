import { world } from "@minecraft/server";

const C = "\u00A7";

export const villageEvents = [
  {
    id: "festival",
    name: "Village Festival",
    symbol: `${C}e\uD83C\uDF89`,
    color: `${C}e`,
    title: `${C}e${C}lVillage Festival`, // ← no emoji for title
    duration: 6000,
    cooldown: 72000,
    dialogue: [
      "Come celebrate the village festival!",
      "Today is a festival day, rejoice!",
      "The festival has begun, join us!",
      "Music and food for everyone today!",
      "The whole village is celebrating!",
      "I baked special bread for the festival!",
      "The festival only comes once in a while!",
      "Dance and trade, it is festival time!",
      "I have been waiting for this festival!",
      "The village elder declared today a holiday!",
      "The village square is decorated beautifully!",
      "I wore my best clothes for the festival!",
      "The children are so happy today!",
      "Free food for everyone at the festival!",
      "I have been cooking all week for this!",
      "The festival bonfire burns bright tonight!",
      "I won the apple bobbing contest!",
      "The musicians are playing all day long!",
      "I traded more today than any other day!",
      "The festival brings the whole region together!",
    ],
  },
  {
    id: "market",
    name: "Market Day",
    symbol: `${C}6\uD83D\uDED2`,
    color: `${C}6`,
    title: `${C}6${C}lMarket Day`,
    duration: 6000,
    cooldown: 48000,
    dialogue: [
      "Market day! Best prices in the village!",
      "Come trade, it is market day today!",
      "I restocked everything for market day!",
      "The best deals happen on market day!",
      "Hurry, market day does not last forever!",
      "I have rare items today for market day!",
      "Everyone is trading today, join in!",
      "Market day brings the whole village alive!",
      "I saved my best stock for market day!",
      "Fresh goods available for market day!",
      "I set up my stall before sunrise today!",
      "The emerald prices are great today!",
      "I sold out of stock within the first hour!",
      "Every villager has something to sell today!",
      "The market square is packed with traders!",
      "I found a rare item at another stall!",
      "Market day only comes around so often!",
      "I bartered three items before breakfast!",
      "The butcher has special cuts for market day!",
      "I love the energy of market day!",
    ],
  },
  {
    id: "storm",
    name: "Storm Warning",
    symbol: `${C}8\u26C8`,
    color: `${C}8`,
    title: `${C}8${C}lStorm Warning`,
    duration: 3000,
    cooldown: 36000,
    dialogue: [
      "A big storm is coming, take shelter!",
      "I can feel the storm in my bones!",
      "Board up the windows, storm is near!",
      "The clouds look terrible today...",
      "Stay indoors, the storm will be bad!",
      "I moved my crops inside before the storm.",
      "The animals are restless, storm incoming!",
      "Last storm flooded the whole square!",
      "I hope the storm passes quickly...",
      "The village elder warned us of this storm!",
      "The wind is picking up, not good...",
      "I tied down my market stall just in time!",
      "The farmer is worried about his crops.",
      "I stocked up on food before the storm.",
      "The sky turned green, very bad sign!",
      "I heard thunder in the distance already.",
      "The cleric says the storm will be severe.",
      "My roof started leaking in the last storm.",
      "I filled up water buckets before the storm.",
      "Stay away from tall trees in this weather!",
    ],
  },
  {
    id: "harvest",
    name: "Harvest Day",
    symbol: `${C}a\uD83C\uDF3E`,
    color: `${C}a`,
    title: `${C}a${C}lHarvest Day`,
    duration: 6000,
    cooldown: 60000,
    dialogue: [
      "Harvest day is finally here!",
      "The fields are ready to be harvested!",
      "Best harvest we have had in years!",
      "Everyone is out helping with the harvest!",
      "Fresh produce from todays harvest!",
      "The harvest looks amazing this season!",
      "I have been waiting for harvest day!",
      "Help yourself to the harvest surplus!",
      "The crops are golden and ready!",
      "Harvest day feeds the whole village!",
      "The whole village is working the fields!",
      "I have never seen such big pumpkins!",
      "The farmer has been smiling all day!",
      "We will eat well this winter thanks to today!",
      "I helped carry wheat bales all morning.",
      "The harvest cart is overflowing with crops!",
      "Every hand in the village is needed today!",
      "The apple trees are loaded this harvest!",
      "I traded fresh vegetables for emeralds today!",
      "A good harvest means a prosperous winter!",
    ],
  },
  {
    id: "raid_alert",
    name: "Raid Alert",
    symbol: `${C}c\u2694`,
    color: `${C}c`,
    title: `${C}c${C}lRaid Alert`,
    duration: 2400,
    cooldown: 24000,
    dialogue: [
      "Pillagers were spotted nearby!",
      "Sound the alarm, raiders are coming!",
      "Get inside, a raid is approaching!",
      "The watchtower spotted Pillagers!",
      "Hide your valuables, raid incoming!",
      "The Iron Golem is preparing for battle!",
      "I saw a Pillager banner to the north!",
      "Lock your doors, raiders are near!",
      "The village is under threat again!",
      "Stay together, there is strength in numbers!",
      "I saw at least ten Pillagers to the north!",
      "The raid horn has been sounded!",
      "The Iron Golem is already at the gate!",
      "I am hiding my emeralds right now!",
      "The children have been moved to safety.",
      "Every able villager must help defend!",
      "The last raid destroyed three houses!",
      "I sharpened my tools just in case.",
      "The Pillager captain carries a banner!",
      "We survived the last raid, we will survive this!",
    ],
  },
  {
    id: "full_moon",
    name: "Full Moon",
    symbol: `${C}f\uD83C\uDF15`,
    color: `${C}f`,
    title: `${C}f${C}lFull Moon`,
    duration: 4800,
    cooldown: 48000,
    dialogue: [
      "The full moon rises tonight, be careful!",
      "Strange things happen on a full moon...",
      "I never sleep well on a full moon.",
      "The full moon makes the monsters stronger!",
      "Lock your doors, it is a full moon tonight!",
      "The full moon light is beautiful but dangerous.",
      "I saw a skeleton riding a spider last full moon!",
      "The cleric warned us about this full moon.",
      "Full moon means more undead tonight.",
      "The village guard doubled up for the full moon!",
      "I counted six phantoms last full moon!",
      "The wolves are howling more than usual.",
      "I triple locked my door tonight.",
      "The cleric lit extra torches around the village.",
      "Every torch in the village is lit tonight!",
      "I heard the undead stirring in the graveyard.",
      "The full moon turns peaceful nights dangerous.",
      "I will not sleep until sunrise tonight.",
      "The skeletons seem more aggressive tonight.",
      "Even the animals are frightened tonight.",
    ],
  },
  {
    id: "wanderer_arrival",
    name: "Trader Arrived",
    symbol: `${C}b\uD83E\uDDF3`,
    color: `${C}b`,
    title: `${C}b${C}lTrader Arrived`,
    duration: 3000,
    cooldown: 36000,
    dialogue: [
      "A Wandering Trader just arrived!",
      "Rare goods are here, trader has arrived!",
      "The Wandering Trader brought exotic items!",
      "Go see the trader before they leave!",
      "I heard the trader has special items today!",
      "The Wandering Trader does not stay long!",
      "Hurry, the trader arrives rarely!",
      "Exotic goods from distant lands are here!",
      "The trader brought things I have never seen!",
      "Go trade before the Wandering Trader leaves!",
      "The trader has llamas loaded with goods!",
      "I saw the trader coming down the road!",
      "The trader has plants I have never seen!",
      "I traded three emeralds for something exotic!",
      "The trader knows the way to every village!",
      "I asked the trader where he came from.",
      "The trader brought seeds from distant lands!",
      "I hope the trader stays longer this time.",
      "The trader has potions I cannot identify!",
      "Every visit from the trader is special!",
    ],
  },
];

let activeEvent      = null;
let eventEndTick     = 0;
let lastEventEndTick = 0;
let eventCooldowns   = {};

const MIN_GAP = 12000;

export function loadEventState() {
  try {
    const saved = world.getDynamicProperty("vf_event_cooldowns");
    if (saved) eventCooldowns = JSON.parse(saved);
  } catch {}
  activeEvent      = null;
  eventEndTick     = 0;
  lastEventEndTick = 0;
}

export function saveEventState() {
  try {
    world.setDynamicProperty(
      "vf_event_cooldowns",
      JSON.stringify(eventCooldowns)
    );
  } catch {}
}

export function tryStartEvent(currentTick) {
  if (activeEvent) return null;
  if (currentTick - lastEventEndTick < MIN_GAP) return null;

  const now = Date.now();
  const available = villageEvents.filter(e => {
    const lastEnd = eventCooldowns[e.id] ?? 0;
    return now - lastEnd >= e.cooldown * 50;
  });

  if (available.length === 0) return null;
  if (Math.random() > 0.10) return null;

  const event  = available[Math.floor(Math.random() * available.length)];
  activeEvent  = event;
  eventEndTick = currentTick + event.duration;

  eventCooldowns[event.id] = now;
  saveEventState();
  return event;
}

export function updateEvent(currentTick) {
  if (!activeEvent) return null;

  if (currentTick >= eventEndTick) {
    eventCooldowns[activeEvent.id] = Date.now();
    lastEventEndTick = currentTick;
    activeEvent = null;
    saveEventState();
    return null;
  }

  return activeEvent;
}

export function getActiveEvent() {
  return activeEvent;
}

export function getEventDialogue(event) {
  const lines = event.dialogue;
  return lines[Math.floor(Math.random() * lines.length)];
}

export function getEventAnnouncement(event) {
  return `${event.symbol} ${event.color}${event.name} ${event.symbol}`;
}

export function getEventTimeRemaining(currentTick) {
  if (!activeEvent) return null;
  const remaining = Math.max(0, eventEndTick - currentTick);
  const seconds   = Math.floor(remaining / 20);
  const minutes   = Math.floor(seconds / 60);
  const secs      = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function getEventEndTick() {
  return eventEndTick;
}