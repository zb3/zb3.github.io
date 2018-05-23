//these modulo functions assume parameters are normalized.

function i(n){return parseInt(n)}

function cm(a, mod) {return mod?(mod+(a%mod))%mod:a;} //% operator done right

function safeMult(x, y, mod) //for non negative ONLY
{
 if (x<67108864 && y<67108864) return (x*y)%mod;
 
 var xlo = Math.floor(x/Math.pow(2,26)), xhi = x%Math.pow(2,26);
 var ylo = Math.floor(y/Math.pow(2,26)), yhi = y%Math.pow(2,26);
 var ret = (xhi*yhi)%mod, rt, t;
 
 rt = (xlo*yhi)%mod;
 for(t=0;t<26;t++)
 rt = (rt+rt)%mod;
 ret = (ret+rt)%mod;

 rt = (xhi*ylo)%mod;
 for(t=0;t<26;t++)
 rt = (rt+rt)%mod;
 ret = (ret+rt)%mod;

 rt = (xlo*ylo)%mod;
 for(t=0;t<52;t++)
 rt = (rt+rt)%mod;
 ret = (ret+rt)%mod;
 
 return ret;
}

function add(a, b, mod) {return mod?(cm(a+b, mod)):(a+b);}
function sub(a, b, mod) {return mod?(cm(a-b, mod)):(a-b);}
function mul(a, b, mod)
{
 return mod?(safeMult(a, b, mod)):(a*b);
}
function div(a, b, mod)
{
 if (b===0) throw 'Division by zero!';

 if (!mod)
 {
  var r = cm(a, b);
  a -= r;
  a /= b;
  if (r===0) r=0; //this line makes sense
  if (a===0) a=0; //-0===0 yet it's displayed as -0
  return [a, r];
 }
 return mul(a, modInv(b, mod), mod);
}
function pow(a, b, mod)
{
 if (!mod)
 {
  if (b < 0) throw 'Negative powers require modulus.';
  else return Math.pow(a, b);
 }

 if (b<0)
 return modInv(modPow(a, -b, mod), mod)
 else
 return modPow(a, b, mod);
}



/*
function m4(x){return Math.pow(2,52)-x}
function fuzz_big_inv(tries)
{
 while(tries--)
 {
  var n1 = Math.random()*700|0;
  var n2 = Math.random()*n1|0;
  var r = 1;
  try
  {
   r = mul(modInv(m4(n1), m4(n2)), m4(n1), m4(n2));
  } catch(e) {}
  if (r!==1) throw 'fail'+n1+'|'+n2;
 }
}
*/
function modInv(number, mod)
{
/*
fuzzing shows that it CAN handle large numbers
*/
 if (gcd(number, mod)!==1) throw 'Cannot invert element '+number+' in Z'+mod;

 var a = number, b = mod;
 var p = 1, q = 0, r = 0, s = 1;
 var new_r, new_s, c, quot;

 while(b)
 {
  c = a%b;
  quot = Math.floor(a/b);
  a = b; b = c;
  new_r = p - quot*r;
  new_s = q - quot*s;
  p = r; q = s;
  r = new_r; s = new_s;
 }
 
 return cm(p, mod);
}
function xgcd(a, b) //#non-modulo
{
 if (a === 0 && b === 0)
 return [0, 0, 1];

 if (a === 0)
 return [Math.abs(b), 0, Math.sign(b)];

 if (b === 0)
 return [Math.abs(a), Math.sign(a), 0];

 var psign = Math.sign(a), qsign = Math.sign(b);
 a = Math.abs(a); b = Math.abs(b);

 var p = 1, q = 0, r = 0, s = 1;
 var new_r, new_s, c, quot;

 while(b)
 {
  c = a%b;
  quot = Math.floor(a/b);
  a = b; b = c;
  new_r = p - quot*r;
  new_s = q - quot*s;
  p = r; q = s;
  r = new_r; s = new_s;
 }
 return [a, p*psign, q*qsign];
}
function modPow(a, n, p)
{ 
 var c = 1, aw = a, bw = n;

 while (bw > 0)
 { 
  if ((bw%2) === 1)
  {
   c = mul(c, aw, p);
  }
  aw = mul(aw, aw, p);
  bw = Math.floor(bw/2);
 }
 return c; 
}

