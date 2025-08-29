import fs from "fs";

const lines = fs.readFileSync("input.txt", "utf8").trim().split("\n");

const topographicMap = lines.map((row) => row.trim().split("").map(Number));

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

function findHikingTrails(topographicMap, isRating = false) {
  const trailheads = findTrailheads(topographicMap);
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  let numHeightsReached = 0;

  for (const trailhead of trailheads) {
    const visited = new Set();
    const [x, y] = trailhead;
    const queue = [[x, y]];
    visited.add(`${x},${y}`);

    while (queue.length > 0) {
      const [currentX, currentY] = queue.shift();
      const currentHeight = topographicMap[currentX][currentY];

      if (currentHeight === 9) {
        numHeightsReached++;
        continue;
      }

      for (const [dx, dy] of directions) {
        const newX = currentX + dx;
        const newY = currentY + dy;
        if (
          newX < 0 ||
          newX >= topographicMap.length ||
          newY < 0 ||
          newY >= topographicMap[0].length
        ) {
          continue;
        }

        if (visited.has(`${newX},${newY}`) && !isRating) {
          continue;
        }

        if (topographicMap[newX][newY] === currentHeight + 1) {
          queue.push([newX, newY]);
          visited.add(`${newX},${newY}`);
        }
      }
    }
  }

  return numHeightsReached;
}

const scopesOfTrails = findHikingTrails(topographicMap);
console.log("Scores of all trailheads:", scopesOfTrails);

const ratingOfTrails = findHikingTrails(topographicMap, true);
console.log("Rating of hiking trails:", ratingOfTrails);
