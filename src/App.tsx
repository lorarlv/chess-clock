import "./App.css"
import PixelIcon from "./components/pixel";

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

type PressureState =
  | "normal"
  | "low"
  | "critical"
  | "terminal"
  | "crashed";

type CrashPhase = "idle" | "burst" | "settled";

function getPressureState(
  time: number,
  isActive: boolean,
  hasTimedOut: boolean
): PressureState {
  if (hasTimedOut) {
    return "crashed";
  }

  if (!isActive) {
    return "normal";
  }

  if (time <= 7) {
    return "terminal";
  }

  if (time <= 15) {
    return "critical";
  }

  if (time <= 30) {
    return "low";
  }

  return "normal";
}

const LOW_TIME_TEXT = "TIME IS RUNNING OUT";
const CRITICAL_TIME_TEXT = "T_ME///CR_T_CAL";

function corruptStatusText(
  text: string,
  time: number
): string {
  if (time > 30) {
    return text;
  }

  const chars = [...text];
  const validIndexes = chars
    .map((char, index) => char === " " ? -1 : index)
    .filter((index) => index !== -1);

  // 30s -> 20s
  if (time > 20) {
    const progress = (30 - time) / 10;

    const interval = 2.4 - progress * 1.5;

    const duration = 0.08 + progress * 0.08;

    const elapsed = 30 - time;
    const cycle = Math.floor(elapsed / interval);
    const phase = elapsed % interval;

    if (phase < duration) {
      const index =
        validIndexes[
          cycle % validIndexes.length
        ];

      chars[index] = "_";
    }

    return chars.join("");
  }
  
  // 20s -> 7s
  if (time > 7) {
    const progress = (20 - time) / 13;

    const updateRate =
      3 + progress * 9;

    const intensity =
      0.08 + progress * 0.42;

    const frame = Math.floor(
      time * updateRate
    );

    return chars
      .map((char, index) => {
        if (char === " ") {
          return char;
        }

        const seed =
          Math.sin(
            index * 12.9898 +
            frame * 78.233
          ) * 43758.5453;

        const random =
          seed - Math.floor(seed);

        if (random > intensity) {
          return char;
        }

        const variants = [
          "_",
          "_",
          "_",
          "/",
          "|",
          char,
          char,
          char,
          char,
        ];

        return variants[
          Math.floor(
            random * variants.length
          )
        ];
      })
      .join("");
  }

  // final 7s
  const criticalChars = [
    ..."T_ME///CR_T_CAL"
  ];

  const progress = (7 - time) / 7;
  const updateRate = 9 + progress * 10;
  const intensity = 0.12 + progress * 0.3;

  const frame = Math.floor(
    time * updateRate
  );

  return criticalChars
    .map((char, index) => {
      if (char === " ") {
        return char;
      }

      const seed =
        Math.sin(
          index * 17.123 +
          frame * 63.417
        ) * 43758.5453;

      const random =
        seed - Math.floor(seed);

      if (random > intensity) {
        return char;
      }

      const variants = [
        "_",
        "/",
        "|",
        char,
        char,
        char,
      ];

      return variants[
        Math.floor(
          random * variants.length
        )
      ];
    })
    .join("");
}

