import json

combining = []
with open('comb.file') as f:
  for l in f:
    l = l.strip().split(';')
    combining.append(int(l[0], 16))
    combining.append(l[1])

print(json.dumps(combining))
    