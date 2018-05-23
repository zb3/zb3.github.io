function doVKbeautifyXML(str)
{
 var step = getInputString('beautify-indent');
 return step ? vkbeautifyXML(str, step) : str;
}

function doJSON2XML(str)
{
 var xml = json2xml(JSON.parse(str));
 return doVKbeautifyXML(xml);
}

function doXML2JSON(str)
{
 var xml = new DOMParser().parseFromString(str, 'text/xml');
 return beautifyJSON(xml2json(xml));
}

/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006, zb3/2016
	Web:     http://goessner.net/ 
*/
/**
* vkBeautify - javascript plugin to pretty-print or minify text in XML, JSON, CSS and SQL formats.
*  
* Version - 0.99.00.beta 
* Copyright (c) 2012 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/vkbeautify/
* 
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/


/*
changes by zb3:

-removed indent
-fixed escape
-partially allowed whitespace
-addedd escape for json->xml conversion
*/

tcLoad('json2xml', (function(){

function escapeXMLChar(c)
{
 switch (c)
 {
  case '<': return '&lt;';
  case '>': return '&gt;';
  case '&': return '&amp;';
  case "'": return '&apos;';
  case '"': return '&quot;';
 }
 return c;
}

function escapeXML(str) {
 return str.replace(/[<>&'"]/g, escapeXMLChar);
}

function json2xml(o) {
   var toXml = function(v, name) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += toXml(v[i], name);
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + escapeXML(v[m].toString()) + "\"";
            else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";

         if (hasChild) {
                     
            for (var m in v) {
               if (m == '#text') {
                  xml += escapeXML(v['#text']);
               } else if (m == "#cdata") {
                  xml += "<![CDATA[" + v[m] + "]]>";
               }
               else if (m !== '#text' && m.charAt(0) != "@") {
                  xml += toXml(v[m], m);
               }
            }            
            xml += "</" + name + ">";
         }
      }
      else {
         xml += "<" + name + ">" + escapeXML(v.toString()) +  "</" + name + ">";
      }
      return xml;
   }, xml="";

   for (var m in o)
      xml += toXml(o[m], m);

   return xml;
}

return {export: json2xml};

})());

function xml2json(xml) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3) textChild++; // text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = n.nodeValue;
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = n.nodeValue;
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.innerXml(xml);
                     else
                        o["#text"] = X.innerXml(xml);
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.innerXml(xml);
                  else
                     o["#text"] = X.innerXml(xml);
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.innerXml(xml);
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = n.nodeValue;
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType);
         return o;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      removeWhite: function(e) {
         e.normalize();
         debugger;
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3 && e.childNodes.length !== 1) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;

   var json = {};
   json[xml.nodeName] = X.toObj(X.removeWhite(xml));
   
   return JSON.stringify(json);
}

tcLoad('vkbeautifyXML', (function() {

function createShiftArr(step) {

	var space = '    ';
	
	if ( isNaN(parseInt(step)) ) {  // argument is string
		space = step;
	} else { // argument is integer
		switch(step) {
			case 1: space = ' '; break;
			case 2: space = '  '; break;
			case 3: space = '   '; break;
			case 4: space = '    '; break;
			case 5: space = '     '; break;
			case 6: space = '      '; break;
			case 7: space = '       '; break;
			case 8: space = '        '; break;
			case 9: space = '         '; break;
			case 10: space = '          '; break;
			case 11: space = '           '; break;
			case 12: space = '            '; break;
		}
	}

	var shift = ['\n']; // array of shifts
	for(var ix=0;ix<100;ix++){
		shift.push(shift[ix]+space); 
	}
	return shift;
}

var vkbeautifyXML = function(text,step) {

	var ar = text.replace(/>\s{0,}</g,"><")
				 .replace(/</g,"~::~<")
				 .replace(/\s*xmlns\:/g,"~::~xmlns:")
				 .replace(/\s*xmlns\=/g,"~::~xmlns=")
				 .split('~::~'),
		len = ar.length,
		inComment = false,
		deep = 0,
		str = '',
		ix = 0,
		shift = createShiftArr(step),
		withNamespace = 0;

		for(ix=0;ix<len;ix++) {
			// start comment or <![CDATA[...]]> or <!DOCTYPE //
			if(ar[ix].search(/<!/) > -1) { 
				str += shift[deep]+ar[ix];
				inComment = true; 
				// end comment  or <![CDATA[...]]> //
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) { 
					inComment = false; 
				}
			} else 
			// end comment  or <![CDATA[...]]> //
			if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) { 
				str += ar[ix];
				inComment = false; 
			} else 
			// <elm></elm> //
			if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
				/^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) { 
				str += ar[ix];
				if(!inComment) deep--;
			} else
			 // <elm> //
			if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
				str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
			} else 
			 // <elm>...</elm> //
			if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
			} else 
			// </elm> //
			if(ar[ix].search(/<\//) > -1) { 
				--deep;
				str = !inComment && !withNamespace? str += shift[deep] + ar[ix] : str += ar[ix];
			} else 
			// <elm/> //
			if(ar[ix].search(/\/>/) > -1 ) { 
				str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
				if (ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1)
			        deep--;
			} else 
			// <? xml ... ?> //
			if(ar[ix].search(/<\?/) > -1) { 
				str += shift[deep]+ar[ix];
			} else 
			// xmlns //
			if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) { 
				str += shift[deep]+ar[ix];
				withNamespace = 2;
			} 
			
			else {
				str += ar[ix];
			}
			if (withNamespace)
				withNamespace--;
		}
		
	return  (str[0] == '\n') ? str.slice(1) : str;
};

return {export: vkbeautifyXML};

})());
