/*!
 *  Copyright 2008 Fair Oaks Labs, Inc.
 *  All rights reserved.
 */
 
/*
based on: https://github.com/ryanrolds/bufferpack
incorporated changes from: https://github.com/birchroad/node-jspack

changes by zb3:

-> make it work in browser
-> pack changed to use array
-> removed length check
-> removed calcLength
-> added support for named patterns also for packing
-> added shitty implementation of len- to work with strings/arrays
like i-s means read an int, and read this amount of bytes for the string
-> added calcLength which can return null if we're unable to tell
-> added .usedBytes
*/
 
// Utility object:  Encode/Decode C-style binary primitives to/from octet arrays
function JSPack() {
  // Module-level (private) variables
  var el, bBE = false,
    m = this;

  // Raw byte arrays
  m._DeArray = function(a, p, l) {
    return [a.slice(p, p + l)];
  };
  m._EnArray = function(a, p, l, v) {
    for (var i = 0; i < l; a[p + i] = v[i] ? v[i] : 0, i++);
  };
  
  m._DeBool = function (a, p) {
    return !!a[p];
  };
  m._EnBool = function (a, p, v) {
    a[p] = !!v ? 1 : 0;
  };

  // ASCII characters
  m._DeChar = function(a, p) {
    return String.fromCharCode(a[p]);
  };
  m._EnChar = function(a, p, v) {
    a[p] = v.charCodeAt(0);
  };

  // Little-endian (un)signed N-byte integers
  m._DeInt = function(a, p) {
    var lsb = bBE ? (el.len - 1) : 0,
      nsb = bBE ? -1 : 1,
      stop = lsb + nsb * el.len,
      rv, i, f;
    for (rv = 0, i = lsb, f = 1; i != stop; rv += (a[p + i] * f), i += nsb, f *= 256);
    if (el.bSigned && (rv & Math.pow(2, el.len * 8 - 1))) {
      rv -= Math.pow(2, el.len * 8);
    }
    return rv;
  };
  m._EnInt = function(a, p, v) {
    var lsb = bBE ? (el.len - 1) : 0,
      nsb = bBE ? -1 : 1,
      stop = lsb + nsb * el.len,
      i;
    v = (v < el.min) ? el.min : (v > el.max) ? el.max : v;
    for (i = lsb; i != stop; a[p + i] = v & 0xff, i += nsb, v >>= 8);
  };

  // ASCII character strings
  m._DeString = function(a, p, l) {
    for (var rv = new Array(l), i = 0; i < l; rv[i] = String.fromCharCode(a[p + i]), i++);
    return rv.join('');
  };
  m._EnString = function(a, p, l, v) {
    for (var t, i = 0; i < l; a[p + i] = (t = v.charCodeAt(i)) ? t : 0, i++);
  };

  // ASCII character strings null terminated
  m._DeNullString = function(a, p, l, v) {
    var str = m._DeString(a, p, l, v);
    return str.substring(0, str.length - 1);
  };

  // Little-endian N-bit IEEE 754 floating point
  m._De754 = function(a, p) {
    var s, e, m, i, d, nBits, mLen, eLen, eBias, eMax;
    mLen = el.mLen, eLen = el.len * 8 - el.mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1;

    i = bBE ? 0 : (el.len - 1);
    d = bBE ? 1 : -1;
    s = a[p + i];
    i += d;
    nBits = -7;
    for (e = s & ((1 << (-nBits)) - 1), s >>= (-nBits), nBits += eLen; nBits > 0; e = e * 256 + a[p + i], i += d, nBits -= 8);
    for (m = e & ((1 << (-nBits)) - 1), e >>= (-nBits), nBits += mLen; nBits > 0; m = m * 256 + a[p + i], i += d, nBits -= 8);

    switch (e) {
      case 0:
        // Zero, or denormalized number
        e = 1 - eBias;
        break;
      case eMax:
        // NaN, or +/-Infinity
        return m ? NaN : ((s ? -1 : 1) * Infinity);
      default:
        // Normalized number
        m = m + Math.pow(2, mLen);
        e = e - eBias;
        break;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };
  m._En754 = function(a, p, v) {
    var s, e, m, i, d, c, mLen, eLen, eBias, eMax;
    mLen = el.mLen, eLen = el.len * 8 - el.mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1;

    s = v < 0 ? 1 : 0;
    v = Math.abs(v);
    if (isNaN(v) || (v == Infinity)) {
      m = isNaN(v) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(v) / Math.LN2); // Calculate log2 of the value

      if (v * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2; // Math.log() isn't 100% reliable
      }

      // Round by adding 1/2 the significand's LSD
      if (e + eBias >= 1) {
        v += el.rt / c; // Normalized:  mLen significand digits
      } else {
        v += el.rt * Math.pow(2, 1 - eBias); // Denormalized:  <= mLen significand digits
      }

      if (v * c >= 2) {
        e++;
        c /= 2; // Rounding can increment the exponent
      }

      if (e + eBias >= eMax) {
        // Overflow
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        // Normalized - term order matters, as Math.pow(2, 52-e) and v*Math.pow(2, 52) can overflow
        m = (v * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        // Denormalized - also catches the '0' case, somewhat by chance
        m = v * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }

    for (i = bBE ? (el.len - 1) : 0, d = bBE ? -1 : 1; mLen >= 8; a[p + i] = m & 0xff, i += d, m /= 256, mLen -= 8);
    for (e = (e << mLen) | m, eLen += mLen; eLen > 0; a[p + i] = e & 0xff, i += d, e /= 256, eLen -= 8);
    a[p + i - d] |= s * 128;
  };
  
  // Convert int64 to array with 3 elements: [lowBits, highBits, unsignedFlag]
  // '>>>' trick to convert signed 32bit int to unsigned int (because << always results in a signed 32bit int)
  m._DeInt64 = function(a, p) {
    var start = bBE ? 0 : 7;
    var nsb = bBE ? 1 : -1;
    var stop = start + nsb * 8;
    var rv = [0, 0, !el.bSigned];
    var i, f, rvi;
    for (i = start, rvi = 1, f = 0; i != stop; rv[rvi] = (((rv[rvi] << 8) >>> 0) + a[p + i]), i += nsb, f++, rvi = (f < 4 ? 1 : 0)) {}
    return rv;
  };

  m._EnInt64 = function(a, p, v) {
    var start = bBE ? 0 : 7;
    var nsb = bBE ? 1 : -1;
    var stop = start + nsb * 8;
    var i, f, rvi, s;
    for (i = start, rvi = 1, f = 0, s = 24; i != stop; a[p + i] = v[rvi] >> s & 0xff, i += nsb, f++, rvi = (f < 4 ? 1 : 0), s = 24 - (8 * (f % 4))) {}
  };

  // Class data
  m._sPattern = '(\\d+)?([?AxcbBhHsSfdiIlLqQ])(\\(([a-zA-Z0-9]+)\\))?(-)?';
  m._fixedPattern = /^((\d+)?([?AxcbBhHsfdiIlLqQ])(\(([a-zA-Z0-9]+)\))?)+$/;
  m._lenLut = {
    'A': 1,
    '?': 1,
    'x': 1,
    'c': 1,
    'b': 1,
    'B': 1,
    'h': 2,
    'H': 2,
    's': 1,
    'S': 1,
    'f': 4,
    'd': 8,
    'i': 4,
    'I': 4,
    'l': 4,
    'L': 4,
    'q': 8,
    'Q': 8
  };
  m._elLut = {
    'A': {
      en: m._EnArray,
      de: m._DeArray
    },
    '?': {
      en: m._EnBool,
      de: m._DeBool
    },
    's': {
      en: m._EnString,
      de: m._DeString
    },
    'S': {
      en: m._EnString,
      de: m._DeNullString
    },
    'c': {
      en: m._EnChar,
      de: m._DeChar
    },
    'b': {
      en: m._EnInt,
      de: m._DeInt,
      len: 1,
      bSigned: true,
      min: -Math.pow(2, 7),
      max: Math.pow(2, 7) - 1
    },
    'B': {
      en: m._EnInt,
      de: m._DeInt,
      len: 1,
      bSigned: false,
      min: 0,
      max: Math.pow(2, 8) - 1
    },
    'h': {
      en: m._EnInt,
      de: m._DeInt,
      len: 2,
      bSigned: true,
      min: -Math.pow(2, 15),
      max: Math.pow(2, 15) - 1
    },
    'H': {
      en: m._EnInt,
      de: m._DeInt,
      len: 2,
      bSigned: false,
      min: 0,
      max: Math.pow(2, 16) - 1
    },
    'i': {
      en: m._EnInt,
      de: m._DeInt,
      len: 4,
      bSigned: true,
      min: -Math.pow(2, 31),
      max: Math.pow(2, 31) - 1
    },
    'I': {
      en: m._EnInt,
      de: m._DeInt,
      len: 4,
      bSigned: false,
      min: 0,
      max: Math.pow(2, 32) - 1
    },
    'l': {
      en: m._EnInt,
      de: m._DeInt,
      len: 4,
      bSigned: true,
      min: -Math.pow(2, 31),
      max: Math.pow(2, 31) - 1
    },
    'L': {
      en: m._EnInt,
      de: m._DeInt,
      len: 4,
      bSigned: false,
      min: 0,
      max: Math.pow(2, 32) - 1
    },
    'f': {
      en: m._En754,
      de: m._De754,
      len: 4,
      mLen: 23,
      rt: Math.pow(2, -24) - Math.pow(2, -77)
    },
    'd': {
      en: m._En754,
      de: m._De754,
      len: 8,
      mLen: 52,
      rt: 0
    },
    'q': {
      en: m._EnInt64,
      de: m._DeInt64,
      bSigned: true
    },
    'Q': {
      en: m._EnInt64,
      de: m._DeInt64,
      bSigned: false
    }
  };

  // Unpack a series of n elements of size s from array a at offset p with fxn
  m._UnpackSeries = function(n, s, a, p) {
    for (var fxn = el.de, rv = [], i = 0; i < n; rv.push(fxn(a, p + i * s)), i++);
    return rv;
  };

  // Pack a series of n elements of size s from array v at offset i to array a at offset p with fxn
  m._PackSeries = function(n, s, a, p, v, i) {
    for (var fxn = el.en, o = 0; o < n; fxn(a, p + o * s, v[i + o]), o++);
  };

  m._zip = function(keys, values) {
    var result = {};

    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = values[i];
    }

    return result;
  }

  m.usedBytes = 0;
  
  // Unpack the octet array a, beginning at offset p, according to the fmt string
  m.unpack = function(fmt, a, p) {
    // Set the private bBE flag based on the format string - assume big-endianness
    bBE = (fmt.charAt(0) != '<');

    p = p ? p : 0;
    var re = new RegExp(this._sPattern, 'g');
    var m;
    var n;
    var s;
    var rk = [];
    var rv = [];
    var start = p;
    var lastLength = null;

    while (m = re.exec(fmt)) {
      n = ((m[1] == undefined) || (m[1] == '')) ? 1 : parseInt(m[1]);

      if (m[2] === 'S') { // Null term string support
        n = 0; // Need to deal with empty  null term strings
        while (a[p + n] !== 0) {
          n++;
        }
        n++; // Add one for null byte
      }

      s = this._lenLut[m[2]];
      
      if (m[5] && n === 1) //read it as length of the string
      {
       el = this._elLut[m[2]];
       lastLength = this._UnpackSeries(1, s, a, p)[0]
       p += s;
       continue;
      }      
      
      if ((m[2] === 's' || m[2] === 'A') && lastLength !== null)
      {
       n = lastLength;
       lastLength = null;
      }

      if ((p + n * s) > a.length) {
        return undefined;
      }

      switch (m[2]) {
        case 'A':
        case 's':
        case 'S':
          rv.push(this._elLut[m[2]].de(a, p, n));
          break;
        case 'c':
        case '?':
        case 'b':
        case 'B':
        case 'h':
        case 'H':
        case 'i':
        case 'I':
        case 'l':
        case 'L':
        case 'f':
        case 'd':
        case 'q':
        case 'Q':
          el = this._elLut[m[2]];
          rv.push(this._UnpackSeries(n, s, a, p));
          break;
      }

      rk.push(m[4]); // Push key on to array

      p += n * s;
    }

    rv = Array.prototype.concat.apply([], rv); //this flattens stuff
    
    this.usedBytes = p-start;

    if (rk.indexOf(undefined) !== -1) {
      return rv;
    } else {
      return this._zip(rk, rv);
    }
  };

  // Pack the supplied values into the octet array a, beginning at offset p, according to the fmt string
  m.packTo = function(fmt, a, p, values) {
    // Set the private bBE flag based on the format string - assume big-endianness
    bBE = (fmt.charAt(0) != '<');

    var re = new RegExp(this._sPattern, 'g');
    var m;
    var n;
    var s;
    var i = 0;
    var j;
    var lengthPtr = null, lengthType = null;

    while (m = re.exec(fmt)) {
      n = ((m[1] == undefined) || (m[1] == '')) ? 1 : parseInt(m[1]);

      // Null term string support
      if (m[2] === 'S') {
        n = values[i].length + 1; // Add one for null byte
      }
      
      if ((m[2] === 's' || m[2] === 'A') && lengthPtr !== null) //write length of the string/arr
      {
       s = this._lenLut[lengthType];
       var tmp = p;
       p = lengthPtr;
       
       el = this._elLut[lengthType];
       el.en(a, p, values[i].length);

       p = tmp;
       
       lengthPtr = null;
       lengthType = null;
       
       n = values[i].length;
      }

      s = this._lenLut[m[2]];
      
      if (m[5] && n === 1) //skip it - we'll fill it later
      {
       lengthType = m[2];
       lengthPtr = p;
       p += s;
       continue;
      }

      switch (m[2]) {
        case 'A':
        case 's':
        case 'S':
          if ((i + 1) > values.length) {
            return false;
          }
          this._elLut[m[2]].en(a, p, n, values[i]);
          i += 1;
          break;
        case 'c':
        case '?':
        case 'b':
        case 'B':
        case 'h':
        case 'H':
        case 'i':
        case 'I':
        case 'l':
        case 'L':
        case 'f':
        case 'd':
        case 'q':
        case 'Q':
          el = this._elLut[m[2]];
          if ((i + n) > values.length) {
            return false;
          }
          this._PackSeries(n, s, a, p, values, i);
          i += n;
          break;
        case 'x':
          for (j = 0; j < n; j++) {
            a[p + j] = 0;
          }
          break;
      }
      p += n * s;
    }

    return a;
  };

  // Pack the supplied values into a new octet array, according to the fmt string
  m.pack = function(fmt, values) {
    if (!Array.isArray(values))
    {
     var mf = fmt.match(/\([a-zA-Z0-9]+\)/g);
     var ret = [];
     for(var t=0;t<mf.length;t++)
     {
      ret.push(values[mf[t].slice(1,-1)]);
     }
     values = ret;
    }
  
    return this.packTo(fmt, [], 0, values);
  };
  
  //if returns null, this means it's variable
  m.calcLength = function(fmt) {
    if (!this._fixedPattern.test(fmt))
    return null;
    
    var re = new RegExp(this._sPattern, 'g');
    var sum = 0;
    var t;
    while (t = re.exec(fmt)) {
      sum += (((t[1] == undefined) || (t[1] == '')) ? 1 : parseInt(t[1])) * this._lenLut[t[2]];
    }
    return sum;
  };
};

window.JSPack = new JSPack();