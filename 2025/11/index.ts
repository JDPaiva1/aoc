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

console.log("Part 1:", partOne(input));
