//we still have to call updLen
//we'll get the event when the core (including ttbf) changes the value
tcListen('cursorUpdate', updCursor);
tcListen('textModified', updLen);

var bytesNeeded = 'Those are not bytes. Encode them first.\nIf you want Unicode, use UTF-8.';


///////////////TLC - Textarea Line Counter
var TLC = function(element, options)
{
 if (!options)
 options = {};

 var _this = this;

 this.original = element;
 this.shadow = document.createElement('textarea');
 this.shadow.spellcheck = false;
 this.sayer = document.createElement('div');
 this.sayer.className = 'tlc-sayer';
 this.heightMap = [];
 this.scrollOn = false;
 this.supportLineHeight = options.supportLineHeight;
 this.maxLineHeight = options.maxLineHeight || 20;
 this.lastValue = this.original.value;
 this.sizeInterval = null;

 this.currentSelectedLine = -1;
 this.currentSel = -1;
 this.currentFirstLine = -1;
 this.currentSelIdx = -1;
 this.onSelectionChanged = this.onSelectionChanged.bind(this);
 this.manualSelectionListener = options.manualSelectionListener;

 var cs = getComputedStyle(element);

 //copy style
 for(var t=0;t<cs.length;t++)
 this.shadow.style[cs[t]] = cs[cs[t]];

 this.baseWidth = this.cssWidth(element, cs);
 this.shadow.style.position = 'absolute';
 this.shadow.style.left = '-11000px'; //any better tricks to achieve this?

 document.body.appendChild(this.shadow);
 document.body.appendChild(this.sayer);

 //get scrollbar size
 this.shadow.overflowY = 'hidden';
 var cw = this.shadow.clientWidth;
 this.shadow.style.overflowY = 'scroll';
 this.shadow.value=new Array(99).join('n\n');
 this.shadow.style.height = '200px';
 this.scrollbarWidth = cw-this.shadow.clientWidth;
 this.shadow.style.overflowY = 'hidden';
 
 this.shadow.style.height = '1px';

 this.paddingTop = parseInt(cs.paddingTop);
 this.paddingBottom = parseInt(cs.paddingBottom);
 
 this.shadow.value = '.';
 this.heightBase = this.shadow.scrollHeight;

 this.lastAreaWidth = this.lastAreaHeight = 0;
 this.lastAreaLeft = 0; this.lastAreaTop = 0;

 this.updateSize(this.original.getBoundingClientRect());

 this.maxFill = element.scrollTop + element.getBoundingClientRect().height;
 this.updateScrollbar();

 if (!this.manualSelectionListener)
 this.updateSelectedLine();

 this.fill();

 //so we can remove them easily
 this.eventListeners = [];

 function addListener(what, event, handler, options)
 {
  _this.eventListeners.push([what, event, handler, options]);
  what.addEventListener(event, handler, options);
 }

 addListener(this.original, 'scroll', function()
 {
  _this.maxFill = _this.original.scrollTop + _this.original.getBoundingClientRect().height;
  _this.fill();
  _this.updateSelection(_this.currentSelectedLine);
 }, {passive: true});

 if (!options.manualChangeListener)
 addListener(this.original, 'input', function(){
  _this.textModified();
 });

 if (!options.manualSizeListener)
 this.sizeInterval = setInterval(function(){_this.updateSize(_this.original.getBoundingClientRect());}, 30);

 if (!this.manualSelectionListener)
 {
  function deferSelectionChanged()
  {
   setTimeout(_this.onSelectionChanged, 1);
  }
  addListener(this.original, 'keydown', deferSelectionChanged);
  addListener(this.original, 'mousedown', deferSelectionChanged);
  addListener(this.original, 'mouseup', deferSelectionChanged);
  addListener(this.original, 'mousemove', function(e)
  {
   if (!e.buttons) return;
   deferSelectionChanged();
  });
 }
};
TLC.prototype.cssWidth = function(el, cs)
{
 var ret = el.offsetWidth;
 if (cs.boxSizing !== 'border-box')
 ret += -parseFloat(cs.borderLeftWidth)-parseFloat(cs.borderRightWidth)-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)
 return ret;
};
TLC.prototype.updateSize = function(r)
{
 if (this.lastAreaWidth !== r.width || this.lastAreaHeight !== r.height)
 {
  this.lastAreaWidth = r.width; this.lastAreaHeight = r.height;
  this.lastAreaLeft = r.left; this.lastAreaTop = r.top;
  this.maxFill = this.original.scrollTop + r.height;

  this.baseWidth = this.cssWidth(this.original, getComputedStyle(this.original))
  this.shadow.style.width = this.baseWidth+'px';
  this.scrollOn = false;
  this.updateScrollbar();

  this.generateMap(0);
  this.updateUI();
 }
 else if (this.lastAreaLeft !== r.left || this.lastAreaTop !== r.top)
 {
  this.lastAreaLeft = r.left; this.lastAreaTop = r.top;
  this.updateUI();
 };
};
TLC.prototype.updateScrollbar = function()
{
 var on = this.original.scrollHeight>this.original.clientHeight;
 if (on && !this.scrollOn)
 {
  this.shadow.style.width = this.baseWidth-this.scrollbarWidth+'px';
  this.scrollOn = true;
 }
 else if (!on && this.scrollOn)
 {
  this.shadow.style.width = this.baseWidth+'px';
  this.scrollOn = false;
 }
};
TLC.prototype.generateMap = function(from, to)
{
 var lines, baseHeight = 0;
 
 if (from === -1) from = 0;

 if (from)
 {
  if (this.heightMap[from-1] > this.maxFill) return;
  baseHeight = this.heightMap[from-1] - this.paddingTop;
 }

 if (to === undefined)
 to = Infinity;

 /*
 I've benchmarked this... and it really seems like
 split is faster.. than indexOf+slice, even if we don't need
 to access most of these lines...
 */
 lines = this.original.value.split('\n').slice(from);

 this.shadow.value = '';

 if (!isFinite(to))
 this.heightMap.length = from;

 for(var t=0;t<lines.length;t++)
 {
  if (from+t>to) return;

  if (this.supportLineHeight)
  {
   this.shadow.value = lines[t]+'\n.';
   this.heightMap[from+t] = (from+t?(this.heightMap[from+t-1]||0):this.paddingTop)+this.shadow.scrollHeight-this.heightBase-this.paddingBottom;
  }
  else
  {
   this.shadow.value = lines[t];
   this.heightMap[from+t] = (from+t?(this.heightMap[from+t-1]||0)-this.paddingTop:0)+this.shadow.scrollHeight-this.paddingBottom;
  }

  if (this.heightMap[from+t] > this.maxFill)
  {
   t++;
   break;
  }
 }

 this.heightMap.length = from+t; //needed for textmodified?
};
TLC.prototype.fill = function()
{
 this.generateMap(this.heightMap.length-1);
 this.updateUI();
};
TLC.prototype.updateUI = function()
{
 var rect = this.original.getBoundingClientRect();
 var st = this.original.scrollTop;

 var tmp;
 var startOffset = this.original.scrollTop-this.maxLineHeight;
 var start = Infinity, end = 0;

 for(var t=0;t<this.heightMap.length;t++)
 {
  tmp = (t?this.heightMap[t-1]:this.paddingTop);
  if (!isFinite(start) && (tmp>startOffset || t === this.heightMap.length-1))
  start=t;
  if (!end && tmp>this.maxFill)
  {
   end = t;
   break;
  }
 }

 if (!end)
 end = t;

 if (!isFinite(start)) return; //WTF?

 this.currentFirstLine = start;

 var needed = end-start+1;

 while(this.sayer.children.length < needed)
 {
  var ns = document.createElement('span');
  this.sayer.appendChild(ns);
 }

 while(this.sayer.children.length > needed)
 this.sayer.removeChild(this.sayer.lastChild);

 if (this.currentSelIdx > needed-1)
 this.currentSelIdx = -1;

 for(var t=0;t<needed;t++)
 {
  this.sayer.children[t].style.top = ((start+t)?this.heightMap[start+t-1]:this.paddingTop)-st+'px';
  this.sayer.children[t].innerHTML = t==needed-1?'&nbsp;':start+t+1;
 }

 if (needed>1)
 {
  this.sayer.style.left = rect.left-1000+'px';
  this.sayer.style.top = rect.top+scrollY+'px';
  this.sayer.style.height = rect.height+'px';
 }

 this.updateSelection();
};
TLC.prototype.updateSelectedLine = function()
{
 var nsel = Math.min(this.original.selectionStart, this.original.selectionEnd);
 if (this.currentSel === nsel) return; //but on content update it'll be reset to -1

 var current = 0, currentPos = 0;
 while(currentPos < nsel)
 {
  currentPos = this.original.value.indexOf('\n', currentPos)+1;
  if (currentPos && currentPos<=nsel) current++;
  else break;
 }

 this.currentSel = nsel;
 this.currentSelectedLine = current;
};
TLC.prototype.onSelectionChanged = function()
{
 this.updateSelectedLine();
 this.updateSelection();
};
TLC.prototype.updateSelection = function() //after updateUI
{
 if (this.currentFirstLine+this.currentSelIdx === this.currentSelectedLine) return;
 
 if (this.currentSelIdx > -1 && this.currentSelIdx < this.sayer.children.length)
 this.sayer.children[this.currentSelIdx].classList.remove('current');

 var newIdx = this.currentSelectedLine-this.currentFirstLine;

 if (newIdx > -1 && newIdx < this.sayer.children.length)
 {
  this.sayer.children[newIdx].classList.add('current');
  this.currentSelIdx = newIdx;
 }
 else this.currentSelIdx = -1;
};
TLC.count = function(str, x)
{
 var pos = 0, count = 0;

 while(true)
 {
  pos = str.indexOf('\n', pos)+1;
  if (pos) count++;
  else break;
 }

 return count;
};
TLC.prototype.textModified = function()
{
 var oldScrollOn = this.scrollOn;
 this.updateScrollbar();

 var nv = this.original.value;
 
 if (oldScrollOn === this.scrollOn) 
 {
  var cp = commonPrefix(this.lastValue, nv), cs = commonSuffix(this.lastValue, nv, cp);

  var from = 0, fromChar = 0;
  while(fromChar < cp)
  {
   fromChar = nv.indexOf('\n', fromChar)+1;
   if (fromChar && fromChar<=cp) from++;
   else break;
  }

  var deleted = this.lastValue.length-cp-cs, inserted = nv.length-cp-cs;
  var dlines = TLC.count(this.lastValue.substr(cp, deleted)), nlines = TLC.count(nv.substr(cp, inserted));

  if (from+dlines < this.heightMap.length) //if we can reuse anything at all
  {
   var oldHeight = this.heightMap[from+dlines]-(this.heightMap[from-1]||0)

   if (dlines)
   this.heightMap.splice(from+1, dlines);

   for(var t=1;t<=nlines;t++)
   this.heightMap.splice(from+t, 0, 0);

   this.generateMap(from, from+nlines)

   var delta = this.heightMap[from+nlines]-(this.heightMap[from-1]||0)-oldHeight;
   for(var t=from+1+nlines;t<this.heightMap.length;t++)
   {
    this.heightMap[t] += delta;
    if (this.heightMap[t] > this.maxFill)
    {
     this.heightMap.length = t+1;
     break;
    }
   }
  }
  else this.generateMap(Math.min(this.heightMap.length-1, from));
 }

 this.lastValue = nv;
 this.currentSel = -1;

 if (oldScrollOn !== this.scrollOn)
 this.generateMap(0);
 else
 this.generateMap(this.heightMap.length-1)

 this.updateUI();

 if (!this.manualSelectionListener)
 this.updateSelectedLine();

 this.updateSelection();
};
TLC.prototype.destroy = function()
{
 for(var t=0;t<this.eventListeners.length;t++)
 this.eventListeners[t][0].removeEventListener(this.eventListeners[t][1], this.eventListeners[t][2], this.eventListeners[t][3]);

 if (this.sizeInterval !== null)
 clearInterval(this.sizeInterval);

 this.shadow.parentNode.removeChild(this.shadow);
 this.sayer.parentNode.removeChild(this.sayer);
};
///////////////End of TLC, now let's install it

var TLCinstance = null;
function TLCstate(on)
{
 if (on && !TLCinstance)
 {
  TLCinstance = new TLC(textarea, {manualChangeListener: true, manualSelectionListener: true}); //unsafe: accessing raw element outside core
  tcDispatch('cursorUpdate');
 }
 //
 else if (!on && TLCinstance)
 {
  TLCinstance.destroy();
  TLCinstance = null;
 }
 //
}
function TLCchange()
{
 if (TLCinstance)
 TLCinstance.textModified();
}
function TLCSelectionChange(line)
{
 if (!TLCinstance) return;
 TLCinstance.currentSelectedLine = line;
 TLCinstance.updateSelection();
}

tcListen('textModified', TLCchange);
document.addEventListener('DOMContentLoaded', function(){
 TLCstate(document.getElementById('tlconoff').checked);
});


function trimToSelection()
{
 setValue(getValue().slice(getSelectionStart(), getSelectionEnd()));
 setSelection(0, 0); setSelection(1, 0);
 tcDispatch('textModified');
}
function readSelectionFromInput()
{
 var start = Math.max(parseInt(document.getElementById('selection-start').value) || 0, 0);
 var end = Math.max(parseInt(document.getElementById('selection-end').value) || 0, 0);
 var vl = getValue().length;
 start = Math.min(start, vl);
 end = Math.min(end, vl);
 end = Math.max(start, end);
 setSelRange(start, end);
}

function setSelRange(start, end)
{
 setSelection(0, start);
 setSelection(1, end);
 ensureSelectionVisible();
 setFocus();
 tcDispatch('cursorUpdate');
}
function updCursor()
{
 var tval = getValue(), selStart = getSelectionStart();
 var lineBreaks = 0, lastIndex = 0, tmp;
 while((tmp=tval.indexOf('\n', lastIndex))!==-1 && tmp<selStart)
 {
  lastIndex = tmp+1;
  lineBreaks++;
 }
 TLCSelectionChange(lineBreaks);
 document.getElementById('esc_lnsayer').innerHTML = lineBreaks+1;
 document.getElementById('esc_colsayer').innerHTML = selStart-lastIndex;
 document.getElementById('esc_posayer').innerHTML = selStart;
 document.getElementById('slensayer').innerHTML=(getSelectionEnd()-selStart);
 document.getElementById('selection-start').value = selStart;
 document.getElementById('selection-end').value = getSelectionEnd();
}
function updLen(after)
{
 var val = getValue(), vl = val.length;
 
 document.getElementById('text-binary-mode').className = isBinary?'binary':'';
 document.getElementById('lenSayer1').innerHTML=vl;
 updCursor();
 //check which line is it
 var minwlen = parseInt(document.getElementById('wlen1').innerHTML);
 if (minwlen<1)
 {
  minwlen = 1;
 }
 var cf=0, rf=0, i;
 for(i=0;i<=vl;i++)
 {
  if (i===vl || val.substr(i, 1)===' ' || val.substr(i, 1)=='\n')
  {
   if (cf>=minwlen)
   rf++;
   cf=0;
  }
  else
  cf++;
 }
 document.getElementById('wordsSayer1').innerHTML = rf;
 if (document.getElementById('regexo-rtext').value.length>0)
 {
  document.getElementById('ocrof1').innerHTML =occurencesOfRegex();
 }
 else
 {
  document.getElementById('ocrof1').innerHTML = '0';
 }
}

function getAdditionalVal()
{
 var asText = document.getElementById('adt-mode-text').checked, asHex = document.getElementById('adt-mode-hex').checked, asHexified = document.getElementById('adt-mode-hexified').checked;
 
 var v = getAdditionalValue();

 try
 {
  if (asHex)
  {
   v = decodehex(v);
  }
  else if (asHexified)
  {
   v = unhexify(v);
  }
 } catch(e) {
  throw 'Failed to get additional textarea value: '+e;
 }

 return v;
}

function unicodeSubstring(str, start, stop)
{
 var t = 0, codePoint, count = 0, ret = '';
 if (stop===undefined) stop = Infinity;

 while(t<str.length)
 {
  codePoint = fixedCharCodeAt(str, t);
  if (count>=start && count<stop)
  ret += codePoint>65535?str[t]+str[t+1]:str[t];

  count++;
  t += codePoint>65535?2:1;
 }
 return ret;
}
function unicodeLength(str)
{
 return str.replace(/[\udc00-\udfff]/g, '').length;
}
function sliceOp(remove, str)
{
 var unicode = document.getElementById('slice-support-utf16').checked;
 var strLength = unicode?unicodeLength(str):str.length;
 var start = ((parseInt(document.getElementById('slice-start').value)||0)+strLength)%strLength;
 var stop = ((parseInt(document.getElementById('slice-end').value)||0)-1+strLength)%strLength+1;
 if (start>=stop) return remove?str:'';

 if (remove)
 {
  if (unicode)
  return unicodeSubstring(str, 0, start)+unicodeSubstring(str, stop);
  else 
  return str.slice(0, start)+str.slice(stop);
 }
 else
 {
  if (unicode)
  return unicodeSubstring(str, start, stop);
  else 
  return str.slice(start, stop);
 }
}

