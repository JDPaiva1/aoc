file = open('input.txt', 'r')
content = file.read()

def findFloor(input):
  floor = 0
  hasEnteredBasement = False
  basementEntered = None
  for index, instruction in enumerate(input, 1):
    if instruction == '(':
      floor += 1
    elif instruction == ')':
      floor -= 1
    if floor == -1 and not hasEnteredBasement:
      basementEntered = index
      hasEnteredBasement = True
  return floor, basementEntered

file.close()

print(findFloor(content))