"""
now a big surprise...
tag mapping
"""

fname = 'ourmaps.file'
datafile = 'u/UnicodeData.txt'
mapdict = {}
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

def firstchar(str):
  for dataline in datalines:
    if str in dataline[1]:
      return dataline[0]

def addbyprefix(p):
  global newcontents
  for dataline in datalines:
    if dataline[1].startswith(p) and not dataline[0] in mapdict:
      realchar = firstchar(dataline[1][4:]) #dataline[5][-4:]
      mapdict[dataline[0]] = realchar
      newcontents += dataline[0] + ';' + realchar+';'+dataline[1]+'\n'

addbyprefix('TAG')
print(newcontents)
 
addcontents()



