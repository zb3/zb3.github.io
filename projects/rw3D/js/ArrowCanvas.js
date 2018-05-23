var ArrowCanvas = function() {
  this.width = 190;
  this.height = 190;
  this.cx = this.width / 2;
  this.cy = this.height / 2;

  this._tick = this.tick.bind(this);

  this.element = document.createElement('canvas');
  this.element.className = 'arrowCanvas';
  this.element.width = this.width;
  this.element.height = this.height;
  this.ctx = this.element.getContext('2d');
  this.regions = [];
  this.colors = [
    [80, 80, 80],
    [120, 168, 168],
    [168, 255, 255]
  ];
  this.colorFill = [
    [this.colors[0].slice(), this.colors[0].slice(), 1],
    [this.colors[0].slice(), this.colors[0].slice(), 1],
    [this.colors[0].slice(), this.colors[0].slice(), 1],
    [this.colors[0].slice(), this.colors[0].slice(), 1],
    [this.colors[0].slice(), this.colors[0].slice(), 1]
  ];
  this.animationStep = 1 / 20;
  this.paint();
  this.useClick = true;

  var _this = this;
  this.element.onclick = function(event) {
    if (!_this.active || !_this.useClick) return;

    var cr = _this.element.getBoundingClientRect();
    var pt = _this.testPoint(event.clientX - cr.left, event.clientY - cr.top);

    if (pt !== undefined && _this.onclick[pt])
      _this.onclick[pt]();
  };
  this.element.onmousedown = function(event) {
    if (!_this.active || _this.useClick) return;

    var cr = _this.element.getBoundingClientRect();
    var cx = event.type === 'mousedown' ? event.clientX : event.targetTouches[0].pageX;
    var cy = event.type === 'mousedown' ? event.clientY : event.targetTouches[0].pageY;
    var pt = _this.testPoint(cx - cr.left, cy - cr.top);

    if (pt !== undefined && _this.ondown[pt])
      _this.ondown[pt]();

    event.preventDefault();
  };
  this.element.addEventListener('touchstart', this.element.onmousedown);
  this.element.onmouseout = this.element.onmouseup = function(event) {
    if (!_this.active || _this.useClick) return;

    if (_this.onup)
      _this.onup();

    event.preventDefault();
  };

  this.element.addEventListener('touchcancel', this.element.onmouseout);
  this.element.addEventListener('touchleave', this.element.onmouseout);
  this.element.addEventListener('touchend', this.element.onmouseout);

  this.onclick = {};
  this.onup = {};
  this.ondown = {};
  this.scheduled = false;
  this.active = true;
};
ArrowCanvas.prototype.setActive = function(active) {
  this.active = active;
  this.element.style.opacity = active / 2;
};
ArrowCanvas.prototype.setShape = function(region, color) {
  for (var t = 0; t < 5; t++) {
    this.colorFill[t][0][0] = (1 - this.colorFill[t][2]) * this.colorFill[t][0][0] + this.colorFill[t][2] * this.colorFill[t][1][0];
    this.colorFill[t][0][1] = (1 - this.colorFill[t][2]) * this.colorFill[t][0][1] + this.colorFill[t][2] * this.colorFill[t][1][1];
    this.colorFill[t][0][2] = (1 - this.colorFill[t][2]) * this.colorFill[t][0][2] + this.colorFill[t][2] * this.colorFill[t][1][2];

    this.colorFill[t][1][0] = this.colors[t === region ? color : 0][0];
    this.colorFill[t][1][1] = this.colors[t === region ? color : 0][1];
    this.colorFill[t][1][2] = this.colors[t === region ? color : 0][2];

    this.colorFill[t][2] = 0;
  }
  if (!this.scheduled)
    this.tick();
};
ArrowCanvas.prototype.step = function() {
  var t, needed = false;
  for (t = 0; t < 5; t++) {
    this.colorFill[t][2] += this.animationStep;
    this.colorFill[t][2] = Math.min(this.colorFill[t][2], 1);

    if (this.colorFill[t][2] < 1)
      needed = true;
  }

  return needed;
};
ArrowCanvas.prototype.tick = function() {
  this.scheduled = false;

  var needed = this.step();
  this.paint();

  if (needed) {
    this.scheduled = true;
    requestAnimationFrame(this._tick);
  }
};
ArrowCanvas.prototype.paint = function() {
  var height = 14,
    width = 25,
    space = 14,
    arrWidth = 16,
    arrHeight = 32;

  this.regions = [];

  this.ctx.save();
  this.ctx.translate(this.cx, this.cy);

  this.ctx.fillStyle = 'rgb(' + ((1 - this.colorFill[0][2]) * this.colorFill[0][0][0] + this.colorFill[0][2] * this.colorFill[0][1][0] | 0) + ',' +
    ((1 - this.colorFill[0][2]) * this.colorFill[0][0][1] + this.colorFill[0][2] * this.colorFill[0][1][1] | 0) + ',' +
    ((1 - this.colorFill[0][2]) * this.colorFill[0][0][2] + this.colorFill[0][2] * this.colorFill[0][1][2] | 0) + ')';
  this.ctx.fillRect(-height / 2, -height / 2, height, height);

  for (var t = 0; t < 4; t++) {
    this.ctx.fillStyle = 'rgb(' + ((1 - this.colorFill[t + 1][2]) * this.colorFill[t + 1][0][0] + this.colorFill[0][2] * this.colorFill[t + 1][1][0] | 0) + ',' +
      ((1 - this.colorFill[t + 1][2]) * this.colorFill[t + 1][0][1] + this.colorFill[t + 1][2] * this.colorFill[t + 1][1][1] | 0) + ',' +
      ((1 - this.colorFill[t + 1][2]) * this.colorFill[t + 1][0][2] + this.colorFill[t + 1][2] * this.colorFill[t + 1][1][2] | 0) + ')';

    this.ctx.fillRect(height / 2 + space, -height / 2, width, height);
    this.ctx.beginPath();
    this.ctx.moveTo(height / 2 + space + width + arrWidth, 0);
    this.ctx.lineTo(height / 2 + space + width, -arrHeight / 2);
    this.ctx.lineTo(height / 2 + space + width, arrHeight / 2);
    this.ctx.fill();
    this.ctx.rotate(Math.PI / 2);
  }
  this.ctx.restore();

  if (!this.regions.length) {
    this.regions.push([
      [this.cx - height / 2 - space / 2, this.cy - height / 2 - space / 2, this.cx + height / 2 + space / 2, this.cy + height / 2 + space / 2]
    ]);
    this.regions.push([
      [this.cx + height / 2 + space, this.cy - arrHeight / 2, this.cx + height / 2 + space + width + arrWidth, this.cy + arrHeight / 2]
    ]);
    this.regions.push([
      [this.cx - arrHeight / 2, this.cy + height / 2 + space, this.cx + arrHeight / 2, this.cy + height / 2 + space + width + arrWidth]
    ]);
    this.regions.push([
      [this.cx - height / 2 - space - width - arrWidth, this.cy - arrHeight / 2, this.cx - height / 2 - space, this.cy + arrHeight / 2]
    ]);
    this.regions.push([
      [this.cx - arrHeight / 2, this.cy - height / 2 - space - width - arrWidth, this.cx + arrHeight / 2, this.cx - height / 2 - space]
    ]);
  }
};
ArrowCanvas.prototype.testPoint = function(x, y) {
  for (var t = 0; t < this.regions.length; t++)
    for (var tt = 0; tt < this.regions[t].length; tt++)
      if (x >= this.regions[t][tt][0] && y >= this.regions[t][tt][1] && x <= this.regions[t][tt][2] && y <= this.regions[t][tt][3])
        return t;
};