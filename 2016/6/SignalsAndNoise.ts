import { readFileSync } from "fs";

const repeatingMessageSignal = readFileSync("input.txt", "utf8")
  .trim()
  .split("\n");

function getCorrectMessage(signal: string[]) {
  let message = "";

  for (let i = 0; i < signal[0].length; i++) {
    const charCount = new Map<string, number>();

    for (let j = 0; j < signal.length; j++) {
      const char = signal[j][i];
      if (char === undefined) continue;
      if (charCount.has(char)) {
        charCount.set(char, charCount.get(char)! + 1);
      } else {
        charCount.set(char, 1);
      }
    }

    const mostCommonChar = Array.from(charCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([char]) => char)[0]!;

    message += mostCommonChar;
  }

  return message;
}

console.log("Part 1: ", getCorrectMessage(repeatingMessageSignal));
