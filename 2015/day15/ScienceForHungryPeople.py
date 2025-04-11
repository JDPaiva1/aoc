from itertools import permutations

def calculateScore(ingredients, quantities):
    capacity = 0
    durability = 0
    flavor = 0
    texture = 0
    calories = 0

    for i, ingredientProperties in enumerate(ingredients.values()):
        quantity = int(quantities[i])
        capacity += quantity * ingredientProperties["capacity"]
        durability += quantity * ingredientProperties["durability"]
        flavor += quantity * ingredientProperties["flavor"]
        texture += quantity * ingredientProperties["texture"]
        calories += quantity * ingredientProperties["calories"]

    if capacity < 0:
        capacity = 0
    if durability < 0:
        durability = 0
    if flavor < 0:
        flavor = 0
    if texture < 0:
        texture = 0
    if calories < 0:
        calories = 0

    return (capacity * durability * flavor * texture), calories

def findPerfectRecipe(ingredients, caloriesPerCookie = 0):
    maxScore = 0
    bestScoreWithCalories = 0
    numIngredients = len(ingredients)

    for quantities in (permutations(range(100), numIngredients)):
        if sum(quantities) == 100:
            score, calories = calculateScore(ingredients, quantities)
            if calories == caloriesPerCookie:
                bestScoreWithCalories = max(bestScoreWithCalories, score)
            maxScore = max(maxScore, score)

    return maxScore, bestScoreWithCalories

ingredients = {}
with open('input.txt') as f:
    lines = f.readlines()

    for line in lines:
        line = line.split(':')

        if len(line) != 2:
            continue

        ingredients[line[0]] = {}

        for ingredientProperty in line[1].split(','):
            property, value = ingredientProperty.split()
            ingredients[line[0]][property] = int(value)

for ingredient, properties in ingredients.items():
    print(ingredient, properties)

print(findPerfectRecipe(ingredients, 500))