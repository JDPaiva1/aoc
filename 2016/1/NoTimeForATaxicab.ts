import { readFileSync } from "fs";

const sequence = readFileSync("input.txt", "utf8").trim();

function parseSequence(sequence: string) {
  return sequence
    .split(", ")
    .map((direction) => [direction[0], Number(direction.slice(1))]);
}

function calculateDistance(sequence: string, isPart2: boolean = false) {
  const parsedSequence = parseSequence(sequence);
  const position = [0, 0];
  let direction = [0, 1];

  const seen = new Set();

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

    for (let i = 0; i < Number(steps); i++) {
      const key = `${position[0]},${position[1]}`;
      if (seen.has(key) && isPart2) {
        return position.reduce((acc, curr) => acc + Math.abs(curr), 0);
      }
      seen.add(key);

      position[0] += direction[0];
      position[1] += direction[1];
    }
  }

  return position.reduce((acc, curr) => acc + Math.abs(curr), 0);
}

console.log("Part 1:", calculateDistance(sequence));
console.log("Part 2:", calculateDistance(sequence, true));
