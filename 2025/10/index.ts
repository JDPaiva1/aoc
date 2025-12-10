import { readFileSync } from "fs";

type Machine = {
  lights: number;
  targetMask: number;
  buttonMasks: number[];
};

const input = readFileSync("./2025/10/input.txt", "utf8");

function parseInput(raw: string): Machine[] {
  return raw
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const indicator = line.match(/\[(.*?)\]/)?.[1]!;
      const lights = indicator.length;
      let targetMask = 0;
      for (let i = 0; i < indicator.length; i++) {
        if (indicator[i] === "#") {
          targetMask |= 1 << i;
        }
      }

      const buttonMasks: number[] = [];
      for (const match of line.matchAll(/\((\d+(?:,\d+)*)\)/g)) {
        const nums = match[1].split(",").map(Number);
        let mask = 0;
        for (const n of nums) {
          mask |= 1 << n;
        }
        buttonMasks.push(mask);
      }

      return { lights, targetMask, buttonMasks };
    });
}

function partOne(machines: Machine[]): number {
  const minPresses = (machine: Machine): number => {
    const { lights, targetMask, buttonMasks } = machine;
    if (targetMask === 0) return 0;

    const seen = new Int16Array(1 << lights).fill(-1);
    const queue = new Uint16Array(1 << lights);
    let head = 0;
    let tail = 0;

    seen[0] = 0;
    queue[tail++] = 0;

    while (head < tail) {
      const state = queue[head++];
      const steps = seen[state];
      for (const mask of buttonMasks) {
        const next = state ^ mask;
        if (seen[next] !== -1) continue;
        seen[next] = (steps as number) + 1;
        if (next === targetMask) {
          return seen[next];
        }
        queue[tail++] = next;
      }
    }

    return -1; // unreachable
  };
  return machines.reduce((sum, m) => sum + minPresses(m), 0);
}

type PartTwoMachine = {
  buttons: number[][];
  goals: number[];
};

function parseForPartTwo(raw: string): PartTwoMachine[] {
  return raw
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const buttons: number[][] = [];
      for (const match of line.matchAll(/\((\d+(?:,\d+)*)\)/g)) {
        buttons.push(match[1].split(",").map(Number));
      }

      const goalMatch = line.match(/\{(.*?)\}/);
      const goals = goalMatch?.[1]?.split(",").map(Number) ?? [];

      return { buttons, goals };
    });
}

function solveLinearSystem(A: number[][], b: number[]): number[] | null {
  // Solve Ax = b using Gaussian elimination with back-substitution
  // Returns null if no non-negative integer solution exists
  const n = A.length;
  const m = A[0].length;

  // Create augmented matrix [A|b]
  const aug: number[][] = A.map((row, i) => [...row, b[i]]);

  // Forward elimination with partial pivoting
  const pivotCols: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < m && pivotRow < n; col++) {
    // Find pivot
    let maxRow = pivotRow;
    for (let row = pivotRow + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) {
        maxRow = row;
      }
    }

    if (aug[maxRow][col] === 0) continue;

    // Swap rows
    [aug[pivotRow], aug[maxRow]] = [aug[maxRow], aug[pivotRow]];
    pivotCols.push(col);

    // Eliminate below
    for (let row = pivotRow + 1; row < n; row++) {
      if (aug[row][col] !== 0) {
        const factor = aug[row][col] / aug[pivotRow][col];
        for (let j = col; j <= m; j++) {
          aug[row][j] -= factor * aug[pivotRow][j];
        }
      }
    }
    pivotRow++;
  }

  // Check for inconsistent system (0 = non-zero)
  for (let row = pivotRow; row < n; row++) {
    if (Math.abs(aug[row][m]) > 1e-9) {
      return null;
    }
  }

  // Back substitution
  const numPivots = pivotCols.length;
  const freeVars = m - numPivots;

  if (freeVars === 0) {
    // Unique solution - back substitute
    const x = new Array(m).fill(0);
    for (let i = numPivots - 1; i >= 0; i--) {
      const col = pivotCols[i];
      let sum = aug[i][m];
      for (let j = col + 1; j < m; j++) {
        sum -= aug[i][j] * x[j];
      }
      x[col] = sum / aug[i][col];
    }

    // Check non-negative integers
    for (const val of x) {
      if (val < -1e-9 || Math.abs(val - Math.round(val)) > 1e-9) {
        return null;
      }
    }
    return x.map(Math.round);
  }

  // Multiple solutions - find minimum sum by trying free variable combinations
  const freeCols: number[] = [];
  const pivotSet = new Set(pivotCols);
  for (let col = 0; col < m; col++) {
    if (!pivotSet.has(col)) freeCols.push(col);
  }

  let bestSolution: number[] | null = null;
  let bestSum = Infinity;

  // Estimate upper bound for free variables
  const maxFreeVal = Math.max(...b) + 1;

  const tryFreeVars = (freeIdx: number, freeVals: number[]) => {
    if (freeIdx === freeCols.length) {
      // Solve for pivot variables
      const x = new Array(m).fill(0);
      for (let i = 0; i < freeCols.length; i++) {
        x[freeCols[i]] = freeVals[i];
      }

      for (let i = numPivots - 1; i >= 0; i--) {
        const col = pivotCols[i];
        let sum = aug[i][m];
        for (let j = col + 1; j < m; j++) {
          sum -= aug[i][j] * x[j];
        }
        x[col] = sum / aug[i][col];
      }

      // Check validity
      let valid = true;
      let total = 0;
      for (const val of x) {
        if (val < -1e-9 || Math.abs(val - Math.round(val)) > 1e-9) {
          valid = false;
          break;
        }
        total += Math.round(val);
      }

      if (valid && total < bestSum) {
        bestSum = total;
        bestSolution = x.map(Math.round);
      }
      return;
    }

    for (let v = 0; v <= maxFreeVal; v++) {
      freeVals[freeIdx] = v;
      tryFreeVars(freeIdx + 1, freeVals);
    }
  };

  tryFreeVars(0, new Array(freeCols.length).fill(0));
  return bestSolution;
}

function minPressesForMachine(goals: number[], buttons: number[][]): number {
  const n = goals.length;
  const m = buttons.length;

  // Build coverage matrix
  const cover: number[][] = Array.from({ length: n }, () => Array(m).fill(0));
  for (let col = 0; col < m; col++) {
    for (const idx of buttons[col]) {
      cover[idx][col] = 1;
    }
  }

  // For 2x2 case, use direct Cramer's rule (handles large numbers well)
  if (n === 2 && m === 2) {
    const a = cover[0][0],
      b = cover[0][1];
    const c = cover[1][0],
      d = cover[1][1];
    const e = goals[0],
      f = goals[1];

    const det = a * d - b * c;
    if (det !== 0) {
      const x = (e * d - b * f) / det;
      const y = (a * f - e * c) / det;

      if (x >= 0 && y >= 0 && Number.isInteger(x) && Number.isInteger(y)) {
        return x + y;
      }
      return -1;
    }
    // det === 0: fall through to general solver
  }

  // General case: Gaussian elimination
  const solution = solveLinearSystem(cover, goals);
  if (!solution) return -1;

  return solution.reduce((sum, val) => sum + val, 0);
}

function partTwo() {
  const machines = parseForPartTwo(input);
  let total = 0;
  for (const { buttons, goals } of machines) {
    const presses = minPressesForMachine(goals, buttons);
    if (presses >= 0) total += presses;
  }
  return total;
}

const machines = parseInput(input);
console.log("Part 1:", partOne(machines));
console.log("Part 2:", partTwo());
