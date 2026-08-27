import type {
  CSSProperties,
} from "react";

type NatureTone =
  | "deep"
  | "dark"
  | "main"
  | "light";

type MossPixel = {
  x: number;
  y: number;
  stage: 1 | 2 | 3 | 4;
  tone: NatureTone;
};

type GrowthPixel = {
  x: number;
  y: number;
  tone: NatureTone;
  reveal: number;
};

type NatureEffectsProps = {
  time: number;
  hasLostOnTime: boolean;
};

const mossPixels: MossPixel[] = [
  { x: 0, y: 0, stage: 1, tone: "dark" },
  { x: 1, y: 0, stage: 1, tone: "main" },
  { x: 2, y: 0, stage: 1, tone: "dark" },
  { x: 0, y: 1, stage: 1, tone: "main" },
  { x: 1, y: 1, stage: 1, tone: "main" },
  { x: 2, y: 1, stage: 1, tone: "deep" },
  { x: 0, y: 2, stage: 1, tone: "dark" },
  { x: 1, y: 2, stage: 1, tone: "main" },

  { x: 3, y: 0, stage: 2, tone: "main" },
  { x: 4, y: 0, stage: 2, tone: "dark" },
  { x: 5, y: 0, stage: 2, tone: "main" },
  { x: 3, y: 1, stage: 2, tone: "main" },
  { x: 4, y: 1, stage: 2, tone: "deep" },
  { x: 2, y: 2, stage: 2, tone: "dark" },
  { x: 3, y: 2, stage: 2, tone: "main" },
  { x: 0, y: 3, stage: 2, tone: "main" },
  { x: 1, y: 3, stage: 2, tone: "dark" },
  { x: 0, y: 4, stage: 2, tone: "deep" },

  { x: 6, y: 0, stage: 3, tone: "dark" },
  { x: 7, y: 0, stage: 3, tone: "main" },
  { x: 8, y: 0, stage: 3, tone: "dark" },
  { x: 9, y: 0, stage: 3, tone: "main" },
  { x: 10, y: 0, stage: 3, tone: "deep" },
  { x: 5, y: 1, stage: 3, tone: "main" },
  { x: 6, y: 1, stage: 3, tone: "dark" },
  { x: 7, y: 1, stage: 3, tone: "main" },
  { x: 4, y: 2, stage: 3, tone: "main" },
  { x: 5, y: 2, stage: 3, tone: "deep" },
  { x: 6, y: 2, stage: 3, tone: "dark" },
  { x: 2, y: 3, stage: 3, tone: "main" },
  { x: 3, y: 3, stage: 3, tone: "dark" },
  { x: 1, y: 4, stage: 3, tone: "main" },
  { x: 2, y: 4, stage: 3, tone: "deep" },
  { x: 0, y: 5, stage: 3, tone: "dark" },
  { x: 1, y: 5, stage: 3, tone: "main" },
  { x: 0, y: 6, stage: 3, tone: "deep" },

  { x: 11, y: 0, stage: 4, tone: "main" },
  { x: 12, y: 0, stage: 4, tone: "dark" },
  { x: 13, y: 0, stage: 4, tone: "main" },
  { x: 14, y: 0, stage: 4, tone: "deep" },
  { x: 15, y: 0, stage: 4, tone: "dark" },
  { x: 16, y: 0, stage: 4, tone: "main" },
  { x: 17, y: 0, stage: 4, tone: "dark" },
  { x: 18, y: 0, stage: 4, tone: "deep" },

  { x: 8, y: 1, stage: 4, tone: "main" },
  { x: 9, y: 1, stage: 4, tone: "dark" },
  { x: 10, y: 1, stage: 4, tone: "main" },
  { x: 11, y: 1, stage: 4, tone: "deep" },
  { x: 12, y: 1, stage: 4, tone: "dark" },
  { x: 14, y: 1, stage: 4, tone: "main" },
  { x: 15, y: 1, stage: 4, tone: "dark" },

  { x: 7, y: 2, stage: 4, tone: "dark" },
  { x: 8, y: 2, stage: 4, tone: "main" },
  { x: 9, y: 2, stage: 4, tone: "deep" },
  { x: 11, y: 2, stage: 4, tone: "main" },
  { x: 12, y: 2, stage: 4, tone: "dark" },

  { x: 4, y: 3, stage: 4, tone: "main" },
  { x: 5, y: 3, stage: 4, tone: "dark" },
  { x: 6, y: 3, stage: 4, tone: "deep" },
  { x: 8, y: 3, stage: 4, tone: "main" },

  { x: 3, y: 4, stage: 4, tone: "dark" },
  { x: 4, y: 4, stage: 4, tone: "main" },
  { x: 6, y: 4, stage: 4, tone: "dark" },

  { x: 2, y: 5, stage: 4, tone: "main" },
  { x: 3, y: 5, stage: 4, tone: "deep" },

  { x: 1, y: 6, stage: 4, tone: "dark" },
  { x: 2, y: 6, stage: 4, tone: "main" },

  { x: 0, y: 7, stage: 4, tone: "main" },
  { x: 1, y: 7, stage: 4, tone: "deep" },
  { x: 0, y: 8, stage: 4, tone: "dark" },

  { x: 4, y: 5, stage: 4, tone: "dark" },
  { x: 4, y: 6, stage: 4, tone: "main" },
  { x: 4, y: 7, stage: 4, tone: "deep" },

  { x: 7, y: 4, stage: 4, tone: "dark" },
  { x: 7, y: 5, stage: 4, tone: "main" },

  { x: 10, y: 2, stage: 4, tone: "dark" },
  { x: 10, y: 3, stage: 4, tone: "main" },
  { x: 10, y: 4, stage: 4, tone: "deep" },

  { x: 13, y: 1, stage: 4, tone: "dark" },
  { x: 13, y: 2, stage: 4, tone: "main" },

  { x: 16, y: 1, stage: 4, tone: "dark" },

  { x: 2, y: 1, stage: 4, tone: "light" },
  { x: 5, y: 0, stage: 4, tone: "light" },
  { x: 8, y: 1, stage: 4, tone: "light" },
  { x: 12, y: 0, stage: 4, tone: "light" },
];

