"use strict";


eat.Controlls = function(element, minX, maxX, minY, maxY, sensitivity, x, y, callback) {
  this.originX = x || 0;
  this.originY = y || 0;
  this.sensitivity = sensitivity;
  this.minX = minX;
  this.maxX = maxX;
  this.minY = minY;
  this.maxY = maxY;
  this.element = element;
  this.callback = callback;

  this._downFunc = this.downFunc.bind(this);
  this._touchStartFunc = this.touchStartFunc.bind(this);
  this._moveFunc = this.moveFunc.bind(this);
  this._upFunc = this.upFunc.bind(this);
  this._touchMoveFunc = this.touchMoveFunc.bind(this);
  this._touchEndFunc = this.touchEndFunc.bind(this);
};
eat.Controlls.prototype.reset = function(x, y) {
  this.originX = x || 0;
  this.originY = y || 0;
};
eat.Controlls.prototype.enable = function() {
  this.element.addEventListener('mousedown', this._downFunc);
  this.element.addEventListener('touchstart', this._touchStartFunc);
};
eat.Controlls.prototype.disable = function() {
  this.element.removeEventListener('mousedown', this._downFunc);
  this.element.removeEventListener('touchstart', this._touchStartFunc);
};
eat.Controlls.prototype.handlePointerPosition = function(cx, cy) {
  if (this.originX + cx - this.currentX >= this.minX && this.originX + cx - this.currentX <= this.maxX) {
    this.originX += cx - this.currentX;
    this.currentX = cx;
  }

  if (this.originY + cy - this.currentY >= this.minY && this.originY + cy - this.currentY <= this.maxY) {
    this.originY += cy - this.currentY;
    this.currentY = cy;
  }

  this.callback(this.originX, this.originY, true);
};
eat.Controlls.prototype.touchStartFunc = function(event) {
  this.element.addEventListener('touchmove', this._touchMoveFunc);
  this.element.addEventListener('touchend', this._touchEndFunc);
  this.element.addEventListener('touchcancel', this._touchEndFunc);

  if (event.changedTouches.length) {
    this.currentX = event.changedTouches[0].pageX / this.sensitivity;
    this.currentY = event.changedTouches[0].pageY / this.sensitivity;
  }

  event.preventDefault();
};
eat.Controlls.prototype.touchMoveFunc = function(event) {
  if (event.changedTouches.length) {
    var cx = event.changedTouches[0].pageX / this.sensitivity,
      cy = event.changedTouches[0].pageY / this.sensitivity;
    this.handlePointerPosition(cx, cy);
  }
  event.preventDefault();
};
eat.Controlls.prototype.touchEndFunc = function(event) {
  this.element.removeEventListener('touchmove', this._touchMoveFunc);
  this.element.removeEventListener('touchend', this._touchEndFunc);
  this.element.removeEventListener('touchcancel', this._touchEndFunc);
  event.preventDefault();
};
eat.Controlls.prototype.downFunc = function(event) {
  document.addEventListener('mousemove', this._moveFunc);
  document.addEventListener('mouseup', this._upFunc);
  this.currentX = event.clientX / this.sensitivity;
  this.currentY = event.clientY / this.sensitivity;
  event.preventDefault();
};
eat.Controlls.prototype.moveFunc = function(event) {
  var cx = event.clientX / this.sensitivity,
    cy = event.clientY / this.sensitivity;

  this.handlePointerPosition(cx, cy);
  event.preventDefault();
};
eat.Controlls.prototype.upFunc = function() {
  document.removeEventListener('mousemove', this._moveFunc);
  document.removeEventListener('mouseup', this._upFunc);
};


eat.Display = function(refX, refY, scale, theme) //canvas meter should have reference stuff
  {
    this.originX = this.originY = 0;

    this.theme = theme || 0; //or random or cookie
    this.themeMap = [];
    this._fillThemeMap();
    this.frameBackground = 'rgba(255, 255, 255, 0.83)';
    this.separatorEnabled = false;
    this.separatorColor = '#777';
    this.borderWidth = 8;
    this.borderColor = '#333';

    this.resize(refX, refY, scale);
  };
