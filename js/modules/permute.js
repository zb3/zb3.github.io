function nextPermutation(arr, len) //n-length work for multiset too?
{
 var p, k, t;

 if (len) //this assumes that it was sorted!
 {
  t = len; k = arr.length-1;
  while(t<k)
  {
   p = arr[t];
   arr[t] = arr[k];
   arr[k] = p;
   t++; k--;
  }
 }
 p = arr.length-2;

 while(p>=0 && arr[p]>=arr[p+1]) p--;
 if (p<0) return false;

 for(t=p+1,k=t;t<arr.length;t++)
 if (arr[t]>arr[p] && arr[t]<=arr[k])
 k = t;

 t = arr[p];
 arr[p] = arr[k];
 arr[k] = t;

 t = p+1; k = arr.length-1;
 while(t<k)
 {
  p = arr[t];
  arr[t] = arr[k];
  arr[k] = p;
  t++; k--;
 }
 return arr;
}

function nextCombination(base, arr, n, multiple, sum)
{
 var t, p = arr.length-1, dsum;

 if (!sum)
 for(t=sum=0;t<=p;t++) sum += arr[t];

 dsum = sum;
 while(p>=0)
 {
  t = 1; //normally we increase by one
  
  //for multisets
  while(dsum+t<n && base[dsum+t-1]===base[dsum+t])
  t++;
  
  if (sum+t<n)
  {
   sum += t;
   arr[p] += t;
   nextCombination.sum = sum;
   return arr;
  }
  else
  {
   dsum -= arr[p];
   t = multiple?0:1;
   sum -= arr[p]-t;
   arr[p] = t;
   p--;
  }
 }
 return false;
}

function findCombinations(base, k, multiple, print, start, skip, max)
{
 var t, arr = [], sum, x;

 if (start) arr = start.slice();
 else
 {
  arr[0] = 0;
  for(t=1;t<k;t++)
  sum += arr[t] = multiple?0:1;
 }

 if (multiple)
 {
  var nbase = [base[0]];
  for(t=1;t<base.length;t++)
  if (base[t]!=base[t-1])
  nbase.push(base[t]);

  base = nbase;
 }

 while(true)
 {
  x = 0;

  if (!(skip-->0))
  {
   for(t=0;t<k;t++)
   print(base[x += arr[t]]);
   print('newline');
   if ((--max)===0)
   break;
  }

  if (!nextCombination(base, arr, base.length, multiple, sum))
  break;
  
  sum = nextCombination.sum;
 }
}

function decodeCombination(c, base, multi)
{
 //we need base. think of multisets
 var x = 0, arr = [];
 if (multi) base = u(base);

 for(var t=0;t<c.length;t++)
 {
  arr.push(base.indexOf(c[t]));

  if (!multi && t && arr[arr.length-1]<=arr[arr.length-2])
  arr[arr.length-1] = arr[arr.length-2] + 1;
 }
 for(var t=1,x=0;t<arr.length;t++)
 {
  x += arr[t-1];
  arr[t] -= x;
 }
 return arr;
}


function nextBase(base, arr, n)
{
 if (!n) n = 2;

 var p = arr.length;
 while(p--)
 {
  if (arr[p] < n-1 && (!p || !base || base[p]!==base[p-1] || arr[p-1]===1))
  {
   arr[p]++;
   break;
  }
  else if (arr[p] === n-1)
  {
   if (!p) return false;
   arr[p] = 0; 
  }
 }
 return arr;
}


function minusArr(arr, rem)
{
 var t, fe, p = arr.length, pp;

 big:while(p--)
 {
  pp = arr[p].length;
  for(t=0,fe=-1;t<rem.length;t++)
  {
   if (arr[p][t]) {fe=t; break;}
  }
 
  while(pp--)
  {
   if (arr[p][pp]>0)
   {
    arr[p][pp]--;
    rem[pp]++;
    
    if (!arr[p][pp])
    {
     if (fe!==pp)
     {
      for(pp=0;pp<arr[p].length;pp++)
      if (arr[p][pp]) break big;
     }
 
     for(pp=0;pp<arr[p].length;pp++)
     rem[pp] += arr[p][pp];
 
     arr.length--;
     break;
    }
    break big;
   }
   else if (pp)
   {
    arr[p][pp] = rem[pp];
    rem[pp] = 0;
   }
  }
 }
 return arr.length;
}

