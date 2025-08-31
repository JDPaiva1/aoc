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

console.log("Part 1 (25 blinks):", blinking(25, stonesArrangement));
