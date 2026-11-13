import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import LegoLoader from "./LegoLoader.jsx";
import PixelWave from "./PixelWave.jsx";
import Site from "./Site.jsx";

export default function App() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [stage, setStage] = useState("intro");

  useEffect(() => {
    document.body.classList.toggle("locked", stage !== "site");
  }, [stage]);

  function enterSite() {
    setStage("site");
  }

  return (
    <BrowserRouter>
      {(stage === "revealing" || stage === "site") && <Site />}
      {(stage === "intro" || stage === "covering") && (
        <LegoLoader
          reduced={reduced}
          onEnter={() => setStage("covering")}
        />
      )}
      {(stage === "covering" || stage === "revealing") && (
        <PixelWave
          reduced={reduced}
          onCovered={() => setStage("revealing")}
          onDone={enterSite}
        />
      )}
    </BrowserRouter>
  );
}
