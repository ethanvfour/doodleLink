export interface SlotSymbol {
  name: string;
  weight: number;
  photo: string; //the photo path yk
}

export interface Reel {
  symbols: SlotSymbol[];
}

const lowPaying: string[] = ["9", "10", "J", "Q", "K", "A"];

export const lowPayingSymbols: SlotSymbol[] = lowPaying.map( (sym, i) =>
{
  return {
    name: sym,
    weight: i,
    photo: "null",
  }
});


/*

*/
