import { readFileSync } from "fs";

const instructions = readFileSync("./2017/08/input.txt", "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(" "));

function executeInstructions(instructions: string[][]) {
  const registers = new Map<string, number>();
  let maxValue = 0;

  const evalCondition = (left: number, condition: string, right: number) => {
    switch (condition) {
      case ">":
        return left > right;
      case "<":
        return left < right;
      case ">=":
        return left >= right;
      case "<=":
        return left <= right;
      case "==":
        return left === right;
      case "!=":
        return left !== right;
      default:
        return false;
    }
  };

  for (const instruction of instructions) {
    const [
      register,
      operation,
      value,
      _,
      leftCondition,
      condition,
      rightCondition,
    ] = instruction;

    maxValue = Math.max(maxValue, Math.max(...registers.values()));

    if (!registers.has(register)) {
      registers.set(register, 0);
    }
    if (!registers.has(leftCondition)) {
      registers.set(leftCondition, 0);
    }

    if (
      evalCondition(
        registers.get(leftCondition)!,
        condition,
        Number(rightCondition)
      )
    ) {
      if (operation === "inc") {
        registers.set(register, registers.get(register)! + Number(value));
      } else if (operation === "dec") {
        registers.set(register, registers.get(register)! - Number(value));
      }
    }
  }

  return [Math.max(...registers.values()), maxValue];
}

const [part1, part2] = executeInstructions(instructions);
console.log("Part 1:", part1);
console.log("Part 2:", part2);