const greeneryPixels: GrowthPixel[] = [
  { x: 2, y: 5, tone: "dark", reveal: 0.42 },
  { x: 2, y: 6, tone: "dark", reveal: 0.45 },
  { x: 2, y: 7, tone: "main", reveal: 0.48 },
  { x: 3, y: 8, tone: "dark", reveal: 0.51 },
  { x: 3, y: 9, tone: "main", reveal: 0.54 },
  { x: 3, y: 10, tone: "dark", reveal: 0.57 },
  { x: 4, y: 11, tone: "main", reveal: 0.60 },
  { x: 4, y: 12, tone: "dark", reveal: 0.63 },
  { x: 5, y: 13, tone: "main", reveal: 0.66 },
  { x: 5, y: 14, tone: "dark", reveal: 0.69 },
  { x: 6, y: 15, tone: "main", reveal: 0.72 },
  { x: 6, y: 16, tone: "deep", reveal: 0.75 },

  { x: 1, y: 8, tone: "main", reveal: 0.53 },
  { x: 2, y: 8, tone: "light", reveal: 0.55 },
  { x: 4, y: 10, tone: "main", reveal: 0.59 },
  { x: 5, y: 10, tone: "dark", reveal: 0.61 },
  { x: 3, y: 13, tone: "main", reveal: 0.67 },
  { x: 4, y: 13, tone: "light", reveal: 0.69 },
  { x: 7, y: 15, tone: "main", reveal: 0.74 },
  { x: 8, y: 15, tone: "dark", reveal: 0.77 },

  { x: 17, y: 1, tone: "dark", reveal: 0.50 },
  { x: 18, y: 1, tone: "main", reveal: 0.53 },
  { x: 19, y: 1, tone: "dark", reveal: 0.56 },
  { x: 20, y: 2, tone: "main", reveal: 0.59 },
  { x: 21, y: 2, tone: "dark", reveal: 0.62 },
  { x: 22, y: 2, tone: "main", reveal: 0.65 },
  { x: 23, y: 3, tone: "dark", reveal: 0.68 },
  { x: 24, y: 3, tone: "main", reveal: 0.71 },
  { x: 25, y: 4, tone: "dark", reveal: 0.74 },
  { x: 26, y: 4, tone: "main", reveal: 0.77 },
  { x: 27, y: 5, tone: "dark", reveal: 0.80 },
  { x: 28, y: 5, tone: "deep", reveal: 0.83 },

  { x: 20, y: 0, tone: "main", reveal: 0.61 },
  { x: 21, y: 0, tone: "light", reveal: 0.63 },
  { x: 23, y: 4, tone: "main", reveal: 0.70 },
  { x: 24, y: 4, tone: "light", reveal: 0.72 },
  { x: 26, y: 2, tone: "main", reveal: 0.78 },
  { x: 27, y: 2, tone: "dark", reveal: 0.80 },

  { x: 12, y: 3, tone: "dark", reveal: 0.68 },
  { x: 12, y: 4, tone: "main", reveal: 0.71 },
  { x: 12, y: 5, tone: "dark", reveal: 0.74 },
  { x: 13, y: 6, tone: "main", reveal: 0.77 },
  { x: 13, y: 7, tone: "deep", reveal: 0.80 },
  { x: 11, y: 5, tone: "main", reveal: 0.75 },
  { x: 10, y: 5, tone: "light", reveal: 0.78 },
];

