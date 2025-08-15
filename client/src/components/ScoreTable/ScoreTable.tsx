import { useState, useEffect } from "react";
import "./ScoreTable.css";
import type { Score } from "../../services/types/types";
import { getGameChoiceName } from "../../enums/GameChoice";

interface ScoreTableProps {
  scores: Score[];
  className?: string;
}

export default function ScoreTable({
  scores,
  className = "",
}: ScoreTableProps) {
  const maxRows = 10;

  const [tableData, setTableData] = useState<(Score | null)[]>(
    Array.from({ length: maxRows }, () => null)
  );

  useEffect(() => {
    const newTable: (Score | null)[] = Array.from(
      { length: maxRows },
      (_, i) => scores[i] || null
    );
    setTableData(newTable);
  }, [scores]);

  return (
    <table className={`score-table ${className}`}>
      <thead className="score-table__head">
        <tr className="score-table__row">
          <th className="score-table__header">Time</th>
          <th className="score-table__header">User</th>
          <th className="score-table__header">Human</th>
          <th className="score-table__header">CPU</th>
          <th className="score-table__header">Result</th>
        </tr>
      </thead>
      <tbody className="score-table__body">
        {tableData.map((row, idx) => {
          const result = (row?.results || "").toLowerCase(); // win|lose|tie|""
          const resultMod =
            result === "win" || result === "lose" || result === "tie"
              ? ` score-table__cell--${result}`
              : "";
          return (
            <tr key={idx} className="score-table__row">
              <td className="score-table__cell">
                {row ? new Date(row.ts).toLocaleTimeString() : ""}
              </td>
              <td className="score-table__cell">{row?.user ?? ""}</td>
              <td className="score-table__cell">
                {row ? getGameChoiceName(row.player) : ""}
              </td>
              <td className="score-table__cell">
                {row ? getGameChoiceName(row.computer) : ""}
              </td>
              <td className={`score-table__cell${resultMod}`}>
                {row?.results ?? ""}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
