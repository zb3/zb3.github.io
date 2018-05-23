/*
core functionality here.
-textarea, buffer, undo/redo, ttbf, events, modules
core functionality may not depend on non-core functionality
*/

var tcLoadedScripts = [], tcLoaded = false, tcLoading = 1;
var buttonsDiv, lastTransformFunction = null, lastTransformButton = null;
var binaryCache, isBinary, bcl, binarySelStart, binarySelEnd;
var logOn = true, diff = [], rdiff = [], logLimit = 0, undobutton, redobutton;
var autoIndent = false;

var tcEventListeners = {}, tcListen = function(to, what)
{
 tcEventListeners[to] = tcEventListeners[to] || [];
 tcEventListeners[to].push(what);
};
var tcDispatch = function(to)
{
 for(var t=0;tcEventListeners[to] && t<tcEventListeners[to].length;t++)
 {
  tcEventListeners[to][t].apply(this, arguments);
 }
};


function getValue(){return binaryCache;}
function setValue(v, skipLog, skipSelection)
{
 var vl = v.length;
 if (logOn && !skipLog)
 {
  var lcp = commonPrefix(v, binaryCache), lcs = commonSuffix(v, binaryCache, lcp);
  if (vl-lcp-lcs || bcl-lcs-lcp)
  {
   diff.push(lcp, binaryCache.slice(lcp, bcl-lcs), vl-lcp-lcs, getSelectionStart(), getSelectionEnd());
   rdiff.length=0;
   undobutton.disabled = false;
   redobutton.disabled = true;
  }
  cutLogToLimit();
 }

 binaryCache = v; bcl = vl;
 isBinary = v.indexOf('\r')!==-1;
 textarea.value = v;

 if (binarySelEnd > v.length)
 binarySelEnd = v.length;

 if (binarySelStart > binarySelEnd)
 binarySelStart = binarySelEnd;

 if (!skipSelection)
 {
  setSelection(0, binarySelStart);
  setSelection(1, binarySelEnd);
 }
}
function setSelection(type, what)
{ 
 var v = getValue();

 if (type)
 binarySelEnd = Math.max(0, Math.min(v.length, what));
 else
 binarySelStart = Math.max(0, Math.min(v.length, what));

 var tmp, lastIndex = 0, add = 0;
 while((tmp=v.indexOf('\r\n', lastIndex))!==-1 && tmp<what)
 {
  add++; lastIndex = tmp+2;
 }
 textarea[type?'selectionEnd':'selectionStart'] = what-add;
}

//note this does NOT restore focus
function ensureSelectionVisible() //stupid chrome
{
 var scroll;
 textarea.value = binaryCache.slice(0, binarySelEnd);
 scroll = textarea.scrollHeight;
 textarea.value = binaryCache;
 textarea.scrollTop = scroll - textarea.clientHeight/2;
 
 setSelection(0, binarySelStart);
 setSelection(1, binarySelEnd);
}

function readSelectionToCache() //on USER input, otherwise only read
{
 //user has moved the cursor
 if (!isBinary)
 {
  binarySelStart = textarea.selectionStart;
  binarySelEnd = textarea.selectionEnd;
 }
 else
 {
  var v = getValue(), sel = textarea.selectionStart, seld = textarea.selectionEnd-sel, lastIndex = 0;
  while((tmp=v.indexOf('\r\n', lastIndex))!==-1 && tmp<sel)
  {
   sel++; lastIndex = tmp+2;
  }
  binarySelStart = sel;
  sel += seld;
  while((tmp=v.indexOf('\r\n', lastIndex))!==-1 && tmp<sel)
  {
   sel++; lastIndex = tmp+2;
  }
  binarySelEnd = sel;
 }
}
function getSelectionStart()
{
 return binarySelStart;
}
function getSelectionEnd()
{
 return binarySelEnd;
}
function getSelectedValue()
{
 var selStart = getSelectionStart(), selEnd = getSelectionEnd();
 var v = getValue();

 return selStart===selEnd?v:v.substring(selStart, selEnd);
}
function catchup()
{
 buttonsDiv.style.height = textarea.clientHeight+'px';
}

//we want to be notified when selection changes, unfortunately it's not so easy
function catchsel()
{
 setTimeout(userCursorChange, 0);
}
function catchselStart() { catchsel.ok=true; catchsel(); }
function catchselMove()
{
 if (catchsel.ok)
 catchsel();
}
function catchselEnd() { catchselMove(); catchsel.ok=false; }

