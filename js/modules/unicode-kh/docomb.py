
fname = 'comb.file'
datafile = 'u/UnicodeData.txt'
datalines = []
newcontents = ''

with open(fname) as fl:
  for line in fl:
    if len(line)<2 or line[0] == '@': continue
    line = line.strip().split(';')
    mapdict[line[0]] = line[1]

with open(datafile) as fl:
  for line in fl:
    line = line.strip().split(';')
    datalines.append(line)

def addcontents():
  with open(fname, 'a') as fl:
    fl.write(newcontents)

def addbyprefix(p):
  global newcontents
  for dataline in datalines:
    if dataline[1].startswith(p):
      newcontents += dataline[0] + ';' + dataline[1][10:].lowercase()+'\n'

addbyprefix('COMBINING ')
print(newcontents)
 
addcontents()