//NOTE: do NOT replace these with atob!
//it cannot handle concatenated ones!

basestr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function encode64 (input) {
var output = "";
var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
var i = 0;
while (i < input.length) {
chr1 = input.charCodeAt(i++);
chr2 = input.charCodeAt(i++);
chr3 = input.charCodeAt(i++);
if (chr1 > 255 || chr2 > 255 || chr3 > 255) throw bytesNeeded;
enc1 = chr1 >> 2;
enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
enc4 = chr3 & 63;
 
if (isNaN(chr2)) {
enc3 = enc4 = 64;
} else if (isNaN(chr3))
{
enc4 = 64;
}
output = output + basestr.charAt(enc1) + basestr.charAt(enc2) + basestr.charAt(enc3) + basestr.charAt(enc4);
}
return output;
}
function decode64 (input)
{
var output = "";
var chr1, chr2, chr3;
var enc1, enc2, enc3, enc4;
var i = 0;
input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
while (i < input.length) {
enc1 = basestr.indexOf(input.charAt(i++));
enc2 = basestr.indexOf(input.charAt(i++));
enc3 = basestr.indexOf(input.charAt(i++));
enc4 = basestr.indexOf(input.charAt(i++));
chr1 = (enc1 << 2) | (enc2 >> 4);
chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
chr3 = ((enc3 & 3) << 6) | enc4;
output = output + String.fromCharCode(chr1);
if (enc3 != 64) {
output = output + String.fromCharCode(chr2);
}
if (enc4 != 64) {
output = output + String.fromCharCode(chr3);
}
}
return output;
}
function decodehex(hex)
{
 var str = '', ccode, codes = 0, cursorSet = false;
 for (var i = 0; i <= hex.length; i += 2)
 {
  if (hex[i]===' ' || hex[i]==='\\' || hex[i]==='x') {i--;continue}

  if (transformTextByFunction.cursor!==null && transformTextByFunction.cursor<=i && !cursorSet)
  {
   transformTextByFunction.outcursor = str.length;
   cursorSet = true;
  }

  if (i===hex.length) break;

  ccode = parseInt(hex.substr(i, 2), 16);
  if (isNaN(ccode))
  throw 'Invalid hex!';
  else
  {
   str += String.fromCharCode(ccode);
  }
 }
 return str;
}
function encodehex(str, prefix)
{
 if (prefix===undefined) prefix = '';

 var strl = str.length; var ret=''; var rett='';
 for(i=0;i<strl;i++)
 {
  rett = str.charCodeAt(i).toString(16);
  if (rett.length>2)
  throw 'Encoding as hex failed: These are not bytes. Encode these via UTF8 or use wide hex format.';
  ret += prefix+((rett.length==2)?(rett):("0"+rett));
 }

 if (transformTextByFunction.cursor!==null)
 transformTextByFunction.outcursor = (2+prefix.length)*transformTextByFunction.cursor;

 return ret;
}
function escapehex(str, prefix)
{
 return encodehex(str, '\\x');
}
function unescapehex(str)
{
 var t, ccode, ret = '', cursorSet = false;
 for(t=0;t<str.length;t++)
 {
  if (transformTextByFunction.cursor!==null && transformTextByFunction.cursor<=t && !cursorSet)
  {
   transformTextByFunction.outcursor = ret.length;
   cursorSet = true;
  }
  if (t===str.length) break;

  if (str[t]==='\\' && str[t+1]==='x' && (/^[0-9a-f]{2}/i).test(str.substr(t+2, 2)))
  {
   ccode = parseInt(str.substr(t+2, 2), 16);
   ret += String.fromCharCode(ccode);
   t+=3;
  }
  else ret += str[t];
 }
 return ret;
}
function decodeoct(oct)
{
 var str = '', ccode, codes = 0, tmatch, tmp, cursorSet = false;
 for (var i = 0; i <= oct.length; i++)
 {
  if (transformTextByFunction.cursor!==null && transformTextByFunction.cursor<=i && !cursorSet)
  {
   transformTextByFunction.outcursor = str.length;
   cursorSet = true;
  }
  if (i===oct.length) break;

  if (oct[i] === '\\' && (tmatch = oct.substr(i+1, 3).match(/^[0-7]{1,3}/)))
  {
   ccode = parseInt(tmatch[0], 8);
   if (ccode>255) 
   {
    tmatch[0] = tmatch[0].slice(0, -1);
    ccode = parseInt(tmatch[0], 8);
   }
   str += String.fromCharCode(ccode);
   i += tmatch[0].length;
  }
  else
  str += oct[i];
 }
 return str;
}
function encodeoct(str)
{
 var strl = str.length; var ret=''; var rett='';
 for(i=0;i<strl;i++)
 {
  if (str.charCodeAt(i)>255)
  throw 'These are not bytes. Encode these via UTF8.';
  rett = str.charCodeAt(i).toString(8);
  ret += '\\'+(rett.length==3?rett:rett.length==2?'0'+rett:'00'+rett);
 }

 if (transformTextByFunction.cursor!==null)
 transformTextByFunction.outcursor = 4*transformTextByFunction.cursor;

 return ret;
}
function putzero(str1, num)
{
 var e, put='';
 for(e=0;e<(num-str1.length);e++)
 {
  put += "0";
 }
 return put+str1;
}
function decodewidehex(hex)
{
 var str = '', ccode, codes = 0, cursorSet = false;
 for (var i = 0; i <= hex.length; i += 4)
 {
  if (hex[i]===' ' || hex[i]==='\\' || hex[i]==='u') {i-=3;continue}

  if (transformTextByFunction.cursor!==null && transformTextByFunction.cursor<=i && !cursorSet)
  {
   transformTextByFunction.outcursor = str.length;
   cursorSet = true;
  }

  if (i===hex.length) break;

  ccode = parseInt(hex.substr(i, 4), 16);
  if (isNaN(ccode))
  throw 'Invalid wide hex!';
  else
  {
   str += String.fromCharCode(ccode);
  }
 }
 return str;
}
function encodewidehex(str, prefix)
{
 if (prefix===undefined) prefix = '';

 var strl = str.length; var ret=''; var rett='';
 for(i=0;i<strl;i++)
 {
  rett = str.charCodeAt(i).toString(16);
  ret += prefix+putzero(rett, 4);
 }

 if (transformTextByFunction.cursor!==null)
 transformTextByFunction.outcursor = (prefix.length+4)*transformTextByFunction.cursor;

 return ret;
}
function escapewidehex(str, prefix)
{
 return encodewidehex(str, '\\u');
}
function unescapewidehex(str)
{
 var t, ccode, ret = '', cursorSet = false;
 for(t=0;t<=str.length;t++)
 {
  if (transformTextByFunction.cursor!==null && transformTextByFunction.cursor<=t && !cursorSet)
  {
   transformTextByFunction.outcursor = ret.length;
   cursorSet = true;
  }
  if (t===str.length) break;

  if (str[t]==='\\' && str[t+1]==='u' && (/[0-9a-f]{4}/i).test(str.substr(t+2, 4)))
  {
   ccode = parseInt(str.substr(t+2, 4), 16);
   ret += String.fromCharCode(ccode);
   t+=5;
  }
  else ret += str[t];
 }
 return ret;
}

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
  if (transformTextByFunction.cursor === t)
  transformTextByFunction.outcursor = ret.length;
  
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

function doCEscape(str)
{
 return cescape(str, false, !document.getElementById('cescape-as-bytes').checked);
}


function interceptDownloadClick(e)
{
 downloadTextarea(e.target, 500);
}
function interceptDownloadCtx(e)
{
 //you have 1 minute to select target location :)
 downloadTextarea(e.target, 60000);
}
function downloadTextarea(link, waitTime)
{
 var v = getValue();
 var a = new Uint8Array(v.length);
 
 for(var t=0,c;t<v.length;t++)
 {
  c = v.charCodeAt(t);
  if (c > 255)
  {
   alert(bytesNeeded); 
   return;
  }
  a[t] = c;
 }

 var blob = new Blob([a], {type: 'application/octet-stream'});
 var url = URL.createObjectURL(blob);

 link.href = url;

 setTimeout(function(){URL.revokeObjectURL(url);}, waitTime);
}
function loadFromFile()
{
 var input = document.getElementById('tools-load-from-file');
 input.click();  
}
document.getElementById('tools-load-from-file').onchange=function()
{
 var input = document.getElementById('tools-load-from-file');
 var file = input.files[0];

 readFileInto(file);

 input.value = '';
};

//hexify(TM)
function hexify(str, tab, unicode, utf16)
{
 var cd = 0, cursor = transformTextByFunction.cursor || 0;

 str = str.replace(/\[([ ]*)([0-9A-F]{2,5})]/g, function(w, p1, p2, o)
 {
  if (cursor > (o+p1.length+1))
  cd++;

  return '['+p1+' '+p2+']';
 });

 cursor += cd;
 cd = 0;

 str = str.replace(new RegExp('[\\x00-\\x08'+(tab?'\\x09':'')+'\\x0B-\\x1F\\x7F-\\xA0\\xAD'+(unicode?(utf16?'\\u0100-\\uffff':'\\u{0100}-\\u{FFFFF}'):'')+']', 'g'+(unicode && !utf16?'u':'')), function(m, o)
 {
  var c = m.codePointAt(0).toString(16).toUpperCase();
  if (c.length === 1)
  c = '0'+c;

  //crazy case...
  if (cursor === o+1 && m.length===2)
  cd++; 

  if (cursor > o)
  cd += 2+c.length-m.length;

  return '['+(c)+']';
 });
 cursor += cd;

 if (transformTextByFunction.cursor !== null)
 transformTextByFunction.outcursor = cursor;

 return str;
}

//note: "[" and "]" can't be hexified... otherwise we can get incorrect results
function unhexify(str)
{
 var cd = 0, cursor = transformTextByFunction.cursor || 0;

 str = str.replace(/\[([0-9A-F]{2,5})]/g, function(w, m, o)
 {
  var ret = String.fromCodePoint(parseInt(m, 16));

  if (cursor > o && cursor < o+w.length)
  cursor = o+w.length;

  if (cursor > o)
  cd += ret.length-w.length;

  return ret;
 });

 cursor += cd;
 cd = 0;

 str = str.replace(/\[[ ]([ ]*)([0-9A-F]{2,5})]/g, function(w, p1, p2, o)
 {
  if (cursor > o+1)
  cd--;

  return '['+p1+p2+']';
 });

 cursor += cd;

 if (transformTextByFunction.cursor !== null)
 transformTextByFunction.outcursor = cursor;

 return str;
}
function doHexify(str)
{
 return hexify(str, document.getElementById('hexify-tab').checked, document.getElementById('hexify-unicode').checked, document.getElementById('hexify-utf16').checked);
}


function fullyescape(str)
{
 var ret = ''; var rett='';
 for(i=0;i<str.length;i++)
 {
  rett = str.charCodeAt(i).toString(16);
  ret += '%'+(rett.length==2?rett:rett.length==1?'0'+rett:'u'+rett);
 }
 return ret;
}
function rptMe(str)
{
 var times = parseInt(document.getElementById('rptTimes1').value);
 if (times>0)
 return repeat(str, times);
}
function repeat(str, times)
{
 return (new Array(times+1).join(str));
}
function urlencode (str)
{
 str = (str + '').toString();
 return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}
function urldecode (str)
{
 return decodeURIComponent((str + '').replace(/\+/g, '%20'));
}
function u(arr)
{
 var u = {}, a = [];
 for(var i = 0, l = arr.length; i < l; ++i)
 {
  if(u.hasOwnProperty(arr[i])) continue;
  a.push(arr[i]);
  u[arr[i]] = 1;
 }
 return a;
}

//surrogate compatible functions, and they're not using deprecated escape/unescape
//~2016


function un3sc4p3(str) { //this function assumes properly formatted string
  for(var t=0,ret='';t<str.length;t++) {
    if (str[t] === '%') {
      ret += String.fromCharCode(parseInt(str.substr(t+1, 2), 16));
      t += 2;
    } else {
      ret += str[t];
    }
  }
  return ret;
}
function esc4p3(str) { //this function assumes string is encoded
  for(var t=0,ret='';t<str.length;t++) {
    ret += '%'+('0'+str.charCodeAt(t).toString(16)).slice(-2);
  }
  return ret;
}



function utf8encode(s) {
  return un3sc4p3(encodeURIComponent(s));
}

function utf8decode(s) {
  return decodeURIComponent(esc4p3(s));
}


