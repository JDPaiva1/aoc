from itertools import permutations

def getAttendees(input):
    attendees = {}
    for line in input.splitlines():
        parts = line.split()
        attendee = parts[0]
        happinessUnits = +int(parts[3]) if parts[2] == "gain" else -int(parts[3])
        secondAttendee = parts[-1].replace(".", "")

        if attendee not in attendees:
            attendees[attendee] = {}

        attendees[attendee][secondAttendee] = happinessUnits 
    return attendees

def findOptimalOrder(attendees):
    optimalOrder = []

    for arrangement in list(permutations(list(attendees.keys()))):
        totalChangeHappiness = 0

        for next, attendee in enumerate(arrangement, 1):
            secondAttendee = arrangement[next] if next != len(arrangement) else arrangement[0]
            totalChangeHappiness += attendees[attendee][secondAttendee] + attendees[secondAttendee][attendee]

        if totalChangeHappiness > 0:
            optimalOrder.append([arrangement, totalChangeHappiness])

    return max(optimalOrder, key=lambda x: x[1])

def addMyself(attendees):
    attendees["Myself"] = {}
    for attendee in attendees:
        attendees[attendee]["Myself"] = 0
        attendees["Myself"][attendee] = 0
    return attendees

with open('input.txt') as f:
    input = f.read()
    attendes = getAttendees(input)
    print(attendes)
    print(findOptimalOrder(attendes))
    attendes = addMyself(attendes)
    print(findOptimalOrder(attendes))
