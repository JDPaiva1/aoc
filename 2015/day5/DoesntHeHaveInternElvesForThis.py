def containsThreeVowels (string):
    return len([x for x in string if x in 'aeiou']) >= 3

def containsLetterTwiceInRow(string):
    for index, letter in enumerate(string):
        if letter == string[index+1:index+2]:
            return True
    return False

def doesNotContain(string):
    naughtyStrings = ('ab', 'cd', 'pq', 'xy')
    return not any(x in string for x in naughtyStrings)

def isNice(string):
    return containsThreeVowels(string) and containsLetterTwiceInRow(string) and doesNotContain(string)

# print(isNice('ugknbfddgicrmopn'))
# print(isNice('aaa'))
# print(isNice('jchzalrnumimnmhp'))
# print(isNice('haegwjzuvuyypxyu'))
# print(isNice('dvszwmarrgswjxmb'))

def countNice(filename):
    nice = 0
    with open(filename, 'r') as file:
        for line in file:
            if isNice(line.strip()):
                nice += 1
    return nice

print(countNice('input.txt'))