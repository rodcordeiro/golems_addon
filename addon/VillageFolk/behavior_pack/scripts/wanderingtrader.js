const C = "\u00A7";

// Wandering trader names pool
export const wandererNames = [
  "Zander", "Ronan", "Cade", "Leif", "Arlo",
  "Sable", "Drifter", "Waylen", "Corvin", "Flint",
  "Ashby", "Ember", "Gale", "Haven", "Indie",
  "Journey", "Knox", "Lark", "Mesa", "North",
  "Onyx", "Piper", "Quest", "Ridge", "Scout",
  "Terra", "Vale", "West", "Zephyr", "Blaze"
];

// Wandering trader title
export const wandererTitle = `${C}b${C}lWandering Trader`;

// Wandering trader dialogue
export const wandererDialogue = [
  "I have traveled far to trade with you!",
  "Rare goods from distant lands, have a look!",
  "I won't be here long, so trade quickly!",
  "I've seen things you wouldn't believe out there.",
  "My llamas are tired but my wares are fresh!",
  "From the jungle to the tundra, I've been everywhere.",
  "These items are one of a kind, I promise!",
  "I travel the world so you don't have to!",
  "The road is long but the trades are worth it.",
  "I found this in a place far, far away.",
  "My prices are fair for such rare goods!",
  "I set up camp here for just a short while.",
  "Every trade tells a story of my travels.",
  "I carry only the most exotic wares.",
  "The wilderness holds many secrets I've uncovered.",
  "I've traded in every biome imaginable.",
  "My llamas know every trail in the land.",
  "Hurry! I move on before the next sunrise.",
  "No village is too far for me to visit!",
  "These goods were worth the long journey!",
];

// Wandering trader mood dialogue
export const wandererMoodDialogue = {
  scared: [
    "This place feels dangerous, let's trade fast!",
    "I don't like the look of those shadows...",
    "My llamas are restless, something is near!",
    "I've faced many dangers on the road...",
    "Stay close, traveler. I sense trouble.",
  ],
  sad: [
    "The rain makes the road so muddy...",
    "Traveling in this weather is miserable.",
    "Even my llamas hate the rain.",
    "I miss sunny skies on the open road.",
    "This storm has slowed my journey greatly.",
  ],
  happy: [
    "What a perfect day to trade!",
    "The sun makes every journey worthwhile!",
    "Clear skies mean clear roads ahead!",
    "Days like this remind me why I travel!",
    "My best trades always happen on sunny days!",
  ]
};

// Get a random wandering trader dialogue line
export function getWandererDialogue(mood) {
  if (mood !== "neutral") {
    const moodLines = wandererMoodDialogue[mood];
    if (moodLines) {
      return moodLines[Math.floor(Math.random() * moodLines.length)];
    }
  }
  return wandererDialogue[Math.floor(Math.random() * wandererDialogue.length)];
}

// Get a random wandering trader name
export function getWandererName(usedNames) {
  const available = wandererNames.filter(name => !usedNames.has(name));

  if (available.length === 0) {
    let compound;
    do {
      const a = wandererNames[Math.floor(Math.random() * wandererNames.length)];
      const b = wandererNames[Math.floor(Math.random() * wandererNames.length)];
      compound = `${a} ${b}`;
    } while (usedNames.has(compound));
    return compound;
  }

  return available[Math.floor(Math.random() * available.length)];
}

// Build wandering trader name tag
export function buildWandererNameTag(name, mood) {
  const moodSymbols = {
    happy:   `${C}e\u2726 ${C}eHappy`,
    neutral: `${C}7\u2022 ${C}7Neutral`,
    scared:  `${C}c\u26A0 ${C}cScared`,
    sad:     `${C}9\u007E ${C}9Sad`,
  };
  const moodText = moodSymbols[mood] ?? moodSymbols.neutral;
  return (
    `${C}b${C}l${name}\n` +
    `${C}3Wandering Trader  ${moodText}`
  );
}