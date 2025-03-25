import hashlib

secretKey = "yzbqklnj"

def getHex(string):
    return hashlib.md5(string.encode('utf-8')).hexdigest()

def findLongestNumber(string):
    number = 1
    while True:
        hexString = getHex(string + str(number))
        if hexString[:5] == "00000":
            return number, hexString, string + str(number)
        number += 1

print(findLongestNumber("abcdef"))
print(findLongestNumber("pqrstuv"))
print(findLongestNumber(secretKey))