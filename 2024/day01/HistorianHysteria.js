// let leftList = [3, 4, 2, 1, 3, 3],
//   rightList = [4, 3, 5, 3, 9, 3];
let leftList = [],
  rightList = [];

function getListsFromFile() {
  const fs = require('node:fs');
  const inputFile = fs.readFileSync('input', 'utf-8');
  inputFile.split(/\r?\n/).forEach((row) => {
    const splitSides = row.split('   ');
    leftList.push(splitSides[0]);
    rightList.push(splitSides[1]);
  });
}

function sortList(list) {
  const A = [...list];
  for (let i = 0; i < A.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < A.length; j++) {
      if (A[minIdx] > A[j]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [A[i], A[minIdx]] = [A[minIdx], A[i]];
    }
  }

  return A;
}

function sumArray(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}

function calTotalDistance(list1, list2) {
  const distances = [];
  for (let i = 0; i < list1.length; i++) {
    distances.push(Math.abs(list1[i] - list2[i]));
  }
  return sumArray(distances);
}

function calTotalSimilarity(left, right) {
  const similarity = [];
  for (let i = 0; i < left.length; i++) {
    const leftNumber = left[i];
    const found = right.filter((num) => leftNumber === num);
    similarity.push(leftNumber * found.length);
  }
  return sumArray(similarity);
}

getListsFromFile();
leftList = sortList(leftList);
rightList = sortList(rightList);

console.log('Distances: ', calTotalDistance(leftList, rightList));
console.log('Total Similarity: ', calTotalSimilarity(leftList, rightList));
