import { readFileSync } from "fs";

const input = readFileSync("./2025/11/input.txt", "utf8").trim();

function parseInput(input: string) {
  const deviceList: Record<string, string[]> = {};
  for (const line of input.split("\n")) {
    const [device, output] = line.trim().split(": ");
    if (device && output) {
      deviceList[device] = output.split(" ");
    }
  }
  return deviceList;
}

function partOne(input: string) {
  const deviceList = parseInput(input);

  function dfs(node: string, visited: Set<string>): number {
    if (node === "out") return 1;
    if (visited.has(node)) return 0;

    const nextVisited = new Set(visited);
    nextVisited.add(node);

    const neighbors = deviceList[node] ?? [];
    let paths = 0;
    for (const neighbor of neighbors) {
      paths += dfs(neighbor, nextVisited);
    }
    return paths;
  }

  return dfs("you", new Set());
}

function partTwo(input: string) {
  const deviceList = parseInput(input);

  function dfs(node: string, seenDAC: boolean, seenFFT: boolean): number {
    const key = `${node}|${seenDAC ? 1 : 0}|${seenFFT ? 1 : 0}`;
    if (memo.has(key)) return memo.get(key)!;
    if (visiting.has(key)) return 0;

    const nextSeenDAC = seenDAC || node === "dac";
    const nextSeenFFT = seenFFT || node === "fft";

    if (node === "out") {
      return nextSeenDAC && nextSeenFFT ? 1 : 0;
    }

    visiting.add(key);
    const neighbors = deviceList[node] ?? [];
    let paths = 0;
    for (const neighbor of neighbors) {
      paths += dfs(neighbor, nextSeenDAC, nextSeenFFT);
    }
    visiting.delete(key);
    memo.set(key, paths);
    return paths;
  }

  const memo = new Map<string, number>();
  const visiting = new Set<string>();

  return dfs("svr", false, false);
}

console.log("Part 1:", partOne(input));
console.log("Part 2:", partTwo(input));
