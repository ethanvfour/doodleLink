import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SlotSymbol } from "../data/symbols";
import { getOrbValue, getReels } from "../data/reels";

interface ReelProps {
  reelIndex: number;
  spinHappening: boolean;
  sendData: (index: number, symbols: SlotSymbol[]) => void;
}

const Reel: React.FC<ReelProps> = ({ reelIndex, spinHappening, sendData }) => {
  const [reelData, setReelData] = useState<SlotSymbol[]>([]);
  useEffect(() => {
    const r = getReels()[reelIndex] || [];
    setReelData(r);
  }, [reelIndex]);

  const [currReel, setCurrReel] = useState<SlotSymbol[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [blurSymbols, setBlurSymbols] = useState<SlotSymbol[]>([]);
  const prevSpinningRef = useRef(false);

  useEffect(() => {
    if (!spinHappening || reelData.length === 0) return;
    if (!prevSpinningRef.current && spinHappening) {
      prevSpinningRef.current = true;
      setIsSpinning(true);
      // Generate blur symbols for animation
      const tempBlur: SlotSymbol[] = [];
      for (let i = 0; i < 20; i++) {
        const idx = Math.floor(Math.random() * reelData.length);
        tempBlur.push({ ...reelData[idx] });
      }
      setBlurSymbols(tempBlur);
      // Delay before stopping
      setTimeout(() => {
        const pickThree = (): number =>
          Math.floor(Math.random() * reelData.length);
        const tempReel: SlotSymbol[] = [];
        for (let i = pickThree(), times = 0; times < 3; times++) {
          const symbol = { ...reelData[i] };
          if (symbol.name === "orb") symbol.orb = getOrbValue();
          tempReel.push(symbol);
          i = (i + 1) % reelData.length;
        }
        setCurrReel(tempReel);
        sendData(reelIndex, tempReel);
        setIsSpinning(false);
      }, 1000 + reelIndex * 300);
    }
  }, [spinHappening, reelData, reelIndex, sendData]);

  useEffect(() => {
    if (!spinHappening) {
      prevSpinningRef.current = false;
    }
  }, [spinHappening]);

  return (
    <div className="w-[20%] h-full border-r-2 border-l-2 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {isSpinning ? (
          <motion.div
            key="spinning"
            className="absolute w-full h-full"
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
          >
            {blurSymbols.map((symbol, idx) => (
              <div
                key={idx}
                className="h-[calc(100%/3)] flex items-center justify-center border-b border-gray-300 bg-white"
                style={{ filter: "blur(2px)" }}
              >
                {symbol.photo === "" ? (
                  <span className="doodleFont text-8xl">
                    {symbol.name === "orb" && symbol.orb
                      ? symbol.orb
                      : symbol.name}
                  </span>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={symbol.photo}
                      alt={symbol.name}
                      className="w-full h-full object-contain p-1"
                    />
                    {symbol.name === "orb" && symbol.orb && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="doodleFont text-2xl font-bold bg-opacity-75 px-1 rounded">
                          {symbol.orb}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="stopped"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full flex flex-col"
          >
            {currReel.map((symbol, idx) => (
              <div
                key={idx}
                className="h-1/3 flex items-center justify-center border-b border-gray-300 last:border-b-0 bg-white"
              >
                {symbol.photo === "" ? (
                  <span className="doodleFont text-8xl">
                    {symbol.name === "orb" && symbol.orb
                      ? symbol.orb
                      : symbol.name}
                  </span>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={symbol.photo}
                      alt={symbol.name}
                      className="w-full h-full object-contain p-1"
                    />
                    {symbol.name === "orb" && symbol.orb && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="doodleFont text-2xl font-bold bg-opacity-75 px-1 rounded">
                          {symbol.orb}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reel;