function getPlayerStatus(
  time: number,
  isActive: boolean,
  isPaused: boolean,
  hasTimedOut: boolean,
  crashPhase: CrashPhase
): string {
  if (hasTimedOut) {
    if (crashPhase === "burst") {
      return "TIME EXPIRED";
    }
    return "CLOCK FAILURE";
  }

  if (!isActive) {
    return "WAITING";
  }

  if (isPaused) {
    return "PAUSED";
  }

  if (time <= 7) {
    return corruptStatusText(
      CRITICAL_TIME_TEXT,
      time
    );
  }

  if (time <= 30) {
    return corruptStatusText(
      LOW_TIME_TEXT,
      time
    );
  }

  return "YOUR MOVE";
}

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

  const [crashPhase, setCrashPhase] = useState<CrashPhase>("idle");

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
            setCrashPhase("burst");
            setWinner("black");
            setActivePlayer(null);

            setTimeout(() => {
              setCrashPhase("settled");
            }, 2800);
          }

          return nextTime;
        });
      } else {
        setBlackTime((currentTime) => {
          const nextTime = Math.max(currentTime - elapsed, 0);

          if (nextTime === 0) {
            setCrashPhase("burst");
            setWinner("white");
            setActivePlayer(null);

            setTimeout(() => {
              setCrashPhase("settled");
            }, 2800);
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
    setCrashPhase("idle");
    setWhiteTime(initialTime);
    setBlackTime(initialTime);
    turnStartTime.current = null;
  }

  const whitePressure = getPressureState(
    whiteTime,
    activePlayer === "white" && !isPaused,
    winner === "black"
  );

  const blackPressure = getPressureState(
    blackTime,
    activePlayer === "black" && !isPaused,
    winner === "white"
  );

  const whiteStatus = getPlayerStatus(
    whiteTime,
    activePlayer === "white",
    isPaused,
    winner === "black",
    crashPhase
  );

  const blackStatus = getPlayerStatus(
    blackTime,
    activePlayer === "black",
    isPaused,
    winner === "white",
    crashPhase
  );

  return (
    <main className="desktop">
      <div className="clock-window">
        <div className="title-bar">
          <div className="title-bar-left">
            <PixelIcon type="app" />
            <span>chessclock.exe</span>
          </div>

          <div className="window-buttons">
            <button type="button">_</button>
            <button type="button">□</button>
            <button type="button">×</button>
          </div>
        </div>

        <div className="menu-bar">
          <span>Game</span>
          <span>Clock</span>
          <span>Options</span>
          <span>?</span>
        </div>

        <div className="program-banner">
          <div>
            <strong>CHESS CLOCK</strong>
            <span> version 1.0</span>
          </div>

          <span className="program-message">
            DON'T WASTE YOUR TIME
          </span>
        </div>

        <div className="window-content">
          {activePlayer === null && (
            <div className="setup-panel">
              <h2>Time control</h2>

              <div className="time-control-grid">
                {timeControls.map((control) => (
                  <button
                    key={control.label}
                    className="retro-button"
                    onClick={() => selectTimeControl(control)}
                  >
                    {control.label}
                  </button>
                ))}
              </div>

              {isCustom && (
                <div className="custom-controls">
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

                  <button
                    className="retro-button"
                    onClick={applyCustomTimeControl}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          )}

          <span className="keyboard-status">
            KEYBOARD: A / L / SPACE
          </span>

          {winner && crashPhase === "settled" && (
            <div className="winner-message">
              {winner === "white"
                ? "WHITE_WINS_ON_TIME"
                : "BLACK_WINS_ON_TIME"}
            </div>
          )}

          <div className="clock-grid">
            <section
              className={`player-panel ${whitePressure} ${
                winner === "black" ? crashPhase : ""
              } ${
                activePlayer === "white" ? "active" : ""
              }`}
            >
              <div className="player-label">
                <span
                  className={`status-light ${
                    activePlayer === "white" ? "on" : ""
                  }`}
                />

                <PixelIcon type="white-king" />
                <span>WHITE</span>
              </div>

              <div className="clock-display">
                <span className="clock-value">
                  {formatTime(whiteTime)}
                </span>
              </div>

              <div className="player-status">
                {whiteStatus}
              </div>

              <button
                className="player-button"
                onClick={() => switchTurn("white")}
                disabled={
                  activePlayer !== "white" ||
                  isPaused ||
                  winner !== null
                }
              >
                [ A ] WHITE MOVED
              </button>
            </section>

            <section
              className={`player-panel ${blackPressure} ${
                winner === "white" ? crashPhase : ""
              } ${
                activePlayer === "black" ? "active" : ""
              }`}
            >
              <div className="player-label">
                <span
                  className={`status-light ${
                    activePlayer === "black" ? "on" : ""
                  }`}
                />

                <PixelIcon type="black-king" />
                <span>BLACK</span>
              </div>

              <div className="clock-display">
                <span className="clock-value">
                  {formatTime(blackTime)}
                </span>
              </div>

              <div className="player-status">
                {blackStatus}
              </div>

              <button
                className="player-button"
                onClick={() => switchTurn("black")}
                disabled={
                  activePlayer !== "black" ||
                  isPaused ||
                  winner !== null
                }
              >
                [ L ] BLACK MOVED
              </button>
            </section>
          </div>

          <div className="control-row">
            {activePlayer === null && winner === null ? (
              <button
                className="retro-button primary-button"
                onClick={() => setActivePlayer("white")}
              >
                START GAME
              </button>
            ) : (
              <button
                className="retro-button"
                onClick={togglePause}
                disabled={activePlayer === null}
              >
                {isPaused ? "RESUME" : "PAUSE"}
              </button>
            )}

            <button
              className="retro-button"
              onClick={resetGame}
            >
              RESET
            </button>
          </div>
        </div>

        <div className="status-bar">
          <span>
            TIME CONTROL: {Math.round(initialTime / 60)}+
            {increment}
          </span>

          <span>
            {winner
              ? "GAME OVER"
              : isPaused
                ? "PAUSED"
                : activePlayer
                  ? "GAME IN PROGRESS"
                  : "READY"}
          </span>
        </div>
      </div>
    </main>
  );
}

export default App;