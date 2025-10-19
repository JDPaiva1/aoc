import { readFileSync } from "fs";

const input = readFileSync("./2017/01/input.txt", "utf-8").trim();

function getSum(input: string) {
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] !== (input[i + 1] ?? input[0])) continue;
    sum += Number(input[i]);
  }
  return sum;
}

console.log("Part 1:", getSum(input));
