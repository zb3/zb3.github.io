//snippet of code from graph.tk
//copyright [insert graph.tk authors here]

var latexchars={
'gt':">",
"left|":"(abs(",
"right|":"))",
"cosh":"cosh",
"sinh":"sinh",
"tanh":"tanh",
"coth":"coth",
"sech":"sech",
"csch":"csch",
"cosech":"cosech",
"sin":"sin",
"cos":"cos",
"tan":"tan",
"times":"*",
"sec":"sec",
"cosec":"cosec",
"csc":"csc",
"cotan":"cotan",
"cot":"cot",
"ln":"ln",
"lg":"log",
"log":"log",
"det":"det",
"dim":"dim",
"max":"max",
"min":"min",
"mod":"mod",
"lcm":"lcm",
"gcd":"gcd",
"gcf":"gcf",
"hcf":"hcf",
"lim":"lim",
":":"",
"left(":"(",
"right)":")",
"left[":"(",
"right]":")",
'ge':">=",
'lt':"<",
'le':"<=",
"infty":"∞",
"cdot":"*",
"text":"",
"frac":"",
"backslash":"\\",
"alpha":"α",
"beta":"β",
'gamma':"γ",
'delta':"δ",
'zeta':"ζ",
'eta':"η",
'theta':"θ",
'iota':"ι",
'kappa':"κ",
'mu':"μ",
'nu':"ν",
'xi':"ξ",
'omicron':"ο",
'rho':"ρ",
'sigma':"σ",
'tau':"τ",
'upsilon':"υ",
'chi':"χ",
'psi':"ψ",
'omega':"ω",
'phi':"ϕ",
"phiv":"φ",
"varphi":"φ",
"epsilon":"ϵ",
"epsiv":"ε",
"varepsilon":"ε",
"sigmaf":"ς",
"sigmav":"ς",
"gammad":"ϝ",
"Gammad":"ϝ",
"digamma":"ϝ",
"kappav":"ϰ",
"varkappa":"ϰ",
"piv":"ϖ",
"varpi":"ϖ",
"pm":"±",
"rhov":"ϱ",
"varrho":"ϱ",
"thetav":"ϑ",
"vartheta":"ϑ",
"pi":"(3.14159)",
"lambda":"λ",
'Gamma':"Γ",
'Delta':"Δ",
'Theta':"Θ",
'Lambda':"Λ",
'Xi':"Ξ",
'Pi':"(3.14159)",
'Sigma':"Σ",
'Upsilon':"Υ",
'Phi':"Φ",
'Psi':"Ψ",
'Omega':"Ω",
"perp":"⊥",
",":" ",
"nabla":"∇",
"forall":"∀",
"sum":"∑",
"summation":"∑",
"prod":"∏",
"product":"∏",
"coprod":"∐",
"coproduct":"∐",
"int":"∫",
"integral":"∫"
};
function delatex(n)
{
 n=n.replace(/\\?(sin|cos|tan|sec|cosec|csc|cotan|cot)\^([^\{]|\{[^\}]+\})/g,"$1^$2");
 //n=n.replace(/\\?(sin|cos|tan|sec|cosec|csc|cotan|cot)([^\:\^h])/g,"$1:$2");
 n=n.replace(/\\?(log)_([^\{]|\{[^\}]+\})/g,"$1_{$2}");
 for(var i in latexchars)
 {
  if(latexchars.hasOwnProperty(i))
  {
   while(n.indexOf("\\"+i)!=-1)
   {
    n=n.replace("\\"+i,latexchars[i]);
   }
  }
 }
 return n.replace(/\*\(\)/g,"*(1)").replace(/\{ \}/g,"{1}").replace(/_\{([^\}\{]+)\}/g,"_$1").replace(/\}\{/g,")/(").replace(/\}/g,"))").replace(/([a-z]*)\{/g,"($1(").replace(/\\/g,"");;
}


var c = 299792458;
var G = 6.67300e-11;
var m_e = 5.9742e24;
var m_m = 7.36e22;
var m_s = 1.98892e30;
var R_E = 6378100;
var r_e = 6378100;
var h = 6.626068e-34;
var log2pi = 1.8378770664093453;


var e = Math.E;
var pi = Math.PI;
var phi = (1 + Math.sqrt(5)) / 2;
var epsilon_0 = 8.85418782e-12;

var sin = Math.sin;
var cos = Math.cos;
var tan = Math.tan;
var tg = Math.tan;
var exp = Math.exp;
//var log = Math.log;
var ln = Math.log;
var abs = Math.abs;
var acos = Math.acos;
var asin = Math.asin;
var atan = Math.atan;
var atan2 = Math.atan2;
var ceil = Math.ceil;
var floor = Math.floor;
var max = Math.max;
var min = Math.min;
var random = Math.random;
var round = Math.round;
var sqrt = Math.sqrt;
var pow = Math.pow;


function cosh(x){
    return 0.5*(exp(x)+exp(-x));
}
function sinh(x){
    return 0.5*(exp(x)-exp(-x));
}
function tanh(x){
    return (exp(x)-exp(-x))/(exp(x)+exp(-x));
}
function sech(x){
    return 1/cosh(x);
}
function cosech(x){
    return 1/sech(x);
}
function coth(x){
    return 1/tanh(x);
}

//Inverse hyperbolic functions
function acosh(x){
    return log(x+sqrt(x*x-1));
}
function asinh(x){
    return log(x+sqrt(x*x+1));
}
function atanh(x){
    return 0.5*log((1+x)/(1-x));
}

function ln_n(n,x){return pow(ln(x),n);}

function sin_n(n,x){return pow(sin(x),n);}
function cos_n(n,x){return pow(cos(x),n);}
function tan_n(n,x){return pow(tan(x),n);}
function cot_n(n,x){return pow(cot(x),n);}
function sec_n(n,x){return pow(sec(x),n);}
function csc_n(n,x){return pow(csc(x),n);}
function log_n(n,x){return pow(log(x),n);}

function cosh_n(n,x){return pow(cosh(x),n);}
function sinh_n(n,x){return pow(cosh(x),n);}
function tanh_n(n,x){return pow(cosh(x),n);}
function coth_n(n,x){return pow(coth(x),n);}
function sech_n(n,x){return pow(sech(x),n);}
function csch_n(n,x){return pow(csch(x),n);}

function logb(b, v) {
    return ln(v) / ln(b);
}
function log(v)
{
 logb(10, v);
}

function u(x) {
    //unit step function
    return (x>=0)?(x?1:0.5):(0);
}
function u_d(x){
	//discrete unit step function
    return (x>=0)?1:0;
}
function delta(x){
    if(x==0){
        return Infinity;
    }
    return 0;
}

function signum(x){
    return 2*u(x)-1;
}

function piecewise(cond, val, other) {
    if (cond) {
        return val;
    }
    return other;
}
function sinc(x) {
    if (x === 0) {
        return 1;
    }
    return sin(pi * x) / (pi * x);
}
function sec(x){return 1 / (cos(x));}
function csc(x){return 1 / (sin(x));}
function cot(x){return 1 / (tan(x));}
var ctg = cot;
var ctn = cot;
var cosec=csc;
//Bell numbers
var blln = [1,1,2,5,15,52,203,877,4140,21147,115975,678570,4213597,27644437,190899322,1382958545,10480142147,82864869804,682076806159,5832742205057,51724158235372,474869816156751,4506715738447323];

//Riemann zeta function
function zeta(x) {
    if (x === 0) {
        return -0.5;
    } else if (x == 1) {
        return Infinity;
    } else if (x == 2) {
        return pi * pi / 6;
    } else if (x == 4) {
        return pi * pi * pi * pi / 90;
    } else if (x < 1) {
        return Infinity;
    }
    var sum = 4.4 * pow(x, -5.1);
    for (var npw = 1; npw < 10; npw++) {
        sum += pow(npw, -x);
    }
    return sum;
}

function gammln(xx) {
    var j;
    var x,tmp,y,ser;
    var cof=[57.1562356658629235,-59.5979603554754912,14.1360979747417471,-0.491913816097620199,0.339946499848118887e-4,0.465236289270485756e-4,-0.983744753048795646e-4,0.158088703224912494e-3,-0.210264441724104883e-3,0.217439618115212643e-3,-0.164318106536763890e-3,0.844182239838527433e-4,-0.261908384015814087e-4,0.368991826595316234e-5];
    if (xx <= 0){
        throw("bad arg in gammln");
    }
    y=x=xx;
    tmp = x+5.24218750000000000;
    tmp = (x+0.5)*log(tmp)-tmp;
    ser = 0.999999999999997092;
    for (j=0;j<14;j++){
        ser += cof[j]/++y;
    }
    return tmp+log(2.5066282746310005*ser/x);
}
function Gamma(x){
    if(x==0){
        return Infinity;
    }
    if(x<0){
        return -pi/(x*sin(pi*x)*Gamma(-x));
    }
    return exp(gammln(x));
}

function old_gamma_function(x) {
    if (x > 1.0) {
        return (exp(x * (ln(x) - 1) + 0.5 * (-ln(x) + log2pi) + 1 / (12 * x) - 1 / (360 * (x * x * x)) + 1 / (1260 * pow(x, 5)) - 1 / (1680 * pow(x, 7))));
    }
    if (x > -0.5) {
        return (1.0 + 0.150917639897307 * x + 0.24425221666910216 * pow(x, 2)) / (x + 0.7281333047988399 * pow(x, 2) - 0.3245138289924575 * pow(x, 3));
    }
    if (x < 0) {
        if (x == ~~x) {
            return;
        } else {
            return Math.PI / (Math.sin(Math.PI * x) * Gamma((1 - x)));
        }
    } else {
        return pow(x - 1, x - 1) * Math.sqrt(2 * Math.PI * (x - 1)) * exp(1 - x + 1 / (12 * (x - 1) + 2 / (5 * (x - 1) + 53 / (42 * (x - 1)))));
    }
}

function psi(x) {
    return random();
}

function fact(ff) {
    if (ff === 0 || ff == 1) {
        return 1;
    } else if (ff > 0 && ff == ~~ff && ff < 15) {
        var s = 1;
        for (var nns = 1; nns <= ff; nns++) {
            s *= nns;
        }
        return~~s;
    } else if (ff != (~~ff) || ff < 0) {
        return Gamma(ff + 1);
    }
}
function doublefact(x){
    return pow(2,(x/2-1/4*cos(pi*x)+1/4))*pow(pi,(1/4*cos(pi*x)-1/4))*Gamma(x/2+1);
}
function bellb(x) {
    if (x == ~~x && x < blln.length) {
        return blln[x];
    } else {
        var sum = 0;
        for (var inj = 0; inj < 5; inj++) {
            sum += pow(inj, x) / fact(inj);
        }
        return sum / e;
    }
}



// 'lvl'th derivative of g[ia](x) when x = 'x'

var difflevel = 0; //Used to prevent massive stacks in the recursive djkb()

