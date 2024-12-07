import fs from "fs";

const exampleMap = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

const inputMap = fs.readFileSync("input.txt", "utf-8");

const matrixMap = [];
inputMap.split(/\r?\n/).forEach((row) => matrixMap.push(row.split("")));

let guardPosition;
matrixMap.find((row, index) => {
  if (row.includes("^")) {
    guardPosition = [index, row.indexOf("^")];
  }
});

let totalDistinctPositions = 1;
function calDistinctPositions(nextPosition) {
  totalDistinctPositions += nextPosition === "." ? 1 : 0;
}

const marked = "X";
const move = {
  direction: "up",
  up: () => {
    matrixMap[guardPosition[0]][guardPosition[1]] = marked;
    guardPosition[0] -= 1;
    calDistinctPositions(matrixMap[guardPosition[0]][guardPosition[1]]);
    matrixMap[guardPosition[0]][guardPosition[1]] = "^";
    move.direction = "up";
  },
  down: () => {
    matrixMap[guardPosition[0]][guardPosition[1]] = marked;
    guardPosition[0] += 1;
    calDistinctPositions(matrixMap[guardPosition[0]][guardPosition[1]]);
    matrixMap[guardPosition[0]][guardPosition[1]] = "v";
    move.direction = "down";
  },
  right: () => {
    matrixMap[guardPosition[0]][guardPosition[1]] = marked;
    guardPosition[1] += 1;
    calDistinctPositions(matrixMap[guardPosition[0]][guardPosition[1]]);
    matrixMap[guardPosition[0]][guardPosition[1]] = ">";
    move.direction = "right";
  },
  left: () => {
    matrixMap[guardPosition[0]][guardPosition[1]] = marked;
    guardPosition[1] -= 1;
    calDistinctPositions(matrixMap[guardPosition[0]][guardPosition[1]]);
    matrixMap[guardPosition[0]][guardPosition[1]] = "<";
    move.direction = "left";
  },
};

const obstruction = "#";
const obstructionsPositions = [];
const obstructionsChosen = [];
function isObstructions(x, y) {
  obstructionsPositions.forEach(([positionX, positionsY], index) => {
    if (positionX === x) {
      if (move.direction === "up" && !obstructionsChosen.includes(`${positionX - 1},${y}`)) {
        obstructionsChosen.push(`${positionX - 1},${y}`);
      }
      if (move.direction === "down" && !obstructionsChosen.includes(`${positionX + 1},${y}`)) {
        obstructionsChosen.push(`${positionX + 1},${y}`);
      }
      obstructionsPositions.splice(index, 1);
    }
    if (positionsY === y) {
      if (move.direction === "right" && !obstructionsChosen.includes(`${x},${positionsY + 1}`)) {
        obstructionsChosen.push(`${x},${positionsY + 1}`);
      }
      if (move.direction === "left" && !obstructionsChosen.includes(`${x},${positionsY - 1}`)) {
        obstructionsChosen.push(`${x},${positionsY - 1}`);
      }
      obstructionsPositions.splice(index, 1);
    }
  });
  if (matrixMap[x][y] === obstruction) obstructionsPositions.push([x, y]);
  return matrixMap[x][y] === obstruction;
}

console.table(matrixMap);
console.log(guardPosition);

while (guardPosition[0] < matrixMap.length - 1 && guardPosition[1] < matrixMap[0].length - 1) {
  switch (move.direction) {
    case "up":
      if (isObstructions(guardPosition[0] - 1, guardPosition[1])) {
        move.direction = "right";
      } else {
        move.up();
      }
      break;
    case "down":
      if (isObstructions(guardPosition[0] + 1, guardPosition[1])) {
        move.direction = "left";
      } else {
        move.down();
      }
      break;
    case "right":
      if (isObstructions(guardPosition[0], guardPosition[1] + 1)) {
        move.direction = "down";
      } else {
        move.right();
      }
      break;
    case "left":
      if (isObstructions(guardPosition[0], guardPosition[1] - 1)) {
        move.direction = "up";
      } else {
        move.left();
      }
      break;
  }
}

// console.table(matrixMap);
console.log(guardPosition);
console.log("Distinct positions visited: ", totalDistinctPositions);
console.log("Posible obstruction: ", obstructionsChosen.length, obstructionsChosen);
