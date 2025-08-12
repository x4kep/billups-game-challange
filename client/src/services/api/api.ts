import type { Choice, PlayResult, Score } from "../types/types";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5209/api";

export async function getChoices(): Promise<Choice[]> {
  const res = await fetch(`${BASE_URL}/choices`);
  if (!res.ok) throw new Error("Failed to fetch choices");
  return res.json();
}

export async function playRound(
  player: number,
  user?: string
): Promise<PlayResult> {
  const res = await fetch(`${BASE_URL}/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, user }),
  });
  if (!res.ok) throw new Error("Failed to play");
  return res.json();
}

export async function getScores(): Promise<Score[]> {
  const res = await fetch(`${BASE_URL}/scores`);
  if (!res.ok) throw new Error("Failed to fetch scores");
  return res.json();
}

export async function resetScores(): Promise<{ ok: true }> {
  const res = await fetch(`${BASE_URL}/scores/reset`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to reset scores')
  return res.json()
}