eat.Display.prototype._fillThemeMap = function() {
  if (this.themeMap.length != this.themes[this.theme].length) {
    this.themeMap.length = 0;
    while (this.themeMap.length < this.themes[this.theme].length)
      this.themeMap.push(this.themeMap.length);
    this.shuffleTheme();
  }
};
eat.Display.prototype.shuffleTheme = function() {
  var t, t2;
  for (t = this.themeMap.length - 1; t > 0; t--) {
    t2 = Math.floor(Math.random() * (t + 1));
    if (t != t2) {
      this.themeMap[t] ^= this.themeMap[t2];
      this.themeMap[t2] ^= this.themeMap[t];
      this.themeMap[t] ^= this.themeMap[t2];
    }
  }
};
eat.Display.prototype.changeTheme = function(theme) {
  this.theme = theme;
  this._fillThemeMap();
  if (this.angles && this.frame)
    this.paintAngles();
};
eat.Display.prototype.themes = [
  ['#aaaaff', '#aaffaa', '#ffffaa'],
  ['#3b8fb1', '#95c8dc', '#d3e8f0']
];
eat.Display.prototype.resize = function(refX, refY, scale) {
  //THIS should SET the size.
  //probably.... maintaining origin and that's the problem we've discovered some time ago
  //EDIT NOPE! we don't care (we care), origin STAYS, but we SCALE it.

  this.refX = refX;
  this.refY = refY;
  this.scale = scale;

  this.x = refX * scale;
  this.y = refY * scale;
  this.shapeX = eat.util.shapeSize(this.x);
  this.shapeY = eat.util.shapeSize(this.y);

  this.cx = this.x / 2;
  this.cy = this.y / 2;
  this.hx = this.shapeX / 2;
  this.hy = this.shapeY / 2;
  this.safeRadius = this.shapeX / Math.sqrt(2);

  document.getElementById('mixarea').style.width = this.x + 'px';
  document.getElementById('mixarea').style.height = this.y + 'px';

  this.shapeCanvas = document.getElementById('shape');
  this.shapeCanvas.width = this.shapeX;
  this.shapeCanvas.height = this.shapeY;
  this.shapeCanvas.style.width = this.shapeX + 'px';
  this.shapeCanvas.style.height = this.shapeY + 'px';
  this.shapeContext = this.shapeCanvas.getContext('2d');
  this.shapeContext.setTransform(1, 0, 0, 1, this.hx, this.hy);

  this.frameCanvas = document.getElementById('frame');
  this.frameCanvas.width = this.x;
  this.frameCanvas.height = this.y;
  this.frameCanvas.style.width = this.x + 'px';
  this.frameCanvas.style.height = this.y + 'px';
  this.frameContext = this.frameCanvas.getContext('2d');
  this.frameContext.setTransform(1, 0, 0, 1, this.cx, this.cy);
  //this.frameContext.scale(this.scale, this.scale);

  if (this.angles && this.frame)
    this.update(this.angles, this.frame);
  this.setOriginPosition(this.originX, this.originY);
};
eat.Display.prototype.setOriginPosition = function(x, y) {
  this.originX = x;
  this.originY = y;
  this.shapeCanvas.style.left = Math.round(x * this.scale - this.hx + this.cx) + 'px';
  this.shapeCanvas.style.top = Math.round(y * this.scale - this.hy + this.cy) + 'px';
};
eat.Display.prototype.update = function(angles, frame) //instat synchronous version
  {
    this.angles = angles;
    this.frame = frame;
    this.paintAngles();
    this.paintFrame();
  };
eat.Display.prototype.paintAngles = function() {
  var t, angleFrom, angleTo, tmpAngle, tmpAngle2;

  for (t = 0; t < this.angles.length; t++) {
    this.shapeContext.fillStyle = this.themes[this.theme][this.themeMap[t]];
    this.shapeContext.beginPath();

    if (!t) {
      angleFrom = 0;
      angleTo = 2 * Math.PI;
    } else if (t == this.angles.length - 1) {
      angleFrom = this.angles[t];
      angleTo = this.angles[(t + 1) % this.angles.length];
    } else {
      tmpAngle = this.angles[(t + 1) % this.angles.length];
      if (tmpAngle < this.angles[t])
        tmpAngle += 2 * Math.PI;

      tmpAngle2 = this.angles[(t + 2) % this.angles.length];
      if (tmpAngle2 < tmpAngle)
        tmpAngle2 += 2 * Math.PI;

      angleFrom = this.angles[t];
      angleTo = (tmpAngle + tmpAngle2) / 2;
    }
    this.shapeContext.arc(0, 0, this.safeRadius, angleFrom, angleTo, false);
    this.shapeContext.lineTo(0, 0);
    this.shapeContext.fill();
  }
  if (this.separatorEnabled) {
    this.shapeContext.strokeStyle = sepColor;
    for (t = 0; t < this.angles.length; t++) {
      this.shapeContext.beginPath();
      this.shapeContext.moveTo(0, 0);
      this.shapeContext.lineTo(this.safeRadius * Math.cos(this.angles[t]), this.safeRadius * Math.sin(this.angles[t]));
      this.shapeContext.stroke();
    }
  }
};


