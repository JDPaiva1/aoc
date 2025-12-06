import { readFileSync } from "fs";

const input = readFileSync("./2025/06/input.txt", "utf8").trim();
const worksheet = input.split("\n").map((line) => line.trim().split(/\s+/));

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

function partTwo(input: string): number {
  const lines = input.split("\n").filter((line) => line.length > 0);
  const width = Math.max(...lines.map((line) => line.length));
  const results = [];
  let currentProblemNumbers = [];
  let currentOperator = null;

  for (let col = width - 1; col >= 0; col--) {
    let columnString = "";
    for (let row = 0; row < lines.length; row++) {
      const char = lines[row][col] ?? " ";
      columnString += char;
    }

    const trimmedCol = columnString.trim();
    if (trimmedCol === "") {
      if (currentProblemNumbers.length > 0 && currentOperator) {
        if (currentOperator === "+") {
          results.push(currentProblemNumbers.reduce((acc, curr) => acc + curr, 0));
        } else if (currentOperator === "*") {
          results.push(currentProblemNumbers.reduce((acc, curr) => acc * curr, 1));
        }
        currentProblemNumbers = [];
        currentOperator = null;
      }
      continue;
    }

    const operatorChar = columnString[columnString.length - 1];
    const numberPart = columnString.slice(0, -1).trim();

    if (["+", "*"].includes(operatorChar)) {
      currentOperator = operatorChar;
      if (numberPart) {
        currentProblemNumbers.push(parseInt(numberPart, 10));
      }
    } else {
      const fullNum = parseInt(columnString.trim(), 10);
      if (!isNaN(fullNum)) {
        currentProblemNumbers.push(fullNum);
      }
    }
  }

  if (currentProblemNumbers.length > 0 && currentOperator) {
    if (currentOperator === "+") {
      results.push(currentProblemNumbers.reduce((acc, curr) => acc + curr, 0));
    } else if (currentOperator === "*") {
      results.push(currentProblemNumbers.reduce((acc, curr) => acc * curr, 1));
    }
  }

  return results.reduce((acc, val) => acc + val, 0);
}

console.log("Part 1:", partOne(worksheet));
console.log("Part 2:", partTwo(input));
