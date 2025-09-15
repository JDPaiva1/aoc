import { readFileSync } from "fs";

const input = readFileSync("input.txt", "utf-8");

function getWires(input) {
  const gateConnections = [];
  const initialWireValues = new Map();
  for (const line of input.split("\n")) {
    if (line.trim() === "") continue;

    if (line.includes("-> ")) {
      const [connection, output] = line.split(" -> ");
      gateConnections.push([...connection.split(" "), output]);
    } else {
      const [wire, value] = line.split(": ");
      initialWireValues.set(wire, parseInt(value, 2));
    }
  }
  return { gateConnections, initialWireValues };
}

function binaryToDecimal(binary) {
  return parseInt(binary, 2).toString(10);
}

function getZOutput() {
  const { gateConnections, initialWireValues: wireValues } = getWires(input);
  const queue = [...gateConnections];
  let zOutput = [];

  while (queue.length > 0) {
    const [wire1, operator, wire2, output] = queue.shift();

    if (!wireValues.has(wire1) || !wireValues.has(wire2)) {
      queue.push([wire1, operator, wire2, output]);
      continue;
    }

    const vWire1 = wireValues.get(wire1);
    const vWire2 = wireValues.get(wire2);

    if (operator === "AND") {
      wireValues.set(output, vWire1 & vWire2);
    } else if (operator === "OR") {
      wireValues.set(output, vWire1 | vWire2);
    } else if (operator === "XOR") {
      wireValues.set(output, vWire1 ^ vWire2);
    }

    if (output.startsWith("z")) {
      zOutput.push([output, wireValues.get(output)]);
    }
  }

  zOutput.sort((a, b) => a[0].localeCompare(b[0]));
  zOutput = zOutput.flatMap(([_, value]) => value);
  return binaryToDecimal(zOutput.reverse().join(""));
}

console.log(getZOutput());
