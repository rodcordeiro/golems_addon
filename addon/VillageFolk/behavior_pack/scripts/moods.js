import { world } from "@minecraft/server";

const C = "\u00A7";

export const MOODS = {
  happy:   { symbol: `${C}e\u2726`, label: "Happy",   color: `${C}e` },
  neutral: { symbol: `${C}7\u2022`, label: "Neutral",  color: `${C}7` },
  scared:  { symbol: `${C}c\u26A0`, label: "Scared",  color: `${C}c` },
  sad:     { symbol: `${C}9\u007E`, label: "Sad",      color: `${C}9` }
};

export const moodDialogue = {
  happy: [
    "What a wonderful day this is!",
    "I feel amazing today, don't you?",
    "The village is so lively today!",
    "I love days like this!",
    "Sunshine makes everything better!",
    "I could dance right now, honestly!",
    "Everything is going so well lately!",
    "Have you noticed how beautiful it is today?",
    "I woke up feeling great this morning!",
    "Today is a perfect day to be alive!",
    "The whole village seems happy today!",
    "I just made my best trade ever!",
    "Nothing can ruin my mood today!",
    "Smile, traveler! Life is good!",
    "I feel like skipping through the fields!",
  ],
  scared: [
    "Please stay close, it's not safe out there!",
    "I heard growling nearby... did you hear that?",
    "I don't feel safe right now...",
    "Should we be running right now?",
    "The shadows are moving... I saw it!",
    "I want to go home right now!",
    "Something is out there, I can feel it!",
    "Please, don't leave me alone out here!",
    "I heard a zombie last night. Still shaking.",
    "Every sound makes me jump today.",
    "I locked my door three times last night.",
    "Are you armed? Please tell me you're armed.",
    "I saw torches flickering near the forest...",
    "The nights have been getting darker lately.",
    "I wish the sun would stay up forever.",
  ],
  sad: [
    "This rain just won't let up...",
    "I feel a bit down today.",
    "The grey skies match my mood perfectly.",
    "I miss sunny days like we used to have.",
    "Even my trades feel gloomy today.",
    "I spilled my soup this morning. Not a good sign.",
    "Everything feels a little heavier in the rain.",
    "I just want to curl up by the fire.",
    "The thunder kept me up all night.",
    "Rain, rain, go away...",
    "I couldn't tend my crops in this weather.",
    "Wet boots all day. Not my favorite.",
    "Even the animals look miserable today.",
    "I hope tomorrow brings better weather.",
    "Some days you just feel like staying inside.",
  ]
};

// Fixed: single getEntities call for performance
export function detectMood(entity, dim) {
  try {
    const nearbyMobs = dim.getEntities({
      location: entity.location,
      maxDistance: 20,
    });

    const threatFamilies = new Set([
      "zombie", "skeleton", "creeper", "illager",
      "pillager", "ravager", "witch", "phantom", "drowned"
    ]);

    for (const mob of nearbyMobs) {
      try {
        for (const family of threatFamilies) {
          if (mob.matches({ families: [family] })) return "scared";
        }
      } catch {}
    }
  } catch {}

  try {
    if (world.isThundering || world.isRaining) return "sad";
  } catch {}

  try {
    const time = world.getAbsoluteTime() % 24000;
    if (time >= 13000 && time <= 23000) return "scared";
    if (time >= 1000  && time <= 11000) return "happy";
  } catch {}

  return "neutral";
}

export function getMoodDialogueLine(mood) {
  const lines = moodDialogue[mood];
  if (!lines) return null;
  return lines[Math.floor(Math.random() * lines.length)];
}