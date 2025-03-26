lightsGrid = [[False for x in range(1000)] for y in range(1000)]

def turnOn(x, y):
    lightsGrid[x][y] = True

def turnOff(x, y):
    lightsGrid[x][y] = False

def toggle(x, y):
    lightsGrid[x][y] = not lightsGrid[x][y]

def howManyOn():
    return sum(sum(y) for y in lightsGrid)

def processThrough(start, end, callback):
    startX, startY = [int(i) for i in start.split(",")]
    endX, endY = [int(i) for i in end.split(",")]
    for x in range(startX, endX+1):
        for y in range(startY, endY+1):
            callback(x, y)

def processInstruction(instruction):
    instruction, start, end = instruction.replace("turn ", "").replace("through", "").split()
    if instruction == "on":
        processThrough(start, end, turnOn)
    elif instruction == "off":
        processThrough(start, end, turnOff)
    elif instruction == "toggle":
        processThrough(start, end, toggle)

def processInput(filename):
    with open(filename, 'r') as file:
        for instruction in file:
            processInstruction(instruction)
    return howManyOn()

print(processInput('input.txt'))