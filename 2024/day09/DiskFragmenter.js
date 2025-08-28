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

function moveFileBlocks(diskMapBlocks) {
  const blocks = [...diskMapBlocks];
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

// PART TWO

function moveFile(diskMapBlocks) {
  const findFreeSpace = (blocks, fileLength) => {
    if (fileLength <= 0 || fileLength > blocks.length) return null;
    let count = 0;
    let start = -1;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i] === ".") {
        if (count === 0) start = i;
        count++;
        if (count === fileLength) return { start, end: i };
      } else {
        count = 0;
        start = -1;
      }
    }
    return null;
  };

  const blocks = [...diskMapBlocks];

  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i] !== ".") {
      const currectFile = blocks[i];
      const fileBlock = {
        start: blocks.indexOf(currectFile),
        end: blocks.lastIndexOf(currectFile),
      };
      const fileLength = fileBlock.end - fileBlock.start + 1;
      const freeSpace = findFreeSpace(blocks, fileLength);
      if (freeSpace && freeSpace.start < fileBlock.start) {
        for (let j = 0; j < fileLength; j++) {
          blocks[freeSpace.start + j] = currectFile;
          blocks[fileBlock.start + j] = ".";
        }
        // console.log(blocks.join(""));
      }
    }
  }
  return blocks;
}

const blocks = getIndividualBlocks(diskMap);
// console.log(blocks.join(""));
const movedBlocks = moveFileBlocks(blocks);
// console.log(movedBlocks.join(""));
const movedFiles = moveFile(blocks);
// console.log(movedFiles.join(""));
console.log("Part one: filesystem checksum: ", calculateChecksum(movedBlocks));
console.log("Part two: filesystem checksum: ", calculateChecksum(movedFiles));