function djkb(ia, lvl, x) {
    difflevel++;
    var res;
    if (difflevel > 8) {
        difflevel -= 1;
        return 0;
    }
    var h = 0.0001;
    if (lvl > 0) {
        res = (djkb(ia, lvl - 1, x + h) - djkb(ia, lvl - 1, x - h)) / (2 * h);
        difflevel -= 1;
        return res;
    }
    res = g[ia](x);
    difflevel -= 1;
    return res;
}
/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cv(a){if(!ck[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){cl||(cl=c.createElement("iframe"),cl.frameBorder=cl.width=cl.height=0),b.appendChild(cl);if(!cm||!cl.createElement)cm=(cl.contentWindow||cl.contentDocument).document,cm.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),cm.close();d=cm.createElement(a),cm.body.appendChild(d),e=f.css(d,"display"),b.removeChild(cl)}ck[a]=e}return ck[a]}function cu(a,b){var c={};f.each(cq.concat.apply([],cq.slice(0,b)),function(){c[this]=a});return c}function ct(){cr=b}function cs(){setTimeout(ct,0);return cr=f.now()}function cj(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ci(){try{return new a.XMLHttpRequest}catch(b){}}function cc(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function cb(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function ca(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bE.test(a)?d(a,e):ca(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)ca(a+"["+e+"]",b[e],c,d);else d(a,b)}function b_(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function b$(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bT,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=b$(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=b$(a,c,d,e,"*",g));return l}function bZ(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bP),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bC(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bx:by,g=0,h=e.length;if(d>0){if(c!=="border")for(;g<h;g++)c||(d-=parseFloat(f.css(a,"padding"+e[g]))||0),c==="margin"?d+=parseFloat(f.css(a,c+e[g]))||0:d-=parseFloat(f.css(a,"border"+e[g]+"Width"))||0;return d+"px"}d=bz(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0;if(c)for(;g<h;g++)d+=parseFloat(f.css(a,"padding"+e[g]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+e[g]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+e[g]))||0);return d+"px"}function bp(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c+(i[c][d].namespace?".":"")+i[c][d].namespace,i[c][d],i[c][d].data)}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?parseFloat(d):j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.1",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?m(g):h==="function"&&(!a.unique||!o.has(g))&&c.push(g)},n=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,l=j||0,j=0,k=c.length;for(;c&&l<k;l++)if(c[l].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}i=!1,c&&(a.once?e===!0?o.disable():c=[]:d&&d.length&&(e=d.shift(),o.fireWith(e[0],e[1])))},o={add:function(){if(c){var a=c.length;m(arguments),i?k=c.length:e&&e!==!0&&(j=a,n(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){i&&f<=k&&(k--,f<=l&&l--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&o.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(i?a.once||d.push([b,c]):(!a.once||!e)&&n(b,c));return this},fire:function(){o.fireWith(this,arguments);return this},fired:function(){return!!e}};return o};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p,q=c.createElement("div"),r=c.documentElement;q.setAttribute("className","t"),q.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=q.getElementsByTagName("*"),e=q.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=q.getElementsByTagName("input")[0],b={leadingWhitespace:q.firstChild.nodeType===3,tbody:!q.getElementsByTagName("tbody").length,htmlSerialize:!!q.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:q.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete q.test}catch(s){b.deleteExpando=!1}!q.addEventListener&&q.attachEvent&&q.fireEvent&&(q.attachEvent("onclick",function(){b.noCloneEvent=!1}),q.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),q.appendChild(i),k=c.createDocumentFragment(),k.appendChild(q.lastChild),b.checkClone=k.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,k.removeChild(i),k.appendChild(q),q.innerHTML="",a.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",q.style.width="2px",q.appendChild(j),b.reliableMarginRight=(parseInt((a.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0);if(q.attachEvent)for(o in{submit:1,change:1,focusin:1})n="on"+o,p=n in q,p||(q.setAttribute(n,"return;"),p=typeof q[n]=="function"),b[o+"Bubbles"]=p;k.removeChild(q),k=g=h=j=q=i=null,f(function(){var a,d,e,g,h,i,j,k,m,n,o,r=c.getElementsByTagName("body")[0];!r||(j=1,k="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",m="visibility:hidden;border:0;",n="style='"+k+"border:5px solid #000;padding:0;'",o="<div "+n+"><div></div></div>"+"<table "+n+" cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",a=c.createElement("div"),a.style.cssText=m+"width:0;height:0;position:static;top:0;margin-top:"+j+"px",r.insertBefore(a,r.firstChild),q=c.createElement("div"),a.appendChild(q),q.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",l=q.getElementsByTagName("td"),p=l[0].offsetHeight===0,l[0].style.display="",l[1].style.display="none",b.reliableHiddenOffsets=p&&l[0].offsetHeight===0,q.innerHTML="",q.style.width=q.style.paddingLeft="1px",f.boxModel=b.boxModel=q.offsetWidth===2,typeof q.style.zoom!="undefined"&&(q.style.display="inline",q.style.zoom=1,b.inlineBlockNeedsLayout=q.offsetWidth===2,q.style.display="",q.innerHTML="<div style='width:4px;'></div>",b.shrinkWrapBlocks=q.offsetWidth!==2),q.style.cssText=k+m,q.innerHTML=o,d=q.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,i={doesNotAddBorder:e.offsetTop!==5,doesAddBorderForTableAndCells:h.offsetTop===5},e.style.position="fixed",e.style.top="20px",i.fixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",i.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,i.doesNotIncludeMarginInBodyOffset=r.offsetTop!==j,r.removeChild(a),q=a=null,f.extend(b,i))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h=null;if(typeof a=="undefined"){if(this.length){h=f.data(this[0]);if(this[0].nodeType===1&&!f._data(this[0],"parsedAttrs")){e=this[0].attributes;for(var i=0,j=e.length;i<j;i++)g=e[i].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),l(this[0],g,h[g]));f._data(this[0],"parsedAttrs",!0)}}return h}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split("."),d[1]=d[1]?"."+d[1]:"";if(c===b){h=this.triggerHandler("getData"+d[1]+"!",[d[0]]),h===b&&this.length&&(h=f.data(this[0],a),h=l(this[0],a,h));return h===b&&d[1]?this.data(d[0]):h}return this.each(function(){var b=f(this),e=[d[0],c];b.triggerHandler("setData"+d[1]+"!",e),f.data(this,a,c),b.triggerHandler("changeData"+d[1]+"!",e)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise()}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.nodeName.toLowerCase()]||f.valHooks[g.type];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;h<g;h++)e=d[h],e&&(c=f.propFix[e]||e,f.attr(a,e,""),a.removeAttribute(v?e:c),u.test(e)&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/\bhover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};
f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=[],j,k,l,m,n,o,p,q,r,s,t;g[0]=c,c.delegateTarget=this;if(e&&!c.target.disabled&&(!c.button||c.type!=="click")){m=f(this),m.context=this.ownerDocument||this;for(l=c.target;l!=this;l=l.parentNode||this){o={},q=[],m[0]=l;for(j=0;j<e;j++)r=d[j],s=r.selector,o[s]===b&&(o[s]=r.quick?H(l,r.quick):m.is(s)),o[s]&&q.push(r);q.length&&i.push({elem:l,matches:q})}}d.length>e&&i.push({elem:this,matches:d.slice(e)});for(j=0;j<i.length&&!c.isPropagationStopped();j++){p=i[j],c.currentTarget=p.elem;for(k=0;k<p.matches.length&&!c.isImmediatePropagationStopped();k++){r=p.matches[k];if(h||!c.namespace&&!r.namespace||c.namespace_re&&c.namespace_re.test(r.namespace))c.data=r.data,c.handleObj=r,n=((f.event.special[r.origType]||{}).handle||r.handler).apply(p.elem,g),n!==b&&(c.result=n,n===!1&&(c.preventDefault(),c.stopPropagation()))}}return c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0)}),d._submit_attached=!0)})},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on.call(this,a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.type+"."+e.namespace:e.type,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.POS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function()
{for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bp)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||!bc.test("<"+a.nodeName)?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=bg[l]||bg._default,n=m[0],o=b.createElement("div");b===c?bh.appendChild(o):U(b).appendChild(o),o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bn(k[i]);else bn(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||be.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bq=/alpha\([^)]*\)/i,br=/opacity=([^)]*)/,bs=/([A-Z]|^ms)/g,bt=/^-?\d+(?:px)?$/i,bu=/^-?\d/,bv=/^([\-+])=([\-+.\de]+)/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Left","Right"],by=["Top","Bottom"],bz,bA,bB;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bz(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bv.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bz)return bz(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return bC(a,b,d);f.swap(a,bw,function(){e=bC(a,b,d)});return e}},set:function(a,b){if(!bt.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return br.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bq,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bq.test(g)?g.replace(bq,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bz(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bA=function(a,b){var c,d,e;b=b.replace(bs,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b)));return c}),c.documentElement.currentStyle&&(bB=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f===null&&g&&(e=g[b])&&(f=e),!bt.test(f)&&bu.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f||0,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),bz=bA||bB,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bD=/%20/g,bE=/\[\]$/,bF=/\r?\n/g,bG=/#.*$/,bH=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bI=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bJ=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bK=/^(?:GET|HEAD)$/,bL=/^\/\//,bM=/\?/,bN=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bO=/^(?:select|textarea)/i,bP=/\s+/,bQ=/([?&])_=[^&]*/,bR=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bS=f.fn.load,bT={},bU={},bV,bW,bX=["*/"]+["*"];try{bV=e.href}catch(bY){bV=c.createElement("a"),bV.href="",bV=bV.href}bW=bR.exec(bV.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bS)return bS.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bN,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bO.test(this.nodeName)||bI.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bF,"\r\n")}}):{name:b.name,value:c.replace(bF,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b_(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b_(a,b);return a},ajaxSettings:{url:bV,isLocal:bJ.test(bW[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bX},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bZ(bT),ajaxTransport:bZ(bU),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?cb(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cc(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bH.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bG,"").replace(bL,bW[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bP),d.crossDomain==null&&(r=bR.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bW[1]&&r[2]==bW[2]&&(r[3]||(r[1]==="http:"?80:443))==(bW[3]||(bW[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),b$(bT,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bK.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bM.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bQ,"$1_="+x);d.url=y+(y===d.url?(bM.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bX+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=b$(bU,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)ca(g,a[g],c,e);return d.join("&").replace(bD,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cd=f.now(),ce=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cd++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ce.test(b.url)||e&&ce.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ce,l),b.url===j&&(e&&(k=k.replace(ce,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cf=a.ActiveXObject?function(){for(var a in ch)ch[a](0,1)}:!1,cg=0,ch;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ci()||cj()}:ci,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cf&&delete ch[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cg,cf&&(ch||(ch={},f(a).unload(cf)),ch[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var ck={},cl,cm,cn=/^(?:toggle|show|hide)$/,co=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cp,cq=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cr;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cu("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cv(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cu("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cu("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cv(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cn.test(h)?(o=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),o?(f._data(this,"toggle"+i,o==="show"?"hide":"show"),j[o]()):j[h]()):(k=co.exec(h),l=j.cur(),k?(m=parseFloat(k[2]),n=k[3]||(f.cssNumber[i]?"":"px"),n!=="px"&&(f.style(this,i,(m||1)+n),l=(m||1)/j.cur()*l,f.style(this,i,l+n)),k[1]&&(m=(k[1]==="-="?-1:1)*m+l),j.custom(l,m,n)):j.custom(l,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:cu("show",1),slideUp:cu("hide",1),slideToggle:cu("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cr||cs(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){e.options.hide&&f._data(e.elem,"fxshow"+e.prop)===b&&f._data(e.elem,"fxshow"+e.prop,e.start)},h()&&f.timers.push(h)&&!cp&&(cp=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cr||cs(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cp),cp=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(["width","height"],function(a,b){f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cy(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.support.fixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.support.fixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cy(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cy(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,d,"padding")):this[d]():null},f.fn["outer"+c]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,d,a?"margin":"border")):this[d]():null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNumeric(j)?j:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);


(function() {
    function jb() {
    }
    function kb(a) {
        var b = ib.call(arguments, 1);
        return function() {
            return a.apply(this, b)
        }
    }
    function lb(a, b) {
        if (!b)
            throw new Error("prayer failed: " + a)
    }
    function mb(b, d, e, f) {
        function q() {
            var b;
            l = a, b = g.selection ? "$" + g.selection.latex() + "$" : "", o.select(b)
        }
        var g, h, i, j, k, l, m, n, o, p = b.contents().detach();
        e || b.addClass("mathquill-rendered-math"), d.jQ = b.attr(fb, d.id), d.revert = function() {
            b.empty().unbind(".mathquill").removeClass("mathquill-rendered-math mathquill-editable mathquill-textbox").append(p)
        }, g = d.cursor = bb(d), d.renderLatex(p.text()), h = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) !== null, i = navigator.userAgent.match(/(Android|Silk|Kindle)/i) !== null, j = d.textarea = h || i ? db('<span class="textarea"><span tabindex=0></span></span>') : db('<span class="textarea"><textarea></textarea></span>'), k = j.children(), d.selectionChanged = function() {
            l === a && (l = setTimeout(q)), s(b[0])
        }, b.bind("selectstart.mathquill", function(a) {
            a.target !== k[0] && a.preventDefault(), a.stopPropagation()
        }), n = g.blink, b.bind("mousedown.mathquill", function(c) {
            function e(a) {
                g.seek(db(a.target), a.pageX, a.pageY), (g.prev !== m.prev || g.parent !== m.parent) && g.selectFrom(m), a.preventDefault()
            }
            function h(a) {
                return delete a.target, e(a)
            }
            function i() {
                m = a, g.blink = n, g.selection || (f ? g.show() : j.detach()), b.unbind("mousemove", e), db(b[0].ownerDocument).unbind("mousemove", h).unbind("mouseup", i)
            }
            setTimeout(function() {
                d.blurred && k.focus()
            }), g.blink = jb, g.seek(db(c.target), c.pageX, c.pageY), m = {parent: g.parent,prev: g.prev,next: g.next}, f || b.prepend(j), b.mousemove(e), db(b[0].ownerDocument).mousemove(h).mouseup(i), c.preventDefault()
        });
        if (!f) {
            o = c(k, {container: b}), b.bind("cut paste", !1).bind("copy", q).prepend('<span class="selectable">$' + d.latex() + "$</span>"), k.blur(function() {
                g.clearSelection(), setTimeout(r)
            });
            function r() {
                j.detach()
            }
            return
        }
        o = c(k, {container: b,key: function(a, b) {
                g.parent.bubble("onKey", a, b)
            },text: function(a) {
                g.parent.bubble("onText", a)
            },cut: function(a) {
                g.selection && setTimeout(function() {
                    g.prepareEdit(), g.parent.bubble("redraw"), d.triggerSpecialEvent("render")
                }), a.stopPropagation(), d.triggerSpecialEvent("render")
            },paste: function(a) {
                a.slice(0, 1) === "$" && a.slice(-1) === "$" && (a = a.slice(1, -1)), g.writeLatex(a).show(), d.triggerSpecialEvent("render")
            }}), b.prepend(j), b.addClass("mathquill-editable"), e && b.addClass("mathquill-textbox"), k.focus(function() {
            d.blurred = !1, g.parent || g.appendTo(d), g.parent.jQ.addClass("hasCursor"), g.selection ? (g.selection.jQ.removeClass("blur"), setTimeout(d.selectionChanged)) : g.show()
        }).blur(function() {
            d.blurred = !0, g.hide().parent.blur(), g.selection && g.selection.jQ.addClass("blur")
        }).blur(), b.bind("select_all", function() {
            g.prepareMove().appendTo(d);
            while (g.prev)
                g.selectLeft()
        }).bind("custom_paste", function(a, b) {
            b.slice(0, 1) === "$" && b.slice(-1) === "$" && (b = b.slice(1, -1)), g.writeLatex(b).show(), d.triggerSpecialEvent("render")
        })
    }
    function nb(a, c, d) {
        return b(K, {ctrlSeq: a,htmlTemplate: "<" + c + " " + d + ">&0</" + c + ">"})
    }
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, $, _, ab, bb, cb, db = jQuery, eb = "mathquill-command-id", fb = "mathquill-block-id", gb = Math.min, hb = Math.max, ib = [].slice;
    b = function(a, b, c) {
        function d(a) {
            return typeof a == "object"
        }
        function e(a) {
            return typeof a == "function"
        }
        function f(f, g) {
            function h(a) {
                var b = this;
                if (!(b instanceof h))
                    return new h(arguments);
                a && e(b.init) && b.init.apply(b, a)
            }
            g === c && (g = f, f = Object);
            var i = h[a] = new f, j = f[a], k, l = h.mixin = function(a) {
                k = {}, e(a) ? k = a.call(h, i, j, h, f) : d(a) && (k = a);
                if (d(k))
                    for (var c in k)
                        b.call(k, c) && (i[c] = k[c]);
                return e(i.init) || (i.init = function() {
                    f.apply(this, arguments)
                }), h
            };
            return i.constructor = h, l(g)
        }
        return f
    }("prototype", {}.hasOwnProperty), c = function() {
        function c(a) {
            var c = a.which || a.keyCode, d = b[c], e, f = [];
            return a.ctrlKey && f.push("Ctrl"), a.originalEvent && a.originalEvent.metaKey && f.push("Meta"), a.altKey && f.push("Alt"), a.shiftKey && f.push("Shift"), e = d || String.fromCharCode(c), !f.length && !d ? e : (f.push(e), f.join("-"))
        }
        var b = {8: "Backspace",9: "Tab",10: "Enter",13: "Enter",16: "Shift",17: "Control",18: "Alt",20: "CapsLock",27: "Esc",32: "Spacebar",33: "PageUp",34: "PageDown",35: "End",36: "Home",37: "Left",38: "Up",39: "Right",40: "Down",45: "Insert",46: "Del",144: "NumLock"};
        return function(d, e) {
            function p(a) {
                n = setTimeout(a), o = a
            }
            function q() {
                n && (clearTimeout(n), n = a, o())
            }
            function r(a) {
                q(), l.val(a), a && l[0].select()
            }
            function s() {
                var a = l[0];
                return "selectionStart" in a ? a.selectionStart !== a.selectionEnd : !1
            }
            function t(a) {
                var b = l.val();
                l.val(""), b && a(b)
            }
            function u() {
                i(c(f), f)
            }
            function v(a) {
                f = a, g = null, u()
            }
            function w(a) {
                f && g && u(), g = a, p(function() {
                    if (s())
                        return;
                    t(h)
                })
            }
            function x() {
                f = g = null
            }
            function y(a) {
                l.focus(), p(function() {
                    t(j)
                })
            }
            var f = null, g = null;
            e || (e = {});
            var h = e.text || jb, i = e.key || jb, j = e.paste || jb, k = e.cut || jb, l = db(d), m = db(e.container || l), n, o;
            return m.bind("keydown keypress input keyup focusout paste", q), m.bind({keydown: v,keypress: w,focusout: x,cut: k,paste: y}), {select: r}
        }
    }(), d = b(function(a, b, c) {
        function d(a, b) {
            throw a ? a = "'" + a + "'" : a = "EOF", "Parse Error: " + b + " at " + a
        }
        a.init = function(a) {
            this._ = a
        }, a.parse = function(a) {
            function b(a, b) {
                return b
            }
            return this.skip(q)._(a, b, d)
        }, a.or = function(a) {
            lb("or is passed a parser", a instanceof c);
            var b = this;
            return c(function(c, d, e) {
                function f(b) {
                    return a._(c, d, e)
                }
                return b._(c, d, f)
            })
        }, a.then = function(a) {
            var b = this;
            return c(function(d, e, f) {
                function g(b, d) {
                    var g = a instanceof c ? a : a(d);
                    return lb("a parser is returned", g instanceof c), g._(b, e, f)
                }
                return b._(d, g, f)
            })
        }, a.many = function() {
            var a = this;
            return c(function(b, c, d) {
                function f(a, c) {
                    return b = a, e.push(c), !0
                }
                function g() {
                    return !1
                }
                var e = [];
                while (a._(b, f, g))
                    ;
                return c(b, e)
            })
        }, a.times = function(a, b) {
            arguments.length < 2 && (b = a);
            var d = this;
            return c(function(c, e, f) {
                function k(a, b) {
                    return g.push(b), c = a, !0
                }
                function l(a, b) {
                    return i = b, c = a, !1
                }
                function m(a, b) {
                    return !1
                }
                var g = [], h = !0, i;
                for (var j = 0; j < a; j += 1) {
                    h = d._(c, k, l);
                    if (!h)
                        return f(c, i)
                }
                for (; j < b && h; j += 1)
                    h = d._(c, k, m);
                return e(c, g)
            })
        }, a.result = function(a) {
            return this.then(g(a))
        }, a.atMost = function(a) {
            return this.times(0, a)
        }, a.atLeast = function(a) {
            var b = this;
            return b.times(a).then(function(a) {
                return b.many().map(function(b) {
                    return a.concat(b)
                })
            })
        }, a.map = function(a) {
            return this.then(function(b) {
                return g(a(b))
            })
        }, a.skip = function(a) {
            return this.then(function(b) {
                return a.result(b)
            })
        };
        var e = this.string = function(a) {
            var b = a.length, d = "expected '" + a + "'";
            return c(function(c, e, f) {
                var g = c.slice(0, b);
                return g === a ? e(c.slice(b), g) : f(c, d)
            })
        }, f = this.regex = function(a) {
            lb("regexp parser is anchored", a.toString().charAt(1) === "^");
            var b = "expected " + a;
            return c(function(c, d, e) {
                var f = a.exec(c);
                if (f) {
                    var g = f[0];
                    return d(c.slice(g.length), g)
                }
                return e(c, b)
            })
        }, g = c.succeed = function(a) {
            return c(function(b, c) {
                return c(b, a)
            })
        }, h = c.fail = function(a) {
            return c(function(b, c, d) {
                return d(b, a)
            })
        }, i = c.letter = f(/^[a-z]/i), j = c.letters = f(/^[a-z]*/i), k = c.digit = f(/^[0-9]/), l = c.digits = f(/^[0-9]*/), m = c.whitespace = f(/^\s+/), n = c.optWhitespace = f(/^\s*/), o = c.any = c(function(a, b, c) {
            return a ? b(a.slice(1), a.charAt(0)) : c(a, "expected any character")
        }), p = c.all = c(function(a, b, c) {
            return b("", a)
        }), q = c.eof = c(function(a, b, c) {
            return a ? c(a, "expected EOF") : b(a, a)
        })
    }), e = b(function(a) {
        a.prev = 0, a.next = 0, a.parent = 0, a.firstChild = 0, a.lastChild = 0, a.children = function() {
            return f(this.firstChild, this.lastChild)
        }, a.eachChild = function(a) {
            return this.children().each(a)
        }, a.foldChildren = function(a, b) {
            return this.children().fold(a, b)
        }, a.adopt = function(a, b, c) {
            return f(this, this).adopt(a, b, c), this
        }, a.disown = function() {
            return f(this, this).disown(), this
        }
    }), f = b(function(a) {
        function b(a, b, c) {
            lb("a parent is always present", a), lb("prev is properly set up", function() {
                return b ? b.next === c && b.parent === a : a.firstChild === c
            }()), lb("next is properly set up", function() {
                return c ? c.prev === b && c.parent === a : a.lastChild === b
            }())
        }
        a.first = 0, a.last = 0, a.init = function(a, b) {
            lb("no half-empty fragments", !a == !b);
            if (!a)
                return;
            lb("first node is passed to Fragment", a instanceof e), lb("last node is passed to Fragment", b instanceof e), lb("first and last have the same parent", a.parent === b.parent), this.first = a, this.last = b
        }, a.adopt = function(a, c, d) {
            b(a, c, d);
            var e = this;
            e.disowned = !1;
            var f = e.first;
            if (!f)
                return this;
            var g = e.last;
            return c || (a.firstChild = f), d ? d.prev = g : a.lastChild = g, e.last.next = d, e.each(function(b) {
                b.prev = c, b.parent = a, c && (c.next = b), c = b
            }), e
        }, a.disown = function() {
            var a = this, c = a.first;
            if (!c || a.disowned)
                return a;
            a.disowned = !0;
            var d = a.last, e = c.parent;
            return b(e, c.prev, c), b(e, d, d.next), c.prev ? c.prev.next = d.next : e.firstChild = d.next, d.next ? d.next.prev = c.prev : e.lastChild = c.prev, a
        }, a.each = function(a) {
            var b = this, c = b.first;
            if (!c)
                return b;
            for (; c !== b.last.next; c = c.next)
                if (a.call(b, c) === !1)
                    break;
            return b
        }, a.fold = function(a, b) {
            return this.each(function(c) {
                a = b.call(this, a, c)
            }), a
        }
    }), g = function() {
        var a = 0;
        return function() {
            return a += 1
        }
    }(), h = b(e, function(a) {
        a.init = function(a) {
            this.id = g(), h[this.id] = this
        }, a.toString = function() {
            return "[MathElement " + this.id + "]"
        }, a.bubble = function(a) {
            var b = ib.call(arguments, 1);
            for (var c = this; c; c = c.parent) {
                var d = c[a] && c[a].apply(c, b);
                if (d === !1)
                    break
            }
            return this
        }, a.postOrder = function(a) {
            var b = ib.call(arguments, 1);
            if (typeof a == "string") {
                var c = a;
                a = function(a) {
                    c in a && a[c].apply(a, arguments)
                }
            }
            (function d(b) {
                b.eachChild(d), a(b)
            })(this)
        }, a.jQ = db(), a.jQadd = function(a) {
            this.jQ = this.jQ.add(a)
        }, this.jQize = function(a) {
            var b = db(a);
            return b.find("*").andSelf().each(function() {
                var a = db(this), b = a.attr("mathquill-command-id"), c = a.attr("mathquill-block-id");
                b && h[b].jQadd(a), c && h[c].jQadd(a)
            }), b
        }, a.finalizeInsert = function() {
            var a = this;
            a.postOrder("finalizeTree"), a.postOrder("blur"), a.postOrder("respace"), a.next.respace && a.next.respace(), a.prev.respace && a.prev.respace(), a.postOrder("redraw"), a.bubble("redraw")
        }
    }), i = b(h, function(a, b) {
        a.init = function(a, c, d) {
            var e = this;
            b.init.call(e), e.ctrlSeq || (e.ctrlSeq = a), c && (e.htmlTemplate = c), d && (e.textTemplate = d)
        }, a.replaces = function(a) {
            a.disown(), this.replacedFragment = a
        }, a.isEmpty = function() {
            return this.foldChildren(!0, function(a, b) {
                return a && b.isEmpty()
            })
        }, a.parser = function() {
            var a = ab.block, b = this;
            return a.times(b.numBlocks()).map(function(a) {
                b.blocks = a;
                for (var c = 0; c < a.length; c += 1)
                    a[c].adopt(b, b.lastChild, 0);
                return b
            })
        }, a.createBefore = function(a) {
            var b = this, c = b.replacedFragment;
            b.createBlocks(), h.jQize(b.html()), c && (c.adopt(b.firstChild, 0, 0), c.jQ.appendTo(b.firstChild.jQ)), a.jQ.before(b.jQ), a.prev = b.adopt(a.parent, a.prev, a.next), b.finalizeInsert(a), b.placeCursor(a)
        }, a.createBlocks = function() {
            var a = this, b = a.numBlocks(), c = a.blocks = Array(b);
            for (var d = 0; d < b; d += 1) {
                var e = c[d] = k();
                e.adopt(a, a.lastChild, 0)
            }
        }, a.respace = jb, a.placeCursor = function(a) {
            a.appendTo(this.foldChildren(this.firstChild, function(a, b) {
                return a.isEmpty() ? a : b
            }))
        }, a.remove = function() {
            return this.disown(), this.jQ.remove(), this.postOrder(function(a) {
                delete h[a.id]
            }), this
        }, a.numBlocks = function() {
            var a = this.htmlTemplate.match(/&\d+/g);
            return a ? a.length : 0
        }, a.html = function() {
            var a = this, b = a.blocks, c = " mathquill-command-id=" + a.id, d = a.htmlTemplate.match(/<[^<>]+>|[^<>]+/g);
            lb("no unmatched angle brackets", d.join("") === this.htmlTemplate);
            for (var e = 0, f = d[0]; f; e += 1, f = d[e])
                if (f.slice(-2) === "/>")
                    d[e] = f.slice(0, -2) + c + "/>";
                else if (f.charAt(0) === "<") {
                    lb("not an unmatched top-level close tag", f.charAt(1) !== "/"), d[e] = f.slice(0, -1) + c + ">";
                    var g = 1;
                    do
                        e += 1, f = d[e], lb("no missing close tags", f), f.slice(0, 2) === "</" ? g -= 1 : f.charAt(0) === "<" && f.slice(-2) !== "/>" && (g += 1);
                    while (g > 0)
                }
            return d.join("").replace(/>&(\d+)/g, function(a, c) {
                return " mathquill-block-id=" + b[c].id + ">" + b[c].join("html")
            })
        }, a.latex = function() {
            return this.foldChildren(this.ctrlSeq, function(a, b) {
                return a + "{" + (b.latex() || " ") + "}"
            })
        }, a.textTemplate = [""], a.text = function() {
            var a = 0;
            return this.foldChildren(this.textTemplate[a], function(b, c) {
                a += 1;
                var d = c.text();
                return b && this.textTemplate[a] === "(" && d[0] === "(" && d.slice(-1) === ")" ? b + d.slice(1, -1) + this.textTemplate[a] : b + c.text() + (this.textTemplate[a] || "")
            })
        }
    }), j = b(i, function(a, b) {
        a.init = function(a, c, d) {
            d || (d = a && a.length > 1 ? a.slice(1) : a), b.init.call(this, a, c, [d])
        }, a.parser = function() {
            return d.succeed(this)
        }, a.numBlocks = function() {
            return 0
        }, a.replaces = function(a) {
            a.remove()
        }, a.createBlocks = jb, a.latex = function() {
            return this.ctrlSeq
        }, a.text = function() {
            return this.textTemplate
        }, a.placeCursor = jb, a.isEmpty = function() {
            return !0
        }
    }), k = b(h, function(a) {
        a.join = function(a) {
            return this.foldChildren("", function(b, c) {
                return b + c[a]()
            })
        }, a.latex = function() {
            return this.join("latex")
        }, a.text = function() {
            return this.firstChild === this.lastChild ? this.firstChild.text() : "(" + this.join("text") + ")"
        }, a.isEmpty = function() {
            return this.firstChild === 0 && this.lastChild === 0
        }, a.focus = function() {
            return this.jQ.addClass("hasCursor"), this.jQ.removeClass("empty"), this
        }, a.blur = function() {
            return this.jQ.removeClass("hasCursor"), this.isEmpty() && this.jQ.addClass("empty"), this
        }
    }), l = b(f, function(a, b) {
        a.init = function(a, c) {
            b.init.call(this, a, c || a), this.jQ = this.fold(db(), function(a, b) {
                return b.jQ.add(a)
            })
        }, a.latex = function() {
            return this.fold("", function(a, b) {
                return a + b.latex()
            })
        }, a.remove = function() {
            return this.jQ.remove(), this.each(function(a) {
                a.postOrder(function(a) {
                    delete h[a.id]
                })
            }), this.disown()
        }
    }), m = b(k, function(a, b) {
        a.latex = function() {
            return b.latex.call(this).replace(/(\\[a-z]+) (?![a-z])/ig, "$1")
        }, a.text = function() {
            return this.foldChildren("", function(a, b) {
                return a + b.text()
            })
        }, a.renderLatex = function(a) {
            var b = this.jQ;
            b.children().slice(1).remove(), this.firstChild = this.lastChild = 0, this.cursor.appendTo(this).writeLatex(a)
        }, a.up = function() {
            this.triggerSpecialEvent("upPressed")
        }, a.down = function() {
            this.triggerSpecialEvent("downPressed")
        }, a.moveOutOf = function(a) {
            this.triggerSpecialEvent(a + "Pressed")
        }, a.onKey = function(a, b) {
            switch (a) {
                case "Ctrl-Shift-Backspace":
                case "Ctrl-Backspace":
                    while (this.cursor.prev || this.cursor.selection)
                        this.cursor.backspace();
                    break;
                case "Shift-Backspace":
                case "Backspace":
                    this.cursor.backspace(), this.triggerSpecialEvent("render");
                    break;
                case "Esc":
                case "Tab":
                    var c = this.cursor.parent;
                    if (c === this.cursor.root)
                        return;
                    this.cursor.prepareMove(), c.next ? this.cursor.prependTo(c.next) : this.cursor.insertAfter(c.parent);
                    break;
                case "Shift-Tab":
                case "Shift-Esc":
                    var c = this.cursor.parent;
                    if (c === this.cursor.root)
                        return;
                    this.cursor.prepareMove(), c.prev ? this.cursor.appendTo(c.prev) : this.cursor.insertBefore(c.parent);
                    break;
                case "Enter":
                    this.triggerSpecialEvent("enterPressed");
                    break;
                case "End":
                    this.cursor.prepareMove().appendTo(this.cursor.parent);
                    break;
                case "Ctrl-End":
                    this.cursor.prepareMove().appendTo(this);
                    break;
                case "Shift-End":
                    while (this.cursor.next)
                        this.cursor.selectRight();
                    break;
                case "Ctrl-Shift-End":
                    while (this.cursor.next || this.cursor.parent !== this)
                        this.cursor.selectRight();
                    break;
                case "Home":
                    this.cursor.prepareMove().prependTo(this.cursor.parent);
                    break;
                case "Ctrl-Home":
                    this.cursor.prepareMove().prependTo(this);
                    break;
                case "Shift-Home":
                    while (this.cursor.prev)
                        this.cursor.selectLeft();
                    break;
                case "Ctrl-Shift-Home":
                    while (this.cursor.prev || this.cursor.parent !== this)
                        this.cursor.selectLeft();
                    break;
                case "Left":
                    this.cursor.moveLeft();
                    break;
                case "Shift-Left":
                    this.cursor.selectLeft();
                    break;
                case "Ctrl-Left":
                    break;
                case "Right":
                    this.cursor.moveRight();
                    break;
                case "Shift-Right":
                    this.cursor.selectRight();
                    break;
                case "Ctrl-Right":
                    break;
                case "Up":
                    this.cursor.moveUp();
                    break;
                case "Down":
                    this.cursor.moveDown();
                    break;
                case "Shift-Up":
                    if (this.cursor.prev)
                        while (this.cursor.prev)
                            this.cursor.selectLeft();
                    else
                        this.cursor.selectLeft();
                case "Shift-Down":
                    if (this.cursor.next)
                        while (this.cursor.next)
                            this.cursor.selectRight();
                    else
                        this.cursor.selectRight();
                case "Ctrl-Up":
                    break;
                case "Ctrl-Down":
                    break;
                case "Ctrl-Shift-Del":
                case "Ctrl-Del":
                    while (this.cursor.next || this.cursor.selection)
                        this.cursor.deleteForward();
                    this.triggerSpecialEvent("render");
                    break;
                case "Shift-Del":
                case "Del":
                    this.cursor.deleteForward(), this.triggerSpecialEvent("render");
                    break;
                case "Meta-A":
                case "Ctrl-A":
                    if (this !== this.cursor.root)
                        return;
                    this.cursor.prepareMove().appendTo(this);
                    while (this.cursor.prev)
                        this.cursor.selectLeft();
                    break;
                default:
                    return !1
            }
            return b.preventDefault(), !1
        }, a.onText = function(a) {
            if (a != "^" && a != "_" || !!this.cursor.prev)
                return (a == "+" || a == "=" || a == "-") && this.cursor.parent.parent.ctrlSeq === "^" && !this.cursor.next && this.cursor.prev && this.cursor.moveRight(), this.cursor.write(a), this.triggerSpecialEvent("render"), !1;
            return
        }, a.triggerSpecialEvent = function(a) {
            var b = this.jQ;
            setTimeout(function() {
                b.trigger(a)
            }, 1)
        }
    }), n = b(i, function(a, b) {
        a.init = function(a) {
            b.init.call(this, "$"), this.cursor = a
        }, a.htmlTemplate = '<span class="mathquill-rendered-math">&0</span>', a.createBlocks = function() {
            this.firstChild = this.lastChild = m(), this.blocks = [this.firstChild], this.firstChild.parent = this;
            var a = this.firstChild.cursor = this.cursor;
            this.firstChild.onText = function(b) {
                return b !== "$" || a.parent !== this ? a.write(b) : this.isEmpty() ? a.insertAfter(this.parent).backspace().insertNew(W("\\$", "$")).show() : a.next ? a.prev ? a.write(b) : a.insertBefore(this.parent) : a.insertAfter(this.parent), !1
            }
        }, a.latex = function() {
            return "$" + this.firstChild.latex() + "$"
        }
    }), o = b(k, function(a) {
        a.renderLatex = function(a) {
            var b = this, c = b.cursor;
            b.jQ.children().slice(1).remove(), b.firstChild = b.lastChild = 0, c.show().appendTo(b);
            var e = d.regex, f = d.string, g = d.eof, i = d.all, j = f("$").then(ab).skip(f("$").or(g)).map(function(a) {
                var b = n(c);
                b.createBlocks();
                var d = b.firstChild;
                return a.children().adopt(d, 0, 0), b
            }), k = f("\\$").result("$"), l = k.or(e(/^[^$]/)).map(W), m = j.or(l).many(), o = m.skip(g).or(i.result(!1)).parse(a);
            if (o) {
                for (var p = 0; p < o.length; p += 1)
                    o[p].adopt(b, b.lastChild, 0);
                var q = b.join("html");
                h.jQize(q).appendTo(b.jQ), this.finalizeInsert()
            }
        }, a.onKey = m.prototype.onKey, a.onText = function(a) {
            return this.cursor.prepareEdit(), a === "$" ? this.cursor.insertNew(n(this.cursor)) : this.cursor.insertNew(W(a)), !1
        }
    }), p = {}, q = {}, s = jb, t = document.createElement("div"), u = t.style, v = {transform: 1,WebkitTransform: 1,MozTransform: 1,OTransform: 1,msTransform: 1};
    for (x in v)
        if (x in u) {
            w = x;
            break
        }
    w ? r = function(a, b, c) {
        a.css(w, "scale(" + b + "," + c + ")")
    } : "filter" in u ? (s = function(a) {
        a.className = a.className
    }, r = function(a, b, c) {
        function f() {
            a.css("marginRight", (d.width() - 1) * (b - 1) / b + "px")
        }
        var d, e;
        b /= 1 + (c - 1) / 2, a.css("fontSize", c + "em"), a.hasClass("matrixed-container") || a.addClass("matrixed-container").wrapInner('<span class="matrixed"></span>'), d = a.children().css("filter", "progid:DXImageTransform.Microsoft.Matrix(M11=" + b + ",SizingMethod='auto expand')"), f(), e = setInterval(f), db(window).load(function() {
            clearTimeout(e), f()
        })
    }) : r = function(a, b, c) {
        a.css("fontSize", c + "em")
    }, y = b(i, function(a, b) {
        a.init = function(a, c, d) {
            b.init.call(this, a, "<" + c + " " + d + ">&0</" + c + ">")
        }
    }), q.mathrm = kb(y, "\\mathrm", "span", 'class="roman font"'), q.mathit = kb(y, "\\mathit", "i", 'class="font"'), q.mathbf = kb(y, "\\mathbf", "b", 'class="font"'), q.mathsf = kb(y, "\\mathsf", "span", 'class="sans-serif font"'), q.mathtt = kb(y, "\\mathtt", "span", 'class="monospace font"'), q.underline = kb(y, "\\underline", "span", 'class="non-leaf underline"'), q.overline = q.bar = kb(y, "\\overline", "span", 'class="non-leaf overline"'), z = b(i, function(a, b) {
        function c(a) {
            var b = this.parent, c = a;
            do {
                if (c.prev)
                    return a.insertAfter(b), !1;
                c = c.parent.parent
            } while (c !== b);
            return a.insertBefore(b), !1
        }
        function d(a) {
            var b = this.parent, c = a;
            do {
                if (c.next)
                    return a.insertBefore(b), !1;
                c = c.parent.parent
            } while (c !== b);
            return a.insertAfter(b), !1
        }
        a.init = function(a, c, d) {
            b.init.call(this, a, "<" + c + ' class="non-leaf"><span class="non-leaf ' + c + '">&0</span></' + c + ">", [d])
        }, a.finalizeTree = function() {
            lb("SupSub is only _ and ^", this.ctrlSeq === "^" || this.ctrlSeq === "_");
            if (this.prev instanceof _ && this.prev.ctrlSeq !== "\\int ") {
                var a = this.prev, b = this.firstChild;
                this.ctrlSeq === "_" ? (b.adopt(a, 0, a.firstChild), db('<span class="from"></span>').append(b.jQ.removeClass("sub")).appendTo(a.jQ), a.down = b, b.up = c) : (b.adopt(a, a.lastChild, 0), db('<span class="to"></span>').append(b.jQ.removeClass("sup")).prependTo(a.jQ), a.up = b, b.down = c), this.disown(), this.respace = jb;
                return
            }
            this.ctrlSeq === "_" ? (this.down = this.firstChild, this.firstChild.up = d) : (this.up = this.firstChild, this.firstChild.down = d)
        }, a.latex = function() {
            if (this.ctrlSeq === "_" && this.respaced)
                return "";
            var a = "";
            if (this.ctrlSeq === "^" && this.next.respaced) {
                var b = this.next.firstChild.latex();
                b.length === 1 ? a += "_" + b : a += "_{" + b + "}"
            }
            var b = this.firstChild.latex();
            return b.length === 1 ? a += this.ctrlSeq + b : a += this.ctrlSeq + "{" + (b || " ") + "}", a
        }, a.redraw = function() {
            this.prev && this.prev.respace(), this.prev instanceof z || (this.respace(), this.next && !(this.next instanceof z) && this.next.respace())
        }, a.respace = function() {
            this.prev.ctrlSeq === "\\int " || this.prev instanceof z && this.prev.ctrlSeq != this.ctrlSeq && this.prev.prev && this.prev.prev.ctrlSeq === "\\int " ? this["int"] || (this["int"] = !0, this.jQ.addClass("int")) : this["int"] && (this["int"] = !1, this.jQ.removeClass("int")), this.respaced = this.prev instanceof z && this.prev.ctrlSeq != this.ctrlSeq && !this.prev.respaced;
            if (this.respaced) {
                var a = +this.jQ.css("fontSize").slice(0, -2), b = this.prev.jQ.outerWidth(), c = this.jQ.outerWidth();
                this.jQ.css({left: (this["int"] && this.ctrlSeq === "_" ? -0.25 : 0) - b / a + "em",marginRight: .1 - gb(c, b) / a + "em"})
            } else
                this["int"] && this.ctrlSeq === "_" ? this.jQ.css({left: "-.25em",marginRight: ""}) : this.jQ.css({left: "",marginRight: ""});
            return this.respaced ? this.ctrlSeq === "^" ? this.down = this.firstChild.down = this.prev.firstChild : this.up = this.firstChild.up = this.prev.firstChild : this.next.respaced ? this.ctrlSeq === "_" ? this.up = this.firstChild.up = this.next.firstChild : this.down = this.firstChild.down = this.next.firstChild : this.ctrlSeq === "_" ? (delete this.up, this.firstChild.up = d) : (delete this.down, this.firstChild.down = d), this.next instanceof z && this.next.respace(), this
        }, a.onKey = function(a, b) {
            if (this.getCursor().parent.parent !== this)
                return;
            switch (a) {
                case "Tab":
                    if (this.next.respaced)
                        return this.getCursor().prepareMove().prependTo(this.next.firstChild), b.preventDefault(), !1;
                    break;
                case "Shift-Tab":
                    if (this.respaced)
                        return this.getCursor().prepareMove().appendTo(this.prev.firstChild), b.preventDefault(), !1;
                    break;
                case "Left":
                    if (!this.getCursor().prev && this.respaced)
                        return this.getCursor().prepareMove().insertBefore(this.prev), !1;
                    break;
                case "Right":
                    if (!this.getCursor().next && this.next.respaced)
                        return this.getCursor().prepareMove().insertAfter(this.next), !1
            }
        }, a.getCursor = function() {
            var a;
            for (var b = this.parent; !a; b = b.parent)
                a = b.cursor;
            return this.getCursor = function() {
                return a
            }, this.getCursor()
        }
    }), q.subscript = q._ = kb(z, "_", "sub", "_"), q.superscript = q.supscript = q["^"] = kb(z, "^", "sup", "**"), A = q.frac = q.dfrac = q.cfrac = q.fraction = b(i, function(a, b) {
        a.ctrlSeq = "\\frac", a.htmlTemplate = '<span class="fraction non-leaf"><span class="numerator">&0</span><span class="denominator">&1</span><span style="display:inline-block;width:0">&nbsp;</span></span>', a.textTemplate = ["(", "/", ")"], a.finalizeTree = function() {
            this.up = this.lastChild.up = this.firstChild, this.down = this.firstChild.down = this.lastChild
        }
    }), B = q.over = p["/"] = b(A, function(a, b) {
        a.createBefore = function(a) {
            if (!this.replacedFragment) {
                var c = a.prev;
                while (c && !(c instanceof Z || c instanceof K || c instanceof _ || c.ctrlSeq === "," || c.ctrlSeq === ":" || c.ctrlSeq === "\\space "))
                    c = c.prev;
                c instanceof _ && c.next instanceof z && (c = c.next, c.next instanceof z && c.next.ctrlSeq != c.ctrlSeq && (c = c.next)), c !== a.prev && (this.replaces(l(c.next || a.parent.firstChild, a.prev)), a.prev = c)
            }
            b.createBefore.call(this, a)
        }
    }), C = q.sqrt = q["√"] = b(i, function(a, b) {
        a.ctrlSeq = "\\sqrt", a.htmlTemplate = '<span class="non-leaf"><span class="scaled sqrt-prefix">&radic;</span><span class="non-leaf sqrt-stem">&0</span></span>', a.textTemplate = ["sqrt(", ")"], a.parser = function() {
            return ab.optBlock.then(function(a) {
                return ab.block.map(function(b) {
                    var c = D();
                    return c.blocks = [a, b], a.adopt(c, 0, 0), b.adopt(c, a, 0), c
                })
            }).or(b.parser.call(this))
        }, a.redraw = function() {
            var a = this.lastChild.jQ;
            r(a.prev(), 1, a.innerHeight() / +a.css("fontSize").slice(0, -2) - .1)
        }
    }), D = q.nthroot = b(C, function(a, b) {
        a.htmlTemplate = '<sup class="nthroot non-leaf">&0</sup><span class="scaled"><span class="sqrt-prefix scaled">&radic;</span><span class="sqrt-stem non-leaf">&1</span></span>', a.textTemplate = ["sqrt[", "](", ")"], a.latex = function() {
            return "\\sqrt[" + this.firstChild.latex() + "]{" + this.lastChild.latex() + "}"
        }, a.onKey = function(a, b) {
            if (this.getCursor().parent.parent !== this)
                return;
            switch (a) {
                case "Right":
                    if (this.getCursor().next)
                        return;
                case "Tab":
                    if (this.getCursor().parent === this.firstChild)
                        return this.getCursor().prepareMove().prependTo(this.lastChild), b.preventDefault(), !1;
                    break;
                case "Left":
                    if (this.getCursor().prev)
                        return;
                case "Shift-Tab":
                    if (this.getCursor().parent === this.lastChild)
                        return this.getCursor().prepareMove().appendTo(this.firstChild), b.preventDefault(), !1
            }
        }, a.getCursor = z.prototype.getCursor
    }), E = b(i, function(a, b) {
        a.init = function(a, c, d, e) {
            b.init.call(this, "\\left" + d, '<span class="non-leaf"><span class="scaled paren">' + a + "</span>" + '<span class="non-leaf">&0</span>' + '<span class="scaled paren">' + c + "</span>" + "</span>", [a, c]), this.end = "\\right" + e
        }, a.jQadd = function() {
            b.jQadd.apply(this, arguments);
            var a = this.jQ;
            this.bracketjQs = a.children(":first").add(a.children(":last"))
        }, a.finalizeTree = function() {
            if (this.firstChild.isEmpty() && this.next) {
                var a = l(this.next, this.parent.lastChild).disown();
                a.adopt(this.firstChild, 0, 0), a.jQ.appendTo(this.firstChild.jQ)
            }
        }, a.placeCursor = function(a) {
            a.prependTo(this.firstChild)
        }, a.latex = function() {
            return this.ctrlSeq + this.firstChild.latex() + this.end
        }, a.redraw = function() {
            var a = this.firstChild.jQ, b = a.outerHeight() / +a.css("fontSize").slice(0, -2);
            r(this.bracketjQs, gb(1 + .2 * (b - 1), 1.2), 1.05 * b)
        }
    }), q.left = b(i, function(a) {
        a.parser = function() {
            var a, b, c, e = d.regex, f = d.string;
            return e = d.regex, a = d.succeed, b = ab.block, c = d.optWhitespace, c.then(e(/^(?:[([|]|\\\{)/)).then(function(b) {
                var g;
                return b.charAt(0) === "\\" && (b = b.slice(1)), g = p[b](), ab.map(function(a) {
                    g.blocks = [a], a.adopt(g, 0, 0)
                }).then(f("\\right")).skip(c).then(e(/^(?:[\])|]|\\\})/)).then(function(b) {
                    return b.slice(-1) !== g.end.slice(-1) ? d.fail("open doesn't match close") : a(g)
                })
            })
        }
    }), q.right = b(i, function(a) {
        a.parser = function() {
            return d.fail("unmatched \\right")
        }
    }), q.lbrace = p["{"] = kb(E, "{", "}", "\\{", "\\}"), q.langle = q.lang = kb(E, "&lang;", "&rang;", "\\langle ", "\\rangle "), F = b(E, function(a, b) {
        a.createBefore = function(a) {
            if (this.replacedFragment)
                return b.createBefore.call(this, a);
            var c = a.parent.parent;
            if (c.ctrlSeq === this.ctrlSeq) {
                if (a.next) {
                    var d = l(a.next, c.firstChild.lastChild).disown();
                    d.adopt(c.parent, c, c.next), d.jQ.insertAfter(c.jQ), a.next.respace && a.next.respace()
                }
                a.insertAfter(c), c.bubble("redraw")
            } else
                b.createBefore.call(this, a), a.appendTo(this.firstChild)
        }, a.finalizeTree = jb, a.placeCursor = function(a) {
            this.firstChild.blur(), a.insertAfter(this)
        }
    }), q.rbrace = p["}"] = kb(F, "{", "}", "\\{", "\\}"), q.rangle = q.rang = kb(F, "&lang;", "&rang;", "\\langle ", "\\rangle "), G = function(a, b) {
        a.init = function(a, c) {
            b.init.call(this, a, c, a, c)
        }
    }, H = b(E, G), q.lparen = p["("] = kb(H, "(", ")"), q.lbrack = q.lbracket = p["["] = kb(H, "[", "]"), I = b(F, G), q.rparen = p[")"] = kb(I, "(", ")"), q.rbrack = q.rbracket = p["]"] = kb(I, "[", "]"), J = q.lpipe = q.rpipe = p["|"] = b(H, function(a, b) {
        a.init = function() {
            b.init.call(this, "|", "|")
        }, a.createBefore = function(a) {
            !a.next && a.parent.parent && a.parent.parent.end === this.end && !this.replacedFragment ? a.insertAfter(a.parent.parent) : i.prototype.createBefore.call(this, a)
        }, a.finalizeTree = jb
    }), K = p.$ = q.text = q.textnormal = q.textrm = q.textup = q.textmd = b(i, function(a, b) {
        a.ctrlSeq = "\\text", a.htmlTemplate = '<span class="text">&0</span>', a.replaces = function(a) {
            a instanceof l ? this.replacedText = a.remove().jQ.text() : typeof a == "string" && (this.replacedText = a)
        }, a.textTemplate = ['"', '"'], a.parser = function() {
            var a = d.string, b = d.regex, c = d.optWhitespace;
            return c.then(a("{")).then(b(/^[^}]*/)).skip(a("}")).map(function(a) {
                var b = K();
                b.createBlocks();
                var c = b.firstChild;
                for (var d = 0; d < a.length; d += 1) {
                    var e = W(a.charAt(d));
                    e.adopt(c, c.lastChild, 0)
                }
                return b
            })
        }, a.createBlocks = function() {
            this.firstChild = this.lastChild = L(), this.blocks = [this.firstChild], this.firstChild.parent = this
        }, a.finalizeInsert = function() {
            this.firstChild.blur = function() {
                return delete this.blur, this
            }, b.finalizeInsert.call(this)
        }, a.createBefore = function(a) {
            b.createBefore.call(this, this.cursor = a);
            if (this.replacedText)
                for (var c = 0; c < this.replacedText.length; c += 1)
                    this.write(this.replacedText.charAt(c))
        }, a.write = function(a) {
            this.cursor.insertNew(W(a))
        }, a.onKey = function(a, b) {
            if (!this.cursor.selection && (a === "Backspace" && !this.cursor.prev || a === "Del" && !this.cursor.next))
                return this.isEmpty() && this.cursor.insertAfter(this), !1
        }, a.onText = function(a) {
            this.cursor.prepareEdit();
            if (a !== "$")
                this.write(a);
            else if (this.isEmpty())
                this.cursor.insertAfter(this).backspace().insertNew(W("\\$", "$"));
            else if (!this.cursor.next)
                this.cursor.insertAfter(this);
            else if (!this.cursor.prev)
                this.cursor.insertBefore(this);
            else {
                var b = K(l(this.cursor.next, this.firstChild.lastChild));
                b.placeCursor = function(a) {
                    this.prev = 0, delete this.placeCursor, this.placeCursor(a)
                }, b.firstChild.focus = function() {
                    return this
                }, this.cursor.insertAfter(this).insertNew(b), b.prev = this, this.cursor.insertBefore(b), delete b.firstChild.focus
            }
            return this.cursor.root.triggerSpecialEvent("render"), !1
        }
    }), L = b(k, function(a, b) {
        a.blur = function() {
            this.jQ.removeClass("hasCursor");
            if (this.isEmpty()) {
                var a = this.parent, b = a.cursor;
                b.parent === this ? this.jQ.addClass("empty") : (b.hide(), a.remove(), b.next === a ? b.next = a.next : b.prev === a && (b.prev = a.prev), b.show().parent.bubble("redraw"))
            }
            return this
        }, a.focus = function() {
            b.focus.call(this);
            var a = this.parent;
            if (a.next.ctrlSeq === a.ctrlSeq) {
                var c = this, d = a.cursor, e = a.next.firstChild;
                e.eachChild(function(a) {
                    a.parent = c, a.jQ.appendTo(c.jQ)
                }), this.lastChild ? this.lastChild.next = e.firstChild : this.firstChild = e.firstChild, e.firstChild.prev = this.lastChild, this.lastChild = e.lastChild, e.parent.remove(), d.prev ? d.insertAfter(d.prev) : d.prependTo(this), d.parent.bubble("redraw")
            } else if (a.prev.ctrlSeq === a.ctrlSeq) {
                var d = a.cursor;
                d.prev ? a.prev.firstChild.focus() : d.appendTo(a.prev.firstChild)
            }
            return this
        }
    }), q.em = q.italic = q.italics = q.emph = q.textit = q.textsl = nb("\\textit", "i", 'class="text"'), q.strong = q.bold = q.textbf = nb("\\textbf", "b", 'class="text"'), q.sf = q.textsf = nb("\\textsf", "span", 'class="sans-serif text"'), q.tt = q.texttt = nb("\\texttt", "span", 'class="monospace text"'), q.textsc = nb("\\textsc", "span", 'style="font-variant:small-caps" class="text"'), q.uppercase = nb("\\uppercase", "span", 'style="text-transform:uppercase" class="text"'), q.lowercase = nb("\\lowercase", "span", 'style="text-transform:lowercase" class="text"'), M = p["\\"] = b(i, function(a, b) {
        a.ctrlSeq = "\\", a.replaces = function(a) {
            this._replacedFragment = a.disown(), this.isEmpty = function() {
                return !1
            }
        }, a.htmlTemplate = '<span class="latex-command-input non-leaf">\\<span>&0</span></span>', a.textTemplate = ["\\"], a.createBlocks = function() {
            b.createBlocks.call(this), this.firstChild.focus = function() {
                return this.parent.jQ.addClass("hasCursor"), this.isEmpty() && this.parent.jQ.removeClass("empty"), this
            }, this.firstChild.blur = function() {
                return this.parent.jQ.removeClass("hasCursor"), this.isEmpty() && this.parent.jQ.addClass("empty"), this
            }
        }, a.createBefore = function(a) {
            b.createBefore.call(this, a), this.cursor = a.appendTo(this.firstChild);
            if (this._replacedFragment) {
                var c = this.jQ[0];
                this.jQ = this._replacedFragment.jQ.addClass("blur").bind("mousedown mousemove", function(a) {
                    return db(a.target = c).trigger(a), !1
                }).insertBefore(this.jQ).add(this.jQ)
            }
        }, a.latex = function() {
            return "\\" + this.firstChild.latex() + " "
        }, a.onKey = function(a, b) {
            if (a === "Tab" || a === "Enter")
                return this.renderCommand(), this.cursor.root.triggerSpecialEvent("render"), b.preventDefault(), !1
        }, a.onText = function(a) {
            if (a.match(/[a-z]/i))
                return this.cursor.prepareEdit(), this.cursor.insertNew(W(a)), !1;
            this.renderCommand();
            if (a === " " || a === "\\" && this.firstChild.isEmpty())
                return this.cursor.root.triggerSpecialEvent("render"), !1
        }, a.renderCommand = function() {
            this.jQ = this.jQ.last(), this.remove(), this.next ? this.cursor.insertBefore(this.next) : this.cursor.appendTo(this.parent);
            var a = this.firstChild.latex(), b;
            a || (a = "backslash"), this.cursor.insertCmd(a, this._replacedFragment)
        }
    }), N = q.binom = q.binomial = b(i, function(a, b) {
        a.ctrlSeq = "\\binom", a.htmlTemplate = '<span class="paren scaled">(</span><span class="non-leaf"><span class="array non-leaf"><span>&0</span><span>&1</span></span></span><span class="paren scaled">)</span>', a.textTemplate = ["choose(", ",", ")"], a.redraw = function() {
            var a = this.jQ.eq(1), b = a.outerHeight() / +a.css("fontSize").slice(0, -2), c = this.jQ.filter(".paren");
            r(c, gb(1 + .2 * (b - 1), 1.2), 1.05 * b)
        }
    }), O = q.choose = b(N, function(a) {
        a.createBefore = B.prototype.createBefore
    }), P = q.vector = b(i, function(a, b) {
        a.ctrlSeq = "\\vector", a.htmlTemplate = '<span class="array"><span>&0</span></span>', a.latex = function() {
            return "\\begin{matrix}" + this.foldChildren([], function(a, b) {
                return a.push(b.latex()), a
            }).join("\\\\") + "\\end{matrix}"
        }, a.text = function() {
            return "[" + this.foldChildren([], function(a, b) {
                return a.push(b.text()), a
            }).join() + "]"
        }, a.createBefore = function(a) {
            b.createBefore.call(this, this.cursor = a)
        }, a.onKey = function(a, b) {
            var c = this.cursor.parent;
            if (c.parent === this) {
                if (a === "Enter") {
                    var d = k();
                    return d.parent = this, d.jQ = db("<span></span>").attr(fb, d.id).insertAfter(c.jQ), c.next ? c.next.prev = d : this.lastChild = d, d.next = c.next, c.next = d, d.prev = c, this.bubble("redraw").cursor.appendTo(d), b.preventDefault(), !1
                }
                if (a === "Tab" && !
                c.next) {
                    if (c.isEmpty()) {
                        if (c.prev)
                            return this.cursor.insertAfter(this), delete c.prev.next, this.lastChild = c.prev, c.jQ.remove(), this.bubble("redraw"), b.preventDefault(), !1;
                        return
                    }
                    var d = k();
                    return d.parent = this, d.jQ = db("<span></span>").attr(fb, d.id).appendTo(this.jQ), this.lastChild = d, c.next = d, d.prev = c, this.bubble("redraw").cursor.appendTo(d), b.preventDefault(), !1
                }
                if (b.which === 8) {
                    if (c.isEmpty())
                        return c.prev ? (this.cursor.appendTo(c.prev), c.prev.next = c.next) : (this.cursor.insertBefore(this), this.firstChild = c.next), c.next ? c.next.prev = c.prev : this.lastChild = c.prev, c.jQ.remove(), this.isEmpty() ? this.cursor.deleteForward() : this.bubble("redraw"), b.preventDefault(), !1;
                    if (!this.cursor.prev)
                        return b.preventDefault(), !1
                }
            }
        }
    }), Q = b(j, function(a, b) {
        a.init = function(a, c) {
            b.init.call(this, a, "<var>" + (c || a) + "</var>")
        }, a.createBefore = function(a) {
            var c = this.ctrlSeq;
            for (var d = 0, e = a.prev; d < V - 1 && e && e instanceof Q; d += 1, e = e.prev)
                c = e.ctrlSeq + c;
            while (c.length) {
                if (U.hasOwnProperty(c)) {
                    for (var d = 1; d < c.length; d += 1)
                        a.backspace();
                    a.insertNew(q[c](c));
                    return
                }
                c = c.slice(1)
            }
            b.createBefore.apply(this, arguments)
        }, a.respace = a.finalizeTree = function() {
            var a = this.ctrlSeq;
            if (a.length > 1)
                return;
            for (var b = this.prev; b instanceof Q && b.ctrlSeq.length === 1; b = b.prev)
                a = b.ctrlSeq + a;
            for (var c = this.next; c instanceof Q && c.ctrlSeq.length === 1; c = c.next)
                a += c.ctrlSeq;
            l(b.next || this.parent.firstChild, c.prev || this.parent.lastChild).each(function(a) {
                a.jQ.removeClass("un-italicized last"), delete a.isFirstLetter, delete a.isLastLetter
            });
            a: for (var d = 0, e = b.next || this.parent.firstChild; d < a.length; d += 1, e = e.next)
                for (var f = gb(T, a.length - d); f > 0; f -= 1)
                    if (S.hasOwnProperty(a.slice(d, d + f))) {
                        e.isFirstLetter = !0;
                        for (var g = 0, h = e; g < f; g += 1, h = h.next) {
                            h.jQ.addClass("un-italicized");
                            var i = h
                        }
                        i.isLastLetter = !0, i.next instanceof z || i.next instanceof E || i.jQ.addClass("last"), d += f - 1, e = i;
                        continue a
                    }
        }, a.latex = function() {
            return this.isFirstLetter ? "\\" + this.ctrlSeq : this.isLastLetter ? this.ctrlSeq + " " : this.ctrlSeq
        }, a.text = function() {
            var a = this.ctrlSeq;
            return this.prev && !(this.prev instanceof Q) && !(this.prev instanceof Z) && (a = "*" + a), this.next && !(this.next instanceof Z) && this.next.ctrlSeq !== "^" && (a += "*"), a
        }
    }), R = b(j, function(a, b) {
        a.init = function(a) {
            this.ctrlSeq = a
        }, a.createBefore = function(a) {
            a.writeLatex(this.ctrlSeq).show()
        }, a.parser = function() {
            var a = this.ctrlSeq, b = k();
            for (var c = 0; c < a.length; c += 1)
                Q(a.charAt(c)).adopt(b, b.lastChild, 0);
            return d.succeed(b.children())
        }
    }), S = {ln: 1,log: 1,min: 1,nCr: 1,nPr: 1,gcd: 1,lcm: 1,ceil: 1,exp: 1,abs: 1,max: 1,mod: 1,lcm: 1,gcd: 1,gcf: 1,hcf: 1,lim: 1,exp: 1,floor: 1,sign: 1,round: 1}, T = 9, U = {sqrt: 1,nthroot: 1,sum: 1,prod: 1,pi: 1,theta: 1}, V = 7, function() {
        var a, b, c = {sin: 1,cos: 1,tan: 1,sec: 1,cosec: 1,csc: 1,cotan: 1,cot: 1,ctg: 1};
        for (a in c)
            S[a] = S["arc" + a] = S[a + "h"] = S["arc" + a + "h"] = 1;
        for (b in S)
            q[b] = R
    }(), W = b(j, function(a, b) {
        a.init = function(a, c) {
            b.init.call(this, a, "<span>" + (c || a) + "</span>")
        }
    }), p[" "] = kb(W, "\\space ", " "), q.prime = p["'"] = kb(W, "'", "&prime;"), X = b(j, function(a, b) {
        a.init = function(a, c) {
            b.init.call(this, a, '<span class="nonSymbola">' + (c || a) + "</span>")
        }
    }), q["@"] = X, q["&"] = kb(X, "\\&", "&amp;"), q["%"] = kb(X, "\\%", "%"), q.alpha = q.beta = q.gamma = q.delta = q.zeta = q.eta = q.theta = q.iota = q.kappa = q.mu = q.nu = q.xi = q.rho = q.sigma = q.tau = q.chi = q.psi = q.omega = b(Q, function(a, b) {
        a.init = function(a) {
            b.init.call(this, "\\" + a + " ", "&" + a + ";")
        }
    }), q.phi = kb(Q, "\\phi ", "&#981;"), q.phiv = q.varphi = kb(Q, "\\varphi ", "&phi;"), q.epsilon = kb(Q, "\\epsilon ", "&#1013;"), q.epsiv = q.varepsilon = kb(Q, "\\varepsilon ", "&epsilon;"), q.piv = q.varpi = kb(Q, "\\varpi ", "&piv;"), q.sigmaf = q.sigmav = q.varsigma = kb(Q, "\\varsigma ", "&sigmaf;"), q.thetav = q.vartheta = q.thetasym = kb(Q, "\\vartheta ", "&thetasym;"), q.upsilon = q.upsi = kb(Q, "\\upsilon ", "&upsilon;"), q.gammad = q.Gammad = q.digamma = kb(Q, "\\digamma ", "&#989;"), q.kappav = q.varkappa = kb(Q, "\\varkappa ", "&#1008;"), q.rhov = q.varrho = kb(Q, "\\varrho ", "&#1009;"), q.pi = q["π"] = kb(X, "\\pi ", "&pi;"), q.theta = q["θ"] = kb(X, "\\theta ", "&theta;"), q.lambda = kb(X, "\\lambda ", "&lambda;"), q.Upsilon = q.Upsi = q.upsih = q.Upsih = kb(j, "\\Upsilon ", '<var style="font-family: serif">&upsih;</var>'), q.Gamma = q.Delta = q.Theta = q.Lambda = q.Xi = q.Pi = q.Sigma = q.Phi = q.Psi = q.Omega = q.forall = b(W, function(a, b) {
        a.init = function(a) {
            b.init.call(this, "\\" + a + " ", "&" + a + ";")
        }
    }), Y = b(i, function(a) {
        a.init = function(a) {
            this.latex = a
        }, a.createBefore = function(a) {
            a.writeLatex(this.latex)
        }, a.parser = function() {
            var a = ab.parse(this.latex).children();
            return d.succeed(a)
        }
    }), q["¹"] = kb(Y, "^1"), q["²"] = kb(Y, "^2"), q["³"] = kb(Y, "^3"), q["¼"] = kb(Y, "\\frac14"), q["½"] = kb(Y, "\\frac12"), q["¾"] = kb(Y, "\\frac34"), Z = b(j, function(a, b) {
        a.init = function(a, c, d) {
            b.init.call(this, a, '<span class="binary-operator">' + c + "</span>", d)
        }, a.createBefore = function(a) {
            var c = a.prev.ctrlSeq + this.ctrlSeq;
            c === "<=" ? a.backspace().insertNew(Z("\\le ", "&le;")) : c === ">=" ? a.backspace().insertNew(Z("\\ge ", "&ge;")) : b.createBefore.apply(this, arguments)
        }
    }), $ = b(Z, function(a) {
        a.init = W.prototype.init, a.respace = function() {
            return this.prev ? this.prev instanceof Z && this.next && !(this.next instanceof Z) ? this.jQ[0].className = "unary-operator" : this.jQ[0].className = "binary-operator" : this.jQ[0].className = "", this
        }
    }), q["+"] = kb($, "+", "+"), q["–"] = q["-"] = kb($, "-", "&minus;"), q["±"] = q.pm = q.plusmn = q.plusminus = kb($, "\\pm ", "&plusmn;"), q.mp = q.mnplus = q.minusplus = kb($, "\\mp ", "&#8723;"), p["*"] = q.sdot = q.cdot = kb(Z, "\\cdot ", "&middot;"), q["="] = kb(Z, "=", "="), q["<"] = kb(Z, "<", "&lt;"), q[">"] = kb(Z, ">", "&gt;"), q.notin = q.sim = q.cong = q.equiv = q.oplus = q.otimes = b(Z, function(a, b) {
        a.init = function(a) {
            b.init.call(this, "\\" + a + " ", "&" + a + ";")
        }
    }), q.times = kb(Z, "\\times ", "&times;", "[x]"), q["÷"] = q.div = q.divide = q.divides = kb(Z, "\\div ", "&divide;", "[/]"), q["≠"] = q.ne = q.neq = kb(Z, "\\ne ", "&ne;"), q.ast = q.star = q.loast = q.lowast = kb(Z, "\\ast ", "&lowast;"), q.therefor = q.therefore = kb(Z, "\\therefore ", "&there4;"), q.cuz = q.because = kb(Z, "\\because ", "&#8757;"), q.prop = q.propto = kb(Z, "\\propto ", "&prop;"), q["≈"] = q.asymp = q.approx = kb(Z, "\\approx ", "&asymp;"), q.lt = kb(Z, "<", "&lt;"), q.gt = kb(Z, ">", "&gt;"), q["≤"] = q.le = q.leq = kb(Z, "\\le ", "&le;"), q["≥"] = q.ge = q.geq = kb(Z, "\\ge ", "&ge;"), q.isin = q["in"] = kb(Z, "\\in ", "&isin;"), q.ni = q.contains = kb(Z, "\\ni ", "&ni;"), q.notni = q.niton = q.notcontains = q.doesnotcontain = kb(Z, "\\not\\ni ", "&#8716;"), q.sub = q.subset = kb(Z, "\\subset ", "&sub;"), q.sup = q.supset = q.superset = kb(Z, "\\supset ", "&sup;"), q.nsub = q.notsub = q.nsubset = q.notsubset = kb(Z, "\\not\\subset ", "&#8836;"), q.nsup = q.notsup = q.nsupset = q.notsupset = q.nsuperset = q.notsuperset = kb(Z, "\\not\\supset ", "&#8837;"), q.sube = q.subeq = q.subsete = q.subseteq = kb(Z, "\\subseteq ", "&sube;"), q.supe = q.supeq = q.supsete = q.supseteq = q.supersete = q.superseteq = kb(Z, "\\supseteq ", "&supe;"), q.nsube = q.nsubeq = q.notsube = q.notsubeq = q.nsubsete = q.nsubseteq = q.notsubsete = q.notsubseteq = kb(Z, "\\not\\subseteq ", "&#8840;"), q.nsupe = q.nsupeq = q.notsupe = q.notsupeq = q.nsupsete = q.nsupseteq = q.notsupsete = q.notsupseteq = q.nsupersete = q.nsuperseteq = q.notsupersete = q.notsuperseteq = kb(Z, "\\not\\supseteq ", "&#8841;"), _ = b(j, function(a, b) {
        a.init = function(a, c) {
            b.init.call(this, a, '<span class="large-operator non-leaf"><big>' + c + "</big></span>"), a !== "\\int " && (this.placeCursor = function(a) {
                a.writeLatex("^{}_{n=}").appendTo(this.firstChild).show()
            })
        }, a.isEmpty = i.prototype.isEmpty, a.latex = function() {
            function c(a) {
                return a.length === 1 ? a : "{" + (a || " ") + "}"
            }
            var a = this.firstChild ? "_" + c(this.firstChild.latex()) : "", b = this.lastChild ? "^" + c(this.lastChild.latex()) : "";
            return this.ctrlSeq + a + b
        }
    }), q["∑"] = q.sum = q.summation = kb(_, "\\sum ", "&sum;"), q["∏"] = q.prod = q.product = kb(_, "\\prod ", "&prod;"), q.coprod = q.coproduct = kb(_, "\\coprod ", "&#8720;"), q["∫"] = q["int"] = q.integral = b(_, function(a) {
        a.init = function() {
            j.prototype.init.call(this, "\\int ", "<big>&int;</big>")
        }
    }), q.space = kb(W, "\\space ", "&nbsp;"), q.and = q.land = q.wedge = kb(W, "\\wedge ", "&and;"), q.or = q.lor = q.vee = kb(W, "\\vee ", "&or;"), ab = function() {
        function a(a) {
            var b = k();
            return a.adopt(b, 0, 0), b
        }
        function b(a) {
            var b = a[0] || k();
            for (var c = 1; c < a.length; c += 1)
                a[c].children().adopt(b, b.lastChild, 0);
            return b
        }
        var c = d.string, e = d.regex, f = d.letter, g = d.any, h = d.optWhitespace, i = d.succeed, j = d.fail, l = f.map(Q), m = e(/^[^${}\\_^]/).map(W), n = e(/^[^\\]/).or(c("\\").then(e(/^[a-z]+/i).or(e(/^\s+/).result(" ")).or(g))).then(function(a) {
            var b = q[a];
            return b ? b(a).parser() : j("unknown command: \\" + a)
        }), o = n.or(l).or(m), p = c("{").then(function() {
            return s
        }).skip(c("}")), r = h.then(p.or(o.map(a))), s = r.many().map(b).skip(h), t = c("[").then(r.then(function(a) {
            return a.join("latex") !== "]" ? i(a) : j()
        }).many().map(b).skip(h)).skip(c("]")), u = s;
        return u.block = r, u.optBlock = t, u
    }(), bb = b(function(a) {
        function b(a, b) {
            if (a.next[b])
                a.prependTo(a.next[b]);
            else if (a.prev[b])
                a.appendTo(a.prev[b]);
            else {
                var d = a.parent;
                do {
                    var e = d[b];
                    if (e) {
                        typeof e == "function" && (e = d[b](a));
                        if (e === !1 || e instanceof k) {
                            a.upDownCache[d.id] = {parent: a.parent,prev: a.prev,next: a.next};
                            if (e instanceof k) {
                                var f = a.upDownCache[e.id];
                                if (f)
                                    f.next ? a.insertBefore(f.next) : a.appendTo(f.parent);
                                else {
                                    var g = c(a).left;
                                    a.appendTo(e), a.seekHoriz(g, e)
                                }
                            }
                            break
                        }
                    }
                    d = d.parent.parent
                } while (d)
            }
            return a.clearSelection().show()
        }
        function c(a) {
            var b = a.jQ.removeClass("cursor").offset();
            return a.jQ.addClass("cursor"), b
        }
        function e(a) {
            a.upDownCache = {}
        }
        a.init = function(a) {
            this.parent = this.root = a;
            var b = this.jQ = this._jQ = db('<span class="cursor">&zwj;</span>');
            this.blink = function() {
                b.toggleClass("blink")
            }, this.upDownCache = {}
        }, a.prev = 0, a.next = 0, a.parent = 0, a.show = function() {
            return this.jQ = this._jQ.removeClass("blink"), "intervalId" in this ? clearInterval(this.intervalId) : (this.next ? this.selection && this.selection.first.prev === this.prev ? this.jQ.insertBefore(this.selection.jQ) : this.jQ.insertBefore(this.next.jQ.first()) : this.jQ.appendTo(this.parent.jQ), this.parent.focus()), this.intervalId = setInterval(this.blink, 500), this
        }, a.hide = function() {
            return "intervalId" in this && clearInterval(this.intervalId), delete this.intervalId, this.jQ.detach(), this.jQ = db(), this
        }, a.insertAt = function(a, b, c) {
            var d = this.parent;
            this.parent = a, this.prev = b, this.next = c, d.blur()
        }, a.insertBefore = function(a) {
            return this.insertAt(a.parent, a.prev, a), this.parent.jQ.addClass("hasCursor"), this.jQ.insertBefore(a.jQ.first()), this
        }, a.insertAfter = function(a) {
            return this.insertAt(a.parent, a, a.next), this.parent.jQ.addClass("hasCursor"), this.jQ.insertAfter(a.jQ.last()), this
        }, a.prependTo = function(a) {
            return this.insertAt(a, 0, a.firstChild), a.textarea ? this.jQ.insertAfter(a.textarea) : this.jQ.prependTo(a.jQ), a.focus(), this
        }, a.appendTo = function(a) {
            return this.insertAt(a, a.lastChild, 0), this.jQ.appendTo(a.jQ), a.focus(), this
        }, a.hopLeft = function() {
            return this.jQ.insertBefore(this.prev.jQ.first()), this.next = this.prev, this.prev = this.prev.prev, this
        }, a.hopRight = function() {
            return this.jQ.insertAfter(this.next.jQ.last()), this.prev = this.next, this.next = this.next.next, this
        }, a.moveLeftWithin = function(a) {
            this.prev ? this.prev instanceof D ? this.appendTo(this.prev.lastChild) : this.prev.up instanceof k ? this.appendTo(this.prev.up) : this.prev.firstChild ? this.appendTo(this.prev.firstChild) : this.hopLeft() : this.parent !== a ? this.insertBefore(this.parent.parent) : a.moveOutOf && a.moveOutOf("left", this)
        }, a.moveRightWithin = function(a) {
            this.next ? this.next.up instanceof k ? this.prependTo(this.next.up) : this.next.firstChild ? this.prependTo(this.next.firstChild) : this.hopRight() : this.parent !== a ? this.insertAfter(this.parent.parent) : a.moveOutOf && a.moveOutOf("right", this)
        }, a.moveLeft = function() {
            return e(this), this.selection ? this.insertBefore(this.selection.first).clearSelection() : this.moveLeftWithin(this.root), this.show()
        }, a.moveRight = function() {
            return e(this), this.selection ? this.insertAfter(this.selection.last).clearSelection() : this.moveRightWithin(this.root), this.show()
        }, a.moveUp = function() {
            return b(this, "up")
        }, a.moveDown = function() {
            return b(this, "down")
        }, a.seek = function(a, b, c) {
            e(this);
            var d, f, g = this.clearSelection().show();
            return a.hasClass("empty") ? (g.prependTo(h[a.attr(fb)]), g) : (d = h[a.attr(eb)], d instanceof j ? (a.outerWidth() > 2 * (b - a.offset().left) ? g.insertBefore(d) : g.insertAfter(d), g) : (d || (f = h[a.attr(fb)], f || (a = a.parent(), d = h[a.attr(eb)], d || (f = h[a.attr(fb)], f || (f = g.root)))), d ? g.insertAfter(d) : g.appendTo(f), g.seekHoriz(b, g.root)))
        }, a.seekHoriz = function(a, b) {
            var d = this, e = c(d).left - a, f;
            while (e > 0 && (d.prev || d.parent !== b))
                !d.prev && d.parent.parent.respaced ? d.appendTo(d.parent.parent.prev.firstChild) : d.moveLeftWithin(b), f = e, e = c(d).left - a;
            return -e > f && d.moveRightWithin(b), d
        }, a.writeLatex = function(a) {
            var b = this;
            e(b), b.show().deleteSelection();
            var c = d.all, f = d.eof, g = ab.skip(f).or(c.result(!1)).parse(a);
            return g && (g.children().adopt(b.parent, b.prev, b.next), h.jQize(g.join("html")).insertBefore(b.jQ), b.prev = g.lastChild, g.finalizeInsert(), b.parent.bubble("redraw")), this
        }, a.write = function(a) {
            return e(this), this.show().insertCh(a)
        }, a.insertCh = function(a) {
            var b;
            return a.match(/^[a-z]$/i) ? b = Q(a) : (b = p[a] || q[a]) ? b = b(a) : b = W(a), this.selection && (this.prev = this.selection.first.prev, this.next = this.selection.last.next, b.replaces(this.selection), delete this.selection), this.insertNew(b)
        }, a.insertNew = function(a) {
            return a.createBefore(this), this
        }, a.insertCmd = function(a, b) {
            var c = q[a];
            return c ? (c = c(a), b && c.replaces(b), this.insertNew(c)) : (c = K(), c.replaces(a), c.firstChild.focus = function() {
                return delete this.focus, this
            }, this.insertNew(c).insertAfter(c), b && b.remove()), this
        }, a.unwrapGramp = function() {
            var a = this.parent.parent, b = a.parent, c = a.next, d = this, e = a.prev;
            a.disown().eachChild(function(d) {
                if (d.isEmpty())
                    return;
                d.children().adopt(b, e, c).each(function(b) {
                    b.jQ.insertBefore(a.jQ.first())
                }), e = d.lastChild
            });
            if (!this.next)
                if (this.prev)
                    this.next = this.prev.next;
                else
                    while (!this.next) {
                        this.parent = this.parent.next;
                        if (!this.parent) {
                            this.next = a.next, this.parent = b;
                            break
                        }
                        this.next = this.parent.firstChild
                    }
            this.next ? this.insertBefore(this.next) : this.appendTo(b), a.jQ.remove(), a.prev && a.prev.respace(), a.next && a.next.respace()
        }, a.backspace = function() {
            e(this), this.show();
            if (!this.deleteSelection())
                if (this.prev)
                    if (this.prev.isEmpty()) {
                        if (this.prev.ctrlSeq === "\\le ")
                            var a = q["<"]("<");
                        else if (this.prev.ctrlSeq === "\\ge ")
                            var a = q[">"](">");
                        this.prev = this.prev.remove().prev, a && this.insertNew(a)
                    } else {
                        if (this.prev instanceof E)
                            return this.appendTo(this.prev.firstChild).deleteForward();
                        this.selectLeft()
                    }
                else if (this.parent !== this.root) {
                    if (this.parent.parent.isEmpty())
                        return this.insertAfter(this.parent.parent).backspace();
                    if (this.next instanceof E)
                        return this.prependTo(this.next.firstChild).backspace();
                    this.unwrapGramp()
                } else
                    this.root.triggerSpecialEvent("backspacePressed");
            return this.prev && this.prev.respace(), this.next && this.next.respace(), this.parent.bubble("redraw"), this
        }, a.deleteForward = function() {
            e(this), this.show();
            if (!this.deleteSelection())
                if (this.next)
                    this.next.isEmpty() ? this.next = this.next.remove().next : this.selectRight();
                else if (this.parent !== this.root) {
                    if (this.parent.parent.isEmpty())
                        return this.insertBefore(this.parent.parent).deleteForward();
                    this.unwrapGramp()
                } else
                    this.root.triggerSpecialEvent("delPressed");
            return this.prev && this.prev.respace(), this.next && this.next.respace(), this.parent.bubble("redraw"), this
        }, a.selectFrom = function(a) {
            var b = this, c = a;
            a: for (; ; ) {
                for (var d = this; d !== b.parent.parent; d = d.parent.parent)
                    if (d.parent === c.parent) {
                        f = d, g = c;
                        break a
                    }
                for (var e = a; e !== c.parent.parent; e = e.parent.parent)
                    if (b.parent === e.parent) {
                        f = b, g = e;
                        break a
                    }
                b.parent.parent && (b = b.parent.parent), c.parent.parent && (c = c.parent.parent)
            }
            var f, g, h;
            if (f.next !== g) {
                for (var i = f; i; i = i.next)
                    if (i === g.prev) {
                        h = !0;
                        break
                    }
                h || (h = g, g = f, f = h)
            }
            this.hide().selection = cb(f.prev.next || f.parent.firstChild, g.next.prev || g.parent.lastChild), this.insertAfter(g.next.prev || g.parent.lastChild), this.root.selectionChanged()
        }, a.selectLeft = function() {
            e(this);
            if (this.selection)
                if (this.selection.first === this.next)
                    this.prev ? this.hopLeft().selection.extendLeft() : this.parent !== this.root && this.insertBefore(this.parent.parent).selection.levelUp();
                else {
                    this.hopLeft();
                    if (this.selection.first === this.selection.last) {
                        this.clearSelection().show();
                        return
                    }
                    this.selection.retractLeft()
                }
            else {
                if (this.prev)
                    this.hopLeft();
                else {
                    if (this.parent === this.root)
                        return;
                    this.insertBefore(this.parent.parent)
                }
                this.hide().selection = cb(this.next)
            }
            this.root.selectionChanged()
        }, a.selectRight = function() {
            e(this);
            if (this.selection)
                if (this.selection.last === this.prev)
                    this.next ? this.hopRight().selection.extendRight() : this.parent !== this.root && this.insertAfter(this.parent.parent).selection.levelUp();
                else {
                    this.hopRight();
                    if (this.selection.first === this.selection.last) {
                        this.clearSelection().show();
                        return
                    }
                    this.selection.retractRight()
                }
            else {
                if (this.next)
                    this.hopRight();
                else {
                    if (this.parent === this.root)
                        return;
                    this.insertAfter(this.parent.parent)
                }
                this.hide().selection = cb(this.prev)
            }
            this.root.selectionChanged()
        }, a.prepareMove = function() {
            return e(this), this.show().clearSelection()
        }, a.prepareEdit = function() {
            return e(this), this.show().deleteSelection()
        }, a.clearSelection = function() {
            return this.selection && (this.selection.clear(), delete this.selection, this.root.selectionChanged()), this
        }, a.deleteSelection = function() {
            return this.selection ? (this.prev = this.selection.first.prev, this.next = this.selection.last.next, this.selection.remove(), this.root.selectionChanged(), delete this.selection) : !1
        }
    }), cb = b(l, function(a, b) {
        a.init = function() {
            var a = this;
            b.init.apply(a, arguments), a.jQwrap(a.jQ)
        }, a.jQwrap = function(a) {
            this.jQ = a.wrapAll('<span class="selection"></span>').parent()
        }, a.adopt = function() {
            return this.jQ.replaceWith(this.jQ = this.jQ.children()), b.adopt.apply(this, arguments)
        }, a.clear = function() {
            return this.jQ.replaceWith(this.jQ.children()), this
        }, a.levelUp = function() {
            var a = this, b = a.first = a.last = a.last.parent.parent;
            return a.clear().jQwrap(b.jQ), a
        }, a.extendLeft = function() {
            this.first = this.first.prev, this.first.jQ.prependTo(this.jQ)
        }, a.extendRight = function() {
            this.last = this.last.next, this.last.jQ.appendTo(this.jQ)
        }, a.retractRight = function() {
            this.first.jQ.insertBefore(this.jQ), this.first = this.first.next
        }, a.retractLeft = function() {
            this.last.jQ.insertAfter(this.jQ), this.last = this.last.prev
        }
    }), db.fn.mathquill = function(a, b) {
        var c, d, e, f, g, i;
        switch (a) {
            case "focus":
            case "blur":
                return this.each(function() {
                    var b = db(this).attr(fb), c = b && h[b];
                    c && c.textarea && c.textarea.children().trigger(a)
                });
            case "onKey":
            case "onText":
                return this.each(function() {
                    var c = db(this).attr(fb), d = c && h[c], e = d && d.cursor;
                    e && (e.parent.bubble(a, b, {preventDefault: jb}), d.blurred && e.hide().parent.blur())
                });
            case "redraw":
                return this.each(function() {
                    var a = db(this).attr(fb), b = a && h[a];
                    b && function c(a) {
                        a.eachChild(c), a.redraw && a.redraw()
                    }(b)
                });
            case "revert":
                return this.each(function() {
                    var a = db(this).attr(fb), b = a && h[a];
                    b && b.revert && b.revert()
                });
            case "latex":
                if (arguments.length > 1)
                    return this.each(function() {
                        var a = db(this).attr(fb), c = a && h[a];
                        c && (c.renderLatex(b), c.blurred && c.cursor.hide().parent.blur(), c.triggerSpecialEvent("render"))
                    });
                return c = db(this).attr(fb), d = c && h[c], d && d.latex();
            case "text":
                return c = db(this).attr(fb), d = c && h[c], d && d.text();
            case "html":
                return this.html().replace(/ ?hasCursor|hasCursor /, "").replace(/ class=(""|(?= |>))/g, "").replace(/<span class="?cursor( blink)?"?><\/span>/i, "").replace(/<span class="?textarea"?><textarea><\/textarea><\/span>/i, "");
            case "write":
                if (arguments.length > 1)
                    return this.each(function() {
                        var a = db(this).attr(fb), c = a && h[a], d = c && c.cursor;
                        d && (d.writeLatex(b), c.blurred && d.hide().parent.blur())
                    });
            case "cmd":
                if (arguments.length > 1)
                    return this.each(function() {
                        var a, c = db(this).attr(fb), d = c && h[c], e = d && d.cursor;
                        e && (e.show(), /^\\[a-z]+$/i.test(b) ? (a = e.selection, a && (e.prev = a.first.prev, e.next = a.last.next, delete e.selection), e.insertCmd(b.slice(1), a)) : e.insertCh(b), d.blurred && e.hide().parent.blur())
                    });
            case "moveStart":
                c = db(this).attr(fb), d = c && h[c], d && d.cursor && d.cursor.prependTo(d);
                break;
            case "moveEnd":
                c = db(this).attr(fb), d = c && h[c], d && d.cursor && d.cursor.appendTo(d);
                break;
            case "selection":
                c = db(this).attr(fb), d = c && h[c], e = d && d.cursor;
                if (!e)
                    return;
                return e.selection ? "$" + e.selection.latex() + "$" : "";
            case "clearSelection":
                return this.each(function() {
                    var a = db(this).attr(fb), b = a && h[a], c = b && b.cursor;
                    c && (c.clearSelection(), b.blurred && c.hide().parent.blur())
                });
            default:
                return f = a === "textbox", g = f || a === "editable", i = f ? o : m, this.each(function() {
                    mb(db(this), i(), f, g)
                })
        }
    }, db(function() {
        db(".mathquill-editable:not(.mathquill-rendered-math)").mathquill("editable"), db(".mathquill-textbox:not(.mathquill-rendered-math)").mathquill("textbox"), db(".mathquill-embedded-latex").mathquill()
    })
})();