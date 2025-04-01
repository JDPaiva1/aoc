import re

def findNumbers(input):
    numbers = re.findall(r'-?\d+', input)
    return [int(n) for n in numbers]

with open('input.json') as f:
    input = f.read()
    print("Part One: ", sum(findNumbers(input)))