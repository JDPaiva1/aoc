EXIT = "Exit"

registers = {
    "a": 0,
    "b": 0
}

def getInstructions(file):
    with open(file, "r") as f:
        return f.readlines()

def parseInstruction(instruction):
    parts = instruction.split()
    i = parts[0]
    r = parts[1].replace(',', '') if len(parts) > 1 else None
    offset = int(parts[2]) if len(parts) > 2 else None
    return i, r, offset

def executeInstruction(instruction):
    instruction, r, offset = parseInstruction(instruction)
    print(instruction, r, offset)
    if instruction and r:
        if instruction == "hlf":
            registers[r] //= 2
            return 1
        elif instruction == "tpl":
            registers[r] *= 3
            return 1
        elif instruction == "inc":
            registers[r] += 1
            return 1
        elif instruction == "jmp" and r:
            return int(r)
        elif instruction == "jie" and offset:
            return offset if registers[r] % 2 == 0 else 1
        elif instruction == "jio" and offset:
            return offset if registers[r] == 1 else 1
        else:
            return EXIT
    else:
        return EXIT

def main(instructions):
    pointer = 0
    while 0 <= pointer < len(instructions):
        offset = executeInstruction(instructions[pointer])
        if offset == EXIT:
            return
        pointer += offset


instructions = getInstructions("input.txt")
main(instructions)
print(registers)