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

function getTotalFencingCost(regions) {
  let totalCost = 0;
  regions.forEach((region) => {
    const letter = map[region[0][0]][region[0][1]];
    const area = getArea(region);
    const perimeter = getPerimeter(region);
    const cost = area * perimeter;
    console.log(
      `A region of ${letter} plants with price ${area} * ${perimeter} = ${cost}.`
    );
    totalCost += cost;
  });
  return totalCost;
}

console.log(getTotalFencingCost(getRegions(map)));
