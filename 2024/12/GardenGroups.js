import fs from "fs";

const map = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map((row) => row.split(""));

function getRegions(map) {
  const regions = [];
  const visited = new Set();

  const rows = map.length;
  const cols = map[0].length;

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (visited.has(`${x},${y}`)) continue;

      const letter = map[x][y];
      const queue = [[x, y]];
      const region = [];

      while (queue.length > 0) {
        const [cx, cy] = queue.shift();
        if (visited.has(`${cx},${cy}`)) continue;
        if (map[cx][cy] !== letter) continue;

        visited.add(`${cx},${cy}`);
        region.push([cx, cy]);

        // neighbors: up, down, left, right
        const neighbors = [
          [cx - 1, cy],
          [cx + 1, cy],
          [cx, cy - 1],
          [cx, cy + 1],
        ];
        for (const [nx, ny] of neighbors) {
          if (nx < 0 || nx >= rows || ny < 0 || ny >= cols) continue;
          if (visited.has(`${nx},${ny}`) || map[nx][ny] !== letter) continue;

          queue.push([nx, ny]);
        }
      }

      regions.push(region);
    }
  }

  return regions;
}

function getArea(region) {
  return region.length;
}

function getPerimeter(region) {
  const letter = map[region[0][0]][region[0][1]];
  let perimeter = 0;

  for (const [x, y] of region) {
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (
        nx < 0 ||
        nx >= map.length ||
        ny < 0 ||
        ny >= map[0].length ||
        map?.[nx]?.[ny] !== letter
      ) {
        perimeter++;
      }
    }
  }
  return perimeter;
}

function getSides(region) {
  const regionSet = new Set(region.map(([x, y]) => `${x},${y}`));

  const horizontalFences = new Map();
  const verticalFences = new Map();

  for (const [x, y] of region) {
    if (x === 0 || !regionSet.has(`${x - 1},${y}`)) {
      if (!horizontalFences.has(`top-${x}`)) {
        horizontalFences.set(`top-${x}`, new Set());
      }
      horizontalFences.get(`top-${x}`).add(y);
    }

    if (x === map.length - 1 || !regionSet.has(`${x + 1},${y}`)) {
      if (!horizontalFences.has(`bottom-${x}`)) {
        horizontalFences.set(`bottom-${x}`, new Set());
      }
      horizontalFences.get(`bottom-${x}`).add(y);
    }

    if (y === 0 || !regionSet.has(`${x},${y - 1}`)) {
      if (!verticalFences.has(`left-${y}`)) {
        verticalFences.set(`left-${y}`, new Set());
      }
      verticalFences.get(`left-${y}`).add(x);
    }

    if (y === map[0].length - 1 || !regionSet.has(`${x},${y + 1}`)) {
      if (!verticalFences.has(`right-${y}`)) {
        verticalFences.set(`right-${y}`, new Set());
      }
      verticalFences.get(`right-${y}`).add(x);
    }
  }

  let sides = 0;

  for (const [fenceKey, columns] of horizontalFences) {
    const sortedCols = Array.from(columns).sort((a, b) => a - b);
    let segments = 1;

    for (let i = 1; i < sortedCols.length; i++) {
      if (sortedCols[i] - sortedCols[i - 1] > 1) {
        segments++;
      }
    }
    sides += segments;
  }

  for (const [fenceKey, rows] of verticalFences) {
    const sortedRows = Array.from(rows).sort((a, b) => a - b);
    let segments = 1;

    for (let i = 1; i < sortedRows.length; i++) {
      if (sortedRows[i] - sortedRows[i - 1] > 1) {
        segments++;
      }
    }
    sides += segments;
  }

  return sides;
}

function getTotalFencingCost(regions, isBulk = false) {
  let totalCost = 0;
  regions.forEach((region) => {
    const letter = map[region[0][0]][region[0][1]];
    const area = getArea(region);
    const calc = isBulk ? getSides(region) : getPerimeter(region);
    const cost = area * calc;
    console.log(
      `A region of ${letter} plants with price ${area} * ${calc} = ${cost}.`
    );
    totalCost += cost;
  });
  return totalCost;
}

// console.log(getTotalFencingCost(getRegions(map)));
console.log(getTotalFencingCost(getRegions(map), true));
