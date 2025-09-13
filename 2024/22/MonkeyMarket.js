import fs from "fs";

// initial secret number of each buyer
const eachBuyerInitialSN = fs
  .readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n");

function findNextSecretNumber(initialSN) {
  let nextSN = initialSN;

  const mix = (a, b) => {
    return a ^ b;
  };
  const prune = (n) => {
    const modulo = 16777216;
    return ((n % modulo) + modulo) % modulo;
  };

  nextSN = prune(mix(nextSN, nextSN * 64));
  nextSN = prune(mix(nextSN, Math.floor(nextSN / 32)));
  nextSN = prune(mix(nextSN, nextSN * 2048));

  return nextSN;
}

function findSecretNumberOfEachBuyer(eachBuyerInitialSN, numOfIterations) {
  const secretNumbers = new Map();
  let total = 0;

  for (const initialSN of eachBuyerInitialSN) {
    let sn = initialSN;
    for (let i = 0; i < numOfIterations; i++) {
      sn = findNextSecretNumber(sn);
    }
    secretNumbers.set(initialSN, sn);
    total += sn;
  }

  // console.log(secretNumbers);
  return total;
}

console.log(findSecretNumberOfEachBuyer(eachBuyerInitialSN, 2000));
