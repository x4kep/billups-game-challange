import type { Choice, PlayResult, Score, PlayerScore } from "../types/types";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5209/api";

const TOKEN_KEY = "rpsls_token"; // sessionStorage key

function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export async function ensureGuest(): Promise<{ token: string; name: string }> {
  try {
    let token = getToken();

    if (token) {
      // we don't have an endpoint to validate quickly; assume valid
      return { token, name: sessionStorage.getItem("rpsls_name") || "" };
    }

    const res = await fetch(`${BASE_URL}/players/guest`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to create guest");

    const data: { token: string; name: string } = await res.json();
    token = data.token;

    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem("rpsls_name", data.name);

    return data;
  } catch (err) {
    console.error("Error in ensureGuest:", err);
    throw err instanceof Error ? err : new Error("Failed to ensure guest");
  }
}

function authHeaders(extra: Record<string, string> = {}): HeadersInit {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { "X-Player-Token": token } : {}),
  };
}

export async function getChoices(): Promise<Choice[]> {
  const res = await fetch(`${BASE_URL}/choices`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch choices");
  return res.json();
}

export async function playRound(player: number): Promise<PlayResult> {
  const res = await fetch(`${BASE_URL}/game/play`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      player,
      user: sessionStorage.getItem("rpsls_name"),
    }),
  });
  if (!res.ok) throw new Error("Failed to play");
  return res.json();
}

export async function getRecentScores(): Promise<Score[]> {
  const res = await fetch(`${BASE_URL}/scores`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch recent scores");
  return res.json();
}

export async function getPlayerScores(): Promise<PlayerScore[]> {
  const res = await fetch(`${BASE_URL}/players/scores`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch player scores");
  return res.json();
}

export async function resetScores(): Promise<{ ok: true }> {
  const res = await fetch(`${BASE_URL}/scores/reset`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to reset scores");
  return res.json();
}

export function currentPlayerName(): string | null {
  return sessionStorage.getItem("rpsls_name");
}
