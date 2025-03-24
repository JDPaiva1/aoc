file = open('input.txt', 'r')
content = file.read()

santaPosition = [0,0]
roboSantaPosition = [0,0]
housesDelivered = {(0,0)}

def move(direction, coordinates):
    x, y = coordinates
    if direction == '^':
        y += 1
    elif direction == 'v':
        y -= 1
    elif direction == '>':
        x += 1
    elif direction == '<':
        x -= 1
    return [x, y]

def addDelivery(coordinates):
    housesDelivered.add((coordinates[0], coordinates[1]))

for i, direction in enumerate(content):
    if i % 2 == 0:
        roboSantaPosition = move(direction, roboSantaPosition)
        addDelivery(roboSantaPosition)
    else:
        santaPosition = move(direction, santaPosition)
        addDelivery(santaPosition)

file.close()
print(len(housesDelivered))