function nextPartition(div, arr, max, min)
{
 var t, p = arr.length, pp;

 if (!p)
 {
  arr.push(div.slice());
  if (min && min>1)
  {
   p = arr.length;
  } else return arr;
 }

 //remaining array. initially 0 as arr must be proper partition
 var rem = [], ff;
 for(t=0;t<div.length;t++) rem[t] = 0;
 
 if (max && arr.length===max) //partition into no more than this
 {
  for(pp=0;pp<arr[p-1].length;pp++)
  rem[pp] += arr[p-1][pp];

  arr.length--;
  p--;
 }

 bloop: while(true)
 {
  minusArr(arr, rem);
  if (!arr.length) return false;

  if (min)
  {
   while(min && asum(rem)<min-arr.length && minusArr(arr, rem));
   if (!arr.length) return false;
  }
 
  var equal = true, nz = true;
  var ln = arr.length; //max
 
  while(nz) //rem must have something now
  {
   equal = true; nz = false; nel = [];
   for(t=0;t<arr[0].length;t++)
   {
    if (equal && arr[arr.length-1][t]<rem[t])
    {
     nel[t] = arr[arr.length-1][t];
     rem[t] -= nel[t];
    }
    else
    {
     nel[t] = rem[t]; 
     rem[t] -= nel[t];
    }
    equal = equal && arr[arr.length-1][t]===nel[t];
    nz = nz || rem[t];
   }
   arr.push(nel);
   
   if (max && arr.length>max)
   {
    for(t=arr.length-1;t>=ln;t--)
    {
     for(pp=0;pp<arr[t].length;pp++)
     rem[pp] += arr[t][pp];
 
     arr.length--;
    }
    p = arr.length;
    continue bloop;
   }
  }

  if (min && arr.length<min)
  continue;

  break;
 }
 return arr;
}


/*
function checkCnt(v, max, min)
{
 var cnt = 0, arr = [v.slice()];
 while(nextPartition(v, arr, max, min)) 
{
// console.log(JSON.stringify(arr));
cnt++;

}
 return cnt;
}
function checkCntNonSlice(v, max, min)
{
 var cnt = 0, arr = [v.slice()];
 while(nextPartition(v, arr)) 
{
if ((!max || arr.length<=max) && (!min || arr.length>=min))
{
 //console.log(JSON.stringify(arr));
 cnt++;
}
}
 return cnt;
}
function checkUniq(l, max)
{
 var v = [];
 for(t=0;t<l;t++)
 v.push(1);

 var cnt = 0, arr = [v.slice()];
 var t, hash = {};

 while(nextPartition(v, arr)) 
 {
  t = mapPartition(l, arr);
  if (t.length>max)continue;
  t.sort();
  t = JSON.stringify(t);
  if (!hash[t])
  {
   cnt++;
   hash[t] = 1;
  }
 }
 return cnt;
}
//this wont be used for printing coz it would be slow (or fck it)
function mapPartition(l, partition)
{
 var t, tt, ttt, n, ret = [];
 for(t=0;t<partition.length;t++)
 {
  n = [];
  for(tt=0;tt<partition[t].length;tt++)
  for(ttt=0;ttt<partition[t][tt];ttt++)
  n.push(tt);
  ret.push(n);
 }
 return ret;
}
*/
function findPermutations(arr, n, print, skip, max)
{
 var t;

 while(true)
 {
  if (!(skip-->0))
  {
   for(t=0;t<n;t++)
   print(arr[t]);
   print('newline');
   if ((--max)===0)
   break;
  }

  if (!nextPermutation(arr, arr.length===n?0:n))
  break;
 }
}
function findSubsets(base, first, print, skip, max)
{
 var t, arr = [];

 if (!first)
 {
  for(t=0;t<base.length;t++)
  arr[t] = 0;
 }

 while(true)
 {
  if (first)
  {
   arr = first;
   first = null;
  }
  else if (!nextBase(base, arr))
  break;

  if (!(skip-->0))
  {
   for(t=0;t<base.length;t++)
   if (arr[t])
   print(base[t]);

   print('newline');
   if ((--max)===0)
   break;
  }
 }
}
function findVariations(m, arr, print, n, skip, max)
{
 var t, arr;

 if (!n) n = m;

 if (!arr)
 {
  arr = [];
  for(t=0;t<n;t++)
  arr[t] = 0;
 }

 while(true)
 {
  if (!(skip-->0))
  {
   for(t=0;t<n;t++)
   print(arr[t]);

   print('newline');
   if ((--max)===0)
   break;
  }
  if (!nextBase(null, arr, m))
  break;
 }
}

