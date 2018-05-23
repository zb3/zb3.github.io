tcLoad('binpack', (function(){

var formatArea, lengthSayer, format;
var btnHex, btnHexified;


function init()
{
 formatArea = document.getElementById('binpack-formatstr');
 lengthSayer = document.getElementById('binpack-length-sayer');
 btnHex = document.getElementById('binpack-source-hex');
 btnHexified = document.getElementById('binpack-source-hexified');
 
 formatArea.addEventListener('input', readFormat);
 readFormat();
}

function readFormat()
{
 format = formatArea.value;
 var t = JSPack.calcLength(format);
 lengthSayer.textContent = t !== null ? t : '?';
}

function pack(str)
{
 var parsed = parseJSON(str);
 var arr = JSPack.pack(format, parsed.json);
 
 if (!arr)
 throw 'Pack failed - not enough elements in JSON.';
 
 var bytes = arr.length;
 var ret = '';
 for(var t=0;t<bytes;t++)
 {
  ret += String.fromCharCode(arr[t]);
 }
 
 if (btnHex.checked)
 ret = encodehex(ret);
 else if (btnHexified.checked)
 ret = doHexify(ret);
 
 ret += str.substr(parsed.usedChars);
 lengthSayer.textContent = bytes;
 
 return ret;
}

function unpack(str)
{
 if (btnHex.checked)
 {
  var tmp = str.match(/^([a-fA-F0-9][a-fA-F0-9])+/);
  if (!tmp) throw 'Invalid hex data!';
  
  str = decodehex(tmp[0])+str.substr(tmp[0].length);
 }
 else if (btnHexified.checked)
 str = unhexify(str);
 
 var bytes = [];
 for(var t=0;t<str.length;t++)
 {
  if (str.charCodeAt(t) > 255)
  throw bytesNeeded;
  
  bytes.push(str.charCodeAt(t));
 }
 
 var unpacked = JSPack.unpack(format, bytes);
 if (!unpacked)
 throw 'Unpack failed - not enough bytes in the source';
 
 lengthSayer.textContent = JSPack.usedBytes;
 
 var suffix = str.substr(JSPack.usedBytes);
 if (btnHex.checked) suffix = encodehex(suffix);
 else if (btnHexified.checked) suffix = doHexify(suffix);
 
 return JSON.stringify(unpacked)+suffix; 
}

function parseJSON(str)
{
 var ret = null, usedChars = str.length, tmp, secondChance = false;
 try
 {
  ret = JSON.parse(str);
 }
 catch(e)
 {
  if (e instanceof SyntaxError)
  {
   if (tmp = e.message.match(/at position (\d+)/))
   {
    usedChars = parseInt(tmp[1]);
    secondChance = true;
   }
   else if (tmp = e.message.match(/line (\d+) column (\d+)/))
   {
    usedChars = 0;
    
    tmp[1]--;
    while(tmp[1])
    {
     usedChars = str.indexOf('\n', usedChars)+1;
     tmp[1]--;
    }
    usedChars += tmp[2]-1;
    secondChance = true;
   }
  }
  if (!secondChance || !usedChars)
  throw e;
 }
 
 if (!ret)
 {
  str = str.substr(0, usedChars);
  ret = JSON.parse(str);
 }
 
 if (!ret)
 throw 'JSON is null...';
 
 return {usedChars: usedChars, json: ret};
}

return {init: init, export: {pack: pack, unpack: unpack}};

})());
//# sourceURL=binpack.js