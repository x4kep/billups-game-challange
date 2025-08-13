import { useEffect, useState } from "react";
import "./App.css";
import type { Choice, Score } from "./services/types/types";
import {
  getChoices,
  getScores,
  playRound,
  resetScores,
} from "./services/api/api";
import ScoreTable from "./components/ScoreTable/ScoreTable";
import ChoiceGrid from "./components/Choices/ChoiceGrid";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";

function App() {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [scores, setScores] = useState<Score[]>([]);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const [user, setUser] = useState("");
  const [lastResult, setLastResult] = useState<string>("");

  // NEW: keep the last round picks
  const [lastPlayerChoice, setLastPlayerChoice] = useState<number | null>(null);
  const [lastComputerChoice, setLastComputerChoice] = useState<number | null>(
    null
  );

  // helpers
  const nameOf = (id: number) =>
    choices.find((c) => c.id === id)?.name ?? `#${id}`;

  useEffect(() => {
    Promise.all([getChoices(), getScores()])
      .then(([c, s]) => {
        setChoices(c);
        setScores(s);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function onPlay(choiceId: number) {
    setError(null);
    setBusy(true);
    try {
      const r = await playRound(choiceId, undefined);
      setLastPlayerChoice(r.player);
      setLastComputerChoice(r.computer);

      setLastResult(
        `${r.results.toUpperCase()} (you: ${nameOf(r.player)}, cpu: ${nameOf(
          r.computer
        )})`
      );

      const s = await getScores();
      setScores(s);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to play");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="container">
        <h1>Rock, Paper, Scissors, Lizard, Spock</h1>

        {/* SCORE AREA */}
        <ScoreBoard
          lastResult={lastResult}
          lastPlayerChoice={lastPlayerChoice}
          lastComputerChoice={lastComputerChoice}
          className="mt-6"
        />

        {loading && <p>Loading…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* CHOICES */}
        <ChoiceGrid
          choices={choices}
          loading={loading}
          busy={busy}
          onPlay={(id) => onPlay(id)}
        />

        {/* SCORES */}
        <ScoreTable scores={scores} />

        {/* RESET SCORE */}
        <button
          onClick={async () => {
            await resetScores();
            const s = await getScores();
            setLastResult("");
            setLastPlayerChoice(null);
            setLastComputerChoice(null);
            setScores(s);
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
}

export default App;
