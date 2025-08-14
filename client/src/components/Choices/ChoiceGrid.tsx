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
  /** Optional wrapper classes for spacing, alignment, etc. */
  className?: string;
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
    <div className={`card ${className}`} aria-busy={busy} aria-live="polite">
      {choices.map((c) => {
        const icon = `/${c.name}_icon.png`;

        return (
          <button
            key={c.id}
            className="choice-btn"
            onClick={() => onPlay(c.id)}
            disabled={isDisabled}
            aria-label={`Choose ${c.name}`}
          >
            {busy ? (
              <img src="/loading_icon.png" alt="Loading…" className="spin" />
            ) : (
              <img src={icon} title={c.name} alt={c.name} />
            )}
          </button>
        );
      })}
    </div>
  );
});

export default ChoiceGrid;
