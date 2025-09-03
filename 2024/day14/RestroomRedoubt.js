import fs from "fs";

const robotList = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map((line) => {
    let [p, v] = line.split(" ");
    p = p.replace("p=", "");
    v = v.replace("v=", "");
    return [p.split(",").map(Number), v.split(",").map(Number)];
  });
const wide = 101;
const tall = 103;
// const wide = 11;
// const tall = 7;
const space = new Array(tall).fill(0).map(() => new Array(wide).fill(0));

function initRobots() {
  for (const robot of robotList) {
    const [x, y] = robot[0];
    space[y][x] += 1;
    continue;
  }
}
initRobots();

function moveRobots() {
  for (const robot of robotList) {
    const [p, v] = robot;
    const [x, y] = p;
    const [vx, vy] = v;

    let [newX, newY] = [x + vx, y + vy];
    if (newX < 0) {
      newX = wide + newX;
    }
    if (newY < 0) {
      newY = tall + newY;
    }
    if (newX >= wide) {
      newX = newX - wide;
    }
    if (newY >= tall) {
      newY = newY - tall;
    }

    space[y][x] -= 1;
    space[newY][newX] += 1;
    robot[0] = [newX, newY];
  }
}

function simulateRobots(seconds) {
  for (let i = 0; i < seconds; i++) {
    moveRobots();
  }
}

function getSafetyFactor() {
  const xMiddle = Math.floor(wide / 2);
  const yMiddle = Math.floor(tall / 2);
  const quadrants = [0, 0, 0, 0];

  for (const robot of robotList) {
    const [x, y] = robot[0];
    if (x === xMiddle || y === yMiddle) continue;

    if (x < xMiddle && y < yMiddle) {
      quadrants[0]++;
    } else if (x > xMiddle && y < yMiddle) {
      quadrants[1]++;
    } else if (x < xMiddle && y > yMiddle) {
      quadrants[2]++;
    } else {
      quadrants[3]++;
    }
  }
  return quadrants.reduce((a, b) => a * b, 1);
}

simulateRobots(100);
// console.table(space.map((row) => row.map((cell) => cell || ".")));
console.log(getSafetyFactor());
