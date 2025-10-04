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

function findFirstValidTime(part2: boolean = false) {
  const discs = getDiscs(input);
  if (part2) {
    discs.push({
      numPositions: 11,
      currentPosition: 0,
    });
  }
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
console.log("Part 2:", findFirstValidTime(true));
