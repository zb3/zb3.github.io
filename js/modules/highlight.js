tcLoad('highlight', (function()
{
 /*
 this assumes alot about textarea (position, manual update etc)
 and not really ready to be used outside tools..
 */
 var TH = function(element)
 {
  var _this = this;
  this.element = element;
  element.style.position = 'relative';
  
  this.wrapper = document.createElement('div');
  this.wrapper.style.position = 'relative';
  
  this.element.parentNode.insertBefore(this.wrapper, this.element);
  
  //append shadow
  this.shadow = document.createElement('div');
  this.shadow.className = 'th-shadow';
 
  this.originalStyle = []; 
  var cs = getComputedStyle(element);
 
  for(var t=0;t<cs.length;t++)
  {
   if (cs[t] !== '-webkit-text-fill-color')
   this.shadow.style[cs[t]] = cs[cs[t]];
   
   if (!cs[t].indexOf('background'))
   this.originalStyle.push([cs[t], cs[cs[t]]]);
  }
  
  var scrollLeft = element.scrollLeft, scrollTop = element.scrollTop;
  
  this.shadow.style.color = 'transparent';
  this.shadow.style.position = 'absolute';
  this.shadow.style.top = '0';
  this.shadow.style.left = '0';
  this.shadow.style.overflow = 'hidden';
  this.shadow.style.borderColor = 'transparent';
  this.shadow.style.resize = 'none';
  
  this.element.style.background = 'transparent';
  
  this.wrapper.appendChild(this.shadow);
  this.wrapper.appendChild(this.element);
  this.loadSBDimensions();
  
  this.initBaseSize(cs);
  
  //copy style
  
  //listen to resize, scroll, input
  this.syncScroll = function()
  {
   _this.shadow.scrollLeft = element.scrollLeft;
   _this.shadow.scrollTop = element.scrollTop;
  };
  
  this.element.addEventListener('scroll', this.syncScroll);
  this.shadow.addEventListener('scroll', this.syncScroll);
  
  this.lastWidth = this.lastHeight = 0;
  
  this.sizeInterval = setInterval(this.updateSize.bind(this), 30);
  
  element.scrollLeft = scrollLeft;
  element.scrollTop = scrollTop;  
 };
 TH.prototype.cssWidth = function(el, cs)
 {
  var ret = el.offsetWidth;
  if (cs.boxSizing !== 'border-box')
  ret += -parseFloat(cs.borderLeftWidth)-parseFloat(cs.borderRightWidth)-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
  return ret;
 };
 TH.prototype.cssHeight = function(el, cs)
 {
  var ret = el.offsetHeight;
  if (cs.boxSizing !== 'border-box')
  ret += -parseFloat(cs.borderTopHeight)-parseFloat(cs.borderBottomHeight)-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
  return ret;
 };
 TH.prototype.initBaseSize = function(cs)
 {
  this.baseWidth = this.cssWidth(this.element, cs);
  this.baseHeight = this.cssHeight(this.element, cs);
  
  this.hScrollOn = this.vScrollOn = false;
  this.updateScrollbars(true);
 };
 TH.prototype.updateSize = function()
 {
  var r = this.element.getBoundingClientRect();
  
  if (this.lastAreaWidth !== r.width || this.lastAreaHeight !== r.height)
  {
   this.lastAreaWidth = r.width; this.lastAreaHeight = r.height;
   
   var cs = getComputedStyle(this.element);
   this.initBaseSize(cs);
  }
 };
 TH.prototype.updateScrollbars = function(reset)
 {
  var hOn = this.element.scrollWidth>this.element.clientwidth;
  if (reset || (hOn ^ this.hScrollOn))
  {
   this.shadow.style.height = this.baseHeight-(hOn?this.sbHeight:0)+'px';
   this.hScrollOn = hOn;
  }
  
  var vOn = this.element.scrollHeight>this.element.clientHeight;
  if (reset || (vOn ^ this.vScrollOn))
  {
   this.shadow.style.width = this.baseWidth-(vOn?this.sbWidth:0)+'px';
   this.vScrollOn = vOn;
  }
 };
 TH.prototype.removeScrollbars = function(reset)
 {
  this.shadow.style.width = this.baseWidth+'px';
  this.shadow.style.height = this.baseHeight+'px';
  this.hScrollOn = this.vScrollOn = false;
 };
 TH.prototype.loadSBDimensions = function()
 {
  var testarea = document.createElement('textarea');
  testarea.style.position = 'absolute';
  testarea.style.top = '-1000px';
  testarea.style.left = '-1000px';
  testarea.style.width = '100px';
  testarea.style.height = '100px';
  testarea.style.overflow = 'scroll';
 
  document.body.appendChild(testarea);
  
  var csw = testarea.clientWidth, csh = testarea.clientHeight;
 
  testarea.style.overflow = 'hidden';
 
  this.sbWidth = testarea.clientWidth-csw;
  this.sbHeight = testarea.clientHeight-csh;
  
  document.body.removeChild(testarea);
 };
 TH.prototype.clear = function()
 {
  this.shadow.innerHTML = '';
  
  //this.content = this.offsets = null;
 };
 TH.prototype.updateContent = function(content, offsets)
 {
  var ret = '';
 
  for(var t=0;t<offsets.length-1;t++)
  {
   if (t%2)
   ret += '<span>'+escapeHTML(content.slice(offsets[t], offsets[t+1]))+'</span>';
   else
   ret += escapeHTML(content.slice(offsets[t], offsets[t+1]));
  }
  
  //FF's padding on textarea is weird
  //so sometimes textarea can be strolled more than our shadow
  //so append newlines to partially(!) solve this problem
  
  ret += '\n\n\n\n\n\n\n\n\n\n';
  
  this.shadow.innerHTML = ret;
  
  this.updateScrollbars();
  this.syncScroll();
 };
 /*
 TH.prototype.updateSelection = function(content, selstart, selend)
 {
  var selnow = selstart>=0 && selstart<this.offsets[1], set, t, el;
 
  for(var x=0;x<this.offsets.length/2-1;x++)
  {
   t = 2*x+1;
   el = this.shadow.children[x];
   set = 0;
  
   if (selnow)
   {
    selchars = Math.min(selend-this.offsets[t], this.offsets[t+1]-this.offsets[t]);
    if (selchars)
    {
     set = true;
     el.innerHTML = '<span>'+escapeHTML(this.content.slice(this.offsets[t], this.offsets[t]+selchars))+'</span>'+escapeHTML(this.content.slice(this.offsets[t]+selchars, this.offsets[t+1]))
    }
   }
   else
   {
    selchars = (selstart>=this.offsets[t]) ? Math.max(0, this.offsets[t+1]-selstart) : 0;
    if (selchars)
    {
     set = true;
     el.innerHTML = escapeHTML(this.content.slice(this.offsets[t], this.offsets[t+1]-selchars))+'<span>'+escapeHTML(this.content.slice(this.offsets[t+1]-selchars, this.offsets[t+1]))+'</span>'
    }
   }
  
   if (!set && el.children.length)
   el.innerHTML = escapeHTML(this.content.slice(this.offsets[t], this.offsets[t+1]));
  
   //selnow upgrade part
   if (!selnow && selstart>=this.offsets[t] && selstart<this.offsets[t+2])
   selnow = 1;
  
   if (selnow && selend>=this.offsets[t] && selend<this.offsets[t+2])
   selnow = 0;
  }
 };
 */
 TH.prototype.destroy = function()
 {
  clearInterval(this.sizeInterval);
  
  this.element.removeEventListener('scroll', this.syncScroll);
  this.shadow.removeEventListener('scroll', this.syncScroll);
  
  this.wrapper.parentNode.insertBefore(this.element, this.wrapper);
  this.wrapper.parentNode.removeChild(this.wrapper);
  
  //reset background
  /*
  "whoops there's a problem"
  ~zb3
  */
  for(var t=0;t<this.originalStyle.length;t++)
  this.element.style[this.originalStyle[t][0]] = this.originalStyle[t][1];
 };
 
 var th = null, on = false;
 
 function init()
 {
  th = new TH(textarea);
  tcListen('textModified', clear);
  //tcListen('cursorUpdate', cursorUpdate);
  tcListen('highlightRegex', highlight);
 }

 function clear()
 {
  if (on)
  {
   th.clear();
   th.removeScrollbars();
   on = false;
  }
 }
 
 function highlight()
 {
  var regex = getFindRegex(true);
  if (!regex) return;
  
  //if something selected, highlight inside selection
  //else highlight all
  //or maybe we should always highlight all?
  
  var content = getValue(), offsets = [0], match, tmp, matches = 0, matchSteps = null;
  var selStart = getSelectionStart(), selEnd = getSelectionEnd();
  
  regex.lastIndex = selStart === selEnd ? 0 : selStart;
  
  while((match = regex.exec(content)) !== null && match !== 'error') 
  {
   if (selStart !== selEnd && regex.lastIndex>selEnd) //match wouldn't fit into selection
   break;
   
   matches++;
   if (match.matchSteps !== undefined)
   matchSteps = (matchSteps||0)+match.matchSteps;
   
   if (!match[0].length)
   {
    regex.lastIndex = advanceStringIndex(content, regex.lastIndex, regex.unicode);
    continue;
   }
   
   tmp = regex.lastIndex-match[0].length;
   if (offsets.length<2 || offsets[offsets.length-1]<tmp)
   {
    offsets.push(tmp);
    offsets.push(regex.lastIndex);
   }
   else offsets[offsets.length-1] = regex.lastIndex;
  }
  
  if (regex.matchSteps !== undefined)
  matchSteps = (matchSteps||0)+regex.matchSteps;
  
  offsets.push(content.length);
  th.updateContent(content, offsets);
  
  matchSteps = (matchSteps !== null) ? ' (steps: <span class="result">'+matchSteps+'</span>)' : '';
  
  var msg = (matches) ? 'Highlighted items: <span class="result">'+matches+'</span>'+matchSteps : 'No items highlighted.'+matchSteps;

  if (match === 'error')
  msg += '<br><br>Error @ match <span class="result">'+matches+'</span>: '+regex.error;

  regexStatusMsg(msg);
  
  setFocus(1);
  //cursorUpdate();
  
  on = true;
 }
 

 /*
 function cursorUpdate()
 {
  if (!on) return;
  th.updateSelection(getSelectionStart(), getSelectionEnd());
 }
 */
 
 
 
 return {init: init};
})());
//# sourceURL=highlight.js