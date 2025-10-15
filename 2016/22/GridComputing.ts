import { readFileSync } from "fs";

interface Node {
  position: [number, number];
  size: number;
  used: number;
  available: number;
  usedPercentage: number;
}

const input = readFileSync("input.txt", "utf-8").trim().split("\n");

function getNodes(input: string[]) {
  const nodes = new Map<string, Node>();
  for (const line of input) {
    if (line.trim() === "" || !line.includes("/dev/grid/node")) continue;

    const [name, size, used, available, usedPercentage] = line.split(/\s+/);
    const key = name.replace("/dev/grid/", "");
    const [x, y] = key
      .replace("node-x", "")
      .replace("y", "")
      .split("-")
      .map(Number);

    nodes.set(key, {
      position: [x, y],
      size: Number(size.replace("T", "")),
      used: Number(used.replace("T", "")),
      available: Number(available.replace("T", "")),
      usedPercentage: Number(usedPercentage.replace("%", "")),
    });
  }
  return nodes;
}

function getViablePairs(input: string[]) {
  const nodes = getNodes(input);
  const viablePairs = [];
  for (const [name, node] of nodes.entries()) {
    if (node.used === 0) continue;
    for (const [name2, node2] of nodes.entries()) {
      if (name === name2) continue;
      if (node.used <= node2.available) {
        viablePairs.push([name, name2]);
      }
    }
  }
  return viablePairs.length;
}

console.log("Part 1:", getViablePairs(input));
