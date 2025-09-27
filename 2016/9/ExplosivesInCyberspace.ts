import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8").trim().split("\n");

function decompressedLength(fileContent: string[]) {
  const decompressed: string[] = [];
  let totalLength = 0;

  const decompress = (line: string) => {
    const regex = /\((\d+)x(\d+)\)/;
    const match = line.match(regex);
    if (match) {
      const [marker, length, times] = match;
      let strDecompressed = line.slice(0, match.index!);
      let toRepeat = line.slice(match.index! + marker.length);
      const repeat = toRepeat.slice(0, Number(length)).repeat(Number(times));
      strDecompressed += repeat;
      toRepeat = decompress(toRepeat.slice(Number(length)));
      return strDecompressed + toRepeat;
    }
    return line;
  };

  for (const line of fileContent) {
    const tmpDecompressed = decompress(line);
    totalLength += tmpDecompressed.length;
    decompressed.push(tmpDecompressed);
  }

  return totalLength;
}

function decompressedLengthPart2(fileContent: string[]) {
  let totalLength = 0;

  const decompress = (line: string) => {
    const regex = /\((\d+)x(\d+)\)/;
    const match = line.match(regex);
    if (!match) return line.length;

    let strLength = line.slice(0, match.index!).length;
    const [marker, lengthStr, timesStr] = match;
    const length = Number(lengthStr);
    const times = Number(timesStr);

    const markerEnd = match.index! + marker.length;
    const strToRepeat = line.slice(markerEnd, markerEnd + length);
    const strEnd = line.slice(markerEnd + length);

    strLength += decompress(strToRepeat) * times;

    if (strEnd.length > 0) {
      strLength += decompress(strEnd);
    }

    return strLength;
  };

  for (const line of fileContent) {
    totalLength += decompress(line);
  }

  return totalLength;
}

console.log("Part 1:", decompressedLength(input));
console.log("Part 2:", decompressedLengthPart2(input));