function setFocus(restoreScroll)
{
 var previousScrollY = scrollY;
 textarea.focus();

 if (restoreScroll)
 {
  scrollTo(scrollX, previousScrollY);
  setTimeout(function(){scrollTo(scrollX, previousScrollY)}, 20);
 }
}

function inputValue(data)
{
 var selstart = getSelectionStart(), v = getValue();
 setValue(v.slice(0, selstart)+data+v.slice(getSelectionEnd()));
 setSelection(0, selstart+data.length);
 setSelection(1, selstart+data.length);
 tcDispatch('textModified');
}

function transformTextByFunction(fpointer)
{
 var selStart = getSelectionStart(), selEnd = getSelectionEnd();
 var val, valSet, v = getValue();

 if (selStart===selEnd)
 {
  transformTextByFunction.cursor = selStart;
  transformTextByFunction.outcursor = null;
 }

 try
 {
  val = fpointer(selStart===selEnd?v:v.substring(selStart, selEnd));
  valSet = typeof val !== 'undefined';
 }
 catch(e)
 {
  alert(e);
 }

 if (valSet)
 {
  if (selStart===selEnd) 
  {
   setValue(val);
   if (transformTextByFunction.outcursor!==null)
   {
    setSelection(0, transformTextByFunction.outcursor);
    setSelection(1, transformTextByFunction.outcursor);
   }
   transformTextByFunction.cursor = null;
  }
  else
  {
   setValue(v.substring(0, selStart)+val+v.substring(selEnd));
   setSelection(0, selStart);
   setSelection(1, selStart+val.length);
  }
 }

 if (valSet) tcDispatch('textModified');
 setFocus(!valSet);
}

function processKey(event)
{
 //we handle delete and backspace so that user can cut stuff without losing binary state
 //we also handle non-ctrl arrows and shift+non-ctrl arrows

 if (event.ctrlKey && event.keyCode==90 && logOn)
 {
  undo();
  event.preventDefault();
 }
 else if (event.ctrlKey && event.keyCode==89 && logOn)
 {
  redo();
  event.preventDefault();
 }
 else if (event.keyCode === 9) //process tab key
 {
  inputValue('\t'); //dispatches textModified
  event.preventDefault();
 }
 else if (event.ctrlKey && event.keyCode === 82) //repeat last action
 {
  if (lastTransformFunction)
  transformTextByFunction(lastTransformFunction);
  event.preventDefault();
 }
 else if (event.keyCode === 46) //delete
 {
  var selStart = getSelectionStart(), selEnd = getSelectionEnd(), v = getValue();
  if (selStart===selEnd && selStart!==v.length)
  setValue(v.substring(0, selStart)+v.substring(selStart+1));
  else if (selStart!==selEnd)
  setValue(v.substring(0, selStart)+v.substring(selEnd));

  setSelection(0, selStart);
  setSelection(1, selStart);

  tcDispatch('textModified');
  event.preventDefault();
 }
 else if (event.keyCode === 8) //backspace
 {
  var selStart = getSelectionStart(), selEnd = getSelectionEnd(), v = getValue();
  if (selStart===selEnd && selStart>0) 
  {
   setValue(v.substring(0, selStart-1)+v.substring(selStart));
   selStart--;
  }
  else if (selStart!==selEnd)
  setValue(v.substring(0, selStart)+v.substring(selEnd));

  setSelection(0, selStart);
  setSelection(1, selStart);

  tcDispatch('textModified');
  event.preventDefault();
 }
 else if (event.keyCode === 13) //enter
 {
  var selstart = getSelectionStart(), v = getValue(), insert = '\n';
  
  if (autoIndent)
  {
   var lastBreak = v.lastIndexOf('\n', selstart-1);
   for(var t=lastBreak+1;t<selstart;t++)
   {
    if (v[t] === ' ' || v[t] === '\t')
    insert += v[t];
    else
    break;
   }
  }
  
  inputValue(insert); //dispatches textModified
  event.preventDefault();
 }
 else if (!event.ctrlKey && !event.shiftKey && (event.keyCode === 37 || event.keyCode === 39)) //arrows
 {
  var selStart = getSelectionStart(), selEnd = getSelectionEnd();
  if (selStart!==selEnd)
  {
   if (event.keyCode===37) setSelection(1, selStart);
   else setSelection(0, selEnd);
  }
  else
  {
   if (event.keyCode===37 && selStart)
   {
    setSelection(0, selStart-1);
    setSelection(1, selStart-1);
   }
   else if (event.keyCode===39 && selEnd<getValue().length)
   {
    setSelection(0, selStart+1);
    setSelection(1, selStart+1);
   }
  }
  tcDispatch('cursorUpdate');
  event.preventDefault();
 }
 else if (!event.ctrlKey && event.shiftKey && (event.keyCode === 37 || event.keyCode === 39)) //shift arrows
 {
  var selStart = getSelectionStart(), selEnd = getSelectionEnd(), selDir = textarea.selectionDirection==='backward';
  if (selStart===selEnd)
  {
   if (event.keyCode===37 && selStart)
   {
    setSelection(0, selStart-1);
    setSelection(1, selStart);
    selDir = textarea.selectionDirection='backward';
   }
   else if (event.keyCode===39 && selEnd<getValue().length)
   {
    setSelection(0, selStart);
    setSelection(1, selStart+1);
   }
  }
  else
  {
   if (!selDir)
   {
    setSelection(0, selStart);
    setSelection(1, selEnd+((event.keyCode===37)?-1:(event.keyCode===39 && selEnd<getValue().length)?1:0));
   }
   else
   {
    setSelection(0, selStart+((event.keyCode===37 && selStart)?-1:(event.keyCode===39)?1:0));
    setSelection(1, selEnd);
   }
  }
  tcDispatch('cursorUpdate');
  event.preventDefault();
 }
 else 
 {
  if (event.ctrlKey || !((event.keyCode > 47 && event.keyCode < 58) || event.keyCode == 32 || event.keyCode == 13 || (event.keyCode > 64 && event.keyCode < 91) ||  (event.keyCode > 95 && event.keyCode < 112)  || (event.keyCode > 185 && event.keyCode < 193) || (event.keyCode > 218 && event.keyCode < 223)))
  setTimeout(userCursorChange, 0);
 }
}