function findPartitions(print, multiset, min, max, skip, maxr, first)
{

 var t, v = [], map = [], arr = [];
 for(t=0;t<multiset.length;t++)
 {
  if (!t || multiset[t]!==multiset[t-1])
  v.push(1);
  else v[v.length-1]++;
 }

 while(true) 
 {
  if (first)
  {
   arr = first;
   first = null;
  }
  else if (!nextPartition(v, arr, max, min)) break;

  if (!(skip-->0))
  {
   for(t=0;t<arr.length;t++)
   {
    for(t2=0;t2<arr[t].length;t2++)
    {
     for(t4=0;t4<arr[t][t2];t4++)
     print(t2);
    }
    print('separator');
   }
   print('newline');
   if ((--maxr)===0)
   break;
  }
 }
}
function decodePartition(n, partition)
{
 var t, t2, ret = [], tv;
 for(t=0;t<partition.length;t++)
 {
  tv = [];
  for(t2=0;t2<n;t2++)
  {
   tv.push(partition[t].indexOf(t2)!==-1?(partition[t].lastIndexOf(t2)-partition[t].indexOf(t2)+1):0); 
  }
  ret.push(tv);
 }
 return ret;
}
function decodeSubset(base, arr)
{
 var ret = [], t, tx;
 for(t=0;t<base.length;t++)
 {
  tx = arr.indexOf(base[t]);
  ret[t] = tx==-1?0:1;
  if (tx!==-1)
  arr[tx] = -1;
 }
 return ret;
}
function decodeVariation(base, arr)
{
 var ret = [], t, tx;
 for(t=0;t<base.length;t++)
 {
  tx = arr.indexOf(base[t]);
  ret[t] = tx==-1?0:1;
  if (tx!==-1)
  arr[tx] = -1;
 }
 return ret;
}

