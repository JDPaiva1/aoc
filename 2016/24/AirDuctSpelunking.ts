import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8").trim();

type Point = [number, number];

function getMap(input: string) {
  const map = input.split("\n").map((line) => line.split(""));
  const locations = new Map<string, Point>();

  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.match(/[0-9]/)) {
        locations.set(cell, [x, y]);
      }
    });
  });

  const start = locations.get("0");
  if (!start) {
    throw new Error("No starting position found");
  }

  return { map, locations, start };
}

function bfs(map: string[][], start: Point) {
  const height = map.length;
  const width = map[0]?.length ?? 0;
  const visited = new Set<string>();
  const distances = new Map<string, number>();
  const queue: Array<{ point: Point; steps: number }> = [
    { point: start, steps: 0 },
  ];

  const serialize = (x: number, y: number) => `${x},${y}`;
  const neighbors = (x: number, y: number): Point[] => {
    const results: Point[] = [];
    const deltas: Point[] = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    for (const [dx, dy] of deltas) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
        continue;
      }
      if (map[ny][nx] === "#") {
        continue;
      }
      results.push([nx, ny]);
    }

    return results;
  };

  while (queue.length) {
    const { point, steps } = queue.shift()!;
    const [x, y] = point;
    const key = serialize(x, y);
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    const cell = map[y][x];
    if (cell.match(/[0-9]/)) {
      distances.set(cell, steps);
    }

    for (const neighbor of neighbors(x, y)) {
      const nKey = serialize(neighbor[0], neighbor[1]);
      if (!visited.has(nKey)) {
        queue.push({ point: neighbor, steps: steps + 1 });
      }
    }
  }

  return distances;
}

function findShortestPath(input: string) {
  const { map, locations } = getMap(input);
  const digits = Array.from(locations.keys()).sort(
    (a, b) => Number(a) - Number(b)
  );

  const distanceGraph = new Map<string, Map<string, number>>();
  for (const digit of digits) {
    const start = locations.get(digit)!;
    distanceGraph.set(digit, bfs(map, start));
  }

  const targets = digits.filter((digit) => digit !== "0");
  let best = Number.POSITIVE_INFINITY;

  const search = (current: string, remaining: string[], total: number) => {
    if (total >= best) {
      return;
    }

    if (remaining.length === 0) {
      best = Math.min(best, total);
      return;
    }

    for (let i = 0; i < remaining.length; i += 1) {
      const next = remaining[i];
      const distance = distanceGraph.get(current)?.get(next);
      if (distance === undefined) {
        continue;
      }

      const nextRemaining = remaining
        .slice(0, i)
        .concat(remaining.slice(i + 1));
      search(next, nextRemaining, total + distance);
    }
  };

  search("0", targets, 0);
  return best;
}

console.log("Part 1:", findShortestPath(input));
