tcLoad('PCRE', (function(){

var PCRE_CASELESS = 0x00000001,
PCRE_MULTILINE = 0x00000002,
PCRE_DOTALL = 0x00000004,
PCRE_EXTENDED = 0x00000008,
PCRE_ANCHORED = 0x00000010,
PCRE_DOLLAR_ENDONLY = 0x00000020,
PCRE_DUPNAMES = 0x00080000,
PCRE_AUTO_CALLOUT = 0x00004000,
PCRE_UNGREEDY = 0x00000200,
PCRE_UTF16 = 0x00000800,
PCRE_NOTEMPTY_ATSTART = 0x10000000,
PCRE_ERROR_NOMATCH = (-1),
PCRE_ERROR_NOMEMORY = (-6),
PCRE_ERROR_MATCHLIMIT = (-8),
PCRE_ERROR_RECURSIONLIMIT = (-21),
PCRE_ERROR_RECURSELOOP = (-26),
PCRE_INFO_CAPTURECOUNT = 2,
PCRE_INFO_NAMEENTRYSIZE = 7,
PCRE_INFO_NAMECOUNT = 8,
PCRE_INFO_NAMETABLE = 9;

var pcre_exec = libpcre16._pcre16_exec, pcre_study = libpcre16._pcre16_study, pcre_free_study = libpcre16._pcre16_free_study, pcre_fullinfo = libpcre16._pcre16_fullinfo, pcre_compile = libpcre16._pcre16_compile, pcre_get_stepcount = libpcre16._pcre16_get_stepcount;
var malloc = libpcre16._malloc, free = libpcre16._free, Pointer_stringify = libpcre16.Pointer_stringify, stringToUTF16 = libpcre16.stringToUTF16, UTF16ToString = libpcre16.UTF16ToString;
var HEAP32 = libpcre16.HEAP32, HEAPU16 = libpcre16.HEAPU16; 


var calloutAddr = libpcre16._pcre16_callout_addr() >> 2;

var calloutStack = [];
function _callout(addr) //only one for everything, limited number of pointers available
{
 if (!calloutStack.length) return;
 
 var ptr = addr >> 2;
 var curr = calloutStack[calloutStack.length-1];
 
 if (HEAP32[ptr+1] === 255 && HEAP32[ptr+11]) //id is 255 and nextItemLength isn't 0
 {
  curr.steps++;
 }
 
 //calloutNumber, offsetsArray, offsetsArrayStart, startMatch, currentPosition, captureTop, captureLast, patternPosition, nextItemLength
 if (curr.func)
 curr(HEAP32[ptr+1], HEAP32, ptr+2, HEAP32[ptr+5], HEAP32[ptr+6], HEAP32[ptr+7], HEAP32[ptr+8], HEAP32[ptr+10], HEAP32[ptr+11]);
}

var callout = libpcre16.Runtime.addFunction(_callout);

var PCRE = function(str, flags)
{
 this.source = str;
 this.flags = flags;
 this.lastIndex = 0;
 this.unicode = this.ignoreCase = this.multiline = this.global = false;
 this.autoCallout = false;
 
 var fbits = PCRE_DOLLAR_ENDONLY, study = true;
 
 //is anchored the same as sticky?
 
 for(var t=0;flags && t<flags.length;t++)
 {
  if (flags[t] === 'i')
  {
   fbits |= PCRE_CASELESS;
   this.ignoreCase = true;
  }
  else if (flags[t] === 'm')
  {
   fbits |= PCRE_MULTILINE;
   this.multiline = true;
  }
  else if (flags[t] === 's')
  fbits |= PCRE_DOTALL;
  else if (flags[t] === 'x')
  fbits |= PCRE_EXTENDED;
  else if (flags[t] === 'A')
  fbits |= PCRE_ANCHORED;
  else if (flags[t] === 'D')
  fbits &= ~PCRE_DOLLAR_ENDONLY;
  else if (flags[t] === 'u')
  {
   fbits |= PCRE_UTF16;
   this.unicode = true;
  }
  else if (flags[t] === 'S')
  study = false;
  else if (flags[t] === 'g')
  this.global = true;
  else if (flags[t] === 'U')
  fbits |= PCRE_UNGREEDY;
  else if (flags[t] === 'C')
  {
   fbits |= PCRE_AUTO_CALLOUT;
   this.autoCallout = true;
  }
  else if (flags[t] === 'J')
  fbits |= PCRE_DUPNAMES;
 }
 
 
 var pcreStr = malloc(2*(str.length+1));
 stringToUTF16(str, pcreStr);
 
 var errptr = malloc(4), erroffset = malloc(4);
 
 this.pcre = pcre_compile(pcreStr, fbits, errptr, erroffset, null);
 this.pcre_extra = null;
 
 if (!this.pcre)
 {
  var msg = Pointer_stringify(HEAP32[errptr >> 2]) + ' @ pos ' + HEAP32[erroffset >> 2];
 }
 
 free(pcreStr);
 free(errptr);
 free(erroffset);
 
 if (!this.pcre)
 throw msg;
 
 if (study)
 {
  errptr = malloc(4);
  this.pcre_extra = pcre_study(this.pcre, 0, errptr);
  free(errptr);
 }
 
 var tmp = malloc(4);

 pcre_fullinfo(this.pcre, this.pcre_extra, PCRE_INFO_CAPTURECOUNT, tmp);
 this.patternCount = HEAP32[tmp >> 2];
 
 pcre_fullinfo(this.pcre, this.pcre_extra, PCRE_INFO_NAMECOUNT, tmp);
 var namedCount = HEAP32[tmp >> 2];
 
 pcre_fullinfo(this.pcre, this.pcre_extra, PCRE_INFO_NAMEENTRYSIZE, tmp);
 var entrySize = HEAP32[tmp >> 2];
 
 pcre_fullinfo(this.pcre, this.pcre_extra, PCRE_INFO_NAMETABLE, tmp);

 this.namedPatterns = [];
 
 var nptr = HEAP32[tmp >> 2];
 for(var t=0;t<namedCount;t++)
 {
  this.namedPatterns[UTF16ToString(nptr+2)] = HEAPU16[nptr >> 1];
  nptr += 2*entrySize; //coz 16bit string
 }

 free(tmp);

 this.ovlen = 3*(this.patternCount+1);
 this.ovector = malloc(4*this.ovlen);
 this.strMem = null;
 this.strMemLength = null;
 this.matchSteps = 0;
 this.cachedStr = null;
};
PCRE.PCRE_NOTEMPTY = 0x00000010;
PCRE.PCRE_NOTEMPTY_ATSTART = 0x00000400;
PCRE.PCRE_ANCHORED = 0x10000000;
PCRE.prototype.cacheExecStr = function(str)
{
 if (str !== this.cachedStr)
 {
  free(this.strMem);
  this.cachedStr = null;
 }
 
 if (str)
 {
  this.strMem = malloc(2*(str.length+1));
  stringToUTF16(str, this.strMem);
  this.strMemLength = str.length;
  this.cachedStr = str;
 }
};
PCRE.prototype.exec = function(str, flags, calloutFunction, debug)
{
 var calloutWasSet = HEAP32[calloutAddr];
 var setCallout = this.autoCallout || calloutFunction;
 var calloutStackEntry = null;
 
 HEAP32[calloutAddr] = setCallout ? callout : 0;
 
 if (setCallout)
 calloutStack.push(calloutStackEntry = {func: calloutFunction, steps: 0});

 //docs say that we can use anchored+notemptyatstart flags...

 if (!flags)
 flags = 0;
 
 this.cacheExecStr(str);

 var ret = pcre_exec(this.pcre, this.pcre_extra, this.strMem, this.strMemLength, this.lastIndex, flags, this.ovector, this.ovlen);
  
 if (setCallout)
 calloutStack.pop();
 
 HEAP32[calloutAddr] = calloutWasSet;
 
 this.matchSteps = pcre_get_stepcount();
  
 if (ret >= 0)
 {
  var ptr = this.ovector >> 2;
  this.lastIndex = HEAP32[ptr+1];
  
  var ret = [];
  ret.index = HEAP32[ptr];
  
  ret.matchOffsets = [];
  ret.matchSteps = pcre_get_stepcount();
  
  if (this.namedPatterns)
  ret.namedPatterns = this.namedPatterns;
  
  if (calloutStackEntry)
  {
   ret.calloutSteps = calloutStackEntry.steps;
  }
  
  for(var t=0;t<this.ovlen/3;t++)
  {
   ret[t] = HEAP32[ptr+2*t] !== -1 ? str.substring(HEAP32[ptr+2*t], HEAP32[ptr+2*t+1]) : undefined;
   ret.matchOffsets[2*t] = HEAP32[ptr+2*t];
   ret.matchOffsets[2*t+1] = HEAP32[ptr+2*t+1];
  }

  return ret;
 }
 else if (ret === PCRE_ERROR_NOMATCH)
 {
  return null;
 }
 else
 {
  var msg = 'Match error: ';
  if (ret === PCRE_ERROR_NOMEMORY)
  msg += 'no memory';
  else if (ret === PCRE_ERROR_MATCHLIMIT)
  msg += 'match limit reached (catastrophic backtracking?)';
  else if (ret === PCRE_ERROR_RECURSIONLIMIT)
  msg += 'recursion limit reached';
  else if (ret === PCRE_ERROR_RECURSELOOP)
  msg += 'recursion loop';

  throw msg;
 }
};
PCRE.prototype.destroy = function()
{
 if (this.pcre_extra) pcre_free_study(this.pcre_extra);
 free(this.pcre);
 
 free(this.ovector);
 
 this.cacheExecStr(null);
 
 this.pcre_extra = this.pcre = this.ovector = null;
};

return {export: PCRE};

})());
//# sourceURL=PCRE.js