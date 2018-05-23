tcLoad('Onigmo', (function(){

var ONIG_OPTION_IGNORECASE = 1,
ONIG_OPTION_EXTEND = (ONIG_OPTION_IGNORECASE         << 1),
ONIG_OPTION_DOTALL = (ONIG_OPTION_EXTEND             << 1),
ONIG_OPTION_SINGLELINE = (ONIG_OPTION_DOTALL          << 1),
ONIG_OPTION_FIND_NOT_EMPTY = (ONIG_OPTION_SINGLELINE       << 2);

var ONIG_MISMATCH = -1;
var ONIG_ENCODING_ISO_8859_1 = libonig._onig_getvar_ENCODING_ISO_8859_1();
var ONIG_ENCODING_UTF16_LE = libonig._onig_getvar_ENCODING_UTF16_LE();
var ONIG_SYNTAX_DEFAULT = libonig._onig_getvar_SYNTAX_DEFAULT();
var ONIG_MAX_ERROR_MESSAGE_LEN = 90;
var sizeof_OnigErrorInfo = libonig._onig_getsize_OnigErrorInfo();

var malloc = libonig._malloc, free = libonig._free, Pointer_stringify = libonig.Pointer_stringify, stringToUTF16 = libonig.stringToUTF16,
writeAsciiToMemory = libonig.writeAsciiToMemory;
var HEAP32 = libonig.HEAP32, HEAPU16 = libonig.HEAPU16, HEAPU8 = libonig.HEAPU8; 


//number of function pointers is limited - but this doesn't matter
var foreachFunction = null;
var foreachWrapper = libonig.Runtime.addFunction(function(name, nameEnd, numberOfGroups, numbers, regex, v)
{
 if (foreachFunction)
 foreachFunction(name, nameEnd, numberOfGroups, numbers, regex, v);
});

var warnFunc = libonig.Runtime.addFunction(function(str)
{
 console.warn('Onigmo warning:', Pointer_stringify(str));
});

libonig._onig_set_warn_func(warnFunc);
libonig._onig_set_verb_warn_func(warnFunc);

var Onigmo = function(str, flags)
{
 var _this = this;
  
 this.source = str;
 this.flags = flags;
 this.lastIndex = 0;
 this.sticky = this.unicode = this.ignoreCase = this.multiline = this.global = false;
 
 var fbits = ONIG_OPTION_SINGLELINE;
 
 for(var t=0;flags && t<flags.length;t++)
 {
  if (flags[t] === 'i')
  {
   fbits |= ONIG_OPTION_IGNORECASE;
   this.ignoreCase = true;
  }
  else if (flags[t] === 'm')
  {
   fbits &= ~ONIG_OPTION_SINGLELINE;
   this.multiline = true;
  }
  else if (flags[t] === 's')
  fbits |= ONIG_OPTION_DOTALL;
  else if (flags[t] === 'x')
  fbits |= ONIG_OPTION_EXTEND;
  else if (flags[t] === 'y')
  this.sticky = true;
  else if (flags[t] === 'u')
  this.unicode = true;
  else if (flags[t] === 'g')
  this.global = true;
 }
 
 //prepare memStr - utf16 if unicode set, otherwise binary aka 88591
 var memStr, memStrEnd;
 if (!this.unicode)
 {
  for(var t=0;t<str.length;t++)
  if (str.charCodeAt(t)>255)
  throw 'Non-unicode mode does not support characters whose code is >255, maybe use unicode?';
  
  memStr = malloc(str.length+1);
  writeAsciiToMemory(str, memStr);
  memStrEnd = memStr+str.length;
 }
 else
 {
  memStr = malloc(2*str.length+2);
  stringToUTF16(str, memStr);
  memStrEnd = memStr+2*str.length;
 }
 
 //they use uchar, but does it matter?
 
 var regexPtr = malloc(4); //a pointer to the pointer
 var errPtr = malloc(sizeof_OnigErrorInfo);
 
 var result = libonig._onig_new(regexPtr, memStr, memStrEnd, fbits, this.unicode?ONIG_ENCODING_UTF16_LE:ONIG_ENCODING_ISO_8859_1,
 ONIG_SYNTAX_DEFAULT, errPtr);
 
 if (result)
 {
  var errStr = malloc(ONIG_MAX_ERROR_MESSAGE_LEN);
  libonig._onig_error_code_to_str(errStr, result, errPtr);
  var msg = 'Error: '+Pointer_stringify(errStr);
  
  free(errStr);
  free(regexPtr);
 }

 free(memStr);
 free(errPtr);

 if (result)
 throw msg;
 
 this.regex = HEAP32[regexPtr >> 2];
 free(regexPtr);

 this.region = libonig._onig_region_new();
 this.patternCount = libonig._onig_number_of_captures(this.regex);
 
 //namedhash may contain more than one number
 //the largest ACTIVE is choosen, so we know it
 //only on .exec, when namedPatterns param used
 
 this.namedPatterns = [];
 this.namedHash = {};
 this.namedHash2G = {};
 
 this.longestNamedPattern = 0;

 foreachFunction = function(name, nameEnd, numberOfGroups, numbers, regex, v)
 {
  var nameStr = '';
  for(var t=name;t<nameEnd;t++)
  nameStr += String.fromCharCode(HEAPU8[t]);
  
  if (nameStr.length > _this.longestNamedPattern)
  _this.longestNamedPattern = nameStr.length;
  
  _this.namedPatterns.push(nameStr);
  _this.namedHash[nameStr] = [];
  
  for(var t=0;t<numberOfGroups;t++)
  {
   _this.namedHash[nameStr].push(HEAP32[(numbers >> 2) + t]);
   _this.namedHash2G[HEAP32[(numbers >> 2) + t]] = nameStr;
  }
 };
 libonig._onig_foreach_name(this.regex, foreachWrapper, 0);

 this.namedPatternMem = this.longestNamedPattern ? malloc(this.longestNamedPattern+1) : 0;

 this.strMem = null;
 this.strMemLength = null;
 this.strCached = null;
 this.matchSteps = 0;
 this.cachedStr = null;
};
Onigmo.prototype.cacheExecStr = function(str)
{
 if (str !== this.cachedStr)
 {
  free(this.strMem);
  this.cachedStr = null;
 }
 
 if (str)
 {
  this.cachedStr = str;
  
  if (this.unicode)
  {
   this.strMem = malloc(2*str.length+2);
   stringToUTF16(str, this.strMem);
   this.strMemLength = 2*str.length;
  }
  else
  {
   if (!this.unicode)
   {
    for(var t=0;t<str.length;t++)
    if (str.charCodeAt(t)>255)
    throw 'Non-unicode mode does not support characters whose code is >255, maybe use unicode?';
  
    this.strMem = malloc(str.length+1);
    writeAsciiToMemory(str, this.strMem);
    this.strMemLength = str.length;
   }
  }
 }
};
Onigmo.prototype.exec = function(str)
{
 var startOffset = Math.min(this.lastIndex, str.length)*(this.unicode?2:1);
 var result;
 
 this.cacheExecStr(str);
 
 if (this.sticky)
 result = libonig._onig_match(this.regex, this.strMem, this.strMem+this.strMemLength, this.strMem+startOffset, this.region, 0);
 else
 result = libonig._onig_search(this.regex, this.strMem, this.strMem+this.strMemLength, this.strMem+startOffset, this.strMem+this.strMemLength, this.region, 0);
   
 this.matchSteps = libonig._onig_get_stepcount();
 
 if (result >= 0)
 { 
  var numSet = HEAP32[(this.region >> 2) + 1];
  var ret = [];
  ret.matchSteps = this.matchSteps;
  ret.matchOffsets = [];
  
  var s, e;
  
  for(var t=0;t<numSet || t<this.patternCount;t++)
  {
   if (t>=numSet)
   {
    ret[t] = undefined;
    ret.matchOffsets[2*t] = ret.matchOffsets[2*t+1] = -1;
   }
   else
   {
    s = HEAP32[(HEAP32[(this.region >> 2) + 2] >> 2) + t];
    e = HEAP32[(HEAP32[(this.region >> 2) + 3] >> 2) + t];
    
    //byte offsets, one code unit occupies 2 bytes
    if (this.unicode)
    {
     s = s === -1 ? s : s/2;
     e = e === -1 ? e : e/2;
    }
    
    ret[t] = s !== -1 ? str.substring(s, e) : undefined;
    ret.matchOffsets[2*t] = s;
    ret.matchOffsets[2*t+1] = e;
   }
  }
  
  ret.index = ret.matchOffsets[0];
  this.lastIndex = ret.matchOffsets[1];
  
  if (this.namedPatterns.length)
  {
   ret.namedPatterns = {};
   
   for(var t=0;t<this.namedPatterns.length;t++)
   {
    writeAsciiToMemory(this.namedPatterns[t], this.namedPatternMem);
    ret.namedPatterns[this.namedPatterns[t]] = libonig._onig_name_to_backref_number(this.regex, this.namedPatternMem, 
    this.namedPatternMem+this.namedPatterns[t].length, this.region);
   }
  }
  return ret;
 }
 else if (result === ONIG_MISMATCH)
 {
  return null;
 }
 else
 {
  var errStr = malloc(ONIG_MAX_ERROR_MESSAGE_LEN);
  libonig._onig_error_code_to_str(errStr, result, 0);
  var msg = 'Error: '+Pointer_stringify(errStr);
  free(errStr);
  throw msg;
 }
};
Onigmo.prototype.destroy = function()
{
 if (this.region)
 {
  libonig._onig_region_free(this.region, 1);
  this.region = null;
 }
 
 if (this.regex)
 { 
  libonig._onig_free(this.regex);
  this.regex = null;
 }

 this.cacheExecStr(null);
 
 if (this.namedPatternMem)
 {
  free(this.namedPatternMem);
  this.namedPatternMem = null;
 }
};

return {export: Onigmo};

})());
//# sourceURL=Onigmo.js