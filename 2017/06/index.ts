import { readFileSync } from "fs";

const input = readFileSync("./2017/06/input.txt", "utf-8").trim();

function getMemoryBanks(input: string) {
  return input.split("\t").map(Number);
}

function redistributionCycles(memoryBanks: number[]) {
  const seen = new Set<string>();
  let cycles = 0;
  const state = {
    firstSeen: { memoryBank: "", cycles: 0 },
    secondSeen: { memoryBank: "", cycles: 0 },
  };
  while (true) {
    if (
      state.firstSeen.memoryBank === memoryBanks.join(",") &&
      state.firstSeen.cycles > 0
    ) {
      state.secondSeen.memoryBank = memoryBanks.join(",");
      state.secondSeen.cycles = cycles;
      break;
    }
    if (seen.has(memoryBanks.join(",")) && state.firstSeen.cycles === 0) {
      state.firstSeen.memoryBank = memoryBanks.join(",");
      state.firstSeen.cycles = cycles;
    }
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
  return [
    state.firstSeen.cycles,
    state.secondSeen.cycles - state.firstSeen.cycles,
  ];
}

console.log(redistributionCycles(getMemoryBanks(input)));
