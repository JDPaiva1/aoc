import { readFileSync } from "fs";

const operations = readFileSync("input.txt", "utf-8").trim().split("\n");

function executeOperations(operations: string[]) {
  const screen = Array.from({ length: 6 }, () =>
    Array.from({ length: 50 }, () => ".")
  );

  for (const operation of operations) {
    if (operation.trim() === "") continue;
    const [operationType, operationValue, a, _, b] = operation.split(" ");

    if (operationType.startsWith("rect")) {
      const [width, height] = operationValue.split("x").map(Number);
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          screen[i][j] = "#";
        }
      }
    }

    if (operationType.startsWith("rotate")) {
      if (operationValue.startsWith("row")) {
        const [_, rowA] = a.split("=").map(Number);
        const rowIndex = rowA;
        for (let i = 0; i < Number(b); i++) {
          const row = screen[rowIndex].pop();
          screen[rowIndex].unshift(row ?? "");
        }
      }

      if (operationValue.startsWith("column")) {
        const [_, columnA] = a.split("=").map(Number);
        const columnIndex = columnA;
        for (let i = 0; i < Number(b); i++) {
          let prevColumn = screen[screen.length - 1][columnIndex];
          screen.forEach((row) => {
            const temp = row[columnIndex];
            row[columnIndex] = prevColumn;
            prevColumn = temp;
          });
        }
      }
    }

    // console.log(operation);
    // console.table(screen);
  }

  // console.table(screen);
  return screen.flat().filter((pixel) => pixel === "#").length;
}

console.table(executeOperations(operations));
