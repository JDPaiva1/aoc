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

function partTwo(tachyonManifold: string[][]): number {
  const rows = tachyonManifold.length;
  const cols = tachyonManifold[0]?.length ?? 0;
  const startCol = tachyonManifold[0].findIndex((cell) => cell === "S");

  let current = new Array<number>(cols).fill(0);
  current[startCol] = 1;

  for (let row = 0; row < rows - 1; row++) {
    const next = new Array<number>(cols).fill(0);
    for (let col = 0; col < cols; col++) {
      const timelineCount = current[col];
      if (timelineCount === 0) continue;

      const cellBelow = tachyonManifold[row + 1][col];
      if (cellBelow === "^") {
        if (col > 0) next[col - 1] += timelineCount;
        if (col + 1 < cols) next[col + 1] += timelineCount;
      } else {
        next[col] += timelineCount;
      }
    }
    current = next;
  }

  return current.reduce((total, count) => total + count, 0);
}

// console.table(tachyonManifold);
console.log("Part 1:", partOne(tachyonManifold));
console.log("Part 2:", partTwo(tachyonManifold));
