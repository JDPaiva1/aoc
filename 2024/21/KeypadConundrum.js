import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8").trim().split("\n");

const numericKeypad = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  [null, "0", "A"],
];
const directionalKeypad = [
  [null, "^", "A"],
  ["<", "v", ">"],
];
// Always start at "A"
const numericStart = [2, 3];
const directionalStart = [2, 0];
const dirs = {
  "<": [-1, 0],
  ">": [1, 0],
  "^": [0, -1],
  v: [0, 1],
};

function findKeyPosition(keypad, key) {
  for (let y = 0; y < keypad.length; y++) {
    for (let x = 0; x < keypad[0].length; x++) {
      if (keypad[y][x] === key) return [x, y];
    }
  }
  return null;
}

function findShortestPathsToKey(keypad, start, keyToFind) {
  const queue = [[start, 0, []]];
  const paths = [];
  let shortest = Infinity;

  while (queue.length > 0) {
    const [[x, y], distance, path] = queue.shift();

    if (distance > shortest) continue;

    if (keypad[y][x] === keyToFind) {
      shortest = distance;
      paths.push(path);
      continue;
    }

    for (const [key, [dx, dy]] of Object.entries(dirs)) {
      const [nx, ny] = [x + dx, y + dy];
      if (
        nx < 0 ||
        nx >= keypad[0].length ||
        ny < 0 ||
        ny >= keypad.length ||
        keypad[ny][nx] === null
      ) {
        continue;
      }
      queue.push([[nx, ny], distance + 1, [...path, key]]);
    }
  }

  return paths;
}

const cache = new Map();
function minSequenceLength(keypad, start, target, depth) {
  const cacheKey = JSON.stringify([
    start,
    target,
    depth,
    keypad === numericKeypad,
  ]);
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  if (depth === 0) {
    const paths = findShortestPathsToKey(keypad, start, target);
    // all shortest paths have the same length
    const baseLen = paths[0].length + 1; // +1 for "A"
    cache.set(cacheKey, baseLen);
    return baseLen;
  }

  const paths = findShortestPathsToKey(keypad, start, target);

  let best = Infinity;
  for (const path of paths) {
    let subLen = 0;
    let subStart = directionalStart;

    for (const step of [...path, "A"]) {
      subLen += minSequenceLength(directionalKeypad, subStart, step, depth - 1);
      subStart = findKeyPosition(directionalKeypad, step);
    }

    best = Math.min(best, subLen);
  }

  cache.set(cacheKey, best);
  return best;
}

function findComplexity(codes) {
  let total = 0;

  for (const code of codes) {
    let pos = numericStart;
    let totalLen = 0;

    for (const digit of code) {
      const len = minSequenceLength(numericKeypad, pos, digit, 2);
      totalLen += len;
      pos = findKeyPosition(numericKeypad, digit);
    }

    total += totalLen * parseInt(code, 10);
  }

  return total;
}

console.log(findComplexity(input));
