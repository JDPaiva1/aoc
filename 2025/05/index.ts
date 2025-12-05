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

function partTwo(input: string[]): number {
  const [ranges] = parseRanges(input);
  ranges.sort((a, b) => a[0] - b[0]);

  const merged: [number, number][] = [];
  for (const [start, end] of ranges) {
    if (!merged.length) {
      merged.push([start, end]);
      continue;
    }
    const last = merged[merged.length - 1];
    if (start <= last[1] + 1) {
      last[1] = Math.max(last[1], end);
      continue;
    }
    merged.push([start, end]);
  }

  return merged.reduce((sum, [s, e]) => sum + (e - s + 1), 0);
}

console.log("Part 1", partOne(input));
console.log("Part 2", partTwo(input));