//handle copying binary data (\r and in FF also \xa0), should work on chromium and FF
//this requires up-to-date selection
function handleCopy(e)
{
 if (e && e.clipboardData && e.clipboardData.setData)
 {
  e.clipboardData.setData('text/plain', getSelectedValue());
  e.preventDefault();
 }
}

//handle pasting binary data, chromium only for now, but the event is universal
function handleBeforeInput(e)
{
 if (e.data && (e.data.indexOf('\r') > -1 || e.data.indexOf('\xa0') > -1)) 
 {
  inputValue(e.data);
  e.preventDefault();
 }
}

function undo()
{
 if (!diff.length) return;
 var selEnd = diff.pop(), selStart = diff.pop(), todel = diff.pop(), toins = diff.pop(), lcp = diff.pop(), val = getValue();
 rdiff.push(lcp, val.slice(lcp, lcp+todel), toins.length, getSelectionStart(), getSelectionEnd());
 setValue(val.slice(0, lcp)+toins+val.slice(lcp+todel), true);
 setSelection(0, selStart); setSelection(1, selEnd);
 redobutton.disabled = false;
 undobutton.disabled = diff.length?false:true;
 setFocus();
 tcDispatch('textModified');
}
function redo()
{
 if (!rdiff.length) return;
 var selEnd = rdiff.pop(), selStart = rdiff.pop(), todel = rdiff.pop(), toins = rdiff.pop(), lcp = rdiff.pop(), val = getValue();
 diff.push(lcp, val.slice(lcp, lcp+todel), toins.length, getSelectionStart(), getSelectionEnd());
 setValue(val.slice(0, lcp)+toins+val.slice(lcp+todel), true);
 setSelection(0, selStart); setSelection(1, selEnd);
 redobutton.disabled = rdiff.length?false:true;
 undobutton.disabled = false;
 setFocus();
 tcDispatch('textModified');
}
function setDiffDepth()
{
 var on = document.getElementById('log-diff-depth-on').checked, desired = Math.max(parseInt(document.getElementById('log-diff-depth').value) || 1, 1);
 logLimit = on?desired:0;
 cutLogToLimit();
}
function cutLogToLimit()
{
 if (!logLimit) return;
 if (diff.length>5*logLimit)
 diff.splice(0, diff.length-5*logLimit);
}
function resetLog()
{
 diff.length=rdiff.length=0;
 redobutton.disabled = true;
 undobutton.disabled = true;
}
function switchLog(oreally)
{
 if (oreally)
 {
  logOn = true;
 }
 else
 {
  resetLog();
  logOn=false;
 }
}
function userInput(e)
{
 setValue(textarea.value, false, true);
 readSelectionToCache();
 tcDispatch('textModified');
}
function userCursorChange(e)
{
 readSelectionToCache();
 tcDispatch('cursorUpdate');
}
function getInputString(id)
{
 var value = document.getElementById(id).value;
 var json = document.getElementById(id+'-asjson') && document.getElementById(id+'-asjson').checked;
 if (json)
 value = jsonstrdecode(value.replace(/\n/g, '\\n'));
 return value;
}
function setInputString(id, str)
{
 var json = document.getElementById(id+'-asjson') && document.getElementById(id+'-asjson').checked;
 if (str.indexOf('\n')!==-1 || str.indexOf('\r')!==-1)
 {
  json=true;
  if (document.getElementById(id+'-asjson')) document.getElementById(id+'-asjson').checked = true;
 }
 document.getElementById(id).value = json?jsonstrencode(str, true):str;
}
function clearLastTransform()
{
 if (lastTransformButton)
 lastTransformButton.className = '';
 lastTransformButton = null;
 lastTransformFunction = null;
}
function setLastTransform(func, button)
{
 if (button)
 {
  if (lastTransformButton)
  lastTransformButton.className = '';
  button.className = 'last';
  lastTransformButton = button;
 }
 lastTransformFunction = func;
}
function sharedCopy()
{
 var selStart = getSelectionStart(), selEnd = getSelectionEnd();
 var v = getValue();

 if (v)
 {
  if (selStart!==selEnd)
  v = v.substring(selStart, selEnd);

  try {
   localStorage.setItem('zb3.tools.clipboard', v);
  } catch (e) {
   alert('Could not copy to local storage: '+e);
  }
 }

 setFocus(true);
}
function sharedPaste(additional)
{
 var selStart, copied = '';

 try {
  copied = localStorage.getItem('zb3.tools.clipboard', v) || '';
 } catch (e) {
  alert('Could not paste from local storage: '+e);
 }

 if (additional)
 {
  selStart = textarea2.selectionStart;
  textarea2.value = textarea2.value.substring(0, selStart)+copied+textarea2.value.substring(textarea2.selectionEnd);
  textarea2.selectionStart = textarea2.selectionEnd = selStart+copied.length;
  textarea2.focus();
 }
 else
 {
  selStart = getSelectionStart(), selEnd = getSelectionEnd();
  var v = getValue();

  setValue(v.substring(0, selStart)+copied+v.substring(selEnd));
  setSelection(0, selStart+copied.length);
  setSelection(1, selStart+copied.length);
  setFocus();
  tcDispatch('textModified');
 }
}
function bindTTBFButton(button)
{
 if (!button.dataset.transform || button.dataset.ttbfbound) return false;
 var args = button.dataset.args?JSON.parse('['+button.dataset.args+']'):null;
 var func = tcResolve(button.dataset.transform);

 if (!func)
 return false;
  
 if (args) func = func.bind.apply(func, [func].concat(args));
 var update = button.dataset.dontUpdate!=='true';

 var updateFunction = setLastTransform.bind(this, func, button);
 var blocked = false;
 button.addEventListener('click', function()
 {
  if (blocked)
  {
   blocked = false;
   return;
  }
  if (update) updateFunction();
  transformTextByFunction(func, null, true);
 });

 var updateAndBlock = function()
 {
  updateFunction();
  setFocus(true);
  blocked = true;
 };

 var timeout = null, removeTimeout = function()
 {
  if (timeout !== null)
  {
   clearTimeout(timeout);
   timeout = null;
  }
  document.removeEventListener('mouseup', removeTimeout);
 };

 if (update)
 button.addEventListener('mousedown', function()
 {
  blocked = false;
  removeTimeout();
  timeout = setTimeout(updateAndBlock, 1000);
  document.addEventListener('mouseup', removeTimeout);
 });
 
 button.dataset.ttbfbound = true;
}
function bindTTBF()
{
 var buttons = document.querySelectorAll('button[data-transform]');
 for(var t=0;t<buttons.length;t++)
 bindTTBFButton(buttons[t]);
}
function initCore()
{
 logOn = document.getElementById('logonoff').checked;
 autoIndent = document.getElementById('auto-indent').checked;
 buttonsDiv = document.getElementById('scaleme');
 lastTransformFunction = null;
 lastTransformButton = null;
 textarea = document.getElementById('escarea1');
 textarea2 = document.getElementById('addarea1');
 binaryCache = textarea.value;
 isBinary = false;
 bcl = binaryCache.length;
 binarySelStart = 0;
 binarySelEnd = 0;
 tcDispatch('textModified');
 undobutton = document.getElementById('undobutton');
 redobutton = document.getElementById('redobutton');
 setInterval(catchup, 100);
 bindTTBF();
 buttonsDiv.onwheel = function(event)
 {
  if (event.deltaY>0 && buttonsDiv.scrollHeight - buttonsDiv.scrollTop === buttonsDiv.clientHeight)
  event.preventDefault();
 };
 
 textarea.addEventListener('mousedown', catchselStart); textarea.addEventListener('touchstart', catchselStart);
 document.addEventListener('mousemove', catchselMove); document.addEventListener('touchmove', catchselMove);
 document.addEventListener('mouseup', catchselEnd); document.addEventListener('touchend', catchselEnd);
 document.addEventListener('touchcancel', catchselEnd);
 
 textarea.addEventListener('copy', handleCopy);
 textarea.addEventListener('beforeinput', handleBeforeInput);

 textarea.ondragover = function () { return false; };
 textarea.ondragend = function () {  return false; };
 textarea.ondrop = function (e) {
   e.preventDefault();
   if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length)
   readFileInto(e.dataTransfer.files[0]);
 };

 textarea2.ondragover = function () { return false; };
 textarea2.ondragend = function () {  return false; };
 textarea2.ondrop = function (e) {
   e.preventDefault();
   if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length)
   readFileInto(e.dataTransfer.files[0], true);
 };
 
 //module stuff
 var els = document.querySelectorAll('[data-ensureloaded]');
 for(var t=0;t<els.length;t++)
 {
  tcAddEnsureListener(els[t]);
 }
 
 tcLoaded = true;
 tcSetLoading(false);
}

