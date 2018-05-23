var b = {};
b.element = document.getElementById('bdisplay');
b.celement = document.getElementById('bchances');
b.bgcanvas = document.getElementById("bgcanvas");
b.bkcanvas = document.createElement("canvas");
b.bgc = b.bgcanvas.getContext('2d');
b.bkc = b.bkcanvas.getContext('2d');
b.bcc = b.celement.getContext('2d');
b.c = b.element.getContext('2d');
b.rg1 = [[140, 140, 140], [0, 200, 200]]; b.rg2 = 0;
b.rg = [];
b.gen = b.clr = function(){}
b.setBsize = function(x, y)
{
 b.bsizex = x; b.bsizey = y;
 var a=0.5, k=0.5, c=0.75;
//#starthere  test the whole color thing
 for(var t=0;t<b.rg1.length;t++)
 {
  b.rg[t] = b.bkc.createRadialGradient(x*a+t*b.bsizex,x*k,0,x*a+t*b.bsizex,x*k,x*c);
  b.rg[t].addColorStop(0,'rgb('+b.rg1[t][0]+', '+b.rg1[t][1]+', '+b.rg1[t][2]+')');
  b.rg[t].addColorStop(1,'rgb('+b.rg2+', '+b.rg2+', '+b.rg2+')');
 }
 b.clr();
 b.gen();
};
b.setBsize(bsizex, bsizey);
b.g1 = [0,0,0]; b.g2 = [20,20,20];
b.borderx = 1; b.bordery = 2;
b.setDim = function(x,y, cw, ch)
{
 b.bgcanvas.width = b.element.width = x*b.bsizex+2*b.borderx; b.bgcanvas.height = b.element.height = y*b.bsizey+2*b.bordery;
 b.bkcanvas.width = b.rg1.length*b.bsizex+2*b.borderx; b.bkcanvas.height = b.bsizey+2*b.bordery;

 document.getElementById('relholder').style.width = b.bgcanvas.width+10+'px';
 document.getElementById('relholder').style.height = b.bgcanvas.height+'px';


 b.carray = [];

 b.gr=b.bgc.createLinearGradient(0,0,0,b.element.height);
 b.gr.addColorStop(0,'rgb('+b.g1[0]+', '+b.g1[1]+', '+b.g1[2]+')');
 b.gr.addColorStop(1,'rgb('+b.g2[0]+', '+b.g2[1]+', '+b.g2[2]+')');
}
b.setDim(bdimx, bdimy, cdx, cdy);
b.setC = function(n)
{
 b.celement.width = n*b.bsizex+2*b.borderx; b.celement.height = b.bsizey+2*b.bordery;
}
b.setC(chance_no);
b.pbg = function()
{
 b.bgc.fillStyle=b.gr;
 b.bgc.fillRect(0,0,b.element.width,b.element.height);
}
b.pbg();
b.c.strokeStyle = 'rgb(120, 120, 120)';
b.clr = function()
{
 b.bkc.clearRect(0, 0, b.bkcanvas.width, b.bkcanvas.height);
}
b.gen = function()
{
 b.darray = [];
 //for color we need to paint in x line
 //we have space 4 that coz bkcanvas is the same as bgcanvas. weird
 for(var t=0;t<b.rg1.length;t++)
 {
  //should we use 120,120,120 for stroking? we'll see
  b.bkc.strokeStyle = 'rgb(120, 120, 120)'; 
  b.bkc.strokeRect(b.borderx+0.5+t*bsizex, b.bordery+0.5, b.bsizex-2*b.borderx, b.bsizey-2*b.bordery);
  b.bkc.fillStyle=b.rg[t];
  b.bkc.fillRect(b.borderx+0.5+t*bsizex,b.bordery+0.5, b.bsizex-2*b.borderx, b.bsizey-2*b.bordery);
  b.bkc.fillStyle='white';
  b.bkc.beginPath();
  for(var t2=0;t2<5;t2++)
  b.bkc.lineTo(0.5+b.bsizex/2+b.bsizex*0.30*Math.sin((t2*4*Math.PI)/5)+t*bsizex, 0.5+b.bsizey/2-b.bsizey*0.30*Math.cos  ((t2*4*Math.PI)/5));
  b.bkc.fill();
  b.darray[t] = b.bkc.getImageData(b.bsizex*t, 0, b.bsizex, b.bsizey);
 } 
}
b.gen();
b.bg = function()
{
 b.c.clearRect(0, 0, b.element.width, b.element.height);
 b.c.setTransform(1, 0, 0, 1, 0, 0);
}
b.bg();
b.bk = function(x, y, color)
{
 if (!color) color = 0;
 b.c.putImageData(b.darray[color], b.borderx+b.bsizex*x, b.bordery+b.bsizey*y);
}
b.sc = function(c)
{
 b.bcc.clearRect(0, 0, b.celement.width, b.celement.height);
 for(var t=0;t<c;t++)
 {
  b.bcc.drawImage(b.bkcanvas, 0, 0, b.bsizex, b.bsizey, b.borderx+b.bsizex*t, b.bordery, b.bsizex, b.bsizey);
 }
}
/*
but this probably sucks - we'd like to have bkdata as array, wouldn't we?
well, putimagedata does what it does - doesn't blend
maybe custom blend function operating on typed arrays would be faster, but now look @ the other idea below:

IDIOT!!!!
maybe "premake" the whole car? wouldnt that be faster?
lol sometimes the most obvious thing is the hardest to notice...
*/