function readHexDumpAddr(line)
{
 var m = line.match(/^\s*([^\s]*)\s(?!$)/);

 if (!m || !m[1])
 return null;
 
 if (m[1].match(/^[0-9a-fA-F]{0,3}$/)) //pure hex without special chars less than 4 chars
 return null;
 
 m = m[1].replace(/[^a-fA-F0-9]/g, '');
 if (!m)
 return null;
 
 return parseInt(m, 16);
}
function hexDumpLinePrefixLength(str, addr)
{
 if (addr === undefined)
 addr = readHexDumpAddr(str);
 
 var ret;
 
 if (addr !== null)
 ret = str.match(/^\s*([^\s]+)[^a-fA-F0-9]*/)[0].length
 else
 ret = str.match(/^\s*/)[0].length; //we catch spaces to avoid detecting 4 consecutive spaces later
 
 return ret;
}

function extractHex(str)
{
 var lines = str.split('\n');
 //skip nonhex in first part like :,
 
 var ret = '';
 /*
 These are the rules:
 1. if you can read numbers via offets, don't read more than the difference in that line
 2. if you encounter 4 spaces, dont read more
 3. if nonhex char encountered, go back to last pre-space
 4. don't read more than max ~realistic~ value

 No guarantees regarding incomplete lines - not worth it
 */


 //read the longest line length, albeit a realistic one
 var lastAddr = readHexDumpAddr(lines[0]), longestLine = 0;
 for(var t=1;t<lines.length;t++)
 {
  var thisAddr = readHexDumpAddr(lines[t]);
  if (thisAddr !== null && lastAddr !== null)
  {
   var thisLen = thisAddr - lastAddr;
   if (thisLen > longestLine && thisLen*3 + 6 < lines[t].length) //is it "realistic"?
   longestLine = thisLen;
  }
  
  lastAddr = thisAddr;
 }

 longestLine = longestLine || Infinity;
 
 var mregex = /((?:[0-9A-Fa-f][0-9A-Fa-f]))|(\s{4})|(\s+)|./y;

 var nextAddr = readHexDumpAddr(lines[0])
 var tmp, remaining, prefixLength;
 var lastSpace;
 
 for(var t=0;t<lines.length;t++)
 {
  tmp = t == lines.length-1 ? null : readHexDumpAddr(lines[t+1]);
  if (tmp !== null && nextAddr !== null)
  {
   remaining = Math.min(tmp - nextAddr, longestLine);
  }
  else remaining = Infinity;
  
  prefixLength = hexDumpLinePrefixLength(lines[t], nextAddr);

 
  nextAddr = tmp;
  mregex.lastIndex = prefixLength;
  lastSpace = 0;

  while(m = mregex.exec(lines[t]))
  {
   if (m[1])
   {
    remaining--;
   } 
   else if (m[2]) break;
   else if (m[3])
   lastSpace = mregex.lastIndex; //end of space
   else
   {
    if (lastSpace) //trim to last space if nonascii
    mregex.lastIndex = lastSpace;
    break;
   }

   if (!remaining)
   break;
  }
  
  mregex.lastIndex = mregex.lastIndex || lines[t].length; //bcoz it may be undefined @ the end
  tmp = lines[t].slice(prefixLength, mregex.lastIndex).replace(/[^a-fA-F0-9]/g, '');
  ret += tmp;
 }

 return ret;
}


 

function extractText(str)
{
 var lines = str.split('\n');
 if (lines.length < 2)
 return str;
   
 var asciiIndex = 0;
   
 var firstLine = lines[0].length >= lines[1].length ? 0 : 1;
   
   
 if (!asciiIndex && lines.length-firstLine > 1)
 {
  //scan first full line until len(rest of line) == charsRead, this assumes no padding and no separator
  //is it even needed?
  var line = lines[firstLine];

  var mregex = /((?:[0-9A-Fa-f][0-9A-Fa-f]))|(\s)|./y;
  mregex.lastIndex = hexDumpLinePrefixLength(line);
  var m, curChars = 0;
  while(m = mregex.exec(line))
  {
   if (m[1]) curChars++;
   else if (m[2])
   {
    if (line.length-mregex.lastIndex === curChars)
    {
      asciiIndex = mregex.lastIndex;
      break;
     }
   }
   else break;
  }
 }
   
 var ret = firstLine ? lines[0] : '', m;
 var mregex = /((?:[0-9A-Fa-f][0-9A-Fa-f]))|(\s{4})|(\s)|./y;
 var readChars, lastGood;
   
 for(var t=firstLine;t<lines.length;t++)
 {
  if (asciiIndex)
  ret += lines[t].slice(asciiIndex);
  else
  {
   mregex.lastIndex = hexDumpLinePrefixLength(lines[t]);
     
   readChars = lastGood = '';
   
   //first condition checks whether if we advance by 2, we have at least 1 character left
   while(lines[t].length-mregex.lastIndex >= readChars.length+3 && (m = mregex.exec(lines[t])))
   {
    if (m[1])
    {
     c = parseInt(m[1], 16);
     if (c >= 32 && c < 127)
     readChars += String.fromCharCode(c);
     else
     readChars += '.';
       
     if (lines[t].slice(-readChars.length) === readChars)
     lastGood = readChars;
    }
    else if (m[2] || !m[3])
    {
     break;
    }      
   }
   
   ret += lastGood;
  }
 }
   
 return ret;
}


module.exports = {extractHex, extractText};