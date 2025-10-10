import { readFileSync } from "fs";

const blackList = readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map((rule) => rule.split("-").map(Number));

function getLowestAllowedIP(blackList: number[][]) {
  const sortedBlackList = blackList.toSorted((a, b) => a[0] - b[0]);
  let lowestIP = 0;
  for (const [start, end] of sortedBlackList) {
    if (lowestIP >= start && lowestIP <= end) {
      lowestIP = end + 1;
    }
  }
  return lowestIP;
}

console.log("Part 1:", getLowestAllowedIP(blackList));
