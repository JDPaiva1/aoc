import { readFileSync } from "fs";

const triangles = readFileSync("input.txt", "utf-8")
  .trim()
  .split("\n")
  .map((line) =>
    line
      .trim()
      .split(" ")
      .filter((item) => item.trim() !== "")
      .map(Number)
  );

function isValidTriangle(a: number, b: number, c: number) {
  return a + b > c && a + c > b && b + c > a;
}

function getValidTriangles(triangles: number[][]) {
  const validTriangles = triangles.filter((triangle) => {
    const [a, b, c] = triangle;
    return isValidTriangle(a, b, c);
  });
  return validTriangles.length;
}

function getValidTrianglesInColumns(triangles: number[][]) {
  const validTriangles = [];
  for (let i = 0; i < triangles.length - 2; i += 3) {
    const a = triangles[i];
    const b = triangles[i + 1];
    const c = triangles[i + 2];

    for (let j = 0; j < 3; j++) {
      if (isValidTriangle(a[j], b[j], c[j])) {
        validTriangles.push([a[j], b[j], c[j]]);
      }
    }
  }
  return validTriangles.length;
}

console.log("Part 1:", getValidTriangles(triangles));
console.log("Part 2:", getValidTrianglesInColumns(triangles));
