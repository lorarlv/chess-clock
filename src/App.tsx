import "./App.css";
import type { Theme } from "./types/theme";

import { getCurrentWindow } from "@tauri-apps/api/window";
import { LogicalSize } from "@tauri-apps/api/dpi";

import { useEffect, useRef, useState } from "react";

import Clock from "./components/clock";
import TimeControls from "./components/timeControls";
import WindowChrome from "./components/windowChrome";

import type { TimeControl } from "./components/timeControls";

import {
  getPlayerStatus,
  getPressureState,
} from "./utils/pressure";

import type {
  CrashPhase,
} from "./utils/pressure";

type Player = "white" | "black";

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

type SavedTimeControl = {
  minutes: number;
  increment: number;
  isCustom: boolean;
};

function getSavedTimeControl(): SavedTimeControl {
  const saved = localStorage.getItem(
    "chessclock-time-control"
  );

  if (!saved) {
    return {
      minutes: 5,
      increment: 0,
      isCustom: false,
    };
  }

  try {
    return JSON.parse(saved);
  } catch {
    return {
      minutes: 5,
      increment: 0,
      isCustom: false,
    };
  }
}

function App() {
  const isTauri =
    typeof window!== "undefined" &&
    "__TAURI_INTERNALS__" in window;

  const appWindow = isTauri
    ? getCurrentWindow()
    : null;


  const [savedTimeControl] = useState(getSavedTimeControl);

  const [initialTime, setInitialTime] = useState(savedTimeControl.minutes * 60);
  const [increment, setIncrement] = useState(savedTimeControl.increment);

  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);

  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  const [winner, setWinner] = useState<Player | null>(null);

  const [isPaused, setIsPaused] = useState(false);

  const [crashPhase, setCrashPhase] = useState<CrashPhase>("idle");

  const [isCustom, setIsCustom] = useState(savedTimeControl.isCustom);
  const [customMinutes, setCustomMinutes] = useState(savedTimeControl.minutes);
  const [customIncrement, setCustomIncrement] = useState(savedTimeControl.increment);

  const turnStartTime = useRef<number | null>(null);

  const [visualEffects, setVisualEffects] = useState(true);

  const [theme, setTheme] = useState<Theme>("classic");

  useEffect(() => {
    if (!appWindow) return;

    const resizeWindow = async () => {
      const isMaximized =
        await appWindow.isMaximized();

      if (isMaximized) {
        return;
      }

      const root = document.querySelector(
        ".clock-window"
      ) as HTMLElement | null;

      if (!root) {
        return;
      }

      const width = root.offsetWidth;
      const height = root.scrollHeight;

      await appWindow.setSize(
        new LogicalSize(width, height)
      );
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(resizeWindow);
    });
  }, [
    activePlayer,
    winner,
    crashPhase,
    isCustom,
  ]);

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

    localStorage.setItem(
      "chessclock-time-control",
      JSON.stringify({
        minutes: control.minutes,
        increment: control.increment,
        isCustom: false,
      })
    );
  }

  function applyCustomTimeControl() {
    if (activePlayer !== null) {
      return;
    }

    const startingTime =
      Math.max(customMinutes, 1) * 60;

    const customIncrementValue =
      Math.max(customIncrement, 0);

    setInitialTime(startingTime);
    setIncrement(customIncrementValue);

    setWhiteTime(startingTime);
    setBlackTime(startingTime);

    localStorage.setItem(
      "chessclock-time-control",
      JSON.stringify({
        minutes: Math.max(customMinutes, 1),
        increment: customIncrementValue,
        isCustom: true,
      })
    );
  }

  function switchTurn(player: Player) {
    if (
      isPaused ||
      activePlayer !== player ||
      winner !== null
    ) {
      return;
    }

    if (player === "white") {
      setWhiteTime(
        (currentTime) =>
          currentTime + increment
      );

      setActivePlayer("black");
    } else {
      setBlackTime(
        (currentTime) =>
          currentTime + increment
      );

      setActivePlayer("white");
    }
  }

  function togglePause() {
    if (
      activePlayer === null ||
      winner !== null
    ) {
      return;
    }

    setIsPaused(
      (paused) => !paused
    );
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

  useEffect(() => {
    if (
      activePlayer === null ||
      isPaused ||
      winner !== null
    ) {
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
          const nextTime =
            Math.max(
              currentTime - elapsed,
              0
            );

          if (nextTime === 0) {
            setWinner("black");
            setActivePlayer(null);

            if (visualEffects) {
              setCrashPhase("burst");
          
              setTimeout(() => {
                setCrashPhase("settled");
              }, 2800);
            } else {
              setCrashPhase("settled");
            }
          }

          return nextTime;
        });
      } else {
        setBlackTime((currentTime) => {
          const nextTime =
            Math.max(
              currentTime - elapsed,
              0
            );

          if (nextTime === 0) {
            setWinner("white");
            setActivePlayer(null);

            if (visualEffects) {
              setCrashPhase("burst");

              setTimeout(() => {
                setCrashPhase("settled");
              }, 2800);
            } else {
              setCrashPhase("settled");
            }
          }

          return nextTime;
        });
      }
    }, 10);

    return () => {
      clearInterval(interval);
      turnStartTime.current = null;
    };
  }, [
    activePlayer,
    isPaused,
    winner,
    visualEffects,
  ]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }

      const target =
        event.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.key === "Enter") {
        if (
          activePlayer === null &&
          winner === null
        ) {
          setActivePlayer("white");
        }

        return;
      }

      if (event.key.toLowerCase() === "r") {
        resetGame();
        return;
      }

      if (
        event.key.toLowerCase() === "a"
      ) {
        if (
          activePlayer === "white" &&
          !isPaused &&
          winner === null
        ) {
          switchTurn("white");
        }

        return;
      }

      if (
        event.key.toLowerCase() === "l"
      ) {
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
          setIsPaused(
            (paused) => !paused
          );
        }
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    activePlayer,
    isPaused,
    winner,
  ]);

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
    crashPhase,
    visualEffects,
    theme
  );

  const blackStatus = getPlayerStatus(
    blackTime,
    activePlayer === "black",
    isPaused,
    winner === "white",
    crashPhase,
    visualEffects,
    theme
  );

  const timeControlLabel =
    `${Math.round(initialTime / 60)}+${increment}`;

  const gameStatus = winner
    ? theme === "nature"
      ? "CYCLE COMPLETE"
      : "GAME OVER"
    : isPaused
      ? "PAUSED"
      : activePlayer
        ? "GAME IN PROGRESS"
        : "READY";

  return (
    <main 
      className="desktop"
      data-theme={theme}
    >
      <WindowChrome
        timeControlLabel={timeControlLabel}
        status={gameStatus}
        canStart={
          activePlayer === null &&
          winner === null
        }
        canPause={
          activePlayer !== null &&
          winner === null
        }
        isPaused={isPaused}
        onStart={() => setActivePlayer("white")}
        onReset={resetGame}
        onTogglePause={togglePause}
        visualEffects={visualEffects}
        onToggleVisualEffects={() =>
          setVisualEffects((enabled) => !enabled)
        }
        gameInProgress={
          activePlayer !== null &&
          winner === null
        }
        theme={theme}
        onThemeChange={setTheme}
      >
        <div className="window-content">
          {activePlayer === null &&
            winner === null && (
              <TimeControls
                controls={timeControls}
                isCustom={isCustom}
                customMinutes={customMinutes}
                customIncrement={customIncrement}
                onSelectControl={selectTimeControl}
                onCustomMinutesChange={setCustomMinutes}
                onCustomIncrementChange={setCustomIncrement}
                onApplyCustom={applyCustomTimeControl}
              />
            )}

          <span className="keyboard-status">
            KEYBOARD: A / L / SPACE / ENTER / R
          </span>

          {winner &&
            crashPhase === "settled" && (
              <div className="winner-message">
                {theme === "nature"
                  ? winner === "white"
                    ? "WHITE REMAINS"
                    : "BLACK REMAINS"
                  : theme === "bubblegum"
                    ? winner === "white"
                      ? "WHITE TAKES THE CAKE"
                      : "BLACK TAKES THE CAKE"
                  : winner === "white"
                    ? "WHITE_WINS_ON_TIME"
                    : "BLACK_WINS_ON_TIME"}
              </div>
            )}

          <div className="clock-grid">
            <Clock
              player="white"
              time={whiteTime}
              pressure={whitePressure}
              status={whiteStatus}
              isActive={activePlayer === "white"}
              isPaused={isPaused}
              winner={winner}
              crashPhase={crashPhase}
              visualEffects={visualEffects}
              onMove={() =>
                switchTurn("white")
              }
            />

            <Clock
              player="black"
              time={blackTime}
              pressure={blackPressure}
              status={blackStatus}
              isActive={activePlayer === "black"}
              isPaused={isPaused}
              winner={winner}
              crashPhase={crashPhase}
              visualEffects={visualEffects}
              onMove={() =>
                switchTurn("black")
              }
            />
          </div>

          <div
            className="nature-meadow"
            aria-hidden="true"
          />

          <div className="control-row">
            {activePlayer === null &&
            winner === null ? (
              <button
                className="retro-button primary-button"
                onClick={() =>
                  setActivePlayer("white")
                }
              >
                START GAME
              </button>
            ) : (
              <button
                className="retro-button"
                onClick={togglePause}
                disabled={activePlayer === null}
              >
                {isPaused
                  ? "RESUME"
                  : "PAUSE"}
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
      </WindowChrome>
    </main>
  );
}

export default App;