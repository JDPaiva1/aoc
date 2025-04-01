import re, json

def removeRedObjects(data):
    if isinstance(data, dict):
        if "red" in data.values():
            return None
        return {k: removeRedObjects(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [removeRedObjects(x) for x in data]
    else:
        return data

def findNumbers(input):
    numbers = re.findall(r'-?\d+', input)
    return [int(n) for n in numbers]

with open('input.json') as f:
    input = f.read()
    print("Part One: ", sum(findNumbers(input)))
    jsonData = json.loads(input)
    cleanedData = removeRedObjects(jsonData)
    print("Part Two: ", sum(findNumbers(json.dumps(cleanedData))))