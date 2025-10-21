import { readFileSync } from "fs";

const passphraseList = readFileSync("2017/04/input.txt", "utf-8")
  .trim()
  .split("\n");

function getValidPassphrases(passphraseList: string[]) {
  let validPassphrases = 0;
  for (const passphrase of passphraseList) {
    const words = passphrase.split(" ");
    const uniqueWords = new Set(words);
    if (words.length !== uniqueWords.size) continue;
    validPassphrases++;
  }
  return validPassphrases;
}

console.log("Part 1: " + getValidPassphrases(passphraseList));
