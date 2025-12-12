import { readFileSync } from "fs";

const input = readFileSync("./2025/12/input.txt", "utf8").trim();

type Shape = {
  index: number;
  cells: Array<[number, number]>;
  area: number;
};

type Region = {
  width: number;
  height: number;
  counts: number[];
};

type Placement = {
  mask: bigint;
  positions: number[];
};

function parseInput(raw: string) {
  const lines = raw.split(/\r?\n/);
  const shapes: Shape[] = [];
  let i = 0;

  // Skip leading blank lines.
  while (i < lines.length && lines[i].trim() === "") i++;

  // Parse shapes until we hit the first region line (contains `x`).
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === "") {
      i++;
      continue;
    }
    if (line.includes("x")) break; // start of regions
    const shapeHeader = line.match(/^(\d+):$/);
    if (!shapeHeader) throw new Error(`Invalid shape header: ${line}`);
    const index = Number(shapeHeader[1]);
    i++;
    const grid: string[] = [];
    while (i < lines.length) {
      const next = lines[i];
      const trimmed = next.trim();
      if (trimmed === "") {
        i++;
        break;
      }
      if (/^\d+:$/.test(trimmed) || /^\d+x\d+:/.test(trimmed)) {
        break;
      }
      grid.push(next);
      i++;
    }
    const cells: Array<[number, number]> = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === "#") cells.push([x, y]);
      }
    }
    shapes[index] = { index, cells, area: cells.length };
  }

  // Parse regions
  const regions: Region[] = [];
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const m = line.match(/^(\d+)x(\d+):\s*(.*)$/);
    if (!m) throw new Error(`Invalid region line: ${line}`);
    const width = Number(m[1]);
    const height = Number(m[2]);
    const counts = m[3].trim().split(/\s+/).filter(Boolean).map(Number);
    regions.push({ width, height, counts });
  }

  return { shapes, regions };
}

function uniqueOrientations(shape: Shape) {
  const seen = new Set<string>();
  const result: Array<{
    cells: Array<[number, number]>;
    width: number;
    height: number;
  }> = [];

  const transforms: Array<(x: number, y: number) => [number, number]> = [
    (x, y) => [x, y],
    (x, y) => [-x, y],
    (x, y) => [x, -y],
    (x, y) => [-x, -y],
    (x, y) => [y, x],
    (x, y) => [-y, x],
    (x, y) => [y, -x],
    (x, y) => [-y, -x],
  ];

  for (const transform of transforms) {
    const pts = shape.cells.map(([x, y]) => transform(x, y));
    const minX = Math.min(...pts.map((p) => p[0]));
    const minY = Math.min(...pts.map((p) => p[1]));
    const normalized = pts.map(([x, y]) => [x - minX, y - minY]) as Array<
      [number, number]
    >;
    normalized.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    const key = normalized.map(([x, y]) => `${x},${y}`).join(";");
    if (seen.has(key)) continue;
    seen.add(key);
    const maxX = Math.max(...normalized.map((p) => p[0]));
    const maxY = Math.max(...normalized.map((p) => p[1]));
    result.push({ cells: normalized, width: maxX + 1, height: maxY + 1 });
  }

  return result;
}

function buildPlacements(
  orientations: Array<{
    cells: Array<[number, number]>;
    width: number;
    height: number;
  }>,
  regionWidth: number,
  regionHeight: number
) {
  const placements: Placement[] = [];
  const seen = new Set<bigint>();
  for (const orient of orientations) {
    for (let y0 = 0; y0 + orient.height <= regionHeight; y0++) {
      for (let x0 = 0; x0 + orient.width <= regionWidth; x0++) {
        let mask = 0n;
        const positions: number[] = [];
        for (const [dx, dy] of orient.cells) {
          const pos = (y0 + dy) * regionWidth + (x0 + dx);
          mask |= 1n << BigInt(pos);
          positions.push(pos);
        }
        if (seen.has(mask)) continue; // avoid duplicate placements due to symmetry
        seen.add(mask);
        placements.push({ mask, positions });
      }
    }
  }
  return placements;
}

function canFitRegion(region: Region, shapes: Shape[]) {
  const { width, height, counts } = region;
  const totalCells = width * height;

  const shapeAreas = shapes.map((s) => s?.area ?? 0);
  const totalNeededArea = counts.reduce(
    (sum, cnt, idx) => sum + cnt * (shapeAreas[idx] || 0),
    0
  );
  if (totalNeededArea > totalCells) return false;

  const placementsByShape: Array<Placement[]> = [];
  for (let idx = 0; idx < counts.length; idx++) {
    if (!counts[idx]) continue;
    const shape = shapes[idx];
    if (!shape) return false; // referenced shape is missing
    const orientations = uniqueOrientations(shape);
    placementsByShape[idx] = buildPlacements(orientations, width, height);
    if (placementsByShape[idx].length === 0) return false;
  }

  const remainingAreaInitial = totalNeededArea;

  // Build coverage index: for each cell, which shape placements cover it.
  const coverage: Array<Array<{ shape: number; mask: bigint }>> = Array.from(
    { length: totalCells },
    () => []
  );
  for (let s = 0; s < placementsByShape.length; s++) {
    const placements = placementsByShape[s];
    if (!placements) continue;
    for (const placement of placements) {
      for (const pos of placement.positions) {
        coverage[pos].push({ shape: s, mask: placement.mask });
      }
    }
  }

  const countsCopy = counts.slice();

  const chooseCell = (mask: bigint): number => {
    let bestCell = -1;
    let bestOptions = Number.POSITIVE_INFINITY;
    let hasCandidate = false;
    for (let pos = 0; pos < totalCells; pos++) {
      if (((mask >> BigInt(pos)) & 1n) !== 0n) continue; // already filled
      let options = 0;
      for (const entry of coverage[pos]) {
        if (countsCopy[entry.shape] === 0) continue;
        if ((entry.mask & mask) !== 0n) continue;
        options++;
        hasCandidate = true;
        if (options >= bestOptions) break; // no need to count further
      }
      if (options === 0) continue; // this cell can stay empty
      if (options < bestOptions) {
        bestOptions = options;
        bestCell = pos;
        if (bestOptions === 1) break; // can't improve further
      }
    }
    return hasCandidate ? bestCell : -1;
  };

  const search = (mask: bigint, remainingArea: number): boolean => {
    if (remainingArea === 0) return true;
    const cell = chooseCell(mask);
    if (cell === -1) return false;

    for (const entry of coverage[cell]) {
      const shapeIdx = entry.shape;
      if (countsCopy[shapeIdx] === 0) continue;
      if ((entry.mask & mask) !== 0n) continue;
      countsCopy[shapeIdx]--;
      if (search(mask | entry.mask, remainingArea - shapeAreas[shapeIdx])) {
        countsCopy[shapeIdx]++;
        return true;
      }
      countsCopy[shapeIdx]++;
    }
    return false;
  };

  return search(0n, remainingAreaInitial);
}

function partOne(input: string) {
  const { shapes, regions } = parseInput(input);
  let fits = 0;
  for (const region of regions) {
    if (canFitRegion(region, shapes)) fits++;
  }
  return fits;
}

console.log("Part 1:", partOne(input));
