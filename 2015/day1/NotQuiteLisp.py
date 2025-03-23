file = open('input.txt', 'r')
content = file.read()

def findFloor(input):
    floor = 0
    for instruction in input:
        if instruction == '(':
            floor += 1
        elif instruction == ')':
            floor -= 1
    return floor

file.close()

print(findFloor(content))