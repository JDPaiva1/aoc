import { readFileSync } from "fs";

const ipList = readFileSync("input.txt", "utf8").trim().split("\n");

function splitParts(str: string) {
  const inside = [];
  const outside = [];

  // Regex to capture both parts: groups outside and inside []
  const regex = /\[([^\]]+)\]|([^[\]]+)/g;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match[1]) {
      // text inside brackets
      inside.push(match[1]);
    }
    if (match[2]) {
      // text outside brackets
      outside.push(match[2]);
    }
  }

  return { inside, outside };
}

function isTlsSupported(inside: string[], outside: string[]) {
  const isABBA = (parts: string[]) => {
    for (const part of parts) {
      for (let i = 0; i < part.length - 3; i++) {
        if (part[i] === part[i + 1]) continue;
        if (part[i] === part[i + 3] && part[i + 1] === part[i + 2]) {
          return true;
        }
      }
    }
  };
  return isABBA(outside) && !isABBA(inside);
}

function getTlsSupportedIpList(ipList: string[]) {
  const tlsSupportedIpList = [];
  for (const ip of ipList) {
    const { inside, outside } = splitParts(ip);
    if (isTlsSupported(inside, outside)) {
      tlsSupportedIpList.push(ip);
    }
  }
  return tlsSupportedIpList.length;
}

console.log(getTlsSupportedIpList(ipList));
