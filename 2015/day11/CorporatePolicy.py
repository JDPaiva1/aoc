def incrementLetter(char):
    if char == 'z':
        return 'a'
    # Second requirement
    if char in 'hkn':  # letter before i,l,o
        return chr(ord(char) + 2)
    return chr(ord(char) + 1)

def incrementString(string):
    chars = list(string)
    i = len(chars) - 1

    while i >= 0:
        oldChar = chars[i]
        chars[i] = incrementLetter(oldChar)
        if oldChar != 'z':
            break
        i -= 1

    return ''.join(chars)

# First requirement
def threeCharStraight(string):
    for i in range(len(string)-2):
        first = string[i]
        second = string[i+1]
        third = string[i+2]
        if ord(second) == ord(first) + 1 and ord(third) == ord(first) + 2:
            return True
    return False

# Third requirement
def containsPairTwice(string):
    pairs = set()
    i = 0
    while i < len(string) - 1:
        if string[i] == string[i+1]:
            pairs.add(string[i])
            i += 2
        else:
            i += 1
        if len(pairs) >= 2:
            return True
    return False

def findPassword(password):
    while True:
        password = incrementString(password)
        if containsPairTwice(password) and threeCharStraight(password):
            return password

print(findPassword('vzbxkghb'))
print(findPassword('vzbxxyzz'))