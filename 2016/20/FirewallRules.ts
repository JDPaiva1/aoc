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

function getAllowedIPs(blackList: number[][], range: number) {
  const sortedBlackList = blackList.toSorted((a, b) => a[0] - b[0]);

  let allowed = 0;
  let currentEnd = -1;

  for (const [start, end] of sortedBlackList) {
    if (start > currentEnd + 1) {
      allowed += start - (currentEnd + 1);
    }
    currentEnd = Math.max(currentEnd, end);
    if (currentEnd >= range) {
      currentEnd = range;
      break;
    }
  }

  if (currentEnd < range) {
    allowed += range - currentEnd;
  }

  return allowed;
}

console.log("Part 1:", getLowestAllowedIP(blackList));
console.log("Part 2:", getAllowedIPs(blackList, 4294967295));