const reclaimPixels: GrowthPixel[] = [
  { x: 0, y: 0, tone: "deep", reveal: 0.48 },
  { x: 1, y: 0, tone: "dark", reveal: 0.50 },
  { x: 2, y: 0, tone: "main", reveal: 0.52 },
  { x: 3, y: 0, tone: "dark", reveal: 0.54 },
  { x: 4, y: 0, tone: "main", reveal: 0.56 },
  { x: 5, y: 0, tone: "deep", reveal: 0.58 },
  { x: 6, y: 0, tone: "dark", reveal: 0.60 },
  { x: 7, y: 0, tone: "main", reveal: 0.62 },
  { x: 8, y: 0, tone: "dark", reveal: 0.64 },
  { x: 9, y: 0, tone: "main", reveal: 0.66 },

  { x: 1, y: 1, tone: "dark", reveal: 0.53 },
  { x: 2, y: 1, tone: "main", reveal: 0.55 },
  { x: 3, y: 1, tone: "deep", reveal: 0.57 },
  { x: 4, y: 1, tone: "main", reveal: 0.59 },
  { x: 6, y: 1, tone: "dark", reveal: 0.63 },
  { x: 7, y: 1, tone: "main", reveal: 0.65 },

  { x: 0, y: 2, tone: "dark", reveal: 0.56 },
  { x: 1, y: 2, tone: "main", reveal: 0.58 },
  { x: 3, y: 2, tone: "dark", reveal: 0.61 },
  { x: 4, y: 2, tone: "main", reveal: 0.63 },

  { x: 1, y: 3, tone: "main", reveal: 0.60 },
  { x: 2, y: 3, tone: "dark", reveal: 0.62 },

  { x: 3, y: 4, tone: "dark", reveal: 0.66 },
  { x: 3, y: 5, tone: "main", reveal: 0.69 },
  { x: 3, y: 6, tone: "dark", reveal: 0.72 },
  { x: 4, y: 7, tone: "main", reveal: 0.75 },
  { x: 4, y: 8, tone: "dark", reveal: 0.78 },
  { x: 4, y: 9, tone: "main", reveal: 0.81 },
  { x: 5, y: 10, tone: "dark", reveal: 0.84 },
  { x: 5, y: 11, tone: "main", reveal: 0.87 },

  { x: 2, y: 6, tone: "main", reveal: 0.74 },
  { x: 1, y: 6, tone: "dark", reveal: 0.76 },
  { x: 5, y: 8, tone: "main", reveal: 0.80 },
  { x: 6, y: 8, tone: "light", reveal: 0.82 },
  { x: 4, y: 10, tone: "main", reveal: 0.85 },
  { x: 3, y: 10, tone: "dark", reveal: 0.87 },

  { x: 10, y: 0, tone: "dark", reveal: 0.67 },
  { x: 11, y: 0, tone: "main", reveal: 0.69 },
  { x: 12, y: 0, tone: "dark", reveal: 0.71 },
  { x: 13, y: 0, tone: "deep", reveal: 0.73 },
  { x: 14, y: 0, tone: "main", reveal: 0.75 },
  { x: 15, y: 0, tone: "dark", reveal: 0.77 },
  { x: 16, y: 0, tone: "main", reveal: 0.79 },
  { x: 17, y: 0, tone: "dark", reveal: 0.81 },
  { x: 18, y: 0, tone: "main", reveal: 0.83 },
  { x: 19, y: 0, tone: "deep", reveal: 0.85 },
  { x: 20, y: 0, tone: "dark", reveal: 0.87 },
  { x: 21, y: 0, tone: "main", reveal: 0.89 },
  { x: 22, y: 0, tone: "dark", reveal: 0.91 },

  { x: 9, y: 1, tone: "main", reveal: 0.70 },
  { x: 10, y: 1, tone: "dark", reveal: 0.72 },
  { x: 13, y: 1, tone: "main", reveal: 0.76 },
  { x: 14, y: 1, tone: "dark", reveal: 0.78 },
  { x: 17, y: 1, tone: "main", reveal: 0.82 },
  { x: 18, y: 1, tone: "dark", reveal: 0.84 },
  { x: 21, y: 1, tone: "main", reveal: 0.90 },

  { x: 7, y: 2, tone: "dark", reveal: 0.73 },
  { x: 8, y: 2, tone: "main", reveal: 0.75 },
  { x: 8, y: 3, tone: "dark", reveal: 0.78 },
  { x: 12, y: 2, tone: "dark", reveal: 0.79 },
  { x: 13, y: 2, tone: "main", reveal: 0.81 },
  { x: 17, y: 2, tone: "dark", reveal: 0.85 },
  { x: 18, y: 2, tone: "main", reveal: 0.87 },

  { x: 6, y: 3, tone: "main", reveal: 0.77 },
  { x: 5, y: 3, tone: "dark", reveal: 0.79 },
  { x: 11, y: 3, tone: "main", reveal: 0.83 },
  { x: 10, y: 3, tone: "dark", reveal: 0.85 },
  { x: 16, y: 3, tone: "main", reveal: 0.89 },
  { x: 15, y: 3, tone: "dark", reveal: 0.91 },

  { x: 2, y: 1, tone: "light", reveal: 0.61 },
  { x: 6, y: 1, tone: "light", reveal: 0.68 },
  { x: 12, y: 0, tone: "light", reveal: 0.78 },
];

