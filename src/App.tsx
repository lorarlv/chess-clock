import { useState, useRef, useEffect } from "react";

import { formatTime } from "./utils/formatTime";

type Player = "white" | "black";

type TimeControl = {
  label: string;
  minutes: number;
  increment: number;
}

const timeControls: TimeControl[] = [
  { label: "1+0", minutes: 1, increment: 0 },
  { label: "3+0", minutes: 3, increment: 0 },
  { label: "3+2", minutes: 3, increment: 2 },
  { label: "5+0", minutes: 5, increment: 0 },
  { label: "5+3", minutes: 5, increment: 3 },
  { label: "10+0", minutes: 10, increment: 0 },
  { label: "15+10", minutes: 15, increment: 10 },
  { label: "Custom", minutes: 0, increment: 0 },
];

function App() {
  const [initialTime, setInitialTime] = useState(5 * 60);
  const [increment, setIncrement] = useState(0);
  const [isCustom, setIsCustom] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(5);
  const [customIncrement, setCustomIncrement] = useState(0);
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);

  const turnStartTime = useRef<number | null>(null);

  const [isPaused, setIsPaused] = useState(false);

  function selectTimeControl(control: TimeControl) {
    if (activePlayer !== null) {
      return;
    }

    if (control.label === "Custom") {
      setIsCustom(true);
      return;
    }

    setIsCustom(false);

    const startingTime = control.minutes * 60;

    setInitialTime(startingTime);
    setIncrement(control.increment);

    setWhiteTime(startingTime);
    setBlackTime(startingTime);
  }

  function applyCustomTimeControl() {
    if (activePlayer !== null) {
      return;
    }

    const startingTime = Math.max(customMinutes, 1) * 60;
    const customIncrementValue = Math.max(customIncrement, 0);

    setInitialTime(startingTime);
    setIncrement(customIncrementValue);

    setWhiteTime(startingTime);
    setBlackTime(startingTime);
  }

  useEffect(() => {
    if (activePlayer === null  || isPaused || winner !== null) {
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
        setWhiteTime((currentTime) => {
          const nextTime = Math.max(currentTime - elapsed, 0);

          if (nextTime === 0) {
            setWinner("black");
            setActivePlayer(null);
          }

          return nextTime;
        });
      } else {
        setBlackTime((currentTime) => {
          const nextTime = Math.max(currentTime - elapsed, 0);

          if (nextTime === 0) {
            setWinner("white");
            setActivePlayer(null);
          }

          return nextTime;
        });
      }
    }, 10);

    return () => {
      clearInterval(interval);
      turnStartTime.current = null;
    };
  }, [activePlayer, isPaused, winner]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }
      
      const target = event.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.key.toLowerCase() === "a") {
        if (
          activePlayer === "white" &&
          !isPaused &&
          winner === null
        ) {
          switchTurn("white");
        }

        return;
      }

      if (event.key.toLowerCase() === "l") {
        if (
          activePlayer === "black" &&
          !isPaused &&
          winner === null
        ) {
          switchTurn("black");
        }

        return;
      }

      if (event.key === " ") {
        event.preventDefault();

        if (
          activePlayer !== null &&
          winner === null
        ) {
          setIsPaused((paused) => !paused);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activePlayer,
    isPaused,
    winner,
  ]);

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
    setWinner(null);
    setWhiteTime(initialTime);
    setBlackTime(initialTime);
    turnStartTime.current = null;
  }

  return (
    <main>
      <h1>Chess clock</h1>

      {activePlayer === null && (
        <div>
          <h2>Time control</h2>

          {timeControls.map((control) => (
            <button
              key={control.label}
              onClick={() => selectTimeControl(control)}
            >
              {control.label}
            </button>
          ))}
        </div>
      )}

      {isCustom && activePlayer === null && (
        <div>
          <label>
            Minutes
            <input
              type="number"
              min={1}
              value={customMinutes}
              onChange={(event) =>
                setCustomMinutes(Number(event.target.value))
              }
            />
          </label>

          <label>
            Increment
            <input
              type="number"
              min={0}
              value={customIncrement}
              onChange={(event) =>
                setCustomIncrement(Number(event.target.value))
              }
            />
          </label>

          <button onClick={applyCustomTimeControl}>
            Apply custom time
          </button>
        </div>
      )}

      {winner && (
        <div>
          <h2>
            {winner === "white"
              ? "White wins on time"
              : "Black wins on time"}
          </h2>
        </div>
      )}

      {activePlayer === null && winner == null && (
        <button onClick={() => setActivePlayer("white")}>
          Start game
        </button>
      )}

      <section>
        <h2>White</h2>
        <p>{formatTime(whiteTime)}</p>
        <p>{activePlayer === "white" ? "Active" : "Waiting"}</p>

        <button 
          onClick={() => switchTurn("white")}
          disabled={activePlayer !== "white" || isPaused || winner !== null}
        >
          White moved
        </button>
      </section>

      <section>
        <h2>Black</h2>
        <p>{formatTime(blackTime)}</p>
        <p>{activePlayer === "black" ? "Active" : "Waiting"}</p>

        <button 
          onClick={() => switchTurn("black")}
          disabled={activePlayer !== "black" || isPaused || winner !== null}
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