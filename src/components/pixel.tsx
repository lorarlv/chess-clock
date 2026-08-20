type PixelIconProps = {
  type: "white-king" | "black-king" | "app";
};

const icons = {
  "white-king": [
    "00010000",
    "00111000",
    "00010000",
    "01111100",
    "00111000",
    "00111000",
    "01111100",
    "11111110",
  ],
  "black-king": [
    "00010000",
    "00111000",
    "00010000",
    "01111100",
    "00111000",
    "00111000",
    "01111100",
    "11111110",
  ],
  app: [
    "001111100",
    "010000010",
    "100010001",
    "100010001",
    "100011101",
    "100000001",
    "010000010",
    "001111100",
  ]
};

function PixelIcon({ type }: PixelIconProps) {
  const pixels = icons[type];

  return (
    <span
      className={`pixel-icon ${type}`}
      aria-hidden="true"
    >
      {pixels.flatMap((row, rowIndex) =>
        [...row].map((pixel, columnIndex) => (
          <span
            key={`${rowIndex}-${columnIndex}`}
            className={
              pixel === "1"
                ? "pixel filled"
                : "pixel"
            }
          />
        ))
      )}
    </span>
  );
}

export default PixelIcon;