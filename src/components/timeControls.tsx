import {
  useEffect,
  useState,
} from "react";

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
  const [minutesInput, setMinutesInput] = useState(
    String(customMinutes)
  );

  const [incrementInput, setIncrementInput] = useState(
    String(customIncrement)
  );

  useEffect(() => {
    setMinutesInput(
      String(customMinutes)
    );
  }, [customMinutes]);

  useEffect(() => {
    setIncrementInput(
      String(customIncrement)
    );
  }, [customIncrement]);

  function handleMinutesChange(
    value: string
  ) {
    if (!/^\d*$/.test(value)) {
      return;
    }

    setMinutesInput(value);

    if (value !== "") {
      onCustomMinutesChange(
        Number(value)
      );
    }
  }

  function handleIncrementChange(
    value: string
  ) {
    if (!/^\d*$/.test(value)) {
      return;
    }

    setIncrementInput(value);

    if (value !== "") {
      onCustomIncrementChange(
        Number(value)
      );
    }
  }

  function applyCustom() {
    if (
      minutesInput === "" ||
      incrementInput === ""
    ) {
      return;
    }

    onApplyCustom();
  }

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

        {isCustom && (
          <div className="custom-controls">
            <label>
              Minutes
              <input
                type="text"
                inputMode="numeric"
                value={minutesInput}
                onChange={(event) =>
                  handleMinutesChange(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    applyCustom();
                  }
                }}
              />
            </label>

            <label>
              Increment
              <input
                type="text"
                inputMode="numeric"
                value={incrementInput}
                onChange={(event) =>
                  handleIncrementChange(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    applyCustom();
                  }
                }}
              />
            </label>

            <button
              className="retro-button"
              onClick={applyCustom}
              disabled={
                minutesInput === "" ||
                incrementInput === ""
              }
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export type { TimeControl };

export default TimeControls;