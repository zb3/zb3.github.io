var ColorConverter = {};
ColorConverter.HSVtoRGB = function(hsv, rgb)
{
 var i, f, p, q, t;
 var h = hsv[0], s = hsv[1], v = hsv[2], r, g, b;

 if(s == 0)
 {
  rgb[0] = rgb[1] = rgb[2] = v*255/100;
  return;
 }

 if (h>=360) h=0;

 h /= 60;
 s /= 100;
 v /= 100;

 i = h|0;
 f = h-i;
 p = v*(1-s);
 q = v*(1-s*f);
 t = v*(1-s*(1-f));

 //I could do [array][i], but not creating it is faster

 if (i === 0) {r = v; g = t; b = p;}
 else if (i === 1) {r = q; g = v; b = p;} 
 else if (i === 2) {r = p; g = v; b = t;}
 else if (i === 3) {r = p; g = q; b = v;} 
 else if (i === 4) {r = t; g = p; b = v;}
 else if (i === 5) {r = v; g = p; b = q;}

 rgb[0] = r * 255;
 rgb[1] = g * 255;
 rgb[2] = b * 255;
};
ColorConverter._hue2rgb = function(p, q, t)
{
 if(t < 0) t += 1;
 if(t > 1) t -= 1;
 if(t < 1/6) return p + (q - p) * 6 * t;
 if(t < 1/2) return q;
 if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
 
 return p;
};
ColorConverter.HSLtoRGB = function(hsl, rgb)
{
 var h = hsl[0], s = hsl[1], l = hsl[2], r, g, b;
 var l, q, p;

 h /= 360;
 s /= 100;
 l /= 100;

 if (!s)
 {
  r=g=b=l;
 }
 else
 {
  q = l < 0.5 ? l*(1+s) : l+s-l*s;
  p = 2 * l - q;
  r = ColorConverter._hue2rgb(p, q, h + 1 / 3);
  g = ColorConverter._hue2rgb(p, q, h);
  b = ColorConverter._hue2rgb(p, q, h - 1 / 3);
 }

 rgb[0] = r * 255;
 rgb[1] = g * 255;
 rgb[2] = b * 255;
};

ColorConverter.RGBtoHSV = function(rgb, hsv, dh, ds)
{
 var r = rgb[0]/255, g = rgb[1]/255, b = rgb[2]/255, h, s, v, min, max, d;

 min = Math.min(r, g, b);
 max = Math.max(r, g, b);
 d = max-min;
 v = max;

 if (max)
 s = 100*d/max;
 else
 s = ds ? ds : 0;

 if (d>0.0001) //reality :(
 {
  if (max === r)
  h = (g-b)/d;
  else if (max === g)
  h = 2+(b-r)/d;
  else
  h = 4+(r-g)/d;

  h *= 60;
  if (h < 0) h += 360;
 }
 else h = dh ? dh : 0;

 hsv[0] = h;
 hsv[1] = s;
 hsv[2] = v*100;
};


ColorConverter.RGBtoHSL = function(rgb, hsl, dh, ds)
{
 var r = rgb[0]/255, g = rgb[1]/255, b = rgb[2]/255, h, s, l, min, max, d;

 min = Math.min(r, g, b);
 max = Math.max(r, g, b);
 l = (min+max)/2;

 if (max !== min)
 {
  d = max-min;
  s = l > 0.5 ? d/(2-max-min) : d/(max + min);
  s *= 100;

  if (max === r)
  h = (g-b)/d + (g<b ? 6 : 0);
  else if (max === g)
  h = (b-r)/d+2;
  else
  h = (r-g)/d+4;

  h *= 60;
 }
 else
 {
  h = dh ? dh : 0;

  if (!max || min===1)
  s = ds ? ds : 0;
  else s = 0;
 }

 hsl[0] = h;
 hsl[1] = s;
 hsl[2] = l*100;
};



ColorConverter.parseHex = function(str)
{
 if (!str) return [0, 0, 0];

 if (str[0] === '#')
 str = str.substr(1);

 if (str.length === 3)
 str = str[0]+str[0]+str[1]+str[1]+str[2]+str[2];

 return [parseInt(str.substr(0, 2), 16) || 0, parseInt(str.substr(2, 2), 16) || 0, parseInt(str.substr(4, 2), 16) || 0];
};
ColorConverter.parseRGB = function(str)
{
 var arr = str.replace(/^[^\d%]*/, '').replace(/[^\d%]*$/, '').split(/[^\d%]+/)
 for(var t=0;t<3 && t<arr.length;t++)
 arr[t] = Math.min(Math.round((parseInt(arr[t]) || 0)*(arr[t].indexOf('%')>-1?255/100:1)), 255);
 
 for(t=arr.length;t<3;t++)
 arr[t] = 0;

 return arr;
};
ColorConverter._parseHS = function(str, convert)
{
 var arr = str.replace(/^[^\d%.]*/, '').replace(/[^\d%.]*$/, '').split(/[^\d%.]+/);

 arr[0] = parseFloat(arr[0]) || 0;

 for(var t=1,tmp;t<3 && t<arr.length;t++)
 {
  tmp = Math.min(parseFloat(arr[t]) || 0, 100);
  if (arr[t].indexOf('%')>-1 || tmp>1)
  {
   arr[t] = tmp;
  }
  else
  {
   arr[t] = Math.round(100*(parseFloat(arr[t]) || 0));
  }
 }

 for(t=arr.length;t<3;t++)
 arr[t] = 0;

 var ret = [];
 convert(arr, ret);

 return ret;
};
ColorConverter.parseHSV = function(str)
{
 return ColorConverter._parseHS(str, ColorConverter.HSVtoRGB);
};
ColorConverter.parseHSL = function(str)
{
 return ColorConverter._parseHS(str, ColorConverter.HSLtoRGB);
};
ColorConverter._c2h = function(c)
{
 var h = c.toString(16);
 return h.length===1?'0'+h:h;
};
ColorConverter.outputHex = function(rgb)
{
 return '#'+ColorConverter._c2h(Math.round(rgb[0]))+ColorConverter._c2h(Math.round(rgb[1]))+ColorConverter._c2h(Math.round(rgb[2]));
};
ColorConverter.outputRGB = function(rgb)
{
 return 'rgb('+Math.round(rgb[0])+','+Math.round(rgb[1])+','+Math.round(rgb[2])+')';
};
ColorConverter.outputHSV = function(hsv)
{
 return 'hsv('+(+hsv[0].toFixed(1))+','+(+hsv[1].toFixed(1))+'%,'+(+hsv[2].toFixed(1))+'%)';
};
ColorConverter.outputHSL = function(hsl)
{
 return 'hsl('+(+hsl[0].toFixed(1))+','+(+hsl[1].toFixed(1))+'%,'+(+hsl[2].toFixed(1))+'%)';
};