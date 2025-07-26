from collections import deque
import random

def processInput(fileName):
  replacements = []
  molecule = ""
  with open(fileName, 'r') as file:
    for line in file:
      line = line.strip()
      if (line == ""):
        continue
      if(" => " in line):
        line = line.split(" => ")
        replacements.append((line[0], line[1]))
      else:
        molecule += line
  return replacements, molecule

def generateMoleculesCalibration(replacements, molecule):
  molecules = set()
  for key, value in replacements:
    for i in range(len(molecule)):
      if molecule[i:i+len(key)] == key:
        molecules.add(molecule[:i] + value + molecule[i+len(key):])
  return molecules

def moleculeFabricationOptimized(replacements, target_molecule):
    """Work backwards from target to 'e' using greedy approach"""
    # Create reverse replacements (value => key)
    reverse_replacements = [(value, key) for key, value in replacements]
    # Sort by length of replacement (longest first for greedy approach)
    reverse_replacements.sort(key=lambda x: len(x[0]), reverse=True)
    
    current = target_molecule
    steps = 0
    
    while current != "e":
        found_replacement = False
        for old, new in reverse_replacements:
            if old in current:
                current = current.replace(old, new, 1)  # Replace only first occurrence
                steps += 1
                found_replacement = True
                break
        
        if not found_replacement:
            # If greedy doesn't work, try random approach
            return moleculeFabricationRandom(replacements, target_molecule)
    
    return steps

def moleculeFabricationRandom(replacements, target_molecule):
    """Fallback: Random approach with restarts"""
    reverse_replacements = [(value, key) for key, value in replacements]
    
    for attempt in range(1000):  # Try multiple times
        current = target_molecule
        steps = 0
        random.shuffle(reverse_replacements)
        
        while current != "e" and steps < 1000:
            old_current = current
            for old, new in reverse_replacements:
                if old in current:
                    pos = current.find(old)
                    current = current[:pos] + new + current[pos + len(old):]
                    steps += 1
                    break
            
            if current == old_current:  # No progress made
                break
        
        if current == "e":
            return steps
    
    return -1

replacements, medicineMolecule = processInput("input.txt")

generatedMolecules = generateMoleculesCalibration(replacements, medicineMolecule)
print(len(generatedMolecules))

steps = moleculeFabricationOptimized(replacements, medicineMolecule)
print(f"Part 2 - Minimum steps: {steps}")