function readFileInto(file, additional)
{
 if (!file) return;

 var r = new FileReader();
 r.onload = function()
 {
  var u8 = new Uint8Array(r.result);
  var str = '';
  for(var t=0;t<u8.length;t++)
  {
   str += String.fromCharCode(u8[t]);
  }
  if (additional)
  {
   textarea2.value = str;
   textarea2.selectionStart=textarea2.selectionEnd=0;
  }
  else
  {
   setValue(str); setSelection(0, 0); setSelection(1, 0);
   tcDispatch('textModified');
  }
 };
 r.readAsArrayBuffer(file);
}

/* helpers, use them! */
function getElements(str)
{
 return splitCSV(str, getInputString('element-separator'), getInputString('csv-quote'));
}
function makeElements(arr)
{
 return joinCSV(arr, getInputString('element-separator'), null, getInputString('csv-quote'), document.getElementById('csv-quote-always').checked);
}
function getCSV(str)
{
 var tsep = getInputString('csv-quote');
 var tlines = splitCSV(str, getInputString('row-separator'), tsep, true);
 for(var t=0;t<tlines.length;t++)
 {
  tlines[t] = splitCSV(tlines[t], getInputString('element-separator'), tsep);
 }
 return tlines;
}
function makeCSV(arr)
{
 return joinCSV(arr, getInputString('element-separator'), getInputString('row-separator'), getInputString('csv-quote'), document.getElementById('csv-quote-always').checked);
}
function getAdditionalValue()
{
 return textarea2.value;
}

