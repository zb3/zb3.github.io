tcLoad('tDiff', (function(){

var deps = {keys: ['escapeHTML', 'dmp', 'hexify']}; //AMD or CommonJS may go home

var lastStr1 = null, lastStr2 = null;
var copyHexified = false;

function $(id) {return document.getElementById(id);}

function initDiff()
{
 $('diff-output-inline').oncopy = $('diff-output-multiline').oncopy = copyDiff;
 $('diff-output-multiline').onscroll = inlineDiffFixLN;
 
 $('diff-multiline').onchange = $('diff-interleave').onchange = $('diff-dmpcleanup').onchange = displayDiff;
 
 ($('diff-linewrap').onchange = function()
 {
  $('diff-output-multiline-tbody').parentNode.className = $('diff-linewrap').checked?'':'nowrap';
  $('diff-output-inline').classList[$('diff-linewrap').checked?'remove':'add']('nowrap');
 })();
 
 ($('diff-hexify').onchange = function()
 {
  copyHexified = $('diff-hexify').checked;
 })();
}

function displayDiff(str1, str2)
{
 if (typeof str1 !== 'string') str1 = lastStr1;
 else lastStr1 = str1;
 
 if (typeof str2 !== 'string') str2 = lastStr2;
 else lastStr2 = str2;
 
 var lineMode = $('diff-multiline').checked;
 var interleave = $('diff-interleave').checked;
 var cleanup = $('diff-dmpcleanup').selectedIndex;
 
 $('diff-inline-only').style.display = lineMode?'none':'';
 $('diff-multiline-only').style.display = lineMode?'':'none';

 if (str1 || str2)
 {
  var diff;
  if (lineMode)
  {
   diff = dmp.diff_lineMode(str1, str2);
   if (interleave)
   dmp.diff_interlaveLineDiff(diff);
   
   $('diff-output-inline').style.display = 'none';
   $('diff-output-multiline').style.display = '';
   displayMultilineDiff(diff);
  }
  else
  {
   diff = dmp.diff_main(str1, str2, false);
   
   if (cleanup === 1)
   dmp.diff_cleanupEfficiency(diff);
   else if (cleanup === 2)
   dmp.diff_cleanupSemantic(diff);
   
   $('diff-output-inline').style.display = '';
   $('diff-output-multiline').style.display = 'none';
   displayInlineDiff(diff);
  }
 }
}

function encodeText(str)
{
 return deps.escapeHTML(str).replace(/[\x00-\x08\x0A-\x1F\x7F-\xA0\xAD]/g, function(m)
 {
  if (m.charCodeAt(0) === 10)
  return '<span class="inline-newline">↵</span>\n';
  else
  return '<span class="diff-special" data-char="'+(m.charCodeAt(0))+'">[<span>'+(('0'+m.charCodeAt(0).toString(16)).slice(-2))+'</span>]</span>';
 });
}

function displayInlineDiff(diff)
{
 //offsets are ofc misleading... thx #utf16
 var html = '', aptr = 0, bptr = 0, ins = 0, del = 0, sameChars = 0, diffFound = 0;
 for(var t=0;t<diff.length;t++)
 {
  if (!diff[t][0] && !ins && !del) sameChars += diff[t][1].length;
  
  if (!diff[t][0])
  {
   html += encodeText(diff[t][1]);
   aptr += diff[t][1].length;
   bptr += diff[t][1].length;
  }
  else if (diff[t][0] === -1)
  {
   html += '<span class="inline-old" title="start: '+aptr+', end: '+(aptr+diff[t][1].length)+', length: '+diff[t][1].length+'">'+encodeText(diff[t][1])+'</span>';
   aptr += diff[t][1].length;
   del += diff[t][1].length;
  }
  else if (diff[t][0] === 1)
  {
   html += '<span class="inline-new" title="start: '+bptr+', end: '+(bptr+diff[t][1].length)+', length: '+diff[t][1].length+'">'+encodeText(diff[t][1])+'</span>';
   bptr += diff[t][1].length;
   ins += diff[t][1].length;
  }
 }
 
 $('diff-output-inline').innerHTML = html;
 
 $('diff-inline-changed').style.display = ins+del?'':'none';
 $('diff-output-same').style.display = $('diff-multiline-changed').style.display = ins+del?'none':'';
 
 $('diff-inline-dist').textContent = Math.max(ins, del);
 $('diff-inline-firstpos').textContent = sameChars;
 
 return html+'\n';
}
function displayMultilineDiff(diff)
{
 var el = document.getElementById('diff-output-multiline-tbody'), html = '';
 el.innerHTML = '';

 var lineA = 0, lineB = 0, ins = 0, del = 0, sameLines = 0;
 for(var t=0;t<diff.length;t++)
 {
  if (!diff[t][0] && !del && !ins) sameLines++;
  
  html += '<tr'+(diff[t][0]===-1?' class="diff-old"':diff[t][0]===1?' class="diff-new"':'')+'><td class="lineno">';
  html += diff[t][0] !== 1 ? ++lineA : '';
  html += '<td class="lineno">';
  html += diff[t][0] !== -1 ? ++lineB : '';
  html += '<td class="line">'+encodeText(diff[t][1]);
  
  if (diff[t][0] === -1) del++;
  if (diff[t][0] ===  1) ins++;
 }

 el.innerHTML = html;
 $('diff-multiline-changed').style.display = ins+del?'':'none';
 $('diff-output-same').style.display = $('diff-inline-changed').style.display = ins+del?'none':'';
 
 $('diff-multiline-dist').textContent = Math.max(ins, del);
 $('diff-multiline-firstpos').textContent = sameLines+1;
}

// Small Walker v0.1.1, 5/5/2011, http://benalman.com/ Copyright (c) 2011 "Cowboy" Ben Alman, dual licensed MIT/GPL.
;function walkDOM(a,b){var c,d,e=0;do c||(c=b(a,e)===!1),!c&&(d=a.firstChild)?++e:(d=a.nextSibling)?c=0:(d=a.parentNode,--e,c=1),a=d;while(e>0)};
//

function copyDiff(e)
{
 var node = document.createElement('div'), sel = getSelection();
 for(var t=0;t<sel.rangeCount;t++)
 node.appendChild(getSelection().getRangeAt(t).cloneContents());

 var w = document.createTreeWalker(node, 5);

 var lastLine = null, depth;
 var ret = '', tmp;

 walkDOM(node, function(n, depth)
 {
  if (n.nodeType !== 3 && n.nodeType !== 1) return false;

  if (n.nodeType === 3)
  {
   if (lastLine && lastLineDepth >= depth)
   { 
    lastLine = null;
    ret += '\n';
   }
   tmp = n.nodeValue.replace(/\n/g, '');
   ret += copyHexified?deps.hexify(tmp, true):tmp;
  }
  else if (n.className === 'diff-special' && n.dataset.char !== undefined)
  {
   tmp = String.fromCharCode(parseInt(n.dataset.char));
   
   if (copyHexified)
   ret += deps.hexify(tmp, true);
   else
   ret += tmp;
   
   return false;
  }
  else if (n.className === 'inline-newline' && n.childNodes.length)
  {
   ret += '\n';
   return false;
  }
  else if (n.className === 'lineno')
  {
   return false;
  }
  else if (n.className === 'line')
  {
   if (lastLine && n !== lastLine)
   ret += '\n';

   lastLineDepth = n !== lastLine ? depth : -1;
   lastLine = n;
  }
 });

 
 e.preventDefault();
 e.clipboardData.setData('text/plain', ret);

}

inlineDiffFixLN.last = 0;
function inlineDiffFixLN(e)
{
 if (e.target.scrollLeft === inlineDiffFixLN.last) return;
 inlineDiffFixLN.last = e.target.scrollLeft;

 var tds = e.target.children[0].querySelectorAll('tr td:nth-child(-n+2)');
 for(var t=0;t<tds.length;t++)
 {
  tds[t].style.left = e.target.scrollLeft+'px';
 }
}

return {deps: deps, init: initDiff, export: {diff: displayDiff}};

})());
//# sourceURL=diff.js