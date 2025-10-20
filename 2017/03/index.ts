import { readFileSync } from "fs";

const number = Number(readFileSync("2017/03/input.txt", "utf8").trim());

function findShortestPath(number: number) {
  if (number === 1) return 0;

  const side = Math.ceil(Math.sqrt(number));
  const oddSide = side % 2 === 0 ? side + 1 : side;
  const ring = (oddSide - 1) / 2;

  const maxVal = oddSide ** 2;
  const step = oddSide - 1;
  const middles = [
    maxVal - ring,
    maxVal - step - ring,
    maxVal - 2 * step - ring,
    maxVal - 3 * step - ring,
  ];

  const nearest = middles.reduce((a, b) =>
    Math.abs(number - a) < Math.abs(number - b) ? a : b
  );

  return ring + Math.abs(number - nearest);
}

console.log("Part 1:", findShortestPath(number));