function readFirst(map, str, comma, multiple)
{
 var ret = [];
 if (multiple)
 {
  var x = str.split(' ');
  for(var t=0;t<x.length;t++)
  ret.push(readFirst(map, x[t], comma));
 }
 else
 {
  if (comma) str = str.split(',');
  for(var t=0;t<str.length;t++)
  ret.push(map.indexOf(str[t]));
 }
 return ret;
}
function perm(type)
{
 var t, tt, npt = document.getElementById('permute-input').value, amap = [];
 var comma = document.getElementById('permute-comma').checked;
 amap = npt.split(comma?',':'');
 var out = document.getElementById('permutatearea');
 out.value = '';
 var arr = [], map = amap.slice();

 for(t=0;t<map.length;t++)
 {
  tt = map.indexOf(map[t]);
  if (tt!=t)
  map.splice(t--, 1);
 }

 for(t=0;t<amap.length;t++)
 {
  tt = map.indexOf(amap[t]);
  arr.push(tt);
 }

 arr.sort(function(a,b){return a-b});
 var uniq = u(arr);

 var startfrom = document.getElementById('permute-startfrom').value;
 if (startfrom)
 startfrom = readFirst(map, startfrom, comma, type===0);

 var skipfirst = parseInt(document.getElementById('permute-skip-first').value) || 0;
 var maxitems = parseInt(document.getElementById('permute-limit-items').value) || 0;
//maybe not out.value += but str

 var count = 0, wasnew = true;
 var str = '';
 function print1(what)
 {
  if (what==='newline')
  {
   wasnew = true;
   count++;
  }
  else
  {
   if (wasnew && str) str += '\n';
   if (what==='separator')
   str += ' ';
  
   if (typeof what === 'number')
   {
    if ((comma) && !wasnew)
    str += ',';
   
    str += amap[what];
   }
   wasnew = false;
  }
 }

 if (type<8) //use printing protocol, show items: [] line
 {
  if (type===1)
  {
   var tarr;
   if (startfrom) tarr = startfrom;
   else tarr = arr.slice();
   var len = parseInt(document.getElementById('permute-max-length').value);
   if (isNaN(len)) len = tarr.length;

   findPermutations(tarr, len, print1, skipfirst, maxitems);
  }
  else if (type===2 || type===3)
  {
   if (startfrom)
   startfrom = decodeCombination(startfrom, arr, type===3);

   findCombinations(arr, parseInt(document.getElementById('permute-comb-length').value) || 1, type===3, print1, startfrom, skipfirst, maxitems)
  }
  else if (type===4)
  {
   if (startfrom)
   startfrom = decodeSubset(arr, startfrom);
   findSubsets(arr, startfrom?startfrom:null, print1, skipfirst, maxitems);
  }
  else if (type===5)
  {
   findVariations(uniq.length, startfrom?startfrom:null, print1, parseInt(document.getElementById('permute-max-length').value) || 0, skipfirst, maxitems)
  }
  else if (type===0)
  {
   if (startfrom)
   startfrom = decodePartition(uniq.length, startfrom);

   findPartitions(print1, arr, parseInt(document.getElementById('permute-sp-min').value) || 0, parseInt(document.getElementById('permute-sp-max').value) || 0, skipfirst, maxitems, startfrom);
  }
 }

 out.value = str;
 document.getElementById('items-generated').textContent = count;
}

function _minsum(nmin, arr, k4, allowed, bgst, min, adx)
{
 if (!nmin || nmin-arr.length<=0) return 0;
 var remaining = nmin-arr.length;

 if (!k4) return remaining*min;

 //q1: do we have enough elements?
 if (!allowed && (bgst-min+1)<remaining) return Infinity;
 if (allowed && (allowed.length-adx)<remaining) return Infinity;

 //q2: if we do, is the sum ok?
 var maxelement = min+remaining-1;
 return (maxelement*(maxelement+1)-min*(min-1))/2;
}
function _maxsum(nmax, arr, min, bgst, k4)
{
 if (nmax && nmax-arr.length<=0) return 0;
 var remaining = nmax-arr.length;

 if (k4)
 {
  var minelement = min;

  if (nmax)
  minelement = Math.max(minelement, bgst-remaining+1);

  return (bgst*(bgst+1)-minelement*(minelement-1))/2;
 }
 else
 {
  if (!nmax) return Infinity;
  else return (nmax-arr.length)*bgst;
 }
}

