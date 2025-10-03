import "./index.css";
import { useState, Fragment, useEffect, useRef } from "react";
import backgroundImg from "./assets/background.jpg";
import { betAmounts, possDenom } from "./data/betAmounts.tsx";
import BetButton from "./components/BetButton.tsx";

import rough from "roughjs";
/* ROUGH JS */

function App() {
  const debug = false;
  const [lineCount, setLineCount] = useState(50);
  const [currBetAmt, setBetAmt] = useState(betAmounts[0]);
  const [denom, setDenom] = useState(possDenom[0]),
    [denomChanging, setDenomChange] = useState<boolean>(true);
  const [betButtonsDisabled, setBetButtonDisabled] = useState<boolean>(true);

  const roughNess = 4;

  const mainSvgBackGround = useRef<SVGSVGElement | null>(null);
  const mainGameDivRef = useRef<HTMLDivElement | null>(null);
  const leftLines = useRef<HTMLDivElement | null>(null),
    rightLines = useRef<HTMLDivElement | null>(null);
  //max x for svg is 1224
  //assuming 100% and full screen

  const handleBetChange = (b: number) => {
    setDenom(b);
    setDenomChange(false);
  };

  const spin = (bAmt: number) => {};

  useEffect(() => {
    //drawing the svgs
    if (mainSvgBackGround.current && mainGameDivRef.current) {
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
          backgroundPosition: "center 10%", // Move down 20% from top
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
                <h1 className="text-center text-2xl">Select Denom</h1>
                <div className="flex justify-evenly w-4/5 h-1/3">
                  {possDenom.map((d) => (
                    <Fragment key={d}>
                      <button
                        className="h-full w-[50px] border-2 rounded-lg hover:scale-103"
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
          <div id="reels"></div>
          <div id="money-and-bet"></div>
        </div>
        <div
          id="play-buttons"
          className={`w-4/5 h-1/4 grow-2 flex justify-evenly px-10 items-center relative z-50${
            debug ? "border-2 border-black" : ""
          }`}
        >
          {betAmounts.map((amt) => (
            <Fragment key={amt}>
              <BetButton
                betAmt={amt}
                clickFunction={spin}
                disabled={betButtonsDisabled}
              />
            </Fragment>
          ))}
          <button
            id="change-denom"
            className="absolute min-w-[40px] min-h-[40px] top-1 right-1 border-2 border-black p-1 doodleFont rounded-lg transition-all"
            onClick={() => {
              setDenomChange(true);
              setBetButtonDisabled(true);
            }}
          >
            {denom / 100 < 1 ? `${denom}¢` : "$" + `${denom / 100}`}
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
