import { readFileSync } from "fs";

const triangles = readFileSync("input.txt", "utf-8").trim().split("\n");

function isValidTriangle(a: number, b: number, c: number) {
  return a + b > c && a + c > b && b + c > a;
}

function getValidTriangles(triangles: string[]) {
  const validTriangles = triangles.filter((triangle) => {
    const [a, b, c] = triangle.trim().split("  ").map(Number);
    return isValidTriangle(a, b, c);
  });
  return validTriangles.length;
}
console.log("Part 1:", getValidTriangles(triangles));