eat.Display.prototype.paintFrame = function() {
  this.frameContext.clearRect(-this.cx, -this.cy, this.x, this.y);
  this.frameContext.globalCompositeOperation = 'source-over';
  this.frameContext.fillStyle = this.frameBackground;
  this.frameContext.fillRect(-this.cx, -this.cy, this.x, this.y);

  this.frameContext.fillStyle = '#000';

  this.frameContext.strokeStyle = this.borderColor;
  this.frameContext.lineWidth = this.borderWidth * this.scale;

  var t, dx;
  if (this.frame[0] == 0) //polygon
  {
    this.frameContext.beginPath();
    this.frameContext.moveTo(Math.round(this.frame[1][0] * this.scale), Math.round(this.frame[1][1] * this.scale));
    for (t = 1; t < this.frame.length - 1; t++) {
      dx = 1 + (t) % (this.frame.length - 1);
      this.frameContext.lineTo(Math.round(this.frame[dx][0] * this.scale), Math.round(this.frame[dx][1] * this.scale));
    }
    this.frameContext.closePath();
    this.frameContext.stroke();
    this.frameContext.globalCompositeOperation = 'destination-out';
    this.frameContext.fill();
  } else if (this.frame[0] == 1) //ellipse
  {
    this.frameContext.beginPath();

    this.frameContext.save();
    this.frameContext.scale(this.scale, this.scale);
    this.frameContext.scale(this.frame[2], this.frame[3]);
    this.frameContext.arc(0, 0, this.frame[1], 0, 2 * Math.PI);
    this.frameContext.restore();
    this.frameContext.stroke();
    this.frameContext.globalCompositeOperation = 'destination-out';
    this.frameContext.fill();
  } else if (this.frame[0] == 2) //bitmap (two images, border thickness and color must match)
  {
    this.frameContext.drawImage(this.frame[1], -this.x / 2, -this.y / 2, this.x, this.y);
    this.frameContext.globalCompositeOperation = 'destination-out';
    this.frameContext.drawImage(this.frame[2], -this.x / 2, -this.y / 2, this.x, this.y);
  }
};



eat.PixelMeter = function(shapeWidth, shapeHeight, width, height) {
  this.shapeCanvas = document.createElement('canvas');
  this.shapeCtx = this.shapeCanvas.getContext('2d');
  this.frameCanvas = document.createElement('canvas');
  this.frameCtx = this.frameCanvas.getContext('2d');

  this.sw = shapeWidth;
  this.sw2 = shapeWidth / 2;
  this.sh = shapeHeight;
  this.sh2 = shapeHeight / 2;
  this.w = width;
  this.w2 = width / 2;
  this.h = height;
  this.h2 = height / 2;
};
eat.PixelMeter.prototype.update = function(angles, frame) {
  this.numAngles = angles.length;
  this.shapeCanvas.width = this.sw;
  this.shapeCanvas.height = this.sh;
  this.shapeCtx.translate(this.sw2, this.sh2);
  eat.Display.prototype.paintAngles.call({
    x: this.w,
    y: this.h,
    shapeX: this.sw,
    shapeY: this.sh,
    shapeContext: this.shapeCtx,
    angles: angles,
    safeRadius: this.sw / Math.sqrt(2),
    themeMap: [0, 1, 2],
    theme: 0,
    themes: [
      ['#f00', '#0f0', '#00f']
    ]
  });
  this.shape = this.shapeCtx.getImageData(0, 0, this.sw, this.sh).data;

  this.frameCanvas.width = this.w;
  this.frameCanvas.height = this.h;
  this.frameCtx.translate(this.w / 2, this.h / 2);

  this.frameCtx.fillStyle = 'black';
  this.frameCtx.beginPath();
  if (frame[0] == 0) //polygon
  {
    this.frameCtx.moveTo(frame[1][0], frame[1][1]);
    for (var t = 1, dx; t < frame.length - 1; t++) {
      dx = 1 + (t) % (frame.length - 1);
      this.frameCtx.lineTo(frame[dx][0], frame[dx][1]);
    }
    this.frameCtx.closePath();
  } else if (frame[0] == 1) //ellipse
  {
    this.frameCtx.save();
    this.frameCtx.scale(frame[2], frame[3]);
    this.frameCtx.arc(0, 0, frame[1], 0, 2 * Math.PI);
    this.frameCtx.restore();
  } else if (frame[0] == 2) //bitmap (two images, border thickness and color must match)
  {
    this.frameCtx.drawImage(frame[2], -this.w2, -this.h2, this.w, this.h);
  }
  this.frameCtx.fill();
  this.frameData = this.frameCtx.getImageData(0, 0, this.w, this.h);
  this.frame = this.frameData.data;
};
eat.PixelMeter.prototype.aaa = function(w, h, maskData, shapeData, ret, xc, yc, sx) //optimized compiler rocks
  {
    var tx = 0,
      ty = 0,
      tt = 0;
    for (tx = 0; tx < w; tx++)
      for (ty = 0; ty < h; ty++) {
        if (tt = maskData[(ty * w + tx << 2) + 3]) {
          ret[0] += tt * (shapeData[((ty + yc) * sx + tx + xc << 2)]) / 255 | 0 ///255;
          ret[1] += tt * (shapeData[((ty + yc) * sx + tx + xc << 2) + 1]) / 255 | 0 ///255;
          ret[2] += tt * (shapeData[((ty + yc) * sx + tx + xc << 2) + 2]) / 255 | 0 ///255;
        }
      }
  };
