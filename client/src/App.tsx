import { useEffect, useState } from "react";
import "./styles/spacing.css";
import "./styles/globals.css";
import "./styles/variables.css";
import "./App.css";
import type { Choice, Score, PlayerScore } from "./services/types/types";
import {
  ensureGuest,
  getChoices,
  getRecentScores,
  getPlayerScores,
  playRound,
  resetScores,
  currentPlayerName,
} from "./services/api/api";
import ScoreTable from "./components/ScoreTable/ScoreTable";
import ChoiceGrid from "./components/Choices/ChoiceGrid";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import PlayerScoresTable from "./components/PlayerScoresTable/PlayerScoresTable";
import CurrentUser from "./components/CurrentUser/CurrentUser";

function App() {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([]);
  const [playerName, setPlayerName] = useState<string>("");
  // const [renameInput, setRenameInput] = useState<string>("");

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

  console.log("[App] mounted: calling ensureGuest");
  useEffect(() => {
    (async () => {
      try {
        await ensureGuest();
        const name = currentPlayerName() || "";
        setPlayerName(name);
        // setRenameInput(name);
        const [c, s, ps] = await Promise.all([
          getChoices(),
          getRecentScores(),
          getPlayerScores(),
        ]);
        setChoices(c);
        setScores(s);
        setPlayerScores(ps);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message || "init failed");
        } else {
          setError("init failed");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onPlay(choiceId: number) {
    setError(null);
    setBusy(true);
    try {
      const r = await playRound(choiceId);
      setLastPlayerChoice(r.player);
      setLastComputerChoice(r.computer);

      setLastResult(
        `${r.results.toUpperCase()} (you: ${nameOf(r.player)}, cpu: ${nameOf(
          r.computer
        )})`
      );

      const [s, ps] = await Promise.all([getRecentScores(), getPlayerScores()]);
      setScores(s);
      setPlayerScores(ps);
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

  const handleReset = async () => {
    await resetScores();
    const [scores, ps] = await Promise.all([
      getRecentScores(),
      getPlayerScores(),
    ]);
    setLastResult("");
    setLastPlayerChoice(null);
    setLastComputerChoice(null);
    setScores(scores);
    setPlayerScores(ps);
  };

  return (
    <>
      <div className="container mt-0">
        <h1 className="app-header">Rock, Paper, Scissors, Lizard, Spock</h1>

        {/* PLAYER INFO */}
        <CurrentUser playerName={playerName} />

        {/* SCORE AREA */}
        <ScoreBoard
          lastResult={lastResult}
          lastPlayerChoice={lastPlayerChoice}
          lastComputerChoice={lastComputerChoice}
          className="mt-6 p-4"
        />

        {loading && <LoadingSpinner />}
        {error && (
          <ErrorMessage
            message="Something went wrong"
            className="mt-4 mx-auto"
          />
        )}

        {/* CHOICES */}
        <ChoiceGrid
          choices={choices}
          loading={loading}
          busy={busy}
          onPlay={onPlay}
          className="mt-6 mb-4 mx-auto"
        />

        {/* RECENT SCORES */}
        <h2 className="mt-6">Recent games</h2>
        <ScoreTable scores={scores} className="mb-4" />

        {/* PLAYER SCORES */}
        <PlayerScoresTable playerScores={playerScores} className="mb-4" />

        {/* RESET SCORE */}
        <button onClick={handleReset}>Reset</button>
      </div>
    </>
  );
}

export default App;
