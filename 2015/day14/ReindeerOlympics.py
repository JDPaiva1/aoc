with open('input.txt') as f:
    lines = f.readlines()

reindeers = {}

for line in lines:
    parts = line.split() 
    reindeers[parts[0]] = {
        'speed': int(parts[3]),
        'flyTime': int(parts[6]),
        'restTime': int(parts[-2]),
        'state': 'flying',
        'distance': 0,
        'nextState': int(parts[6]),
        'points': 0,
    } 

def findWinner(reindeers):
    winner = max(reindeers, key=lambda x: reindeers[x]['points'])
    print(winner)
    for name, reindeer in reindeers.items():
        print(name, reindeer['distance'], reindeer['points'])

def countPoints(reindeers):
    max_distance = max(reindeer['distance'] for reindeer in reindeers.values())

    for reindeer in reindeers.values():
        if reindeer['distance'] == max_distance:
            reindeer['points'] += 1

def race(reindeers, time=1):
    while time > 0:
        for name, reindeer in reindeers.items():
            if reindeer['state'] == 'flying':
                reindeer['distance'] += reindeer['speed']

            reindeer['nextState'] -= 1
            if reindeer['nextState'] == 0:
                reindeer['state'] = 'resting' if reindeer['state'] == 'flying' else 'flying'
                reindeer['nextState'] = reindeer['restTime'] if reindeer['state'] == 'resting' else reindeer['flyTime']
        countPoints(reindeers)
        time -= 1
    findWinner(reindeers)

race(reindeers, 2503)
