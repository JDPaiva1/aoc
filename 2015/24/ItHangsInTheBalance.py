from itertools import combinations
from math import prod
from functools import lru_cache


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


def findMinQeForFirstGroupWithK(weights, groupCount):
    totalSum = sum(weights)
    if totalSum % groupCount != 0:
        return None

    target = totalSum // groupCount
    weightsSorted = sorted(weights, reverse=True)

    @lru_cache(maxsize=None)
    def canPartitionIntoGroups(availableTuple, groupsRemaining):
        available = list(availableTuple)
        if sum(available) != groupsRemaining * target:
            return False
        if groupsRemaining == 1:
            return sum(available) == target
        for size in range(1, len(available) + 1):
            for group in combinations(available, size):
                if sum(group) != target:
                    continue
                remaining = list(available)
                for g in group:
                    remaining.remove(g)
                if canPartitionIntoGroups(tuple(remaining), groupsRemaining - 1):
                    return True
        return False

    for groupSize in range(1, len(weightsSorted) + 1):
        validQes = []
        for group in combinations(weightsSorted, groupSize):
            if sum(group) != target:
                continue
            remaining = list(weightsSorted)
            for g in group:
                remaining.remove(g)
            if canPartitionIntoGroups(tuple(remaining), groupCount - 1):
                validQes.append(prod(group))
        if validQes:
            return min(validQes)
    return None


weights = getNumbers("input.txt")
answerQe = findMinQeForFirstGroupWithK(weights, 4)
if answerQe is None:
    print("No valid configuration found")
else:
    print(answerQe)
