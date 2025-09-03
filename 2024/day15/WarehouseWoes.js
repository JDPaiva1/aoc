import fs from "fs";

const symbol = {
  robot: "@",
  box: "O",
  wall: "#",
  empty: ".",
  left: "<",
  right: ">",
  up: "^",
  down: "v",
};
const input = fs.readFileSync("input.txt", "utf-8");

function getGridAndInstructions(input) {
  const grid = [];
  const instructions = [];
  let robotPosition = [0, 0];

  for (const line of input.split("\n")) {
    if (line.trim() === "") {
      continue;
    }

    if (
      line.includes(symbol.wall) ||
      line.includes(symbol.empty) ||
      line.includes(symbol.box) ||
      line.includes(symbol.robot)
    ) {
      if (line.includes(symbol.robot)) {
        robotPosition = [grid.length, line.indexOf("@")];
      }
      grid.push(line.split(""));
    }

    if (
      line.includes(symbol.left) ||
      line.includes(symbol.right) ||
      line.includes(symbol.up) ||
      line.includes(symbol.down)
    ) {
      instructions.push(...line.split(""));
    }
  }

  return { grid, instructions, robotPosition };
}

function moveRobot(instruction, grid, robotPosition) {
  const [robotX, robotY] = robotPosition;
  const directions = {
    [symbol.left]: [-1, 0],
    [symbol.right]: [1, 0],
    [symbol.up]: [0, -1],
    [symbol.down]: [0, 1],
  };
  const [directionX, directionY] = directions[instruction];
  const [newX, newY] = [robotX + directionX, robotY + directionY];

  if (grid[newY][newX] === symbol.wall) return robotPosition;

  if (grid[newY][newX] === symbol.box) {
    if (instruction === symbol.left || instruction === symbol.right) {
      for (let i = newX; i >= 0; i += directionX) {
        if (grid[newY][i] === symbol.wall) return robotPosition;
        if (grid[newY][i] === symbol.box) continue;

        grid[newY][i] = symbol.box;
        break;
      }
    }

    if (instruction === symbol.up || instruction === symbol.down) {
      for (let i = newY; i >= 0; i += directionY) {
        if (grid[i][newX] === symbol.wall) return robotPosition;
        if (grid[i][newX] === symbol.box) continue;

        grid[i][newX] = symbol.box;
        break;
      }
    }
  }

  grid[robotY][robotX] = symbol.empty;
  grid[newY][newX] = symbol.robot;
  return [newX, newY];
  // console.log(instruction, robotPosition);
  // console.table(grid);
}

function followInstructions() {
  let { grid, instructions, robotPosition } = getGridAndInstructions(input);
  // console.table(grid);
  // console.log(robotPosition);
  // console.log(instructions);
  for (const instruction of instructions) {
    robotPosition = moveRobot(instruction, grid, robotPosition);
  }
  console.table(grid);
  console.log(robotPosition);
  return grid;
}

function getGPSCoordinatesOfBoxes(grid) {
  const boxes = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === symbol.box) {
        boxes.push([x, y]);
      }
    }
  }
  return boxes.reduce((acc, [x, y]) => acc + (100 * y + x), 0);
}

console.log(getGPSCoordinatesOfBoxes(followInstructions()));
