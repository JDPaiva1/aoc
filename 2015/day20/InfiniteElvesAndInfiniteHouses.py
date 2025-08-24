def getDivisors(n):
    divisors = set()
    i = 1
    while i * i <= n:
        if n % i == 0:
            divisors.add(i)
            if i != n // i:
                divisors.add(n // i)
        i += 1
    return divisors

def numOfPresents(houseNum):
    eachElfDeliver = 10
    presentsRecieved = sum(getDivisors(houseNum)) * eachElfDeliver
    return presentsRecieved

# Slow approach
def lowestHouseToGet(targetPresents):
    houseNum = 1
    while True:
        presentsDelivered = numOfPresents(houseNum)
        if presentsDelivered >= targetPresents:
            return houseNum
        houseNum += 1

        if houseNum % 100000 == 0:
            print(f"House {houseNum} has {presentsDelivered} presents")

def elfPerspective(targetPresents):
    """
    Alternative approach: Think about it from the elves' perspective
    Create an array where each elf delivers presents to their multiples
    """
    # Estimate upper bound for house numbers we need to check
    # Since each house gets at least 10 presents (from elf 1),
    # we won't need to check beyond targetPresents/10
    maxHouse = targetPresents // 10

    # Array to store presents for each house
    presents = [0] * (maxHouse + 1)

    # Each elf i delivers presents to houses that are multiples of i
    for elf in range(1, maxHouse + 1):
        for house in range(elf, maxHouse + 1, elf):
            presents[house] += elf * 10

        # Early termination: if we found a solution among the first few houses
        if elf <= 1000:  # Check first 1000 houses regularly
            for houseCheck in range(1, min(elf + 1, len(presents))):
                if presents[houseCheck] >= targetPresents:
                    return houseCheck

    # Find the first house with enough presents
    for house in range(1, len(presents)):
        if presents[house] >= targetPresents:
            return house

    return -1  # Not found within our bounds

def lowestHouseToGetPart2(targetPresents):
    houseNum = 1

    while True:
        totalPresents = 0
        # For this house, find all elves that would visit it
        # An elf 'e' visits house 'houseNum' if:
        # 1. houseNum is divisible by e (houseNum % e == 0)
        # 2. houseNum/e <= 50 (this elf hasn't exceeded their 50 house limit)
        elf = 1
        while elf * elf <= houseNum:
            if houseNum % elf == 0:
                # elf is a divisor
                # Check if this elf would still be delivering (hasn't hit 50 house limit)
                if houseNum // elf <= 50:
                    totalPresents += elf * 11

                # Also check the paired divisor (houseNum // elf)
                otherElf = houseNum // elf
                if otherElf != elf and houseNum // otherElf <= 50:
                    totalPresents += otherElf * 11

            elf += 1

        if totalPresents >= targetPresents:
            return houseNum

        houseNum += 1

input = 33100000
print(f"Part 1: {elfPerspective(input)}")
print(f"Part 2: {lowestHouseToGetPart2(input)}")