const bottomGrowthPixels: GrowthPixel[] = [
  { x: 0, y: 0, tone: "deep", reveal: 0.58 },
  { x: 1, y: 0, tone: "dark", reveal: 0.60 },
  { x: 2, y: 0, tone: "main", reveal: 0.62 },
  { x: 3, y: 0, tone: "dark", reveal: 0.64 },
  { x: 4, y: 0, tone: "main", reveal: 0.66 },
  { x: 5, y: 0, tone: "dark", reveal: 0.68 },
  { x: 6, y: 0, tone: "deep", reveal: 0.70 },
  { x: 7, y: 0, tone: "main", reveal: 0.72 },
  { x: 8, y: 0, tone: "dark", reveal: 0.74 },
  { x: 9, y: 0, tone: "main", reveal: 0.76 },
  { x: 10, y: 0, tone: "dark", reveal: 0.78 },
  { x: 11, y: 0, tone: "main", reveal: 0.80 },
  { x: 12, y: 0, tone: "deep", reveal: 0.82 },

  { x: 1, y: 1, tone: "main", reveal: 0.63 },
  { x: 2, y: 1, tone: "dark", reveal: 0.65 },
  { x: 4, y: 1, tone: "main", reveal: 0.69 },
  { x: 5, y: 1, tone: "dark", reveal: 0.71 },
  { x: 7, y: 1, tone: "main", reveal: 0.75 },
  { x: 8, y: 1, tone: "dark", reveal: 0.77 },

  { x: 2, y: 2, tone: "dark", reveal: 0.68 },
  { x: 3, y: 2, tone: "main", reveal: 0.70 },
  { x: 6, y: 2, tone: "dark", reveal: 0.74 },
  { x: 7, y: 2, tone: "main", reveal: 0.76 },

  { x: 3, y: 3, tone: "main", reveal: 0.72 },
  { x: 3, y: 4, tone: "dark", reveal: 0.75 },
  { x: 3, y: 5, tone: "main", reveal: 0.78 },
  { x: 2, y: 6, tone: "dark", reveal: 0.81 },
  { x: 4, y: 6, tone: "main", reveal: 0.83 },

  { x: 9, y: 2, tone: "dark", reveal: 0.79 },
  { x: 9, y: 3, tone: "main", reveal: 0.82 },
  { x: 10, y: 4, tone: "dark", reveal: 0.85 },
  { x: 10, y: 5, tone: "main", reveal: 0.88 },

  { x: 14, y: 0, tone: "dark", reveal: 0.84 },
  { x: 15, y: 0, tone: "main", reveal: 0.86 },
  { x: 16, y: 0, tone: "dark", reveal: 0.88 },
  { x: 17, y: 0, tone: "main", reveal: 0.90 },
  { x: 18, y: 0, tone: "deep", reveal: 0.92 },
];

