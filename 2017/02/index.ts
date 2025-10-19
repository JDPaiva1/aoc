import { readFileSync } from "fs";

const input = readFileSync("./2017/02/input.txt", "utf-8").trim();

function getChecksum(input: string) {
  const rows = input.split("\n").map((row) => row.split(/\s+/).map(Number));
  return rows.reduce(
    (sum, row) => sum + Math.max(...row) - Math.min(...row),
    0
  );
}

console.log("Part 1:", getChecksum(input));
