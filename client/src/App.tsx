import { useEffect, useState } from "react";
import "./App.css";
import type { Choice, Score } from "./services/types/types";
import {
  getChoices,
  getScores,
  playRound,
  resetScores,
} from "./services/api/api";

function App() {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [scores, setScores] = useState<Score[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState("");
  const [lastResult, setLastResult] = useState<string>("");

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
    try {
      const r = await playRound(choiceId, user || undefined);
      const nameOf = (id: number) =>
        choices.find((c) => c.id === id)?.name ?? `#${id}`;
      setLastResult(
        `${r.results.toUpperCase()} (you: ${nameOf(r.player)}, cpu: ${nameOf(
          r.computer
        )})`
      );
      const s = await getScores();
      setScores(s);
    } catch (e: any) {
      setError(e.message ?? "Failed to play");
    }
  }

  return (
    <>
      <div className="container">
        <h1>Rock, Paper, Scissors, Lizard, Spock</h1>
        {loading && <p>Loading…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* CHOICES */}
        <div
          className="card"
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {choices.map((c) => (
            <button key={c.id} onClick={() => onPlay(c.id)}>
              {c.name}
            </button>
          ))}
        </div>

        {/* LAST RESULT */}
        {lastResult && <p>Last result: {lastResult}</p>}

        {/* SCORES */}
        <ul>
          {scores.map((s, idx) => (
            <li key={s.ts + idx}>
              {new Date(s.ts).toLocaleTimeString()} —{" "}
              {s.user ? s.user + " — " : ""}
              you:{" "}
              {choices.find((c) => c.id === s.player)?.name ??
                `#${s.player}`}{" "}
              vs cpu:{" "}
              {choices.find((c) => c.id === s.computer)?.name ??
                `#${s.computer}`}{" "}
              → {s.results}
            </li>
          ))}
        </ul>

        {/* RESET SCORE */}
        <button
          onClick={async () => {
            await resetScores();
            const s = await getScores();
            setLastResult("");
            setScores(s);
          }}
        >
          Reset
        </button>

        {/* RULES */}
        
      </div>
    </>
  );
}

export default App;
