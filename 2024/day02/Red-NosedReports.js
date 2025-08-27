const exampleInput = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

function isAllIncreasing(line) {
  for (const i in line) {
    if (line[+i + 1]) {
      if (+line[i] > +line[+i + 1]) return false;
    }
  }
  return true;
}

function isAllDecreasing(line) {
  for (const i in line) {
    if (line[+i + 1]) {
      if (+line[i] < +line[+i + 1]) return false;
    }
  }
  return true;
}

function isSafe(line) {
  if (isAllIncreasing(line) || isAllDecreasing(line)) {
    for (const i in line) {
      if (line[+i + 1]) {
        const levelsDiffer = Math.abs(+line[i] - line[+i + 1]);
        if (!(levelsDiffer > 0 && levelsDiffer < 4)) return false;
      }
    }
    return true;
  }
}

function howManyAreSafe(input) {
  let safes = 0;
  input.split(/\r?\n/).forEach((line) => {
    const levels = line.split(" ");
    if (levels?.length > 1) {
      if (isSafe(levels)) {
        safes++;
      } else {
        for (let i = 0; i < levels.length; i++) {
          if (isSafe(levels.toSpliced(i, 1))) {
            safes++;
            break;
          }
        }
      }
    }
  });
  return safes;
}

function getInputFromFile() {
  const fs = require("node:fs");
  return (inputFile = fs.readFileSync("input.txt", "utf-8"));
}

// console.log(howManyAreSafe(exampleInput));
console.log(howManyAreSafe(getInputFromFile()));
