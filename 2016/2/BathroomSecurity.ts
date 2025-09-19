import { readFileSync } from "fs";

const instructions = readFileSync("input.txt", "utf-8").trim().split("\n");

const keypad1 = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];
const keypad2 = [
  ["", "", "1", "", ""],
  ["", "2", "3", "4", ""],
  ["5", "6", "7", "8", "9"],
  ["", "A", "B", "C", ""],
  ["", "", "D", "", ""],
];

function findCode(
  instructions: string[],
  keypad: string[][],
  start: [number, number]
) {
  const dirs = {
    U: [0, -1],
    D: [0, 1],
    L: [-1, 0],
    R: [1, 0],
  };
  let code = "";
  let [px, py] = start;

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];

    for (let j = 0; j < instruction.length; j++) {
      const direction = instruction[j] as keyof typeof dirs;
      const [dx, dy] = dirs[direction];
      const [newX, newY] = [px + dx, py + dy];

      if (
        newX >= 0 &&
        newX < keypad.length &&
        newY >= 0 &&
        newY < keypad[0].length &&
        keypad[newY][newX] !== ""
      ) {
        px = newX;
        py = newY;
      }

      if (j === instruction.length - 1) {
        code += keypad[py][px];
      }
    }
  }

  return code;
}

console.log(findCode(instructions, keypad1, [1, 1]));
console.log(findCode(instructions, keypad2, [0, 2]));
