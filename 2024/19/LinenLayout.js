import fs from "fs";

const input = fs.readFileSync("input.txt", "utf-8");
const example = fs.readFileSync("example.txt", "utf-8");

function getTowelPatternsAndDesiredDesigns(input) {
  const towelPatterns = [];
  let desiredDesigns = [];
  input
    .trim()
    .split("\n")
    .forEach((line) => {
      if (line.trim() === "") {
        return;
      }
      if (line.includes(",")) {
        towelPatterns.push(...line.split(", "));
      } else {
        desiredDesigns.push(line);
      }
    });
  return { towelPatterns, desiredDesigns };
}

function getNumOfPossibleDesigns(towelPatterns, desiredDesigns) {
  let numOfPossibleDesigns = 0;
  const memo = new Map();

  const findDesign = (design) => {
    if (design === "") return true;
    if (memo.has(design)) return memo.get(design);

    for (const pattern of towelPatterns) {
      if (design.startsWith(pattern)) {
        const remainder = design.slice(pattern.length);
        if (findDesign(remainder)) {
          memo.set(design, true);
          return true;
        }
      }
    }

    memo.set(design, false);
    return false;
  };

  for (const desiredDesign of desiredDesigns) {
    if (findDesign(desiredDesign)) {
      numOfPossibleDesigns++;
    }
  }

  return numOfPossibleDesigns;
}

const { towelPatterns, desiredDesigns } =
  getTowelPatternsAndDesiredDesigns(input);
console.log(getNumOfPossibleDesigns(towelPatterns, desiredDesigns));
