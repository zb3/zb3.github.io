"""
not that brilliant idea -> we could compress the literal using gzip
dafuq...

var mapsEncode = {'name': {'g': 'G'}};

assumption: input stuff does not contain surrogates, so we'll be able to use
map[str[x]]

unfortunately, it won't work like that the other way...
"""
import json
import zlib
import base64

fname = 'ourmaps.file'
mapsencode = {}
decode = {}
curmap = None

with open(fname) as fl:
  for line in fl:
    if len(line) and line[0] == '@':
      curmap = {}
      mapsencode[line[1:-1]] = curmap
    else:
      line = line.split(';')
      curmap[chr(int(line[1], 16))] = chr(int(line[0], 16))
      decode[int(line[0], 16)] = chr(int(line[1], 16))

a = {'encode': mapsencode, 'decode': decode}
#print(json.dumps(a).encode('ascii'))
#print(base64.b64encode(zlib.compress(json.dumps(a).encode('ascii'))))

f = open('burganglur', 'wb')
f.write(base64.b64encode(zlib.compress(json.dumps(a).encode('ascii'), 9)))
#f.write(json.dumps(a).encode('ascii'))
f.close()


