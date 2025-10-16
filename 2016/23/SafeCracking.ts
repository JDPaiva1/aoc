import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8");

function getInstructions(input: string) {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(" "));
}

function cpy(x: string, y: string, registers: Record<string, number>) {
  if (registers[y] === undefined) return;
  if (isNaN(Number(x))) {
    registers[y] = registers[x];
    return registers[y];
  }
  registers[y] = Number(x);
  return registers[y];
}

function inc(x: string, registers: Record<string, number>) {
  if (registers[x] === undefined) return;
  registers[x]++;
  return registers[x];
}

function dec(x: string, registers: Record<string, number>) {
  if (registers[x] === undefined) return;
  registers[x]--;
  return registers[x];
}

function jnz(x: string, y: string, registers: Record<string, number>) {
  if (x === "0" || registers[x] === 0) {
    return 1;
  }
  if (registers[y] !== undefined) return registers[y];
  return Number(y);
}

function tgl(
  x: string,
  pointer: number,
  registers: Record<string, number>,
  instructions: string[][]
) {
  const i = pointer + (registers[x] ?? Number(x));
  if (instructions[i] === undefined) return;
  if (instructions[i].length === 2) {
    instructions[i][0] = instructions[i][0] === "inc" ? "dec" : "inc";
    return;
  }
  instructions[i][0] = instructions[i][0] === "jnz" ? "cpy" : "jnz";
}

function execAssembunny(
  input: string,
  initialRegisters: Record<string, number> = { a: 0, b: 0, c: 0, d: 0 }
) {
  const instructions = getInstructions(input);
  const registers = { a: 0, b: 0, c: 0, d: 0, ...initialRegisters };
  let pointer = 0;
  let loopCount = 0;

  while (pointer < instructions.length && loopCount < 52) {
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
    } else if (instruction === "tgl") {
      tgl(x, pointer, registers, instructions);
    }

    pointer += 1;
  }
  return registers.a;
}

console.log("Part 1:", execAssembunny(input, { a: 7 }));
console.log("Part 2:", execAssembunny(input, { a: 12 }));