function nextNPartition(number, arr, allowed, amin, amax, nmin, nmax, k4)
{
 var p = arr && arr.length || 1, t, sum = 0, bgst = amax || number, min = amin || 1, adx;

 if (allowed)
 bgst = allowed[0];

 if (allowed)
 min = allowed[allowed.length-1];

 if (!arr) arr = [];
 if (!arr.length) arr[0] = number+1;
 if (arr[0]>bgst) arr[0] = bgst+1;
 
 for(t=0;t<p;t++)
 sum += arr[t];

 bigwhile:while(true)
 {
  p = arr.length;

  while(p--) //minusing will happen here
  {
   if (arr[p]>min && (sum!==number || !nmax || (p+1<nmax)))
   {
    sum -= arr[p];

    if (allowed)
    arr[p] = allowed[allowed.indexOf(arr[p])+1];
    else arr[p]--;

    sum += arr[p];
    break;
   }
   else
   {
    sum -= arr[p];
    arr.length--;
   }
  } 
  if (p === -1) return false;

  bgst = arr[p];
  if (allowed)
  adx = allowed.indexOf(bgst);

  //pruning
  if (_minsum(nmin, arr, k4, allowed, bgst, min, adx)>number-sum) continue bigwhile;
  if (_maxsum(nmax, arr, min, bgst, k4)<number-sum) continue bigwhile;

  while(sum<number && (!nmax || arr.length<nmax))
  {
   if (sum+bgst>number)
   {
    if (allowed)
    {
     bgst = 0;

     for(t=adx;t<allowed.length;t++)
     if (sum+allowed[t]<=number)
     {
      bgst = (t<allowed.length)?allowed[t]:0;
      adx = t;
      break;
     }
    }
    else bgst = number-sum;
    if (bgst<min) continue bigwhile;
   }

   arr.push(bgst);
   sum += bgst;

   if (k4 && arr.length>1 && bgst===arr[arr.length-2]) continue bigwhile;
   if (_minsum(nmin, arr, k4, allowed, bgst, min, adx)>number-sum) continue bigwhile;
  }

  if (sum !== number) continue; //real check for nmax
  if (arr.length < nmin) continue; //real check for nmin
  break;
 }
 return arr;
}
function switchPermuteTabs(idx)
{
 var buttons = document.querySelectorAll('.permute-modetab-container button');
 for(var t=0;t<buttons.length;t++)
 {
  document.getElementById('permute-t'+t).style.display = idx===t?'block':'none';
  buttons[t].classList[idx===t?'add':'remove']('active');
 }
 document.getElementById('permute-startfrom').value = '';
}
function numberPartSwitchAllowed(el)
{
 document.getElementById('permute-numberpart-tset').style.display = el.checked?'block':'none';
 document.getElementById('permute-numberpart-tlimit').style.display = el.checked?'none':'block';
}
function numberpart()
{
 var t, number = parseInt(document.getElementById('permute-numberpart-number').value) || 1;
 document.getElementById('permute-numberpart-number').value = number;

 var allowed = null, amin = 0, amax = 0;
 if (document.getElementById('permute-numberpart-allowed').checked)
 {
  allowed = document.getElementById('permute-numberpart-allowedterms').value.replace(/[^0-9,]/g, '').split(',');
  for(t=0;t<allowed.length;t++)
  {
   allowed[t] = parseInt(allowed[t]);
   if (isNaN(allowed[t]))
   allowed.splice(t--, 1);
  }

  if (!allowed.length) allowed[0] = number;

  allowed = u(allowed);
  allowed.sort(function(a,b){return b-a;});

  document.getElementById('permute-numberpart-allowed').value = allowed.join(',');
 }
 else
 {
  amin = parseInt(document.getElementById('permute-numberpart-amin').value) || 0;
  amax = parseInt(document.getElementById('permute-numberpart-amax').value) || 0;
 }
 var nmin = parseInt(document.getElementById('permute-numberpart-nmin').value) || 0;
 var nmax = parseInt(document.getElementById('permute-numberpart-nmax').value) || 0;
 var distinct = document.getElementById('permute-numberpart-distinct').checked;
 var printAscending = document.getElementById('permute-numberpart-ascending').checked;

 //now read starting from somehow - fill arr
 var arr = document.getElementById('permute-startfrom').value.split('+');
 for(t=0;t<arr.length;t++)
 {
  arr[t] = parseInt(arr[t]);
  if (isNaN(arr[t]))
  arr.splice(t--, 1);
 }
 arr.sort(function(a,b){return b-a;});

 if (arr.length)
 arr[arr.length-1]++;

 var skip = parseInt(document.getElementById('permute-skip-first').value) || 0;
 var maxitems = parseInt(document.getElementById('permute-limit-items').value) || 0;
 var out = document.getElementById('permutatearea');
 out.value = '';
 var str = '', count = 0;

 while(true) 
 {
  if (!nextNPartition(number, arr, allowed, amin, amax, nmin, nmax, distinct)) break;

  if (!(skip-->0))
  {
   count++;
   if (str.length) str += '\n';
   for(t=0;t<arr.length;t++)
   {
    str += arr[printAscending?arr.length-1-t:t]; 
    if (t<arr.length-1) str += '+';
   }
   if ((--maxitems)===0)
   break;
  }
 }

 out.value = str;
 document.getElementById('items-generated').textContent = count;
}

