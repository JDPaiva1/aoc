import fs from "fs";

const data = fs.readFileSync("input.txt", "utf8").split("\n");

function getInput(data) {
  const input = [];
  let current = {};
  for (const line of data) {
    if (Object.keys(current).length === 3) {
      input.push(current);
      current = {};
    }
    if (line.trim() === "") {
      continue;
    }
    if (line.includes("Button A:")) {
      const buttonA = line.split("Button A:")[1].trim();
      const [x, y] = buttonA.split(", ");
      current.a = [
        parseInt(x.split("X+")[1], 10),
        parseInt(y.split("Y+")[1], 10),
      ];
    } else if (line.includes("Button B:")) {
      const buttonB = line.split("Button B:")[1].trim();
      const [x, y] = buttonB.split(", ");
      current.b = [
        parseInt(x.split("X+")[1], 10),
        parseInt(y.split("Y+")[1], 10),
      ];
    } else if (line.includes("Prize:")) {
      const prize = line.split("Prize:")[1].trim();
      const [x, y] = prize.split(", ");
      current.prize = [
        parseInt(x.split("X=")[1], 10),
        parseInt(y.split("Y=")[1], 10),
      ];
    }
  }
  return input;
}

function calNumOfTokens(input) {
  const costForA = 3;
  const costForB = 1;
  let numOfTokens = 0;

  for (const item of input) {
    const [ax, ay] = item.a;
    const [bx, by] = item.b;
    const [px, py] = item.prize;

    // calculate the determinant
    const determinant = ax * by - ay * bx;
    if (determinant === 0) continue;
    // calculate the number of B push
    let nb = py * ax - ay * px;
    if (nb % determinant !== 0) continue;
    nb = nb / determinant;

    // calculate the number of A push
    let na = px - bx * nb;
    if (na % ax !== 0) continue;
    na = na / ax;

    // if the number of A or B push is greater than 100, continue
    if (na >= 100 || nb >= 100) continue;

    numOfTokens += na * costForA + nb * costForB;
  }

  return numOfTokens;
}

console.log(calNumOfTokens(getInput(data)));
