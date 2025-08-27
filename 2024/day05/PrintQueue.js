import fs from "fs";

// 97 75 47 61 53 29 13
const inputExample = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

const inputFile = fs.readFileSync("input.txt", "utf-8");

const orderingRules = {};
const pagesToProduce = [];

inputFile.split(/\r?\n/).forEach((line) => {
  const rule = line.match(/(\d+\|\d+)/);
  if (rule) {
    const [page, subRule] = rule[0].split("|");

    if (orderingRules[page]) {
      orderingRules[page].push(subRule);
    } else {
      orderingRules[page] = [subRule];
    }
  } else if (line !== "") {
    pagesToProduce.push(line.split(","));
  }
});

let totalCorrectMiddlePage = 0;
let totalIncorrectMiddlePage = 0;

function addMiddlePageNumber(pages, isUpdated) {
  const midLength = Math.floor(pages.length / 2);
  const middlePageNumber = parseInt(pages[midLength], 10);
  if (isUpdated) {
    totalIncorrectMiddlePage += middlePageNumber;
  } else {
    totalCorrectMiddlePage += middlePageNumber;
  }
}

function sortPages(pages) {
  let isUpdated = false;
  for (let i = 0; i < pages.length - 1; i++) {
    let min_idx = i;
    for (let j = i + 1; j < pages.length; j++) {
      if (orderingRules[pages[j]]?.includes(pages[min_idx])) {
        min_idx = j;
        isUpdated = true;
      }
    }
    let temp = pages[i];
    pages[i] = pages[min_idx];
    pages[min_idx] = temp;
  }

  addMiddlePageNumber(pages, isUpdated);
  return pages;
}

pagesToProduce.forEach((update) => {
  update = sortPages(update);
  console.log(update);
});

console.log("Add up the middle page number: ", totalCorrectMiddlePage);
console.log("Incorrectly-ordered updates: ", totalIncorrectMiddlePage);
