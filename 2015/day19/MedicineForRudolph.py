from test.pyclbr_input import a
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

replacements, medicineMolecule = processInput("input.txt")

generatedMolecules = generateMoleculesCalibration(replacements, medicineMolecule)
print(len(generatedMolecules))
