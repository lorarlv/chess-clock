import { useState, useRef, useEffect } from "react";

import { formatTime } from "./utils/formatTime";

type Player = "white" | "black";

function App() {
  const initialTime = 5 * 60;
  const [increment, setIncrement] = useState(0);
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  const turnStartTime = useRef<number | null>(null);

  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (activePlayer === null  || isPaused) {
      return;
    }

    turnStartTime.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();

      if (turnStartTime.current === null) {
        turnStartTime.current = now;
        return;
      }

      const elapsed =
        (now - turnStartTime.current) / 1000;

      turnStartTime.current = now;

      if (activePlayer === "white") {
        setWhiteTime((currentTime) =>
          Math.max(currentTime - elapsed, 0)
        );
      } else {
        setBlackTime((currentTime) =>
          Math.max(currentTime - elapsed, 0)
        );
      }
    }, 100);

    return () => {
      clearInterval(interval);
      turnStartTime.current = null;
    };
  }, [activePlayer, isPaused]);

  function switchTurn(player: Player) {
    if (isPaused || activePlayer !== player) {
      return;
    }

    if (player === "white") {
      setWhiteTime((currentTime) => currentTime + increment);
      setActivePlayer("black");
    } else {
      setBlackTime((currentTime) => currentTime + increment);
      setActivePlayer("white");
    }
  }

  function togglePause() {
    if (activePlayer === null) {
      return;
    }

    setIsPaused((paused) => !paused);
  }

  function resetGame() {
    setActivePlayer(null);
    setIsPaused(false);
    setWhiteTime(initialTime);
    setBlackTime(initialTime);
    turnStartTime.current = null;
  }

  return (
    <main>
      <h1>Chess clock</h1>

      {activePlayer === null && (
        <label>
          Increment
          <select
            value={increment}
            onChange={(event) =>
              setIncrement(Number(event.target.value))
            }
          >
            <option value={0}>No increment</option>
            <option value={1}>+1 second</option>
            <option value={2}>+2 seconds</option>
            <option value={3}>+3 seconds</option>
            <option value={5}>+5 seconds</option>
            <option value={10}>+10 seconds</option>
          </select>
        </label>
      )}

      {activePlayer === null && (
        <button onClick={() => setActivePlayer("white")}>
          Start game
        </button>
      )}

      <section>
        <h2>White</h2>
        <p>{formatTime(Math.ceil(whiteTime))}</p>
        <p>{activePlayer === "white" ? "Active" : "Waiting"}</p>

        <button 
          onClick={() => switchTurn("white")}
          disabled={activePlayer !== "white" || isPaused}
        >
          White moved
        </button>
      </section>

      <section>
        <h2>Black</h2>
        <p>{formatTime(Math.ceil(blackTime))}</p>
        <p>{activePlayer === "black" ? "Active" : "Waiting"}</p>

        <button 
          onClick={() => switchTurn("black")}
          disabled={activePlayer !== "black" || isPaused}
        >
          Black moved
        </button>
      </section>

      <button
        onClick={togglePause}
        disabled={activePlayer === null}
      >
        {isPaused ? "Resume" : "Pause"}
      </button>

      <button onClick={resetGame}>
        Reset
      </button>
    </main>
  );
}

export default App;