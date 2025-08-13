export const GameChoice = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
  Lizard: 4,
  Spock: 5,
} as const;

export type GameChoice = (typeof GameChoice)[keyof typeof GameChoice];

export const getGameChoiceName = (value: number) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const entry = Object.entries(GameChoice).find(([_, v]) => v === value);
  return entry ? entry[0] : "";
};