/*
function modMul(a, n, p)
{ 
 var c = 0, aw = a, bw = n;

 while (bw > 0)
 { 
  if ((bw%2) === 1)
  {
   c = (c+aw)%p;
  }
  aw = (aw+aw)%p;
  bw = Math.floor(bw/2);
 }
 return c; 
}
*/



function totient(n) //#non-negative #non-modulo
{
 if (n<0) throw 'Number must not be negative.';

 var fact = getFactors(n), ret = 1;
 for(var t=0;t<fact[0].length;t++)
 {
  ret *= (fact[0][t]-1)*Math.pow(fact[0][t], fact[1][t]-1);
 }
 return ret;
}

function getFactors(n) //#non-negative #non-modulo
{
 if (n<0) throw 'Number must not be negative.';

 var primes = [];
 var ppowers = [];
 var which;
 
 for(var t=2;t<=Math.sqrt(n);t++)
 {
  if (!(n%t) && isPrime(t))
  {
   which = primes.length;
   primes[which] = t;
   ppowers[which] = 0;
   while(!(n%t))
   {
    n /= t;
    ppowers[which]++;
   }
  }
 }
 if (n>1)
 {
  primes.push(n); 
  ppowers.push(1);
 }
 return [primes, ppowers];
}

function isPrime(n) //#non-negative #non-modulo
{
 if (n<0) return false;

 var q = Math.floor(Math.sqrt(n));
 
 if (n===2) return true;
 if (!(n%2)) return false;

 for(var t=3;t<=q;t+=2)
 if (!(n%t))
 return false;

 return true; 
}

function factorial(n, mod) //#non-negative it's cool :)
{
 if (n<0) throw 'Cannot compute factorial of a negative number.';

 var x = 1;
 for (var i = 2; i <= n; i++)
 {
  if (mod)
  x = mul(x, i%mod, mod);
  else
  x *= i;
 }
 return x;
}
function bcoeff(n, k)
{
 var coeff = 1;
 for (var i = n-k+1; i <= n; i++) coeff *= i;
 for (var i = 1;     i <= k; i++) coeff /= i;
 return coeff;
}
function mcoeff(n, k)
{
 return bcoeff(n+k-1,k);
}
function findHandQ(a, n) //#non-modulo
{
 if (n===0) throw 'Cannot factor 0 out!';
 if (n===1) throw 'Cannot factor 1 out!';
 if (a===0) return [0, 0];

 var h = 0;
 while(!(a%n))
 {
  h++;
  a /= n;
 }
 return [h, a];
}

function isGenerator(g, mod)
{
 if (!mod) throw 'Modulus required.';

 try
 {
  getOrder(g, mod);
  return getOrder.isGen;
 }
 catch(e) {return false;}
}

function chineseremainder(arr)
{
 var x = arr[0][0], m = arr[0][1], t;
 for(t=1;t<arr.length;t++)
 {
  x = _crt(x, m, arr[t][0], arr[t][1]);
  m = lcm(m, arr[t][1]);
 }
 return [cm(x, m), m];
}
function _crt(a, m, b, n)
{
 var xg = xgcd(m, n);

 if (cm(b-a, xg[0]))
 throw 'No solution found.';

 var l = lcm(m, n);
 return add(a, mul(mul(cm((b-a)/xg[0], l), cm(xg[1], l), l), m, l), l);
}

function fuzz_crt(tries)
{
 tries = tries || 10000;
 while(tries--)
 {
  console.log('fuzzing');
  var n = Math.random()*8|0;
  var rules = [], tr;

  for(var t=0;t<n;t++)
  {
   tr = [Math.random()*25|0+2];
   tr.unshift(Math.random()*tr[0]|0);
   rules.push(tr);
  }

  var r = false;
  try {r = chineseremainder(rules)[0];} catch(e){}
  if (r)
  {
   for(t=0;t<rules.length;t++)
   if (cm(r, rules[t][1])!==rules[t][0])
   {
    console.log('mismatch', rules, r);
    return;
   }
  }
 }
}
function dlog_brute(a, b, mod) //a cm'ed, b cm'ed > 0
{
 for(var t=0;t<mod;t++)
 {
  if (modPow(a, t, mod) === b)
  return t;
 }
 throw 'Logarithm not found!';
}

