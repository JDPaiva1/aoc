def findCombinations(containers, target):
    def backtrack(start, currentSum, currentCombination):
        if currentSum == target:
            result.append(tuple(currentCombination))
            return
        if currentSum > target:
            return
        
        for i in range(start, len(containers)):
            currentCombination.append(containers[i])
            backtrack(i + 1, currentSum + containers[i], currentCombination)
            currentCombination.pop()
    
    result = []
    backtrack(0, 0, [])
    return result

containers = [20, 15, 10, 5, 5]
with open('input.txt') as f:
    containers = [int(line.strip()) for line in f.readlines()]

# target = 25
target = 150

combinations = findCombinations(containers, target)

print(f"Number of different combinations: {len(combinations)}")
