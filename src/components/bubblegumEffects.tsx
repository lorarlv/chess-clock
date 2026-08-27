import type {
  CSSProperties,
} from "react";

type Bubble = {
  x: number;
  y: number;
  size: number;
  reveal: number;
  tone: "pink" | "blue" | "purple";
};

type BubblegumEffectsProps = {
  time: number;
};

const bubbles: Bubble[] = [
  {
    x: 13,
    y: 76,
    size: 18,
    reveal: 0.08,
    tone: "pink",
  },
  {
    x: 84,
    y: 24,
    size: 16,
    reveal: 0.16,
    tone: "blue",
  },
  {
    x: 69,
    y: 78,
    size: 14,
    reveal: 0.30,
    tone: "purple",
  },
  {
    x: 34,
    y: 28,
    size: 12,
    reveal: 0.42,
    tone: "pink",
  },
  {
    x: 48,
    y: 82,
    size: 10,
    reveal: 0.56,
    tone: "purple",
  },
  {
    x: 92,
    y: 62,
    size: 11,
    reveal: 0.68,
    tone: "blue",
  },
  {
    x: 8,
    y: 32,
    size: 9,
    reveal: 0.78,
    tone: "pink",
  },
];

function BubblegumEffects({
  time,
}: BubblegumEffectsProps) {
  const growth = Math.max(
    0,
    Math.min(
      1,
      (30 - time) / 27
    )
  );

  return (
    <span
      className="bubblegum-bubbles"
      aria-hidden="true"
    >
      {bubbles.map(
        (
          {
            x,
            y,
            size,
            reveal,
            tone,
          },
          index
        ) => {
          const progress = Math.max(
            0,
            Math.min(
              1,
              (growth - reveal) / 0.18
            )
          );

          const currentSize =
            size *
            (
              0.42 +
              progress * 0.58
            );

          return (
            <span
              key={index}
              className={`bubblegum-embedded-bubble bubble-${tone}`}
              style={
                {
                  "--bubble-x": `${x}%`,
                  "--bubble-y": `${y}%`,
                  "--bubble-size": `${currentSize}px`,
                  "--bubble-opacity":
                    progress * 0.72,
                } as CSSProperties
              }
            />
          );
        }
      )}
    </span>
  );
}

export default BubblegumEffects;