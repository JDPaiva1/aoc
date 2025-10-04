import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8").trim();

function getDiscs(input: string) {
  return input.split("\n").map((line) => {
    const parts = line.split(" ");
    return {
      numPositions: Number(parts[3]),
      currentPosition: Number(parts[11].replace(".", "")),
    };
  });
}

function findFirstValidTime() {
  const discs = getDiscs(input);
  let time = 0;
  const canGetThrough = (time: number) => {
    return discs.every(
      (disc, index) =>
        (disc.currentPosition + time + index + 1) % disc.numPositions === 0
    );
  };
  while (!canGetThrough(time)) {
    time++;
  }
  return time;
}

console.log("Part 1:", findFirstValidTime());
