import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8");
const start = [];
const end = [];

function getMap(input) {
  return input
    .trim()
    .split("\n")
    .map((row, index) => {
      if (row.includes("S")) {
        start.push(...[row.indexOf("S"), index]);
      }
      if (row.includes("E")) {
        end.push(...[row.indexOf("E"), index]);
      }
      return row.split("");
    });
}

const dirs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function findCheats(minSaving = 0, cheatLength = 2) {
  const map = getMap(input);
  const visited = new Set();
  const path = [];
  let [x, y] = start;

  while (true) {
    path.push([x, y]);
    visited.add(`${x},${y}`);
    if (x === end[0] && y === end[1]) break;

    for (const [dx, dy] of dirs) {
      const nx = x + dx,
        ny = y + dy;
      if (
        ny >= 0 &&
        ny < map.length &&
        nx >= 0 &&
        nx < map[0].length &&
        map[ny][nx] !== "#" &&
        !visited.has(`${nx},${ny}`)
      ) {
        x = nx;
        y = ny;
        break;
      }
    }
  }

  const baseline = path.length - 1;

  let count = 0;
  for (let i = 0; i < path.length; i++) {
    for (let j = i + 1; j < path.length; j++) {
      const [x1, y1] = path[i];
      const [x2, y2] = path[j];
      const d = Math.abs(x1 - x2) + Math.abs(y1 - y2);

      if (d <= cheatLength) {
        const cheatLength = i + d + (baseline - j);
        if (baseline - cheatLength >= minSaving) {
          count++;
        }
      }
    }
  }

  return count;
}

console.log("Part 1:", findCheats(100));
console.log("Part 2:", findCheats(100, 20));
