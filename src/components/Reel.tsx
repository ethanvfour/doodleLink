import { useEffect, useMemo, useState } from "react";
import type { SlotSymbol } from "../data/symbols";
import { getReels } from "../data/reels";

interface ReelProps {
  reelIndex: number; // The reel index
  spinHappening: boolean;
  sendData: (index: number, symbols: SlotSymbol[]) => void; // Function called when button is clicked, receives bet amount
}

const Reel: React.FC<ReelProps> = ({ reelIndex, spinHappening, sendData }) => {
  const [cells, setCells] = useState<SlotSymbol[]>([]);

  const reel = useMemo(() => getReels()[reelIndex], [reelIndex]);

  useEffect(() => {
    if(spinHappening)
    {
      /*
      code
      */


      sendData(reelIndex, Array(3).fill({name: "A", photo: ""}) )
    }
    return () => {};
  }, [spinHappening]);

  return <div className="w-[20%] h-full"></div>;
};

export default Reel;
