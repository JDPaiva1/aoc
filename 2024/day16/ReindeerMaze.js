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

function findPath() {
  const { map, endPosition, startPosition } = getMap(input);
  // console.table(map);
  // console.log(`startPosition: ${startPosition}, endPosition: ${endPosition}`);
  const dirs = {
    north: [-1, 0],
    east: [0, 1],
    south: [1, 0],
    west: [0, -1],
  };

  const queue = [];
  const addToQueue = (position, dir, cost) => {
    queue.push([position, dir, cost]);
    queue.sort((a, b) => a[2] - b[2]);
  };

  const seen = new Map();

  addToQueue(startPosition, "east", 0);

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
      addToQueue([nx, ny], dir, cost + 1);
    }

    for (const [key, value] of Object.entries(dirs)) {
      if (key === dir) continue;
      addToQueue([x, y], key, cost + 1000);
    }
  }
  return null;
}

console.log(findPath());
