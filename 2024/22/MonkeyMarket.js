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

function findMostBananasToGet(eachBuyerInitialSN, numOfIterations) {
  const sequenceTotals = new Map();

  for (const initial of eachBuyerInitialSN) {
    let sn = Number(initial);
    let prevPrice = sn % 10;
    const lastDiffs = [];
    const firstSeenForBuyer = new Map();

    for (let step = 1; step <= numOfIterations; step++) {
      sn = findNextSecretNumber(sn);
      const price = sn % 10;
      const diff = price - prevPrice;
      lastDiffs.push(diff);
      if (lastDiffs.length > 4) lastDiffs.shift();
      if (lastDiffs.length === 4) {
        const key = `${lastDiffs[0]},${lastDiffs[1]},${lastDiffs[2]},${lastDiffs[3]}`;
        if (!firstSeenForBuyer.has(key)) {
          firstSeenForBuyer.set(key, price);
        }
      }
      prevPrice = price;
    }

    for (const [seq, price] of firstSeenForBuyer.entries()) {
      sequenceTotals.set(seq, (sequenceTotals.get(seq) || 0) + price);
    }
  }

  let bestTotal = 0;
  for (const total of sequenceTotals.values()) {
    if (total > bestTotal) bestTotal = total;
  }
  return bestTotal;
}

console.log(findSecretNumberOfEachBuyer(eachBuyerInitialSN, 2000));
console.log(findMostBananasToGet(eachBuyerInitialSN, 2000));
