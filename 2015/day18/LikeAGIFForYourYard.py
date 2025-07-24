lightsGrid = []
def processInput(filename):
    with open(filename, 'r') as file:
        for line in file:
          line = line.strip()
          if(line == ""):
            continue
          lightsGrid.append(list(line))

def lightsAnimation(lightsGrid):
    nextState = []
    for row in range(len(lightsGrid)):
        nextRowState = []
        for col in range(len(lightsGrid[row])):
            neighborsOn = 0
            if(row > 0 and lightsGrid[row-1][col] == '#'):
              neighborsOn += 1
            if(row > 0 and col > 0 and lightsGrid[row-1][col-1] == '#'):
              neighborsOn += 1
            if(row > 0 and col < len(lightsGrid[row])-1 and lightsGrid[row-1][col+1] == '#'):
              neighborsOn += 1
            if(col > 0 and lightsGrid[row][col-1] == '#'):
              neighborsOn += 1
            if(col < len(lightsGrid[row])-1 and lightsGrid[row][col+1] == '#'):
              neighborsOn += 1
            if(row < len(lightsGrid)-1 and col > 0 and lightsGrid[row+1][col-1] == '#'):
              neighborsOn += 1
            if(row < len(lightsGrid)-1 and lightsGrid[row+1][col] == '#'):
              neighborsOn += 1
            if(row < len(lightsGrid)-1 and col < len(lightsGrid[row])-1 and lightsGrid[row+1][col+1] == '#'):
              neighborsOn += 1
            if(lightsGrid[row][col] == '#'):
              if(neighborsOn == 3 or neighborsOn == 2):
                nextRowState.append('#')
              else:
                nextRowState.append('.')
            else:
              if(neighborsOn == 3):
                nextRowState.append('#')
              else:
                nextRowState.append('.')
        nextState.append(nextRowState)
    return nextState

def howManyOn(lightsGrid):
    return sum(sum(1 for x in y if x == '#') for y in lightsGrid)

processInput('input.txt')
print("Initial State:", howManyOn(lightsGrid))
for i in range(100):
    lightsGrid = lightsAnimation(lightsGrid)
    print("Step", i+1, ":", howManyOn(lightsGrid))