function getGrowthProgress(
  growth: number,
  reveal: number,
  duration: number
) {
  return Math.max(
    0,
    Math.min(
      1,
      (growth - reveal) / duration
    )
  );
}

function NatureMoss({
  growth,
}: {
  growth: number;
}) {
  return (
    <span
      className="nature-moss"
      aria-hidden="true"
    >
      {mossPixels.map(
        (
          {
            x,
            y,
            stage,
            tone,
          },
          index
        ) => {
          const distance =
            x + y * 1.25;

          const variation =
            (
              (
                x * 17 +
                y * 29
              ) % 7
            ) * 0.004;

          const threshold =
            Math.min(
              0.94,
              distance / 28 +
                variation
            );

          const pixelProgress =
            getGrowthProgress(
              growth,
              threshold,
              0.055
            );

          return (
            <span
              key={index}
              className={`moss-pixel moss-stage-${stage} moss-${tone}`}
              style={
                {
                  "--moss-x": x,
                  "--moss-y": y,
                  "--moss-opacity": pixelProgress,
                  "--moss-rise": `${
                    (1 - pixelProgress) * -3
                  }px`,
                  "--moss-scale":
                    0.78 +
                    pixelProgress * 0.22,
                } as CSSProperties
              }
            />
          );
        }
      )}
    </span>
  );
}

function GrowthLayer({
  className,
  pixelClassName,
  pixels,
  growth,
  xVariable,
  yVariable,
  opacityVariable,
  scaleVariable,
}: {
  className: string;
  pixelClassName: string;
  pixels: GrowthPixel[];
  growth: number;
  xVariable: string;
  yVariable: string;
  opacityVariable: string;
  scaleVariable: string;
}) {
  return (
    <span
      className={className}
      aria-hidden="true"
    >
      {pixels.map(
        (
          {
            x,
            y,
            tone,
            reveal,
          },
          index
        ) => {
          const pixelProgress =
            getGrowthProgress(
              growth,
              reveal,
              0.055
            );

          return (
            <span
              key={index}
              className={`${pixelClassName} ${pixelClassName}-${tone}`}
              style={
                {
                  [xVariable]: x,
                  [yVariable]: y,
                  [opacityVariable]: pixelProgress,
                  [scaleVariable]:
                    0.8 +
                    pixelProgress * 0.2,
                } as CSSProperties
              }
            />
          );
        }
      )}
    </span>
  );
}

function NatureEffects({
  time,
  hasLostOnTime,
}: NatureEffectsProps) {
  const growth =
    hasLostOnTime
      ? 1
      : Math.max(
          0,
          Math.min(
            1,
            (30 - time) / 27
          )
        );

  return (
    <>
      <NatureMoss
        growth={growth}
      />

      <GrowthLayer
        className="nature-greenery"
        pixelClassName="greenery-pixel"
        pixels={greeneryPixels}
        growth={growth}
        xVariable="--greenery-x"
        yVariable="--greenery-y"
        opacityVariable="--greenery-opacity"
        scaleVariable="--greenery-scale"
      />

      <GrowthLayer
        className="nature-reclaim"
        pixelClassName="reclaim-pixel"
        pixels={reclaimPixels}
        growth={growth}
        xVariable="--reclaim-x"
        yVariable="--reclaim-y"
        opacityVariable="--reclaim-opacity"
        scaleVariable="--reclaim-scale"
      />

      <GrowthLayer
        className="nature-bottom-growth"
        pixelClassName="bottom-growth-pixel"
        pixels={bottomGrowthPixels}
        growth={growth}
        xVariable="--bottom-x"
        yVariable="--bottom-y"
        opacityVariable="--bottom-opacity"
        scaleVariable="--bottom-scale"
      />

      <span
        className="nature-lcd-damage"
        aria-hidden="true"
      />
      
      <span
        className="nature-lcd-lines"
        aria-hidden="true"
        />

      <span
        className="nature-lcd-burn"
        aria-hidden="true"
      />
    </>
  );
}

export default NatureEffects;