import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8");

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function getCorruptedMemory(input) {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(",").map(Number));
}

function initGrid(size = 7) {
  return Array.from({ length: size }, () => Array(size).fill("."));
}

function drawCorruptedMemory(corruptedMemory, grid, numBytes = 12) {
  for (const [x, y] of corruptedMemory.slice(0, numBytes)) {
    grid[y][x] = "#";
  }
  return grid;
}

function findMinNumOfStepsToExit(grid) {
  // console.table(grid);

  const start = [0, 0];
  const end = [grid[0].length - 1, grid.length - 1];
  const queue = [[start, 0]];
  const visited = new Set();

  while (queue.length > 0) {
    const [[positionX, positionY], steps] = queue.shift();

    const key = `${positionX},${positionY}`;
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    if (positionX === end[0] && positionY === end[1]) {
      return steps;
    }

    for (const [dx, dy] of dirs) {
      const [newX, newY] = [positionX + dx, positionY + dy];
      if (
        newX < 0 ||
        newX >= grid[0].length ||
        newY < 0 ||
        newY >= grid.length ||
        grid[newY][newX] === "#" ||
        visited.has(`${newX},${newY}`)
      ) {
        continue;
      }
      queue.push([[newX, newY], steps + 1]);
    }
    queue.sort((a, b) => a[1] - b[1]);
  }
  return null;
}

function findByteThatCutExit() {
  const corruptedMemory = getCorruptedMemory(input);
  const grid = initGrid(71);

  for (let i = 0; i < corruptedMemory.length; i++) {
    drawCorruptedMemory(corruptedMemory, grid, i);
    const steps = findMinNumOfStepsToExit(grid);
    if (steps === null) {
      return corruptedMemory[i - 1];
    }
  }
  return null;
}

console.log(
  findMinNumOfStepsToExit(
    drawCorruptedMemory(getCorruptedMemory(input), initGrid(71), 1024)
  )
);

console.log(findByteThatCutExit());
