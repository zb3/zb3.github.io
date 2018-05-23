const {extractHex, extractText} = require('./hdump');

const hexCases = [['  00 61 00 4f 00   E.R.V.E.R.s.a.O.\n\
0070  53 00 51 00 4c 00 2d 00 33 00 32 00 38 00 39 00   S.Q.L.-.3.2.8.9.\n\
0080  2e 00 37 00 38 00 2e 00 31 00 33 00 35 00 2e 00   ..7.8...1.3.5...\n\
0090  34 00 30 00 4f 00 44 00 42 00 43 00               4.0.O.D.B.C.    ', '0061004f00530051004c002d0033003200380039002e00370038002e003100330035002e00340030004f00440042004300'], 
//now this'll invoke the traceback - NOPE, rule4
['  00 61 00 4f 00   E.R.V.E.R.s.a.O.\n\
0070  53 00 51 00 4c 00 2d 00 33 00 32 00 38 00 39 00   ff0ff8..3.2.8.9.\n\
0180  2e 00 37 00 38 00 2e 00 31 00 33 00 35 00 2e 00   ff0ff8..1.3.5...\n\
0590  34 00 30 00 4f 00 44 00 42 00 43 00               4.0.O.D.B.C.    ', '0061004f00530051004c002d0033003200380039002e00370038002e003100330035002e00340030004f00440042004300'],
//rule 4'd be helpful here
['  00 61 00 4f 00   E.R.V.E.R.s.a.O.\n\
0070  53 00 51 00 4c 00 2d 00 33 00 32 00 38 00 39 00   S.Q.L.-.3.2.8.9.\n\
0080  2e 00 37 00 38 00 2e 00 31 00 33 00 35 00 2e 00   ff ff8..1.3.5...\n\
0190  34 00 30 00 4f 00 44 00 42 00 43 00               4.0.O.D.B.C.    ', '0061004f00530051004c002d0033003200380039002e00370038002e003100330035002e00340030004f00440042004300'],
['  00 61 00 4f 00   E.R.V.E.R.s.a.O.\n\
0190  34 00 30 00 4f 00 44 00 42 00 43 00               4.0.O.D.B.C.    ', '0061004f00340030004f00440042004300'],
['  00 61 00 4f 00   E.R.V.E.R.s.a.O.\n\
      34 00 30 00 4f 00 44 00 42 00 43 00               4.0.O.D.B.C.    ', '0061004f00340030004f00440042004300'],
['00000110  31 2e 30 20 55 50 6e 50  2d 44 65 76 69 63 65 2d   1.0 UPnP -Device-\n\
00000120  48 6f 73 74 2f 31 2e 30  0d 0a 0d 0a               Host/1.0 ....\n\
0000012C  4e 4f 54 49 46 59 20 2a  20 48 54 54 50 2f 31 2e   NOTIFY *  HTTP/1.', '312e302055506e502d4465766963652d486f73742f312e300d0a0d0a4e4f54494659202a20485454502f312e'],
['0008820 0008 0000 0000 0000 00c8 0000 0001 0000', '000800000000000000c8000000010000'],
['0008820 0008 0000 0000 0000 00c8 0000 0001 0000\n\
0f08830 0003 0000 0000 0000 7e18 0060 0000 0000', '000800000000000000c800000001000000030000000000007e18006000000000'],
['99ffff99,', '99ffff99'],
['', '']
];

const textCases = [['eh_frame_\n\
000082d0: 6864 7200 2e65 685f 6672 616d 6500 2e69  hdr', 'eh_frame_hdr'],
['version..gnu.ve\n\
00008290: 7273 696f 6e5f 7200 2e72 656c 612e 6479  rsion_r..rela.dy\n\
000082a0: 6e00 2e72 656c 612e 706c 7400 2e69 6e69  n..rela.plt', 'version..gnu.version_r..rela.dyn..rela.plt'],
['00008210: 0100 0000 4743 433a 2028 474e 5529 2036  ....GCC: (GNU) 6\n\
00008220: 2e33 2e31 2032 3031 3730 3330 3600 002e  .3', '....GCC: (GNU) 6.3'],
['parse_shell\n\
0000F230   6F 70 74 73  00 70 61 72  73 65 5F 73  74 72 69 6E  opts', 'parse_shellopts'],
['__st\n\
0000F1C0   72 74 6F 75  6C 5F 69 6E  74 65 72 6E  61 6C 00 73  rtoul_internal.s\n\
0000F1D0   79 73 63 6F  6E 66 00 67  65 74 73 65  72 76 65 6E  ysconf.getserven\n\
0000F1E0   74 00 77 63  74 6F 6D 62  00 5F 5F 65  6E 76 69 72  t.wctomb', '__strtoul_internal.sysconf.getservent.wctomb'],
['__st\n\
  72 74 6F 75  6C 5F 69 6E  74 65 72 6E  61 6C 00 73  rtoul_internal.s\n\
  79 73 63 6F  6E 66 00 67  65 74 73 65  72 76 65 6E  ysconf.getserven\n\
  74 00 77 63  74 6F 6D 62  00 5F 5F 65  6E 76 69 72  t.wctomb', '__strtoul_internal.sysconf.getservent.wctomb'],
['aaa\n\
333333333333333333333333333333', 'aaa3333333333'],
['', '']];


for(let t=0;t<hexCases.length;t++)
{
 const output = extractHex(hexCases[t][0])
 
 console.log(`Hex case #${t+1}:`, output===hexCases[t][1] ? 'OK' : 'FAIL');
 if (output !== hexCases[t][1])
 {
  console.log('Output:', output);
  //break;
 }
}

for(let t=0;t<textCases.length;t++)
{
 const output = extractText(textCases[t][0])
 
 console.log(`Text case #${t+1}:`, output===textCases[t][1] ? 'OK' : 'FAIL');
 if (output !== textCases[t][1])
 {
  console.log('Output:', output);
  //break;
 }
}