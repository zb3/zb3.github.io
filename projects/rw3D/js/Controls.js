"use strict";
"set badcode yes";

var Controls = function() {
  var _this = this;

  this.keyDown = {
    normal: {},
    free: {}
  };
  this.keyUp = {
    normal: {},
    free: {}
  };
  this.freeVector = [0, 0, 0];
  this.freeInterval;
  this.freeTmp = new THREE.Vector3();
  this.mouseLocked = false;
  this.rotateSpeed = 0.001;
  this.dragMode = this.dragLastX = this.dragLastY = null;

  this.keyDown.normal[38] = this.keyDown.normal[87] = function() {
    manager.feedNext(0, 1, 0)
  };
  this.keyDown.normal[40] = this.keyDown.normal[83] = function() {
    manager.feedNext(0, -1, 0)
  };
  this.keyDown.normal[37] = this.keyDown.normal[65] = function() {
    manager.feedNext(-1, 0, 0)
  };
  this.keyDown.normal[39] = this.keyDown.normal[68] = function() {
    manager.feedNext(1, 0, 0)
  };
  this.keyDown.normal[32] = function() {
    manager.feedNext(0, 0, -1)
  };
  this.keyDown.normal[70] = setFree;

  manager.arrows.ondown['4'] = this.keyDown.free[38] = this.keyDown.free[87] = function() {
    _this.freeVector[2] = -1
  };
  manager.arrows.ondown['2'] = this.keyDown.free[40] = this.keyDown.free[83] = function() {
    _this.freeVector[2] = 1
  };
  manager.arrows.ondown['3'] = this.keyDown.free[37] = this.keyDown.free[65] = function() {
    _this.freeVector[0] = -1
  };
  manager.arrows.ondown['1'] = this.keyDown.free[39] = this.keyDown.free[68] = function() {
    _this.freeVector[0] = 1
  };
  this.keyDown.free[70] = setNormal;

  this.keyUp.free[40] = this.keyUp.free[83] = this.keyUp.free[38] = this.keyUp.free[87] = function() {
    _this.freeVector[2] = 0
  };
  this.keyUp.free[37] = this.keyUp.free[65] = this.keyUp.free[39] = this.keyUp.free[68] = function() {
    _this.freeVector[0] = 0
  };
  manager.arrows.onup = function() {
    _this.freeVector[0] = _this.freeVector[2] = 0
  };

  this._handleKeyDown = this.handleKeyDown.bind(this);
  this._handleKeyUp = this.handleKeyUp.bind(this);
  this._handleScroll = this.handleScroll.bind(this);
  this._lockChangeAlert = this.lockChangeAlert.bind(this);
  this._startLock = this.startLock.bind(this);
  this._startDrag = this.startDrag.bind(this);
  this._endDrag = this.endDrag.bind(this);
  this._rotateCamera = this.rotateCamera.bind(this);
  this._freeMove = this.freeMove.bind(this);
  this._dragMove = this.dragMove.bind(this);
  this._dblClick = this.dblClick.bind(this);
  this._tapHold = this.tapHold.bind(this);

  canvas.addEventListener('keydown', this._handleKeyDown);
  canvas.addEventListener('keyup', this._handleKeyUp);
  canvas.addEventListener('wheel', this._handleScroll);
  canvas.addEventListener('click', this._dblClick);

  if ('onpointerlockchange' in document)
    document.addEventListener('pointerlockchange', this._lockChangeAlert);
  else if ('onmozpointerlockchange' in document)
    document.addEventListener('mozpointerlockchange', this._lockChangeAlert);
  else if ('onwebkitpointerlockchange' in document)
    document.addEventListener('webkitpointerlockchange', this._lockChangeAlert);

  canvas.addEventListener('touchstart', this._startDrag);
  this.touchDragPan = false;
  this.dblClickTime = 0;
  this.holdTimeout = null;
};
Controls.prototype.handleKeyDown = function(event) {
  if (this.keyDown[state][event.keyCode]) {
    this.keyDown[state][event.keyCode]();
    event.preventDefault();
  }
};
Controls.prototype.handleKeyUp = function(event) {
  if (this.keyUp[state][event.keyCode]) {
    this.keyUp[state][event.keyCode]();
    event.preventDefault();
  }
};
Controls.prototype.setFree = function() {
  this.freeInterval = setInterval(this._freeMove, 18);
  canvas.addEventListener('click', this._startLock);
  this.endDrag();
  canvas.removeEventListener('mousedown', this._startDrag);
  manager.arrows.useClick = false;
  manager.arrows.setShape(0, 0);
};
Controls.prototype.setNormal = function() {
  clearInterval(this.freeInterval);
  this.freeVector = [0, 0, 0];

  canvas.removeEventListener('click', this._startLock);
  canvas.removeEventListener('mousemove', this._rotateCamera);
  canvas.addEventListener('mousedown', this._startDrag);
  manager.arrows.useClick = true;
};
Controls.prototype.freeMove = function() {
  if (this.freeVector[0] === 0 && this.freeVector[1] === 0 && this.freeVector[2] === 0) return;

  this.freeTmp.set(this.freeVector[0], this.freeVector[1], this.freeVector[2]);
  this.freeTmp.applyEuler(camera.rotation);

  camera.position.x += this.freeTmp.x * settings.freeSpeed;
  camera.position.y += this.freeTmp.y * settings.freeSpeed;
  camera.position.z += this.freeTmp.z * settings.freeSpeed;
  syncLight();
};
Controls.prototype.startLock = function() {
  canvas.requestPointerLock = canvas.requestPointerLock ||
    canvas.mozRequestPointerLock ||
    canvas.webkitRequestPointerLock;

  canvas.requestPointerLock();
};
Controls.prototype.lockChangeAlert = function() {
  if (document.pointerLockElement === canvas ||
    document.mozPointerLockElement === canvas ||
    document.webkitPointerLockElement === canvas) {
    this.mouseLocked = true;

    if (state === 'free')
      canvas.addEventListener('mousemove', this._rotateCamera);
  } else {
    this.mouseLocked = false;

    if (state === 'free')
      canvas.removeEventListener('mousemove', this._rotateCamera);
  }
};
Controls.prototype.handleScroll = function(event) {
  if (state === 'normal') {
    settings.displacementZ += Math.sign(event.deltaY) * 0.1;
    manager.updateCameraDisplacement(settings);
  } else if (state === 'free') {
    manager.cameraRotation.z = manager.cameraRotation.z - Math.sign(event.deltaY) * 0.05;
    manager.updateCameraRotation();
  }
};
Controls.prototype.dblClick = function(event) {
  var tnow = Date.now();
  if (tnow - this.dblClickTime < 400)
    freeMode ? setNormal() : setFree();
  else this.dblClickTime = tnow;
};
Controls.prototype.tapHold = function() {
  manager.resetCamera();
  this.holdTimeout = null;
};
Controls.prototype.startDrag = function(event) {
  this.holdTimeout = setTimeout(this._tapHold, 1000);

  this.dragMode = event.type === 'mousedown' ? event.buttons : 1;
  this.dragLastX = event.type === 'mousedown' ? event.clientX : event.targetTouches[0].pageX;
  this.dragLastY = event.type === 'mousedown' ? event.clientY : event.targetTouches[0].pageY;
  document.addEventListener('mousemove', this._dragMove);
  document.addEventListener('touchmove', this._dragMove);
  document.addEventListener('mouseout', this._endDrag);
  document.addEventListener('mouseup', this._endDrag);
  document.addEventListener('touchend', this._endDrag);
  document.addEventListener('touchcancel', this._endDrag);
  document.addEventListener('touchleave', this._endDrag);
  canvas.focus();
};
Controls.prototype.dragMove = function(event) {
  if (this.holdTimeout !== null) {
    clearTimeout(this.holdTimeout);
    this.holdTimeout = null;
  }

  var x, y;
  if (event.type === 'mousemove') {
    x = event.movementX || event.mozMovementX || event.clientX - this.dragLastX;
    y = event.movementY || event.mozMovementY || event.clientY - this.dragLastY;
    this.dragLastX = event.clientX;
    this.dragLastY = event.clientY;
  } else {
    x = event.targetTouches[0].pageX - this.dragLastX;
    y = event.targetTouches[0].pageY - this.dragLastY;
    this.dragLastX = event.targetTouches[0].pageX;
    this.dragLastY = event.targetTouches[0].pageY;
  }

  if (event.type === 'mousemove' && this.dragMode === 1 || event.type === 'touchmove' && !this.touchDragPan) {
    this.rotateCamera(event, x, y);
  } else {
    manager.cameraDisplacement.x += x * 0.005;
    manager.cameraDisplacement.y -= y * 0.005;
  }
  event.preventDefault();
};
Controls.prototype.endDrag = function(event) {
  if (this.holdTimeout !== null) {
    clearTimeout(this.holdTimeout);
    this.holdTimeout = null;
  }

  document.removeEventListener('mousemove', this._dragMove);
  document.removeEventListener('touchmove', this._dragMove);
  document.removeEventListener('mouseout', this._endDrag);
  document.removeEventListener('mouseup', this._endDrag);
  document.removeEventListener('touchend', this._endDrag);
  document.removeEventListener('touchcancel', this._endDrag);
  document.removeEventListener('touchleave', this._endDrag);
};
Controls.prototype.rotateCamera = function(event, x, y) {
  var mx = x || event.movementX || event.mozMovementX,
    my = y || event.movementY || event.mozMovementY;

  if (mx) manager.cameraRotation.y = manager.cameraRotation.y - mx * this.rotateSpeed;
  if (my) manager.cameraRotation.x = manager.cameraRotation.x - my * this.rotateSpeed;

  if (mx || my)
    manager.updateCameraRotation();
};
//setFree, setNormal for controls here