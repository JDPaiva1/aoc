def calft2Wrapping(length, width, height):
    lw = length * width
    wh = width * height
    hl = height * length
    return 2 * (lw + wh + hl) + min(lw, wh, hl)

def calTotalft2Wrapping(filename):
    with open(filename, 'r') as file:
        return sum(
            calft2Wrapping(*map(int, line.strip().split('x')))
            for line in file
            if len(line.strip().split('x')) == 3
        )

print(calTotalft2Wrapping('input.txt'))