eat.PixelMeter.prototype.getArea = function(ox, oy) {
  var x = Math.round(ox),
    y = Math.round(oy),
    ret = new Uint32Array(3),
    data;

  this.aaa(this.w, this.h, this.frame, this.shape, ret, this.sw2 - this.w2 - x, this.sh2 - this.h2 - y, this.sw);

  data = ret[0] + ret[1] + ret[2];

  if (this.numAngles === 3)
    return [ret[0] / data, ret[1] / data, ret[2] / data]
  else
    return [ret[0] / data, ret[1] / data];
};


///begin mathmeter
eat.MathMeter = function(shapeWidth, shapeHeight, width, height) {
  this.radius = width + height;
};
eat.MathMeter.prototype.update = function(angles, frame) {
  this.frame = frame;
  this.angles = angles;
  this.wholearea = frame[0] == 1 ? Math.PI * frame[1] * frame[1] * frame[2] * frame[3] : eat.util.polysArea([frame.slice(1)]);
  this.reflexAngleIdx = -1;

  for (var t = 0; t < angles.length; t++) {
    if (eat.util.adiff(angles[t], angles[(t + 1) % angles.length]) < 0)
      this.reflexAngleIdx = t;
  }
};

//preserveOrder is for getPercentage, coz we move area of that reflex angle to the end
eat.MathMeter.prototype.getArea = function(x, y, preserveOrder) {
  var ret = eat.util.computeArea(this.frame, x, y, this.angles, this.radius, this.wholearea, this.reflexAngleIdx);

  if (preserveOrder && this.reflexAngleIdx > -1) {
    ret.splice(this.reflexAngleIdx, 0, ret.pop());
  }

  return ret;
};
eat.Meter = function(shapeWidth, shapeHeight, width, height) {
  this.width = width;
  this.height = height;
  this.shapeWidth = shapeWidth;
  this.shapeHeight = shapeHeight;

  this.mathMeter = new eat.MathMeter(this.shapeWidth, this.shapeHeight, this.width, this.height);
  this.pixelMeter = null;
  this.activeMeter = this.mathMeter;
  this.frame = null;
  this.angles = null;
  this.alwaysPixel = false;
};
eat.Meter.prototype._ensurePixelMeter = function() {
  if (!this.pixelMeter)
    this.pixelMeter = new eat.PixelMeter(this.shapeWidth, this.shapeHeight, this.width, this.height);
  return this.pixelMeter;
};
eat.Meter.prototype.setPixel = function(v) {
  this.alwaysPixel = v;
  if (v) this._ensurePixelMeter();

  if (this.angles && this.frame)
    this.update(this.angles, this.frame);
};
eat.Meter.prototype.update = function(angles, frame) {
  //frames of type 2 (text) can only be measured by PixelMeter
  this.angles = angles;
  this.frame = frame;
  this.activeMeter = this.alwaysPixel || frame[0] === 2 ? this._ensurePixelMeter() : this.mathMeter;
  this.activeMeter.update(angles, frame);
};
eat.Meter.prototype.getArea = function(ox, oy, preserveOrder) {
  return this.activeMeter.getArea(ox, oy, preserveOrder);
};


