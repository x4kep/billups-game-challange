import { memo, useMemo } from "react";
import "./PlayerScoresTable.css";
import type { PlayerScore } from "../../services/types/types";

type Props = {
  playerScores: PlayerScore[];
  className?: string;
  maxRows?: number;
};

const PlayerScoresTable = memo(function PlayerScoresTable({
  playerScores,
  className = "",
  maxRows = 5,
}: Props) {
  const rows = useMemo(
    () => playerScores.slice(0, maxRows),
    [playerScores, maxRows]
  );

  const paddedRows = useMemo(() => {
    const missing = Math.max(0, maxRows - rows.length);
    return [...rows, ...Array(missing).fill(null)];
  }, [rows, maxRows]);

  return (
    <div className={`player-scores-table ${className}`}>
      <h2 className="player-scores-table__title">Players recent games</h2>
      <table className="player-scores-table__table">
        <thead className="player-scores-table__head">
          <tr>
            <th className="player-scores-table__header">Name</th>
            <th className="player-scores-table__header">Wins</th>
            <th className="player-scores-table__header">Loses</th>
            <th className="player-scores-table__header">Ties</th>
            <th className="player-scores-table__header">Total</th>
            <th className="player-scores-table__header">Winrate</th>
          </tr>
        </thead>
        <tbody className="player-scores-table__body">
          {paddedRows.map((p, idx) => {
            if (!p) {
              return (
                <tr
                  key={`empty-${idx}`}
                  className="player-scores-table__row player-scores-table__row--empty"
                >
                  <td className="player-scores-table__cell" colSpan={6}>
                    &nbsp;
                  </td>
                </tr>
              );
            }

            const totalWinLoseCount = p.wins + p.loses;
            const winPercentage = totalWinLoseCount
              ? Math.round((p.wins / totalWinLoseCount) * 100 * 10) / 10
              : 0;

            return (
              <tr key={`${p.name}-${idx}`} className="player-scores-table__row">
                <td className="player-scores-table__cell">{p.name}</td>
                <td className="player-scores-table__cell player-scores-table__cell--win">
                  {p.wins}
                </td>
                <td className="player-scores-table__cell player-scores-table__cell--lose">
                  {p.loses}
                </td>
                <td className="player-scores-table__cell player-scores-table__cell--tie">
                  {p.ties}
                </td>
                <td className="player-scores-table__cell">{p.total}</td>
                <td className="player-scores-table__cell">{winPercentage}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

export default PlayerScoresTable;
