import { readFileSync } from "fs";

const tachyonManifold = readFileSync("./2025/07/input.txt", "utf8")
  .trim()
  .split("\n")
  .map((row) => row.split(""));

function partOne(tachyonManifold: string[][]): number {
  const start = [0, tachyonManifold[0].findIndex((cell) => cell === "S")];
  let currentPos = start;
  let numOfSplits = 0;

  while (currentPos[0] < tachyonManifold.length - 1) {
    const nextCol = new Set<number>();
    for (let i = 1; i < currentPos.length; i++) {
      const nextCell = tachyonManifold[currentPos[0] + 1][currentPos[i]];
      if (nextCell === "^") {
        nextCol.add(currentPos[i] + 1);
        nextCol.add(currentPos[i] - 1);
        numOfSplits++;
        continue;
      }
      nextCol.add(currentPos[i]);
    }
    currentPos = [currentPos[0] + 1, ...nextCol];
  }

  return numOfSplits;
}

// console.table(tachyonManifold);
console.log("Part 1:", partOne(tachyonManifold));
