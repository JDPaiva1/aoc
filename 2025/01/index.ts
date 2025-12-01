import { readFileSync } from "fs";

const rotations = readFileSync("./2025/01/input.txt", "utf8").trim().split("\n");

function partOne(rotations: string[]): number {
  const [min, max] = [0, 100];
  let count = 0;
  let position = 50;
  for (let i = 0; i < rotations.length; i++) {
    if (rotations[i].trim() === "") break;
    const direction = rotations[i].slice(0, 1);
    const num = Number(rotations[i].slice(1));
    if (direction === "L") {
      position = (position - num + max) % max;
    } else {
      position = (position + num) % max;
    }
    if (position === min) {
      count++;
    }
  }
  return count;
}

console.log("Part 1:", partOne(rotations));
