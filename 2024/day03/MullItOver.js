import fs from "fs";

const regex = /(mul\(\d+,\d+\)|do\(\)|don't\(\))/g;
const corruptedMemory = fs.readFileSync("input.txt", "utf-8").match(regex);
const instructions = [];
let match;

while ((match = regex.exec(corruptedMemory)) !== null) {
  instructions.push(match[0]);
}

let totalAddUp = 0;
let isEnable = true;

instructions.forEach((instruction) => {
  if (instruction === "do()") {
    isEnable = true;
  } else if (instruction === "don't()") {
    isEnable = false;
  }

  if (isEnable && instruction.startsWith("mul(")) {
    const [firstElement, secondElement] = instruction
      .replaceAll(/mul\(|\)/g, "")
      .split(",");

    const mulResult = parseInt(firstElement, 10) * parseInt(secondElement, 10);
    totalAddUp += mulResult;
  }
});

console.log(totalAddUp);
