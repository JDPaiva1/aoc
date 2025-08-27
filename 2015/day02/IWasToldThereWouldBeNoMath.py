def calft2Wrapping(length, width, height):
    lw = length * width
    wh = width * height
    hl = height * length
    return 2 * (lw + wh + hl) + min(lw, wh, hl)

def calRibbon(length, width, height):
    smallPerimeter = sorted([length, width, height])[:2]
    sumSmall = sum(smallPerimeter)
    cubic = length * width * height
    return sumSmall + sumSmall + cubic

def calTotal(filename):
    totalWrapping = []
    totalRibbon = []
    with open(filename, 'r') as file:
        for line in file:
            if len(line.strip().split('x')) == 3:
                dimensions = [int(x) for x in line.strip().split('x')]
                totalWrapping.append(calft2Wrapping(*dimensions))
                totalRibbon.append(calRibbon(*dimensions))
    return sum(totalWrapping), sum(totalRibbon)

print(calTotal('input.txt'))