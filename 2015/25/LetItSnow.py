def getCodeFromPrevious(code):
    MULTIPLIER = 252533
    DIVISOR = 33554393
    return (code * MULTIPLIER) % DIVISOR

def getCodeFromRowCol(row, col):
    d = row + col - 1
    return (d - 1) * d // 2 + col

def getCode(row, col):
    code = 20151125
    for _ in range(getCodeFromRowCol(row, col) - 1):
        code = getCodeFromPrevious(code)
    return code

print(getCode(3010, 3019))