document.addEventListener('DOMContentLoaded', initCore);


//////////////////////////////////////////////////////////module functions
function tcResolve(obj)
{
 if (typeof obj === 'string')
 {
  var tpath = obj.split('.');
  return tpath.length === 1 ? window[tpath[0]] : window[tpath[0]] && window[tpath[0]][tpath[1]];
 }
 else return obj;
}
function tcSetLoading(on)
{
 if (on)
 {
  tcLoading++;
  document.getElementById('tc-loading').style.display='';
 }
 else
 {
  tcLoading--;
  if (!tcLoading)
  document.getElementById('tc-loading').style.display='none';
 }
}

function tcEnsureLoaded(scripts, cb)
{
 var toLoad = [];
 for(var t=0;t<scripts.length;t++)
 if (tcLoadedScripts.indexOf(scripts[t])===-1)
 toLoad.push(scripts[t]);
 
 if (!toLoad.length)
 {
  if (cb) cb();
 } 
 else
 {
  var loaded = 0, source = [];
  tcSetLoading(true);
  
  for(var t=0;t<toLoad.length;t++)
  {
   (function(t)
   {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'js/modules/'+toLoad[t]);
    xhr.overrideMimeType('application/javascript');
    xhr.onload = function()
    {
     loaded++;
     source[t] = xhr.responseText;

     if (loaded === toLoad.length)
     {
      for(var x=0;x<toLoad.length;x++)
      if (tcLoadedScripts.indexOf(toLoad[x])===-1)
      {
       (1,eval)(source[x]); //eval in global scope
       tcLoadedScripts.push(toLoad[x]);
      }
     
      tcSetLoading(false);
      if (cb) cb();
     }
    };
    xhr.send();
   })(t);
  }
 }
}

