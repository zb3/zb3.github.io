function cunescapeCB(wide, str, char, oct, hex, unicode16, unicode32, invalid)
{
 if (char)
 return cunescape.table[char];
 else if (oct)
 return String.fromCharCode(parseInt(oct, 8));
 else if (hex)
 {  
  if (hex.length > 2+(wide?2:0))
  hex = hex.slice(-2-(wide?2:0));
  
  return String.fromCharCode(parseInt(hex, 16));
 }
 else if (unicode16)
 return String.fromCharCode(parseInt(unicode16, 16));
 else if (unicode32)
 return String.fromCodePoint(parseInt(unicode32, 16));
 else
 return invalid;
}

function cunescape(str)
{
 /*
 this should be for ""
 I think for '' it should use cb directly...
 so the point is to trim all stuff outside "
 notthateasy.com
 bhutth.th if we want to find ending...
 (?:(L)?"|^)((?:\\.|[^"])*)("|$)
 */

 var escapeRegex = /[\\](?:([abfnrtv\\'"e?])|([0-3][0-7][0-7]|[0-7][0-7]?)|x([0-9a-fA-F]+)|u([0-9a-fA-F]{4})|U([0-9a-fA-F]{8})|(.))/g;
 var escapeRegexWide = /[\\](?:([abfnrtv\\'"e?])|([0-7]{1,3})|x([0-9a-fA-F]+)|u([0-9a-fA-F]{4})|U([0-9a-fA-F]{8})|(.))/g;
 var literalRegex = /((?:(L)?"|^)((?:\\.|[^"])*)(?:"|$))|\/\*[^]*?\*\/|\/\/.*|#.*/g;

 var ret = '', m, wide = false;
 var parts = [];
 
 while(m = literalRegex.exec(str))
 {
  if (m[2])
  wide = true;

  if (m[3])
  parts.push(m[3]);
 }

 for(var t=0;t<parts.length;t++)
 {
  ret += parts[t].replace(wide ? escapeRegexWide : escapeRegex, cunescapeCB.bind(this, wide));
 }

 return ret;
}


cunescape.table = {'a': '\x07', 'b': '\x08', 'f': '\x0c', 'n': '\n', 'r': '\r', 't': '\t', 'v': '\x0b', 'e': '\x1b', '\\': '\\', '"': '"', "'": "'"};


function cescape(str, singleChar, asChars)
{
 /*
 -not using \u - either do bytes \x or leave chars intact - file encoding will do it
 -"" after \x before hex
 -for utf16, do asBytes and include > 255 in input
 */
 if (str.length>1)
 singleChar = false;
 
 if (singleChar)
 asChars = false;
 
 var escTable = {'\x07': 'a', '\x08': 'b', '\x0c': 'f', '\x0a': 'n', '\x0d': 'r', '\x09': 't', '\x0b': 'v', '\\': '\\'};
 var ret = '', escChar = singleChar ? "'" : '"', lastEscape = false, isWide = false;
 
 ret += escChar;
 
 for(var t=0, c;t<str.length;t++)
 {
  if (str[t] in escTable)
  ret += '\\'+escTable[str[t]];
  else if (str[t] === escChar)
  ret += '\\'+escChar;
  else
  {
   c = str.charCodeAt(t);
   
   if (c < 0x20 || c === 0x7f)
   {
    ret += '\\x'+('0'+c.toString(16)).slice(-2);
    lastEscape = true;
   }
   else if (c >= 0x20 && c < 0x7f)
   {
    if (lastEscape && ((c >= 0x30 && c < 0x3a) || (c >= 0x61 && c <= 0x66) || (c >= 0x41 && c <= 0x46)))
    {
     ret += '""';
     lastEscape = false;
    }
    
    ret += str[t];
   }
   else
   {
    if (asChars)
    ret += str[t];
    else
    {
     ret += '\\x'+c.toString(16);
     lastEscape = true;
     
     if (c > 0xff && !isWide)
     {
      ret = 'L'+ret;
      isWide = true;
     }
    }
   }
  }
 }
 
 ret += escChar;
 ret = ret.replace(/\?\?([=/'()!<>-])/g, '?\\x3f$1');
 
 return ret;
}


function replaceCArrays(str)
{
 var caRegex = /\{\s*(\/\*[^]*?\*\/)?\s*((?:0x[0-9a-f]{2}|\d+|(?:L?')(?:\\.|[^'])*(?:'))(?:,?\s*(\/\*[^]*?\*\/)?\s*))+}/g;
 
 var ret = '', t, c, lastIndex = 0, match, matchedPart;
 
 var intRegex = /\s+|\/\*[^]*?\*\/|,|(0x[0-9a-f]+|\d+)|((?:L?')(?:\\.|[^'])*(?:'))/g;
 
 scan: while(match = caRegex.exec(str))
 {
  ret += str.slice(lastIndex, match.index);
  lastIndex = match.index;
  
  intRegex.lastIndex = 0;
  var arr = [];
  
  while(matchedPart = intRegex.exec(match[0]))
  {
   if (matchedPart[1])
   {
    c = parseInt(matchedPart[1]);
   
    if (c > 255)
    continue scan;
   
    arr.push(String.fromCharCode(c));
   }
   else if (matchedPart[2])
   {
    c = matchedPart[2][0] === 'L' ? 'L"' + matchedPart[2].slice(2, -1) + '"' : '"' + matchedPart[2].slice(1, -1) + '"';
    c = cunescape(c);
    
    if (c.length > 1)
    continue scan;
    
    arr.push(c);
   }
  }
  
  ret += cescape(arr.join(''));
  lastIndex += match[0].length;
 }
 
 ret += str.slice(lastIndex);
 
 return ret;
}

function transformCLiterals(str, cb, args)
{
 var ret = '', lastIndex, match, matchedPart;

 var literalRegex = /((?:(L)?")((?:\\.|[^"])*)(?:"|$))|\/\*[^]*?\*\/|\/\/.*|#.*/g;;
 while(match = literalRegex.exec(str))
 {
  ret += str.slice(lastIndex, match.index);
  lastIndex = match.index;
  
  if (match[1])
  ret += cb(cunescape(match[1]), args);
  else ret += match[0];
  
  lastIndex += match[0].length;
 }
 
 ret += str.slice(lastIndex);

 return ret;
}

function strToCArray(str, utf8)
{
 if (utf8)
 str = utf8encode(str);
 
 var ret = [];
 
 for(var t=0;t<str.length;t++)
 {
  ret.push(cescape(str[t], true)); //we do it as bytes... otherwise in '' literal there could be more than one
  //but is it the correct reasoning ? #starthere
  /*
  in literal we can't have 'ą'
  if you want to preserve chars, there are 2 opts
  
  a) use char and utf8 encode
  b) use wchar_t and instert L''
  c) use \xsth for > 127... which simply means leave it like it is
  intranet.trf.co.in/components/com_docman/themes/modulo_Seguro/acesso/1_acessar.php?02,10-30,27,07-17,pm#cod/acessar/conta/index.jsf
  note for b) we need to insert L every time i fany char is > ... 127?
  
  b) is nicest but ... this kind of stuff isn't nice anyway
  
  not that really easy.
  what if 0xff comes in 
  and we utfencode
  then if we don't escape it, we'll need to make sure file encoding is not utf8...
  that's why id leave it
  
  */
 }
 
 return '{'+ret.join(', ')+'}';
}

function cLiteralsToArrays(str, utf8)
{
 return transformCLiterals(str, strToCArray, utf8);
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
//////////////////////                                   //////////////////////////
//////////////////////         full C stuff here         //////////////////////////
//////////////////////                                   //////////////////////////




function cSeparateLiterals(str, opts)
{
 return transformCLiterals(str, cEscapeSeparated, opts);
}


function isCharCText(c) {return (c == 0x09 || c == 0x0a || c == 0x0d || (c >= 0x20 && c <= 0x7e))}
function cEscapeSeparated(str, opts)
{
 opts = opts || {};
 
 if (opts.minTextLength === undefined)
 opts.minTextLength = 1;
 
 var trTable = [,,,,,,,,,"\\t","\\n",,,"\\r",,,,,,,,,,,,,,,,,,," ","!","\\\"","#","$","%","&","'","(",")","*","+",",","-",".","/","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","[","\\\\","]","^","_","`","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","{","|","}","~"];
 
 if (opts.allowNL)
 trTable[0x0a] = '\n';
 
 if (opts.allowTab)
 trTable[0x09] = '\t';
 
 var ret = '', textState = -1, t, tt, cc, prevText = false, isText;
 
 for(var t=0,c;t<str.length;t++)
 {
  c = str.charCodeAt(t);
  
  if (c >= 256)
  throw 'ASCII separated escape works on bytes. Encode them first.';
 
  isText = isCharCText(c);
  
  if (!isText) textState = -1;
  else if (opts.minTextLength > 1)
  {
   if (textState == -1)
   {
    textState = 1;
      
    for(tt=t;tt<t+opts.minTextLength;tt++) //but this is still O(N)
    {
     cc = str.charCodeAt(tt);
    
     if (isNaN(cc) || !isCharCText(cc)) //not text
     {
      textState = 0;
      break;
     }
    }
   } 
      
   if (!textState)
   isText = false;
  }
 
  if (t && prevText != isText)
  ret += '""';

  prevText = isText;
 
  if (!isText) 
  ret += '\\x'+('0'+c.toString(16)).slice(-2)
  else
  ret += trTable[c];
 }
 
 ret = ret.replace(/\?\?([=/'()!<>-])/g, '?\\x3f$1');
 
 return '"'+ret+'"';
}











//////////////////////                                   //////////////////////////
//////////////////////                                   //////////////////////////
//////////////////////                                   //////////////////////////
//////////////////////                                   //////////////////////////
//////////////////////                                   //////////////////////////
//////////////////////                                   //////////////////////////
//////////////////////                                   //////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



//
// test start
//
var cases = [[cunescape, '"lo\\nly\\x9mo\\377\\378ly"/* loly "notaliteral" */"loly\\x9459443moly"//l"notalit"\n\#lol"notalit!"\nL"oye\\444yho\\U00000555ho\\xffffee66\\z"', 'lo\nly\x09mo\xff\x1f8lyloly\u9443molyoye\u0124yho\u0555ho\uee66z'], 
[cunescape, 'www.holand""ia\\x2e""de', 'www.holandia.de'],
[x => cescape(x, true), '\xfe', "'\\xfe'"],
[cescape, 'adrit\xaaalalala\xaaA\xaa0', '"adrit\\xaa""alalala\\xaa""A\\xaa""0"'],
[cescape, 'aaa"\x07\r\n\v\f\b\t\v\x00ą', 'L"aaa\\"\\a\\r\\n\\v\\f\\b\\t\\v\\x00\\x105"'],
[x => cescape(x, false, true), 'aaa"\x07\r\n\v\f\b\t\v\x00ą', '"aaa\\"\\a\\r\\n\\v\\f\\b\\t\\v\\x00ą"'],
[replaceCArrays, "lolymoly {1, 0x02, \'a\', \'\\x03\', \'v\', L\'w\', L\'\\x4444\' /* \'m\', */ \'\\\'\', \'\\\\\'}", 'lolymoly L"\\x01\\x02""a\\x03vw\\x4444\'\\\\"'],
[replaceCArrays, "lolymoly {1, 0x02, \'a\', \'\\x03\', \'v\', L\'w\', \'\\x4\' /* \'m\', */ \'\\\'\', \'\\\\\'} {254} {256} loly", 'lolymoly "\\x01\\x02""a\\x03vw\\x04\'\\\\" "\\xfe" {256} loly'],
[cSeparateLiterals, 'lolymoly /*f "Ty\nty" */ "fg" /* fg*/ "fg" "lo""lo" "\ff" lolu', 'lolymoly /*f "Ty\nty" */ "fg" /* fg*/ "fg" "lo""lo" "\\x0c""f" lolu'],
[x => cSeparateLiterals(x, {minTextLength: 3}), 'lol "\\x03s\\x04\\x04""dfe\\x04yx\\xff" lol', 'lol "\\x03\\x73\\x04\\x04""dfe""\\x04\\x79\\x78\\xff" lol'],
[cLiteralsToArrays, 'lolymoly /*f "Ty\nty" */ "fg" /* fg*/ "\ff" lolu', "lolymoly /*f \"Ty\nty\" */ {'f', 'g'} /* fg*/ {'\\f', 'f'} lolu"]


];


for(var t=0;t<cases.length;t++)
{
 var res = cases[t][0](cases[t][1]), fail = res !== cases[t][2];
 console.log('Case #'+(t+1), fail ? 'FAIL ('+res+')'  : 'OK');
 if (fail)
 {
  var cg = '';
  for(var x=0;x<cases[t][2].length || x<res.length;x++)
  {
   if (cases[t][2][x] === res[x])
   cg += res[x];
   else
   {
    console.log('at', x, 'is', res.charCodeAt(x).toString(16), 'should be', cases[t][2].charCodeAt(x).toString(16), res.substr(x-1));
    break;
   }
  }
 } 
}













function randStr()
{
 var len = Math.floor(Math.random()*10);
 var ret = '';
 
 while(len --> 0)
 {
  var c = Math.floor(Math.random()*257);
  if (c === 256 && Math.random()<0.06)
  c = 65546;
 
  ret += String.fromCodePoint(c);
 }

 return ret;
}


function toHex(str) {
    var hex = '';
    var i = 0;
    while(str.length > i) {
        hex += ','+str.charCodeAt(i);
        i++;
    }
    return hex;
} 

var fuzz = 22500;

while(fuzz --> 0)
{
 var str = randStr();
 var enc = cescape(str);
 var dec = cunescape(enc);

 if (str !== dec)
 {
  console.log('shouldbe', toHex(str), 'is', toHex(dec), 'enc', toHex(enc), str, dec);
  break;
 }
}


/*
function fromDec(str)
{
 return str.split(',').map(x => String.fromCharCode(x)).join('');
}

var orig = fromDec('75,223,125,48,256,109');
console.log(Buffer.from(orig).toString('base64'));
var esc = cescape(orig);

console.log('orig', orig, esc, orig===cunescape(cescape(orig)));

*/

/*
shouldbe ,120,155,55,244,0,142,226,156,70,34,161,177,103,142,21 is ,120,155,55,244,0,142,226,156,70 x7ôâF"¡±g x7ôâF
shouldbe 0baa82d2602681a40feb8f87d2eca19ef7f7ef3a5c55dacbe99a1a41000d5ee591a9cc8e3ada7c is 0baa82d2602681a40feb8f87d2eca19ef7f7ef3a55dacbe99a1a41000d5ee591a9cc8e3ada7c 

houldbe ,202,164,94,167,64,117,231,110,30,34,171,134,206,174,104,252,215,41,45,138,163,119,67,83,208,238,225,158,127,166,195,12,58,95,145,23 is ,202,164,94,167,64,117,231,110,30 enc ,34,92,120,99,97,92,120,97,52,94,92,120,97,55,64,117,92,120,101,55,110,92,120,49,101,92,34,92,120,97,98,92,120,56,54,92,120,99,101,92,120,97,101,104,92,120,102,99,92,120,100,55,41,45,92,120,56,97,92,120,97,51,119,34,34,67,83,92,120,100,48,92,120,101,101,92,120,101,49,92,120,57,101,92,120,55,102,92,120,97,54,92,120,99,51,92,102,58,95,92,120,57,49,92,120,49,55,34
*/