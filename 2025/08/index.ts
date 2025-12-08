import { readFileSync } from "fs";

const input = readFileSync("./2025/08/input.txt", "utf8")
  .trim()
  .split("\n")
  .map((line) => line.split(",").map(Number));

function partOne(input: number[][], maxConnections = 1000): number {
  const n = input.length;

  const edges: { a: number; b: number; dist: number }[] = [];

  for (let i = 0; i < n; i++) {
    const [x1, y1, z1] = input[i];
    for (let j = i + 1; j < n; j++) {
      const [x2, y2, z2] = input[j];
      const dx = x1 - x2;
      const dy = y1 - y2;
      const dz = z1 - z2;
      const dist = dx * dx + dy * dy + dz * dz;
      edges.push({ a: i, b: j, dist });
    }
  }

  edges.sort((a, b) => a.dist - b.dist);

  const parent = Array.from({ length: n }, (_, idx) => idx);
  const size = new Array<number>(n).fill(1);

  const find = (x: number): number => {
    let node = x;
    while (parent[node] !== node) {
      parent[node] = parent[parent[node]];
      node = parent[node];
    }
    return node;
  };

  const union = (a: number, b: number): void => {
    let rootA = find(a);
    let rootB = find(b);
    if (rootA === rootB) return;
    if (size[rootA] < size[rootB]) {
      [rootA, rootB] = [rootB, rootA];
    }
    parent[rootB] = rootA;
    size[rootA] += size[rootB];
  };

  for (let i = 0; i < maxConnections; i++) {
    const { a, b } = edges[i];
    union(a, b);
  }

  const componentSizes = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    componentSizes.set(root, size[root]);
  }

  const sortedSizes = Array.from(componentSizes.values()).sort((a, b) => b - a);
  while (sortedSizes.length < 3) {
    sortedSizes.push(1);
  }

  return sortedSizes.slice(0, 3).reduce((product, value) => product * value, 1);
}

console.log("Part 1:", partOne(input));
