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

console.log("Part 1:", decompressedLength(input));
