import { readFileSync } from "fs";

const idRanges = readFileSync("2025/02/input.txt", "utf8")
  .split(",")
  .map((range) => range.split("-").map(Number));

function partOne(idRanges: number[][]): number {
  let invalidIdsFound = 0;
  for (const [min, max] of idRanges) {
    for (let i = min; i <= max; i++) {
      const str = i.toString();
      if (str.length % 2 !== 0) continue;
      const half = str.length / 2;
      const firstHalf = str.slice(0, half);
      const secondHalf = str.slice(half);
      if (Number(firstHalf) === Number(secondHalf)) {
        invalidIdsFound += i;
      }
    }
  }
  return invalidIdsFound;
}

console.log("Part 1:", partOne(idRanges));
