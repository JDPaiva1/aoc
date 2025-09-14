import fs from "fs";

const connections = fs.readFileSync("input.txt", "utf-8").trim().split("\n");

function getconnectedComputers(connections) {
  const connectedComputers = new Map();
  for (const connection of connections) {
    const [computer1, computer2] = connection.split("-");
    if (connectedComputers.has(computer1)) {
      connectedComputers.get(computer1).push(computer2);
    } else {
      connectedComputers.set(computer1, [computer2]);
    }
    if (connectedComputers.has(computer2)) {
      connectedComputers.get(computer2).push(computer1);
    } else {
      connectedComputers.set(computer2, [computer1]);
    }
  }
  console.table(connectedComputers);
  return connectedComputers;
}

function findConnectedComputers(connections) {
  const connectedComputers = getconnectedComputers(connections);

  const innerConnections = new Set();
  const innerConnectionsWithT = new Set();
  for (const [computer, connected] of connectedComputers) {
    for (let i = 0; i < connected.length; i++) {
      const currentComputer = connected[i];
      const currentConnections = connectedComputers.get(currentComputer);

      for (let j = i + 1; j < connected.length; j++) {
        const nextComputer = connected[j];
        if (currentConnections.includes(nextComputer)) {
          const connections = [computer, currentComputer, nextComputer];
          connections.sort();
          innerConnections.add(connections.join(","));
          if (computer.startsWith("t")) {
            innerConnectionsWithT.add(connections.join(","));
          }
        }
      }
    }
  }
  console.log(innerConnections.size);
  return innerConnectionsWithT.size;
}

function findPassword(connections) {
  const connectedComputers = getconnectedComputers(connections);

  const isConneted = (computer, connections) => {
    const computerConnections = connectedComputers.get(computer);
    for (const c of connections) {
      if (!computerConnections.includes(c)) return false;
    }
    return true;
  };

  const innerConnections = new Set();
  for (const [computer, connected] of connectedComputers) {
    if (!computer.startsWith("t")) continue;

    for (let i = 0; i < connected.length; i++) {
      const currentComputer = connected[i];
      const currentConnections = connectedComputers.get(currentComputer);
      const connections = [];

      for (let j = 0; j < connected.length; j++) {
        if (j === i) continue;

        const nextComputer = connected[j];

        if (!currentConnections.includes(nextComputer)) continue;
        if (!isConneted(nextComputer, connections)) continue;

        connections.push(nextComputer);
      }

      connections.push(computer, currentComputer);
      innerConnections.add(connections.sort().join(","));
    }
  }
  console.log(innerConnections);

  let password = "";
  for (const connection of innerConnections) {
    if (connection.length < password.length) continue;
    password = connection;
  }
  return password;
}

console.log(findConnectedComputers(connections));
console.log(findPassword(connections));
