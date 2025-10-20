import { readFileSync } from "fs";

const number = Number(readFileSync("2017/03/input.txt", "utf8").trim());

function findShortestPath(number: number) {
  if (number === 1) return 0;

  const side = Math.ceil(Math.sqrt(number));
  const oddSide = side % 2 === 0 ? side + 1 : side;
  const ring = (oddSide - 1) / 2;

  const maxVal = oddSide ** 2;
  const step = oddSide - 1;
  const middles = [
    maxVal - ring,
    maxVal - step - ring,
    maxVal - 2 * step - ring,
    maxVal - 3 * step - ring,
  ];

  const nearest = middles.reduce((a, b) =>
    Math.abs(number - a) < Math.abs(number - b) ? a : b
  );

  return ring + Math.abs(number - nearest);
}

function firstValueLargerThan(number: number) {
  const grid = new Map();
  const key = (x: number, y: number) => `${x},${y}`;

  grid.set(key(0, 0), 1);

  let [x, y] = [0, 0];
  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  let stepSize = 1;
  while (true) {
    for (let d = 0; d < 4; d++) {
      for (let s = 0; s < stepSize; s++) {
        x += dirs[d][0];
        y += dirs[d][1];

        let sum = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            sum += grid.get(key(x + dx, y + dy)) || 0;
          }
        }

        grid.set(key(x, y), sum);
        if (sum > number) return sum;
      }
      if (d === 1 || d === 3) stepSize++;
    }
  }
}

console.log("Part 1:", findShortestPath(number));
console.log("Part 2:", firstValueLargerThan(number));
