var b = {};
b.element = document.getElementById('bdisplay');
b.celement = document.getElementById('bchances');
b.bgcanvas = document.getElementById('bgcanvas');
b.bgcanvas.id = 'bgcanvas';
b.bkcanvas = document.createElement("canvas");
b.bgc = b.bgcanvas.getContext('2d');
b.bkc = b.bkcanvas.getContext('2d');
b.bcc = b.celement.getContext('2d');
b.c = b.element.getContext('2d');
b.rg1 = [[140, 140, 140], [0, 200, 200]]; b.rg2 = 0;
b.rg = [];
b.gen = b.clr = function(){}
b.borderx = 1; b.bordery = 2;
b.g1 = [0,0,0]; b.g2 = [32,32,32];
b.c.strokeStyle = 'rgb(120, 120, 120)';
b.pbg = function()
{
 b.bgc.fillStyle=b.gr;
 b.bgc.fillRect(0,0,b.element.width,b.element.height);
}
b.clr = function()
{
 b.bkc.clearRect(0, 0, b.bkcanvas.width, b.bkcanvas.height);
}
b.gen = function()
{
 b.darray = [];
 for(var t=0;t<b.rg1.length;t++)
 {
  //should we use 120,120,120 for stroking? we'll see
  b.bkc.strokeStyle = 'rgb(120, 120, 120)'; 
  b.bkc.strokeRect(b.borderx+0.5+t*b.bsizex, b.bordery+0.5, b.bsizex-2*b.borderx, b.bsizey-2*b.bordery);
  b.bkc.fillStyle=b.rg[t];
  b.bkc.fillRect(b.borderx+0.5+t*b.bsizex,b.bordery+0.5, b.bsizex-2*b.borderx, b.bsizey-2*b.bordery);
  b.bkc.fillStyle='white';
  b.bkc.beginPath();
  for(var t2=0;t2<5;t2++)
  b.bkc.lineTo(0.5+b.bsizex/2+b.bsizex*0.30*Math.sin((t2*4*Math.PI)/5)+t*b.bsizex, 0.5+b.bsizey/2-b.bsizey*0.30*Math.cos  ((t2*4*Math.PI)/5));
  b.bkc.fill();
  b.darray[t] = b.bkc.getImageData(b.bsizex*t, 0, b.bsizex, b.bsizey);
 } 
}
b.bg = function()
{
 b.c.clearRect(0, 0, b.element.width, b.element.height);
}
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
b.updateBg = function()
{
 b.gr=b.bgc.createLinearGradient(0,0,0,b.element.height);
 b.gr.addColorStop(0,'rgb('+b.g1[0]+', '+b.g1[1]+', '+b.g1[2]+')');
 b.gr.addColorStop(1,'rgb('+b.g2[0]+', '+b.g2[1]+', '+b.g2[2]+')');

 b.pbg();
}
b.updateFg = function()
{
 var a=0.5, k=0.5, c=0.75;
 for(var t=0;t<b.rg1.length;t++)
 {
  b.rg[t] = b.bkc.createRadialGradient(b.bsizex*a+t*b.bsizex,b.bsizex*k,0,b.bsizex*a+t*b.bsizex,b.bsizex*k,b.bsizex*c);
  b.rg[t].addColorStop(0,'rgb('+b.rg1[t][0]+', '+b.rg1[t][1]+', '+b.rg1[t][2]+')');
  b.rg[t].addColorStop(1,'rgb('+b.rg2+', '+b.rg2+', '+b.rg2+')');
 }
 b.clr();
 b.gen();
}
b.initDisplay = function()
{
 b.bgcanvas.width = b.element.width = b.dimx*b.bsizex+2*b.borderx; b.bgcanvas.height = b.element.height = b.dimy*b.bsizey+2*b.bordery;
 b.bkcanvas.width = b.rg1.length*b.bsizex+2*b.borderx; b.bkcanvas.height = b.bsizey+2*b.bordery;

 document.getElementById('relholder').style.width = b.bgcanvas.width+10+'px';
 document.getElementById('relholder').style.height = b.bgcanvas.height+'px';

 b.updateBg();

 b.celement.width = b.chance_no*b.bsizex+2*b.borderx; b.celement.height = b.bsizey+2*b.bordery;

 b.updateFg();

 b.bg();
}