file = open('input.txt', 'r')
content = file.read()

coordinates = [0,0]
housesDelivered = {(0,0)}

def move(direction):
    if direction == '^':
        coordinates[1] += 1
    elif direction == 'v':
        coordinates[1] -= 1
    elif direction == '>':
        coordinates[0] += 1
    elif direction == '<':
        coordinates[0] -= 1

def addDelivery():
    housesDelivered.add((coordinates[0], coordinates[1]))

for direction in list(content):
    move(direction)
    addDelivery()

file.close()
print(len(housesDelivered))