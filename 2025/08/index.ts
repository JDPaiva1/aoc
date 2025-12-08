import { readFileSync } from "fs";

const input = readFileSync("./2025/08/input.txt", "utf8")
  .trim()
  .split("\n")
  .map((line) => line.split(",").map(Number));

type Edge = { a: number; b: number; dist: number };

function buildSortedEdges(points: number[][]): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < points.length; i++) {
    const [x1, y1, z1] = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const [x2, y2, z2] = points[j];
      const dx = x1 - x2;
      const dy = y1 - y2;
      const dz = z1 - z2;
      const dist = dx * dx + dy * dy + dz * dz;
      edges.push({ a: i, b: j, dist });
    }
  }
  edges.sort((a, b) => {
    if (a.dist !== b.dist) return a.dist - b.dist;
    if (a.a !== b.a) return a.a - b.a;
    return a.b - b.b;
  });
  return edges;
}

function createUnionFind(n: number) {
  const parent = Array.from({ length: n }, (_, idx) => idx);
  const size = new Array<number>(n).fill(1);
  let components = n;

  const find = (x: number): number => {
    let node = x;
    while (parent[node] !== node) {
      parent[node] = parent[parent[node]];
      node = parent[node];
    }
    return node;
  };

  const union = (a: number, b: number): boolean => {
    let rootA = find(a);
    let rootB = find(b);
    if (rootA === rootB) return false;
    if (size[rootA] < size[rootB]) {
      [rootA, rootB] = [rootB, rootA];
    }
    parent[rootB] = rootA;
    size[rootA] += size[rootB];
    components -= 1;
    return true;
  };

  const getSizeOfRoot = (root: number): number => size[root];

  const getComponents = (): number => components;

  return { find, union, getSizeOfRoot, getComponents };
}

function partOne(input: number[][], maxConnections = 1000): number {
  const n = input.length;
  if (n === 0) return 0;

  const edges = buildSortedEdges(input);
  const uf = createUnionFind(n);

  for (let i = 0; i < maxConnections; i++) {
    const { a, b } = edges[i];
    uf.union(a, b);
  }

  const componentSizes = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const root = uf.find(i);
    componentSizes.set(root, uf.getSizeOfRoot(root));
  }

  const sortedSizes = Array.from(componentSizes.values()).sort((a, b) => b - a);
  while (sortedSizes.length < 3) {
    sortedSizes.push(1);
  }

  return sortedSizes.slice(0, 3).reduce((product, value) => product * value, 1);
}

function partTwo(input: number[][]): number {
  const n = input.length;
  if (n < 2) return 0;

  const edges = buildSortedEdges(input);
  const uf = createUnionFind(n);

  for (const { a, b } of edges) {
    if (uf.union(a, b) && uf.getComponents() === 1) {
      const x1 = input[a][0];
      const x2 = input[b][0];
      return x1 * x2;
    }
  }

  return 0;
}

console.log("Part 1:", partOne(input));
console.log("Part 2:", partTwo(input));
