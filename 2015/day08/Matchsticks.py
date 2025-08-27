import re

def decodeASCII(string):
    string = string[1:-1]
    encodedCharsLength = 0
    if '\\x' in string:
        chars = re.findall(r'\\x[0-9a-fA-F]{2}', string)
        encodedCharsLength = len(chars)
        for char in chars:
            decodeChar = chr(int(char[2:], 16))
            string = string.replace(char, decodeChar)
    return string, encodedCharsLength

def countCharInMemory(string):
    string, encodedCharsLength = decodeASCII(string)
    scapedCharsLenght = string.count('\\\\') + string.count('\\"')
    string = string.replace('\\\\', '').replace('\\"', '')
    return scapedCharsLenght + len(string), encodedCharsLength, scapedCharsLenght


numberCharsOfCode = 0
numberCharsOfCodeEncoded = 0
numberCharsInMemory = 0

with open('input.txt') as f:
    for line in f:
        line = line.strip().replace(' ', '')
        numberCharsOfCode += len(line)
        charsInMemory, encodedCharsLength, scapedCharsLenght = countCharInMemory(line)
        numberCharsInMemory += charsInMemory
        numberCharsOfCodeEncoded += len(line) + 4 + encodedCharsLength + (scapedCharsLenght * 2)

print(numberCharsOfCode, numberCharsInMemory, numberCharsOfCodeEncoded)
print(numberCharsOfCode - numberCharsInMemory, numberCharsOfCodeEncoded - numberCharsOfCode)
