lines = []

with open('u/UnicodeData.txt') as mfile:
  for ln in mfile:
    lines.append(ln.split(';'))

atoc = ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE')

for cand in lines:
  if len(cand) < 3:
    print(cand)
  if ' ONE ' in cand[1]+' ':
    bad = False
    for cl in atoc:
      tofind = (cand[1]+' ').replace(' ONE ', ' '+cl+' ')
      found = False

      for c2 in lines:
        if c2[1]+' ' == tofind:
          found = True
          break

      if not found:
        bad = True
        break
    if not bad:
      print(cand[1])