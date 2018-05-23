(function(){

function saveCursors(element)
{
 saveCursors.saved = [element, element.selectionStart, element.selectionEnd];
}
function restoreCursors()
{
 saveCursors.saved[0].selectionStart = saveCursors.saved[1];
 saveCursors.saved[0].selectionEnd = saveCursors.saved[2];
}

document.addEventListener('DOMContentLoaded', function()
{
 function e(id) {return document.getElementById('cconv-'+id);}

 var preview = e('preview'), selMode = e('selmode'), cnA = e('cnA'), cnB = e('cnB'), cnC = e('cnC');
 var rangeA = e('rangeA'), rangeB = e('rangeB'), rangeC = e('rangeC'), ranges = [rangeA, rangeB, rangeC];
 var valA = e('valA'), valB = e('valB'), valC = e('valC');
 var postA = e('postA'), postB = e('postB'), postC = e('postC');
 var outHex = e('outHex'), outRGB = e('outRGB'), outHSV = e('outHSV'), outHSL = e('outHSL');

 var lastMode = -1;
 var mode = 0; //0-RGB, 1-HSV, 2-HSL
 var current = [0, 255, 255]; //always RGB
 var ctmp = [];
 var lastModeVars = [0, 255, 255];

 //We need it, coz conversion can return undefined
 //which means all values are OK, so cause least confusion...
 var lastH = 0, lastSV = 0, lastSL = 0;


 var dummyPicker = document.createElement('input');
 dummyPicker.type = 'color';
 dummyPicker.style.position = 'absolute';
 dummyPicker.style.left = '-200px';
 document.body.appendChild(dummyPicker);

 var toRGB = [null, ColorConverter.HSVtoRGB, ColorConverter.HSLtoRGB];

 //bind elements

 preview.onclick = function()
 {
  dummyPicker.value = ColorConverter.outputHex(current);
  dummyPicker.click();
 };

 selMode.onchange = function()
 {
  mode = selMode.selectedIndex;
  update();
 };

 rangeA.oninput = rangeB.oninput = rangeC.oninput = function ()
 {
  lastModeVars[0] = rangeA.value*(mode?0.1:1);
  lastModeVars[1] = rangeB.value*(mode?0.1:1);
  lastModeVars[2] = rangeC.value*(mode?0.1:1);
  updateFromMode();
 };

 valA.onchange = valB.onchange = valC.onchange = function()
 {
  lastModeVars[0] = parseFloat(valA.value) || 0;
  lastModeVars[1] = parseFloat(valB.value) || 0;
  lastModeVars[2] = parseFloat(valC.value) || 0;

  saveCursors(document.activeElement);
  updateFromMode();
  restoreCursors();
 };

 dummyPicker.onchange = function() {current = ColorConverter.parseHex(dummyPicker.value);update();};

 function onOutputChange(el, conv)
 {
  saveCursors(el);
  current = conv(el.value);
  update();
  restoreCursors();
 }

 outHex.onchange = onOutputChange.bind(this, outHex, ColorConverter.parseHex);
 outRGB.onchange = onOutputChange.bind(this, outRGB, ColorConverter.parseRGB);
 outHSV.onchange = onOutputChange.bind(this, outHSV, ColorConverter.parseHSV);
 outHSL.onchange = onOutputChange.bind(this, outHSL, ColorConverter.parseHSL);

 
 //update functions
 function updateFromMode()
 {
  if (mode) lastH = lastModeVars[0];
  if (mode === 1) lastSV = lastModeVars[1];
  if (mode === 2) lastSL = lastModeVars[1];

  if (mode)
  toRGB[mode](lastModeVars, current);
  else current = lastModeVars.slice();

  update();
 }

 function update()
 {
  if (lastMode !== mode)
  {
   cnA.textContent = ['R', 'H', 'H'][mode]+':'; postA.textContent = ['', '°', '°'][mode];
   cnB.textContent = ['G', 'S', 'S'][mode]+':'; postB.textContent = ['', '%', '%'][mode];
   cnC.textContent = ['B', 'V', 'L'][mode]+':'; postC.textContent = ['', '%', '%'][mode];

   rangeA.max = mode?3600:255;
   rangeB.max = mode?1000:255;
   rangeC.max = mode?1000:255;

   lastMode = mode;
  }

  var hex = ColorConverter.outputHex(current), hstmp, hsv = [], hsl = [];
  ColorConverter.RGBtoHSV(current, hsv, lastH, lastSV);
  ColorConverter.RGBtoHSL(current, hsl, lastH, lastSL);

  lastH = hsv[0];
  lastSV = hsv[1];
  lastSL = hsl[1];

  preview.style.backgroundColor = hex;

  //hardest part - update bars
  var tmp, tmp2;

  if (!mode)
  {
   for(var t=0;t<3;t++)
   {
    ctmp[0] = current[0]; ctmp[1] = current[1]; ctmp[2] = current[2];

    ctmp[t] = 0;
    tmp = 'linear-gradient(to right, '+ColorConverter.outputRGB(ctmp)+', ';
    ctmp[t] = 255;
    tmp += ColorConverter.outputRGB(ctmp)+')';
    ranges[t].style.background = tmp;
    ctmp[t] = current[t];
   }
  }
  else //if (mode === 1 || mode === 2)
  {
   hstmp = []; 
   if (mode === 1) {hstmp = hsv.slice();} 
   if (mode === 2) {hstmp = hsl.slice();}
   
   //fill hue @ 0 60 120 180 240 300 360

   tmp = ''; tmp2 = hstmp[0];
   for(var h=0;h<=360;h+=60)
   {
    hstmp[0] = h;
    toRGB[mode](hstmp, ctmp);
    tmp += ColorConverter.outputRGB(ctmp);
    if (h<360) tmp += ', ';
   }
   rangeA.style.background = 'linear-gradient(to right, '+tmp+')';
   hstmp[0] = tmp2;


   //fill saturation
   tmp = ''; tmp2 = hstmp[1];
   hstmp[1] = 0;
   toRGB[mode](hstmp, ctmp);
   tmp += ColorConverter.outputRGB(ctmp)+', ';
   hstmp[1] = 100;
   toRGB[mode](hstmp, ctmp);
   tmp += ColorConverter.outputRGB(ctmp);
   rangeB.style.background = 'linear-gradient(to right, '+tmp+')';
   hstmp[1] = tmp2;

   //fill value or light
   tmp = 'rgb(0,0,0), '; tmp2 = hstmp[2];

   hstmp[2] = mode ===2 ? 50 : 100;
   toRGB[mode](hstmp, ctmp);
   tmp += ColorConverter.outputRGB(ctmp);
   
   if (mode === 2)
   tmp += ', rgb(255,255,255)';

   rangeC.style.background = 'linear-gradient(to right, '+tmp+')';
   hstmp[2] = tmp2;
  }

  //fill mode values
  if (!(mode && hsv[0]===0 && +rangeA.value === 3600))
  rangeA.value = mode===0?current[0]:mode===1?hsv[0]*10:hsl[0]*10;
  rangeB.value = mode===0?current[1]:mode===1?hsv[1]*10:hsl[1]*10;
  rangeC.value = mode===0?current[2]:mode===1?hsv[2]*10:hsl[2]*10;
  if (mode)
  {
   valA.value = +(mode===1?hsv[0]:hsl[0]).toFixed(1); //hue is the same...
   valB.value = +(mode===1?hsv[1]:hsl[1]).toFixed(1);
   valC.value = +(mode===1?hsv[2]:hsl[2]).toFixed(1);
  }
  else
  {
   valA.value = Math.round(current[0]);
   valB.value = Math.round(current[1]);
   valC.value = Math.round(current[2]);
  }

  //and output colors
  outHex.value = hex;
  outRGB.value = ColorConverter.outputRGB(current);
  outHSV.value = ColorConverter.outputHSV(hsv);
  outHSL.value = ColorConverter.outputHSL(hsl);
 }

 mode=selMode.selectedIndex;
 update();
 
});

})();