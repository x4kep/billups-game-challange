import { memo } from "react";
import "./ChoiceGrid.css";

export type Choice = {
  id: number;
  name: "rock" | "paper" | "scissors" | "lizard" | "spock";
};

type Props = {
  choices: Choice[];
  loading?: boolean;
  busy?: boolean;
  onPlay: (choiceId: number) => void;
  className?: string; // extra layout classes from parent
};

const ChoiceGrid = memo(function ChoiceGrid({
  choices,
  loading = false,
  busy = false,
  onPlay,
  className = "",
}: Props) {
  const isDisabled = loading || busy || choices.length === 0;

  return (
    <div
      className={`choice-grid ${isDisabled ? "choice-grid--disabled" : ""} ${className}`}
      aria-busy={busy}
      aria-live="polite"
    >
      {choices.map((c) => {
        const icon = `/${c.name}_icon.png`;
        return (
          <button
            key={c.id}
            className="choice-grid__btn"
            onClick={() => onPlay(c.id)}
            disabled={isDisabled}
            aria-label={c.name}
          >
            {busy ? (
              <img src="/loading_icon.png" alt="Loading…" className="choice-grid__spinner" />
            ) : (
              <img src={icon} title={c.name} alt={c.name} className="choice-grid__icon" />
            )}
          </button>
        );
      })}
    </div>
  );
});

export default ChoiceGrid;
