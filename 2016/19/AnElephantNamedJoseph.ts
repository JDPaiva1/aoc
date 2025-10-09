import { readFileSync } from "fs";

const numOfElves = Number(readFileSync("input.txt", "utf-8").trim());

function whoGetsAllTheGifts(numOfElves: number) {
  const elves = new Uint32Array(numOfElves + 1);
  for (let i = 1; i < numOfElves; i++) elves[i] = i + 1;
  elves[numOfElves] = 1;

  let current = 1;
  while (elves[current] !== current) {
    elves[current] = elves[elves[current]];
    current = elves[current];
  }

  return current;
}

function whoGetsAllTheGiftsPart2(numOfElves: number) {
  const next = new Uint32Array(numOfElves + 1);

  for (let i = 1; i < numOfElves; i++) {
    next[i] = i + 1;
  }
  next[numOfElves] = 1;

  let remaining = numOfElves;
  let current = 1;

  let acrossPrev = current;
  for (let i = 0; i < Math.floor(remaining / 2) - 1; i++) {
    acrossPrev = next[acrossPrev];
  }

  while (remaining > 1) {
    const removed = next[acrossPrev];
    next[acrossPrev] = next[removed];
    remaining--;

    if (remaining % 2 === 0) {
      acrossPrev = next[acrossPrev];
    }

    current = next[current];
  }

  return current;
}

console.log("Part 1:", whoGetsAllTheGifts(numOfElves));
console.log("Part 2:", whoGetsAllTheGiftsPart2(numOfElves));
