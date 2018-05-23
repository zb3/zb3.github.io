tcLoad('XOR', (function(){

var XOR = {};
XOR.analyzeLengths = function(str, min, max, maxpairs)
{
 if (!maxpairs) maxpairs = Infinity;
 if (!max) max = str.length/2|0;

 var ks, dist = [], cursor, cdist, ndist;
 for(ks=min;ks<=max;ks++)
 {
  cursor = cdist = ndist = 0;
  pairsleft = maxpairs;

  //so we take full. blocks only
  while(pairsleft-- && (cursor+2*ks)<=str.length)
  {
   cdist += hammingDistance(str.substr(cursor, ks), str.substr(cursor+ks, ks));
   ndist++; cursor += 2*ks;
  }

  if (ndist)
  dist.push([ks, cdist/(ndist*ks)]);
 }

 dist.sort(function(a,b){return a[1]-b[1]});
 return dist;
};
XOR.nextKey = function(key, fixed)
{
 var cur = key.length;
 while(cur-->0)
 {
  if (fixed[cur]) continue;
  if (key[cur]<255)
  {
   key[cur]++;
   break;
  }
  else
  {
   key[cur] = 0;
  }
 }
 return key;
};
XOR.makeAlphabetFilter = function(alphabet, threshold)
{
 var ret = function(str)
 {
  var okChars = 0;
  for(var t=0;t<str.length;t++)
  {
   if (alphabet.indexOf(str[t]) !== -1)
   okChars++;
  }
  okChars /= str.length;

  if (okChars<threshold)
  return false;

  return okChars;
 };
 return ret;
}
//XOR.brute('omg', [0, 0, 0], [255,0,255], [0, 1, 0], 3)
XOR.bruteChar = function(str, start, end, keyPos, keyLength, filterFunc)
{
 var t, res, filterScore, key;
 var results = [], dontPush;

 for(key=start;key<=end;key++)
 {
  res = ''; filterScore = filterFunc?'':null;
  for(t=keyPos;t<str.length;t+=keyLength)
  {
   res += String.fromCharCode(str.charCodeAt(t)^key);

   if (filterFunc)
   filterScore += res[res.length-1];
  }

  if (filterFunc)
  {
   filterScore = filterFunc(filterScore);
   if (filterScore === false)
   dontPush = true;
  }

  if (!dontPush)
  results.push([key, res, filterScore]);
  else dontPush = false;
 }

 if (filterFunc)
 {
  results.sort(function(a,b){return b[2]-a[2]});
 } 

 return results;
};
XOR.brute = function(str, start, end, fixed, klen, filterActive, filterFunc)
{
 var t, res, filterScore, key = start.slice();
 end += '';
 var results = [], dontPush;

 while(true)
 {
  res = ''; filterScore = filterFunc?'':null;
  for(t=0;t<str.length;t++)
  {
   if (!filterActive || !fixed[t%klen])
   res += String.fromCharCode(str.charCodeAt(t)^key[t%klen]);

   if (!fixed[t%klen] && filterFunc)
   filterScore += res[res.length-1];
  }

  if (filterFunc)
  {
   filterScore = filterFunc(filterScore);
   if (filterScore === false)
   dontPush = true;
  }

  if (!dontPush)
  results.push([key.slice(), res, filterScore]);
  else dontPush = false;

  if ((key+'')===end) break;

  XOR.nextKey(key, fixed);
 }

 if (filterFunc)
 {
  results.sort(function(a,b){return b[2]-a[2]});
 } 

 return results;
};


var sofar = [], filter = null, keyLength = 4, keyPos = 0, wholeKey = false;
function readSofar()
{
 sofar = document.getElementById('xor-key-sofar').value.split(',');
 if (sofar.length===1 && sofar[0]==='')
 sofar = [];
}
function setSofar()
{
 for(var t=0;t<sofar.length;t++)
 if (sofar[t]===undefined)
 sofar[t] = 0;

 document.getElementById('xor-key-sofar').value = sofar.join(',');
}
function readFilter()
{
 if (document.getElementById('xor-key-filter').checked)
 filter = XOR.makeAlphabetFilter(getInputString('xor-filter-alphabet'), Math.max(parseInt(getInputString('xor-key-filter-threshold'))/100||0, 0));
 else filter = null;
}
function readMode()
{
 wholeKey = document.getElementById('xor-keymode-wholekey').checked;
 setMode();
}
function readLength()
{ 
 keyLength = Math.max(parseInt(getInputString('xor-key-len'))||2,2);
 setLength();
}

function readPos()
{ 
 keyPos = Math.max(parseInt(getInputString('xor-key-block'))||0,0);
 keyPos = keyPos%keyLength;
 setPos();
}

function setLength()
{
 keyLength = Math.min(keyLength, getSelectedValue().length)||1;
 wholeKey = false; setMode();
 keyPos = 0; setPos();
 document.getElementById('xor-key-len').value = keyLength;
}
function setPos(){  document.getElementById('xor-key-block').value = keyPos;}

function setMode()
{
 document.getElementById('xor-keymode-wholekey').checked = wholeKey;
 document.getElementById('xor-keymode-singlebyte').checked = !wholeKey;
 document.getElementById('xor-display-affected-label').style.display = wholeKey?'':'none';
 document.getElementById('xor-choose-key-range').style.display = wholeKey?'block':'none';
 document.getElementById('xor-display-key').style.display = wholeKey?'none':'block';
 document.getElementById('xor-key-single-options').style.display = wholeKey?'none':'block';
}


function analyze()
{
 var str = getSelectedValue(), no = Math.max(parseInt(document.getElementById('xor-edit-distance-no').value)||1, 1), min = Math.max(parseInt(document.getElementById('xor-edit-distance-min').value)||2, 2), max = Math.max(parseInt(document.getElementById('xor-edit-distance-max').value)||0, 0);
 if (!str) return;

 var best = XOR.analyzeLengths(str, min, max);
 best.length = Math.min(best.length, no);

 var table = document.getElementById('xor-result-distance-table');
 table.style.display = 'table';
 document.getElementById('xor-result-output').style.display = 'none';
 var tbody = table.children[1], tr, td, button;

 while(tbody.lastChild)
 tbody.removeChild(tbody.lastChild);

 for(t=0;t<best.length;t++)
 {
  tr = document.createElement('tr');

  td = document.createElement('td');
  td.textContent = best[t][0];
  tr.appendChild(td);

  td = document.createElement('td');
  td.textContent = parseFloat(best[t][1].toFixed(3));
  tr.appendChild(td);

  td = document.createElement('td');
  button = document.createElement('button');
  button.textContent = 'Pick & proceed';
  button.onclick = (function(t){
   return function()
   {
    keyLength = best[t][0]; setLength();
    goBrute();
   }
  })(t);
  td.appendChild(button);

  button = document.createElement('button');
  button.textContent = 'Pick & proceed all';
  button.onclick = (function(t)
  {
   return function()
   {
    keyLength = best[t][0]; setLength();
    proceedRest();
   }
  })(t);
  td.appendChild(button);

  tr.appendChild(td);

  tbody.appendChild(tr);
 }
}

function goBrute()
{
 var t, str = getSelectedValue(), results;
 if (!str) return;

 if (wholeKey)
 {
  var keyStart = getInputString('xor-key-start').split(',');
  var keyEnd = getInputString('xor-key-end').split(',');

  var filterAffected = document.getElementById('xor-display-affected').checked;
  var fixed = [];

  if (!keyStart.length || !keyEnd.length)
  {
   alert('Invalid keys!');
   return;
  }

  for(t=0;t<keyStart.length;t++)
  {
   if (keyStart[t][0] === '$' || keyEnd[t][0] === '$') 
   {
    fixed[t] = true;
    keyStart[t] = keyEnd[t] = ((keyStart[t][0] === '$')?keyStart:keyEnd)[t].slice(1);
   }
   else fixed[t] = false;
   keyStart[t] = (parseInt(keyStart[t]) || 0)%256;
   keyEnd[t] = (parseInt(keyEnd[t]) || 0)%256;
  }

  results = XOR.brute(str, keyStart, keyEnd, fixed, keyLength, filterAffected, filter);
 }
 else
 results = XOR.bruteChar(str, 0, 255, keyPos, keyLength, filter);

 var output = document.getElementById('xor-result-output'), span, txtarea, button;

 while(output.lastChild)
 output.removeChild(output.lastChild);

 if (!results.length)
 {
  output.appendChild(document.createTextNode('No keys found!'));
 }

 for(t=0;t<results.length;t++)
 {
  span = document.createElement('span');
  span.innerHTML = 'Key: <span class="result">'+(wholeKey?JSON.stringify(results[t][0]):results[t][0])+'</span>'+(results[t][2]!==null?', filter score: <span class="result">'+(parseInt(results[t][2]*100))+'</span>%':'')+' ';
  output.appendChild(span);
  if (!wholeKey)
  {
   button = document.createElement('button');
   button.textContent = 'Pick & proceed';
   button.onclick = (function(t){
    return function()
    {
     sofar[keyPos] = results[t][0]; keyPos++; setSofar(); setPos();
     if (keyPos === keyLength)
     proceedRest();
     else goBrute();
    }
   })(t);

   output.appendChild(button);

   if (keyPos<keyLength-1)
   {
    button = document.createElement('button');
    button.textContent = 'Pick & proceed all';
    button.onclick = (function(t)
    {
     return function()
     {
      sofar[keyPos] = results[t][0]; keyPos++; setSofar(); setPos();
      proceedRest();
     }
    })(t);
    output.appendChild(button);
   }
  }
  output.appendChild(document.createElement('br'));
  txtarea = document.createElement('textarea');
  txtarea.value = document.getElementById('xor-display-hex').checked?encodehex(results[t][1]):results[t][1];
  output.appendChild(txtarea);
  output.appendChild(document.createElement('br'));
  output.appendChild(document.createElement('br'));
 }

 document.getElementById('xor-result-output').style.display = 'block';
 document.getElementById('xor-result-distance-table').style.display = 'none';
}

function proceedRest()
{
 var t, str = getSelectedValue();
 
 if (keyPos<keyLength)
 {
  var nextKey;
  
  for(;keyPos<keyLength;keyPos++)
  {
   nextKey = XOR.bruteChar(str, 0, 255, keyPos, keyLength, filter);
   sofar[keyPos] = nextKey[0]?nextKey[0][0]:0;
  }
 }

 keyPos--; //no set filter, fails if no nextkey... (even though we have 0... wat?)
 setPos();
 setSofar();
 wholeKey = true;
 setMode();

 document.getElementById('xor-key-start').value = document.getElementById('xor-key-end').value  = sofar.join(',');

 goBrute();
}



function init()
{
 document.getElementById('xor-analyze-button').onclick = analyze;
 document.getElementById('xor-start-button').onclick = goBrute;

 document.getElementById('xor-key-sofar').onchange = readSofar;
 document.getElementById('xor-key-filter').onchange = document.getElementById('xor-key-filter-threshold').onchange = document.getElementById('xor-filter-alphabet').onchange = document.getElementById('xor-filter-alphabet-asjson').onchange = readFilter;
 document.getElementById('xor-keymode-wholekey').onchange = document.getElementById('xor-keymode-singlebyte').onchange = readMode;
 
 document.getElementById('xor-key-block').onchange = readPos;
 document.getElementById('xor-key-len').onchange = readLength;

 readFilter();
 setMode();
 setLength();
 setPos();
};

return {export: XOR, init: init};

})());
//# sourceURL=xor.js