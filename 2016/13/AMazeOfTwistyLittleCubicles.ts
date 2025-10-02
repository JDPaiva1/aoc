import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8").trim();

function getNeighbors(position: [number, number], input: number) {
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const neighbors: Array<[number, number]> = [];
  const [x, y] = position;
  const isOpen = (x: number, y: number) => {
    const value = x * x + 3 * x + 2 * x * y + y + y * y + input;
    const binary = value.toString(2).split("");
    return binary.filter((x) => x === "1").length % 2 === 0;
  };

  for (let i = 0; i < dirs.length; i++) {
    const [dx, dy] = [x + dirs[i][0], y + dirs[i][1]];
    if (dx < 0 || dy < 0 || !isOpen(dx, dy)) continue;
    neighbors.push([dx, dy]);
  }

  return neighbors;
}

function findShortestPath(input: number, target: [number, number]) {
  const queue = [{ position: [1, 1], steps: 0 }];
  const visited: Set<string> = new Set([`1,1`]);

  while (queue.length > 0) {
    const { position, steps } = queue.shift() as {
      position: [number, number];
      steps: number;
    };
    if (position[0] === target[0] && position[1] === target[1]) {
      return steps;
    }

    const neighbors = getNeighbors(position, input);
    for (const neighbor of neighbors) {
      if (visited.has(`${neighbor[0]},${neighbor[1]}`)) continue;
      visited.add(`${neighbor[0]},${neighbor[1]}`);
      queue.push({ position: neighbor, steps: steps + 1 });
    }
  }
}

console.log("Part 1:", findShortestPath(Number(input), [31, 39]));
