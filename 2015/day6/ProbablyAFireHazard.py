lightsGrid = [[0 for x in range(1000)] for y in range(1000)]

def turnOn(x, y):
    lightsGrid[x][y] = True

def turnOff(x, y):
    lightsGrid[x][y] = False

def toggle(x, y):
    lightsGrid[x][y] = not lightsGrid[x][y]

def increaseBrightness(x, y, brightness = 1):
    lightsGrid[x][y] += brightness

def decreaseBrightness(x, y, brightness = 1):
    if lightsGrid[x][y] > 0:
        lightsGrid[x][y] -= brightness

## Total brightness:
def howManyOn():
    return sum(sum(y) for y in lightsGrid)

def processThrough(start, end, callback):
    startX, startY = [int(i) for i in start.split(",")]
    endX, endY = [int(i) for i in end.split(",")]
    for x in range(startX, endX+1):
        for y in range(startY, endY+1):
            callback(x, y)

def processInstruction(instruction, start, end):
    if instruction == "on":
        processThrough(start, end, turnOn)
    elif instruction == "off":
        processThrough(start, end, turnOff)
    elif instruction == "toggle":
        processThrough(start, end, toggle)

def processInstruction2(instruction, start, end):
    if instruction == "on":
        processThrough(start, end, increaseBrightness)
    elif instruction == "off":
        processThrough(start, end, lambda x, y: decreaseBrightness(x, y))
    elif instruction == "toggle":
        processThrough(start, end, lambda x, y: increaseBrightness(x, y, 2))

def processInput(filename):
    with open(filename, 'r') as file:
        for instruction in file:
            instruction, start, end = instruction.replace("turn ", "").replace("through", "").split()
            processInstruction(instruction, start, end)
    return howManyOn()

print(processInput('input.txt'))