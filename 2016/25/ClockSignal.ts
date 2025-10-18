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

function out(x: string, registers: Record<string, number>) {
  if (registers[x] === undefined) return x;
  return registers[x].toString();
}

function execAssembunny(input: string, initRegisters?: Record<string, number>) {
  const instructions = getInstructions(input);
  const registers = { a: 0, b: 0, c: 0, d: 0, ...(initRegisters ?? {}) };
  let pointer = 0;
  let clockSignal = "";

  while (pointer < instructions.length) {
    const [instruction, x, y] = instructions[pointer];
    if (clockSignal.length === 10) break;

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
    } else if (instruction === "out") {
      clockSignal += out(x, registers);
    }

    pointer += 1;
  }
  return clockSignal;
}

function findInitialRegister(input: string) {
  let i = 0;
  const expectedClockSignal = "0101010101";
  let clockSignal = "";
  while (true) {
    clockSignal = execAssembunny(input, { a: i });
    if (clockSignal.startsWith(expectedClockSignal)) break;
    i++;
  }
  return i;
}

console.log("Part 1:", findInitialRegister(input));
