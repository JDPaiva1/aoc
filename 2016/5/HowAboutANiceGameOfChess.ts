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

function findPassword2(input: string) {
  let index = 0;
  let hash = getHash(input, index);
  const password: Record<string, string> = {};

  while (Object.keys(password).length < 8) {
    if (hash.startsWith("00000")) {
      const position = hash[5];
      if (position >= "0" && position <= "7" && !password[position]) {
        const char = hash[6];
        password[position] = char;
      }
    }
    hash = getHash(input, index);
    index++;
  }

  const sortedPassword = Object.keys(password)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => password[key])
    .join("");

  return sortedPassword;
}

console.log("Part 1: ", findPassword(input));
console.log("Part 2: ", findPassword2(input));
