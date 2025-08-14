// src/components/ScoreSBOard.tsx
import { memo, useMemo } from "react";
import "./ScoreBoard.css";

export type ChoiceName = "rock" | "paper" | "scissors" | "lizard" | "spock";
export type ChoiceId = 1 | 2 | 3 | 4 | 5;

type Props = {
  lastResult: string | "";
  lastPlayerChoice: number | null;
  lastComputerChoice: number | null;
  className?: string;
  nameOf?: (id: ChoiceId) => ChoiceName;
  iconSrc?: (name: ChoiceName) => string; // optional override
  vsLabel?: string;
};

const defaultNameOf = (id: ChoiceId): ChoiceName =>
  (({ 1: "rock", 2: "paper", 3: "scissors", 4: "lizard", 5: "spock" } as const)[
    id
  ]);

const ScoreBoard = memo(function ScoreBoard({
  lastResult,
  lastPlayerChoice,
  lastComputerChoice,
  className = "",
  nameOf = defaultNameOf,
  iconSrc,
}: Props) {
  const buildIconSrc = iconSrc ?? ((n: ChoiceName) => `/${n}_icon.png`);

  const outcome = useMemo<"win" | "lose" | "tie" | null>(() => {
    if (!lastResult) return null;
    if (lastResult.startsWith("WIN")) return "win";
    if (lastResult.startsWith("LOSE")) return "lose";
    return "tie";
  }, [lastResult]);

  const humanIcon =
    outcome === "win" ? `/human_win_icon.png` : `/human_icon.png`;
  const robotIcon =
    outcome === "lose" ? `/robot_win_icon.png` : `/robot_icon.png`;
  const qIcon = `/question_icon.png`;

  return (
    <div className={`score ${className}`}>
      {/* Left column (Human) */}
      <div className="score-column">
        <div className="score-player">
          <img src={humanIcon} alt="Human" title="Human" />
        </div>
        <div className="score-img">
          {lastPlayerChoice ? (
            <img
              src={buildIconSrc(nameOf(lastPlayerChoice as ChoiceId))}
              alt={nameOf(lastPlayerChoice as ChoiceId)}
              title={nameOf(lastPlayerChoice as ChoiceId)}
            />
          ) : (
            <img src={qIcon} alt="?" title="No choice yet" />
          )}
        </div>
      </div>

      <div className="score-vs-wrapper">
        <div className="score-vs">VS</div>
        {outcome && (
          <div className={`score-outcome ${outcome}`} data-testid="result-text">
            {outcome.toUpperCase()}
          </div>
        )}
      </div>

      {/* Right column (Robot) */}
      <div className="score-column">
        <div className="score-player">
          <img src={robotIcon} alt="Robot" title="Robot" />
        </div>
        <div className="score-img">
          {lastComputerChoice ? (
            <img
              src={buildIconSrc(nameOf(lastComputerChoice as ChoiceId))}
              alt={nameOf(lastComputerChoice as ChoiceId)}
              title={nameOf(lastComputerChoice as ChoiceId)}
            />
          ) : (
            <img src={qIcon} alt="?" title="No choice yet" />
          )}
        </div>
      </div>
    </div>
  );
});

export default ScoreBoard;
