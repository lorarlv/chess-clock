import type { Theme } from "../types/theme";

import { getCurrentWindow } from "@tauri-apps/api/window";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import PixelIcon from "./pixel";

const isTauri =
  typeof window !== "undefined" &&
  "__TAURI_INTERNALS__" in window;

const appWindow = isTauri
  ? getCurrentWindow()
  : null;

async function minimizeWindow() {
  if(!appWindow) return;
  await appWindow.minimize();
}

async function toggleMaximizeWindow() {
  if(!appWindow) return;
  await appWindow.toggleMaximize();
}

async function startNativeDrag() {
  if(!appWindow) return;
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
  gameInProgress: boolean;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
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
  gameInProgress,
  theme,
  onThemeChange,
}: WindowChromeProps) {

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const [alwaysOnTop, setAlwaysOnTop] = useState(false);

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  
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

  async function requestClose() {
    if (gameInProgress) {
      setShowCloseConfirm(true);
      return;
    }

    if(!appWindow) return;
    await appWindow.destroy();
  }

  async function confirmClose() {
    setShowCloseConfirm(false);
    if(!appWindow) return;
    await appWindow.destroy();
  }

  useEffect(() => {
    if(!appWindow) return;
    
    appWindow.isAlwaysOnTop().then(setAlwaysOnTop);
  }, []);

  async function toggleAlwaysOnTop() {
    if(!appWindow) return;

    const nextValue = !alwaysOnTop;

    await appWindow.setAlwaysOnTop(nextValue);
    setAlwaysOnTop(nextValue);
  }

  useEffect(() => {
    if(!appWindow) return;

    let unlisten: (() => void) | undefined;

    appWindow.onCloseRequested((event) => {
      if (gameInProgress) {
        event.preventDefault();
        setShowCloseConfirm(true);
      }
    })
      .then((cleanup) => {
        unlisten = cleanup;
      });

    return () => {
      unlisten?.();
    };
  }, [gameInProgress]);

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
    if (
      openDialog !== "about" ||
      !visualEffects ||
      theme !== "classic"
    ) {
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
  }, [openDialog, visualEffects, theme]);

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

          if (event.detail === 2) {
            toggleMaximizeWindow();
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
            onClick={requestClose}
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
                onClick={requestClose}
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
                onClick={toggleAlwaysOnTop}
              >
                <span className="menu-check">
                  {alwaysOnTop ? "✓" : ""}
                </span>

                <span>Always on top</span>
              </button>

              <button
                type="button"
                className="menu-check-item"
                onClick={onToggleVisualEffects}
              >
                <span className="menu-check">
                  {visualEffects ? "✓" : ""}
                </span>

                <span>Visual Effects</span>
              </button>

              <div className="menu-separator" />

              <div
                className="submenu-item"
                onMouseEnter={() =>
                  setThemeMenuOpen(true)
                }
                onMouseLeave={() =>
                  setThemeMenuOpen(false)
                }
              >
                <button
                  type="button"
                  className="submenu-trigger"
                  onClick={() =>
                    setThemeMenuOpen(
                      (open) => !open
                    )
                  }
                >
                  <span className="menu-check" />
                  <span>Theme</span>
                  <span className="submenu-arrow">
                    ▶
                  </span>
                </button>

                {themeMenuOpen && (
                  <div className="menu-dropdown theme-submenu">
                    <button
                      type="button"
                      className="menu-check-item"
                      onClick={() => {
                        onThemeChange("classic");
                        setThemeMenuOpen(false);
                      }}
                    >
                      <span className="menu-check">
                        {theme === "classic" ? "✓" : ""}
                      </span>
                      <span>Classic</span>
                    </button>

                    <button
                      type="button"
                      className="menu-check-item"
                      onClick={() => {
                        onThemeChange("bubblegum");
                        setThemeMenuOpen(false);
                      }}
                    >
                      <span className="menu-check">
                        {theme === "bubblegum" ? "✓" : ""}
                      </span>
                      <span>Bubblegum</span>
                    </button>

                    <button
                      type="button"
                      className="menu-check-item"
                      onClick={() => {
                        onThemeChange("nature");
                        setThemeMenuOpen(false);
                      }}
                    >
                      <span className="menu-check">
                        {theme === "nature" ? "✓" : ""}
                      </span>
                      <span>Nature</span>
                    </button>
                  </div>
                )}
              </div>
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
                {theme === "bubblegum" ? (
                  <>
                    <p className="about-heading">
                      <strong>CHESS CLOCK</strong>
                    </p>
                    
                    <p className="about-version">
                      Version 1.0
                    </p>
                    
                    <div className="about-diagnostics bubblegum-about-diagnostics">
                      <span>Style engine</span>
                      <span>BUBBLEGUM</span>
                      
                      <span>Display mode</span>
                      <span>CANDY GLASS</span>

                      <span>Clock sync</span>
                      <span>PERFECT</span>
                      
                      <span>Sparkle level</span>
                      <span>100%</span>
                      
                      <span>Bubble status</span>
                      <span>STABLE</span>
                      
                      <span>Mood</span>
                      <span>CUTE</span>
                      
                      <span>Time remaining</span>
                      <span>???</span>
                    </div>
                    
                    <p className="about-system-message bubblegum-about-system-message">
                      EVERYTHING IS FINE :3
                    </p>
                    
                    <p className="about-warning bubblegum-about-warning">
                      HAVE FUN N DON'T BE LATE!
                    </p>
                  </>

                ) : theme === "nature" ? (
                  <>
                    <p className="about-heading nature-about-heading">
                      <strong>CHESS CLOCK</strong>
                    </p>

                    <p className="about-version nature-about-version">
                      Version 1.0
                    </p>

                    <div className="about-diagnostics nature-about-diagnostics">
                      <span>Environment</span>
                      <span>UNCONTROLLED</span>

                      <span>Growth detected</span>
                      <span>YES</span>

                      <span>System integrity</span>
                      <span>COMPROMISED</span>

                      <span>Display condition</span>
                      <span>DEGRADING</span>

                      <span>Root access</span>
                      <span>ESTABLISHED</span>

                      <span>Recovery status</span>
                      <span>UNLIKELY</span>
                    </div>

                    <p className="about-system-message nature-about-system-message">
                      NATURAL PROCESSES ACTIVE
                    </p>

                    <p className="about-warning nature-about-warning">
                      DO NOT DISTURB
                    </p>
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
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showCloseConfirm && (
        <div className="dialog-overlay">
          <div className="retro-dialog close-dialog">
            <div className="dialog-title-bar">
              <span>chessclock.exe</span>
            </div>

            <div className="dialog-content">
              <p>
                <strong>GAME STILL IN PROGRESS</strong>
              </p>

              <p>Timing process has not completed.</p>

              <p className="close-warning">
                TERMINATE ANYWAY?
              </p>

              <div className="dialog-actions">
                <button
                  type="button"
                  className="retro-button"
                  onClick={() =>
                    setShowCloseConfirm(false)
                  }
                >
                  CANCEL
                </button>

                <button
                  type="button"
                  className="retro-button"
                  onClick={confirmClose}
                >
                  TERMINATE
                </button>
              </div>
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