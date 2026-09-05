// Gossip dialogue templates
// {name} = target villager name
// {profession} = target villager profession

export const gossipDialogue = {

  // Positive gossip
  positive: [
    "Have you spoken to {name} lately? Such a kind soul!",
    "{name} gave me extra bread yesterday, so generous!",
    "I think {name} is the hardest worker in the village.",
    "{name} helped me carry my goods this morning!",
    "Did you know {name} saved up enough for a new workbench?",
    "Everyone loves {name} around here!",
    "{name} and I have been friends for as long as I can remember.",
    "You should trade with {name}, best deals in the village!",
    "{name} is always smiling, it brightens my day!",
    "I heard {name} donated food to the whole village last week!",
    "{name} fixed my roof after the last storm, bless them!",
    "Nobody works harder than {name} in this village.",
    "{name} taught me a new recipe just yesterday!",
    "I saw {name} help a lost traveler find their way.",
    "{name} is truly the heart of this village!",
  ],

  // Negative gossip
  negative: [
    "Between you and me, {name} has been acting strange lately.",
    "I don't trust {name} ever since the emerald incident...",
    "{name} never shares their surplus, very selfish if you ask me.",
    "Did you hear what {name} did at the market last week?",
    "I saw {name} arguing with the cartographer again.",
    "{name} keeps leaving their door open at night. Suspicious.",
    "I caught {name} taking more than their share of the harvest.",
    "Rumor has it {name} has been trading with outsiders secretly.",
    "{name} has not been to the village meeting in weeks.",
    "Nobody knows where {name} goes at night. Strange, right?",
    "I lent {name} some wheat and never got it back...",
    "Between us, {name} has been very grumpy lately.",
    "{name} knocked over my stall and did not even apologize!",
    "I heard {name} and the cleric had a big argument.",
    "Something is off about {name} lately, I can feel it.",
  ],

  // Neutral gossip
  neutral: [
    "Did you know {name} used to live in a different village?",
    "I heard {name} is learning a new trade skill.",
    "{name} has been busy all week, hardly seen them!",
    "Have you noticed {name} has been waking up earlier lately?",
    "I saw {name} talking to the wandering trader yesterday.",
    "{name} is saving up emeralds for something big, I heard.",
    "Word is {name} found something unusual in the forest.",
    "I wonder what {name} is building behind their house.",
    "{name} told me they are thinking of moving workbenches.",
    "Have you seen {name}'s new trade stock? Very impressive.",
    "I bumped into {name} near the well this morning.",
    "{name} has been collecting a lot of books lately.",
    "Someone said {name} wants to start a village library.",
    "I heard {name} has been practicing a new craft.",
    "{name} mentioned something about a big trade deal coming.",
  ],

  // Profession based gossip
  profession: {
    farmer: [
      "{name} grew the biggest pumpkin I have ever seen!",
      "I traded with {name} the farmer today, great prices!",
      "{name} knows everything about crops, amazing farmer!",
    ],
    fisherman: [
      "{name} caught a massive fish yesterday, you should have seen it!",
      "I heard {name} knows secret fishing spots by the river.",
      "{name} traded the freshest fish I have ever tasted!",
    ],
    shepherd: [
      "{name}'s sheep are the finest in the whole region!",
      "I got some beautiful wool from {name} this morning.",
      "{name} has been dyeing wool in amazing colors lately!",
    ],
    fletcher: [
      "{name} made me the finest arrows I have ever used!",
      "I heard {name} is working on a special crossbow design.",
      "{name}'s bows never miss, truly skilled fletcher!",
    ],
    librarian: [
      "{name} has read every book in the village twice!",
      "I borrowed a tome from {name} and it changed my life.",
      "{name} discovered a rare enchantment last week!",
    ],
    cartographer: [
      "{name} mapped the entire surrounding region alone!",
      "I got a treasure map from {name} and found real loot!",
      "{name} knows every path and trail within miles.",
    ],
    cleric: [
      "{name} brewed a potion that cured my cold instantly!",
      "The whole village feels safer with {name} around.",
      "{name} predicted the last storm before it arrived!",
    ],
    armorer: [
      "{name} made me the strongest armor I have ever worn!",
      "I heard {name} is working on a special netherite set.",
      "{name}'s forge burns day and night, truly dedicated!",
    ],
    weaponsmith: [
      "{name} forged a sword that could cut through anything!",
      "I got a blade from {name} and it never dulls!",
      "{name} is the finest weaponsmith for miles around.",
    ],
    toolsmith: [
      "{name} made me a pickaxe that lasts forever!",
      "Every miner in the village buys tools from {name}.",
      "{name}'s tools are worth every emerald, trust me.",
    ],
    butcher: [
      "{name} prepared the finest meal I have ever tasted!",
      "I got some smoked meat from {name}, absolutely delicious!",
      "{name} keeps the whole village fed and happy.",
    ],
    leatherworker: [
      "{name} made me boots that are still going strong!",
      "I got a saddle from {name} and my horse loves it.",
      "{name}'s leather work is the finest I have seen.",
    ],
    mason: [
      "{name} built the village well with their own hands!",
      "I saw {name} carving the most beautiful stonework.",
      "{name}'s buildings will stand for a thousand years.",
    ],
    nitwit: [
      "{name} tried to trade a dirt block yesterday. Bless them.",
      "I saw {name} waving at a cow for ten minutes.",
      "{name} is... unique. But we love them all the same!",
    ],
    unemployed: [
      "Poor {name} is still looking for work, I hope they find a job.",
      "I heard {name} is thinking of becoming a farmer.",
      "{name} has been helping around the village while job hunting.",
    ],
  },
};

// Chance of each gossip type
// 40% positive, 30% negative, 20% neutral, 10% profession
export const gossipWeights = {
  positive:   40,
  negative:   30,
  neutral:    20,
  profession: 10,
};

// Pick a weighted random gossip type
export function pickGossipType() {
  const total = Object.values(gossipWeights).reduce((a, b) => a + b, 0);
  let rand    = Math.floor(Math.random() * total);

  for (const [type, weight] of Object.entries(gossipWeights)) {
    rand -= weight;
    if (rand < 0) return type;
  }

  return "neutral";
}

// Get a random gossip line
export function getGossipLine(type, targetName, targetLabel) {
  let lines;

  if (type === "profession") {
    const key = targetLabel.toLowerCase();
    lines = gossipDialogue.profession[key] ?? gossipDialogue.neutral;
  } else {
    lines = gossipDialogue[type] ?? gossipDialogue.neutral;
  }

  const line = lines[Math.floor(Math.random() * lines.length)];
  return line
    .replace("{name}", targetName)
    .replace("{profession}", targetLabel);
}