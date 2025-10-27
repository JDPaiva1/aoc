import { readFileSync } from "fs";

const input = readFileSync("./2017/07/example.txt", "utf-8").trim().split("\n");

type ProgramRecord = {
  weight: number;
  children: string[];
};

function parsePrograms(input: string[]) {
  const tree = new Map<string, ProgramRecord>();
  const allChildren = new Set<string>();

  for (const line of input) {
    const match = line.match(/^(\w+)\s+\((\d+)\)(?: -> (.*))?$/);
    if (!match) continue;

    const [, name, weight, childrenString] = match;
    const children = childrenString
      ? childrenString.split(", ").map((child) => child.trim())
      : ([] as string[]);

    tree.set(name, {
      weight: Number(weight),
      children,
    });

    for (const child of children) {
      allChildren.add(child);
    }
  }

  let root = "";
  for (const name of tree.keys()) {
    if (!allChildren.has(name)) {
      root = name;
      break;
    }
  }

  return { tree, root };
}

function getRoot(input: string[]) {
  return parsePrograms(input).root;
}

console.log("Part 1:", getRoot(input));
