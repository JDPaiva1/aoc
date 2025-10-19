import { readFileSync } from "fs";

const input = readFileSync("./2017/02/input.txt", "utf-8").trim();

function getChecksum(input: string) {
  const rows = input.split("\n").map((row) => row.split(/\s+/).map(Number));
  return rows.reduce(
    (sum, row) => sum + Math.max(...row) - Math.min(...row),
    0
  );
}

function getChecksumPart2(input: string) {
  const rows = input.split("\n").map((row) => row.split(/\s+/).map(Number));
  const getEvenlyDivisible = (row: number[]) => {
    for (const [index, num] of row.entries()) {
      for (const [otherIndex, otherNum] of row.entries()) {
        if (index === otherIndex || num % otherNum !== 0) continue;
        return num / otherNum;
      }
    }
    return 0;
  };

  let sum = 0;
  for (const row of rows) {
    sum += getEvenlyDivisible(row);
  }
  return sum;
}

console.log("Part 1:", getChecksum(input));
console.log("Part 2:", getChecksumPart2(input));
