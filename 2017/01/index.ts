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

function getSumHalfwayAround(input: string) {
  const firstHalf = input.slice(0, input.length / 2);
  const secondHalf = input.slice(input.length / 2);
  let sum = 0;
  for (let i = 0; i < firstHalf.length; i++) {
    if (firstHalf[i] !== secondHalf[i]) continue;
    sum += Number(firstHalf[i]) * 2;
  }
  return sum;
}

console.log("Part 1:", getSum(input));
console.log("Part 2:", getSumHalfwayAround(input));
