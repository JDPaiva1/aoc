import fs from "fs";

const stonesArrangement = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split(" ")
  .map(Number);
// const stonesArrangement = "125 17".split(" ");

function applicateRules(stone) {
  if (stone === 0) {
    return [1];
  }

  const stoneStr = stone.toString();
  if (stoneStr.length % 2 === 0) {
    const halfLength = stoneStr.length / 2;
    return [
      parseInt(stoneStr.slice(0, halfLength)),
      parseInt(stoneStr.slice(halfLength)),
    ];
  }

  return [stone * 2024];
}

function blinking(numOfBlinks, stonesArrangement) {
  let newStonesArrangement = [...stonesArrangement];
  while (numOfBlinks > 0) {
    const tmpStonesArrangement = [];
    for (const stone of newStonesArrangement) {
      tmpStonesArrangement.push(...applicateRules(stone));
    }
    newStonesArrangement = tmpStonesArrangement;
    numOfBlinks--;
  }
  return newStonesArrangement.length;
}

function blinkingOptimized(numOfBlinks, stonesArrangement) {
  // Convert array to a Map that tracks count of each stone value
  let stoneCounts = new Map();
  for (const stone of stonesArrangement) {
    stoneCounts.set(stone, (stoneCounts.get(stone) || 0) + 1);
  }

  for (let blink = 0; blink < numOfBlinks; blink++) {
    const newStoneCounts = new Map();

    for (const [stone, count] of stoneCounts) {
      const transformedStones = applicateRules(stone);

      for (const newStone of transformedStones) {
        newStoneCounts.set(
          newStone,
          (newStoneCounts.get(newStone) || 0) + count
        );
      }
    }

    stoneCounts = newStoneCounts;
  }

  // Sum up all the counts to get total number of stones
  let totalStones = 0;
  for (const count of stoneCounts.values()) {
    totalStones += count;
  }

  return totalStones;
}

console.log("Part 1 (25 blinks):", blinking(25, stonesArrangement));
console.log("Part 2 (75 blinks):", blinkingOptimized(75, stonesArrangement));
