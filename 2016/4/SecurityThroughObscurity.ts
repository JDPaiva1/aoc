import { readFileSync } from "fs";

const roomList = readFileSync("input.txt", "utf-8").trim().split("\n");

function getRealRooms(roomList: string[]) {
  let sum = 0;
  const realRooms: [string, number][] = [];

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
      realRooms.push([roomName.replace(`-${roomId}`, ""), Number(roomId)]);
    }
  }

  return { sum, realRooms };
}

function decryptRoomName(realRooms: [string, number][]) {
  const decryptedRooms = realRooms.map(([roomName, roomId]) => {
    return roomName
      .replace(/\-\d/g, "")
      .split("")
      .map((char) => {
        if (char === "-") return " ";
        return String.fromCharCode(
          ((char.charCodeAt(0) - 97 + roomId) % 26) + 97
        );
      })
      .concat(" ", roomId.toString())
      .join("");
  });

  return decryptedRooms.filter((room) => room.includes("north"));
}

const { sum, realRooms } = getRealRooms(roomList);
console.log("Part 1: ", sum);
console.log("Part 2: ", decryptRoomName(realRooms));
