import fs from "fs";

const inputFile = fs.readFileSync("input.txt", "utf-8");
const wordsearch = [];

inputFile.split(/\r?\n/).forEach((line) => {
  wordsearch.push(line.split(""));
});

let xmasFound = 0,
  xMasFound = 0;

function xmasSearch(i, j) {
  if (wordsearch[i][j] === "X") {
    if (wordsearch[i]?.[j + 1] === "M" && wordsearch[i]?.[j + 2] === "A" && wordsearch[i]?.[j + 3] === "S") {
      xmasFound++;
    }
    if (wordsearch[i]?.[j - 1] === "M" && wordsearch[i]?.[j - 2] === "A" && wordsearch[i]?.[j - 3] === "S") {
      xmasFound++;
    }
    if (wordsearch[i + 1]?.[j] === "M" && wordsearch[i + 2]?.[j] === "A" && wordsearch[i + 3]?.[j] === "S") {
      xmasFound++;
    }
    if (wordsearch[i - 1]?.[j] === "M" && wordsearch[i - 2]?.[j] === "A" && wordsearch[i - 3]?.[j] === "S") {
      xmasFound++;
    }
    if (wordsearch[i + 1]?.[j + 1] === "M" && wordsearch[i + 2]?.[j + 2] === "A" && wordsearch[i + 3]?.[j + 3] === "S") {
      xmasFound++;
    }
    if (wordsearch[i + 1]?.[j - 1] === "M" && wordsearch[i + 2]?.[j - 2] === "A" && wordsearch[i + 3]?.[j - 3] === "S") {
      xmasFound++;
    }
    if (wordsearch[i - 1]?.[j + 1] === "M" && wordsearch[i - 2]?.[j + 2] === "A" && wordsearch[i - 3]?.[j + 3] === "S") {
      xmasFound++;
    }
    if (wordsearch[i - 1]?.[j - 1] === "M" && wordsearch[i - 2]?.[j - 2] === "A" && wordsearch[i - 3]?.[j - 3] === "S") {
      xmasFound++;
    }
  }
}

function xMasSearch(i, j) {
  if (wordsearch[i][j] === "A") {
    const topLeft = wordsearch[i - 1]?.[j - 1] === "M" && wordsearch[i + 1]?.[j + 1] === "S",
      topRight = wordsearch[i - 1]?.[j + 1] === "M" && wordsearch[i + 1]?.[j - 1] === "S",
      bottomLeft = wordsearch[i + 1]?.[j - 1] === "M" && wordsearch[i - 1]?.[j + 1] === "S",
      bottomRight = wordsearch[i + 1]?.[j + 1] === "M" && wordsearch[i - 1]?.[j - 1] === "S";

    if ((topLeft && topRight) || (topLeft && bottomLeft) || (bottomRight && bottomLeft) || (bottomRight && topRight)) {
      xMasFound++;
    }
  }
}

for (let i = 0; i < wordsearch.length; i++) {
  for (let j = 0; j < wordsearch[i].length; j++) {
    xmasSearch(i, j);
    xMasSearch(i, j);
  }
}

console.log("XMAS found: ", xmasFound);
console.log("X-MAS found: ", xMasFound);
