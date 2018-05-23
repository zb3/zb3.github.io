"use strict";
/*
 * Before shouting: "what a stupid rotation system", keep in mind that conversion from a rotation matrix to Euler angles
 * can sometimes produce artifacts. It was way simpler before I discovered that...
 **/
var Manager = function(frame, managerSettings) {
  this.frame = frame;

  this.currentVertex = frame.vertices[0];
  this.currentEdge = null;
  this.current = new THREE.Vector3(0, 0, -1);
  this.nextInternal = new THREE.Vector3(1, 0, 0);
  this.next = new THREE.Vector3(1, 0, 0);

  //moveMatrix is for internal move
  this.moveMatrix = {};
  this.moveMatrix['00-1'] = new THREE.Matrix4();
  this.moveMatrix['010'] = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1);
  this.moveMatrix['0-10'] = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
  this.moveMatrix['100'] = new THREE.Matrix4().set(0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1);
  this.moveMatrix['-100'] = new THREE.Matrix4().set(0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1);

  this.currentExpand = false;
  this.rotationProgress = false;
  this.hasNext = false;
  this.canSetNext = true;
  this.suspended = false;

  this.currentPosition = new THREE.Vector3(0, 0, 0);
  this.currentMatrix = new THREE.Matrix4();
  this.currentMatrixInverse = new THREE.Matrix4();
  this.currentViewMatrix = new THREE.Matrix4();
  this.currentViewMatrixCamera = new THREE.Matrix4();
  this.cameraDisplacement = new THREE.Vector3(0, 0, 0);

  this.nextMatrix = new THREE.Matrix4();
  this.cameraRotation = new THREE.Euler(0, 0, 0, 'ZYX');

  this.arrows = new ArrowCanvas();
  document.body.appendChild(this.arrows.element);

  this.arrows.onclick['0'] = this.feedNext.bind(this, 0, 0, -1);
  this.arrows.onclick['1'] = this.feedNext.bind(this, 1, 0, 0);
  this.arrows.onclick['2'] = this.feedNext.bind(this, 0, -1, 0);
  this.arrows.onclick['3'] = this.feedNext.bind(this, -1, 0, 0);
  this.arrows.onclick['4'] = this.feedNext.bind(this, 0, 1, 0);

  this.tmp = new THREE.Matrix4();
  this.ftmp = new THREE.Frustum();
  this.vtmp = new THREE.Vector3();
  this.updateSettings(managerSettings);

  this.feedNext(0, 0, -1);
  this.go();
};
Manager.prototype.updateSettings = function(settings, frameSettings) {
  if (frameSettings)
    this.frame.updateSettings(frameSettings);

  this.easeIndex = settings.easeIndex;
  this.cameraDisplacement.z = settings.displacementZ;
  this.expandSpeed = settings.expandSpeed;
  this.rotationSpeed = settings.expandSpeed * settings.rotationSpeed;

  this.cameraDisplacementMatrix = new THREE.Matrix4().makeRotationFromEuler(this.cameraRotation);
  this.arrows.setActive(settings.displayArrows);

  if (this.rotationProgress === 0)
    this.updateCurrentPosition();
  this.updateCamera();
};
Manager.prototype.easeFunction = [];
Manager.prototype.easeFunction[0] = function(t) {
  return t
};
Manager.prototype.easeFunction[1] = function(t) {
  return -Math.cos(t * Math.PI) / 2 + 0.5
};
Manager.prototype.easeFunction[2] = function(t) {
  return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};
