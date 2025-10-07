import { readFileSync } from "fs";

const startingRow = readFileSync("input.txt", "utf-8").trim();

function getSafeTiles(startingRow: string, rows: number) {
  const isTrap = (row: string, index: number) => {
    const left = row[index - 1] ?? ".";
    const center = row[index] ?? ".";
    const right = row[index + 1] ?? ".";
    if (
      (left === "^" && center === "^" && right === ".") ||
      (left === "." && center === "^" && right === "^") ||
      (left === "^" && center === "." && right === ".") ||
      (left === "." && center === "." && right === "^")
    ) {
      return true;
    }
    return false;
  };

  const grid = [startingRow];
  let safeTiles = startingRow.match(/\./g)?.length ?? 0;

  for (let i = 0; i < rows - 1; i++) {
    const row = grid[i];
    let newRow = "";
    for (let j = 0; j < row.length; j++) {
      if (isTrap(row, j)) {
        newRow += "^";
        continue;
      }
      newRow += ".";
      safeTiles++;
    }
    grid.push(newRow);
  }
  return safeTiles;
}

console.log("Part 1:", getSafeTiles(startingRow, 40));
