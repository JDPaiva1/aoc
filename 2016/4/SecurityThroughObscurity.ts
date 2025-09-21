import { readFileSync } from "fs";

const roomList = readFileSync("example.txt", "utf-8").trim().split("\n");

function sumRealRoomsIds(roomList: string[]) {
  let sum = 0;

  for (const room of roomList) {
    const [roomName, checksum] = room.trim().replace("]", "").split("[");
    const commonChars = new Map<string, number>();

    for (const char of roomName) {
      if (char === "-" || !isNaN(Number(char))) continue;

      if (commonChars.has(char)) {
        commonChars.set(char, commonChars.get(char)! + 1);
      } else {
        commonChars.set(char, 1);
      }
    }

    const sortedCommonChars = Array.from(commonChars.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([char]) => char)
      .slice(0, 5);

    if (sortedCommonChars.join("") === checksum) {
      const roomId = roomName.match(/\d+/g)?.[0];
      sum += Number(roomId);
    }
  }

  return sum;
}

console.log("Part 1: ", sumRealRoomsIds(roomList));
