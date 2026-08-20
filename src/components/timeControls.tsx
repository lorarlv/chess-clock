type TimeControl = {
  label: string;
  minutes: number;
  increment: number;
};

type TimeControlsProps = {
  controls: TimeControl[];
  isCustom: boolean;
  customMinutes: number;
  customIncrement: number;

  onSelectControl: (control: TimeControl) => void;
  onCustomMinutesChange: (value: number) => void;
  onCustomIncrementChange: (value: number) => void;
  onApplyCustom: () => void;
};

function TimeControls({
  controls,
  isCustom,
  customMinutes,
  customIncrement,
  onSelectControl,
  onCustomMinutesChange,
  onCustomIncrementChange,
  onApplyCustom,
}: TimeControlsProps) {
  return (
    <div className="setup-panel">
      <h2>Time control</h2>

      <div className="time-control-grid">
        {controls.map((control) => (
          <button
            key={control.label}
            className="retro-button"
            onClick={() => onSelectControl(control)}
          >
            {control.label}
          </button>
        ))}
      </div>

      {isCustom && (
        <div className="custom-controls">
          <label>
            Minutes
            <input
              type="number"
              min={1}
              value={customMinutes}
              onChange={(event) =>
                onCustomMinutesChange(Number(event.target.value))
              }
            />
          </label>

          <label>
            Increment
            <input
              type="number"
              min={0}
              value={customIncrement}
              onChange={(event) =>
                onCustomIncrementChange(Number(event.target.value))
              }
            />
          </label>

          <button
            className="retro-button"
            onClick={onApplyCustom}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

export type { TimeControl };

export default TimeControls;