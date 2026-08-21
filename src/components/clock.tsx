import PixelIcon from "./pixel";

import { formatTime } from "../utils/formatTime";

import type { CrashPhase, PressureState } from "../utils/pressure";

type Player = "white" | "black";

type ClockProps = {
  player: Player;
  time: number;
  pressure: PressureState;
  status: string;

  isActive: boolean;
  isPaused: boolean;

  winner: Player | null;
  crashPhase: CrashPhase;

  visualEffects: boolean;

  onMove: () => void;
};

function Clock({
  player,
  time,
  pressure,
  status,
  isActive,
  isPaused,
  winner,
  crashPhase,
  visualEffects,
  onMove,
}: ClockProps) {
  const isWhite = player === "white";

  const hasLostOnTime =
    isWhite
      ? winner === "black"
      : winner === "white";

  const label =
    isWhite
      ? "WHITE"
      : "BLACK";

  const key =
    isWhite
      ? "A"
      : "L";

  const icon =
    isWhite
      ? "white-king"
      : "black-king";

  return (
    <section
      className={`player-panel ${
        visualEffects ? pressure : "normal"
      } ${
        visualEffects && hasLostOnTime
          ? crashPhase
          : ""
      } ${
        isActive ? "active" : ""
      }`}
    >
      <div className="player-label">
        <span
          className={`status-light ${
            isActive ? "on" : ""
          }`}
        />

        <PixelIcon type={icon} />

        <span>{label}</span>
      </div>

      <div className="clock-display">
        <span className="clock-value">
          {formatTime(time)}
        </span>
      </div>

      <div className="player-status">
        {status}
      </div>

      <button
        className="player-button"
        onClick={onMove}
        disabled={
          !isActive ||
          isPaused ||
          winner !== null
        }
      >
        [ {key} ] {label} MOVED
      </button>
    </section>
  );
}

export default Clock;