eat.Solver = function(meter, minX, maxX, minY, maxY, precision) {
  this.meter = meter;
  this.minX = minX;
  this.maxX = maxX;
  this.minY = minY;
  this.maxY = maxY;
  this.precision = precision;
  this.epsilon = 0.01;
  this.computeScore = this.computeScore.bind(this); //and finally we have sane behaviour here
};
eat.Solver.prototype.prepare = function(angles, frame) {
  this.angles = angles;
  this.meter.update(angles, frame);
};
eat.Solver.prototype.computeScore = function(x, y) {
  var c = this.meter.getArea(x, y);

  if (Math.abs(c[0]) < this.epsilon || Math.abs(c[1]) < this.epsilon || (this.angles.length == 3 && Math.abs(c[2]) < this.epsilon)) return Infinity;
  return Math.abs(c[0] - c[1]) + (this.angles.length == 3 ? Math.abs(c[0] - c[2]) + Math.abs(c[1] - c[2]) : 0);
};
eat.Solver.prototype.getSolution = function() {
  var solution = eat.util.spaceSearch2(0, 0, this.minX, this.maxX, this.minY, this.maxY, this.computeScore, 0.0001, this.precision);
  if (solution[2] > this.epsilon) return false;
  return solution;
};

eat.LevelGenerator = function(solver) {
  this.solver = solver;
};
eat.LevelGenerator.prototype.getRandomAnglesForFrame = function(frame) {
  var min = 0.3; //1.2; //max - 1.56 otherwise it may hang (just add an additional check: distance < PI-2(min-PI/2))
  var angles = [],
    nw, solution;

  while (true) {
    angles.length = 0;
    while (angles.length < 3) {
      nw = Math.random() * 2 * Math.PI;
      if (angles.length && Math.abs(eat.util.adiff(nw, angles[0], true)) < min)
        continue;
      if (angles.length == 2 && Math.abs(eat.util.adiff(nw, angles[1], true)) < min)
        continue;
      angles.push(nw);
    }
    angles.sort(function(a, b) {
      return a - b
    });
    this.solver.prepare(angles, frame);
    if (solution = this.solver.getSolution())
      break;
    console.log('failed to find solution', angles);
  }

  return [angles, solution];
};
eat.LevelGenerator.prototype.generate = function(n) //add solutions!
  {
    var frame, angles;
    if (!n) //trapezoid
    {
      var a = 350,
        b = Math.floor((0.5 + Math.random() * 0.2) * a / 2) * 2,
        between = Math.floor((b + (0.5 + Math.random() * 0.3) * (a - b)) / 2) * 2;
      if (Math.random() > 0.5) {
        b ^= a;
        a ^= b;
        b ^= a;
      }

      if (Math.random() > 0.5) {
        frame = [0, [between / 2, b / 2],
          [-between / 2, a / 2],
          [-between / 2, -a / 2],
          [between / 2, -b / 2]
        ];
        angles = [Math.PI / 2, Math.PI + Math.PI / 2];
      } else {
        frame = [0, [b / 2, between / 2],
          [-b / 2, between / 2],
          [-a / 2, -between / 2],
          [a / 2, -between / 2]
        ];
        angles = [0, Math.PI];
      }
      this.solver.prepare(angles, frame);
      return {
        frame: frame,
        angles: angles,
        solution: this.solver.getSolution()
      };
    } else if (n == 1) //square with random angles
    {
      var a = 150;
      frame = [0, [a, a],
        [-a, a],
        [-a, -a],
        [a, -a]
      ]; //angles = [0.55, Math.PI/2, Math.PI+Math.PI/2];

      var angles = this.getRandomAnglesForFrame(frame);
      return {
        frame: frame,
        angles: angles[0],
        solution: angles[1]
      };
    } else if (n == 2) //triangle
    {
      var a = 170,
        start = Math.floor(Math.random() * 4) * Math.PI / 2;

      var frame = [0, [a * Math.cos(start), a * Math.sin(start)],
        [a * Math.cos(start + 2 * Math.PI / 3), a * Math.sin(start + 2 * Math.PI / 3)],
        [a * Math.cos(start + 4 * Math.PI / 3), a * Math.sin(start + 4 * Math.PI / 3)]
      ];
      var angles = this.getRandomAnglesForFrame(frame);

      return {
        frame: frame,
        angles: angles[0],
        solution: angles[1]
      };
    } else if (n == 3) //circle
    {
      var frame = [1, 170, 1, 1];
      var angles = this.getRandomAnglesForFrame(frame);

      return {
        frame: frame,
        angles: angles[0],
        solution: angles[1]
      };
    } else if (n == 4) //ellipse
    {
      var frame = [1, 170, 1, 1];
      frame[2 + Math.floor(Math.random() * 2)] *= 0.6 + Math.random() * 0.2;
      var angles = this.getRandomAnglesForFrame(frame);

      return {
        frame: frame,
        angles: angles[0],
        solution: angles[1]
      };
    } else if (n == 5) //star. maybe do hex one. temporarily it is hex one
    {
      //alternate lengths - 1 and (3-Math.sqrt(5))/2
      var a = 180,
        frame = [0],
        t = 0,
        smallLength = (3 - Math.sqrt(5)) / 2,
        angle = Math.PI / 5,
        start = -Math.PI / 2;
      for (t = 0; t < 10; t++) {
        frame.push([a * (t % 2 ? smallLength : 1) * Math.cos(start + t * angle), a * (t % 2 ? smallLength : 1) * Math.sin(start + t * angle)]);
      }
      var angles = this.getRandomAnglesForFrame(frame);

      return {
        frame: frame,
        angles: angles[0],
        solution: angles[1]
      };
    }
    /*
    else if (n==6) //hex star. this level is not included by default
    {
     //alternate lengths - 1 and (3-Math.sqrt(5))/2
     var a = 180, frame = [0], t=0, smallLength = 2*Math.sqrt(3)/6, angle = Math.PI/6, start = -Math.PI/2;
     for(t=0;t<12;t++)
     {
      frame.push([a*(t%2?smallLength:1)*Math.cos(start+t*angle), a*(t%2?smallLength:1)*Math.sin(start+t*angle)]);
     }
     var angles = this.getRandomAnglesForFrame(frame);
     
     return {frame: frame, angles: angles[0], solution: angles[1]};
    }
    */
    else if (n == 6) //"zb3" (via images)
    {
      var frame = [2, eat.images['level7-outline'], eat.images['level7-frame']];

      if (!frame[1].complete || !frame[2].complete) {
        alert('Cannot load level because images are still being loaded :(\nTry again later...');
        return false;
      }

      var angles = this.getRandomAnglesForFrame(frame);


      return {
        frame: frame,
        angles: angles[0],
        solution: angles[1]
      };
    }
  };

