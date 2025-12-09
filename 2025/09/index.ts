import { readFileSync } from "fs";

const input = readFileSync("./2025/09/input.txt", "utf8")
  .trim()
  .split("\n")
  .map((line) => line.split(",").map(Number));

function partOne(input: number[][]) {
  let maxArea = 0;
  let bestPair: [{ x: number; y: number }, { x: number; y: number }] | null =
    null;

  for (let i = 0; i < input.length; i++) {
    const [x1, y1] = input[i];
    for (let j = i + 1; j < input.length; j++) {
      const [x2, y2] = input[j];

      const width = Math.abs(x1 - x2) + 1;
      const height = Math.abs(y1 - y2) + 1;

      const area = width * height;

      if (area > maxArea) {
        maxArea = area;
        bestPair = [
          { x: x1, y: y1 },
          { x: x2, y: y2 },
        ];
      }
    }
  }

  return maxArea;
}

function partTwo(input: number[][]): number {
  // Coordinate compression: get unique sorted x and y values
  const xSet = new Set<number>();
  const ySet = new Set<number>();
  for (const [x, y] of input) {
    xSet.add(x);
    ySet.add(y);
  }
  const xs = [...xSet].sort((a, b) => a - b);
  const ys = [...ySet].sort((a, b) => a - b);

  // Map from coordinate to index
  const xToIdx = new Map<number, number>();
  const yToIdx = new Map<number, number>();
  xs.forEach((x, i) => xToIdx.set(x, i));
  ys.forEach((y, i) => yToIdx.set(y, i));

  // Build edges between consecutive red tiles (polygon edges)
  type Edge = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    orientation: "H" | "V";
  };
  const edges: Edge[] = [];
  for (let i = 0; i < input.length; i++) {
    const [x1, y1] = input[i];
    const [x2, y2] = input[(i + 1) % input.length];
    const orientation = x1 === x2 ? "V" : "H";
    edges.push({ x1, y1, x2, y2, orientation });
  }
  const verticalEdges = edges.filter((e) => e.orientation === "V");

  // Check if a point is inside the polygon using ray casting
  const isInside = (px: number, py: number): boolean => {
    let crossings = 0;
    for (const edge of verticalEdges) {
      const { x1, y1, y2 } = edge;
      if (x1 > px) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        if (py > minY && py < maxY) {
          crossings++;
        }
      }
    }
    return crossings % 2 === 1;
  };

  // Build grid of compressed cells: grid[i][j] = 1 if cell between xs[i],xs[i+1] and ys[j],ys[j+1] is inside
  const gridW = xs.length - 1;
  const gridH = ys.length - 1;
  const grid: number[][] = Array.from({ length: gridH }, () =>
    new Array(gridW).fill(0)
  );

  // For each compressed cell, check if its center is inside the polygon
  for (let j = 0; j < gridH; j++) {
    const centerY = (ys[j] + ys[j + 1]) / 2;
    for (let i = 0; i < gridW; i++) {
      const centerX = (xs[i] + xs[i + 1]) / 2;
      if (isInside(centerX, centerY)) {
        grid[j][i] = 1;
      }
    }
  }

  // Build prefix sum for fast rectangle queries
  // prefix[j][i] = sum of grid[0..j-1][0..i-1]
  const prefix: number[][] = Array.from({ length: gridH + 1 }, () =>
    new Array(gridW + 1).fill(0)
  );
  for (let j = 1; j <= gridH; j++) {
    for (let i = 1; i <= gridW; i++) {
      prefix[j][i] =
        grid[j - 1][i - 1] +
        prefix[j - 1][i] +
        prefix[j][i - 1] -
        prefix[j - 1][i - 1];
    }
  }

  // Query: count of inside cells in compressed grid range [i1, i2) x [j1, j2)
  const countInside = (
    i1: number,
    j1: number,
    i2: number,
    j2: number
  ): number => {
    return prefix[j2][i2] - prefix[j1][i2] - prefix[j2][i1] + prefix[j1][i1];
  };

  // Find largest rectangle with red tiles at opposite corners
  let maxArea = 0;
  for (let a = 0; a < input.length; a++) {
    const [x1, y1] = input[a];
    const i1 = xToIdx.get(x1)!;
    const j1 = yToIdx.get(y1)!;

    for (let b = a + 1; b < input.length; b++) {
      const [x2, y2] = input[b];
      const i2 = xToIdx.get(x2)!;
      const j2 = yToIdx.get(y2)!;

      const rectWidth = Math.abs(x1 - x2) + 1;
      const rectHeight = Math.abs(y1 - y2) + 1;
      const area = rectWidth * rectHeight;

      if (area <= maxArea) continue;

      // Check if all compressed cells in the rectangle are inside
      const minI = Math.min(i1, i2);
      const maxI = Math.max(i1, i2);
      const minJ = Math.min(j1, j2);
      const maxJ = Math.max(j1, j2);

      // Number of compressed cells between the red tiles
      const cellCount = (maxI - minI) * (maxJ - minJ);
      const insideCount = countInside(minI, minJ, maxI, maxJ);

      if (insideCount === cellCount) {
        maxArea = area;
      }
    }
  }

  return maxArea;
}

console.log("Part 1:", partOne(input));
console.log("Part 2:", partTwo(input));
