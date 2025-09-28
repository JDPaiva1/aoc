import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf8");

type Rule = {
  lowType: "bot" | "output";
  lowDest: string;
  highType: "bot" | "output";
  highDest: string;
};

function parseInstructions(input: string) {
  const values: [number, string][] = [];
  const rules: Record<string, Rule> = {};

  for (const line of input.trim().split("\n")) {
    const parts = line.split(" ");
    if (line.startsWith("value")) {
      const value = Number(parts[1]);
      const bot = parts[5];
      values.push([value, bot]);
    } else {
      const bot = parts[1];
      rules[bot] = {
        lowType: parts[5] as "bot" | "output",
        lowDest: parts[6],
        highType: parts[10] as "bot" | "output",
        highDest: parts[11],
      };
    }
  }
  return { values, rules };
}

function execute(input: string, compare: [number, number]) {
  const { values, rules } = parseInstructions(input);

  const bots: Record<string, number[]> = {};
  const outputs: Record<string, number[]> = {};

  const giveChip = (bot: string, value: number) => {
    if (!bots[bot]) bots[bot] = [];
    bots[bot].push(value);
    bots[bot].sort((a, b) => a - b);
  };
  const give = (type: "bot" | "output", dest: string, value: number) => {
    if (type === "bot") {
      giveChip(dest, value);
    } else {
      if (!outputs[dest]) outputs[dest] = [];
      outputs[dest].push(value);
    }
  };

  for (const [value, bot] of values) {
    giveChip(bot, value);
  }

  let foundBot: string | undefined;

  let progress = true;
  while (progress) {
    progress = false;

    for (const [bot, chips] of Object.entries(bots)) {
      if (chips.length === 2) {
        const [low, high] = chips;

        if (chips.includes(compare[0]) && chips.includes(compare[1])) {
          foundBot = bot;
        }

        const rule = rules[bot];
        if (!rule) continue;

        give(rule.lowType, rule.lowDest, low);
        give(rule.highType, rule.highDest, high);

        bots[bot] = [];
        progress = true;
      }
    }
  }

  return { foundBot, outputs };
}

function multiplyOutputs(outputs: Record<string, number[]>) {
  return (
    (outputs["0"][0] ?? 1) * (outputs["1"][0] ?? 1) * (outputs["2"][0] ?? 1)
  );
}

const { foundBot, outputs } = execute(input, [61, 17]);
console.log("Part 1:", foundBot);
console.log("Part 2:", multiplyOutputs(outputs));
