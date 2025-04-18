export const generateRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const selectRandom = <T>(items: T[]): T =>
  items[generateRandomNumber(0, items.length - 1)];

export const probability = (percentage: number): boolean =>
  Math.random() < percentage / 100;

export const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};
