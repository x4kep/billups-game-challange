export type Choice = {
  id: 1 | 2 | 3 | 4 | 5;
  name: "rock" | "paper" | "scissors" | "lizard" | "spock";
};

export type PlayResult = {
  results: "win" | "lose" | "tie";
  player: number;
  computer: number;
};

export type Score = {
  ts: string;
  user?: string;
  player: number;
  computer: number;
  results: PlayResult["results"];
};
