import { readFileSync } from "fs";

const batteryBanks = readFileSync("2025/03/input.txt", "utf8")
  .trim()
  .split("\n")
  .map((bank) => bank.trim().split(""));

function partOne(banks: string[][]): number {
  let total = 0;
  for (const bank of banks) {
    let maxPair = -1;
    for (let i = 0; i < bank.length - 1; i++) {
      for (let j = i + 1; j < bank.length; j++) {
        const pair = bank[i] + bank[j];
        const pairNum = Number(pair);
        if (maxPair > pairNum) continue;
        maxPair = pairNum;
      }
    }
    total += maxPair;
  }
  return total;
}

function partTwo(banks: string[][]): number {
  let total = 0;

  for (const bank of banks) {
    const digits = bank.map(Number);
    const keep = 12;
    const stack: number[] = [];
    let canRemove = digits.length - keep;

    for (const d of digits) {
      while (stack.length && canRemove > 0 && stack[stack.length - 1] < d) {
        stack.pop();
        canRemove--;
      }
      stack.push(d);
    }

    const selected = stack.slice(0, keep);

    const numberVal = Number(selected.join(""));
    total += numberVal;
  }

  return total;
}

console.log("Part 1:", partOne(batteryBanks));
console.log("Part 2:", partTwo(batteryBanks));
