import fs from "fs";

const inputExample = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

const input = fs.readFileSync("input.txt", "utf-8");

const map = [];
const antennasPositions = {};
input.split(/\r?\n/).forEach((row, index) => {
  const columns = row.split("");
  if (columns.length) {
    columns.forEach((c, i) => {
      if (c.match(/[a-zA-Z0-9]/)) {
        const cPosition = [index, i];
        if (antennasPositions[c]) {
          antennasPositions[c].push(cPosition);
        } else {
          antennasPositions[c] = [cPosition];
        }
      }
    });
    map.push(columns);
  }
});

const antinodesPositions = [];
function addAntinode([antennaX, antennaY], [separationX, separationY]) {
  const maxX = map.length;
  const maxY = map[0].length;
  const [antinodeX, antinodeY] = [antennaX + separationX, antennaY + separationY];
  const isDuplicated = antinodesPositions.some(([px, py]) => px === antinodeX && py === antinodeY);
  if (!isDuplicated && antinodeX >= 0 && antinodeX < maxX && antinodeY >= 0 && antinodeY < maxY) {
    antinodesPositions.push([antinodeX, antinodeY]);
  }
}
const antinodesPositions2 = [];
function addAntinode2([antennaX, antennaY], [separationX, separationY]) {
  const maxX = map.length;
  const maxY = map[0].length;
  let [antinodeX, antinodeY] = [antennaX, antennaY];
  while (antinodeX >= 0 && antinodeX < maxX && antinodeY >= 0 && antinodeY < maxY) {
    let isDuplicated = antinodesPositions2.some(([px, py]) => px === antinodeX && py === antinodeY);
    if (!isDuplicated) {
      antinodesPositions2.push([antinodeX, antinodeY]);
    }
    [antinodeX, antinodeY] = [antinodeX + separationX, antinodeY + separationY];
  }
}

function findAntinodes(positions) {
  for (let i = 0; i < positions.length; i++) {
    const [antennaX, antennaY] = positions[i].map(Number);
    for (let j = 0; j < positions.length; j++) {
      if (positions[i].toString() !== positions[j].toString()) {
        const [x, y] = positions[j].map(Number);
        const [separationX, separationY] = [antennaX - x, antennaY - y];
        addAntinode([antennaX, antennaY], [separationX, separationY]);
        addAntinode2([antennaX, antennaY], [separationX, separationY]);
      }
    }
  }
}

for (const [antenna, positions] of Object.entries(antennasPositions)) {
  findAntinodes(positions);
}

// console.table(map);
console.log(antennasPositions);
console.log(`Part 1: ${antinodesPositions.length}`, antinodesPositions);
console.log(`Part 2: ${antinodesPositions2.length}`, antinodesPositions2);
