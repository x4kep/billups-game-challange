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
      <thead>
        <tr>
          <th>Time</th>
          {/* <th>User</th> */}
          <th>You</th>
          <th>CPU</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, idx) => (
          <tr key={idx}>
            <td>{row ? new Date(row.ts).toLocaleTimeString() : ""}</td>
            {/* <td>{row?.user ?? ""}</td> */}
            <td>{row ? getGameChoiceName(row.player) : ""}</td>
            <td>{row ? getGameChoiceName(row.computer) : ""}</td>
            <td className={row?.results ?? ""}>{row?.results ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