function faster_dlog(a, b, mod)
{
 var m = Math.ceil(Math.sqrt(mod)), t;
 var hash = {}, th;

 for(var t=0;t<m;t++)
 {
  th = mul(b, pow(a, -t, mod), mod);
  hash[th] = t;
  if (th === 1) return t;
 }

 var am = modPow(a, m, mod);
 var y = 1;

 for(var t=0;t<=m-1;t++)
 {
  if (hash[y]!==undefined)
  return add(mul(t, m, mod), hash[y], mod);

  y = mul(y, am, mod);
 }
 throw 'Logarithm not found!';
}
function dlog(a, b, m) //#non-negative
{
 if (!m)
 {
  if (a<2 || b<1) throw 'Invalid arguments.';
  var d = Math.round(Math.log(b)/Math.log(a));
  if (Math.pow(a, d)!==b) throw 'Logarithm not found.';
  return d;
 }

 if (!b) throw 'Cannot compute discrete logarithm of 0';

 if (a===0 && b===0) return 0;
 else if (a===0 && b!==0) throw 'Logarithm not found.';

 if (gcd(a, m)===1)
 return faster_dlog(a, b, m);
 else
 return dlog_brute(a, b, m);
}

function fuzz_dlog(tries)
{
 tries = tries || 10000;
 while(tries--)
 {
  console.log('fuzzing');
  var m = (Math.random()*87|0)+2;
  var b = (Math.random()*m|0)+1;
  var a = Math.random()*m|0;

  var r1 = false, r2 = false;
  try{r1 = dlog(a, b, m);}catch(e){}
  try{r2 = dlog_brute(a, b, m);}catch(e){}

  if ((r1 || r2) && (r1!==r2 || pow(a, r1, m)!==b || pow(a, r2, m)!==b))
  {
   throw console.log('mismatch', a, b, m, r1, r2);
  }
 }
}

function lg(a, p)
{
 var t = pow(a, Math.floor((p-1)/2), p);
 return t==p-1?false:t;
}
function prime_sqrt(a, p)
{
 if (lg(a, p) === false)
 throw a+' has no square root modulo '+p;

 if (!a) return 0;
 if (p === 2) return a;
 if (p%4===3)
 return pow(a,  Math.floor((p+1)/4), p);

 var s = p-1, e = 0;
 while(!(s%2))
 {
  s /= 2;
  e++;
 }

 var n = 2;

 while(lg(n, p)!==false)
 n++;

 var x = pow(a, Math.floor((s+1)/2), p), b = pow(a, s, p);
 var g = pow(n, s, p), r = e;
 var t, m, gs;

 while(true)
 {
  t = b; m = 0;
  for(m=0;m<r;m++)
  {
   if (t === 1)
   break;

   t = pow(t, 2, p);
  }
  if (m===0) return x;

  gs = pow(g, pow(2, r-m-1), p);
  g = pow(gs, 2, p);
  x = mul(x, gs, p);
  b = mul(b, g, p);
  r = m;
 }
}
function prime_cbrt(a, p)
{
 if (p === 2) return a;
 if (p === 3) return a;
 if ((p%3)===2) return pow(a, (2*p - 1)/3, p);
 if ((p%9)===4)
 {
  var root = pow(a, (2*p + 1)/9, p);
  if (pow(root,3,p) === a)
  return root;
  throw 'root not found';
 }
 if ((p%9)===7)
 {
  var root = pow(a, (p + 2)/9, p);
  if (pow(root,3,p) === a)
  return root;
  throw 'root not found';
 }
 return nthroot_brute(a, 3, p);
}
function nthroot_brute(a, n, mod) //a is mod, n>0, mod>0
{
 for(var t=0;t<mod;t++)
 {
  if (modPow(t, n, mod) === a)
  return t;
 }
 throw 'Root not found.';
}
function nthroot(a, n, m) //entry point - wrapper
{
 if (!m)
 {
  if (n < 0) throw 'Negative powers require modulus.';
  if (a < 0) throw 'Root not found.';

  var d = Math.round(Math.pow(a, 1/n));
  if (Math.pow(d, n)===a)
  return d;
  else throw 'Root not found.';
 }

 if (a===0) return 0;
 if (a===1) return 1;

 if (n === 2 && isPrime(m))
 return prime_sqrt(a, m);

 if (n === 3 && isPrime(m))
 return prime_cbrt(a, m); //fast in 8/9 cases

 return nthroot_brute(a, n, m);
}

