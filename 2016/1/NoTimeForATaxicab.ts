import { readFileSync } from "fs";

const sequence = readFileSync("input.txt", "utf8").trim();

function parseSequence(sequence: string) {
  return sequence
    .split(", ")
    .map((direction) => [direction[0], Number(direction.slice(1))]);
}

function calculateDistance(sequence: string) {
  const parsedSequence = parseSequence(sequence);
  const position = [0, 0];
  let direction = [0, 1];

  for (const [turn, steps] of parsedSequence) {
    let dx, dy;
    if (turn === "R") {
      dx = direction[1];
      dy = 0 - direction[0];
    } else {
      dx = 0 - direction[1];
      dy = direction[0];
    }
    direction = [dx, dy];

    position[0] += direction[0] * Number(steps);
    position[1] += direction[1] * Number(steps);
  }

  return position.reduce((acc, curr) => acc + Math.abs(curr), 0);
}

console.log(calculateDistance(sequence));