function tcAddEnsureListener(el)
{
 var toLoad = el.dataset.ensureloaded.split(',');
 function wake(e)
 {
  el.removeEventListener('click', wake, true);
  el.removeEventListener('input', wake, true);
  el.removeEventListener('change', wake, true);
  
  e.preventDefault();
  e.stopPropagation();
  
  tcEnsureLoaded(toLoad, function()
  {
   var buttons = el.querySelectorAll('button[data-transform]');
   for(var t=0;t<buttons.length;t++)
   bindTTBFButton(buttons[t]);
   
   e.target.dispatchEvent(new e.constructor(e.type, e));
  });
 }
 el.addEventListener('click', wake, true);
 el.addEventListener('input', wake, true);
 el.addEventListener('change', wake, true);
}

function tcLoad(path, obj)
{
 if (obj.deps && obj.deps.keys)
 {
  for(var t=0;t<obj.deps.keys.length;t++)
  {
   if (!window[obj.deps.keys[t]])
   throw "Can't find dependency: "+obj.deps.keys[t];
   
   obj.deps[obj.deps.keys[t]] = window[obj.deps.keys[t]];
  }
 }
 
 if (obj.export)
 {
  window[path] = obj.export;
 }
 
 if (obj.preInit)
 obj.preInit();
 
 if (obj.init)
 {
  if (tcLoaded)
  obj.init();
  else
  document.addEventListener('DOMContentLoaded', obj.init);
 }
}


//////////////////////////////////////////////////////////common functions
function commonPrefix(text1, text2)
{
 //Quick check for common null cases.
 if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0))
 return 0;

 //Binary search.
 //Performance analysis: http://neil.fraser.name/news/2007/10/09/
 var pointermin = 0;
 var pointermax = Math.min(text1.length, text2.length);
 var pointermid = pointermax;
 var pointerstart = 0;
 while (pointermin < pointermid)
 {
  if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid))
  {
   pointermin = pointermid;
   pointerstart = pointermin;
  }
  else
  pointermax = pointermid;
  pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
 }
 return pointermid;
}
function commonSuffix(text1, text2, pref)
{
 //Quick check for common null cases.
 if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1))
 return 0;
 if (pref===undefined) pref=0;

 //Binary search.
 //Performance analysis: http://neil.fraser.name/news/2007/10/09/
 var t1l = text1.length, t2l = text2.length;
 var pointermin = 0;
 var pointermax = Math.min(t1l, t2l)-pref;
 var pointermid = pointermax;
 var pointerend = 0;
 while (pointermin < pointermid)
 {
  if (text1.substring(t1l - pointermid, t1l - pointerend) == text2.substring(t2l - pointermid, t2l - pointerend))
  {
   pointermin = pointermid;
   pointerend = pointermin;
  }
  else
  pointermax = pointermid;
  pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
 }
 return pointermid;
}
function jsonstrencode(str, noQuotes)
{
 var ret;
 ret = JSON.stringify(str);
 if (noQuotes) ret = ret.slice(1, -1);
 return ret;
}
function jsonstrdecode(str)
{
 var ret, txt = str;

 if (typeof str === 'string' && str[0]!=='"')
 txt = '"'+str+'"';

 try {
  ret = JSON.parse(txt);
 } catch(e) {
  throw 'JSON error: '+e;
 }
 return ret;
}
function jsonarrdecode(str)
{
 var ret, txt = str;

 if (typeof str === 'string' && str[0]!=='[' && str[0]!=='{')
 txt = '['+str+']';

 try {
  ret = JSON.parse(txt);
 } catch(e) {
  throw 'JSON error: '+e;
 }
 return ret;
}