function fuzz_nthroot(tries)
{
 tries = tries || 10000;
 while(tries--)
 {
  console.log('fuzzing');
  var m = (Math.random()*879|0)+2;
  var a = Math.random()*m|0;
  var n = 1+Math.random()*23|0;
  var r1 = false, r2 = false;
  try{r1 = nthroot_brute(a, n, m)}catch(e){}
  //console.clear();
  //console.log('fuzzing', a, m);
  try{r2 = nthroot(a, n, m)}catch(e){}

  if (r1!==r2) 
  {
   if (pow(r1, n, m)===a && pow(r2, n, m)===a) continue;
   console.log('mismatch', a, 2, m, r1, r2);
   return;
  }
 }
}

function _addToFactors(arr, p, k)
{
 for(var t=0;t<arr[0].length;t++)
 if (arr[0][t]==p)
 {
  arr[1][t] += k;
  break;
 }

 if (t==arr[0].length)
 {
  arr[0].push(p);
  arr[1].push(k);
 }
}

function getOrder(a, n)
{
 if (!n) throw 'Modulus required.';
 if (gcd(a, n)!==1) throw 'Element '+a+' has no order in Z'+n;

 var fact = getFactors(n);
 var factors = [[],[]];
 var order = 1;

 for(var t=0;t<fact[0].length;t++)
 {
  if (fact[1][t] > 1)
  _addToFactors(factors, fact[0][t], fact[1][t]-1);

  var f2 = getFactors(fact[0][t]-1);
  for(var t2=0;t2<f2[0].length;t2++)
  {
   _addToFactors(factors, f2[0][t2], f2[1][t2]);
  }
 }
 
 for(t=0;t<factors[0].length;t++)
 {
  order *= pow(factors[0][t], factors[1][t]);
 }
 
 getOrder.isGen = true;

//there's probably an error there...
 for(t=0;t<factors[0].length;t++)
 {
  for(t2=0;t2<factors[1][t];t2++)
  {
   order /= factors[0][t];
   
   if (pow(a, order, n)!==1)
   {
    order *= factors[0][t];
    break;
   }
   
   getOrder.isGen = false;
  }
 }
 return order;
}
function brute_order(a,n)
{
 if (gcd(a,n)!==1) throw 'no order';
 if (a===1) return 1;
 if (n===1) return 1;
 for(var t=1;t<n;t++)
 { 
  if (pow(a, t, n)===1) return t;
 }
}
function fuzz_order(tries)
{
 tries = tries || 10000;
 while(tries--)
 {
  console.log('fuzzing');
  var n1 = Math.random()*87999|0, n2 = Math.random()*87999|0;
  if(gcd(n1,n2)!==1) {tries++;continue;}
  var o1 = -1, o2 = -1;
  try{o1 = getOrder(n1, n2);}catch(e){}
  try{o2 = brute_order(n1, n2);}catch(e){}

  if (o1!==o2)
  {
   throw console.log('mismatch', n1, n2);
  }
 }
}
function fuzz_gen(tries)
{
 tries = tries || 10000;
 while(tries--)
 {
  console.log('fuzzing');
  var n1 = Math.random()*898888|0, n2 = Math.random()*89888|0;
  if(gcd(n1,n2)!==1) {tries++;continue;}
  var o1 = -1, o2 = -1;
  try{o1 = isGenerator(n1, n2);}catch(e){}
  try{o2 = getOrder(n1, n2)===totient(n2);}catch(e){}

  if (o1!==o2)
  {
   throw console.log('mismatch', o1, o2);
  }
 }
}

