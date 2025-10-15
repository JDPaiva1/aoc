import { readFileSync } from "fs";

interface Node {
  position: [number, number];
  size: number;
  used: number;
  available: number;
  usedPercentage: number;
}

const input = readFileSync("input.txt", "utf-8").trim().split("\n");

function getNodes(input: string[]) {
  const nodes = new Map<string, Node>();
  for (const line of input) {
    if (line.trim() === "" || !line.includes("/dev/grid/node")) continue;

    const [name, size, used, available, usedPercentage] = line.split(/\s+/);
    const key = name.replace("/dev/grid/", "");
    const [x, y] = key
      .replace("node-x", "")
      .replace("y", "")
      .split("-")
      .map(Number);

    nodes.set(key, {
      position: [x, y],
      size: Number(size.replace("T", "")),
      used: Number(used.replace("T", "")),
      available: Number(available.replace("T", "")),
      usedPercentage: Number(usedPercentage.replace("%", "")),
    });
  }
  return nodes;
}

function getViablePairs(input: string[]) {
  const nodes = getNodes(input);
  const viablePairs = [];
  for (const [name, node] of nodes.entries()) {
    if (node.used === 0) continue;
    for (const [name2, node2] of nodes.entries()) {
      if (name === name2) continue;
      if (node.used <= node2.available) {
        viablePairs.push([name, name2]);
      }
    }
  }
  return viablePairs.length;
}

function bfsToTarget(
  start: [number, number],
  target: [number, number],
  passable: Set<string>,
  goalKey: string,
  maxX: number,
  maxY: number
) {
  if (start[0] === target[0] && start[1] === target[1]) {
    return 0;
  }

  const coordKey = (x: number, y: number) => `${x},${y}`;
  const queue: Array<[number, number, number]> = [[start[0], start[1], 0]];
  let head = 0;
  const visited = new Set<string>([coordKey(start[0], start[1])]);

  const directions: Array<[number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (head < queue.length) {
    const [x, y, dist] = queue[head++];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || ny < 0 || nx > maxX || ny > maxY) continue;

      const neighborKey = `node-x${nx}-y${ny}`;
      if (neighborKey === goalKey) continue;

      if (!passable.has(neighborKey)) continue;

      const visitKey = coordKey(nx, ny);
      if (visited.has(visitKey)) continue;
      visited.add(visitKey);

      const nextDist = dist + 1;

      if (nx === target[0] && ny === target[1]) {
        return nextDist;
      }

      queue.push([nx, ny, nextDist]);
    }
  }

  return -1;
}

function findMinMovesToData(input: string[]) {
  const nodes = getNodes(input);

  let emptyKey = "";
  let goalKey = "";
  let goalX = -1;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [key, node] of nodes.entries()) {
    const [x, y] = node.position;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (node.used === 0) {
      emptyKey = key;
    }
    if (y === 0 && x > goalX) {
      goalX = x;
      goalKey = key;
    }
  }

  if (!emptyKey || !goalKey) {
    throw new Error("Unable to locate empty node or goal node in input");
  }

  if (goalX === 0) {
    return 0;
  }

  const emptyNode = nodes.get(emptyKey)!;
  const emptySize = emptyNode.size;

  const passable = new Set<string>();
  for (const [key, node] of nodes.entries()) {
    if (node.used <= emptySize || node.used === 0) {
      passable.add(key);
    }
  }
  passable.add(emptyKey);

  const target: [number, number] = [goalX - 1, 0];
  const start = [...emptyNode.position] as [number, number];

  const stepsToAdjacent = bfsToTarget(
    start,
    target,
    passable,
    goalKey,
    maxX,
    maxY
  );

  if (stepsToAdjacent === -1) {
    throw new Error(
      "Goal data is unreachable with the given node configuration"
    );
  }

  const movesToShiftGoal = 1 + 5 * (goalX - 1);

  return stepsToAdjacent + movesToShiftGoal;
}

console.log("Part 1:", getViablePairs(input));
console.log("Part 2:", findMinMovesToData(input));
