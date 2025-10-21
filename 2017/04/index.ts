import { readFileSync } from "fs";

const passphraseList = readFileSync("2017/04/input.txt", "utf-8")
  .trim()
  .split("\n");

function getValidPassphrases(passphraseList: string[], isAnagram = false) {
  let validPassphrases = 0;
  for (const passphrase of passphraseList) {
    const words = passphrase.split(" ");
    if (isAnagram) {
      const sortedWords = words.map((word) => word.split("").sort().join(""));
      const uniqueSortedWords = new Set(sortedWords);
      if (sortedWords.length !== uniqueSortedWords.size) continue;
    } else {
      const uniqueWords = new Set(words);
      if (words.length !== uniqueWords.size) continue;
    }
    validPassphrases++;
  }
  return validPassphrases;
}

console.log("Part 1: " + getValidPassphrases(passphraseList));
console.log("Part 2: " + getValidPassphrases(passphraseList, true));
