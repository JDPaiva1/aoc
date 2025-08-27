import fs from "fs";
const inputExample = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;
const input = fs.readFileSync("input.txt", "utf-8");

const calibrationEquations = [];
let totalCalibrationResult = 0;

input.split(/\r?\n/).forEach((line) => {
  const [value, equation] = line.split(": ");
  if (value && equation) {
    const testValue = parseInt(value, 10);
    const calibrationEquation = findCalibrationEquation(parseInt(testValue, 10), equation);
    if (calibrationEquation) {
      totalCalibrationResult += parseInt(testValue, 10);
    }
    calibrationEquations.push({ testValue, equation, calibrationEquation });
  }
});

function evalEquation(equation) {
  let numbers = equation.split(/[\+\*\|]/);
  let operators = equation.split(/\d+/).filter((op) => op === "+" || op === "*" || op === "|");

  let result = parseInt(numbers[0], 10);

  for (let i = 0; i < operators.length; i++) {
    let nextNum = parseInt(numbers[i + 1], 10);

    if (operators[i] === "+") {
      result += nextNum;
    } else if (operators[i] === "*") {
      result *= nextNum;
    } else if (operators[i] === "|") {
      result = parseInt(`${result}${nextNum}`, 10);
    }
  }

  return result;
}

function findCalibrationEquation(testValue, equation) {
  let calibrationEquation = equation.replaceAll(" ", "+");
  let result = evalEquation(calibrationEquation);

  let signsPositions = [];
  for (let i = 0; i < calibrationEquation.length; i++) {
    if (calibrationEquation[i] === "+") {
      signsPositions.push(i);
    }
  }

  const combine = (str, positions, startIndex) => {
    for (let i = startIndex; i < positions.length && result !== testValue; i++) {
      let strWithMult = str.substring(0, positions[i]) + "*" + str.substring(positions[i] + 1);
      let strWithPipe = str.substring(0, positions[i]) + "|" + str.substring(positions[i] + 1);

      const multResult = evalEquation(strWithMult);
      const pipeResult = evalEquation(strWithPipe);

      if (multResult === testValue) {
        calibrationEquation = strWithMult;
        result = multResult;
      } else if (pipeResult === testValue) {
        calibrationEquation = strWithPipe;
        result = pipeResult;
      } else {
        combine(strWithMult, positions, i + 1);
        combine(strWithPipe, positions, i + 1);
      }
    }
  };

  combine(calibrationEquation, signsPositions, 0);

  if (result === testValue) {
    return calibrationEquation;
  }
}

console.log(calibrationEquations);
console.log("Total calibration result:", totalCalibrationResult);
