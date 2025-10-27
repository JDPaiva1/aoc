import { readFileSync } from "fs";

const input = readFileSync("./2017/07/input.txt", "utf-8").trim().split("\n");

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

function getCorrectedWeight(input: string[]) {
  const { tree, root } = parsePrograms(input);
  const memo = new Map<string, number>();
  let correctedWeight: number | null = null;

  const computeTotal = (name: string): number => {
    if (memo.has(name)) {
      return memo.get(name)!;
    }

    const record = tree.get(name);
    if (!record) {
      throw new Error(`Unknown program: ${name}`);
    }

    const childTotals = record.children.map((child) => computeTotal(child));

    if (correctedWeight === null && childTotals.length > 0) {
      const totalsMap = new Map<number, string[]>();

      record.children.forEach((child, index) => {
        const total = childTotals[index];
        const current = totalsMap.get(total) ?? [];
        current.push(child);
        totalsMap.set(total, current);
      });

      if (totalsMap.size > 1) {
        let incorrectChild = "";
        let incorrectTotal = 0;
        let correctTotal = 0;

        for (const [total, names] of totalsMap.entries()) {
          if (names.length === 1) {
            incorrectChild = names[0];
            incorrectTotal = total;
          } else {
            correctTotal = total;
          }
        }

        if (incorrectChild && correctTotal !== incorrectTotal) {
          const childRecord = tree.get(incorrectChild);
          if (!childRecord) {
            throw new Error(`Unknown program: ${incorrectChild}`);
          }

          correctedWeight =
            childRecord.weight + (correctTotal - incorrectTotal);
        }
      }
    }

    const totalWeight =
      record.weight + childTotals.reduce((sum, value) => sum + value, 0);
    memo.set(name, totalWeight);
    return totalWeight;
  };

  computeTotal(root);

  if (correctedWeight === null) {
    throw new Error("Failed to determine corrected weight");
  }

  return correctedWeight;
}

console.log("Part 1:", getRoot(input));
console.log("Part 2:", getCorrectedWeight(input));
