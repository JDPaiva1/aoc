import { readFileSync } from "fs";

const input = readFileSync("./2025/05/input.txt", "utf8").trim().split("\n");

function parseRanges(input: string[]): [[number, number][], number[]] {
  const ranges: [number, number][] = [];
  const availableIds: number[] = [];
  input.forEach((line) => {
    if (line.trim().length === 0) return;
    if (line.includes("-")) {
      const [start, end] = line.split("-").map(Number);
      ranges.push([start, end]);
    }
    availableIds.push(Number(line));
  });
  return [ranges, availableIds];
}

function partOne(input: string[]): number {
  const [ranges, availableIds] = parseRanges(input);
  let totalFresh = 0;

  for (const id of availableIds) {
    if (!ranges.some(([start, end]) => start <= id && id <= end)) {
      continue;
    }
    totalFresh++;
  }

  return totalFresh;
}

console.log("Part 1", partOne(input));
