import "./index.css";
import { useState, Fragment, useEffect, useRef, useCallback } from "react";
import backgroundImg from "./assets/background.jpg";
import { betAmounts, possDenom } from "./data/betAmounts";
import BetButton from "./components/BetButton";

import rough from "roughjs";
import Reel from "./components/Reel.tsx";
import type { SlotSymbol } from "./data/symbols.tsx";
import { payLines, paytable } from "./data/reels.ts";
/* ROUGH JS */

function App() {
  const debug = false;
  const [lineCount, setLineCount] = useState(betAmounts[0].lines);
  const [currBetAmt, setBetAmt] = useState(betAmounts[0]);
  const [denom, setDenom] = useState(possDenom[0]),
    [denomChanging, setDenomChange] = useState<boolean>(true);
  const [betButtonsDisabled, setBetButtonDisabled] = useState<boolean>(true);
  const [denomButtonDisabled, setDenomButtonDisabled] = useState<boolean>(true);
  const [credit, setCredit] = useState(1000); // dollars as float
  //cents

  const [orbBonus, setOrbBonus] = useState<boolean>(false);

  const [freeBonus, setFreeBonus] = useState<boolean>(false);

  const roughNess = 4;

  const [filledUp, isFilledUp] = useState(false); //possibly not needed?
  const [reelsData, setReelsData] = useState<SlotSymbol[][]>(
    Array.from({ length: 5 }, () => [] as SlotSymbol[])
  );
  const reelsDataRef = useRef<SlotSymbol[][]>(reelsData);
  useEffect(() => {
    reelsDataRef.current = reelsData;
  }, [reelsData]);

  const handleReelData = useCallback((index: number, symbols: SlotSymbol[]): void => {
    setReelsData((prev) => {
      const newData = [...prev];
      newData[index] = [...symbols];
      const allDone = newData.every((i) => i.length === 3);
      if (allDone) isFilledUp(true);
      return newData;
    });
  }, []);

  const [isSpinning, setIsSpinning] = useState(false);

  const mainSvgBackGround = useRef<SVGSVGElement | null>(null);
  const betButtonsSvg = useRef<SVGSVGElement | null>(null);
  const mainGameDivRef = useRef<HTMLDivElement | null>(null);
  const leftLines = useRef<HTMLDivElement | null>(null),
    rightLines = useRef<HTMLDivElement | null>(null);
  //max x for svg is 1224
  //assuming 100% and full screen

  const handleBetChange = (b: number) => {
    setDenom(b);
    setDenomChange(false);
  };

  const handleSpin = async (bet:{ amount: number; lines: number }) => {
    console.log("start");
    isFilledUp(false);
    setReelsData(() => Array.from({ length: 5 }, () => [] as SlotSymbol[]));
    setIsSpinning(true);
    setBetButtonDisabled(true);
    setDenomButtonDisabled(true);
    setLineCount(() => bet.lines);

    await new Promise((resolve) => {
      const interval = setInterval(() => {
        const latest = reelsDataRef.current;
        console.log("Current reel data:", latest.map(reel => reel.length));
        const allDone = latest.every((i) => i.length === 3);
        if (allDone) {
          console.log("WOOHOOO - All reels filled:", latest);
          clearInterval(interval);
          resolve("done");
        }
      }, 50);
    });
    
    // Wait for React to finish rendering the new reel symbols
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log("finish");
    const winningPaylines: number[] = [];

    const checkWin = async (): Promise<number> => {
      let basePay: number = 0;
      payLines.slice(0, bet.lines).forEach((pl, i) => {
        console.log("index: ", i);
        console.log(reelsDataRef.current[0][pl[0]].name);
        let symbol = reelsDataRef.current[0][pl[0]].name;
        let wild = symbol === "wild";

        let len = 1;

        if (wild) symbol = "";

        for (; len < 5 && symbol !== "orb" && symbol !== "free"; len++) {
          const currSymbol = reelsDataRef.current[len][pl[len]].name;
          if (currSymbol === "wild") continue;
          else if (wild) {
            wild = false;
            symbol = currSymbol;
            continue;
          } else if (currSymbol === symbol) continue;
          else {
            break;
          }
        }
        
        if(wild)
        {
          console.log(pl, "HI")
          winningPaylines.push(i);
          basePay += paytable["wild"][5];
        }
        else if(paytable[symbol] && paytable[symbol][len])
        {
          console.log(pl, "HI")
          winningPaylines.push(i);
          basePay += paytable[symbol][len];
        }

      });
      
      basePay = basePay * (denom / 100);
      console.log(basePay)
      return basePay;
    };

    const basePay = await checkWin();
    console.log(winningPaylines)
    setIsSpinning(false);
    setBetButtonDisabled(false);
    setDenomButtonDisabled(false);
  };

  useEffect(() => {
    //drawing the svgs

    if (mainSvgBackGround.current && mainGameDivRef.current) {
      mainSvgBackGround.current.innerHTML = "";
      const {
        x: mainGameX,
        y: mainGameY,
        height: mainGameHeight,
        width: mainGameWidth,
      } = mainGameDivRef.current.getBoundingClientRect();
      const rect = rough.svg(mainSvgBackGround.current);
      let node = rect.rectangle(
        mainGameX,
        mainGameY,
        mainGameWidth,
        mainGameHeight,
        { roughness: roughNess, strokeWidth: 2 }
      ); // x, y, width, height
      mainSvgBackGround.current.appendChild(node);

      // Draw rectangle around leftLines
      if (leftLines.current) {
        const { x, y, width, height } =
          leftLines.current.getBoundingClientRect();
        node = rect.rectangle(x, y, width, height, {
          roughness: roughNess,
          strokeWidth: 2,
        });
        mainSvgBackGround.current.appendChild(node);
      }
      // Draw rectangle around rightLines
      if (rightLines.current) {
        const { x, y, width, height } =
          rightLines.current.getBoundingClientRect();
        node = rect.rectangle(x, y, width, height, {
          roughness: roughNess,
          strokeWidth: 2,
        });
        mainSvgBackGround.current.appendChild(node);
      }
    }

    if (betButtonsSvg.current) {
      betButtonsSvg.current.innerHTML = "";

      const roughJS = rough.svg(betButtonsSvg.current);
      const betButtons = document.querySelectorAll("#play-buttons button");

      // Get the container's position to calculate relative coordinates
      const container = document.getElementById("play-buttons");
      const containerRect = container?.getBoundingClientRect();

      betButtons.forEach((bb) => {
        const buttonRect = bb.getBoundingClientRect();

        if (containerRect) {
          // Calculate relative position within the container
          const relativeX = buttonRect.x - containerRect.x;
          const relativeY = buttonRect.y - containerRect.y;

          const node = roughJS.rectangle(
            relativeX,
            relativeY,
            buttonRect.width, // Fixed: was height, width (wrong order)
            buttonRect.height,
            { roughness: roughNess, strokeWidth: 2 }
          );
          betButtonsSvg.current?.appendChild(node);
        }
      });
    }
  }, []);
  // for now

  return (
    <main className="relative">
      <svg
        className="absolute w-full h-full z-10 pointer-events-none"
        id="svg-for-background"
        ref={mainSvgBackGround}
      ></svg>
      <div
        id="main-screen"
        className={`w-screen h-screen bg-cover flex flex-col items-center`} // Remove bg-top
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 12.5%", // Move down 20% from top
        }}
      >
        <div
          id="top-bar"
          className={`w-screen h-[15%] text-center p-2 ${
            debug ? "border-amber-600 border-2" : ""
          }`}
        >
          <h1 className="doodleFont text-6xl">Doodle Link</h1>
        </div>

        <div
          className={`min-h-[75%] max-h-[75%] w-4/5 flex flex-col items-center relative ${
            debug ? "border-[#000000] border-3 rounded-3xl" : ""
          }`}
          id="main-game-screen"
          ref={mainGameDivRef}
        >
          {/* using this to hide it for now */}
          <Fragment>
            <div
              id="left-line-count"
              className="flex flex-col doodleFont absolute left-0 top-[50%] -translate-y-[50%] text-center w-[125px] h-[125px] -translate-x-[100%] justify-center"
              ref={leftLines}
            >
              <h3 className="text-2xl">{lineCount}</h3>
              <h3 className="text-2xl">LINES</h3>
            </div>
            <div
              id="right-line-count"
              className="flex flex-col doodleFont absolute right-0 top-[50%] -translate-y-[50%] text-center w-[125px] h-[125px] translate-x-[100%]  justify-center"
              ref={rightLines}
            >
              <h3 className="text-2xl">{lineCount}</h3>
              <h3 className="text-2xl">LINES</h3>
            </div>
            {denomChanging && (
              <div className="absolute w-4/5 h-1/5 border-4 border-black top-1/2 -translate-y-[50%] rounded-xl flex flex-col z-50 bg-white items-center doodleFont justify-evenly">
                <h1 className="text-center text-2xl">Select Denomination</h1>
                <div className="flex justify-evenly w-4/5 h-1/3">
                  {possDenom.map((d) => (
                    <Fragment key={d}>
                      <button
                        className="h-full w-[50px] border-2 rounded-lg cursor-pointer hover:scale-103"
                        onClick={() => {
                          handleBetChange(d);
                          setBetButtonDisabled(false);
                        }}
                      >
                        {d / 100 < 1 ? `${d}¢` : "$" + `${d / 100}`}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
            )}
            {/*will only show when they are changing the denoms*/}
          </Fragment>
          {/*these two divs will be the side saying how many lines */}
          <div id="reels" className="h-[90%] w-full flex">
            {Array.from({ length: 5 }).map((_, i: number) => (
              <Fragment key={i}>
                <Reel
                  reelIndex={i}
                  spinHappening={isSpinning}
                  sendData={handleReelData}
                />
              </Fragment>
            ))}
          </div>
          <div
            id="money-and-bet"
            className="w-full h-[10%] text-2xl flex justify-evenly doodleFont border-t-2"
          >
            <div id="credit" className="flex justify-between w-1/3 px-3">
              <p>CREDIT:</p>
              <p>{"$" + `${credit.toFixed(2)}`}</p>
            </div>
            <div id="bet" className="flex justify-between w-1/3 px-3">
              <p>BET:</p>
              <p>{"$" + `${credit.toFixed(2)}`}</p>
            </div>
            <div id="win" className="flex justify-between w-1/3 px-3">
              <p>WIN:</p>
              <p>{"$" + `${credit.toFixed(2)}`}</p>
            </div>
          </div>
        </div>

        <div
          id="play-buttons"
          className={`w-4/5 h-1/4 grow-2 flex justify-evenly px-10 items-center relative z-50 ${
            debug ? "border-2 border-black" : ""
          }`}
        >
          {betAmounts.map((amt) => (
            <Fragment key={amt.amount}>
              <BetButton
                betAmt={amt}
                clickFunction={handleSpin}
                disabled={betButtonsDisabled}
              />
            </Fragment>
          ))}
          <button
            id="change-denom"
            className="absolute min-w-[40px] min-h-[40px] top-1 right-1  p-1 doodleFont rounded-lg transition-all cursor-pointer"
            onClick={() => {
              setDenomChange((p) => !p);
              setBetButtonDisabled((p) => !p);
            }}
            disabled={denomButtonDisabled}
          >
            {denom / 100 < 1 ? `${denom}¢` : "$" + `${denom / 100}`}
          </button>
          <svg
            className="absolute w-full h-full z-10 pointer-events-none"
            id="svg-for-bet-buttons"
            ref={betButtonsSvg}
          ></svg>
        </div>
      </div>
    </main>
  );
}

export default App;
