import { readFileSync } from "fs";

type Machine = {
  lights: number;
  targetMask: number;
  buttonMasks: number[];
};

const input = readFileSync("./2025/10/input.txt", "utf8");

function parseInput(raw: string): Machine[] {
  return raw
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const indicator = line.match(/\[(.*?)\]/)?.[1]!;
      const lights = indicator.length;
      let targetMask = 0;
      for (let i = 0; i < indicator.length; i++) {
        if (indicator[i] === "#") {
          targetMask |= 1 << i;
        }
      }

      const buttonMasks: number[] = [];
      for (const match of line.matchAll(/\((\d+(?:,\d+)*)\)/g)) {
        const nums = match[1].split(",").map(Number);
        let mask = 0;
        for (const n of nums) {
          mask |= 1 << n;
        }
        buttonMasks.push(mask);
      }

      return { lights, targetMask, buttonMasks };
    });
}

function partOne(machines: Machine[]): number {
  const minPresses = (machine: Machine): number => {
    const { lights, targetMask, buttonMasks } = machine;
    if (targetMask === 0) return 0;

    const seen = new Int16Array(1 << lights).fill(-1);
    const queue = new Uint16Array(1 << lights);
    let head = 0;
    let tail = 0;

    seen[0] = 0;
    queue[tail++] = 0;

    while (head < tail) {
      const state = queue[head++];
      const steps = seen[state];
      for (const mask of buttonMasks) {
        const next = state ^ mask;
        if (seen[next] !== -1) continue;
        seen[next] = (steps as number) + 1;
        if (next === targetMask) {
          return seen[next];
        }
        queue[tail++] = next;
      }
    }

    return -1; // unreachable
  };
  return machines.reduce((sum, m) => sum + minPresses(m), 0);
}

const machines = parseInput(input);
console.log("Part 1:", partOne(machines));
