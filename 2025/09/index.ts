import { readFileSync } from "fs";

const input = readFileSync("./2025/09/input.txt", "utf8")
  .trim()
  .split("\n")
  .map((line) => line.split(",").map(Number));

function partOne(input: number[][]) {
  let maxArea = 0;
  let bestPair: [{ x: number; y: number }, { x: number; y: number }] | null = null;

  for (let i = 0; i < input.length; i++) {
    const [x1, y1] = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const [x2, y2] = input[j];

      const width = Math.abs(x1 - x2) + 1;
      const height = Math.abs(y1 - y2) + 1;

      const area = width * height;

      if (area > maxArea) {
        maxArea = area;
        bestPair = [
          { x: x1, y: y1 },
          { x: x2, y: y2 },
        ];
      }
    }
  }

  return maxArea;
}

console.log("Part 1:", partOne(input));