eat.UI = function(eat, levelCount, theme, firstRun) {
  this.eat = eat;
  this.levelCount = levelCount;

  this.pickerCont = document.getElementById('level-picker');
  this.buttonArea = document.getElementById('buttonarea');

  var _this = this;

  for (var t = 0; t < this.levelCount; t++) {
    this.pickerCont.children[t].addEventListener('click', eat.onLevelChange.bind(eat, t));
  }

  this.loadTheme(theme);
  document.getElementById('showsolution').addEventListener('click', eat.showSolution);
  document.getElementById('submitlevel').addEventListener('click', eat.submitLevel);
  document.getElementById('nextlevel').addEventListener('click', eat.nextLevel);
  document.getElementById('tryagain').addEventListener('click', eat.tryAgain);
  document.getElementById('viewtotalscore').addEventListener('click', eat.viewTotalScore);
  document.getElementById('restartgame').addEventListener('click', eat.newTest);


  if (firstRun)
    this.installInstructions();

  //set loaded
  document.getElementById('loadingoverlay').style.display = 'none';
  document.getElementById('mixarea').style.display = '';
};
eat.UI.prototype.initSettingsControlls = function() {
  var minstv = parseFloat(document.getElementById('sensitivity-slider').min),
    maxstv = parseFloat(document.getElementById('sensitivity-slider').max);

  //add listener and execute it to read initial value
  //note that this means before we initialize UI, everything else must already
  //be initialized

  function addChangeListener(id, func) {
    document.getElementById(id).addEventListener('change', func);
    func();
  }

  addChangeListener('sensitivity-slider', function() {
    eat.setSensitivity(minstv + maxstv - parseFloat(document.getElementById('sensitivity-slider').value));
  });

  addChangeListener('monochromatic-toggle', function() {
    eat.setTheme(document.getElementById('monochromatic-toggle').checked ? 1 : 0);
  });

  addChangeListener('pixelmeter-toggle', function() {
    eat.meter.setPixel(document.getElementById('pixelmeter-toggle').checked ? 1 : 0);
  });
};
eat.UI.prototype.installInstructions = function() {
  var mixArea = document.getElementById('mixarea');
  var tutOverlay = document.getElementById('infooverlay');
  var tooltips = document.querySelectorAll('[data-tooltip]');

  for (var t = 0; t < tooltips.length; t++)
    tooltips[t].classList.add('tooltipOn');
  tutOverlay.style.display = '';

  var hideTooltips = function() {
    for (var t = 0; t < tooltips.length; t++)
      tooltips[t].classList.remove('tooltipOn');

    document.removeEventListener('click', hideTooltips);
  };

  var onInfoDragStart = function(e) {
    tutOverlay.style.opacity = 0;
    mixArea.removeEventListener('mousedown', onInfoDragStart);
    mixArea.removeEventListener('touchstart', onInfoDragStart);
    hideTooltips();
  };

  document.getElementById('mixarea').addEventListener('mousedown', onInfoDragStart);
  document.getElementById('mixarea').addEventListener('touchstart', onInfoDragStart);
  document.addEventListener('click', hideTooltips);
};
eat.UI.prototype.displaySolvedLevels = function(solvedLevels) {
  for (var t = 0; t < this.pickerCont.children.length; t++) {
    this.pickerCont.children[t].classList[solvedLevels[t] ? 'add' : 'remove']('solved');
  }
};
eat.UI.prototype.setCurrentLevel = function(level) {
  for (var t = 0; t < this.levelCount; t++)
    this.pickerCont.children[t].classList[t === level ? 'add' : 'remove']('current');
};
eat.UI.prototype.fillLevelOverlay = function(score, percentageShare, themeMap) {
  document.getElementById('score').textContent = Math.round((score) * 100) / 100;
  var p = document.getElementById('pshare').children;

  p[0].className = 'c' + themeMap[0];
  p[0].textContent = Math.round((percentageShare[0]) * 100) / 100;

  p[1].className = 'c' + themeMap[1];
  p[1].textContent = Math.round((percentageShare[1]) * 100) / 100;

  if (percentageShare.length === 3) {
    p[2].textContent = Math.round((percentageShare[2]) * 100) / 100;
    p[2].className = 'c' + themeMap[2];
  }
  p[2].style.display = (percentageShare.length === 3) ? '' : 'none';
};
eat.UI.prototype.scoreOn = function() {
  document.getElementById('scoreoverlay').style.display = 'block';
};
eat.UI.prototype.scoreOff = function() {
  document.getElementById('scoreoverlay').style.display = 'none';
};
eat.UI.prototype.loadTheme = function(theme) {
  var t;
  for (t = 0; t < document.styleSheets.length; t++) {
    if (document.styleSheets[t].title == 'pshare')
      break;
  }
  document.styleSheets[t].cssRules[0].style.color = theme[0];
  document.styleSheets[t].cssRules[1].style.color = theme[1];
  document.styleSheets[t].cssRules[2].style.color = theme[2];
};
eat.UI.prototype.showButton = function(id) {
  for (var t = 0; t < this.buttonArea.children.length; t++)
    this.buttonArea.children[t].style.display = 'none';

  document.getElementById(id).style.display = '';
};
eat.UI.prototype.fillScoreScreen = function(totalScore, levelScores) {
  document.getElementById('totalscore').textContent = Math.round(totalScore * 100) / 100;
  document.getElementById('totalscore').className = totalScore > 91 ? 'goodscore' : '';

  var cells = document.querySelectorAll('#levelscoretable .score');
  for (var t = 0; t < cells.length; t++) {
    cells[t].textContent = Math.round(levelScores[t] * 100) / 100;
    cells[t].classList[levelScores[t] > 91 ? 'add' : 'remove']('goodscore');
  }
};
eat.UI.prototype.showScreen = function(name) {
  document.getElementById('gamescreen').style.display = name === 'game' ? '' : 'none';
  document.getElementById('scorescreen').style.display = name === 'score' ? '' : 'none';
};


