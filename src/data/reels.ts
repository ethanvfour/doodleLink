import { type SlotSymbol } from "./symbols";

import doodleCar from "../assets/doodleCar.png";
import doodleCarS from "../assets/doodleCoolS.png";
import doodlePlane from "../assets/doodlePlane.png";
import free from "../assets/free.png";
import orb from "../assets/orb.png";
import wild from "../assets/wild.png";

const payLines: number[][] = [
  [1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [0, 0, 1, 0, 0],
  [2, 2, 1, 2, 2],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 0, 1, 0],
  [2, 1, 2, 1, 2],
  [1, 0, 1, 0, 1],
  [1, 2, 1, 2, 1],
  [0, 0, 2, 0, 0],
  [2, 2, 0, 2, 2],
  [0, 1, 1, 1, 0],
  [2, 1, 1, 1, 2],
  [0, 1, 2, 2, 1],
  [2, 1, 0, 0, 1],
  [1, 1, 0, 1, 1],
  [1, 1, 2, 1, 1],
  [0, 2, 0, 2, 0],
  [2, 0, 2, 0, 2],
  [0, 2, 2, 2, 0],
  [2, 0, 0, 0, 2],
];

const paytable: Record<string, Record<number, number>> = {
  // symbol: { count: multiplier }
  "J": { 3: 5, 4: 25, 5: 100 },
  "Q": { 3: 5, 4: 25, 5: 125 },
  "K": { 3: 10, 4: 50, 5: 150 },
  "A": { 3: 15, 4: 75, 5: 200 },
  "doodleCar": { 2: 2, 3: 25, 4: 100, 5: 500 },
  "doodlePlane": { 2: 5, 3: 50, 4: 200, 5: 1000 },
  "doodleCoolS": { 2: 10, 3: 100, 4: 500, 5: 2000 },
  "wild": { 5: 5000 },
};

// Orb values with weighted probabilities (Dragon Link style)
const orbValues = [
  { value: "50", weight: 0.3 }, // 30% - Most common
  { value: "100", weight: 0.25 }, // 25% - Common
  { value: "200", weight: 0.2 }, // 20% - Moderate
  { value: "500", weight: 0.12 }, // 12% - Less common
  { value: "750", weight: 0.08 }, // 8% - Uncommon
  { value: "1000", weight: 0.03 }, // 3% - Rare
  { value: "MINI", weight: 0.015 }, // 1.5% - Very rare
  { value: "MINOR", weight: 0.004 }, // 0.4% - Ultra rare
  { value: "MAJOR", weight: 0.001 }, // 0.1% - Extremely rare
];
// Total weight: 1.000 (100%)

// Helper function to select random orb value based on weights
const getOrbValue = (): string => {
  const random = Math.random();
  let cumulative = 0;

  for (const { value, weight } of orbValues) {
    cumulative += weight;
    if (random <= cumulative) {
      return value;
    }
  }

  return "1 MILLION DOLLARS";
};

//NO MATH DONE YET
const symbols_per_reel = {
  J: [5, 4, 6, 6, 7],
  Q: [6, 4, 4, 4, 4],
  K: [4, 4, 5, 4, 4],
  A: [4, 4, 3, 4, 4],
  doodleCar: [3, 2, 2, 2, 2],
  doodlePlane: [2, 2, 2, 2, 2],
  doodleCoolS: [2, 2, 1, 3, 1],
  orb: [3, 2, 3, 3, 2],
  wild: [2, 2, 1, 4, 2],
  free: [1, 1, 1, 1, 1],
};

const reels: SlotSymbol[][] = new Array<SlotSymbol[]>(5);

const shuffle = (symbols: SlotSymbol[]): SlotSymbol[] => {
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }
  return symbols;
};
let intialized = false;
const makeReels = (): void => {
  if (intialized) return;
  intialized = true;

  // Map symbol names to their imported image paths
  const photoMap: Record<string, string> = {
    doodleCar: doodleCar,
    doodleCoolS: doodleCarS, // assuming doodleCarS is the "cool S" variant
    doodlePlane: doodlePlane,
    free: free,
    orb: orb,
    wild: wild,
    // Card symbols (J, Q, K, A) use empty string for text rendering
  };

  for (let i = 0; i < 5; i++) {
    reels[i] = [];
    for (const [sym, numAmt] of Object.entries(symbols_per_reel)) {
      for (let j = 0; j < numAmt[i]; j++) {
        const photoPath = photoMap[sym] || "";

        // For orb symbols, assign random weighted valu
        reels[i].push({
          name: sym,
          photo: photoPath,
          orb: undefined,
        });
      }
    }
    reels[i] = shuffle(reels[i]);
  }
};

const getReels = (): SlotSymbol[][] => {
  makeReels();
  return reels;
};

export { getReels, payLines, orbValues, getOrbValue, paytable };
