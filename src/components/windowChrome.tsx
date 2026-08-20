import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

import PixelIcon from "./pixel";

type WindowChromeProps = {
  children: ReactNode;

  isDragging: boolean;
  windowPosition: {
    x: number;
    y: number;
  };

  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;

  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;

  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;

  onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => void;

  timeControlLabel: string;
  status: string;
};

function WindowChrome({
  children,
  isDragging,
  windowPosition,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  timeControlLabel,
  status,
}: WindowChromeProps) {
  return (
    <div
      className={`clock-window ${
        isDragging ? "dragging" : ""
      }`}
      style={{
        transform: `translate(
          ${windowPosition.x}px,
          ${windowPosition.y}px
        )`,
      }}
    >
      <div
        className="title-bar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
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