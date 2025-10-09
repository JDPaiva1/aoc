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

console.log("Part 1:", whoGetsAllTheGifts(numOfElves));
