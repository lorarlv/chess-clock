import { getCurrentWindow } from "@tauri-apps/api/window";

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
};

function WindowChrome({
  children,
  timeControlLabel,
  status,
}: WindowChromeProps) {
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