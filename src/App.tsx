import "./index.css";
import { useState, Fragment } from "react";
import backgroundImg from "./assets/background.jpg";
import {betAmounts, possDenom} from "./data/betAmounts.tsx";
import BetButton from "./components/BetButton.tsx";

function App() {
  const debug = false;

  const [lineCount, setLineCount] = useState(50);
  const [currBetAmt, setBetAmt] = useState(betAmounts[0]);
  const [denom, setDenom] = useState(possDenom[0]);

  const handleBetChange = (b) =>
  {

  }

  const spin = (bAmt) =>
  {

  }

  return (
    <main className="relative">
      <div
        id="main-screen"
        className={`w-screen h-screen bg-cover bg-center flex flex-col items-center`}
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div
          id="side-bar"
          className={`w-screen h-fit text-center p-2 ${
            debug ? "border-amber-600 border-2" : ""
          }`}
        >
          <h1 className="doodleFont text-6xl">Doodle Link</h1>
        </div>

        <div
          className={`min-h-[75%] max-h-[75%] w-4/5 flex flex-col items-center relative border-[#000000] border-3 rounded-3xl`}
          id="main-game"
        >
          {/* using this to hide it for now */}
          <Fragment>
            <div
              id="left-line-count"
              className="flex flex-col doodleFont absolute left-0 top-[50%] -translate-y-[50%] text-center border-black border-3 w-[125px] h-[125px] -translate-x-[100%] rounded-tl-4xl rounded-bl-4xl justify-center"
            >
              <h3 className="text-2xl">{lineCount}</h3>
              <h3 className="text-2xl">LINES</h3>
            </div>
            <div
              id="right-line-count"
              className="flex flex-col doodleFont absolute right-0 top-[50%] -translate-y-[50%] text-center border-black border-3 w-[125px] h-[125px] translate-x-[100%] rounded-tr-4xl rounded-br-4xl justify-center"
            >
              <h3 className="text-2xl">{lineCount}</h3>
              <h3 className="text-2xl">LINES</h3>
            </div>
          </Fragment>
          {/*these two divs will be the side saying how many lines */}
          <div></div>
        </div>
        <div
          id="play-buttons"
          className={`w-4/5 grow-2 flex justify-evenly px-10 items-center relative ${debug ? "border-2 border-black" : ""}`}
        >
          {betAmounts.map((amt) => (
            <Fragment key={amt}>
              <BetButton betAmt={amt}
                         clickFunction={spin}/>
            </Fragment>
          ))}
          <button id="change-denom"
                  className="absolute min-w-[40px] min-h-[40px] top-1 right-1 border-2 border-black p-1 doodleFont bg-white rounded-3xl">
            {(denom/100 < 1) ? `${denom}¢` : "$" + `${denom/100}`}
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
