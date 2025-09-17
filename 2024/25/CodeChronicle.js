import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8");

function schematicToHeights(schematic) {
  const heights = new Array(5).fill(0);

  for (let i = 1; i < schematic.length - 1; i++) {
    const row = schematic[i];

    for (let j = 0; j < row.length; j++) {
      const cell = row[j];

      if (cell === ".") continue;

      heights[j]++;
    }
  }

  return heights;
}

function getSchematics(input) {
  const locksToHeights = [];
  const keysToHeights = [];
  let currentSchematic = [];
  for (const line of input.split("\n")) {
    if (line.trim() === "") continue;

    currentSchematic.push(line.split(""));

    if (currentSchematic.length === 7) {
      if (currentSchematic[0].includes(".")) {
        keysToHeights.push(schematicToHeights(currentSchematic));
      } else {
        locksToHeights.push(schematicToHeights(currentSchematic));
      }
      currentSchematic = [];
    }
  }
  return { locksToHeights, keysToHeights };
}

function findUniqueLockKeyPairs() {
  const { locksToHeights, keysToHeights } = getSchematics(input);

  let uniqueLockKeyPairs = 0;

  for (const lock of locksToHeights) {
    for (const key of keysToHeights) {
      if (lock.every((height, index) => height + key[index] <= 5)) {
        uniqueLockKeyPairs++;
      }
    }
  }

  return uniqueLockKeyPairs;
}

console.log(findUniqueLockKeyPairs());