function nextDyck(cat)
{
 var t, d = cat.length/2, c0 = d, c1 = d, x;

 for(t=2*d-1;t>=0;t--)
 {
  cat[t]===1?c1--:c0--;

  if (!cat[t] && c0>c1)
  {
   cat[t] = 1; t++;

   for(x=t;x<t+d-c0;x++)
   cat[x] = 0;

   for(;x<2*d;x++)
   cat[x] = 1;

   break;
  }
 }

 if (t===-1) return false;
 return true;
}

function prevDyck(cat)
{
 var t, c0 = 0, c1 = 0, x;

 for(t=cat.length-1;t>=0;t--)
 {
  cat[t]===1?c1++:c0++;

  if (cat[t] && cat[t+1]===0)
  {
   c0--; cat[t++] = 0;

   for(x=0;x<c1-c0;x++)
   cat[t++] = 1;
  
   for(x=0;x<c0;x++)
   {
    cat[t++] = 0;
    cat[t++] = 1;
   }

   return true;
  }
 }
}

function dyckToParenthesis(dyck)
{
 var t, ret = [], tt = 0, celem, copen;

 for(t=0;t<dyck.length;t++)
 ret.push(dyck[t]?tt++:'(');
 ret.push(tt++);

 for(t=ret.length-1;t>=0;t--)
 if (ret[t]==='(')
 {
  for(tt=t+1,celem=0,copen=0;celem<2;tt++)
  if (ret[tt]==='(')
  copen++;
  else if (!copen || ret[tt]===')' && !(--copen))
  celem++;
   
  ret.splice(tt, 0, ')');
 }
 return ret.join(',').replace(/(\d),(\))|(\(),(\d)/g, '$1$2$3$4').replace(/(\(),(?=\()/g, '$1').replace(/(\)),(?=\))/g, '$1');
}

function dyckToParenthesisR(dyck)
{
 var t, ret = [0], celem, copen, tt = 0;

 for(t=0;t<dyck.length;t++)
 ret.push(dyck[t]===1?')':++tt);

 for(t=0;t<ret.length;t++)
 {
  if (ret[t]===')')
  {
   //trace back
   for(tt=t-1,celem=0,copen=0;tt>=0 && celem<2;tt--)
   if (ret[tt]===')') copen++;
   else if (!copen || (ret[tt]==='(' && !(--copen)))
   celem++;

   ret.splice(tt+1, 0, '(');
   t++;
  }
 }

 return ret.join(',').replace(/(\d),(\))|(\(),(\d)/g, '$1$2$3$4').replace(/(\(),(?=\()/g, '$1').replace(/(\)),(?=\))/g, '$1');
}


function parenthesisToDyck(str)
{
 var ret = str.replace(/[^,(]/g, '').split('');

 for(var t=0;t<ret.length;t++)
 ret[t] = ret[t]==='('?0:1;

 return ret;
}

function parenthesisToDyckR(str)
{
 var ret = str.replace(/[^,)]/g, '').split('');

 for(var t=0;t<ret.length;t++)
 ret[t] = ret[t]===')'?1:0;

 return ret;
}

function advancePTree(stuff, backward)
{
 var stack = [stuff];
 while(stuff = stack.pop())
 {
  if (canPTreeAdvance(stuff[3], backward))
  stack.push(stuff[3]);
  else if (canPTreeAdvance(stuff[2], backward))
  {
   generatePTree(stuff[3], stuff[1], backward);
   stack.push(stuff[2]);
  }
  else if (stuff[backward?0:1]>1)
  {
   stuff[backward?1:0]++; stuff[backward?0:1]--;
   generatePTree(stuff[2], stuff[0], backward);
   generatePTree(stuff[3], stuff[1], backward);
  }
  else return false;
 }
}
function canPTreeAdvance(what, backward)
{
 while(true)
 {
  if (what[backward?0:1]>1) return true;
  else if (what[backward?1:0]>1) what = what[backward?3:2];
  else return false;
 }
}
function generatePTree(what, whole, backward)
{
 if (whole === 1) what.length = 0;
 while(whole>1)
 {
  what.length = 2;
  what[backward?1:0] = 1; what[backward?0:1] = whole-1;
  if (whole>2)
  {
   what[backward?3:2] = [];
   what = what[backward?2:3] = [];
  }
  whole--;
 }
}

