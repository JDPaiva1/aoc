import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8");

function getInstructions(input: string) {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(" "));
}

function cpy(x: string, y: string, registers: Record<string, number>) {
  if (isNaN(Number(x))) {
    registers[y] = registers[x];
    return registers[y];
  }

  registers[y] = Number(x);
  return registers[y];
}

function inc(x: string, registers: Record<string, number>) {
  registers[x]++;
  return registers[x];
}

function dec(x: string, registers: Record<string, number>) {
  registers[x]--;
  return registers[x];
}

function jnz(x: string, y: string, registers: Record<string, number>) {
  if (registers[x] === 0) {
    return 1;
  }
  return Number(y);
}

function execAssembunny(
  input: string,
  initialRegisters: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 }
) {
  const instructions = getInstructions(input);
  const registers = { ...initialRegisters };
  let pointer = 0;
  while (pointer < instructions.length) {
    const [instruction, x, y] = instructions[pointer];

    if (instruction === "cpy") {
      cpy(x, y, registers);
    } else if (instruction === "inc") {
      inc(x, registers);
    } else if (instruction === "dec") {
      dec(x, registers);
    } else if (instruction === "jnz") {
      pointer += jnz(x, y, registers);
      continue;
    }

    pointer += 1;
  }
  return registers.a;
}

console.log("Part 1:", execAssembunny(input));
console.log("Part 2:", execAssembunny(input, { c: 1 }));
