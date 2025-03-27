wires = {}

def getValue(operand):
    try:
        return int(operand)
    except ValueError:
        return wires.get(operand)

def bitwiseAnd(a, b):
    val_a = getValue(a)
    val_b = getValue(b)
    if val_a is not None and val_b is not None:
        return (val_a & val_b) & 0xFFFF
    return None

def bitwiseOr(a, b):
    val_a = getValue(a)
    val_b = getValue(b)
    if val_a is not None and val_b is not None:
        return (val_a | val_b) & 0xFFFF
    return None

def bitwiseNot(wire):
    value = getValue(wire)
    if value is not None:
        return ~value & 0xFFFF
    return None

def bitwiseShiftLeft(id, shift):
    value = getValue(id)
    if value is not None:
        return (value << int(shift)) & 0xFFFF
    return None

def bitwiseShiftRight(id, shift):
    value = getValue(id)
    if value is not None:
        return (value >> int(shift)) & 0xFFFF
    return None

def processCircuit(instructions):
    while True:
        newWires = {}
        completedInstructions = 0

        for instruction in instructions:
            parts = instruction.split()
            providedWire = parts[-1]
            value = None

            if providedWire in wires:
                completedInstructions += 1
                continue

            if '->' in instruction and len(parts) == 3:
                value = getValue(parts[0])
            elif 'NOT' in instruction:
                value = bitwiseNot(parts[1])
            elif 'AND' in instruction:
                value = bitwiseAnd(parts[0], parts[2])
            elif 'OR' in instruction:
                value = bitwiseOr(parts[0], parts[2])
            elif 'LSHIFT' in instruction:
                value = bitwiseShiftLeft(parts[0], parts[2])
            elif 'RSHIFT' in instruction:
                value = bitwiseShiftRight(parts[0], parts[2])
            else:
                completedInstructions += 1

            if value is not None:
                newWires[providedWire] = value

        wires.update(newWires)

        if 'a' in wires:
            return wires['a']

with open("input.txt", "r") as f:
    instructions = [line.strip() for line in f]

signalA = processCircuit(instructions)
print("Part 1: Signal on wire a:", signalA)

if signalA is not None:
    wires.clear()
    wires["b"] = signalA
    print("Part 2: Signal on wire a (with override):", processCircuit(instructions))