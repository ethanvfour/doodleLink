import { lowPaying, highPaying, special, type SlotSymbol } from "./symbols";

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

//NO MATH DONE YET
const symbols_per_reel = {
  J: [5, 4, 6, 6, 7],
  Q: [6, 4, 4, 4, 4],
  K: [4, 4, 5, 4, 4],
  A: [4, 4, 3, 4, 4],
  doodleCar: [3, 2, 2, 2, 2],
  doodlePlane: [2, 2, 2, 2, 2],
  doodleCoolS: [2, 2, 1, 3, 1],
  orb: [3, 2, 1, 2, 2],
  wild: [2, 2, 1, 4, 2],
  free: [2, 0, 5, 0, 6],
};

const reels: SlotSymbol[][] = new Array<SlotSymbol[]>(5);

const shuffle = (symbols: SlotSymbol[]):SlotSymbol[] =>
{
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // j ∈ {0,...,i}
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }
  return symbols;
}

const makeReels = (): void => {
  for (let i = 0; i < 5; i++) {
    reels[i] = []
    for(const [sym, numAmt] of Object.entries(symbols_per_reel))
    {
        for(let j = 0; j < numAmt[i]; j++)
          reels[i].push({name: sym, photo: ""});
    }
    reels[i] = shuffle(reels[i]);
  }
};

const getReels = ():SlotSymbol[][] => {
    makeReels();
    return reels;
};

export { getReels, payLines };
