from itertools import permutations

distances = {}
cities = set()

def getDistance(city1, city2):
    for locations in distances:
        if city1 in locations and city2 in locations:
            return distances[locations]
    return 0

def findDistance(path):
    totalDistance = 0
    for i, city in enumerate(path):
        if i != len(path) - 1:
            totalDistance += getDistance(city, path[i + 1])
    return {' '.join(path): totalDistance}

def findShortestRoute(cities):
    routes = {}
    for path in list(permutations(cities)):
        routes.update(findDistance(path))
    return sorted(routes.items(), key=lambda x: x[1])[0]

def getDistancesBetweenLocations(line):
    line = line.strip()
    locations, distance = line.split(' = ')
    distances[locations] = int(distance)
    cities.update(locations.split(' to '))

# test = ["London to Dublin = 464", "London to Belfast = 518", "Dublin to Belfast = 141"]
# for line in test:
#     getDistancesBetweenLocations(line)

with open('input.txt') as f:
    for line in f:
        getDistancesBetweenLocations(line)

print(findShortestRoute(cities))