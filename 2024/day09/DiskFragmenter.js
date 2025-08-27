import fs from "fs";

const diskMap = fs.readFileSync("input.txt", "utf8")?.trim();
// const diskMap = "2333133121414131402";
// const diskMap = "12345";

function getIndividualBlocks(diskMap) {
  const blocks = [];
  let currentBlockId = 0;

  diskMap.split("").forEach((char, index) => {
    const isFile = index % 2 === 0;

    for (let i = 0; i < parseInt(char); i++) {
      blocks.push(isFile ? currentBlockId : ".");
    }

    if (isFile) {
      currentBlockId++;
    }
  });

  return blocks;
}

function moveFileBlocks(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    if (!blocks.slice(i).join("").match(/\d/)) {
      break;
    }

    if (blocks[i] === ".") {
      for (let j = blocks.length - 1; j >= i; j--) {
        if (blocks[j] !== ".") {
          blocks[i] = blocks[j];
          blocks[j] = ".";
          // console.log(blocks.join(""));
          break;
        }
      }
    }
  }
  return blocks;
}

function calculateChecksum(blocks) {
  let checksum = 0;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] !== ".") {
      checksum += parseInt(i * blocks[i]);
    }
  }
  return checksum;
}

const blocks = getIndividualBlocks(diskMap);
// console.log(blocks.join(""));
const movedBlocks = moveFileBlocks(blocks);
// console.log(movedBlocks.join(""));
console.log(calculateChecksum(movedBlocks));
