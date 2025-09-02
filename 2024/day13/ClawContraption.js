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

function getNumOfAandNumOfBpush(a, b, prize) {
  const [ax, ay] = a;
  const [bx, by] = b;
  const [px, py] = prize;
  let nb = 0;
  let na = 0;

  // calculate the determinant
  const determinant = ax * by - ay * bx;
  if (determinant === 0) return [0, 0];
  // calculate the number of B push
  nb = py * ax - ay * px;
  if (nb % determinant !== 0) return [0, 0];
  nb = nb / determinant;

  // calculate the number of A push
  na = px - bx * nb;
  if (na % ax !== 0) return [0, 0];
  na = na / ax;

  return [na, nb];
}

function calNumOfTokens(input) {
  const costForA = 3;
  const costForB = 1;
  let numOfTokens = 0;

  for (const item of input) {
    const [na, nb] = getNumOfAandNumOfBpush(item.a, item.b, item.prize);

    // if the number of A or B push is greater than 100, continue
    if (na <= 0 || nb <= 0 || na >= 100 || nb >= 100) continue;

    numOfTokens += na * costForA + nb * costForB;
  }

  return numOfTokens;
}

function calNumOfTokensFixingConversion(input) {
  const positionCorrection = 10000000000000;
  const costForA = 3;
  const costForB = 1;
  let numOfTokens = 0;

  for (const item of input) {
    let [px, py] = item.prize;
    // convert the prize to fix the unit conversion error
    px += positionCorrection;
    py += positionCorrection;

    const [na, nb] = getNumOfAandNumOfBpush(item.a, item.b, [px, py]);

    if (na <= 0 || nb <= 0) continue;

    numOfTokens += na * costForA + nb * costForB;
  }

  return numOfTokens;
}

const input = getInput(data);
console.log(calNumOfTokens(input));
console.log(calNumOfTokensFixingConversion(input));
