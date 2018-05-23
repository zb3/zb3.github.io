zm = {};
zm.zc14 = {};
zm.zc14.load = function(element)
{
 if (element.children.length) return;

 var min = element.dataset.min, value = element.dataset.value, step = element.dataset.step, max = element.dataset.max, type = element.dataset.type;

 step = ((type=='int')?parseInt:parseFloat)(step);
 min = ((type=='int')?parseInt:parseFloat)(min);

 if (isNaN(min))
 min = -Infinity;

 max = ((type=='int')?parseInt:parseFloat)(max);

 if (isNaN(max))
 max = Infinity;

 value = ((type=='int')?parseInt:parseFloat)(value);

 if (isNaN(value) && !isNaN(min))
 value = min;
 else if (isNaN(value))
 value = 0;

 if (isNaN(step))
 step=1;

 var mbutton, input, pbutton;
 mbutton = document.createElement('button');
 mbutton.textContent = '-';
 mbutton.style.cssText = 'padding: 0; text-align: center; box-sizing: content-box; width: 13px;';
 mbutton.addEventListener('click', function(event)
 {
  element.dataset.value = value = value - step;
  event.stopPropagation();
 }, false);
 element.appendChild(mbutton);

 input = document.createElement('input');
 input.type = 'text'; input.value = value;
 input.style.cssText = 'width: 50px;';
 input.addEventListener('change', function(event)
 {
  var tvalue = ((type=='int')?parseInt:parseFloat)(input.value);
  if (!isNaN(tvalue))
  {
   element.dataset.value = value = tvalue;
  }
  else
  input.value = parseFloat(value.toFixed(4));
  event.stopPropagation();
 }, false);
 element.appendChild(input);

 pbutton = document.createElement('button');
 pbutton.textContent = '+';
 pbutton.style.cssText = 'padding: 0; text-align: center; box-sizing: content-box; width: 13px;';
 pbutton.addEventListener('click', function(event)
 {
  element.dataset.value = value = value + step;
  event.stopPropagation();
 }, false);
 element.appendChild(pbutton);

 function toggleDisabled()
 {
  mbutton.disabled = element.dataset.disabled=='true'?true:false;
  input.disabled = element.dataset.disabled=='true'?true:false;
  pbutton.disabled = element.dataset.disabled=='true'?true:false;
 }
 toggleDisabled();

 var poke = 0; //ehh, weird stuff, seriously :D
 function vchange(r)
 {
  if (poke) {poke--; return;}

  var t, tl, was = {};
  for(t=r.length-1;t>=0;t--)
  {
   if (r[t].attributeName=='data-value' && !was['data-value'])
   {
    var tvalue = ((type=='int')?parseInt:parseFloat)(element.dataset.value);
    
    if (!isNaN(tvalue))
    {
     value = Math.min(max, Math.max(min, tvalue))
    }
    poke++;
    element.dataset.value = value;
    input.value = parseFloat(value.toFixed(4));

    //hey also emit the change event on the element
    element.dispatchEvent(new CustomEvent('change'));
    was['data-value'] = 1;
   }
   else if (r[t].attributeName=='data-disabled' && !was['data-disabled'])
   {
    toggleDisabled();
    was['data-disabled'] = 1;
   }
   else if (r[t].attributeName=='data-min' && !was['data-min'])
   {
    min = ((type=='int')?parseInt:parseFloat)(element.dataset.min);
    if (isNaN(min))
    min = -Infinity;
    if (value<min)
    element.dataset.value = value;
    was['data-min'] = 1;
   }
   else if (r[t].attributeName=='data-max' && !was['data-max'])
   {
    max = ((type=='int')?parseInt:parseFloat)(element.dataset.max);
    if (isNaN(max))
    max = Infinity;
    if (value>max)
    element.dataset.value = value;
    was['data-max'] = 1;
   }
   else if (r[t].attributeName=='data-type' && !was['data-type'])
   {
    type = element.dataset.type;
    element.dataset.value = value;
    was['data-type'] = 1;
   }
  }
 }
 var observer = new MutationObserver(vchange);
 observer.observe(element, {attributes: true});
};
zm.gradient = {};
zm.gradient.load = function(element)
{
 function part_change(event)
 {
  val[tps.indexOf(event.target)] = event.target.value;
  poke++;
  event.stopPropagation();
  element.dataset.value = val.join(', ');
  element.dispatchEvent(new CustomEvent('change'));
 }

 var table = document.createElement('table'), row = table.insertRow(0), cell, nc, mbutton, pbutton;
 if (!element.dataset.value) 
 {
  poke++;
  element.dataset.value = '#000000';
 }
 var val = element.dataset.value.split(', '), t2, t2l=val.length, tps = [];
console.log('emin', element.dataset.min);
 var min = element.dataset.min?parseInt(element.dataset.min):1;

 for(var t2=0;t2<min;t2++)
 {
  cell = row.insertCell(t2);
  nc = document.createElement('input');
  nc.type = 'color'; nc.value = val[t2];
  nc.addEventListener('change', part_change, false);
  tps.push(nc);
  cell.appendChild(nc);
 }

 cell = row.insertCell(min);
 mbutton = document.createElement('button');
 mbutton.textContent = '-';
 cell.appendChild(mbutton);

 if (t2l>min)
 {
  for(var t2=min;t2<t2l;t2++)
  {
   cell = row.insertCell(t2+1);
   nc = document.createElement('input');
   nc.type = 'color'; nc.value = val[t2];
   nc.addEventListener('change', part_change, false);
   tps.push(nc);
   cell.appendChild(nc);
  }
 }
 else
 {
  cell.style.display = 'none';
 }
console.log(t2l);
 cell = row.insertCell(t2l+1);
 pbutton = document.createElement('button');
 pbutton.textContent = '+';
 cell.appendChild(pbutton);

 element.appendChild(table);

 mbutton.addEventListener('click', function(event)
 {
  val.length--;
  element.dataset.value = val.join(', ');
 }, false);

 pbutton.addEventListener('click', function(event)
 {
  val.push('#000000');
  element.dataset.value = val.join(', ');
 }, false);

 var poke = 0;
 function vchange(r)
 {
  if (poke) {poke--; return;}
  var t, t2, cell, nc;
  for(t=r.length-1;t>=0;t--) //we only want the last value
  {
   if (r[t].attributeName=='data-value')
   {
    val = element.dataset.value.split(', ');
    if (!val.length)
    val.push('#000000');
    tps[0].value = val[0];

    //now only those to be added
    for(t2=tps.length;t2<val.length;t2++)
    {
     cell = row.insertCell(row.children.length-1);
     nc = document.createElement('input');
     nc.type = 'color'; nc.value = val[t2];
     nc.addEventListener('change', part_change, false);
     tps.push(nc);
     cell.appendChild(nc);
    }

    //now those to be removed
    for(t2=tps.length-val.length-1;t2>=0;t2--)
    {
     tps.length--;
     row.deleteCell(row.children.length-2);
    }

    for(t2=val.length-1;t2>=0;t2--)
    tps[t2].value = val[t2];

    row.children[min].style.display = val.length>min?'table-cell':'none';

    element.dispatchEvent(new CustomEvent('change'));
   }
   break; //use was{} if you plan to add more attribute listeners
  }
 }
 var observer = new MutationObserver(vchange);
 observer.observe(element, {attributes: true});
}
zm.show = {};
zm.show.style = "\
zm-show > *:first-child\
{\
}\
zm-content\
{\
 background-color: #111111;\
 display: none;\
 overflow: hidden;\
 transition: max-height 0.4s;\
}\
zm-content > div\
{\
 padding: 10px;\
}\
zm-show .switch\
{\
 width: 30px; height: 30px;\
 z-index: 0;\
 margin-bottom: -25px;\
 display: block;\
 position: relative;\
 left: -50px;\
 transition: top 0.4s linear;\
}\
zm-show .switch.shown\
{\
 margin-bottom: -25px;\
}\
zm-show .switch:before\
{\
 content: '+';\
}\
zm-show .switch.shown:before\
{\
 content: '-';\
}\
zm-content.shown\
{\
 overflow: hidden;\
}\
";
zm.show.init = function()
{
 var style = document.createElement('style');
 style.appendChild(document.createTextNode(zm.show.style));
 document.head.appendChild(style);
};

