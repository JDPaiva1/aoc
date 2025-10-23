import { readFileSync } from "fs";

const input = readFileSync("./2017/05/input.txt", "utf-8").trim().split("\n");

function getSteps(input: string[], isStrange = false) {
  const offsets = input.map(Number);
  let steps = 0;
  let pointer = 0;
  while (pointer >= 0 && pointer < offsets.length) {
    const offset = offsets[pointer];
    offsets[pointer] = isStrange && offset >= 3 ? offset - 1 : offset + 1;
    pointer += offset;
    steps++;
  }
  return steps;
}

console.log("Part 1:", getSteps(input));
console.log("Part 2:", getSteps(input, true));
