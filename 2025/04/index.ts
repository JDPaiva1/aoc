import { readFileSync } from "fs";

const diagram = readFileSync("./2025/04/input.txt", "utf8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split(""));

function partOne(diagram: string[][]) {
  let count = 0;
  const adjacentPositions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [1, 1],
    [1, -1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
  ];

  for (let row = 0; row < diagram.length; row++) {
    for (let col = 0; col < diagram[row].length; col++) {
      if (diagram[row][col] === ".") {
        continue;
      }

      let adjacentRollsPaper = 0;

      for (const [dx, dy] of adjacentPositions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow < 0 || newCol < 0 || newRow >= diagram.length || newCol >= diagram[row].length) {
          continue;
        }
        if (diagram[newRow][newCol] === ".") {
          continue;
        }
        adjacentRollsPaper++;
      }

      if (adjacentRollsPaper >= 4) {
        continue;
      }

      // diagram[row][col] = "x";
      count++;
    }
  }
  return count;
}

// console.table(diagram);
console.log("Part 1:", partOne(diagram));
// console.table(diagram);
