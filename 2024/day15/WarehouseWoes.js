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
  boxOpen: "[",
  boxClosed: "]",
};
const input = fs.readFileSync("input.txt", "utf-8");

function getGridAndInstructions(input, isTwiceAsWide = false) {
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

      const row = [];
      if (isTwiceAsWide) {
        line.split("").forEach((char) => {
          if (char === symbol.robot) {
            row.push(symbol.robot);
            row.push(symbol.empty);
            return;
          }
          if (char === symbol.box) {
            row.push(symbol.boxOpen);
            row.push(symbol.boxClosed);
            return;
          }
          row.push(char);
          row.push(char);
        });

        if (row.includes(symbol.robot)) {
          robotPosition = [row.indexOf("@"), grid.length];
        }
      } else {
        row.push(...line.split(""));
      }
      grid.push(row);
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
      if (grid[y][x] === symbol.box || grid[y][x] === symbol.boxOpen) {
        boxes.push([x, y]);
      }
    }
  }
  return boxes.reduce((acc, [x, y]) => acc + (100 * y + x), 0);
}

function moveRobotBig(instruction, grid, robotPosition) {
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

  if (
    grid[newY][newX] === symbol.boxOpen ||
    grid[newY][newX] === symbol.boxClosed
  ) {
    const collectBoxes = (y, x, dirY, dirX, grid) => {
      // Normalize to left half
      if (grid[y][x] === symbol.boxClosed) {
        x -= 1;
      }

      const toVisit = [[y, x]];
      const visited = new Set();
      const boxes = [];

      while (toVisit.length > 0) {
        const [cy, cx] = toVisit.pop();
        const key = cy + "," + cx;
        if (visited.has(key)) continue;
        visited.add(key);

        boxes.push([cy, cx]); // store left half of box

        const left = [cy, cx];
        const right = [cy, cx + 1];

        const targets = [
          [left[0] + dirY, left[1] + dirX],
          [right[0] + dirY, right[1] + dirX],
        ];

        for (const [ty, tx] of targets) {
          if (
            grid[ty][tx] === symbol.boxOpen ||
            grid[ty][tx] === symbol.boxClosed
          ) {
            // normalize to left half
            const nx = grid[ty][tx] === symbol.boxClosed ? tx - 1 : tx;
            toVisit.push([ty, nx]);
          }
        }
      }

      return boxes;
    };

    const canMoveCluster = (boxes, dirY, dirX, grid) => {
      for (const [y, x] of boxes) {
        const leftTarget = [y + dirY, x + dirX];
        const rightTarget = [y + dirY, x + 1 + dirX];

        for (const [ty, tx] of [leftTarget, rightTarget]) {
          if (grid[ty][tx] === symbol.wall) return false;
        }
      }
      return true;
    };

    const moveCluster = (boxes, dirY, dirX, grid) => {
      // Sort so we move farthest first (avoid overwriting)
      boxes.sort((a, b) => {
        if (dirY !== 0) return dirY > 0 ? b[0] - a[0] : a[0] - b[0];
        if (dirX !== 0) return dirX > 0 ? b[1] - a[1] : a[1] - b[1];
      });

      for (const [y, x] of boxes) {
        // clear old
        grid[y][x] = symbol.empty;
        grid[y][x + 1] = symbol.empty;
      }

      for (const [y, x] of boxes) {
        grid[y + dirY][x + dirX] = symbol.boxOpen;
        grid[y + dirY][x + 1 + dirX] = symbol.boxClosed;
      }
    };

    const boxes = collectBoxes(newY, newX, directionY, directionX, grid);
    if (!canMoveCluster(boxes, directionY, directionX, grid)) {
      return robotPosition;
    }
    moveCluster(boxes, directionY, directionX, grid);
  }

  grid[robotY][robotX] = symbol.empty;
  grid[newY][newX] = symbol.robot;
  // console.log(instruction, robotPosition);
  // console.table(grid);
  return [newX, newY];
}

function followInstructionsBig() {
  let { grid, instructions, robotPosition } = getGridAndInstructions(
    input,
    true
  );
  // console.table(grid);
  // console.log(robotPosition);
  // console.log(instructions);
  for (const instruction of instructions) {
    robotPosition = moveRobotBig(instruction, grid, robotPosition);
  }
  // console.log(robotPosition);
  console.table(grid);
  return grid;
}

console.log(getGPSCoordinatesOfBoxes(followInstructions()));
console.log(getGPSCoordinatesOfBoxes(followInstructionsBig()));