function PTreeToStr(tree)
{
 var str = JSON.stringify(tree).replace(/\[\d+,\d+,(?=\[)/g, '[').replace(/\[]|1/g, '.')
 var t, tmp = 0, ret = '';
 for(t=0;t<str.length;t++)
 ret += str[t]==='['?'(':str[t]===']'?')':str[t]==='.'?tmp++:',';
 return ret;
}

function strToPTree(str)
{
 str = str.replace(/\d+/g, '.');
 var t, stack = [], current, last;

 for(t=0;t<str.length;t++)
 {
  if (str[t]==='(') 
  {
   stack.push(current);
   current = [0, 0];
  }
  else if (str[t]===',' || str[t]===')')
  {
   //if (last[0]+last[1]===2) last.length = 2;
   current[str[t]===','?0:1] += (last[0] || 0) + (last[1] || 1);
   current[str[t]===','?2:3] = last;

   if (str[t]===')')
   {
    last = current;
    current = stack.pop();
   }
  }
  else if (str[t]==='.') last = [];
 }
 return last;
}

function dyckWords()
{
 var t, n = parseInt(document.getElementById('permute-cat-dl').value) || 1;
 var backward = document.getElementById('permute-cat-backward').checked;

 var dyck = document.getElementById('permute-startfrom').value.split('');
 if (dyck.length !== 2*n) dyck = [];

 if (!dyck.length)
 {
  for(t=0;t<2*n;t++)
  dyck[t] = backward?(t%2?1:0):(t<n?0:1);
 }
 else
 {
  for(t=0;t<2*n;t++)
  dyck[t] = dyck[t]==='('||dyck[t]==='0'||dyck[t]==='X'?0:1;
 }

 var skip = parseInt(document.getElementById('permute-skip-first').value) || 0;
 var maxitems = parseInt(document.getElementById('permute-limit-items').value) || 0;
 var str = '', count = 0;

 do
 {
  if (!(skip-->0))
  {
   count++;

   if (str.length) str += '\n';
   str += dyck.join('').replace(/0/g, '(').replace(/1/g, ')');

   if ((--maxitems)===0)
   break;
  }
 } while((backward?prevDyck:nextDyck)(dyck));

 document.getElementById('permutatearea').value = str;
 document.getElementById('items-generated').textContent = count;
}


function parenthesizations(type)
{
 var t, n = parseInt(document.getElementById('permute-cat-pl').value) || 1;
 var backward = document.getElementById('permute-cat-backward').checked;

 var curr = document.getElementById('permute-startfrom').value;
 if (type===0 || type===1)
 {
  if (curr) curr = (type===1?parenthesisToDyckR:parenthesisToDyck)(curr);
  else
  {
   for(t=0,curr=[];t<2*n-2;t++)
   curr[t] = backward?(t%2?1:0):(t<n-1?0:1);
  }
 }
 else
 {
  if (curr) curr = strToPTree(curr);
  else
  {
   curr = [];
   generatePTree(curr, n, backward);
  }
 }

 var skip = parseInt(document.getElementById('permute-skip-first').value) || 0;
 var maxitems = parseInt(document.getElementById('permute-limit-items').value) || 0;
 var str = '', count = 0;

 do
 {
  if (!(skip-->0))
  {
   count++;

   if (str.length) str += '\n';

   if (type===0) str += dyckToParenthesis(curr);
   else if (type===1) str += dyckToParenthesisR(curr);
   else str += PTreeToStr(curr);

   if ((--maxitems)===0)
   break;
  }
 } while(type===2?(advancePTree(curr, backward)!==false):((backward?prevDyck:nextDyck)(curr)));

 document.getElementById('permutatearea').value = str;
 document.getElementById('items-generated').textContent = count;
}