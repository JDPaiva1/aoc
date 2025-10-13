import { readFileSync } from "fs";

const operations = readFileSync("input.txt", "utf-8").trim().split("\n");

function swap(password: string[], x: number, y: number) {
  const temp = password[x];
  password[x] = password[y];
  password[y] = temp;
  return password;
}

function rotate(password: string[], direction: "left" | "right", x: number) {
  let temp: string[] = [];
  if (x === 0 || x === password.length) return password;
  if (x > password.length) x = x % password.length;

  if (direction === "left") {
    for (let i = 0; i < x; i++) {
      temp.push(password.shift()!);
    }
    password.push(...temp);
    return password;
  }

  for (let i = 0; i < x; i++) {
    temp.unshift(password.pop()!);
  }
  password.unshift(...temp);
  return password;
}

function reverse(password: string[], x: number, y: number) {
  const temp = password.slice(x, y + 1);
  password.splice(x, y - x + 1, ...temp.reverse());
  return password;
}

function move(password: string[], x: number, y: number) {
  const temp = password.splice(x, 1);
  password.splice(y, 0, temp[0]);
  return password;
}

function scramble(operations: string[], password: string) {
  let scrambledPassword = password.split("");
  for (const operation of operations) {
    const operationParts = operation.split(" ");

    if (operationParts[0].startsWith("swap")) {
      const [x, y] = [operationParts[2], operationParts[5]];
      if (operationParts[1].startsWith("position")) {
        scrambledPassword = swap(scrambledPassword, Number(x), Number(y));
      } else {
        scrambledPassword = swap(
          scrambledPassword,
          scrambledPassword.indexOf(x),
          scrambledPassword.indexOf(y)
        );
      }
    }

    if (operationParts[0].startsWith("rotate")) {
      if (operationParts[1].startsWith("based")) {
        const x = operationParts[6];
        let index = scrambledPassword.indexOf(x);
        index = index >= 4 ? index + 2 : index + 1;
        scrambledPassword = rotate(scrambledPassword, "right", index);
      } else {
        const x = operationParts[2];
        const direction = operationParts[1] === "left" ? "left" : "right";
        scrambledPassword = rotate(scrambledPassword, direction, Number(x));
      }
    }

    if (operationParts[0].startsWith("reverse")) {
      const [x, y] = [operationParts[2], operationParts[4]].map(Number);
      scrambledPassword = reverse(scrambledPassword, x, y);
    }

    if (operationParts[0].startsWith("move")) {
      const [x, y] = [operationParts[2], operationParts[5]].map(Number);
      scrambledPassword = move(scrambledPassword, x, y);
    }
  }
  return scrambledPassword.join("");
}

function unscramble(operations: string[], password: string) {
  let scrambledPassword = password.split("");
  for (const operation of operations.reverse()) {
    const operationParts = operation.split(" ");

    if (operationParts[0].startsWith("swap")) {
      const [x, y] = [operationParts[2], operationParts[5]];
      if (operationParts[1].startsWith("position")) {
        scrambledPassword = swap(scrambledPassword, Number(x), Number(y));
      } else {
        scrambledPassword = swap(
          scrambledPassword,
          scrambledPassword.indexOf(x),
          scrambledPassword.indexOf(y)
        );
      }
    }

    if (operationParts[0].startsWith("rotate")) {
      if (operationParts[1].startsWith("based")) {
        const x = operationParts[6];
        const targetPassword = scrambledPassword.join("");

        for (let i = 0; i < scrambledPassword.length; i++) {
          const candidate = rotate([...scrambledPassword], "left", i);
          const index = candidate.indexOf(x);
          const steps = index >= 4 ? index + 2 : index + 1;
          const rotated = rotate([...candidate], "right", steps);

          if (rotated.join("") === targetPassword) {
            scrambledPassword = candidate;
            break;
          }
        }
      } else {
        const x = operationParts[2];
        const direction = operationParts[1] === "left" ? "right" : "left";
        scrambledPassword = rotate(scrambledPassword, direction, Number(x));
      }
    }

    if (operationParts[0].startsWith("reverse")) {
      const [x, y] = [operationParts[2], operationParts[4]].map(Number);
      scrambledPassword = reverse(scrambledPassword, x, y);
    }

    if (operationParts[0].startsWith("move")) {
      const [y, x] = [operationParts[2], operationParts[5]].map(Number);
      scrambledPassword = move(scrambledPassword, x, y);
    }
  }
  return scrambledPassword.join("");
}

console.log("Part 1:", scramble(operations, "abcdefgh"));
console.log("Part 2:", unscramble(operations, "fbgdceah"));
