input = '1321131112'
print(input)

def lookAndSay(input):
    output = ''
    count = 1
    currectDigit = input[0]

    for i in range(1, len(input)):
        if input[i] == currectDigit:
            count += 1
        else:
            output += str(count) + currectDigit
            count = 1
            currectDigit = input[i]
    output += str(count) + currectDigit
    return output

for i in range(0, 40):
    input = lookAndSay(input)

print(len(input))