function findGenerator(mod)
{
 if (!mod) throw 'Modulus required.';
 var order = totient(mod), of = getFactors(order)[0], t, p;
 if (order !== carmichael(mod)) throw 'No primitive root exists.';

 for(p=0;p<of.length;p++)
 {
  of[p] = order/of[p];
 }
 gen: for(t=2;t<mod;t++)
 {
  if ((order!==mod-1) && gcd(t, mod) !== 1) continue;
  for(p=0;p<of.length;p++)
  {
   if (pow(t, of[p], mod) === 1)
   continue gen;
  }
  return t;
 }
}
function fgen_brute(mod)
{
 for(var t=2;t<mod;t++)
 if (isGenerator(t, mod))
 return t;

 throw 'FAIL';
}
function fuzz_fgen(tries)
{
 tries = tries || 10000;
 while(tries--)
 {
  console.log('fuzzing');
  var n = Math.random()*8799|0;

  try{o1 = findGenerator(n);}catch(e){}
  try{o2 = fgen_brute(n);}catch(e){}

  if (o1!==o2)
  {
   throw console.log('mismatch', n, o1, o2);
  }
 }
}
function carmichael(x) //#non-modulo
{
 if (x <= 0) throw 'Number must be positive.';
 if (x===1) return 1;

 if (x===2 || x===4) return totient(x);

 var fact = getFactors(x);

 if (fact[0].length===1 && fact[0][0]===2)
 return totient(x)/2;

 if (fact[0].length===1)
 return totient(x);

 var t = 0, ret = lcm(carmichael(pow(fact[0][0], fact[1][0])), carmichael(pow(fact[0][1], fact[1][1])));
 for(t=2;t<fact[0].length;t++)
 {
  ret = lcm(ret, carmichael(pow(fact[0][t], fact[1][t])));
 }
 return ret;
}
function carmichael_brute(n)
{
 mm:for(var m=1;m<=n;m++)
 {
  for(var t=2;t<n;t++)
  {
   if (gcd(t, n)!==1) continue;
   if (pow(t, m, n)!==1)
   continue mm;
  }
  return m;
 }
 return best;
}
function fuzz_carmichael(tries)
{
 tries = tries || 10000;
 while(tries--)
 {
  console.log('fuzzing');
  var n = Math.random()*8799|0;

  try{o1 = carmichael_brute(n);}catch(e){}
  try{o2 = carmichael(n);}catch(e){}

  if (o1!==o2)
  {
   throw console.log('mismatch', n, o1, o2);
  }
 }
}
function primeBetween(a,b) //#non-modulo
{
 if (a<0 || b<0 || a===b) throw 'Invalid arguments';
 if (a>b) {var x = a; a = b; b = x;}

 for(;a<b;a++)
 if (isPrime(a))
 return a;

 throw 'No prime found';
}

function numberOfDivisors(n) //#non-modulo
{
 if (!n) return Infinity;
 n = Math.abs(n);
 if (n===1) return 1;

 var ret = 1;
 var fact = getFactors(n);
 for(var t=0;t<fact[1].length;t++)
 {
  ret *= fact[1][t]+1;
 }
 return ret;
}
function stirling2(n, k) //#non-modulo
{
 if (k<1 || k>n) return 0;
 if (k==1 || k==n) return 1;
 return k*stirling2(n - 1, k)+stirling2(n - 1, k - 1);
}
function stirling1_mod(n, k) //#non-modulo
{
 if (k < 1 || k > n) return 0;
 if (k == n) return 1;
 return (n - 1)*stirling1_mod(n - 1, k)+stirling1_mod(n - 1, k - 1);
}
function stirling1(n, k) //#non-modulo
{
 return stirling1_mod(n, k)*((n-k)%2?-1:1);
}
numberOfPartitions.p = [1];
function numberOfPartitions(n) //#non-modulo
{
 if (n<0) throw 'Invalid argument.';
 if (n<numberOfPartitions.p.length) return numberOfPartitions.p[n];

 var t, k, a, b;
 for(var t=1;t<=n;t++)
 {
  numberOfPartitions.p[t] = 0;
  for(k=1;;k++)
  {
   a = t-k*(3*k-1)/2;
   b = t-k*(3*k+1)/2;
   if (a<0 && b<0) break;

   if (a>=0)
   numberOfPartitions.p[t] += (k%2===1?1:-1)*numberOfPartitions.p[a];
   if (b>=0)
   numberOfPartitions.p[t] += (k%2===1?1:-1)*numberOfPartitions.p[b];
  }
 }
 return numberOfPartitions.p[n];
}
bellNumber.a = [1, 1, 2, 5, 15, 52, 203, 877, 4140, 21147, 115975, 678570, 4213597, 27644437, 190899322, 1382958545, 10480142147, 82864869804, 682076806159, 5832742205057, 51724158235372, 474869816156751, 4506715738447323];
function bellNumber(x) //#non-modulo
{
 if (x<0) throw 'Invalid argument.';
 if (x<bellNumber.a.length) return bellNumber.a[x];
 return Infinity;
}
function catalan(n) //#non-modulo
{
 var t, ret = 1;

 for(t=1;t<n;t++)
 ret *= (4*t+2)/(t+2);

 return ret;
}