Manager.prototype.animateRotation = function(percent, current) {
  percent = this.easeFunction[this.easeIndex](percent);
  if (this.detached) return;

  if (this.nextInternal.x !== 0)
    this.currentViewMatrix.makeRotationY(-this.nextInternal.x * percent * Math.PI / 2)
  else if (this.nextInternal.y !== 0)
    this.currentViewMatrix.makeRotationX(this.nextInternal.y * percent * Math.PI / 2)
  else
    this.currentViewMatrix.identity();

  this.currentViewMatrixCamera.multiplyMatrices(this.currentViewMatrix, this.cameraDisplacementMatrix);
};
Manager.prototype.updateCamera = function() {
  if (this.detached) return false;

  camera.rotation.setFromRotationMatrix(this.currentViewMatrixCamera);
  camera.position.copy(this.cameraDisplacement);
  camera.position.applyMatrix4(this.currentViewMatrix);
  this.vtmp.copy(this.currentPosition);
  this.vtmp.applyMatrix4(this.currentMatrixInverse);
  camera.position.add(this.vtmp);
  syncLight();
};
Manager.prototype.feedNext = function(x, y, z) {
  if (!this.canSetNext) {
    this.arrows.setShape(this.nextInternal.x ? -this.nextInternal.x + 2 : this.nextInternal.y ? this.nextInternal.y + 3 : 0, 2);
    return;
  }

  if (x === undefined) {
    var straight = (Math.random() * 6 | 0) === 0;
    if (straight)
      this.nextInternal.set(0, 0, -1);
    else {
      var w = Math.random() * 2 | 0,
        d = Math.random() * 2 | 0;
      this.nextInternal.x = this.nextInternal.y = this.nextInternal.z = 0;
      this.nextInternal[w === 1 ? 'y' : 'x'] = d === 0 ? -1 : 1;
    }
  } else {
    this.nextInternal.x = x;
    this.nextInternal.y = y;
    this.nextInternal.z = z;
  }

  this.next.copy(this.nextInternal);
  this.next.applyMatrix4(this.currentMatrix);
  this.arrows.setShape(this.nextInternal.x ? -this.nextInternal.x + 2 : this.nextInternal.y ? this.nextInternal.y + 3 : 0, 1);

  this.nextMatrix.multiplyMatrices(this.currentMatrix, this.moveMatrix[this.nextInternal.x + '' + this.nextInternal.y + '' + this.nextInternal.z]);

  this.hasNext = true;

  this.resetCamera = this.resetCamera.bind(this);
};
Manager.prototype.go = function() {
  this.currentEdge = this.frame.ensureEdge(this.currentVertex, this.next.x, this.next.y, this.next.z);
  this.expandCurrentEdge = !!this.currentEdge;
  this.currentEdge = this.currentEdge || this.currentVertex.edges[this.next.x + '' + this.next.y + '' + this.next.z];
  this.currentExpand = 0;
  this.rotationProgress = 0;
  this.hasNext = false;
  this.canSetNext = true;
  this.arrows.setShape(0, 0);

  this.currentMatrix.copy(this.nextMatrix);
  this.currentMatrixInverse.getInverse(this.currentMatrix);
  scene.rotation.setFromRotationMatrix(this.tmp.getInverse(this.currentMatrix));
  this.animateRotation(0);

  this.current.copy(this.next);
};
Manager.prototype.updateCurrentPosition = function() {
  if (!this.currentEdge) return;

  this.currentPosition.set(this.currentEdge[0].position.x + this.currentExpand * this.current.x,
    this.currentEdge[0].position.y + this.currentExpand * this.current.y,
    this.currentEdge[0].position.z + this.currentExpand * this.current.z);
  this.currentPosition.multiplyScalar(this.frame.size);
};
Manager.prototype.tick = function(t) {
  /*
   * Want to do more advanced rot? Then also fix .attach, since it relies on not using startMatrix
   * And of course, fix stuff that assumes .rotationProgress is 0 on new
   * And also .feedNext
   * And everything... good luck
   **/
  if (this.suspended) t = 0;

  if (this.currentExpand < 1 && t) {
    this.currentExpand += t * this.expandSpeed;

    if (this.currentExpand > 1) {
      t = (this.currentExpand - 1) / this.expandSpeed;
      this.currentExpand = 1;
    } else t = 0;

    if (this.expandCurrentEdge)
      this.frame.expandEdge(this.currentEdge, this.currentExpand);
    this.updateCurrentPosition();
  }

  if (this.currentExpand >= 1 && t) {
    if (this.canSetNext) {
      if (!this.hasNext)
        this.feedNext();

      this.canSetNext = false;
      this.feedNext();
    }

    if (this.nextInternal.z === -1)
      this.rotationProgress = 1;

    this.rotationProgress += t * this.rotationSpeed;

    if (this.rotationProgress > 1) {
      t = (this.rotationProgress - 1) / this.rotationSpeed;
      this.rotationProgress = 1;
    } else t = 0;
  }

  if (this.rotationProgress > 0)
    this.animateRotation(this.rotationProgress);

  if (this.currentExpand === 1 && this.rotationProgress === 1) {
    this.finishExpand();
    this.go();
  }

  if (t) return this.tick(t, true);
  this.updateCamera();
};
Manager.prototype.finishExpand = function() {
  this.currentVertex = this.currentVertex.links[this.current.x + '' + this.current.y + '' + this.current.z];

  this.currentPosition.x -= this.current.x * this.frame.size;
  this.currentPosition.y -= this.current.y * this.frame.size;
  this.currentPosition.z -= this.current.z * this.frame.size;

  camera.position.x -= this.current.x * this.frame.size;
  camera.position.y -= this.current.y * this.frame.size;
  camera.position.z -= this.current.z * this.frame.size;
  syncLight();

  this.frame.move(-this.current.x, -this.current.y, -this.current.z);
};
Manager.prototype.detach = function() {
  this.currentViewMatrix = ((this.rotationProgress >= 0.5) ? this.nextMatrix : this.currentMatrix).clone();
  this.tmp.getInverse(this.currentViewMatrix);
  this.cameraDisplacementMatrix.multiplyMatrices(this.tmp, this.currentViewMatrixCamera);
  this.cameraRotation.setFromRotationMatrix(this.cameraDisplacementMatrix);

  this.detached = true;
};
Manager.prototype.updateCameraRotation = function() {
  this.cameraDisplacementMatrix.makeRotationFromEuler(this.cameraRotation);
  this.currentViewMatrixCamera.multiplyMatrices(this.currentViewMatrix, this.cameraDisplacementMatrix);
  camera.rotation.setFromRotationMatrix(this.currentViewMatrixCamera);
};
Manager.prototype.updateCameraDisplacement = function(settings) {
  this.cameraDisplacement.z = settings.displacementZ;
};
Manager.prototype._resetCamera = function() {
  this.cameraRotation.x = this.cameraRotation.y = this.cameraRotation.z = 0;
  this.cameraDisplacement.x = this.cameraDisplacement.y = 0;
};
Manager.prototype.resetCamera = function() {
  if (!this.detached) {
    this._resetCamera();
    this.updateCameraRotation();
  }
};
Manager.prototype.attach = function() {
  this.detached = false;
  this._resetCamera();

  var currentRotation = Math.min(1, Math.max(0, this.rotationProgress));
  this.animateRotation(currentRotation, true);

  this.updateCameraRotation();
};
Manager.prototype.countVisible = function() {
  camera.updateMatrix();
  camera.updateMatrixWorld();
  camera.matrixWorldInverse.getInverse(camera.matrixWorld);

  this.tmp.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
  this.tmp.multiplyMatrices(this.tmp, this.currentMatrixInverse)

  this.ftmp.setFromMatrix(this.tmp);

  var ret = 0,
    t;
  for (t = 0; t < this.frame.vertices.length; t++)
    ret += this.ftmp.containsPoint(this.frame.vertices[t].position) ? 1 : 0;
  return ret;
}
Manager.prototype.forceNext = function() {
  this.frame.expandEdge(this.currentEdge, 1);
  this.finishExpand();
  this.currentPosition.set(0, 0, 0);
  this.go();
  this.feedNext();
  this.animateRotation(0);
  this.updateCamera();
};