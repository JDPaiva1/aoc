import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8");

function getMap(input) {
  let endPosition = [];
  let startPosition = [];
  const map = input
    .trim()
    .split("\n")
    .map((row, index) => {
      if (row.includes("E")) {
        endPosition = [row.indexOf("E"), index];
      }
      if (row.includes("S")) {
        startPosition = [row.indexOf("S"), index];
      }
      return row.split("");
    });
  return { map, endPosition, startPosition };
}

const dirs = {
  north: [-1, 0],
  east: [0, 1],
  south: [1, 0],
  west: [0, -1],
};

function findPath() {
  const { map, endPosition, startPosition } = getMap(input);
  // console.table(map);
  // console.log(`startPosition: ${startPosition}, endPosition: ${endPosition}`);

  const seen = new Map();
  const queue = [];
  queue.push([startPosition, "east", 0]);

  while (queue.length > 0) {
    const [[x, y], dir, cost] = queue.shift();

    const key = `${x},${y},${dir}`;
    if (seen.has(key) && seen.get(key) <= cost) {
      continue;
    }
    seen.set(key, cost);

    if (x === endPosition[0] && y === endPosition[1]) {
      return cost;
    }

    // move forward
    const [nx, ny] = [x + dirs[dir][0], y + dirs[dir][1]];
    if (
      nx >= 0 &&
      nx < map.length &&
      ny >= 0 &&
      ny < map[0].length &&
      map[ny][nx] !== "#"
    ) {
      queue.push([[nx, ny], dir, cost + 1]);
    }

    for (const [key, value] of Object.entries(dirs)) {
      if (key === dir) continue;
      queue.push([[x, y], key, cost + 1000]);
    }
    queue.sort((a, b) => a[2] - b[2]);
  }
  return null;
}

function findBestPath(minEndCost = Infinity) {
  const { map, endPosition, startPosition } = getMap(input);
  const costs = new Map();
  const optimalPaths = new Set();
  const paths = new Map();

  const queue = [];
  queue.push([
    startPosition,
    "east",
    0,
    [`${startPosition[0]},${startPosition[1]}`],
  ]);

  while (queue.length > 0) {
    const [[x, y], dir, cost, path] = queue.shift();
    const key = `${x},${y},${dir}`;

    if (cost > minEndCost) continue;
    if (costs.has(key) && costs.get(key) < cost) continue;

    costs.set(key, cost);
    paths.set(key, path);

    if (x === endPosition[0] && y === endPosition[1]) {
      path.forEach((pos) => optimalPaths.add(pos));
      continue;
    }

    const [nx, ny] = [x + dirs[dir][0], y + dirs[dir][1]];
    if (
      nx >= 0 &&
      nx < map.length &&
      ny >= 0 &&
      ny < map[0].length &&
      map[ny][nx] !== "#"
    ) {
      queue.push([[nx, ny], dir, cost + 1, [...path, `${nx},${ny}`]]);
    }

    for (const [key, value] of Object.entries(dirs)) {
      if (key === dir) continue;
      queue.push([[x, y], key, cost + 1000, [...path, `${x},${y}`]]);
    }
    queue.sort((a, b) => a[2] - b[2]);
  }

  return optimalPaths.size;
}

const minEndCost = findPath();
console.log(minEndCost);
console.log(findBestPath(minEndCost));
