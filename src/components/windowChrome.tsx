import { getCurrentWindow } from "@tauri-apps/api/window";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import PixelIcon from "./pixel";

const appWindow = getCurrentWindow();

async function minimizeWindow() {
  await appWindow.minimize();
}

async function toggleMaximizeWindow() {
  await appWindow.toggleMaximize();
}

async function closeWindow() {
  await appWindow.close();
}

async function startNativeDrag() {
  await appWindow.startDragging();
}

type WindowChromeProps = {
  children: ReactNode;
  timeControlLabel: string;
  status: string;
  canStart: boolean;
  canPause: boolean;
  isPaused: boolean;
  onStart: () => void;
  onReset: () => void;
  onTogglePause: () => void;
  visualEffects: boolean;
  onToggleVisualEffects: () => void;
};

function WindowChrome({
  children,
  timeControlLabel,
  status,
  canStart,
  canPause,
  isPaused,
  onStart,
  onReset,
  onTogglePause,
  visualEffects,
  onToggleVisualEffects,
}: WindowChromeProps) {
  
  const [openMenu, setOpenMenu] = useState<
    "game" | "clock" | "options" | "help" | null
  >(null);

  const [openDialog, setOpenDialog] = useState<
    "controls" | "about" | null
  >(null);

  const [aboutGlitch, setAboutGlitch] = useState<
    "integrity" | "observer" | "errors" | null
  >(null);

  const menuBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (
        menuBarRef.current &&
        !menuBarRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenMenu(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handleMouseDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleMouseDown
      );
    };
  }, []);

  useEffect(() => {
    if (openDialog !== "about") {
      setAboutGlitch(null);
      return;
    }

    let glitchTimeout: ReturnType<typeof setTimeout>;
    let resetTimeout: ReturnType<typeof setTimeout>;

    function scheduleGlitch() {
      const delay =
        1800 + Math.random() * 3500;

      glitchTimeout = setTimeout(() => {
        const roll = Math.random();

        let glitch:
          | "integrity"
          | "observer"
          | "errors";

        if (roll < 0.5) {
          glitch = "integrity";
        } else if (roll < 0.85) {
          glitch = "observer";
        } else {
          glitch = "errors";
        }

        setAboutGlitch(glitch);

        const duration =
          90 + Math.random() * 240;

        resetTimeout = setTimeout(() => {
          setAboutGlitch(null);
          scheduleGlitch();
        }, duration);
      }, delay);
    }

    scheduleGlitch();

    return () => {
      clearTimeout(glitchTimeout);
      clearTimeout(resetTimeout);
    };
  }, [openDialog]);

  return (
    <div className="clock-window">
      <div
        className="title-bar"
        onMouseDown={(event) => {
          if (event.button !== 0) {
            return;
          }

          if ((event.target as HTMLElement).closest(".window-buttons")) {
            return;
          }

          startNativeDrag();
        }}
      >
        <div className="title-bar-left">
          <PixelIcon type="app" />
          <span>chessclock.exe</span>
        </div>

        <div className="window-buttons">
          <button
            type="button"
            onClick={minimizeWindow}
          >
            _
          </button>

          <button
            type="button"
            onClick={toggleMaximizeWindow}
          >
            □
          </button>

          <button
            type="button"
            onClick={closeWindow}
          >
            ×
          </button>
        </div>
      </div>

      <div 
        className="menu-bar"
        ref={menuBarRef}
      >
        <div className="menu-item">
          <button
            type="button"
            className={`menu-button ${
              openMenu === "game" ? "active" : ""
            }`}
            onClick={() =>
              setOpenMenu(
                openMenu === "game" ? null : "game"
              )
            }
          >
            Game
          </button>

          {openMenu === "game" && (
            <div className="menu-dropdown">
              <button 
                type="button"
                disabled={!canStart}
                onClick={() => {
                  onStart();
                  setOpenMenu(null);
                }}
              >
                New game
              </button>

              <button 
                type="button"
                onClick={() => {
                  onReset();
                  setOpenMenu(null);
                }}
              >
                Reset
              </button>

              <div className="menu-separator" />

              <button
                type="button"
                onClick={closeWindow}
              >
                Exit
              </button>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button
            type="button"
            className={`menu-button ${
              openMenu === "clock" ? "active" : ""
            }`}
            onClick={() =>
              setOpenMenu(
                openMenu === "clock" ? null : "clock"
              )
            }
          >
            Clock
          </button>

          {openMenu === "clock" && (
            <div className="menu-dropdown">
              <button
                type="button"
                disabled={!canPause}
                onClick={() => {
                  onTogglePause();
                  setOpenMenu(null);
                }}
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button
            type="button"
            className={`menu-button ${
              openMenu === "options" ? "active" : ""
            }`}
            onClick={() =>
              setOpenMenu(
                openMenu === "options" ? null : "options"
              )
            }
          >
            Options
          </button>

          {openMenu === "options" && (
            <div className="menu-dropdown options-dropdown">
              <button
                type="button"
                className="menu-check-item"
                onClick={() => {
                  onToggleVisualEffects();
                }}
              >
                <span className="menu-check">
                  {visualEffects ? "✓" : ""}
                </span>

                <span>Visual Effects</span>
              </button>
            </div>
          )}
        </div>

        <div className="menu-item">
          <button
            type="button"
            className={`menu-button ${
              openMenu === "help" ? "active" : ""
            }`}
            onClick={() =>
              setOpenMenu(
                openMenu === "help" ? null : "help"
              )
            }
          >
            ?
          </button>

          {openMenu === "help" && (
            <div className="menu-dropdown">
              <button
                type="button"
                onClick={() => {
                  setOpenDialog("controls");
                  setOpenMenu(null);
                }}
              >
                Controls
              </button>

                <div className="menu-separator" />

                <button
                  type="button"
                  onClick={() => {
                    setOpenDialog("about");
                    setOpenMenu(null);
                  }}
                >
                  About
                </button>
              </div>
          )}
        </div>
      </div>

      {openDialog !== null && (
        <div className="dialog-overlay">
          <div className="retro-dialog">
            <div className="dialog-title-bar">
              <span>
                {openDialog === "controls"
                  ? "Controls"
                  : "About chessclock.exe"}
              </span>

              <button
                type="button"
                onClick={() => setOpenDialog(null)}
              >
                ×
              </button>
            </div>

            <div className="dialog-content">
              {openDialog === "controls" ? (
                <>
                  <p><strong>KEYBOARD CONTROLS</strong></p>

                  <div className="controls-list">
                    <span>ENTER</span>
                    <span>Start game</span>

                    <span>A</span>
                    <span>White finishes move</span>

                    <span>L</span>
                    <span>Black finishes move</span>

                    <span>SPACE</span>
                    <span>Pause / Resume</span>

                    <span>R</span>
                    <span>Reset game</span>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>CHESS CLOCK</strong></p>
                  <p>Version 1.0</p>
                  
                  <div className="about-diagnostics">
                    <span>Timing module</span>
                    <span>SYNCHRONIZED</span>

                    <span>Clock integrity</span>
                    <span>
                      {aboutGlitch === "integrity"
                        ? "ST_BL_"
                        : "STABLE"}
                    </span>

                    <span>Process status</span>
                    <span>RUNNING</span>

                    <span>Elapsed time</span>
                    <span className="about-corrupt">
                      UNKNOWN
                    </span>

                    <span>Remaining time</span>
                    <span className="about-corrupt">
                      UNKNOWN
                    </span>

                    <span>Last move</span>
                    <span>--:--:--</span>

                    <span>Observer</span>
                    <span className="about-corrupt">
                      {aboutGlitch === "observer"
                        ? "YOU"
                        : "PRESENT"}
                    </span>
                  </div>

                  <p className="about-system-message">
                    {aboutGlitch === "errors"
                      ? "NO ERR_RS DET_CTED"
                      : "NO ERRORS DETECTED"}
                  </p>

                  <p className="about-warning">
                    DO NOT WASTE YOUR TIME
                  </p>
                </>
              )}

              <button
                type="button"
                className="retro-button dialog-ok"
                onClick={() => setOpenDialog(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="program-banner">
        <div>
          <strong>CHESS CLOCK</strong>
          <span> version 1.0</span>
        </div>

        <span className="program-message">
          DON'T WASTE YOUR TIME
        </span>
      </div>

      {children}

      <div className="status-bar">
        <span>
          TIME CONTROL: {timeControlLabel}
        </span>

        <span>{status}</span>
      </div>
    </div>
  );
}

export default WindowChrome;