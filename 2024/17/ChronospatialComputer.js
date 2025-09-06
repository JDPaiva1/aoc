import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8").trim();

function getProgramInfo(input) {
  const registers = {
    a: 0,
    b: 0,
    c: 0,
  };
  let program = [];
  for (const line of input.split("\n")) {
    if (line.includes("Register A:")) {
      registers.a = parseInt(line.split("Register A:")[1].trim());
    } else if (line.includes("Register B:")) {
      registers.b = parseInt(line.split("Register B:")[1].trim());
    } else if (line.includes("Register C:")) {
      registers.c = parseInt(line.split("Register C:")[1].trim());
    } else if (line.includes("Program:")) {
      program = line.split("Program:")[1].trim().split(",").map(Number);
    }
  }
  return [registers, program];
}

function comboOperand(operand, registers) {
  // if (operand === 7) return;
  if (operand < 4) return operand;
  if (operand === 4) return registers.a;
  if (operand === 5) return registers.b;
  if (operand === 6) return registers.c;
}

function adv(operand, registers) {
  registers.a = parseInt(
    registers.a / Math.pow(2, comboOperand(operand, registers))
  );
}

function bxl(operand, registers) {
  registers.b = registers.b ^ operand;
}

function bst(operand, registers) {
  registers.b = comboOperand(operand, registers) % 8;
}

function jnz(operand, registers) {
  if (registers.a === 0) return;
  return operand;
}

function bxc(operand, registers) {
  registers.b = registers.b ^ registers.c;
}

function out(operand, registers) {
  return comboOperand(operand, registers) % 8;
}

function bdv(operand, registers) {
  registers.b = parseInt(
    registers.a / Math.pow(2, comboOperand(operand, registers))
  );
}

function cdv(operand, registers) {
  registers.c = parseInt(
    registers.a / Math.pow(2, comboOperand(operand, registers))
  );
}

function runProgram(r, program) {
  const registers = { ...r };
  const instructions = {
    0: adv,
    1: bxl,
    2: bst,
    3: jnz,
    4: bxc,
    5: out,
    6: bdv,
    7: cdv,
  };
  let pointer = 0;
  let output = [];

  while (pointer < program.length) {
    const opcode = program[pointer];
    const operand = program[pointer + 1];

    if (opcode === 3) {
      const jump = instructions[opcode](operand, registers);
      if (isNaN(jump)) {
        pointer += 2;
        continue;
      }
      pointer = jump;
      continue;
    }

    const out = instructions[opcode](operand, registers);
    if (!isNaN(out)) {
      output.push(out);
    }

    pointer += 2;
  }
  // console.log(registers);
  return output.join(",");
}

const [registers, program] = getProgramInfo(input);
console.log("Part 1:", runProgram(registers, program));