//reverse compatible with surrogates...
/*! https://mths.be/esrever v0.2.0 by @mathias */
var regexSymbolWithCombiningMarks = /([\0-\u02FF\u0370-\u1AAF\u1B00-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uE000-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])([\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g;
var regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;

var reversestr = function(unicode, string)
{
 if (unicode)
 string = string.replace(regexSymbolWithCombiningMarks, function($0, $1, $2)
 {
  return reversestr(true, $2) + $1;
 }).replace(regexSurrogatePair, '$2$1');

 var result = '';
 var index = string.length;
 while (index--)
 result += string.charAt(index);

 return result;
};
function genLink()
{
 document.getElementById('linkhere').innerHTML='Here is your link: <a href="'+document.getElementById('forlink').value+'">link</a>';
}
//how to make bad API - do it like I do it here

function hammingDistance(str1, str2)
{
 var t, ret = 0, tmp;
 for(t=0;t<str1.length && t<str2.length;t++)
 {
  tmp = str1.charCodeAt(t)^str2.charCodeAt(t);
  while(tmp!=0)
  {
   ret++;
   tmp &= tmp - 1;
  }
 }
 return ret;
}
function steelHammer()
{
 var str1 = document.getElementById('hamming1').value, str2 = document.getElementById('hamming2').value;
 document.getElementById('hamming-result-oreally').textContent = hammingDistance(str1, str2);
 document.getElementById('hamming-result').style.display='block';
}
function shuffle(array) {
 var currentIndex = array.length, temporaryValue, randomIndex ;

 while (0 !== currentIndex) {
   randomIndex = Math.floor(Math.random() * currentIndex);
   currentIndex -= 1;

   temporaryValue = array[currentIndex];
   array[currentIndex] = array[randomIndex];
   array[randomIndex] = temporaryValue;
 }

 return array;
}
function tobase()
{
var nval = parseInt(document.getElementById('nmbr').value);
if (isNaN(nval))
{
alert('Error!');
}
else
{
if (document.getElementById('nbase').value=="IP")
{
 if (nval >= 0 || nval <= 4294967295)
 document.getElementById('nmbr').value = Math.floor(nval / Math.pow(256, 3)) + '.' + Math.floor((nval % Math.pow(256, 3)) / Math.pow(256, 2)) + '.' + Math.floor(((nval % Math.pow(256, 3)) % Math.pow(256, 2)) / Math.pow(256, 1)) + '.' + Math.floor((((nval % Math.pow(256, 3)) % Math.pow(256, 2)) % Math.pow(256, 1)) / Math.pow(256, 0));
 else alert('Error!');
}
else
document.getElementById('nmbr').value = nval.toString(document.getElementById('nbase').value);;
}
}
function frombase()
{
if (document.getElementById('nbase').value=="IP")
{
 var nexp = document.getElementById('nmbr').value.split(".");
 if (nexp.length == 4)
 { 
  var i, out=0;
  for(i=0;i<4;i++)
  {
   var ii=parseInt(nexp[i]);
   if (!isNaN(ii) && ii>=0 && ii<256)
   {
    out+=ii*Math.pow(256, 3-i);
   }
   else
   {
    alert('Error!');
   } 
  }
  document.getElementById('nmbr').value=out;
 }
 else alert('Error!');
}
else
{
var nval = parseInt(document.getElementById('nmbr').value,document.getElementById('nbase').value);
if (isNaN(nval))
{
alert('Error!');
}
else
{
document.getElementById('nmbr').value = nval;
}
}
}
/*
support-utf16
*/
//copy paste from MDN, common thing here xD
if (!String.fromCodePoint) {
	(function() {
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var stringFromCharCode = String.fromCharCode;
		var floor = Math.floor;
		var fromCodePoint = function(codePoints) {
			var MAX_SIZE = 0x4000;
			var codeUnits = [];
			var highSurrogate;
			var lowSurrogate;
			var index = -1;
			var length = arguments.length;
			if (!length) {
				return '';
			}
			var result = '';
			while (++index < length) {
				var codePoint = Number(arguments[index]);
				if (
					!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
					codePoint < 0 || // not a valid Unicode code point
					codePoint > 0x10FFFF || // not a valid Unicode code point
					floor(codePoint) != codePoint // not an integer
				) {
					throw RangeError('Invalid code point: ' + codePoint);
				}
				if (codePoint <= 0xFFFF) { // BMP code point
					codeUnits.push(codePoint);
				} else { // Astral code point; split in surrogate halves
					// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					codePoint -= 0x10000;
					highSurrogate = (codePoint >> 10) + 0xD800;
					lowSurrogate = (codePoint % 0x400) + 0xDC00;
					codeUnits.push(highSurrogate, lowSurrogate);
				}
				if (index + 1 == length || codeUnits.length > MAX_SIZE) {
					result += stringFromCharCode.apply(null, codeUnits);
					codeUnits.length = 0;
				}
			}
			return result;
		};
		if (defineProperty) {
			defineProperty(String, 'fromCodePoint', {
				'value': fromCodePoint,
				'configurable': true,
				'writable': true
			});
		} else {
			String.fromCodePoint = fromCodePoint;
		}
	}());
}
function fixedCharCodeAt (str, idx)
{
 // ex. fixedCharCodeAt ('\uD800\uDC00', 0); // 65536
 // ex. fixedCharCodeAt ('\uD800\uDC00', 1); // false
 idx = idx || 0;
 var code = str.charCodeAt(idx);
 var hi, low;
    
 if (0xD800 <= code && code <= 0xDBFF)
 {
  hi = code;
  low = str.charCodeAt(idx+1);
  if (isNaN(low))
  {
   throw 'High surrogate not followed by low surrogate in fixedCharCodeAt()';
  }
  return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
 }
 if (0xDC00 <= code && code <= 0xDFFF)
 return false;
 return code;
}

function ASCIIEncode(text)
{
 var tsl = text.length, ret = '', i, utf16 = document.getElementById('support-utf16').checked, t;
 var asciibase = parseInt(document.getElementById('ascii-base').value);
 for (i=0;i<=tsl;i++)
 {
  if (transformTextByFunction.cursor!==null && transformTextByFunction.cursor===i)
  transformTextByFunction.outcursor = ret.length;
  if (i===tsl) break;

  if (utf16)
  {
   if (t=fixedCharCodeAt(text, i))
   ret += t.toString(asciibase)+((i<tsl-1 && (t<65536 || i<tsl-2))?',':'');
  }
  else
  ret += text.charCodeAt(i).toString(asciibase)+((i<tsl-1)?',':'');
 }
 return ret;
}
function ASCIIDecode(text)
{
 var ts = text.split(","), tsl = ts.length, ret="", ti, i, utf16 = document.getElementById('support-utf16').checked, ltillnow = 0;
 var asciibase = parseInt(document.getElementById('ascii-base').value);
 for (i=0; i<=tsl; i++)
 {
  if (transformTextByFunction.cursor!==null && transformTextByFunction.cursor===ltillnow)
  transformTextByFunction.outcursor = ret.length;
  if (i===tsl) break;

  ltillnow += ts[i].length+((i<tsl-1)?1:0);

  ti = parseInt(ts[i], asciibase);
  if (isNaN(ti))
  throw 'Error!';
  else
  {
   ret += (utf16?String.fromCodePoint:String.fromCharCode)(ti);
  }
 }
 return(ret);
}
function countOccurences(haystack, needle)
{
 var occurences=0, spos = 0, np;
 hp = haystack.indexOf(needle, spos);
 while (hp>-1)
 {
  spos = hp+1;
  occurences++;
  hp = haystack.indexOf(needle, spos);
 }
 return occurences;
}
function plusthelen()
{
 document.getElementById('wlen1').innerHTML = parseInt(document.getElementById('wlen1').innerHTML)+1;
 updLen();
}
function minusthelen(n)
{
 var ln = parseInt(document.getElementById('wlen1').innerHTML);
 if (ln>1)
 {
  document.getElementById('wlen1').innerHTML = ln-1;
 }
 updLen();
}
function adtshow()
{
 document.getElementById('adtslink').style.display='none';
 document.getElementById('adthlink').style.display='inline';
 document.getElementById('adt').style.display='block';
}
function adthide()
{
 document.getElementById('adthlink').style.display='none';
 document.getElementById('adtslink').style.display='inline';
 document.getElementById('adt').style.display='none';
}
function EvalMEH()
{
 document.getElementById('jsevt').value = eval(document.getElementById('jxpression').value);;
}
function lowecase(str)
{
 return str.toLowerCase();
}
function uppecase(str)
{
 return str.toUpperCase();
}
function byteOP(type, text)
{
 var karray = document.getElementById('xorkey').value.split(','), kl=karray.length, ccode, ret = '';
 for (var i=0;i<text.length;i++)
 {
  if ((ccode=text.charCodeAt(i))>255) throw bytesNeeded;
  karray[i%kl] = parseInt(karray[i%kl]);
  if (isNaN(karray[i%kl])) throw 'Invalid key format!';
  ret += String.fromCharCode(window[type](ccode, karray[i%kl]));
 }
 return ret;
}
function XORStr(bits, k)
{
 k %= 256; k += 256; k %= 256;
 return bits^k;
}
function ROR(bits, k)
{
 k %= 8; k += 8; k %= 8;
 return (bits >>> k) | (bits << (8 - k)) & 0xff;
}
function ADD(bits, k)
{
 k %= 256; k += 256; k %= 256;
 return (bits+k)%256;
}
function RORstr(text)
{
 var karray = document.getElementById('xorkey').value.split(','), kl=karray.length, ccode, ret = '';
 for (var i=0;i<text.length;i++)
 {
  if ((ccode=text.charCodeAt(i))>255) throw bytesNeeded;
  karray[i%kl] = parseInt(karray[i%kl]);
  if (isNaN(karray[i%kl])) throw 'Invalid key format!';
  ret += String.fromCharCode(ccode^karray[i%kl]);
 }
 return ret;
}
function rot13(str)
{
 var e = "", i, tmp;
 for(i=0;i<str.length;i++)
 {
  if (str.charCodeAt(i)>=65 && str.charCodeAt(i)<=90)
  {
   tmp = str.charCodeAt(i)+13;
   if(tmp>90) tmp -= 26;
   e += String.fromCharCode(tmp);
  }
  else if (str.charCodeAt(i)>=97 && str.charCodeAt(i)<=122)
  {
   tmp = str.charCodeAt(i)+13;
   if(tmp>122) tmp -= 26;
   e += String.fromCharCode(tmp);
  } else e += str.substr(i, 1);
 }
 return e;
}
function striprn(str)
{
 var ret='';
 for(t=0;t<str.length;t++)
 {
  if (str.charCodeAt(t)==13 || str.charCodeAt(t)==10)
  continue;
  ret += str[t];
 }
 return ret;
}
function _appendAtLine(str, what, where)
{
 var tlines = str.split('\n'), tl=tlines.length, t;
 for(t=0;t<tl;t++)
 {
  tlines[t] = where?tlines[t]+what:what+tlines[t];
 }
 return tlines.join('\n');
}
function addIndent(str)
{
 var no = parseInt(document.getElementById('add-indent-no').value), tab = document.getElementById('add-indent-type').selectedIndex;
 return _appendAtLine(str, new Array(no+1).join(tab?'\t':' '));
}
function removeIndent(str)
{
 var wm = parseInt(document.getElementById('add-indent-no').value), tab = document.getElementById('add-indent-type').selectedIndex;
 if (wm<1) return str;
 var tlines = str.split('\n'), tl=tlines.length, t, tsp;
 for(t=0;t<tl;t++)
 {
  tsp=0;
  while(tsp<wm && tlines[t].charAt(tsp)===(tab?'\t':' ')) tsp++;
  tlines[t] = tlines[t].slice(tsp);
 }
 return tlines.join('\n');
}

//2016-01-14 here :D
//yep and I know .split is not the best solution
//but time !== Infinity tho
function amplifyIndent(mode, str) {
  var spaces = (parseInt(document.getElementById('add-indent-no').value) || 0)*mode;
  var char = document.getElementById('add-indent-type').selectedIndex?'\t':' ';
  var tlines = str.split('\n');
  var indent = new RegExp('^'+char+'*'), blank = /^\s*(?:#.*)?$/;

  var lastLine = tlines[0].match(indent)[0].length, thisLine;
  var indentStack = [], addSpaces = 0, delta = 0;

  for(var t=1;t<tlines.length;t++) {
    if (!tlines[t]) continue; //empty
    
    if (!blank.test(tlines[t])) {
      thisLine = tlines[t].match(indent)[0].length;

      if (thisLine > lastLine) {
        indentStack.push(thisLine-lastLine);
        addSpaces += spaces;
      }
      else if (thisLine < lastLine) {
        delta = lastLine-thisLine;
     
        while(true) {
          addSpaces -= spaces;
          delta -= indentStack.pop();
          if (isNaN(delta) || delta <= 0) break;
        }
      }
    }

    if (addSpaces > 0) tlines[t] = repeat(char, addSpaces) + tlines[t];
    else if (addSpaces < 0) {
      var trim = 0;
      while(tlines[t][trim] === char && trim<-addSpaces) trim++;
      tlines[t] = tlines[t].substr(trim);
      addSpaces = Math.max(addSpaces, -trim);
    }

    lastLine = thisLine;
  }

  return tlines.join('\n');
}

function splitCSV(str, sep, tsep, preserveQuotes)
{
 if (!sep.length) return str.split('');
 
 var t, escaped = false, ret = [], current = '', l = str.length, sl = sep.length, tsl = tsep && tsep.length;
 for(t=0;t<l;t++)
 {
  if (!escaped)
  {
   if (tsep && str.substr(t, tsl)===tsep)
   {
    escaped = true;
    t += tsl-1;
    if (preserveQuotes) current += tsep;
   }
   else if (str.substr(t, sl)===sep)
   {
    ret.push(current);
    current = '';
    t += sl-1;
   }
   else current += str[t];
  }
  else
  {
   if (tsep && str.substr(t, tsl)===tsep && str.substr(t+tsl, tsl)===tsep)
   {
    t += 2*tsl-1;
    current += tsep;
    if (preserveQuotes) current += tsep;
   }
   else if (tsep && str.substr(t, tsl)===tsep)
   {
    escaped = false;
    t += tsl-1;
    if (preserveQuotes) current += tsep;
   }
   else current += str[t];
  }
 }
 ret.push(current);
 return ret;
}
function quoteCSV(str, tsep)
{
 if (!tsep) return str;
 return tsep+str.replace(new RegExp(escapeRegExp(tsep), 'g'), '$&$&')+tsep;
}
function joinCSV(arr, sep, rsep, tsep, alwaysquote)
{
 var row, col, field, ret='';
 if (!rsep) arr = [arr];
 for(row=0;row<arr.length;row++)
 {
  if (!arr[row]) arr[row] += ''; //evil :D
  for(col=0;col<arr[row].length;col++)
  {
   field = arr[row][col]+''; //no, don't "optimize" this by removing, this is actually needed

   ret += (alwaysquote || field.indexOf(sep)!==-1 || field.indexOf(rsep)!==-1 ||
 field.indexOf(tsep)!==-1)?quoteCSV(field, tsep):field;
   if (col<arr[row].length-1) ret += sep;
  }
  if (row<arr.length-1) ret += rsep || '';
 }
 return ret;
}
function convertCSVDelimiters(str, sep, newsep, rsep, newrsep, tsep, newtsep, alwaysquote)
{
 var t, tmp = splitCSV(str, rsep, tsep, true);
 for(t=0;t<tmp.length;t++)
 tmp[t] = splitCSV(tmp[t], sep, tsep);
 return joinCSV(tmp, newsep, newrsep, newtsep, alwaysquote);
}
function convertCSVSeparator(type, str)
{
 var sep = getInputString('element-separator'), nsep = getInputString((type===0?'new-':'')+'element-separator');
 var rsep = getInputString('row-separator'), nrsep = getInputString((type===1?'new-':'')+'row-separator');
 var tsep = getInputString('csv-quote'), ntsep = getInputString((type===2?'new-':'')+'csv-quote');
 setInputString('element-separator', nsep);
 setInputString('row-separator', nrsep);
 setInputString('csv-quote', ntsep);
 return convertCSVDelimiters(str, sep, nsep, rsep, nrsep, tsep, ntsep, document.getElementById('csv-quote-always').checked);
}
function setEnableCSVQuote(yes, lite)
{
 if (yes)
 {
  if (!lite)
  document.getElementById('csv-quote').value = document.getElementById('csv-quote').dataset.oldvalue;
  document.getElementById('quote-escape-settings').style.display = 'block';
 }
 else
 {
  if (!lite)
  {
   document.getElementById('csv-quote').dataset.oldvalue = document.getElementById('csv-quote').value;
   document.getElementById('csv-quote').value = '';
  }
  document.getElementById('quote-escape-settings').style.display = 'none';
 }
}
function elementsToArray(str)
{
 return JSON.stringify(splitCSV(str, getInputString('element-separator'), getInputString('csv-quote')));
}
function CSVTo2DArray(str)
{
 var tsep = getInputString('csv-quote'), tlines = splitCSV(str, getInputString('row-separator'), tsep, true);
 for(var t=0;t<tlines.length;t++) tlines[t] = splitCSV(tlines[t], getInputString('element-separator'), tsep);
 return JSON.stringify(tlines);
}
function arrayToCSV(two, str)
{
 if (str[0]!=='[') str = '['+str;
 if (str[str.length-1]!==']') str = str+']';
 var arr = null, t, err = '';

 try
 {
  arr = JSON.parse(str);
 } catch(e) {err=e}

 if (arr===null || !Array.isArray(arr))
 throw e || 'Error while parsing JSON';
 
 return joinCSV(arr, getInputString('element-separator'), two?getInputString('row-separator'):null, getInputString('csv-quote'), document.getElementById('csv-quote-always').checked) 
}


function columnAdmin(action, str) //action will be bound to function
{
 /*
 0 - leave
 1 - remove
 2 - sort
 3 - insert
 4 - reverse
 */
 function sortNumberColumns(a, b)
 {
  return a[colno]-b[colno];
 }
 function sortColumns(a, b)
 {
  return a[colno]>b[colno]?1:-1;
 }

 var cstart = Math.max(parseInt(document.getElementById('cadmin-column-start').value)||0, 0), cend = Math.max(parseInt(document.getElementById('cadmin-column-end').value)||0, 0);
 if (cstart>cend)
 {
  var tmp = cstart; cstart = cend; cend = tmp;
 }
 var oreverse = document.getElementById('cadmin-column-odesc').checked, asNumbers = document.getElementById('cadmin-column-omode').checked, colno = Math.max(parseInt(document.getElementById('cadmin-column-colno').value) || 0, 0);
 var sep = getInputString('element-separator');
 var rsep = getInputString('row-separator');
 var tsep = getInputString('csv-quote');
 var t, insertLines, insertColumn = parseInt(document.getElementById('cadmin-column-insert').value) || 0, insertAsOne = document.getElementById('cadmin-column-insert-asone').checked;

 if (action === 3)
 {
  insertLines = splitCSV(getAdditionalVal(), rsep, tsep, insertAsOne?false:true);
  for(t=0;t<insertLines.length;t++)
  insertLines[t] = insertAsOne?[insertLines[t]]:splitCSV(insertLines[t], sep, tsep);
 }

 var tlines = splitCSV(str, rsep, tsep, true), tline, tmpline;
 for(t=0;t<tlines.length;t++)
 {
  tline = splitCSV(tlines[t], sep, tsep);
  if (action === 0)
  tline = tline.splice(cstart, cend-cstart+1);
  else if (action === 1)
  tline.splice(cstart, cend-cstart+1);
  else if (action === 2 && asNumbers)
  tline[colno] = parseFloat(tline[colno]);
  else if (action === 3)
  {
   var args = [insertColumn, 0].concat(insertLines[t] || ['']);
   Array.prototype.splice.apply(tline, args);
  }
  else if (action === 4)
  {
   tmpline = tline.splice(cstart, cend-cstart+1);
   tmpline.reverse();
   var args = [cstart, 0].concat(tmpline);
   Array.prototype.splice.apply(tline, args);
  }
  tlines[t] = tline;
 }
 if (action === 2)
 {
  tlines.sort(asNumbers?sortNumberColumns:sortColumns);
  if (oreverse)
  tlines.reverse();
 }
 return joinCSV(tlines, sep, rsep, tsep, document.getElementById('csv-quote-always').checked);
}
function setUnion(a,b)
{
 var t, hash = {}, ret = [];
 for(t=0;t<a.length;t++)
 if (!hash[a[t]])
 {
  ret.push(a[t]);
  hash[a[t]] = 1;
 }
 for(t=0;t<b.length;t++)
 if (!hash[b[t]])
 {
  ret.push(b[t]);
  hash[b[t]] = 1;
 }
 return ret;
}
function setIntersection(a,b)
{
 var t, hash = {}, ret = [];
 for(t=0;t<a.length;t++)
 if (!hash[a[t]])
 {
  hash[a[t]] = 1;
 }
 for(t=0;t<b.length;t++)
 if (hash[b[t]] === 1)
 {
  ret.push(b[t]);
  hash[b[t]] = 3;
 }
 return ret;
}
function setDifference(a,b)
{
 var t, hash = {}, tmp = [], ret = [];
 for(t=0;t<a.length;t++)
 if (!hash[a[t]])
 {
  tmp.push(a[t]);
  hash[a[t]] = 1;
 }

 for(t=0;t<b.length;t++)
 {
  if (!hash[b[t]])
  {
   tmp.push(b[t]);
   hash[b[t]] = 2;
  }
  else hash[b[t]] |= 2;
 }

 for(t=0;t<tmp.length;t++)
 if (hash[tmp[t]]===1 || hash[tmp[t]]===2)
 ret.push(tmp[t]);

 return ret;
}
function setComplement(a,b) //a\b
{
 var t, hash = {}, tmp = [], ret = [];
 for(t=0;t<a.length;t++)
 if (!hash[a[t]])
 {
  tmp.push(a[t]);
  hash[a[t]] = 1;
 }

 for(t=0;t<b.length;t++)
 {
  if (hash[b[t]])
  hash[b[t]] = 3;
 }

 for(t=0;t<tmp.length;t++)
 if (hash[tmp[t]]===1)
 ret.push(tmp[t]);

 return ret;
}
function padElements(elements, padType, padStr, padLength, padUnicode)
{
 var t, ell, cut, pad, newPad;
 for(t=0;t<elements.length;t++)
 {
  ell = padUnicode?unicodeLength(elements[t]):elements[t].length;
  if (ell>=padLength) continue;
  cut = padLength-ell; pad = '';
  while(cut)
  {
   newPad = padUnicode?unicodeSubstring(padStr, 0, cut):padStr.slice(0, cut);
   pad += newPad;
   cut -= padUnicode?unicodeLength(newPad):newPad.length;
  }
  elements[t] = padType?elements[t]+pad:pad+elements[t];
 }
}
function elAdmin(type, str)
{
 var sep = getInputString('element-separator');
 var tsep = getInputString('csv-quote');

 var desc = document.getElementById('cadmin-column-odesc').checked, asint = document.getElementById('cadmin-column-omode').checked;
 var elements = splitCSV(str, sep, tsep);

 if (type==0)
 {
  elements.sort(asint?function(a, b){return desc?b-a:a-b;}:undefined);
  if (!asint && desc)
  elements.reverse();
 }
 else if (type==1)
 {
  elements.reverse();
 }
 else if (type==2)
 {
  elements = u(elements);
 }
 else if (type==3)
 elements = shuffle(elements);
 else if (type>=10 && type<14)
 {
  var elements2 = splitCSV(getAdditionalVal(), sep, tsep);
  if (type==10) elements = setUnion(elements, elements2);
  else if (type==11) elements = setIntersection(elements, elements2);
  else if (type==12) elements = setDifference(elements, elements2);
  else if (type==13) elements = setComplement(elements, elements2);
 }
 else if (type===14)
 {
  var padType = document.getElementById('eladmin-pad-type').selectedIndex;
  var padStr = getInputString('eladmin-pad-str');
  var padLength = parseInt(document.getElementById('eladmin-pad-length').value) || 0;
  var padUnicode = document.getElementById('eladmin-pad-length-unicode').checked;
  padElements(elements, padType, padStr, padLength, padUnicode);
 }
 else
 {
  var result = 0;

  if (type==4)
  result = elements.length;
  else if (type==5)
  {
   for(var t=0;t<elements.length;t++)
   if (!isNaN(parseFloat(elements[t])))
   result++;
  }
  else if (type==6)
  {
   for(var t=0;t<elements.length;t++)
   if (!isNaN(parseFloat(elements[t])))
   result+=parseFloat(elements[t]);
  }
  else if (type==7)
  {
   for(var t=0,cnt=0;t<elements.length;t++)
   if (!isNaN(parseFloat(elements[t])))
   {
    result+=parseFloat(elements[t]);
    cnt++;
   }

   result = parseFloat((cnt?result/cnt:0).toFixed(4));
  }
  else if (type==8) //median
  {
   for(var t=0;t<elements.length;t++)
   if (isNaN(elements[t]=parseFloat(elements[t])))
   elements.splice(t--);

   elements.sort(function(a,b){return a-b});
   if (elements.length && !(elements.length%2))
   result = (elements[elements.length/2-1]+elements[elements.length/2])/2;
   else if (elements.length)
   result = elements[(elements.length-1)/2];
  }
  else if (type==9) //mode
  {
   var hash = {}, maxhash = 0, maxval , maxbad = true;
   for(var t=0;t<elements.length;t++)
   {
    hash[elements[t]] = (hash[elements[t]] || 0)+1;
    if (hash[elements[t]]>maxhash)
    {
     maxhash = hash[elements[t]]; maxbad = false;
     maxval = elements[t];
    }
    else if (hash[elements[t]]===maxhash)
    maxbad = true;
   }
   if (maxbad) result = 'None';
   else result = maxval;
  }
  
  document.getElementById('eladmin-calc-result-td').style.visibility = 'visible';
  document.getElementById('eladmin-calc-result').textContent = result;
  return;
 }
 return joinCSV(elements, sep, null, tsep, document.getElementById('csv-quote-always').checked);
}
/*
0-element 1-row 2-all
*/
function applyPerItem(type, str)
{
 if (lastTransformFunction === null)
 throw 'Marked transform not set.';

 var ret = str, elements, rsep = getInputString('row-separator'), sep = getInputString('element-separator'), tsep = getInputString('csv-quote');

 elements = splitCSV(str, type?rsep:sep, tsep, type);
 if (type===2)
 {
  m:for(var row=0;row<elements.length;row++)
  {
   elements[row] = splitCSV(elements[row], sep, tsep);
   for(var col=0;col<elements[row].length;col++)
   {
    try {
     elements[row][col] = lastTransformFunction(elements[row][col]);
    } catch(e) {
     throw 'Error in row '+(row+1)+', column '+col+': '+e;
    }
   }
  }
 }
 else
 {
  for(var t=0;t<elements.length;t++)
  {
   try {
    elements[t] = lastTransformFunction(elements[t]);
   } catch(e) {
    throw 'Error in '+(type?'row':'element')+' '+t+': '+e;
   }

   if (type)
   elements[t] = splitCSV(elements[t], sep, tsep);
  }
 }
 
 return joinCSV(elements, sep, type?rsep:null, tsep, document.getElementById('csv-quote-always').checked);
}

function elementWise(str){ return applyPerItem(0, str);}
function rowWise(str){ return applyPerItem(1, str);}
function CSVWise(str){ return applyPerItem(2, str);}

function escapeHTMLChar(c)
{
 switch (c)
 {
  case '<': return '&lt;';
  case '>': return '&gt;';
  case '&': return '&amp;';
  case '\'': return '&#39;';
  case '"': return '&quot;';
 }
 return c;
}

function escapeHTML(str) {
 return str.replace(/[<>&'"]/g, escapeHTMLChar);
}

function escapeUnicodeHTML(str) {
 str = escapeHTML(str);
 
 var ret = '';
 
 for(var t=0,c;t<str.length;t++)
 {
  c = str.codePointAt(t);
  if (c > 127)
  ret += '&#'+c+';';
  else
  ret += str[t];
  
  if (c > 65535)
  t++;
 }
 
 return ret;
}

function unescapeHTML(str)
{
 var doc = new DOMParser().parseFromString(str, 'text/html');
 return doc.documentElement.textContent;
}

function escapeRegExp(string)
{
 return (string+'').replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
}
function unescapeRegExp(string)
{
 return string.replace(/\\([.*+?^${}()|\[\]\/\\])/g, "$1");
}

//regex stuff

var currentRegexBackend = 1;
document.addEventListener('DOMContentLoaded', function()
{
 var backendSelect =  document.getElementById('regex-search-backend');
 
 //bind to onBackendChange, and execute it
 (backendSelect.onchange = function()
 {
  regexBackendChange(backendSelect.selectedIndex);
 })();
});

function regexBackendChange(backend, callback)
{
 var select = document.getElementById('regex-search-backend');
 select.selectedIndex = backend;
 
 var option = select.children[backend];
 var callme = function()
 {
  currentRegexBackend = backend;
  
  document.getElementById('regextractor-button').style.display = backend === 3 ? '' : 'none';
    
  if (callback) callback();
 };
 
 if (option.dataset.ensureloadedonselect)
 {
  var toLoad = option.dataset.ensureloadedonselect.split(',');
  tcEnsureLoaded(toLoad, callme);
 }
 else callme();
} 

function advanceStringIndex(str, idx, unicode)
{
 if (!unicode) return idx+1;
 if (idx>=str.length) return idx+1;
 if (str.charCodeAt(idx) < 0xd800 || str.charCodeAt(idx) > 0xdbff) return idx+1;
 if (str.charCodeAt(idx+1) < 0xdc00 || str.charCodeAt(idx+1) > 0xdfff) return idx+1;
 return idx+2;
}

function getFindRegex(nonThrowingExec)
{
 //we use nonThrowingExec for non-ttbf based functions using it
 //in order not to be punished by v8 for using try/catch
 //or maybe bcoz I don't like try/catch? dunno

 //stuff returned by this function must not be stored, and its only valid until
 //we're called again... coz for some backends (ported from C), 
 //we must deallocate memory manually
 
 //so now try to free the last one if we have one that wants it
 if (getFindRegex.lastRegex && getFindRegex.lastRegex.destroy)
 {
  getFindRegex.lastRegex.destroy();
  getFindRegex.lastRegex = null;
 }
 
 var rtext = document.getElementById('regex-search-rtext').value, mcase = document.getElementById('regex-search-mcase').checked, municode = document.getElementById('regex-search-municode').checked, multiline = document.getElementById('regex-search-multiline').checked, extended = document.getElementById('regex-search-mextended').checked;
 var regex;
 
 try
 {
  if (currentRegexBackend === 2)
  regex = new PCRE(rtext, 'g'+(mcase?'':'i')+(multiline?'m':'')+(municode?'u':'')+(extended?'x':''));
  else if (currentRegexBackend === 3)
  regex = new OnigmoX(rtext, 'g'+(mcase?'':'i')+(multiline?'m':'')+(municode?'u':'')+(extended?'x':''));
  else
  {
   if (!currentRegexBackend)
   rtext = escapeRegExp(rtext);
   else if (extended)
   rtext = minifyRegex(rtext);
   
   regex = new RegExp(rtext, 'g'+(mcase?'':'i')+(multiline?'m':'')+(municode?'u':''));
  }

  
  getFindRegex.lastRegex = regex;

  if (nonThrowingExec) //for throwing backends, obviously
  {
   regex.realExec = regex.exec;
   regex.exec = function()
   {
    try { return regex.realExec.apply(regex, arguments); } 
    catch(e)
    { 
     regex.error = e;
     return 'error';
    }
   };
  }
  return regex;
 }
 catch(e)
 {
  regexStatusMsg('Invalid regex: '+e);
  return null;
 }
}

function findNextRegex(silent)
{
 var regex = getFindRegex(true);
 var match, t, v = getValue(), matchSteps = null;
 
 if (regex === null)
 return false;

 regex.lastIndex = getSelectionEnd();
 for(t=0;t<2;t++)
 {
  match=regex.exec(v);
  
  if (regex.matchSteps !== undefined)
  matchSteps = (matchSteps||0)+regex.matchSteps;
  
  //check if match is an error
  if (match === 'error')
  {
   regexStatusMsg(regex.error);
   return false;
  }
  else if (match!==null)
  {
   if (regex.matchSteps !== undefined)
   matchSteps = (matchSteps||0)+regex.matchSteps;
   
   setSelection(0, regex.lastIndex-match[0].length);
   setSelection(1, regex.lastIndex);
   ensureSelectionVisible();
   regexStatusMatch(match, regex.lastIndex-match[0].length, matchSteps);
   break;
  }
  else
  regex.lastIndex = 0;
  
  if (t)
  {
   matchSteps = (matchSteps !== null) ? ' (steps: <span class="result">'+matchSteps+'</span>)' : '';
   
   regexStatusMsg('No match found.'+matchSteps);
   return false;
  }
 }
 setFocus(true);
 tcDispatch('cursorUpdate');
 return true;
}
function emulateReplaceStr(str)
{
 return function()
 {
  return _emulateReplaceStr(this, str, arguments);
 };
}
function _emulateReplaceStr(result, str, args)
{
 var t, state = false, ret = '', tmp, tmp2, copy, openBraces = 0, subState, subOpenBraces;
 for(t=0;t<str.length;t++)
 {
  if (!state)
  {
   if (str[t] === '$') state = true;
   else if (str[t] === '}' && openBraces) openBraces--; //ignore end of the conditional
   else ret += str[t];
  }
  else
  {
   if (str[t] === '$') ret += '$';
   else if (str[t] === '}') ret += '}';
   else if (str[t] === '{') //${n} or ${name}
   {
    t++;
    var patStart = t, pattern;
    
    //get pattern name
    while(t<str.length && str[t]!=='?' && str[t]!=='!' && str[t]!=='}' && str[t]!=='|')
    t++;
    
    if (t === str.length) break;
    
    pattern = str.substring(patStart, t);
    pattern = args[!isNaN(tmp=parseInt(pattern)) && tmp<args.length-2 ? tmp : result.namedPatterns ? result.namedPatterns[pattern] : ''];
    
    if (str[t] === '|') //treat empty as false
    {
     pattern = pattern === '' ? undefined : pattern;
     t++;
    }
    
    if (str[t] === '}') //echo the pattern
    {
     ret += pattern || '';
    }
    else
    {
     //find out where the final } of this condition resides
     copy = t; subState = false; subOpenBraces = 0;

     while(t<str.length)
     {
      if (subState)
      {
       if (str[t] === '{') subOpenBraces++;
       subState = false;
      }
      else if (str[t] === '}') subOpenBraces--;
      else if (str[t] === '$') subState = true;

      if (subOpenBraces < 0)
      break;
      
      t++;
     }
     
     if (t === str.length) break;
     //t is now the addr of brace end
     
     if ((str[copy] === '?' && pattern === undefined) || (str[copy] === '!' && pattern !== undefined))
     {
      //skip
     }
     else
     {
      t = copy;
      openBraces++; //so that this } won't be echoed
     }
    }
   }
   else if (str[t] === '&') ret += args[0];
   else if (str[t] === '`') ret += args[args.length-1].slice(0, args[args.length-2]);
   else if (str[t] === '\'') ret += args[args.length-1].slice(args[args.length-2]+args[0].length);
   else if (/^[0-9]$/.test(str[t]) && /^[0-9]$/.test(str[t+1]) && (tmp=parseInt(str[t]+str[t+1]))<args.length-3)
   {
    ret += args[tmp] || '';
    t++;
   }
   else if (/^[1-9]$/.test(str[t]) && (tmp=parseInt(str[t]))<args.length-2)
   {
    ret += args[tmp] || '';
   }
   else 
   ret += '$'+str[t];

   state = false;
  }
 }
 return ret;
}

function getReplacementFunc()
{
 var replacement = getInputString('regex-search-rreplace');
 return emulateReplaceStr(replacement);
}

function replaceRegex()
{
 /*
 if nothing selected, try to find something. if that fails or returns other position, return
 if something selected, set the end cursor to the begining in order to verify the selection
 then find. if nothing selected, return
 set selection end as the newly replaced one, only to begin next search with this+1
 if match is empty, advance by one to match replace all behaviour
 */
 //note: we can't just replace on substring, because this could cause false-positive ^ and $ matches!!
 //note: if a pattern matches the end of the string, and uses something that matches as a replacement,
 //this function will never stop, so don't use it in a loop

 var match, t;

 var ss=getSelectionStart(), se = getSelectionEnd(), osel = se-ss;
 
 if (!osel)
 {
  if (!findNextRegex()) return;
  
  if (ss !== getSelectionStart() || se !== getSelectionEnd())
  return;
 }
 else
 {
  setSelection(1, ss);
  tcDispatch('cursorUpdate');

  if (!findNextRegex())
  return;

  ss=getSelectionStart(); se = getSelectionEnd(); osel = se-ss;
  if (!osel)
  {
   return;
  }
 }

 var regex = getFindRegex();
 var replacementFunc = getReplacementFunc();
 
 if (regex === null) //"shouldn't happen" (TM)
 return;
 
 regex.lastIndex = ss;
 var v = getValue();
 var match = regex.exec(v);
 var empty = !match[0].length;
 var mstart = regex.lastIndex-match[0].length;
 match.push(regex.lastIndex-match[0].length, v);

 var tval = v.slice(0, mstart)+replacementFunc.apply(match, match);
 se = tval.length;
 setValue(tval+v.slice(regex.lastIndex));
 
 if (empty) //for empty matches
 se = advanceStringIndex(getValue(), se, regex.unicode);
 
 setSelection(0, ss);
 setSelection(1, se);

 tcDispatch('textModified');
 findNextRegex(true);
}


function execWholeRegex(regex, str, startFrom)
{
 var results = [], result, done = false;
 
 regex.lastIndex = startFrom || 0;
 
 while(!done)
 {
  result = regex.roots ? regex.execRooted(str) : regex.exec(str);
  if (!result) done = true;
  else
  {
   if (result.rootedResults) //support our special feature
   {
    for(var t=0;t<result.rootedResults.length;t++)
    {
     results.push(result.rootedResults[t]);
    }
   } 
   else results.push(result);
 
   if (!regex.global) done = true;
   else
   {
    if (!result[0])
    regex.lastIndex = advanceStringIndex(str, regex.lastIndex, regex.unicode);
   }
  }
 }
 
 return results;
}

function replaceAllRegex(str)
{
 //this is no longer stand-alone, this is serviced via transformtext
 var regex = getFindRegex();
 var replacementFunc = getReplacementFunc();
 
 if (regex === null)
 return;

 var results = execWholeRegex(regex, str);
 
 var ret = '', pos = 0, tmp;
 for(var t=0;t<results.length;t++)
 {
  results[t].push(results[t].index, str);
  
  ret += str.substring(pos, results[t].index)+replacementFunc.apply(results[t], results[t]);
  pos = results[t].index+results[t][0].length;
 }
 
 return ret+str.substr(pos);
}

function extractAllRegex(str)
{
 var regex = getFindRegex();
 var replacementFunc = getReplacementFunc();

 var results = execWholeRegex(regex, str);
 var ret = '', tmp;
 
 for(var t=0;t<results.length;t++)
 {
  results[t].push(results[t].index, str);
  ret += replacementFunc.apply(results[t], results[t]);
 }
  
 return ret;
}
/*
root trick, so that we can use headers on root:
?u:((?:[^]*?)...regex here...)+

but is it that hard?

maybe it's not about it being hard but that the array mode is a feature

regex.

*/
function exportAllRegexAsJSONTree(str)
{
 var regex = getFindRegex();
 
 if (!regex.specialGroups.length)
 throw 'No groups to export!\nMark capturing groups you want in the export with a + sign, for example:\n(+<[^>]*>)';

 var ret = [], result, done = false;
 
 regex.lastIndex = 0;
 
 while((result=regex.execTree(str)) !== null)
 {
  if (!result.base[0])
  regex.lastIndex = advanceStringIndex(str, regex.lastIndex, regex.unicode);
  
  result = result.tree;
  
  ret.push(result);
 }

 //allow keys on root, but it doesn't merge results
 ret = regex._processTreeKeys(ret);
 
 if (Array.isArray(ret) && ret.length === 1)
 ret = ret[0];
 
 return JSON.stringify(ret);
}

function occurencesOfRegex()
{
 var no = document.getElementById('regexo-no').checked, rtext = document.getElementById('regexo-rtext').value, mcase = document.getElementById('regexo-mcase').checked, municode = document.getElementById('regexo-municode').checked, multiline = document.getElementById('regexo-multiline').checked, really = document.getElementById('regexo-regex').checked;
 var str = getValue();

 var regex, match, ret=0;
 try
 {
  regex = new RegExp(really?rtext:escapeRegExp(rtext), 'g'+(mcase?'':'i')+(multiline?'m':'')+(municode?'u':''));
 }
 catch(e)
 {
  return 'Invalid regex!';
 }

 while((match=regex.exec(str))!==null)
 {
  ret++;
  if (!no)
  regex.lastIndex = regex.lastIndex-match[0].length+1;
 }
 
 return ret;
}
function removeDuplicates(str) //this may be stupid, but one day (more precisely - today, 17 march 2015) I needed it
{
 /*
  We need to mess with UTF16 stuff here, otherwise this would not be accurate...
  As you can see, if your characters are not in BMP then you have a problem...
 */
 var used_chars = [], result_str = '', t, cc;
 for(t=0;t<str.length;t++)
 {
  if (cc=fixedCharCodeAt(str, t)) //surrogate? then it's either duplicate or already processed
  {
   if (used_chars.indexOf(cc)==-1) //no duplicates allowed
   {
    used_chars.push(cc);
    result_str += str[t];
    if ((t+1)<str.length && !fixedCharCodeAt(str, t+1)) //check if the following char is a surrogate
    result_str += str[t+1];
   }
  }
 }
 return result_str;
}
function removeDuplicateLines(str) 
{
 return u(str.split('\n')).join('\n');
}

//ok, let's add our gzip functionality back
//possible thanks to "pako"
function hex2uint8(str)
{
 var ret = new Uint8Array(str.length/2|0), code;
 for(var t=0;t<str.length;t+=2)
 {
  code = parseInt(str.substr(t, 2), 16);
  if (isNaN(code)) throw 'Not a hex string.';
  
  ret[t/2] = code;
 }
 return ret;
}
function uint82bin(arr) //non utf8
{
 for(var t=0, ret='';t<arr.length;t++)
 ret += String.fromCharCode(arr[t]);
 return ret;
}
function buildHexStr(arr)
{
 var ret = '', tstr;
 for(var t=0;t<arr.length;t++)
 {
  tstr = arr[t].toString(16);
  if (tstr.length === 1) tstr = '0'+tstr;

  ret += tstr;
 }
 return ret;
}
function gzdeflate(str)
{
 return buildHexStr(pako.deflateRaw(hex2uint8(str)));
}
function gzcompress(str)
{
 return buildHexStr(pako.deflate(hex2uint8(str)));
}
function gzencode(str)
{
 return buildHexStr(pako.gzip(hex2uint8(str)));
}
function gzinflate(str)
{
 return buildHexStr(pako.inflateRaw(hex2uint8(str)));
}
function gzuncompress(str)
{
 return buildHexStr(pako.inflate(hex2uint8(str)));
}
function gzdecode(str)
{
 return buildHexStr(pako.ungzip(hex2uint8(str)));
}
function compareAreas()
{
 var selStart = getSelectionStart(), selEnd = getSelectionEnd(), v = getValue();
 var v1 = '';

 if (selStart===selEnd && v.length>0)
 {
  v1 = v;
 }
 else if (v.length>0)
 {
  v1 = v.substring(selStart, selEnd);
 }

 var v2, t, mismatch = -1;

 try
 {
  v2 = getAdditionalVal();
 }
 catch(e)
 {
  alert(e);
  return;
 }

 for(t=0;t<v1.length && t<v2.length;t++)
 {
  if (v1[t]!==v2[t])
  {
   mismatch = t;
   break;
  }
 }
 if (v1.length!==v2.length && mismatch===-1)
 mismatch = t;

 if (mismatch===-1)
 document.getElementById('compare-result').textContent = 'Contents are the same';
 else
 {
  document.getElementById('compare-result').textContent = 'Difference @ position '+mismatch+(selStart!==selEnd?' (absolute position '+(selStart+mismatch)+')':'');
 }
}
function limitFloatPrecision(str, places) //we don't want to break an IP address :>
{
 return str.replace(/\d+\.\d+(?!\.\d)/g, function(match){return parseFloat(parseFloat(match).toFixed(places))+"";});
}
function _limitFloatPrecision(str)
{
 return limitFloatPrecision(str, document.getElementById('limit-float-places').value);
}



function entropy(str) //doesn't support surrogates, but that'd be an overkill
{
 var countMap = [], c;
 var ret = 0;
 
 for(var t=0;t<str.length;t++)
 {
  c = str.charCodeAt(t);  
  countMap[c] = (countMap[c] || 0) + 1;
 }
 
 var ckeys = Object.keys(countMap), p;
 for(var t=0;t<ckeys.length;t++)
 {
  p = countMap[ckeys[t]]/str.length;
  ret += p*Math.log(p);
 }
 
 ret /= Math.log(2);
 
 return -ret;
}

function chunksEntropy(str, chunkSize)
{
 var ret = [], entropySum = 0, numEntropies = 0;
 
 for(var t=0;t<str.length;t+=chunkSize)
 {
  curr = entropy(str.slice(t, t+chunkSize));
  entropySum += curr; numEntropies++;
  ret.push('Chunk ['+t+'-'+Math.min(t+chunkSize, str.length)+']: '+curr);
 }
 ret.push('Avg: '+(entropySum/numEntropies));
 
 return ret.join('\n');
}

function calcEntropy(str)
{
 var chunk = document.getElementById('entropy-chunked').checked, chunkSize = parseInt(getInputString('entropy-chunk-size')) || 1000;
 
 if (chunk)
 return chunksEntropy(str, chunkSize);
 else
 return entropy(str)+'';
}

function gcd(x, y) //#non-modulo
{
 x = Math.abs(x);
 y = Math.abs(y);
 while(x*y != 0)
 {
  if (x >= y) x = x % y;
  else y = y % x;
 }
 return (x + y);
}
function lcm(x, y)  //#non-modulo
{
 if (x===y && x===0) return 0;
 return (x/gcd(x,y))*y;
}
function asum(a)
{
 for(var t=0,sum=0;t<a.length;t++) sum += a[t];
 return sum;
}
function ae(a, b)
{
 if (a.length!==b.length) return false;
 for(var t=0;t<a.length;t++)
 if (a[t]!==b[t]) return false;
 return true;
}
function permutationToCycles(perm)
{
 if (!perm.length) return false;

 var used = [true], count = 0, ret = [], cycle = [], p=0;
 while(true)
 {
  while(true)
  {
   if (p === cycle[0]) break;

   used[p] = true; count++;
   cycle.push(p);
   p = perm[p];
  }

  if (cycle.length>1)
  ret.push(cycle);

  if (count===perm.length)
  break;

  cycle = [];
  for(p=0;p<perm.length;p++)
  if (!used[p]) break;
 }
 
 return ret;
}
function cyclesToPermutation(cycles)
{
 var t, tt, perm = [];
 for(t=0;t<cycles.length;t++)
 for(tt=0;tt<cycles[t].length;tt++)
 {
  perm[cycles[t][tt]] = cycles[t][(tt+1)%cycles[t].length];
 }

 for(t=0;t<perm.length;t++)
 if (perm[t]===undefined) perm[t] = t;

 return perm;
}
function permutationOrder(cycles)
{
 if (!cycles.length) return 0;

 var t, ret = cycles[0].length;
 for(t=1;t<cycles.length;t++)
 ret = lcm(ret, cycles[t].length);
 
 return ret;
}
function permutationInvert(cycles)
{
 var ret = [];
 for(var t=0;t<cycles.length;t++)
 ret.push(cycles[t].slice().reverse());
 return ret;
}
function permutationCompose(c1, c2) //c1*c2
{
 var t, x, p1 = cyclesToPermutation(c1), p2 = cyclesToPermutation(c2), ret = [];
 for(t=0;t<p1.length || t<p2.length;t++)
 {
  x = t<p2.length?p2[t]:t;
  ret[t] = x<p1.length?p1[x]:x;
 }
 return permutationToCycles(ret);
}
function permutationSign(cycles)
{
 for(var t=0,ret=1;t<cycles.length;t++)
 if (cycles[t].length%2===0) ret *= -1;
 return ret;
}
function parsePermutationString(str)
{
 if (str.indexOf('(')!==-1)
 {
  var t, ccl = str.slice(1, -1).split(')(');
  for(t=0;t<ccl.length;t++)
  ccl[t] = parsePermutationString(ccl[t]);
  if (!ccl.length) return false;
  return ccl;
 }
 else
 {
  var t, el = str.replace(/\s*/g, '').split(str.indexOf(',')!==-1?',':'');
  for(t=0;t<el.length;t++)
  {
   el[t] = parseInt(el[t])-1;
   if (isNaN(el[t])) return false;
  }
  return el;
 }
}
function parsePermutationStrAsCycle(str)
{
 var perm = parsePermutationString(str);
 if (!perm) return false;
 if (!perm.length || Array.isArray(perm[0])) return perm;

 return permutationToCycles(perm);
}
function permutationToString(perm)
{
 if (!perm.length) return '';

 if (Array.isArray(perm[0]))
 {
  for(var t=0, ret='';t<perm.length;t++)
  ret += '('+permutationToString(perm[t])+')';
 }
 else
 { 
  for(var t=0, ret=[];t<perm.length;t++)
  ret.push(perm[t]+1);
  ret = ret.join(',');
 }
 return ret;
}
function pcalcConvert(tomap)
{
 var input = parsePermutationString(tomap?document.getElementById('pcalc-cyclic').value:document.getElementById('pcalc-map').value);
 if (!input)
 {
  alert('Wrong input!');
  return;
 }

 var output = (tomap?cyclesToPermutation:permutationToCycles)(input);
 document.getElementById(tomap?'pcalc-map':'pcalc-cyclic').value = permutationToString(output);
}
function pcalcSwap()
{
 var v1 = document.getElementById('pcalc-A').value, v2 = document.getElementById('pcalc-B').value;
 document.getElementById('pcalc-A').value = v2; document.getElementById('pcalc-B').value = v1;
}
function pcalcCopy()
{
 document.getElementById('pcalc-A').value = document.getElementById('pcalc-result').value;
}
function pcalc(type)
{
 var cycles = parsePermutationStrAsCycle(document.getElementById('pcalc-A').value), cyclesB;
 if (!cycles) {alert('Invalid input!');return;}
 if (type==2)
 {
  cyclesB = parsePermutationStrAsCycle(document.getElementById('pcalc-B').value);
  if (!cyclesB) {alert('Invalid input!');return;}
 }

 var result;
 if (!type) result = permutationOrder(cycles);
 else if (type===1) result = permutationSign(cycles);
 else if (type===2) result = permutationToString(permutationCompose(cycles, cyclesB));
 else if (type===3) result = permutationToString(permutationInvert(cycles));

 document.getElementById('pcalc-result').value = result;
 document.getElementById('pcalc-result-copy').style.display = type>1?'inline':'none';
}

function __swapArgsAB(func)
{
 return function(a, b){return func(b, a);}
}

var regexExamples = 
[
 {name: "Match lines containing ABC", regex: '^(.*?)ABC(.*)$', replacement: '$&\n', multiline: true, matchBased: true},
 {name: "Match all hexified chars", regex: '\\[([0-9A-F]{2,5})]', replacement: '$&', matchBased: true},
 {name: "Match lines that are palindromes (using Ruby's regex syntax)", regex: '^((.)\\g<1>\\k<2+0>|.?)$', replacement: '$&', matchBased: true, multiline: true, backend: 3},
 {name: "Strip whitespace", regex: '\\s', replacement: ''},
 {name: "Strip trailing whitespace", regex: '[ \\t]+$', multiline: true, replacement: ''},
 {name: "Strip newline", regex: '\\n', replacement: ''},
 {name: "Remove lines containing ABC", regex: '^(.*?)ABC(.*)(\n|$)', replacement: '', multiline: true},
 {name: "Remove text after # in each line", regex: '^(.*?)#.*$', replacement: '$1', multiline: true},
 {name: "deadbabe -> de ad ba be", regex: '([^]{2})(?!$)', replacement: '$1 ', multiline: false},
 {name: "deadbabe -> dead babe", regex: '([^]{4})(?!$)', replacement: '$1 ', multiline: false},
 {name: "deadbabe -> 0xde,0xad,0xba,0xbe,", regex: '([^]{2})', replacement: '0x$1,'},
 {name: "0xde,0xad,0xba,0xbe -> deadbabe", regex: '0x([^]{2})(,)?', replacement: '$1'},
 {name: "deadbabe -> \\xde\\xad\\xba\\xbe", regex: '([^]{2})', replacement: '\\x$1'},
 {name: "\\xde\\xad\\xba\\xbe -> deadbabe", regex: '\\\\x([^]{2})', replacement: '$1'},
 {name: "deadbabe -> 0xdead,0xbabe,", regex: '([^]{4})', replacement: '0x$1,'},
 {name: "0xdead,0xbabe -> deadbabe", regex: '0x([^]{4})(,)?', replacement: '$1'},
 {name: "deadbabe -> \\udead\\ubabe", regex: '([^]{4})', replacement: '\\u$1'},
 {name: "\\udead\\ubabe -> deadbabe", regex: '\\\\u([^]{4})', replacement: '$1'},
 {name: "Leave only first letters of the words", regex: '(([^\s])[^\s]*\s*)', replacement: '$2'},
 {name: "Inverse 2 letters in pairs (respect space), abcd -> cdab", regex: '(\\s*)(..)(\\s*)(..)', replacement: '$1$4$3$2'},
 {name: "Leave characters in range 0x20-0x7f", regex: '[^\\u0020-\\u007f]', replacement: '', matchcase: true},
 {name: "Remove characters in range 0x20-0x7f", regex: '[\\u0020-\\u007f]', replacement: '', matchcase: true},
 {name: "Leave unicode characters in range U+0000 - U+1A000", regex: '[^\\u{0000}-\\u{1A000}]', replacement: '', unicode: true, matchcase: true},
 {name: "Remove unicode characters in range U+0000 - U+1A000", regex: '[\\u{0000}-\\u{1A000}]', replacement: '', unicode: true, matchcase: true},
 {name: "Inverse 2 elements separated by comma in pairs", regex: '([^,]*),([^,]*)(,|$)', replacement: '$2,$1$3', multiline: false},
 {name: "Inverse letters in pairs", regex: '(.)(.)', replacement: '$2$1'},
];

//groups of parameters may have a .display property with info text

var regexInteractiveExamplesParameters = {
  takeXYZ: {parameters: ['X', 'Y', 'Z'], X: {type: 'number', value: 1, min: 0}, Y: {type: 'number', value: 1, min: 1}, Z: {type: 'number', value: 3, min: 0}},
  takeElXYZ: {parameters: ['X', 'Y', 'Z'], X: {type: 'number', value: 1, min: 0}, Y: {type: 'number', value: 2, min: 1}, Z: {type: 'number', value: 3, min: 0}},
  railFence: {parameters: ['height', 'mode', 'forElements'], height: {display: 'Fence height', type: 'number', value: 2, min: 2}, mode: {display: 'Fence type', type: 'radio', value: 0, options: ['\\\\\\', '\\/\\', '/\\/', '///']}, forElements: {type: 'bool', display: 'Work on elements instead of characters', value: false}},
  railFenceArgs: {}, //shared args, otherwise each tool gets it's own copy
};
var regexInteractiveExamples = 
[
 {name: "Leave characters in range", regex: '[^\\u<Start>-\\u<End>]', replacement: '', unicode: false, matchcase: true, parameters: ['Start', 'End'], Start: {type: 'hexnumber', minchars: 4, min: 0, max: 65535, value: '20'}, End: {type: 'hexnumber', minchars: 4, min: 0, max: 65535, value: '7f'}},

 {name: "Remove characters in range", regex: '[\\u<Start>-\\u<End>]', replacement: '', unicode: false, matchcase: true, parameters: ['Start', 'End'], Start: {type: 'hexnumber', minchars: 4, min: 0, max: 65535, value: '20'}, End: {type: 'hexnumber', minchars: 4, min: 0, max: 65535, value: '7f'}},
 
 {name: "Leave unicode characters in range", regex: '[^\\u{<Start>}-\\u{<End>}]', replacement: '', unicode: false, matchcase: true, parameters: ['Start', 'End'], Start: {type: 'hexnumber', minchars: 4, min: 0, value: '20'}, End: {type: 'hexnumber', minchars: 4, min: 0, value: '1A000'}},

 {name: "Remove unicode characters in range", regex: '[\\u{<Start>}-\\u{<End>}]', replacement: '', unicode: false, matchcase: true, parameters: ['Start', 'End'], Start: {type: 'hexnumber', minchars: 4, min: 0, value: '20'}, End: {type: 'hexnumber', minchars: 4, min: 0, value: '1A000'}},

 {name: "Add slashes: X -> \\X, \\ -> \\\\", regex: '\\\\|(<X>)', replacement: '\\$&', parameters: ['X'], X: {type: 'string', value: '"'}},

 {name: "Strip slashes: \\X -> X, \\\\ -> \\", regex: '\\\\(\\\\|<X>)', replacement: '$1', parameters: ['X'], X: {type: 'string', value: '"'}},
 
 {name: "Remove leading X", regex: '^(<X>)*', replacement: '', multiline: true, multilineParameter: 'work per line', parameters: ['X', 'multiline'], X: {type: 'string', value: ' '}},

 {name: "Remove trailing X", regex: '(<X>)*$', replacement: '', multiline: true, multilineParameter: 'work per line', parameters: ['X', 'multiline'], X: {type: 'string', value: ' '}}, 
 
 {name: "Convert C arrays to string literals", regex: false, func: 'CUtils._replaceCArrays', ensureLoaded: ['cutils.js'], parameters: []},
 
 {name: "Convert string / C literals to C array(s)", regex: false, func: 'CUtils.doConvertToCArray', ensureLoaded: ['cutils.js'], parameters: ['mode', 'utf8'], mode: {type: 'radio', display: 'Input mode', value: 1, options: ['Whole string', 'C source with literals']}, utf8: {type: 'bool', display: 'Convert input to UTF8 first', value: false}},
 
 {name: "Separate ASCII text blocks from binary in C string literals", regex: false, func: 'CUtils.doSeparateCLiterals', ensureLoaded: ['cutils.js'], parameters: ['minTextLength', 'allowTab', 'allowNL'], minTextLength: {display: 'Min lengh of a text block (not \\x escaped)', type: 'number', value: 1, min: 1}, allowTab: {type: 'bool', display: 'Don\'t escape tabs', value: false}, allowNL: {type: 'bool', display: 'Don\'t escape newlines (not C compatible)', value: false}},

 {name: "element -> XelementY", regex: '(^|<elsep>)([^<elsep>]*)', replacement: '$1<X>$2<Y>', parameters: ['X', 'Y'], X: {type: 'string', value: '"'}, Y: {type: 'string', value: '"'}},

 {name: "XelementY -> element", regex: '<X>([^<elsep>]*)<X>', replacement: '$1', parameters: ['X', 'Y'], X: {type: 'string', value: '"'}, Y: {type: 'string', value: '"'}},

 {name: "Interleave with additional textarea (take N elements each time)", regex: false, func: _interleaveElements, parameters: ['N', 'trim'], N: {type: 'number', min: 1, value: 1}, trim: {type: 'bool', display: 'Trim inputs to minimal length', value: false}},

 {name: "Interleave rows (take N elements each time)", regex: false, func: _interleaveMultiple, parameters: ['N', 'trim'], N: {type: 'number', min: 1, value: 1}, trim: {type: 'bool', display: 'Trim inputs to minimal length', value: false}},

 {name: "Delete elements, shorter than N characters", regex: '(^([^<elsep>]{0,<N-1>}(<elsep>|$))+)|(<elsep>[^<elsep>]{0,<N-1>}(?![^<elsep>]))+', replacement: '', parameters: ['N'], N: {type: 'number', min: 1, value: 3}},

 {name: "Delete elements, longer than N characters", regex: '(((^|<elsep>)[^<elsep>]{<N>,})+$)|([^<elsep>]{<N>,}<elsep>)+', replacement: '', parameters: ['N'], N: {type: 'number', min: 1, value: 3}},

 {name: "Take N elements, skipping first M", regex: '^(?:[^<elsep>]*(?:<elsep>|$)){<M>}((?:[^<elsep>]*<elsep>){0,<N-1>}[^<elsep>]*)[^]*', replacement: '$1', parameters: ['N', 'M'], N: {type: 'number', min: 1, value: 7}, M: {type: 'number', min: 0, value: 4}},

 {name: "Delete N elements after every M elements", regex: '((?:[^<elsep>]*<elsep>){<M-1>})(?:([^<elsep>]*)(?:<elsep>[^<elsep>]*){0,<N>}(<elsep>|$))', replacement: '$1$2$3', parameters: ['N', 'M'], N: {type: 'number', min: 1, value: 1}, M: {type: 'number', min: 1, value: 3}},

 {name: "Delete N elements before every M elements", regex: '(?:(?:(?:^[^<elsep>]*(?:<elsep>|$))|(?:<elsep>[^<elsep>]*)){0,<N>})((?:<elsep>?[^<elsep>]*){<M>})', replacement: '$1', parameters: ['N', 'M'], N: {type: 'number', min: 1, value: 1}, M: {type: 'number', min: 1, value: 3}},

 {name: "Inverse 2 elements in pairs", regex: '([^<elsep>]*)<elsep>([^<elsep>]*)(<elsep>|$)', replacement: '$2<elsep>$1$3'},

 {name: "Put element X after every N elements", regex: '(((^|<elsep>)[^<elsep>]*){<N>})', replacement: '$1<elsep><X>', parameters: ['X', 'N'], N: {type: 'number', min: 1, value: 3}, X: {type: 'string', value: 'X'}},

 {name: "Put element X before every N elements", regex: '(?!$)(([^<elsep>]*(<elsep>|$)){0,<N>})', replacement: '<X><elsep>$1', parameters: ['X', 'N'], N: {type: 'number', min: 1, value: 3}, X: {type: 'string', value: 'X'}},

 {name: "String.substr(N, M)", regex: '^[^]{0,<N>}([^]{0,<M>})[^]*$', replacement: '$1', multiline: false, multilineParameter: 'work per line', parameters: ['N', 'M', 'multiline'], N: {type: 'number', min: 0, value: 5}, M: {type: 'number', min:0, value: 11}},

 {name: "Leave at most N characters in a line", regex: '^(.{0,<N>}).*$', replacement: '$1', multiline: true, parameters: ['N'], N: {type: 'number', min: 1, value: 3}},

 {name: "Put X after every N characters", regex: '(<multiline@.%[^]>{<N>})(?!$)', replacement: '$1<X>', multiline: false, multilineParameter: 'work per line', parameters: ['X', 'N', 'multiline'], N: {type: 'number', min: 1, value: 1}, X: {type: 'string', value: ','}},

 {name: "Put X before every N characters", regex: '(<multiline@.%[^]>{1,<N>})', replacement: '<X>$1', multiline: false, multilineParameter: 'work per line', parameters: ['X', 'N', 'multiline'], N: {type: 'number', min: 1, value: 1}, X: {type: 'string', value: ','}},

 {name: "Delete N characters after every M characters", regex: '(<multiline@.%[^]>{<M>})<multiline@.%[^]>{0,<N>}', replacement: '$1',  multiline: false, multilineParameter: 'work per line', parameters: ['N', 'M', 'multiline'], N: {type: 'number', min: 1, value: 1}, M: {type: 'number', min: 1, value: 1}},

 {name: "Delete N characters before every M characters", regex: '<multiline@.%[^]>{0,<N>}(<multiline@.%[^]>{0,<M>})', replacement: '$1',  multiline: false, multilineParameter: 'work per line', parameters: ['N', 'M', 'multiline'], N: {type: 'number', min: 1, value: 1}, M: {type: 'number', min: 1, value: 1}},

 {name: "Divide into elements per N characters each", regex: false, func: _divideCharacters, parameters: ['N', 'unicode'], unicode: false, unicodeParameter: 'Support unicode', N: {type: 'number', min: 1, value: 1}},

 {name: "Divide into rows per N elements each", regex: false, func: _divideElements, parameters: ['N'], N: {type: 'number', min: 1, value: 1}},

 {name: "Put X at the begining of each line", regex: '(^|\\n)', replacement: '$1<X>', parameters: ['X'], X: {type: 'string', value: '>'}},

 {name: "Put X at the end of each line", regex: '($|\\n)', replacement: '<X>$1', parameters: ['X'], X: {type: 'string', value: '<'}},

 {name: "Delete N characters from the begining of each line", regex: '(^|\\n).{0,<N>}', replacement: '$1', parameters: ['N'], N: {type: 'number', min: 1, value: 3}},

 {name: "Delete N characters from the end of each line", regex: '.{0,<N>}($|\\n)', replacement: '$1', parameters: ['N'], N: {type: 'number', min: 1, value: 3}},

 {name: "Leave Y chars after X chars in each Z char sequence", regex: '([^]{0,<X>})([^]{0,<Y>})([^]{0,<Z-X-Y>})', parameters: [regexInteractiveExamplesParameters.takeXYZ], replacement: '$2', errorFunction: 'Z<X+Y?\'Z must be >= X+Y\':false'},

 {name: "Delete Y chars after X chars in each Z char sequence", regex: '([^]{0,<X>})([^]{0,<Y>})([^]{0,<Z-X-Y>})', parameters: [regexInteractiveExamplesParameters.takeXYZ], replacement: '$1$3', errorFunction: 'Z<X+Y?\'Z must be >= X+Y\':false'},

 {name: "Replace Y chars after X chars in each Z char sequence", regex: false, func: _takeXYZ, parameters: ['X', 'Y', 'Z', 'unicode', 'replEl', 'repl'], X: {type: 'number', value: 1, min: 0}, Y: {type: 'number', value: 2, min: 0}, Z: {type: 'number', value: 3, min: 0}, replEl: {type: 'bool', display: 'Replace with elements from additional textarea', value: false}, repl: {type: 'string', display: 'Replacement', visibility: '!replEl', value: ','}, unicode: false, unicodeParameter: 'Support unicode', args: {del: true}},

 {name: "Leave Y elements after X elements in each Z element sequence", regex: false, func: _takeElXYZ, parameters: [regexInteractiveExamplesParameters.takeElXYZ], args: {del: false}},

 {name: "Delete Y elements after X elements in each Z element sequence", regex: false, func: _takeElXYZ, parameters: [regexInteractiveExamplesParameters.takeElXYZ], args: {del: true}},

 {name: "Replace Y elements after X elements in each Z element sequence", regex: false, func: _takeElXYZ, parameters: [regexInteractiveExamplesParameters.takeElXYZ, 'replEl', 'repl'], replEl: {type: 'bool', display: 'Replace with elements from additional textarea', value: false}, repl: {type: 'string', display: 'Replacement', visibility: '!replEl', value: 'abc'}, args: {del: true}},

 {name: "Rail-fence shuffle (encode)", regex: false, func: _railFenceEncode, parameters: [regexInteractiveExamplesParameters.railFence, 'output'], output: {type: 'bool', display: 'Separate fence rows', value: false}, args: regexInteractiveExamplesParameters.railFenceArgs},

 {name: "Rail-fence deshuffle (decode)", regex: false, func: _railFenceDecode, parameters: [regexInteractiveExamplesParameters.railFence,  'flatten'], flatten: {type: 'bool', display: 'Assume fence rows are separated', value: false}, args: regexInteractiveExamplesParameters.railFenceArgs}
];

/*
HScript v0.0

special characters: <>@%
how to escape: double the character

echo a variable: <Var>
conditional echo: <bool@true%false>
loop: <expr@loop%exprwaslessthan1>

expr can be anything. (yes, actually any JS expression...)
*/
function evalHScriptExpression(expression, vars)
{
 var t, prop = [], pval = [], arg;
 for(t in vars)
 {
  if (!vars.hasOwnProperty(t)) continue;
  prop.push(t); pval.push(typeof vars[t] === 'object' && vars[t]?vars.args[t]:vars[t]);
 }
 eval('function fun('+prop.join(',')+'){return '+expression+'}');
 return fun.apply(this, pval);
}
function parseHScript(script, vars, sanitize) /* HScript rocks :D */
{
 var t, result = '', state = '', repeat = [], expr, ctrl;

 for(t=0;t<script.length;t++)
 {
  if (!state)
  {
   if (/[<>%]/.test(script[t]) && script[t+1]===script[t])
   result += script[t++];
   else if (script[t]==='<')
   {
    expr = t;
    while(!/[>@]/.test(script[t]) || script[t+1]===script[t]) t += /[>@]/.test(script[t])?2:1;
    expr = script.substring(expr+1, t).replace(/>>/g, '>').replace(/@@/g, '@');
    expr = evalHScriptExpression(expr, vars);

    if (script[t]==='>')
    result += sanitize?sanitize(expr):expr;
    else
    {
     if (typeof expr === 'string') expr = expr.length;
     if (typeof expr === 'number' && isNaN(expr)) expr = 0;
     if (typeof expr === 'number' && expr<0) expr = 0;

     repeat.push([result.length, expr?expr:1]);
     if (!expr) state = 'ignore';
    }
   }
   else if (script[t]==='%')
   {
    state = 'ignore';
   }
   else if (script[t]==='>')
   {
    state = 'pop';
   }
   else
   result += script[t];
  }
  else if (state==='ignore')
  {
   while(!/[>%]/.test(script[t]) || script[t+1]===script[t])
   {
    if (script[t]==='<' && script[t+1]==='<')
    t++;
    else if (script[t]==='<')
    {
     while((script[t]!=='>' || script[t+1]===script[t]))
     t += script[t]==='>'?2:1;
    }
    //we have to check if t+1===t because t may have been changed since while condition
    t += (/[>%]/.test(script[t]) && script[t+1]===script[t])?2:1;
   }
   if (script[t]==='>') state = 'pop'; else state = '';
  }
  else if (state === 'pop')
  {
   ctrl = repeat.pop();
   if (ctrl[1]>1)
   result += new Array(ctrl[1]).join(result.substr(ctrl[0]));
   state = '';
   t--;
  }
 }
 return result;
}
function validateExample(obj)
{
 var tmp;
 if (obj.errorFunction && (tmp = evalHScriptExpression(obj.errorFunction, obj)))
 throw tmp;
}
function compileExample(obj, elsep)
{
 var t, regex = obj.regex, replacement = obj.replacement;
 obj.elsep = elsep;
 validateExample(obj);
 regex = parseHScript(regex, obj, escapeRegExp);
 replacement = parseHScript(replacement, obj, function(x){return x.replace(/\$/g, '$$$$')});
 return {regex: regex, replacement: replacement, multiline: obj.args.multiline, unicode: obj.args.unicode, matchcase: obj.args.matchcase};
}
function regexStatusMatch(match, offset, steps)
{
 document.getElementById('regex-status-message').classList.remove('initial');
 
 document.getElementById('regex-status-matchinfo-position').textContent = offset;
 document.getElementById('regex-status-matchinfo-length').textContent = match[0].length;
 
 document.getElementById('regex-status-matchsteps-span').style.display = steps !== null ? '' : 'none';
 document.getElementById('regex-status-matchsteps').textContent = steps;
 
 //document.getElementById('regex-status-show-groups').style.display = match.length>1?'inline':'none';
 var groupsContainer = document.getElementById('regex-status-matched-groups-tbody');

 while(groupsContainer.firstChild)
 groupsContainer.removeChild(groupsContainer.firstChild);
 
 var nameHash = {}, tmp;
 if (match.namedPatterns)
 {
  tmp = Object.keys(match.namedPatterns);
  
  for(var t=0;t<tmp.length;t++)
  nameHash[match.namedPatterns[tmp[t]]] = tmp[t];
 }
 
 //match.matchOffsets = [1, 2, 4, 5, -1, -1];
 //nameHash = {1: 'hloh'};
  
 for(var t=0;t<match.length;t++)
 {
  var nrow = document.createElement('tr');
  var ncell = document.createElement('td');
  var html = '$'+(t?t:'&amp;');
  
  if (t && nameHash[t])
  html = '${'+nameHash[t]+'}<br>('+html+')';
  
  ncell.innerHTML = html+((t && (match[t] !== undefined))?'<br><br>':'');
  nrow.appendChild(ncell);
  ncell = document.createElement('td');
  
  if (match[t] !== undefined)
  {
   var ntextarea = document.createElement('textarea');
   ntextarea.readOnly = true;
   ntextarea.value = match[t];
   ncell.appendChild(ntextarea);
   
   if (t)
   {
    var minfo = document.createElement('div');
    if (match.matchOffsets)
    {
     minfo.innerHTML = '<button onclick="setSelRange('+(offset+match.matchOffsets[2*t])+', '+(offset+match.matchOffsets[2*t+1])+');">Select group</button><span class="tube-separator"></span>Relative offset: <span class="result">'+match.matchOffsets[2*t]+'</span>, length: <span class="result">'+(match.matchOffsets[2*t+1]-match.matchOffsets[2*t])+'</span>,  end: <span class="result">'+match.matchOffsets[2*t+1]+'</span>';
    }
    else
    {
     minfo.innerHTML = 'Length: <span class="result">'+match[t].length+'</span>';
    }
    ncell.appendChild(minfo);
   }
  }
  else
  {
   ncell.innerHTML = '<span class="desc">not used</span>';
  }
  nrow.appendChild(ncell);
  groupsContainer.appendChild(nrow);
 }

 document.getElementById('regex-status-message').style.display = 'none';
 document.getElementById('regex-status-matchinfo').style.display = 'block';  
}
function regexStatusMsg(msg)
{
 document.getElementById('regex-status-message').classList.remove('initial');
 document.getElementById('regex-status-message').innerHTML = msg;
 document.getElementById('regex-status-message').style.display = '';
 document.getElementById('regex-status-matchinfo').style.display = 'none';
}
function regexToggleMatchGroups(button)
{
 var el = document.getElementById('regex-status-matched-groups');
 if (el.dataset.shown === 'false')
 {
  el.style.display = 'table';
  el.dataset.shown = 'true';
  button.textContent = button.textContent.replace(/(Show)|(Hide)/, 'Hide');
 }
 else
 {
  el.style.display = 'none';
  el.dataset.shown = 'false';
  button.textContent = button.textContent.replace(/(Show)|(Hide)/, 'Show');
 }
}
function loadRegexExample(cb)
{
 var which = document.getElementById('regex-example-list').selectedIndex;
 _loadRegexExample(regexExamples[which], cb);
}
function loadIRegexExample(replace)
{
 if (!loadRegexExampleUI()) return;
 var which = document.getElementById('regex-interactive-example-list').selectedIndex-1;
 try {
  _loadRegexExample(compileExample(regexInteractiveExamples[which], getInputString('element-separator')),
  replace ? function(){transformTextByFunction(replaceAllRegex)} : null);
 } catch(e) {
  alert('Error: '+e);
 }
}
function _loadRegexExample(example, cb)
{
 document.getElementById('regex-search-rtext').value = example.regex.replace(/\n/g, '\\n');
 setInputString('regex-search-rreplace', example.replacement);

 if (example.multiline !== undefined)
 document.getElementById('regex-search-multiline').checked = example.multiline;
 if (example.unicode !== undefined)
 document.getElementById('regex-search-municode').checked = example.unicode;
 if (example.matchcase !== undefined)
 document.getElementById('regex-search-mcase').checked = example.matchcase;
 
 //explictly set, because it's not compatible
 document.getElementById('regex-search-mextended').checked = !!example.extended;


 regexBackendChange(example.backend || 1, cb);
}
function maybeLoadRegexExampleUI()
{
 var which = document.getElementById('regex-interactive-example-list').selectedIndex;
 
 if (which && regexInteractiveExamples[which-1].ensureLoaded && regexInteractiveExamples[which-1].ensureLoaded.length)
 tcEnsureLoaded(regexInteractiveExamples[which-1].ensureLoaded, loadRegexExampleUI);
 else
 loadRegexExampleUI();
}
function loadRegexExampleUI()
{
 var which = document.getElementById('regex-interactive-example-list').selectedIndex, cont = document.getElementById('regex-interactive-ui'), buttons = document.getElementById('regex-interactive-buttons'), buttonsMisc = document.getElementById('misctransform-interactive-buttons'), title = document.getElementById('regex-interactive-title');
 if (!which)
 {
  buttons.style.display = 'none';
  buttonsMisc.style.display = 'none';
  cont.style.display = 'none';
  title.style.display = 'none';
  return false;
 }

 if (lastTransformFunction===miscTransform)
 clearLastTransform();

 var example = regexInteractiveExamples[which-1], param;
 var t, csep = getInputString('element-separator'), regexUnicode = document.getElementById('regex-search-municode').checked;
 
 if (example.regex && ((!regexUnicode && csep.length>1 || regexUnicode && unicodeLength(csep)>1) || document.getElementById('csv-quote').value) && (/(^|[^<])<elsep>($|[^>])/.test(example.regex) || /(^|[^<])<elsep>($|[^>])/.test(example.replacement)))
 {
  cont.innerHTML = 'Element separators longer than 1 char, CSV quotes are not supported in these regex examples. Convert them first and then <button onclick="loadRegexExampleUI();">Retry</button>';
  title.style.display = 'none';
  buttons.style.display = 'none';
  return false;
 }
 
 if (typeof example.func === 'string')
 example.func = tcResolve(example.func);

 while(cont.lastChild)
 cont.removeChild(cont.lastChild);

 miscTransform.entry = example;

 document.getElementById('regex-interactive-title').textContent = example.name;
 
 var lastDisplayData = null;
 
 for(t=0;example.parameters && t<example.parameters.length;t++)
 {
  if (example.parametersDisplayData[t] && lastDisplayData !== example.parametersDisplayData[t])
  {
   var nb = document.createElement('div');
   nb.className = 'regex-interactive-parameter-group';
   nb.textContent = example.parametersDisplayData[t]+':';
   cont.appendChild(nb);
  }
  
  lastDisplayData = example.parametersDisplayData[t];
  
  param = example.parameters[t];
  if (example[param].visibility) //definitely just a PoC, you can use evalhscriptexpression
  {
   var vval = true, vparam = example[param].visibility;
   if (vparam[0] === '!')
   {
    vval = false;
    vparam = vparam.slice(1);
   }
   
   if (example.args[vparam]!==vval)
   continue;
  }

  createIRegexUIComponent(cont, example, example.parameters[t]);
  cont.appendChild(document.createElement('br'));
 }

 buttonsMisc.style.display = example.regex?'none':'block';
 buttons.style.display = example.regex?'block':'none';
 title.style.display = 'block';
 cont.style.display = 'block';

 return true;
}

function createCheckbox(text, checked)
{
 var label = document.createElement('label'), checkbox = document.createElement('input');
 checkbox.type = 'checkbox';
 checkbox.checked = checked;
 checkbox.onchange = onchange;
 label.appendChild(checkbox);
 label.appendChild(document.createTextNode(text));
 return checkbox;
}

function createDetailsSummary(summaryText, open)
{
 var details = document.createElement('details');
 details.open = !!open;
 
 if (summaryText)
 {
  var summary = document.createElement('summary');
  summary.textContent = summaryText;
  details.appendChild(summary);
 }
 
 return details;
}

function createIRegexUIComponent(cont, example, param)
{
 if (example[param].type !== 'bool')
 cont.appendChild(document.createTextNode((example[param].display || param)+': '));

 if (example[param].type === 'bool')
 {
  var checkbox = createCheckbox(example[param].display || param, example.args[param]);
  checkbox.onchange = function()
  {
   example.args[param] = checkbox.checked;

   //we reload because visibility of some other param may depend on us...
   loadRegexExampleUI(); //hey, I hope this doesn't leak :O
  };
  
  cont.appendChild(checkbox.parentNode);
 }
 else if (example[param].type==='string')
 {
  var input, checkbox = createCheckbox('JS literal ', example[param].json);
  input = document.createElement('input');
  input.type = 'text';
  input.value = example[param].json?jsonstrencode(example.args[param], true):example.args[param];
  input.onchange = function()
  {
   example.args[param] = example[param].json?jsonstrdecode(input.value):input.value;
  };
  checkbox.onchange = function()
  {
   example[param].json = checkbox.checked;
   input.value = example[param].json?jsonstrencode(example.args[param], true):example.args[param];
   input.onchange();
  };
  cont.appendChild(checkbox.parentNode);
  cont.appendChild(input);
 }
 else if (example[param].type==='number')
 {
  var input = document.createElement('input');
  input.type = 'number';

  if (example[param].min !== undefined) input.min = example[param].min;
  if (example[param].max !== undefined) input.max = example[param].max;
  
  var updateInput = function()
  {
   input.value = example.args[param];
  };
  updateInput();
  input.onchange = function()
  {
   var val = parseInt(input.value);
   if (!isNaN(val) && (!example[param].min || val>=example[param].min) && (!example[param].max || val<=example[param].max))
   {
    example.args[param] = val;
   }
   updateInput();
  }
  cont.appendChild(input);
 }
 else if (example[param].type==='hexnumber')
 {
  if (example[param].displayHex === undefined) example[param].displayHex = true;

  var input, checkbox = createCheckbox('hex ', example[param].displayHex);
  input = document.createElement('input');
  var updateInput = function()
  {
   input.type = example[param].displayHex?'text':'number';
   input.min = (!example[param].displayHex && example[param].min)?example[param].min:'';
   input.max = (!example[param].displayHex && example[param].max)?example[param].max:'';
   input.value = example[param].displayHex?example.args[param]:parseInt(example.args[param], 16);
  };
  updateInput();
  checkbox.onchange = function()
  {
   example[param].displayHex = checkbox.checked;
   updateInput();
  };
  input.onchange = function()
  {
   var val = parseInt(input.value, example[param].displayHex?16:10);
   if (!isNaN(val) && (example[param].min === undefined || val>=example[param].min) && (example[param].max === undefined || val<=example[param].max))
   {
    example.args[param] = val.toString(16);
   }
   updateInput();
  }
  cont.appendChild(checkbox.parentNode);
  cont.appendChild(input);
 }
 else if (example[param].type==='radio')
 {
  //name misctools-radio-[name]
  var onRadioChange = function(which)
  {
   example.args[param] = which;
  };
  for(var t=0;t<example[param].options.length;t++)
  {
   label = document.createElement('label');
   input = document.createElement('input');
   input.type = 'radio';
   input.name = 'misctools-radio-'+param;
   input.value = t;
   input.checked = example.args[param] === t;
   input.onchange = onRadioChange.bind(input, t);
   label.appendChild(input);
   label.appendChild(document.createTextNode(example[param].options[t]));
   cont.appendChild(label);
  }
 }
}
function initRegexExamples()
{
 var sel = document.getElementById('regex-example-list');
 sel.remove(0);
 
 var matchGroup = document.createElement('optgroup');
 var replaceGroup = document.createElement('optgroup');
 
 matchGroup.label = 'Match/extract based';
 replaceGroup.label = 'Replace based';
 
 for(var t=0;t<regexExamples.length;t++)
 {
  var option = document.createElement('option');
  option.textContent = regexExamples[t].name;
  (regexExamples[t].matchBased ? matchGroup : replaceGroup).appendChild(option);
 }
 
 sel.appendChild(matchGroup);
 sel.appendChild(replaceGroup);
}
function initIRegexExamples()
{
 var sel = document.getElementById('regex-interactive-example-list');
 sel[0].textContent = '-- select example below --';
 for(var t=0;t<regexInteractiveExamples.length;t++)
 {
  var example = regexInteractiveExamples[t];
  
  var option = document.createElement('option');
  option.textContent = (example.regex?'[regex]':'[native]')+' '+example.name;
  sel.add(option);
  
  var params = example.parameters;
  example.args = example.args || {};
  example.parametersDisplayData = [];
  
  for(var p=0;params && p<params.length;p++)
  {
   if (typeof params[p] === 'object') //ability to reuse parameters
   {
    var xparams = params[p], xpl = xparams.parameters.length;
    params.splice(p, 1);

    for(var xp=0;xp<xpl;xp++)
    {
     example.parametersDisplayData[p] = xparams.display;
     
     params.splice(p++, 0, xparams.parameters[xp]);
     example[xparams.parameters[xp]] = xparams[xparams.parameters[xp]];
    }
    
    p -= xpl;
   }
   
   if (typeof example[params[p]] !== 'object')
   example[params[p]] = {display: example[params[p]+'Parameter'], type: 'bool', value: example[params[p]]};
   
   //while parameter objects are shared, .args is not unless manually assigned
   example.args[params[p]] = example[params[p]].value;
  }
 }
 sel.addEventListener('change', maybeLoadRegexExampleUI);
 
 do
 {
  sel.selectedIndex = Math.random()*sel.length|0;
 } while(regexInteractiveExamples[sel.selectedIndex].ensureLoaded);
 
 loadRegexExampleUI();
}


function takeXYZ(str, x, y, z, del, repl, unicode)
{
 z = z-x-y;
 if (z<0)
 throw 'Z must be >= X+Y!';

 var c = 0, t, ret = '', length = unicode?unicodeLength(str):str.length;
 while(c<length)
 {
  if (del) ret += unicode?unicodeSubstring(str, c, c+x):str.substr(c, x);

  c += x;

  if (Array.isArray(repl))
  ret += repl.shift() || '';
  else if (repl !== undefined)
  ret += repl;

  if (!del) ret += unicode?unicodeSubstring(str, c, c+y):str.substr(c, y);
  c += y;

  if (del) ret += unicode?unicodeSubstring(str, c, c+z):str.substr(c, z);
  c += z;
 }
 return ret;
}
function _takeXYZ(args, str)
{
 return takeXYZ(str, args.X, args.Y, args.Z, args.del, args.replEl?getElements(getAdditionalVal()):args.repl, args.unicode);
}

function takeElXYZ(str, x, y, z, del, repl)
{
 //x>=0 y>=0 z>=x+y
 
 z = z-x-y;
 if (z<0)
 throw 'Z must be >= X+Y!';

 var c = 0, t, el = getElements(str), ret = [];
 while(c<el.length)
 {
  for(t=0;t<x && c<el.length;c++,t++)
  if (del) ret.push(el[c]); 

  if (Array.isArray(repl))
  ret.push(repl.shift() || '');
  else if (repl !== undefined)
  ret.push(repl);

  for(t=0;t<y && c<el.length;c++,t++)
  if (!del) ret.push(el[c]); 

  for(t=0;t<z && c<el.length;c++,t++)
  if (del) ret.push(el[c]); 
 }
 return makeElements(ret);
}

function _takeElXYZ(args, str)
{
 return takeElXYZ(str, args.X, args.Y, args.Z, args.del, args.replEl?getElements(getAdditionalVal()):args.repl);
}

function leavedeleteXYZ(del, str)
{
 var x = parseInt(document.getElementById('take-xyz-x').value) || 0;
 var z = Math.max(parseInt(document.getElementById('take-xyz-z').value), 2) || 2;
 x %= z;
 
 return takeXYZ(str, x, 1, z, del);
}

function _interleaveElements(args, str)
{
 var el = getElements(str), el2 = getElements(getAdditionalVal());
 if (args.trim) el.length = el2.length = Math.min(el.length, el2.length);
 console.log(el, el2);
 return makeElements(interleaveMultiple([el, el2], args.N));
}

function _interleaveMultiple(args, str)
{
 var arr = getCSV(str), t, ml = Infinity;
 if (args.trim)
 {
  for(t=0;t<arr.length;t++)
  ml = Math.min(ml, arr[t].length/args.N|0);

  for(t=0;t<arr.length;t++)
  arr[t].length = ml*args.N;
 }
 return makeElements(interleaveMultiple(arr, args.N));
}

function miscTransform(str)
{
 if (!miscTransform.entry) return;
 return transformTextByFunction(miscTransform.entry.func.bind(this, miscTransform.entry.args), str);
}

function replaceAlphabet(a, b, str)
{
 var t, ret = '', replaced = false, cursor = 0;

 while(cursor<str.length)
 {
  replaced = false;

  for(t=0;t<a.length;t++)
  {
   if (str.substr(cursor, a[t].length)===a[t])
   {
    replaced = true;
    ret += b[t];
    cursor += a[t].length;
    break;
   }
  }

  if (!replaced)
  ret += str[cursor++];
 }

 return ret;
}

function _replaceAlphabet(str)
{
 var src = getInputString('replace-alphabet-src');
 if (document.getElementById('replace-alphabet-src-array').checked)
 {
  try {
   src = jsonarrdecode(src);
  } catch (e) {}
 }
 var dst = getInputString('replace-alphabet-dst');
 if (document.getElementById('replace-alphabet-dst-array').checked)
 {
  try {
   dst = jsonarrdecode(dst);
  } catch (e) {}
 }

 return replaceAlphabet(src, dst, str);
}



function interleaveMultiple(arr, take)
{
 if (take===undefined) take = 1;

 var t, ret = [], ttt, was = true, off=0, asStr = arr && typeof arr[0] === 'string';

 for(off=0;was;off+=take)
 for(t=0,was=false;t<arr.length;t++)
 {
  if (off<arr[t].length)
  {
   for(ttt=0;ttt<take && off+ttt<arr[t].length;ttt++)
   ret.push(arr[t][off+ttt]);
   was=true;
  }
 }

 return asStr?ret.join(''):ret;
}

function divideCharacters(str, n, unicode)
{
 var ptr = 0, tmp, ret = [];
 while((tmp=unicode?unicodeSubstring(str, ptr, ptr+n):str.substring(ptr, ptr+n)))
 {
  ret.push(tmp);
  ptr += n;
 }
 return ret;
}
function _divideCharacters(args, str)
{
 return makeElements(divideCharacters(str, args.N, args.unicode));
}
function divideElements(arr, n)
{
 var ptr = 0, tmp, ret = [];

 for(var t=0;t<arr.length;t+=n)
 ret.push(arr.slice(t, t+n));

 return ret;
}
function _divideElements(args, str)
{
 return makeCSV(divideElements(getElements(str), args.N));
}
function transpose2D(arr, strict)
{
 var t, tt, was = true, ret = [], curr;
 for(t=0;was;t++)
 {
  was = false;
  curr=[];
  for(tt=0;tt<arr.length;tt++)
  {
   if (arr[tt][t]===undefined && strict) 
   {
    break;
   }
   curr.push(arr[tt][t]!==undefined?arr[tt][t]:'');
   if (arr[tt][t]!==undefined) was = true;
  }
  if (was) ret.push(curr);
 }
 return ret;
}
function transposeCSV(str)
{
 return makeCSV(transpose2D(getCSV(str)));
}


(function(){ //HexDump

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

window.HexDump = {extractHex: extractHex, extractText: extractText};

})();




function railFence(sth, mod, straight, bottomUp, returnSeparated)
{
 var t, ret = [], length = sth.length;
 var cursor = bottomUp ? mod-1 : 0, cursorDirection = bottomUp ? -1 : 1;

 for(t=0;t<mod && t<length;t++)
 ret.push([]);

 for(t=0;t<length;t++)
 {
  ret[cursor].push(sth[t]);

  cursor += cursorDirection;

  if (!straight && (!cursor || cursor === mod-1))
  cursorDirection *= -1;
  
  if (straight && cursor === (bottomUp ? -1 : mod))
  cursor = bottomUp ? mod-1 : 0;
 }

 if (typeof sth === 'string')
 for(t=0;t<ret.length;t++)
 ret[t] = ret[t].join('');

 if (!returnSeparated)
 ret = ret.reduce(__flatten);

 return ret;
}

function derailFence(sth, mod, straight, bottomUp)
{
 var t, pattern = [], length = sth.length;

 for(t=0;t<length;t++)
 pattern[t] = t;

 pattern = railFence(pattern, mod, straight, bottomUp);
 var ret = [];

 for(t=0;t<length;t++)
 ret[pattern[t]] = sth[t];

 if (typeof sth === 'string')
 ret = ret.join('');

 return ret;
}

function _railFenceEncode(args, str)
{
 var rf = railFence(args.forElements?getElements(str):str, args.height, args.mode === 0 || args.mode === 3, args.mode > 1, args.output);

 if (args.forElements && args.output)
 return makeCSV(rf);
 else if (args.forElements || args.output)
 return makeElements(rf);

 return rf;
}
function _railFenceDecode(args, sth)
{
 var lvl = (args.flatten?1:0) + (args.forElements?1:0);

 if (lvl===2) sth = getCSV(sth);
 else if (lvl===1) sth = getElements(sth);

 if (args.flatten && args.forElements)
 sth = sth.reduce(__flatten);
 else if (args.flatten)
 sth = sth.join('');

 var rf = derailFence(sth, args.height, args.mode === 0 || args.mode === 3, args.mode > 1);

 return args.forElements?makeElements(rf):rf;
}



function __flatten(a,b) {return a.concat(b);}

//this modifies original. copy with json parse/stringify
function flattenRecursive(arr)
{
 if (!Array.isArray(arr)) return arr;
  
 var tmp, t, tt, ret = [];
 for(t=0;t<arr.length;t++)
 {
  if (Array.isArray(arr[t]))
  {
   tmp = flattenRecursive(arr[t]);
   for(var tt=0;tt<tmp.length;tt++)
   ret.push(tmp[tt]);
  }
  else ret.push(arr[t]);
 }
 return ret;
}
function flattenJSON(str)
{
 var arr = jsonarrdecode(str);
 return JSON.stringify(flattenRecursive(arr));
}

var braceStr = '()[]{}';
function braceStart(str, start)
{
 //stop at -1
 var t, tmp, braces = [];
 for(t=0;t<braceStr.length/2;t++)
 braces[t] = 0;
 
 for(t=start-1;t>=0;t--)
 {
  if ((tmp = braceStr.indexOf(str[t])) > -1)
  {
   braces[tmp/2|0] += tmp%2?1:-1;

   if (braces[tmp/2|0] < 0)
   return t+1;
  }
 }
 
 return 0;
}
function braceEnd(str, start)
{
 //stop at -1
 var t, tmp, braces = [];
 for(t=0;t<braceStr.length/2;t++)
 braces[t] = 0;
 
 for(t=start;t<str.length;t++)
 {
  if ((tmp = braceStr.indexOf(str[t])) > -1)
  {
   braces[tmp/2|0] += tmp%2?-1:1;

   if (braces[tmp/2|0] < 0)
   return t;
  }
 }
 
 return t;
}

function selBraceStart()
{
 setSelection(0, braceStart(getValue(), getSelectionStart()));
 setFocus();
 tcDispatch('cursorUpdate');
}

function selBraceEnd()
{
 setSelection(1, braceEnd(getValue(), getSelectionEnd()));
 setFocus();
 tcDispatch('cursorUpdate');
}


//code for regex "prettification" is not really pretty itself :>
function extendRegex(str)
{
 var len = str.length;
 var currentIndent = '';
 var lvl = '   ', lvl2 = '  ', t = 0, ret = '', groupNo = 1, tmp, str2;
 var lastBreak = false, topStack, matched, wantQuantifiers, capturingGroup;
 
 var wholePatterns = [/^P=\w*(\)|$)/, /^#(\\[^]|[^)])*(\)|$)/, /^((&\w*)|-?\d*)(\)|$)/, /^(R|C\d+)(\)|$)/, /^[a-z-]*(\)|$)/];
 var prefixPatterns = [/^\((R?-?\d+|'\w+'|<\w+>)(\)|$)/, /^(\<=|<!|:|>|=|!|@)/, /^(P)?('\w+'|<[\w-]+>)/, /^[a-z-]*:/];
 
 var branchResetStack = [];

 function readPostfix() //like ++{}
 {
  //*?+
  while(t<len)
  {
   str2 = str.substr(t);
   
   if (tmp = str2.match(/^(\*|\?|\+)+/))
   ret += tmp[0], t += tmp[0].length;
   else if (tmp = str2.match(/^\{\d+,?(\d+)?(}|$)/))
   ret += tmp[0], t += tmp[0].length;
   else if (tmp = str2.match(/^\{,\d+(}|$)/))
   ret += tmp[0], t += tmp[0].length;
   else break;
  }
  
  lastBreak = true;
 }

 while(t<len)
 {
  if (str[t] === '(')
  {
   if (ret.length)
   ret += '\n'+currentIndent;
   
   ret += '(';

   wantQuantifiers = capturingGroup = true;
   t++;
   
   if (str[t] === '+') ret += str[t++];
   
   if (tmp = str.substr(t).match(/^\*[a-z]*:/))
   {
    ret += tmp[0]; t += tmp[0].length;
   }
   
   if (str[t] === '*') //(*VERB)
   {
    tmp = str.substr(t).match(/^\*[^)]*(\)|$)/);
    ret += tmp[0];
    t += tmp[0].length;
    
    wantQuantifiers = true;
    capturingGroup = false;
   }
   else if (str[t] === '?')
   {
    ret += '?'; t++;
    str2 = str.substr(t);
    
    capturingGroup = false;
    matched = false;
        
    for(var x=0;x<wholePatterns.length;x++)
    {
     if (tmp = str2.match(wholePatterns[x]))
     {
      matched = true;
      ret += tmp[0]; t += tmp[0].length;
      break;
     }
    }
    
    if (!matched)
    {
     if (/^['<@]/.test(str2) && !/^<[!=]/.test(str2)) //they are capturing groups
     capturingGroup = true;
    
     currentIndent += lvl;
     for(var x=0;x<prefixPatterns.length;x++)
     {
      if (tmp = str2.match(prefixPatterns[x]))
      {
       matched = true;
       ret += tmp[0]; t += tmp[0].length;
       break;
      }
     }
     
     if (!matched && str[t] === '|') //branch reset
     {
      ret += '|'; t++;
      branchResetStack.push([groupNo, groupNo]);
     }
     else branchResetStack.push(null);
    }
    else wantQuantifiers = true;
   }
   else //capturing group
   {
    //before we proceed... branch reset will fail for (?:) amiright?
    //coz we don't push to the stack in that case
    capturingGroup = true;
    currentIndent += lvl;
    branchResetStack.push(null);
   }
   
   if (capturingGroup)
   {
    ret += ' # group '+(groupNo++);
   }
   
   if (wantQuantifiers)
   readPostfix();

   lastBreak = true;
  }
  else if (str[t] === ')')
  {
   currentIndent = currentIndent.slice(0, -lvl.length);
   ret += '\n'+currentIndent;
   ret += ')';
   t++;
  
   readPostfix();
   
   topStack = branchResetStack.pop();
   if (topStack)
   groupNo = topStack[1];
  }
  else if (str[t] === '|')
  {
   if (currentIndent.length < lvl2.length)
   {
    var lines = ret.split('\n');
    for(var x=0;x<lines.length;x++)
    lines[x] = lvl2+lines[x];
    
    ret = lines.join('\n');
    
    currentIndent += lvl2;
   } 
   ret += '\n'+currentIndent.slice(0, -lvl2.length)+'|';
   lastBreak = true;
   t++;
   
   if (branchResetStack.length && (topStack = branchResetStack[branchResetStack.length-1]))
   {
    topStack[1] = Math.max(topStack[1], groupNo);
    groupNo = topStack[0]; //the actual reset
   }
  }
  else 
  {
   matched = false;
   
   if (str[t] === '\\')
   {
    str2 = str.substr(t);
    if ((tmp = str2.match(/^\\g('[\d\w+-]+'|<[\d\w+-]+>)/)) || (tmp = str2.match(/^\\K/)))
    {
     matched = true;
     
     if (ret.length)
     ret += '\n'+currentIndent;

     ret += tmp[0], t += tmp[0].length;
     readPostfix();
    }
   }
   
   if (!matched)
   {
    if (lastBreak)
    {
     lastBreak = false; 
     ret += '\n'+currentIndent;
    }
   
    if (/^\s|#$/.test(str[t])) //escape spaces and #
    ret += '['+str[t]+']', t++;
    else if (str[t] === '\\')
    {
     str2 = str.substr(t);
     if ((tmp = str2.match(/^\\g('[\d\w+-]+'|<[\d\w+-]+>)/)) || (tmp = str2.match(/^\\K/)))
     {
      if (ret.length)
      ret += '\n'+currentIndent;

      ret += tmp[0], t += tmp[0].length;
      readPostfix();
     }
     else
     {
      ret += str[t]+str[t+1];
      t+=2;
     }
    }
    else if (str[t] === '[') //we don't support nested coz most engines don't, this could break stuff
    {
     ret += '[';
     t++;
  
     if (str[t] === ']')
     ret += str[t++];

     while(t<len && str[t] !== ']')
     {
      ret += str[t];

      if (str[t] === '\\') {t++; ret += str[t] || '';}
      t++;
     }
    }
    else ret += str[t++];
   }
  }
 }

 return ret; 
}

function minifyRegex(str)
{
 var ret = '', t = 0, tmp;
 while(t<str.length)
 {
  if (str.substr(t, 3) === '[#]')
  {
   ret += '#'; t += 3;
  }
  else if (tmp=str.substr(t).match(/^\[(])?(\\[^]|[^\]\\])*]/))
  {
   ret += tmp[0]; t += tmp[0].length;
  }
  else if (str[t] === '\\')
  {
   ret += str[t]+(str[t+1]||''); t += 2;
  }
  else if (/^\s$/.test(str[t])) t++;
  else if (str[t] === '#')
  {
   tmp = str.substr(t).match(/^.*/);
   t += tmp[0].length+1;
  }
  else
  {
   ret += str[t]; t++;
  } 
 }
 return ret;
}

function reformatRegex(str)
{
 return extendRegex(minifyRegex(str));
}

function execXPath(str)
{
 var type = document.getElementById('xpath-xml').checked ? 'xml' : 'html';
 var expr = getInputString('xpath-path');
 var doc = new DOMParser().parseFromString(str, 'text/'+type);
 
 var nsResolver = doc.createNSResolver(doc.ownerDocument == null ? doc.documentElement : doc.ownerDocument.documentElement);
 var xpathResult;
 var done = false;
 var ret = '';
 
 try
 {
  xpathResult = doc.evaluate(expr, doc, nsResolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  
  done = true;
  
  var thisNode = xpathResult.iterateNext();
  
  while (thisNode)
  {
   ret += thisNode.outerHTML+'\n';
   thisNode = xpathResult.iterateNext();
  }	
 } catch(e) {}
 
 if (!done)
 {
  xpathResult = doc.evaluate(expr, doc, nsResolver, XPathResult.ANY_TYPE, null);
  
  if (xpathResult.resultType === XPathResult.NUMBER_TYPE)
  ret = xpathResult.numberValue+'';
  else if (xpathResult.resultType === XPathResult.STRING_TYPE)
  ret = xpathResult.stringValue;
  else if (xpathResult.resultType === XPathResult.BOOLEAN_TYPE)
  ret = xpathResult.booleanValue+'';
 } 

 return ret;
}

function execCSS(str)
{
 var doc = new DOMParser().parseFromString(str, 'text/html');
 var nodes = doc.querySelectorAll(getInputString('css-path'));
 var ret = '';
 
 for(var t=0;t<nodes.length;t++)
 {
  ret += nodes[t].outerHTML;
 }
 
 return ret;
}

function beautifyJSON(str)
{
 var indent = getInputString('beautify-indent');
 return JSON.stringify(JSON.parse(str), null, indent);
}

//for future reference: init code
initIRegexExamples();
initRegexExamples();
setEnableCSVQuote(document.getElementById('csv-quote-enabled').checked, true);
