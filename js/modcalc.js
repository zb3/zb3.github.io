(function(){

var modInput = document.getElementById('mod-modulus');
var modInputA = document.getElementById('mod-a');
var modInputB = document.getElementById('mod-b');
modInputA.onchange = getA;
modInputB.onchange = getB;
var modResult = document.getElementById('mod-result');
var mod = 0, gresult = 0;

function resultCopyOn(modEnabled)
{
 document.getElementById('mod-copy-result').style.display = 'inline';
 document.getElementById('mod-copy-result-b').style.display = 'inline';
 document.getElementById('mod-copy-result-mod').style.display = modEnabled?'inline':'none';
}
function resultCopyOff()
{
 document.getElementById('mod-copy-result').style.display = 'none';
 document.getElementById('mod-copy-result-b').style.display = 'none';
 document.getElementById('mod-copy-result-mod').style.display = 'none';
}
function clearResult()
{
 resultCopyOff();
 modResult.innerHTML = '';
}
document.getElementById('mod-copy-result').onclick = function()
{
 modInputA.value = gresult; 
 getA(); 
};
document.getElementById('mod-copy-result-b').onclick = function()
{
 modInputB.value = gresult; 
};
document.getElementById('mod-copy-result-b').onclick = function()
{
 modInputB.value = gresult; 
};
document.getElementById('mod-copy-result-mod').onclick = function()
{
 setModulo(gresult);
};
function setResult(result)
{
 if (typeof result === 'number')
 {
  modResult.innerHTML = result;
  gresult = result;
  if (!isNaN(result) && isFinite(result))
  resultCopyOn(gresult>=2);
 }
 else
 {
  resultCopyOff();
  if (result.error)
  modResult.innerHTML = result.error;
  else if (result.qr)
  {
   modResult.innerHTML = JSON.stringify(result.qr[0]).replace(/\[/g, "(").replace(/\]/g, ")");
  }
  else if (result.xgcd)
  {
   modResult.innerHTML = JSON.stringify(result.xgcd[0]).replace(/\[/g, "(").replace(/\]/g, ")");
  }
  else if (result.handq)
  {
   modResult.innerHTML = result.handq[2]+'<sup>'+result.handq[0][0]+'</sup>&#183;'+result.handq[0][1];
  }
  else if (result.factors)
  {
   if (!result.factors[0].length) 
   {
    modResult.innerHTML = 'No prime factors found.';
   }
   else
   {
    var o = '';
    for(var t=0;t<result.factors[0].length;t++)
    {
     o += result.factors[0][t]+(result.factors[1][t]>1?'<sup>'+result.factors[1][t]+'</sup>':'');

     if (t<result.factors[0].length-1)
     o += '&#183;';
    }
    modResult.innerHTML = o;
   }
  }
  else if (result.isagen)
  {
   modResult.innerHTML = result.isagen[1]+' is '+(result.isagen[0]?'':'not ')+'a primitive root.';
  }
 }
}
function getA()
{
 var mval = parseInt(modInputA.value);
 if (isNaN(mval)) mval = 0;
 if (mod) mval = cm(mval, mod);
 modInputA.value = mval;
 return mval;
}
function getB()
{
 var mval = parseInt(modInputB.value);
 if (isNaN(mval)) mval = 0;
 modInputB.value = mval;
 return mval;
}
document.getElementById('mod-do-swap').onclick = function()
{
 var b = getB();
 modInputB.value = getA();
 modInputA.value = b;
 getA();
};
document.getElementById('mod-b-button').onclick = function()
{
 modInputB.value = cm(getB(), mod);
};
document.getElementById('set-modulo').onclick = function()
{
 setModulo(parseInt(modInput.value));
};
function setModulo(mval)
{
 if (isNaN(mval)) mval = 0;
 if (mval<0) mval = 0;
 if (mval===1) mval = 0;
 modInput.value = mval;
 
 mod = mval;
 getA();

 if (mod)
 {
  document.getElementById('mod-a-sayer').innerHTML = '(mod '+mod+')';
  document.getElementById('mod-b-button').innerHTML = '(mod '+mod+')';
 }
 else
 document.getElementById('mod-a-sayer').innerHTML = '';
 
 document.getElementById('mod-b-button').style.display = mod?'inline':'none';
 clearResult();
}
document.getElementById('mod-op-add').onclick = function()
{
 setResult(add(getA(), cm(getB(), mod), mod));
};
document.getElementById('mod-op-sub').onclick = function()
{
 setResult(sub(getA(), cm(getB(), mod), mod));
};
document.getElementById('mod-op-mul').onclick = function()
{
 setResult(mul(getA(), cm(getB(), mod), mod));
};
document.getElementById('mod-op-div').onclick = function()
{
 try
 {
  var r = div(getA(), cm(getB(), mod), mod);
  if (typeof r === 'object')
  {
   setResult({qr: [r, getA(), cm(getB(), mod)]});
  }
  else setResult(r);
 }
 catch (e)
 {
  setResult({error: e});
 }
};
document.getElementById('mod-op-gcd').onclick = function()
{
 setResult(gcd(getA(), getB()));
};
document.getElementById('mod-op-lcm').onclick = function()
{
 setResult(lcm(getA(), getB()));
};
document.getElementById('mod-op-xgcd').onclick = function()
{
 var r = xgcd(getA(), getB());
 setResult({xgcd: [r, getA(), getB()]});
};
document.getElementById('mod-op-inv').onclick = function()
{
 try
 {
  var r = div(1, getA(), mod);
  if (typeof r === 'object')
  {
   setResult({qr: [r, 1, getA()]});
  }
  else setResult(r);
 }
 catch (e)
 {
  setResult({error: e});
 }
};

document.getElementById('mod-op-hand2').onclick = function()
{
 try
 {
  var r = findHandQ(getB(), 2);
  setResult({handq: [r, getB(), 2]});
 }
 catch (e)
 {
  setResult({error: e});
 }
};
document.getElementById('mod-op-handq').onclick = function()
{
 try
 {
  var r = findHandQ(getB(), getA());
  setResult({handq: [r, getB(), getA()]});
 }
 catch (e)
 {
  setResult({error: e});
 }
};
document.getElementById('mod-op-pfactors').onclick = function()
{
 try
 {
  var r = getFactors(getB());
  setResult({factors: r});
 }
 catch (e)
 {
  setResult({error: e});
 }
};
document.getElementById('mod-op-pfactors-m').onclick = function()
{
 try
 {
  var r = getFactors(mod);
  setResult({factors: r});
 }
 catch (e)
 {
  setResult({error: e});
 }
};
document.getElementById('mod-op-isagen').onclick = function()
{
 try
 {
  var r = isGenerator(getA(), mod);
  setResult({isagen: [r, getA()]});
 }
 catch (e)
 {
  setResult({error: e});
 }
};

bindStandard('log', function(){modInputB.value = cm(getB(), mod);return dlog(getA(), getB(), mod)});
bindStandard('pow', function(){return pow(getA(), getB(), mod);});
bindStandard('root', function(){return nthroot(getA(), getB(), mod);});
bindStandard('square', function(){return pow(getA(), 2, mod);});
bindStandard('sqrt', function(){return nthroot(getA(), 2, mod);});
bindStandard('getorder', function(){return getOrder(getA(), mod);});
bindStandard('factorial', function(){return factorial(getA(), mod);});
bindStandard('totient', function(){return totient(getB());});
bindStandard('totientm', function(){return totient(mod);});
bindStandard('carmichael', function(){return carmichael(getB());});
bindStandard('carmichaelm', function(){return carmichael(mod);});
bindStandard('bcoeff', function(){return bcoeff(getA(), getB());});
bindStandard('mcoeff', function(){return mcoeff(getA(), getB());});
bindStandard('findprime', function(){return primeBetween(getA(), getB());});
bindStandard('findproot', function(){return findGenerator(mod);});
bindStandard('noofdiv', function(){return numberOfDivisors(getB());});
bindStandard('stirling1', function(){return stirling1(getA(), getB());});
bindStandard('stirling2', function(){return stirling2(getA(), getB());});
bindStandard('bell', function(){return bellNumber(getB());});
bindStandard('catalan', function(){return catalan(getB());});
bindStandard('part', function(){return numberOfPartitions(getB());});

function bindStandard(name, funct)
{
 document.getElementById('mod-op-'+name).onclick = function()
 {
  try
  {
   var r = funct();
   setResult(r);
  }
  catch (e)
  {
   setResult({error: e});
  }
 };
}


///crt start
var crtRuleDiv = document.getElementById('mod-crt-rules');
var crtResultOKDiv = document.getElementById('mod-crt-result-ok');
var crtResultErrorDiv = document.getElementById('mod-crt-result-error');
var crtResultA = document.getElementById('mod-crt-result-a');
var crtResultM = document.getElementById('mod-crt-result-m');
function readCRTRules()
{
 var t, ta, tm, inputs, rdivs = crtRuleDiv.getElementsByTagName('div');
 var rules = [];
 for(t=0;t<rdivs.length;t++)
 {
  inputs = rdivs[t].getElementsByTagName('input');

  tm = parseInt(inputs[1].value);
  if (isNaN(tm) || !isFinite(tm) || tm<2)
  inputs[1].value = tm = 2;

  ta = parseInt(inputs[0].value);
  if (isNaN(ta) || !isFinite(ta))
  inputs[0].value = ta = 1;
  inputs[0].value = ta = cm(ta, tm);

  rules.push([ta, tm]);
 }
 return rules;
}

function setCRTRules(rules)
{
 crtRuleDiv.innerHTML = '';

 var t, ndiv, ninput, nbutton;
 for(t=0;t<rules.length;t++)
 {
  ndiv = document.createElement('div');
  ndiv.className = 'mod-crt-rule';
  ndiv.appendChild(document.createTextNode('x = '));

  ninput = document.createElement('input');
  ninput.className = 'mod-crt-rule-a';
  ninput.type = 'number';
  ninput.min = 0;
  ninput.value = rules[t][0];
  ndiv.appendChild(ninput);

  ndiv.appendChild(document.createTextNode(' mod '));

  ninput = document.createElement('input');
  ninput.className = 'mod-crt-rule-m';
  ninput.type = 'number';
  ninput.min = 2;
  ninput.value = rules[t][1];
  ndiv.appendChild(ninput);

  if (rules.length>2)
  {
   nbutton = document.createElement('button');
   nbutton.textContent = 'Remove';
   nbutton.onclick = (function(t){return function(){removeCRTRule(t);}})(t);
   ndiv.appendChild(nbutton);
  }
  crtRuleDiv.appendChild(ndiv);
 }
}
function addCRTRule()
{
 var rules = readCRTRules();
 rules.push(rules[rules.length-1].slice());
 setCRTRules(rules);
}
function removeCRTRule(which)
{
 var rules = readCRTRules();
 rules.splice(which, 1);
 setCRTRules(rules);
}
function solveCRT()
{
 var rules = readCRTRules();
 try 
 {
  var solution = chineseremainder(rules);
  crtResultA.value = solution[0];
  crtResultM.value = solution[1];
  crtResultOKDiv.style.display = 'block';
  crtResultErrorDiv.style.display = 'none';
 }
 catch(e)
 {
  crtResultErrorDiv.textContent = e;
  crtResultOKDiv.style.display = 'none';
  crtResultErrorDiv.style.display = 'block';
 }
}

document.getElementById('mod-crt-addrule').onclick = addCRTRule;
document.getElementById('mod-crt-solve').onclick = solveCRT;
})();