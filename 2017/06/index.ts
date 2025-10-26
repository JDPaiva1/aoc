import { readFileSync } from "fs";

const input = readFileSync("./2017/06/input.txt", "utf-8").trim();

function getMemoryBanks(input: string) {
  return input.split("\t").map(Number);
}

function redistributionCycles(memoryBanks: number[]) {
  const seen = new Set<string>();
  let cycles = 0;
  while (true) {
    if (seen.has(memoryBanks.join(","))) break;
    seen.add(memoryBanks.join(","));
    const max = Math.max(...memoryBanks);
    const index = memoryBanks.indexOf(max);
    memoryBanks[index] = 0;
    let pointer = (index + 1) % memoryBanks.length;
    for (let i = 0; i < max; i++) {
      memoryBanks[pointer]++;
      pointer = (pointer + 1) % memoryBanks.length;
    }
    cycles++;
  }
  return cycles;
}

console.log(redistributionCycles(getMemoryBanks(input)));
