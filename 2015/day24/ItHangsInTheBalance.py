from itertools import combinations
from math import prod


def getNumbers(fileName):
    with open(fileName, "r") as f:
        return [int(line.strip()) for line in f.readlines()]


def canMakeTargetSubset(numbers, targetSum):
    sums = {0}
    for weight in numbers:
        newSums = set()
        for s in sums:
            ns = s + weight
            if ns == targetSum:
                return True
            if ns < targetSum:
                newSums.add(ns)
        sums |= newSums
    return False


def findMinQeForFirstGroup(weights):
    totalSum = sum(weights)
    if totalSum % 3 != 0:
        return None

    target = totalSum // 3
    weightsSorted = sorted(weights, reverse=True)

    for groupSize in range(1, len(weightsSorted) + 1):
        validQes = []
        for group in combinations(weightsSorted, groupSize):
            if sum(group) != target:
                continue
            remaining = list(weightsSorted)
            for g in group:
                remaining.remove(g)
            if canMakeTargetSubset(remaining, target):
                validQes.append(prod(group))
        if validQes:
            return min(validQes)
    return None


weights = getNumbers("input.txt")
answerQe = findMinQeForFirstGroup(weights)
if answerQe is None:
    print("No valid configuration found")
else:
    print(answerQe)
