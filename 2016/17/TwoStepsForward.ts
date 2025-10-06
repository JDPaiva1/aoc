import { readFileSync } from "fs";
import crypto from "crypto";

const passcode = readFileSync("input.txt", "utf-8").trim();

const dirs = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
};

function getOpenDoors(passcode: string, path: string) {
  const hex = crypto
    .createHash("md5")
    .update(passcode + path)
    .digest("hex")
    .slice(0, 4)
    .split("");
  const openDoors: Array<keyof typeof dirs> = [];
  hex.forEach((char, index) => {
    if (!isNaN(Number(char)) || char === "a") return;
    if (index === 0) openDoors.push("U");
    if (index === 1) openDoors.push("D");
    if (index === 2) openDoors.push("L");
    if (index === 3) openDoors.push("R");
  });
  return openDoors;
}

function getPath(passcode: string) {
  const queue: Array<[[number, number], string]> = [[[1, 1], ""]];

  while (queue.length > 0) {
    const [[x, y], path] = queue.shift()!;
    if (x === 4 && y === 4) return path;

    const openDoors = getOpenDoors(passcode, path);
    for (const dir of openDoors) {
      const [dx, dy] = dirs[dir];
      const [nx, ny] = [x + dx, y + dy];
      if (nx <= 0 || ny <= 0 || nx > 4 || ny > 4) continue;
      queue.push([[nx, ny], path + dir]);
    }

    queue.sort((a, b) => a[1].length - b[1].length);
  }
}

console.log("Part 1:", getPath(passcode));
