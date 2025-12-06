import { readFileSync } from "fs";

const worksheet = readFileSync("./2025/06/input.txt", "utf8")
  .trim()
  .split("\n")
  .map((line) => line.trim().split(/\s+/));

function partOne(worksheet: string[][]): number {
  const problems: number[][] = [];
  const operators = [];
  const results = [];

  for (const line of worksheet) {
    if (line.length === 0) continue;
    for (let i = 0; i < line.length; i++) {
      if (isNaN(Number(line[i]))) {
        operators.push(line[i]);
        continue;
      }
      if (problems[i] === undefined) problems[i] = [];
      const number = Number(line[i]);
      problems[i].push(number);
    }
  }

  for (let i = 0; i < problems.length; i++) {
    const column = problems[i];
    const symbol = operators[i];
    if (symbol === "+") {
      results.push(column.reduce((acc, curr) => acc + curr, 0));
    } else if (symbol === "*") {
      results.push(column.reduce((acc, curr) => acc * curr, 1));
    }
  }

  return results.reduce((acc, curr) => acc + curr, 0);
}

console.log("Part 1:", partOne(worksheet));
