tcLoad('CUtils', (function(){

var CUtils = {};

function isCharCText(c) {return (c == 0x09 || c == 0x0a || c == 0x0d || (c >= 0x20 && c <= 0x7e))}

CUtils.replaceCArrays = function(str)
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
};

CUtils.transformCLiterals = function(str, cb, args)
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
};

CUtils.strToCArray = function(str, utf8)
{
 if (utf8)
 str = utf8encode(str);
 
 var ret = [];
 
 for(var t=0;t<str.length;t++)
 {
  ret.push(cescape(str[t], true));
 }
 
 return '{'+ret.join(', ')+'}';
};

CUtils.cLiteralsToArrays = function(str, utf8)
{
 return CUtils.transformCLiterals(str, CUtils.strToCArray, utf8);
};


CUtils.cEscapeSeparated = function(str, opts)
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
};


CUtils.cSeparateLiterals = function(str, opts)
{
 return CUtils.transformCLiterals(str, CUtils.cEscapeSeparated, opts);
};


CUtils._replaceCArrays = function(args, str){ return CUtils.replaceCArrays(str);};
CUtils.doConvertToCArray = function(args, str)
{
 if (args.mode)
 return CUtils.cLiteralsToArrays(str, args.utf8);
 else
 return CUtils.strToCArray(str, args.utf8);
};
CUtils.doSeparateCLiterals = function(args, str){ return CUtils.cSeparateLiterals(str, args);};


return {export: CUtils};

})());
//# sourceURL=cutils.js