eat.referenceX = 500;
eat.referenceY = 500;
eat.sensitivity = 1;
eat.levelCount = 7;
eat.currentTheme = 0;
eat.firstRun = localStorage.getItem('eat.firstRun') === null;
localStorage.setItem('eat.firstRun', 'false');

eat.init = function() {
  eat.resize();

  eat.display = new eat.Display(eat.referenceX, eat.referenceY, eat.scale, eat.currentTheme);

  eat.controlls = new eat.Controlls(document.getElementById('frame'), -eat.referenceX / 2, eat.referenceX / 2, -eat.referenceY / 2, eat.referenceY / 2, eat.scale * eat.sensitivity, 0, 0, eat.changeOrigin);

  eat.meter = new eat.Meter(eat.util.shapeSize(eat.referenceX), eat.util.shapeSize(eat.referenceY), eat.referenceX, eat.referenceY);

  eat.solver = new eat.Solver(eat.meter, -eat.referenceX / 2, eat.referenceX / 2, -eat.referenceY / 2, eat.referenceY / 2, 0.25);

  eat.generator = new eat.LevelGenerator(eat.solver);

  //yep, this could be done different way, but no time
  eat.ui = new eat.UI(eat, eat.levelCount, eat.display.themes[eat.currentTheme], eat.firstRun);

  window.onresize = eat.resize;

  //this will also read values from elements
  eat.ui.initSettingsControlls();

  eat.newTest();
};
eat.setSensitivity = function(x) {
  eat.sensitivity = x;
  eat.controlls.sensitivity = eat.sensitivity * eat.scale;
};
eat.setupLevelUI = function() {
  eat.ui.scoreOff();
  eat.ui.showButton('submitlevel');
  eat.ui.setCurrentLevel(eat.level);
  eat.controlls.enable();
};
eat.onLevelChange = function(level) {
  eat.level = level;
  eat.setLevel();
};
eat.setLevel = function(level) {
  eat.levelInfo = eat.generator.generate(eat.level);
  if (!eat.levelInfo) return;

  eat.changeOrigin(0, 0);
  eat.controlls.reset(0, 0);
  eat.setupLevelUI();
  eat.display.shuffleTheme();
  eat.display.update(eat.levelInfo.angles, eat.levelInfo.frame);
};
eat.nextLevel = function() {
  eat.level = eat.solvedLevels.indexOf(false);
  eat.setLevel();
};
eat.submitLevel = function() {
  eat.controlls.disable();
  var scoreNow = eat.getLevelScore();
  eat.testScore[eat.level] = scoreNow;
  eat.solvedLevels[eat.level] = true;
  eat.ui.displaySolvedLevels(eat.solvedLevels);
  eat.ui.fillLevelOverlay(scoreNow, eat.getPercentage(), eat.display.themeMap);
  eat.ui.scoreOn();

  eat.ui.showButton(eat.solvedLevels.indexOf(false) > -1 ? 'nextlevel' : 'viewtotalscore');
};
eat.getLevelScore = function() {
  eat.solver.prepare(eat.levelInfo.angles, eat.levelInfo.frame);
  var pre = eat.solver.computeScore(eat.originX, eat.originY);
  //minus
  pre = Math.max(pre - eat.levelInfo.solution[2], 0);

  pre /= eat.levelInfo.angles.length * (eat.levelInfo.angles.length - 1) / 2;
  if (pre == Infinity) return 0;
  pre = Math.min((1 - pre) * (1 - pre) * 100 + 1, 100);
  return pre;
};
eat.getPercentage = function() {
  eat.meter.update(eat.levelInfo.angles, eat.levelInfo.frame);
  return eat.meter.getArea(eat.originX, eat.originY, true).map(function(a) {
    return 100 * a
  });
};
eat.newTest = function() {
  eat.ui.showScreen('game');
  eat.testScore = [];

  eat.solvedLevels = [];
  for (var t = 0; t < eat.levelCount; t++)
    eat.solvedLevels[t] = false;

  eat.level = -1;
  eat.nextLevel();
};
eat.changeOrigin = function(x, y) {
  eat.originX = x;
  eat.originY = y;
  eat.display.setOriginPosition(x, y);
};
eat.resize = function() {
  eat.scale = Math.min(innerWidth - 40, innerHeight - 150) / Math.max(eat.referenceX, eat.referenceY);
  eat.scale = 2 * Math.floor(eat.referenceY * eat.scale / 2) / eat.referenceY; //so that divis by 2i, 

  if (eat.display)
    eat.display.resize(eat.referenceX, eat.referenceY, eat.scale);

  if (eat.controlls)
    eat.controlls.sensitivity = eat.sensitivity * eat.scale;
};
eat.setTheme = function(theme) {
  eat.currentTheme = theme;
  eat.display.changeTheme(theme);
  eat.ui.loadTheme(eat.display.themes[theme]);
};
eat.tryAgain = function() {
  eat.setupLevelUI();
};
eat.viewTotalScore = function() {
  var avg = 0;

  for (var t = 0; t < eat.testScore.length; t++)
    avg += eat.testScore[t] / eat.testScore.length;

  eat.ui.fillScoreScreen(avg, eat.testScore);
  eat.ui.showScreen('score');
};
eat.showSolution = function() {
  eat.savedOriginX = eat.originX;
  eat.savedOriginY = eat.originY;

  eat.controlls.disable();
  eat.changeOrigin(eat.levelInfo.solution[0], eat.levelInfo.solution[1]);
  eat.ui.scoreOff();
};

window.addEventListener('load', eat.init);