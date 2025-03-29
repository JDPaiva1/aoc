import re

def decodeASCII(string):
    string = string[1:-1]
    if '\\x' in string:
        chars = re.findall(r'\\x[0-9a-fA-F]{2}', string)
        for char in chars:
            decodeChar = chr(int(char[2:], 16))
            string = string.replace(char, decodeChar)
    return string

def countCharInMemory(string):
    string = decodeASCII(string)
    count = len(re.findall(r'\\\\|\\\"', string))
    string = string.replace('\\\\', '').replace('\\"', '')
    return count + len(string)


numberCharsOfCode = 0
numberCharInMemory = 0

with open('input.txt') as f:
    for line in f:
        line = line.strip().replace(' ', '')
        numberCharsOfCode += len(line)
        numberCharInMemory += countCharInMemory(line)

print(numberCharsOfCode, numberCharInMemory, numberCharsOfCode - numberCharInMemory)
