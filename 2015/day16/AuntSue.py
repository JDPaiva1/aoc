tickerTape = {
    'children': 3,
    'cats': 7,
    'samoyeds': 2,
    'pomeranians': 3,
    'akitas': 0,
    'vizslas': 0,
    'goldfish': 5,
    'trees': 3,
    'cars': 2,
    'perfumes': 1,
}

auntsSue = {}
def getAuntSueThings(line):
    line = line.removeprefix('Sue ')
    sueNumber, things = line.split(': ', maxsplit=1)
    sueNumber = int(sueNumber)
    auntsSue[sueNumber] = {}
    for thing in things.split(', '):
        thingName, thingValue = thing.split(': ')
        auntsSue[sueNumber][thingName] = int(thingValue)

with open('input.txt', 'r') as file:
    for line in file:
        line = line.strip()
        if line:
            getAuntSueThings(line)

def findAuntSuePartOne(auntsSue, tickerTape):
    posibleSueNumbers = set()
    for sueNumber, sueThings in auntsSue.items():
        thingsMatched = []
        for tickerTapeThing, tickerTapeValue in tickerTape.items():
            if tickerTapeThing not in sueThings:
                continue
            if sueThings[tickerTapeThing] != tickerTapeValue:
                break
            else:
                thingsMatched.append(tickerTapeThing)
        if len(thingsMatched) == len(sueThings):
            posibleSueNumbers.add(sueNumber)
    return posibleSueNumbers

print('Part 1:', findAuntSuePartOne(auntsSue, tickerTape))
