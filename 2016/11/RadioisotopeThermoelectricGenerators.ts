import { readFileSync } from "fs";

const input = readFileSync("example.txt", "utf-8");

type PairFloors = [generatorFloor: number, microchipFloor: number];

type State = {
  elevatorFloor: number;
  pairs: PairFloors[];
};

function parseInputToState(input: string): State {
  const lines = input.trim().split("\n");
  const elementToIndex: Map<string, number> = new Map();
  const pairs: PairFloors[] = [];

  const ensurePairForElement = (element: string): number => {
    if (!elementToIndex.has(element)) {
      const newIndex = pairs.length;
      elementToIndex.set(element, newIndex);
      pairs.push([-1, -1]);
    }
    return elementToIndex.get(element)!;
  };

  const itemRegex = /(\w+)(?:-compatible)?\s+(generator|microchip)/g;

  for (let floorIndex = 0; floorIndex < lines.length; floorIndex++) {
    const line = lines[floorIndex];
    if (!line || line.includes("nothing relevant")) continue;

    let match: RegExpExecArray | null;
    while ((match = itemRegex.exec(line)) !== null) {
      const [, element, kind] = match;
      const pairIndex = ensurePairForElement(element);
      if (kind === "generator") {
        pairs[pairIndex][0] = floorIndex;
      } else {
        pairs[pairIndex][1] = floorIndex;
      }
    }
  }

  // Sanity: any uninitialized floors default to first floor (0)
  for (const pair of pairs) {
    if (pair[0] < 0) pair[0] = 0;
    if (pair[1] < 0) pair[1] = 0;
  }

  return { elevatorFloor: 0, pairs };
}

function cloneState(state: State): State {
  return {
    elevatorFloor: state.elevatorFloor,
    pairs: state.pairs.map(([g, m]) => [g, m]),
  };
}

function isGoalState(state: State): boolean {
  for (const [generatorFloor, microchipFloor] of state.pairs) {
    if (generatorFloor !== 3 || microchipFloor !== 3) return false;
  }
  return state.elevatorFloor === 3;
}

function hasAnyItemsBelow(state: State, floor: number): boolean {
  for (const [g, m] of state.pairs) {
    if (g < floor || m < floor) return true;
  }
  return false;
}

function isStateValid(state: State): boolean {
  // Elevator must be on a valid floor
  if (state.elevatorFloor < 0 || state.elevatorFloor > 3) return false;

  // All items must be on valid floors
  for (const [g, m] of state.pairs) {
    if (g < 0 || g > 3 || m < 0 || m > 3) return false;
  }

  // For each floor, if there is any generator present, then any microchip on
  // that floor must have its corresponding generator on the same floor.
  for (let floor = 0; floor < 4; floor++) {
    let hasGeneratorOnFloor = false;
    for (const [g] of state.pairs) {
      if (g === floor) {
        hasGeneratorOnFloor = true;
        break;
      }
    }
    if (!hasGeneratorOnFloor) continue;

    for (let i = 0; i < state.pairs.length; i++) {
      const [g, m] = state.pairs[i];
      if (m === floor && g !== floor) {
        return false;
      }
    }
  }

  return true;
}

function canonicalKey(state: State): string {
  // Sort pairs by their (generatorFloor, microchipFloor) to remove label symmetry
  const sorted = state.pairs
    .map(([g, m]) => [g, m] as PairFloors)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return (
    `${state.elevatorFloor}|` + sorted.map(([g, m]) => `${g},${m}`).join("|")
  );
}

function listItemsOnFloor(
  state: State,
  floor: number
): Array<{ type: "G" | "M"; index: number }> {
  const items: Array<{ type: "G" | "M"; index: number }> = [];
  for (let i = 0; i < state.pairs.length; i++) {
    const [g, m] = state.pairs[i];
    if (g === floor) items.push({ type: "G", index: i });
    if (m === floor) items.push({ type: "M", index: i });
  }
  return items;
}

function* combinations<T>(arr: T[]): Generator<T[]> {
  for (let i = 0; i < arr.length; i++) {
    yield [arr[i]];
    for (let j = i + 1; j < arr.length; j++) {
      yield [arr[i], arr[j]];
    }
  }
}

function generateNextStates(state: State): State[] {
  const currentFloor = state.elevatorFloor;
  const itemsHere = listItemsOnFloor(state, currentFloor);

  // Partition combinations: two-items first (when going up), then singles
  const singleMoves: Array<Array<{ type: "G" | "M"; index: number }>> = [];
  const doubleMoves: Array<Array<{ type: "G" | "M"; index: number }>> = [];
  for (const combo of combinations(itemsHere)) {
    if (combo.length === 2) doubleMoves.push(combo);
    else singleMoves.push(combo);
  }

  const results: State[] = [];

  const tryMove = (
    direction: 1 | -1,
    moveItems: Array<{ type: "G" | "M"; index: number }>
  ) => {
    const next: State = cloneState(state);
    next.elevatorFloor = currentFloor + direction;
    for (const item of moveItems) {
      const pair = next.pairs[item.index];
      if (item.type === "G") pair[0] += direction;
      else pair[1] += direction;
    }
    if (isStateValid(next)) {
      results.push(next);
    }
  };

  // Determine allowed directions
  const canGoUp = currentFloor < 3;
  const canGoDown = currentFloor > 0 && hasAnyItemsBelow(state, currentFloor);

  if (canGoUp) {
    // Prefer moving two items up if possible; still allow one item if needed
    for (const combo of doubleMoves) tryMove(1, combo);
    for (const combo of singleMoves) tryMove(1, combo);
  }

  if (canGoDown) {
    // Allow moving one or two items down (some configurations require taking two down)
    for (const combo of singleMoves) tryMove(-1, combo);
    for (const combo of doubleMoves) tryMove(-1, combo);
  }

  return results;
}

function shortestSteps(initial: State): number {
  const startKey = canonicalKey(initial);
  const visited: Set<string> = new Set([startKey]);
  const queue: Array<{ state: State; steps: number }> = [
    { state: initial, steps: 0 },
  ];
  let head = 0;

  while (head < queue.length) {
    const { state, steps } = queue[head++];
    if (isGoalState(state)) return steps;

    const nextStates = generateNextStates(state);
    for (const next of nextStates) {
      const key = canonicalKey(next);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ state: next, steps: steps + 1 });
      }
    }
  }

  throw new Error("No solution found");
}

function solvePart1(input: string): number {
  const initial = parseInputToState(input);
  return shortestSteps(initial);
}

function solvePart2(input: string): number {
  const initial = parseInputToState(input);
  // Add the extra items (elerium and dilithium) to the first floor
  initial.pairs.push([0, 0]);
  initial.pairs.push([0, 0]);
  return shortestSteps(initial);
}

console.log("Part 1:", solvePart1(input));
console.log("Part 2:", solvePart2(input));
