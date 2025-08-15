import React, { memo } from "react";
import "./PlayerScoresTable.css";
import type { PlayerScore } from "../../services/types/types";

type Props = {
  playerScores: PlayerScore[];
  className?: string;
};

const PlayerScoresTable = memo(function PlayerScoresTable({
  playerScores,
  className = "",
}: Props) {
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
          {playerScores.map((p, idx) => {
            const totalWinLoseCount = p.wins + p.loses;
            const winPercentage = totalWinLoseCount
              ? Math.round((p.wins / totalWinLoseCount) * 100 * 10) / 10
              : 0;
            return (
              <tr key={idx} className="player-scores-table__row">
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
