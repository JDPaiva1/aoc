import { readFileSync } from "fs";
import crypto from "crypto";

const input = readFileSync("input.txt", "utf8");

function getHash(input: string, index: number) {
  return crypto
    .createHash("md5")
    .update(input + index)
    .digest("hex");
}

function findPassword(input: string) {
  let index = 0;
  let hash = getHash(input, index);
  let password = "";

  while (!hash.startsWith("00000") || password.length < 8) {
    if (hash.startsWith("00000")) {
      password += hash[5];
    }
    hash = getHash(input, index);
    index++;
  }

  return password;
}

console.log("Part 1: ", findPassword(input));
