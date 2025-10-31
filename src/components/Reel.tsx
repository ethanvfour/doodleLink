import { Fragment, useEffect, useState } from "react";
import type { SlotSymbol } from "../data/symbols";
import { getOrbValue, getReels } from "../data/reels";
// import { motion } from "motion/react";

interface ReelProps {
  reelIndex: number; // The reel index
  spinHappening: boolean;
  sendData: (index: number, symbols: SlotSymbol[]) => void; // Function called when button is clicked, receives bet amount
}

const Reel: React.FC<ReelProps> = ({ reelIndex, spinHappening, sendData }) => {
  const [reelData, setReelData] = useState<SlotSymbol[]>([]);
  useEffect(() => {
    const r = getReels()[reelIndex] || [];
    setReelData(r);
  }, [reelIndex]);

  const [start, setStart] = useState<boolean>(true);
  useEffect(() => { //only happens at the start
    if (!start || reelData.length === 0) return;
    setStart(false);
    const pickThree = (): number => Math.floor(Math.random() * reelData.length);
    const tempReel: SlotSymbol[] = [];
    for (let i = pickThree(), times = 0; times < 3; times++) {
      const symbol = { ...reelData[i] };
      
      // Assign orb value once when symbol is selected (not on every render)
      if (symbol.name === "orb") {
        symbol.orb = getOrbValue();
      }
      
      tempReel.push(symbol);
      i = (i + 1) % reelData.length;
    }
    setCurrReel(tempReel);
  }, [start, reelData]);

  const [currReel, setCurrReel] = useState<SlotSymbol[]>([]);

  useEffect(() => {
    //shouldnt happen?
    if (!spinHappening || reelData.length === 0) return;
    /*
      code
      */
    const pickThree = (): number => Math.floor(Math.random() * reelData.length);
    const tempReel: SlotSymbol[] = [];
    for (let i = pickThree(), times = 0; times < 3; times++) {
      const symbol = { ...reelData[i] };
      
      // Assign orb value once when symbol is selected (not on every render)
      if (symbol.name === "orb") {
        symbol.orb = getOrbValue();
      }
      
      tempReel.push(symbol);
      i = (i + 1) % reelData.length;
    }
    setCurrReel(tempReel);

    sendData(reelIndex, tempReel);
  }, [spinHappening, reelData, reelIndex, sendData]);

  return (
    <div className="w-[20%] h-full border-r-2 border-l-2">
      {currReel.map((curr, i) => (
        <Fragment key={i}>
          <div className="h-1/3 w-full doodleFont text-9xl flex justify-center items-center border-2 bg-white overflow-hidden relative">
            {curr.photo === "" ? curr.name : (<>
            <img className="max-w-full max-h-full object-contain" src={curr.photo} alt={curr.name} />
             {curr.orb && <p className="text-6xl doodleFont absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">{curr.orb}</p>}
            </>)}
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default Reel;
