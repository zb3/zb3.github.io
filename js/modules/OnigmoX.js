tcLoad('OnigmoX', (function(){

//for tree

var captureNodeFunction = libonig.Runtime.addFunction(function(group)
{
 return 1; //could be optimized, but no time...
});

var historyNodeFunction = null;
var historyNodeWrapper = libonig.Runtime.addFunction(function(group, beg, end, level, at, v)
{
 if (historyNodeFunction)
 return historyNodeFunction(group, beg, end, level, at);
});

var keyNameSymbol = Symbol('key');
var headerGroupNumberSymbol = Symbol('headerGroupNo');
var groupNumberSymbol = Symbol('groupNo');

//helper functions

function parseNestedCharacterClass(str, p)
{
 var nestLevel = 0, firstBracePos;
 while(p<str.length)
 {
  if (str[p] === '[')
  {
   nestLevel++;
   firstBracePos = p;
   p++;
  }
  else if (str[p] === ']')
  {
   if (p !== firstBracePos+1)
   {
    nestLevel--; p++;
    if (!nestLevel)
    break;
   } else p++;
  }
  else if (str[p] === '\\')
  p += 2;
  else p++;
 }
 
 return p;
}

function preprocessSource(str)
{
 var ret = '', startWriteFrom = 0, hasSpecial;
 var specialGroupOptions = [[]], currentGroup = 0;
 var specialGroups = [], specialOptions;
 var tmp, tmp2, p = 0;
 
 if (str.substr(0, 3) === '*u:') //allow unpack option on root
 {
  specialGroupOptions[0].push('u');
  startWriteFrom = p = 3;
 }
 
 while(p<str.length)
 {
  if (str[p] === '\\') p+=2;
  else if (str[p] === '(' && str[p+1] === '?' && str[p+2] === '#')
  {
   //consume the whole comment (coz "(" may be inside)
   tmp = str.substr(p+1).match(/^\?#(\\[^]|[^)])*(\)|$)/);
   p += tmp[0].length+1;
  }
  else if (str[p] === '(')
  {
   p++;
   tmp = str.substr(p);
   
   specialOptions = null;
   
   if (tmp2 = tmp.match(/^(\+|\*([a-z]*):)/))
   {
    specialOptions = [];
   
    if (tmp2[2] && tmp2[2].length)
    specialOptions = tmp2[2].split('');
    
    ret += str.substring(startWriteFrom, p);    
    
    p += tmp2[0].length;
    tmp = str.substr(p);
    
    startWriteFrom = p;    
   }
   
   //only capturing groups can have special bits
   if (str[p] !== '?' || /^\?['<@]/.test(tmp) && !/^\?<[!=]/.test(tmp))
   {
    specialGroupOptions[++currentGroup] = specialOptions;
    if (specialOptions)
    specialGroups.push(currentGroup);
   }
  }
  else if (str[p] === '[') p = parseNestedCharacterClass(str, p);
  else p++;
 }
 
 ret += str.substr(startWriteFrom);
 
 return [ret, specialGroupOptions, specialGroups];
}

var OnigmoX = function(str, flags)
{
 var _this = this;
  
 //support (+stuff) syntax
 var tmp = preprocessSource(str);
 
 this.specialGroupOptions = tmp[1];
 this.specialGroups = this.roots = tmp[2];
 
 if (this.specialGroups.length)
 libonig._onig_set_history_callback(captureNodeFunction);
 
 try
 {
  Onigmo.call(this, tmp[0], flags);
 }
 finally
 {
  libonig._onig_set_history_callback(null);
 }
 
 for(var t=0;t<this.specialGroups.length;t++)
 {
  if (this.specialGroupOptions[this.specialGroups[t]].includes('h'))
  this.namedHash2G[this.specialGroups[t]] = keyNameSymbol;
 }
 
 //symbol may occur multiple times, yet we don't want it to be an array type
 this.namedHash[keyNameSymbol] = [];
 
 //if specialGroups.length
 this.fillGroupsInfo();
};
OnigmoX.prototype = Object.create(Onigmo.prototype);
OnigmoX.prototype.constructor = OnigmoX;
OnigmoX.prototype.fillGroupsInfo = function()
{
//loop, \, watch for [ (with nested)
 //for each group, we'll count nest level
 var childCount = [], p=0;
 for(var t=0;t<=this.patternCount;t++) childCount[t] = 0;
  
 var str = this.source;
 var stack = [0], cgroup = 0, cap;
 var isMultiInstance = [false];
 var groupStructure = [];
 var tmp, tmp2;
 

 while(p<str.length)
 {
  if (str[p] === '\\')
  {
   p+=2;
  }
  else if (str[p] === '(' && str[p+1] === '?' && str[p+2] === '#')
  {
   //consume the whole comment (coz "(" may be inside)
   tmp = str.substr(p+1).match(/^\?#(\\[^]|[^)])*(\)|$)/);
   p += tmp[0].length+1;
  }
  else if (str[p] === '(')
  {
   tmp = str.substr(p+1);
   
   cap = str[p+1] !== '?' || /^\?['<@]/.test(tmp) && !/^\?<[!=]/.test(tmp);
   stack.push(cap ? ++cgroup : 0);
   if (cap)
   {
    groupStructure.push(cgroup);
    childCount[cgroup] = 0;
   }
   p++;
  }
  else if (str[p] === ')')
  {
   if (tmp = stack.pop())
   {
    childCount[stack[stack.length-1]] += childCount[tmp]+1;
    
    isMultiInstance[tmp] = /[{+*]/.test(str[p+1]);
    groupStructure.push(-tmp);
   }
   p++;
  }
  else if (str[p] === '[')
  {
   var nestLevel = 0, firstBracePos;
   while(p<str.length)
   {
    if (str[p] === '[')
    {
     nestLevel++;
     firstBracePos = p;
     p++;
    }
    else if (str[p] === ']')
    {
     if (p !== firstBracePos+1)
     {
      nestLevel--; p++;
      if (!nestLevel)
      break;
     } else p++;
    }
    else if (str[p] === '\\')
    p += 2;
    else p++;
   }
  }
  else p++;
 }
 
 
 //fill tree info
 
 var isArrayGroup = [false];
 var isArrayStack = [false], g;

 for(var t=0;t<groupStructure.length;t++)
 {
  g = groupStructure[t];
  if (g > 0)
  {
   isArrayGroup[g] = false;
   
   if (this.specialGroupOptions[g])
   {
    if (isArrayStack[isArrayStack.length-1] || isMultiInstance[g])
    isArrayGroup[g] = true;
   
    isArrayStack.push(false);
   }
   else isArrayStack.push(isArrayStack[isArrayStack.length-1] || isMultiInstance[g]);
  }
  else
  {
   g = -g;
   isArrayStack.pop();
  }
 }

 
 this.childGroupsCount = childCount;
 this.isMultiInstanceGroup = isMultiInstance;
 this.groupStructure = groupStructure;
 this.isArrayGroup = isArrayGroup;
};
OnigmoX.prototype.execTree = function(str, asOffsets) //keyCallback?
{
 var base, _this = this;
 
 if (this.specialGroups.length)
 libonig._onig_set_history_callback(captureNodeFunction);
 
 try
 {
  base = this.exec(str);
 }
 finally
 {
  libonig._onig_set_history_callback(null);
 }
 
 if (!base) return base;
 
 var ret = {}, objectStack = [{obj: ret, group: 0, convertObj: null, convertProp: null, arrayKeys: {}}], top, key, isNotLeaf, convertObj, convertProp; //obj,lvl

 objectStack[0].obj[groupNumberSymbol] = 0;
 
 var tmp;
 /* 
 
 var p = new OnigmoX('(+((*hn:[a-z]+): )((+?<values>[a-z]+(<\\g<0>)?),?)+;?)+', '', 1);
 p.execTree('lol: mao,tao<lol: mao,tao,lao;wowo: lele,pepe,fafa,lao;wowo: lele,pepe,fafa')
 
 INI example, very easy to read and understand:
 var p = new OnigmoX('*u:(+(?<misc>(^;.*(\\n|$))|\\n*)++\\[(*h:[^\\]]+)]\\n(+\\g<misc>*+(*h:[^\\[\\n\\s=]*)\\s*=\\s*(+.*)\\n?)*)+', 'm', 1);
 
 + - mark as included, without any options
 
 or you can use the following:
 
 *c: - add .content (forces object, doesn't work on headers)
 *o: - force object (without content)
 *a: - force array. in most cases, this is automatically added when a quantifier is detected
       so it's only needed for duplicate named groups and quantifiers on subexp calls
 *n: - never create arrays - store only the last result
 *u: - if we have only one key, unpack it (you can specify this on root too)
 *j: - if it's an array of strings, join them
 
 *h: - this is a header
 
 header options:
 *m: - if only one group is there other than header, dont "unpack" it
 *d: - always put keys in array even if no duplicates
 *n: - never put keys in array, remember only last key
 
 useful trick:
 *u:(+(?:[^]*?)...regex here...)+ - if you want to merge matches (which let's you support headers on root)
 */
 historyNodeFunction = function(group, beg, end, lvl, at)
 {
  if (!group || !_this.specialGroupOptions[group]) return;

  isNotLeaf = _this.specialGroupOptions[group].includes('c')  //we want .content
           || _this.specialGroupOptions[group].includes('o'); //or force object
           
  //or for header we should check o flag of parent?
  //no, the only group may be an object and still
  //we'd not want it
  
  if (at === 2)
  {
   tmp = objectStack.pop();
   return 0;
  }
  
  top = objectStack[objectStack.length-1];
  
  //convert it to object, if we need to
  //this looses content, so use the c flag to preserve it
  if (top.convertObj)
  {
   top.obj = top.convertObj[top.convertProp] = {};
   top.obj[groupNumberSymbol] = top.group;
   top.convertObj = null; //mark as converted
  }
   
  //we use absolute group numbers in case the name is not provided
  key = _this.namedHash2G[group] ? _this.namedHash2G[group] : group;

  if (isNotLeaf)
  {
   tmp = {};
   tmp[groupNumberSymbol] = group;
   
   if (_this.specialGroupOptions[group].includes('c'))
   tmp.content = !asOffsets ? str.substring(beg, end) : [beg, end];
  }
  else
  {
   tmp = !asOffsets || typeof key === 'symbol' ? str.substring(beg, end) : [beg, end];
  }
  
  //either we want it to be an array or we have to make it an array
  if (!top.arrayKeys[key] && !_this.specialGroupOptions[group].includes('n') && !_this.specialGroupOptions[group].includes('h') && (top.obj[key] !== undefined
      || (top.obj[key] === undefined  && (_this.isArrayGroup[group] || _this.specialGroupOptions[group].includes('a')))))
  {
   top.obj[key] = top.obj[key] !== undefined ? [top.obj[key]] : [];
   top.arrayKeys[key] = true;
   
   if (_this.specialGroupOptions[group].includes('j'))
   top.obj[key].wantJoin = true;
  }


  if (top.arrayKeys[key])
  {
   top.obj[key].push(tmp);
   
   convertObj = top.obj[key];
   convertProp = convertObj.length-1;
  }
  else
  {
   top.obj[key] = tmp;
   
   if (typeof key === 'symbol') //yeah, I've used symbols :O
   top.obj[headerGroupNumberSymbol] = group;
   
   convertObj = top.obj;
   convertProp = key;
  }
  
  objectStack.push({obj: tmp, group: group, convertObj: isNotLeaf?null:convertObj, convertProp: convertProp, arrayKeys: {}});

  
  return 0;
 };
 libonig._onig_capture_tree_traverse(this.region, 3, historyNodeWrapper, 0);
 
 ret = this._processTreeKeys(ret);
 
 return {base: base, tree: ret};
};
OnigmoX.prototype._processTreeKeys = function(tree)
{
 /*
 if we have array then what?
 obj.headers[0][keyNameSymbol]='sth'
 obj.headers[0]["0"] = 'val'
 obj.headers.sth = 'val';
 
 obj.headers[0][keyNameSymbol]='sth'
 obj.headers[0]["0"] = 'val'
 obj.headers[0]["1"] = 'val1'
 obj.headers.sth = {"0": 'val', "1": 'val1'};
 */

 var stack = [{obj: tree, arr: Array.isArray(tree), keys: Object.keys(tree), current: 0, nkeys: [], pkey: null, keysArray: {}}], top, current, node, key, nval, group, tmp, modified;
 
 while(stack.length)
 {
  top = stack[stack.length-1];
  
  if (top.current === (top.arr ? top.obj.length : top.keys.length))
  {
   node = stack.pop();
   modified = false;
   
   if (node.nkeys.length)
   {
    if (node.arr) //destroy the array.. will produce hollow keys...
    {
     nval = {};
     Object.assign(nval, node.obj);
     node.obj = nval;
    
     modified = true;
    }
    
    for(var t=0;t<node.nkeys.length;t++)
    {
     if (node.obj[node.nkeys[t][1]] === undefined && node.nkeys[t][3]) //if we always want array
     {
      node.obj[node.nkeys[t][1]] = [];
      node.keysArray[node.nkeys[t][1]] = true;
     }
     else if (!node.keysArray[node.nkeys[t][1]] && node.obj[node.nkeys[t][1]] !== undefined && !node.nkeys[t][2]) //if we need array...
     {
      node.obj[node.nkeys[t][1]] = [node.obj[node.nkeys[t][1]]];
      node.keysArray[node.nkeys[t][1]] = true;
     }
     
     if (node.keysArray[node.nkeys[t][1]])
     node.obj[node.nkeys[t][1]].push(node.obj[node.nkeys[t][0]]);
     else
     node.obj[node.nkeys[t][1]] = node.obj[node.nkeys[t][0]];

     delete node.obj[node.nkeys[t][0]];
    }
   }
   
   if (node.obj[groupNumberSymbol] !== undefined && (tmp = Object.keys(node.obj)).length === 1 && this.specialGroupOptions[node.obj[groupNumberSymbol]].includes('u'))
   {
    node.obj = node.obj[tmp[0]];
    modified = true;
   }
   
   if (Array.isArray(node.obj) && node.obj.wantJoin && typeof node.obj[0] === 'string')
   {
    node.obj = node.obj.join('');
    modified = true;
   }
   
   if (modified)
   {
    if (node.pkey !== null)
    stack[stack.length-1].obj[node.pkey] = node.obj;
    else tree = node.obj;
   }
   
   continue;
  }
  
  current = top.current++;
  node = top.obj[top.arr?current:top.keys[current]];
  
  if (typeof node === 'object' && node && (node.length !== 2 || typeof node[0] !== 'number' || typeof node[1] !== 'number'))
  {
   if (node[keyNameSymbol] !== undefined)
   {
    key = node[keyNameSymbol];
    group = node[headerGroupNumberSymbol];
    
    delete node[keyNameSymbol];
    
    if (Object.keys(node).length === 1 && !(this.specialGroupOptions[group].includes('m')))
    {
     node = top.obj[top.arr?current:top.keys[current]] = node[Object.keys(node)[0]];
    }

    top.nkeys.push([top.arr?current:top.keys[current], key, this.specialGroupOptions[group].includes('n'), this.specialGroupOptions[group].includes('d')]); 
   }

   //step into
   if (node !== null)
   stack.push({obj: node, arr: Array.isArray(node), keys: Array.isArray(node) ? null : Object.keys(node), current: 0, nkeys: [], pkey: top.arr?current:top.keys[current], keysArray: {}});
  }
 }

 return tree;
};

//old version that cares about root only, not it's parents
OnigmoX.prototype.execRootedV1 = function(str)
{
 //root must not be recursive - it may be inside recursion or contain recursion
 //but not involving itself
 
 //in case of recursion - we provide original subgroup offsets
 
 var baseReturn;

 libonig._onig_set_history_callback(captureNodeFunction);
 
 try
 {
  baseReturn = this.exec(str);
 }
 finally
 {
  libonig._onig_set_history_callback(null);
 }
 
 if (!baseReturn) return baseReturn;
 
 
 var ret = baseReturn, nret;
 var rootedResults = [];
 
 var _this = this, match = null; 
 /*
 since the pattern may not recurse, then tres is basically useless
 it's never more than 1 
 */

 var baseLvl;
 var groupLevelStack, isInRecursion;
 
 historyNodeFunction = function(group, beg, end, lvl)
 {  
  if (match && match[3] === lvl)
  {
   fillResults(match);
   match = null;
  }
  if (_this.specialGroups.indexOf(group) > -1 && !match)
  {
   groupLevelStack = []; isInRecursion = false;
   match = [group, beg, end, lvl, {}];
   baseLvl = lvl;
  }
  else if (match && lvl>match[3])
  {
   if (!isInRecursion)
   match[4][group] = [beg, end];
   
   while(groupLevelStack.length && lvl-baseLvl <= groupLevelStack.length)
   {
    if (groupLevelStack.indexOf(groupLevelStack[groupLevelStack.length-1]) !== groupLevelStack[groupLevelStack.length-1])
    isInRecursion = Math.max(isInRecursion-1, 0);
    
    groupLevelStack.pop();
   }
   
   if (groupLevelStack.length && groupLevelStack.indexOf(group) !== -1)
   isInRecursion++;
   
   groupLevelStack.push(group);
  }
         
  return 0;
 };
 
 libonig._onig_capture_tree_traverse(this.region, 1, historyNodeWrapper, 0);
 if (match) historyNodeFunction(null, 0, 0, match[3]); //detect end
 
 
 function fillResults(entry)
 {
  var group = entry[0];
   //fill with base
  nret = baseReturn.slice();
  nret.matchOffsets = baseReturn.matchOffsets.slice();
  nret.namedPatterns = JSON.parse(JSON.stringify(baseReturn.namedPatterns)); //not very optimal
  
  //update main match
  nret[0] = str.substring(entry[1], entry[2]);
  nret.matchOffsets[0] = entry[1];
  nret.matchOffsets[1] = entry[2];
  nret.index = entry[1];
  
  //update child groups - potentially unsetting it
  for(var x=0,g;x<_this.childGroupsCount[group];x++)
  {
   g=x+group+1;

   nret.matchOffsets[2*g] = entry[4][g] === undefined ? -1 : entry[4][g][0];
   nret.matchOffsets[2*g+1] = entry[4][g] === undefined ? -1 : entry[4][g][1];
   nret[g] = nret.matchOffsets[2*g] === -1 ? undefined : str.substring(nret.matchOffsets[2*g], nret.matchOffsets[2*g+1]);
  }
  
  nret.groupNo = group;
  
  
  if (_this.namedPatterns.length)
  {
   //1st pass - fill last active names
   var filledNames = {};
   
   for(var t=_this.childGroupsCount[group];t>0;t--)
   {
    g = group+t;
    if (_this.namedHash2G[g] && !filledNames[_this.namedHash2G[g]] && nret.matchOffsets[2*g] !== -1)
    {
     nret.namedPatterns[_this.namedHash2G[g]] = g;
     filledNames[_this.namedHash2G[g]] = true;
    }
   }
  
   //2nd pass - fill last inactive name
   for(var t=_this.childGroupsCount[group];t>0;t--)
   {
    g = group+t;
    if (_this.namedHash2G[g] && !filledNames[_this.namedHash2G[g]])
    {
     nret.namedPatterns[_this.namedHash2G[g]] = g;
     filledNames[_this.namedHash2G[g]] = true;
    }
   }
  }
  
  rootedResults.push(nret);
 }
 
 ret.rootedResults = rootedResults;
 
 return ret;
};


/*
some tests...

var p = new OnigmoX('((.)v\\g<1>?(+c))', '', 1);
JSON.stringify(p.execRooted('avbvfvccc').rootedResults) === '[["c","fvc","f","c"],["c","bvfvcc","b","c"],["c","avbvfvccc","a","c"]]'
var p = new OnigmoX('(\\d)+fgh((3)?(+b)(5)?)+ty(\\d)+', '', 1);
JSON.stringify(p.execRooted('127fgh3bb5ty56').rootedResults) === '[["b","7","3b","3","b",null,"6"],["b","7","b5",null,"b","5","6"]]'
var p = new OnigmoX('(\\d)+fgh((?<p>6)?(+b)(?<p>8)?)+ty(\\d)+', '', 1);
var r = p.execRooted('127fgh6bb8bty56').rootedResults;
r.length === 3
r[0].namedPatterns.p === 3 && r[1].namedPatterns.p === 5 && r[2].namedPatterns.p === 5
var p = new OnigmoX('^(+(?<a>1)?(?<b>2)?(?<b>3)?(?<a>4)?)(?<b>8)$', '', 1);
p.execRooted('148').namedPatterns === '{"a":5,"b":4}'
*/

/*
  -> we're not filling -1's if the group is outside parent like called by subexp (solution: wrapper)
  -> we're filling stuff with undefined - in reality if something is not matched, it's not filled at all
  this includes old iterations of loops for root elements
  
  this helps us speed stuff up.... 
  -> we're filling stuff that happend after match, so we may overwrite in case of subexp (solution: wrapper)
  
  ---
  
  on the regex engine side, we could change how conditions work...
  empty is still a match - we could change it
        if ((mem > num_mem) ||
	  (mem_end_stk[mem]   == INVALID_STACK_INDEX) ||
	  (mem_start_stk[mem] == INVALID_STACK_INDEX) || (mem_start_stk[mem] == mem_end_stk[mem])) {

  note that this isn't free as we're no longer able to test if assertion was met
  unfortunately we weren't able to do it for loops anyway
*/
OnigmoX.prototype.execRooted = function(str)
{
 //root must not be recursive - it may be inside recursion or contain recursion
 //but not involving itself
 
 //in case of recursion - we provide original subgroup offsets
 
 var baseReturn;

 libonig._onig_set_history_callback(captureNodeFunction);
 
 try
 {
  baseReturn = this.exec(str);
 }
 finally
 {
  libonig._onig_set_history_callback(null);
 }
 
 if (!baseReturn) return baseReturn;
 
 var _this = this, ret = baseReturn;
 var matches = [], parentGroupsStack = [], parentIdxStack = [], currentParentGroups = [], currentParentIdx = [];
 var rootedResults = [];
 
 historyNodeFunction = function(group, beg, end, lvl, at)
 {
  if (at === 1)
  {
   matches.push([group, beg, end, lvl, -1]);
   currentParentGroups.push(group);
   currentParentIdx.push(matches.length-1);
   parentGroupsStack.push(currentParentGroups.slice());
   parentIdxStack.push(currentParentIdx.slice());
  }
  else
  {
   if (group !== currentParentGroups.pop()) throw 'invalid tree traversal';
   matches[currentParentIdx.pop()][4] = matches.length;
  }
 };
 
 libonig._onig_capture_tree_traverse(this.region, 3, historyNodeWrapper, 0);

 //note that roots may not be nested, obviously
 for(var t=0;t<matches.length;t++)
 {
  if (_this.specialGroups.indexOf(matches[t][0]) > -1)
  {
   match = matches[t];
   
   nret = baseReturn.slice();
   nret.matchOffsets = baseReturn.matchOffsets.slice();
   
   //update main match
   nret[0] = str.substring(match[1], match[2]);
   nret.matchOffsets[0] = match[1];
   nret.matchOffsets[1] = match[2];
   nret.index = match[1];
   nret.groupNo = match[0];
   nret.namedPatterns = {};

   rootedResults.push(nret);

   var childrenFilled = [], namesFilled = [];

   for(var p = parentIdxStack[t].length-1;p>=0;p--)
   {
    fillGroup(parentIdxStack[t][p], nret, childrenFilled, namesFilled);
   }

   t = match[4]-1;
  }
 }

 function fillGroup2(group, start, end, result)
 {
  result.matchOffsets[2*group] = start;
  result.matchOffsets[2*group+1] = end;
  result[group] = start === -1 ? undefined : str.substring(start, end);
 }
 
 function fillGroup(idx, result, filledGroups, filledNames)
 {
  //we iterate, but: if we encounter recursion from idx, don't write it
  //if we encounter a filled group, skip it
  //in this version, we should fill self
  
  var recursionStartIdx = parentGroupsStack[idx].length-1;
  var group = matches[idx][0];
  /*
  note that filledmask must be updated after the loop,
  because we want to capture last iteration of a loop
  we loop forward because we need to detect recursion
  */
  var g, b, e, filledNow = [];
  
  for(var t=idx;t<matches[idx][4];t++)
  {
   if (filledGroups[matches[t][0]] || parentGroupsStack[t].indexOf(parentGroupsStack[t][parentGroupsStack[t].length-1], recursionStartIdx) !== parentGroupsStack[t].length-1) //skip if filled or recursion
   {
    t = matches[t][4]-1;
    continue;
   }
      
   g = matches[t][0]; b = matches[t][1]; e = matches[t][2];
   filledNow.push(g);
   
   if (!g) //dont fill group 0 data - it's for the root
   continue;
   
   fillGroup2(g, b, e, result);
  }
  
  for(var t=0;t<filledNow.length;t++) //ehh, filledNow may contain duplicates
  filledGroups[filledNow[t]] = true;
  
  //fill those that were not present, but should be
  for(var t=0;t<_this.childGroupsCount[group];t++)
  {
   g = group+t+1;
   
   if (!filledGroups[g])
   {
    fillGroup2(g, -1, -1, result);
    filledGroups[g] = true;
   }
  }

  
  if (_this.namedPatterns.length)
  {
   //1st pass - fill last active names
   for(var t=_this.childGroupsCount[group];t>0;t--)
   {
    g = group+t;
    if (_this.namedHash2G[g] && !filledNames[_this.namedHash2G[g]] && result.matchOffsets[2*g] !== -1)
    {
     result.namedPatterns[_this.namedHash2G[g]] = g;
     filledNames[_this.namedHash2G[g]] = true;
    }
   }
  
   //2nd pass - fill last inactive name
   for(var t=_this.childGroupsCount[group];t>0;t--)
   {
    g = group+t;
    if (_this.namedHash2G[g] && !filledNames[_this.namedHash2G[g]])
    {
     result.namedPatterns[_this.namedHash2G[g]] = g;
     filledNames[_this.namedHash2G[g]] = true;
    }
   }
  }
 }
 
 ret.rootedResults = rootedResults;
 return ret;
};


return {export: OnigmoX};

})());
//# sourceURL=OnigmoX.js