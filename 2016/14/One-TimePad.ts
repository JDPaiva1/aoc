import { readFileSync } from "fs";
import crypto from "crypto";

const salt = readFileSync("input.txt", "utf-8").trim();

function getHash(salt: string, index: number) {
  return crypto
    .createHash("md5")
    .update(salt + index)
    .digest("hex");
}

function getHashStretched(salt: string, index: number) {
  let hash = getHash(salt, index);
  for (let i = 0; i < 2016; i++) {
    hash = crypto.createHash("md5").update(hash).digest("hex");
  }
  return hash;
}

function firstTripleChar(s: string) {
  const m = s.match(/(.)\1\1/s);
  return m ? m[1] : null;
}

function getIndex64(salt: string, keyStretching = false) {
  let index = 0;
  const possibleKeys: Map<number, string> = new Map();
  const keys: number[] = [];

  while (keys.length < 65) {
    const hash = keyStretching
      ? getHashStretched(salt, index)
      : getHash(salt, index);

    const tripleChar = firstTripleChar(hash);
    if (tripleChar) {
      possibleKeys.set(index, tripleChar);
    }

    for (const [i, char] of possibleKeys.entries()) {
      if (i === index) continue;

      if (1000 < index - i) {
        possibleKeys.delete(i);
        continue;
      }

      if (!hash.includes(char.repeat(5))) continue;

      keys.push(i);
      possibleKeys.delete(i);
    }

    index++;
  }

  keys.sort((a, b) => a - b);

  return keys[63];
}

console.log("Part 1:", getIndex64(salt));
console.log("Part 2:", getIndex64(salt, true));
