import type { Theme } from "../types/theme";

export type PressureState =
  | "normal"
  | "low"
  | "critical"
  | "terminal"
  | "crashed";

export type CrashPhase =
  | "idle"
  | "burst"
  | "settled";

const LOW_TIME_TEXT =
  "TIME IS RUNNING OUT";

const CRITICAL_TIME_TEXT =
  "T_ME///CR_T_CAL";

export function getPressureState(
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

/* =========================================================
   CLASSIC CORRUPTION
   ========================================================= */

function corruptStatusText(
  text: string,
  time: number
): string {
  if (time > 30) {
    return text;
  }

  const chars = [...text];

  const validIndexes = chars
    .map((char, index) =>
      char === " "
        ? -1
        : index
    )
    .filter(
      (index) =>
        index !== -1
    );

  /* 30s -> 20s */

  if (time > 20) {
    const progress =
      (30 - time) / 10;

    const interval =
      2.4 - progress * 1.5;

    const duration =
      0.08 + progress * 0.08;

    const elapsed =
      30 - time;

    const cycle =
      Math.floor(
        elapsed / interval
      );

    const phase =
      elapsed % interval;

    if (phase < duration) {
      const index =
        validIndexes[
          cycle %
          validIndexes.length
        ];

      chars[index] = "_";
    }

    return chars.join("");
  }

  /* 20s -> 7s */

  if (time > 7) {
    const progress =
      (20 - time) / 13;

    const updateRate =
      3 + progress * 9;

    const intensity =
      0.08 + progress * 0.42;

    const frame =
      Math.floor(
        time * updateRate
      );

    return chars
      .map(
        (char, index) => {
          if (char === " ") {
            return char;
          }

          const seed =
            Math.sin(
              index * 12.9898 +
              frame * 78.233
            ) *
            43758.5453;

          const random =
            seed -
            Math.floor(seed);

          if (
            random >
            intensity
          ) {
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
              random *
              variants.length
            )
          ];
        }
      )
      .join("");
  }

  /* last 7s */

  const criticalChars =
    [...CRITICAL_TIME_TEXT];

  const progress =
    (7 - time) / 7;

  const updateRate =
    9 + progress * 10;

  const intensity =
    0.12 + progress * 0.3;

  const frame =
    Math.floor(
      time * updateRate
    );

  return criticalChars
    .map(
      (char, index) => {
        if (char === " ") {
          return char;
        }

        const seed =
          Math.sin(
            index * 17.123 +
            frame * 63.417
          ) *
          43758.5453;

        const random =
          seed -
          Math.floor(seed);

        if (
          random >
          intensity
        ) {
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
            random *
            variants.length
          )
        ];
      }
    )
    .join("");
}

/* =========================================================
   CLASSIC STATUS
   ========================================================= */

function getClassicStatus(
  time: number,
  isActive: boolean,
  isPaused: boolean,
  hasTimedOut: boolean,
  crashPhase: CrashPhase,
  visualEffects: boolean
): string {
  if (hasTimedOut) {
    if (!visualEffects) {
      return "TIME EXPIRED";
    }

    if (
      crashPhase === "burst"
    ) {
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

  if (!visualEffects) {
    if (time <= 7) {
      return "TIME CRITICAL";
    }

    if (time <= 30) {
      return "TIME IS RUNNING OUT";
    }

    return "YOUR MOVE";
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

/* =========================================================
   BUBBLEGUM STATUS
   ========================================================= */

function getBubblegumStatus(
  time: number,
  isActive: boolean,
  isPaused: boolean,
  hasTimedOut: boolean,
  visualEffects: boolean
): string {
  if (hasTimedOut) {
    if (!visualEffects) {
      return "TIME'S UP";
    }

    return "POP!";
  }

  if (!isActive) {
    return "WAITING";
  }

  if (isPaused) {
    return "PAUSED";
  }

  if (!visualEffects) {
    if (time <= 7) {
      return "TIME CRITICAL";
    }

    if (time <= 30) {
      return "TIME IS RUNNING OUT";
    }

    return "YOUR MOVE";
  }

  if (time <= 7) {
    return "UH OH...";
  }

  if (time <= 15) {
    return "HURRY!";
  }

  if (time <= 30) {
    return "TICK TOCK";
  }

  return "UR MOVE";
}

/* =========================================================
   NATURE STATUS
   ========================================================= */

function getNatureStatus(
  time: number,
  isActive: boolean,
  isPaused: boolean,
  hasTimedOut: boolean,
  _crashPhase: CrashPhase,
  visualEffects: boolean
): string {
  if (hasTimedOut) {
    if (!visualEffects) {
      return "TIME EXPIRED";
    }

    return "RECLAIMED";
  }

  if (!isActive) {
    return "WAITING";
  }

  if (isPaused) {
    return "PAUSED";
  }

  if (!visualEffects) {
    if (time <= 7) {
      return "TIME CRITICAL";
    }

    if (time <= 30) {
      return "TIME IS RUNNING OUT";
    }

    return "YOUR MOVE";
  }

  if (time <= 7) {
    return "CONTROL LOST";
  }

  if (time <= 15) {
    return "SYSTEM OVERRUN";
  }

  if (time <= 30) {
    return "GROWTH DETECTED";
  }

  return "YOUR MOVE";
}

/* =========================================================
   PUBLIC STATUS FUNCTION
   ========================================================= */

export function getPlayerStatus(
  time: number,
  isActive: boolean,
  isPaused: boolean,
  hasTimedOut: boolean,
  crashPhase: CrashPhase,
  visualEffects: boolean,
  theme: Theme = "classic"
): string {
  if (theme === "bubblegum") {
    return getBubblegumStatus(
      time,
      isActive,
      isPaused,
      hasTimedOut,
      visualEffects
    );
  }

  if (theme === "nature") {
    return getNatureStatus(
      time,
      isActive,
      isPaused,
      hasTimedOut,
      crashPhase,
      visualEffects
    );
  }

  return getClassicStatus(
    time,
    isActive,
    isPaused,
    hasTimedOut,
    crashPhase,
    visualEffects
  );
}