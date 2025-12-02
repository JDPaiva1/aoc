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

function partTwo(idRanges: number[][]): number {
  let invalidIdsFound = 0;
  for (const [min, max] of idRanges) {
    for (let i = min; i <= max; i++) {
      const str = i.toString();
      for (let size = 1; size <= str.length / 2; size++) {
        const pattern = str.slice(0, size);
        const repetitions = str.length / size;
        if (!Number.isInteger(repetitions)) continue;
        const built = pattern.repeat(repetitions);
        if (built === str) {
          invalidIdsFound += i;
          break;
        }
      }
    }
  }
  return invalidIdsFound;
}

console.log("Part 1:", partOne(idRanges));
console.log("Part 2:", partTwo(idRanges));