zm.show.load = function(element)
{
 var cont = element.getElementsByTagName('zm-content')[0];
 element.dataset.value = '';
 var btn = document.createElement('button'); btn.className = 'switch';
 element.insertBefore(btn, cont);

 var around = document.createElement('div');
 while(cont.childNodes.length)
 {
  around.appendChild(cont.childNodes[0]);
 }
 
 cont.appendChild(around);

 var move = element.children[0].getBoundingClientRect().height/2+15+parseFloat(window.getComputedStyle(element.children[0]).marginBottom);
 var tnormal = -move, tshown = 6;
 
 var poke = 0;
 function toggle()
 {
  element.dataset.value = element.dataset.value=='shown'?'':'shown';
  
 }
 function setShown()
 {
  $(cont).show(400).css('display', 'block');
  btn.classList.add('shown');
  btn.style.top = tshown+'px';
 }
 function setHidden()
 {
  $(cont).hide(400);
  btn.classList.remove('shown');
  btn.style.top = tnormal+'px';
 }
 
 ((element.dataset.value=='shown')?setShown:setHidden)();
 
 var poke = 0;
 function vchange(r)
 {
  if (poke) {poke--; return;}
  var t, t2;
  for(t=r.length-1;t>=0;t--) //we only want the last value
  {
   if (r[t].attributeName=='data-value')
   {
    ((element.dataset.value=='shown')?setShown:setHidden)();
    element.dispatchEvent(new CustomEvent('change'));
    break; //unsafe if you add another attribute
   }
  }
 }
 var observer = new MutationObserver(vchange);
 observer.observe(element, {attributes: true});
 
 btn.addEventListener('click', toggle, false);
};
zm.elements = {index: ['zc14', 'gradient', 'show'], zc14: {load: zm.zc14.load}, gradient: {load: zm.gradient.load}, show: {init: zm.show.init, load: zm.show.load}};
zm.elements.observe = function(record)
{
 var t, tl, t2, newOne, t2l, desired, walker;
 for(t=0,tl=record.length;t<tl;t++)
 {
  for(t2=0,newOne=record[t].addedNodes,t2l=newOne.length;t2<t2l;t2++)
  {
   walker = document.createTreeWalker(newOne[t2], NodeFilter.SHOW_ELEMENT, null, false);
   do
   {
    if (walker.currentNode.tagName && walker.currentNode.tagName.substr(0, 3)=='ZM-')
    {
     desired = walker.currentNode.tagName.toLowerCase().substr(3);
     if (zm.elements[desired])
     {
      zm.elements[desired].load(walker.currentNode);
     }
    }
   } while (walker.nextNode());
  }
  for(t2=0,newOne=record[t].removedNodes,t2l=newOne.length;t2<t2l;t2++)
  {
   walker = document.createTreeWalker(newOne[t2], NodeFilter.SHOW_ELEMENT, null, false);
   do
   {
    if (walker.currentNode.tagName && walker.currentNode.tagName.substr(0, 3)=='ZM-')
    {
     desired = walker.currentNode.tagName.toLowerCase().substr(3);
     if (zm.elements[desired] && zm.elements[desired].unload)
     {
      zm.elements[desired].unload(walker.currentNode);
     }
    }
   } while (walker.nextNode());
  }
 }
};
zm.elements.init = function()
{
 //search for existing elements
 var t, tl, elements, t2, t2l; 
 for(t=0,tl=zm.elements.index.length;t<tl;t++)
 {
  if (zm.elements[zm.elements.index[t]].init)
  {
   zm.elements[zm.elements.index[t]].init();
  }
  elements = document.querySelectorAll('zm-'+zm.elements.index[t]);
  for(t2=0,t2l=elements.length;t2<t2l;t2++)
  {
   zm.elements[zm.elements.index[t]].load(elements[t2]);
  }
 }
 zm.elements.observer = new MutationObserver(zm.elements.observe);
 zm.elements.observer.observe(document, {childList: true, subtree: true})
};