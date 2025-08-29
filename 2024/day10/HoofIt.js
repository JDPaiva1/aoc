import fs from "fs";

const lines = fs.readFileSync("input.txt", "utf8").trim().split("\n");

const topographicMap = lines.map((row) => row.trim().split("").map(Number));

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function findTrailheads(topographicMap) {
  const trailheads = [];
  for (let i = 0; i < topographicMap.length; i++) {
    for (let j = 0; j < topographicMap[i].length; j++) {
      if (topographicMap[i][j] === 0) {
        trailheads.push([i, j]);
      }
    }
  }
  return trailheads;
}

function findNumberOfHikingTrails(topographicMap) {
  const trailheads = findTrailheads(topographicMap);
  let score = 0;

  for (const trailhead of trailheads) {
    const visited = new Set();
    const [x, y] = trailhead;
    const queue = [[x, y]];
    visited.add(`${x},${y}`);

    while (queue.length > 0) {
      const [currentX, currentY] = queue.shift();
      const currentHeight = topographicMap[currentX][currentY];

      if (currentHeight === 9) {
        score++;
        continue;
      }

      for (const [dx, dy] of directions) {
        const newX = currentX + dx;
        const newY = currentY + dy;
        if (
          newX < 0 ||
          newX >= topographicMap.length ||
          newY < 0 ||
          newY >= topographicMap[0].length ||
          visited.has(`${newX},${newY}`)
        ) {
          continue;
        }
        if (topographicMap[newX][newY] === currentHeight + 1) {
          queue.push([newX, newY]);
          visited.add(`${newX},${newY}`);
        }
      }
    }
  }

  return score;
}

const hikingTrails = findNumberOfHikingTrails(topographicMap);
console.log("Number of hiking trails:", hikingTrails);
