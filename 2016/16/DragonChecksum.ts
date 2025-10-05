import { readFileSync } from "fs";

const initialState = readFileSync("input.txt", "utf-8").trim();

function getCorrectChecksum(initialState: string, diskLength: number) {
  const getDragonCurve = (initialState: string, diskLength: number) => {
    let a = initialState;
    while (a.length < diskLength) {
      const b = a.split("").reverse().join("");
      const c = b.replace(/0/g, "2").replace(/1/g, "0").replace(/2/g, "1");
      a = a + "0" + c;
    }
    return a.slice(0, diskLength);
  };

  const getChecksum = (characters: string, diskLength: number) => {
    let checksum = characters;
    do {
      const pairs = checksum.match(/.{2}/g) ?? [];
      checksum = pairs
        .map((pair) => (pair[0] === pair[1] ? "1" : "0"))
        .join("");
    } while (checksum.length < diskLength && checksum.length % 2 === 0);
    return checksum;
  };

  return getChecksum(getDragonCurve(initialState, diskLength), diskLength);
}

console.log("Part 1:", getCorrectChecksum(initialState, 272));
