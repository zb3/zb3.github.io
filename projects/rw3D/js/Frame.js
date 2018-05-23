"use strict";
"this doesnothing";

var Frame = function(settings) {
  this.vertices = [];
  this.edges = [];
  this.spherePool = [];

  this._face2sphere = {};
  this._face2sphere['001'] = [1, 3, 5, 7];
  this._face2sphere['00-1'] = [0, 2, 4, 6];
  this._face2sphere['0-10'] = [0, 1, 4, 5];
  this._face2sphere['010'] = [2, 3, 6, 7];
  this._face2sphere['-100'] = [0, 1, 2, 3];
  this._face2sphere['100'] = [4, 5, 6, 7];

  this.materials = null;
  this.geometries = null;

  this.updateSettings(settings);

  this._createVertex(0, 0, 0);
  this._createCube(this.vertices[0], 0, 0, 0);
};
Frame.prototype.updateSettings = function(settings) {
  this.baseColor = settings.baseColor;
  this.segmentColor = settings.segmentColor;
  this.useFaces = settings.useFaces;
  this.faceColor = settings.faceColor;
  this.faceOpacity = settings.faceOpacity;
  this.thickness = settings.thickness;
  this.detail = settings.detail;
  this.heightSegments = settings.heightSegments;
  this.sphereSegments = settings.sphereSegments;
  this.maxsize = settings.maxsize;
  this.edgeSize = settings.edgeSize;
  this.segments = settings.segments;
  this.edgeSize2 = this.edgeSize / 2;
  this.size = this.edgeSize * (this.segments - 1);

  this.dispose();

  this._createMaterials();
  this._createGeometries();

  this.remesh();
  this.move(0, 0, 0);
};
Frame.prototype.dispose = function() {
  for (var t = 0; t < this.vertices.length; t++)
    this._disposeVertexObject(this.vertices[t]);

  this.spherePool = [];

  for (var t = 0; t < this.edges.length; t++) {
    if (this.edges[t].expanded >= 1)
      this._disposeEdgeObject(this.edges[t]);
    else this.edges[t].mesh = null;
  }

  if (this.expandMesh) {
    for (var t = 0; t < this.expandMesh.children.length; t++)
      this.expandMesh.remove(this.expandMesh.children[t]);
    scene.remove(this.expandMesh);
    this.expandMesh = null;
  }

  if (this.geometries)
    for (var t in this.geometries) {
      if (!this.geometries.hasOwnProperty(t)) continue;
      this.geometries[t].dispose();
      this.geometries[t] = null;
    }

  if (this.materials) {
    if (this.useFaces && this.materials.face) {
      this.materials.face.dispose();
      this.materials.face = null;
    }

    this.materials.base.dispose();
    this.materials.base = null;
    this.materials.segment.dispose();
    this.materials.segment = null;
  }
};
Frame.prototype.remesh = function() {
  for (var t = 0; t < this.vertices.length; t++)
    if (this.vertices[t].filled)
      this._createCube(this.vertices[t], this.vertices[t].position.x, this.vertices[t].position.y, this.vertices[t].position.z);

  for (var t = 0; t < this.edges.length; t++) {
    var edge = this._createEdgeObject(this.edges[t]);
    var lvl = this.edges[t].expanded;
    this.edges[t].expanded = this.edges[t].cs = 0;
    this.expandEdge(this.edges[t], lvl);
  }
};
Frame.prototype._createMaterials = function() {
  this.materials = {};
  this.materials.base = new THREE.MeshLambertMaterial({
    color: this.baseColor
  });
  this.materials.segment = new THREE.MeshLambertMaterial({
    color: this.segmentColor
  });

  if (this.useFaces) {
    this.materials.face = new THREE.MeshLambertMaterial({
      color: this.faceColor,
      opacity: this.faceOpacity,
      transparent: this.faceOpacity !== 1,
      side: THREE.DoubleSide,
      depthWrite: this.faceOpacity === 1
    });
    this.materials.segmentMFM = new THREE.MeshFaceMaterial([this.materials.segment, this.materials.face]);
  }
};
Frame.prototype._createGeometries = function() {
  this.geometries = {};
  this.geometries.sphere = new THREE.SphereGeometry(this.thickness, 20, this.sphereSegments, this.sphereSegments);
  this.geometries.cylinder = new THREE.CylinderGeometry(this.thickness, this.thickness, this.edgeSize, this.detail, this.heightSegments, true);
  if (this.useFaces) {
    this.geometries.face = new THREE.PlaneGeometry(this.edgeSize, this.edgeSize);
    this.geometries.faceTube = new THREE.BoxGeometry(this.edgeSize, this.edgeSize, this.edgeSize);
    if (this.segments > 2)
      this.geometries.faceSegment = new THREE.BoxGeometry(this.edgeSize, this.edgeSize * (this.segments - 2), this.edgeSize);

    for (var t = 0; t < this.geometries.faceTube.faces.length; t++) {
      this.geometries.faceTube.faces[t].materialIndex = 1;
      if (this.geometries.faceTube.faces[t].normal.y)
        this.geometries.faceTube.faces.splice(t--, 1);
    }
    for (var t = 0; this.segments > 2 && t < this.geometries.faceSegment.faces.length; t++) {
      this.geometries.faceSegment.faces[t].materialIndex = 0;
      if (this.geometries.faceSegment.faces[t].normal.y)
        this.geometries.faceSegment.faces.splice(t--, 1);
    }
  }

  var matrix = new THREE.Matrix4().makeTranslation(-this.edgeSize2, 0, -this.edgeSize2);
  this.geometries.tube = new THREE.Geometry();
  this.geometries.tube.merge(this.geometries.cylinder, matrix);
  matrix.makeTranslation(-this.edgeSize2, 0, this.edgeSize2);
  this.geometries.tube.merge(this.geometries.cylinder, matrix);
  matrix.makeTranslation(this.edgeSize2, 0, -this.edgeSize2);
  this.geometries.tube.merge(this.geometries.cylinder, matrix);
  matrix.makeTranslation(this.edgeSize2, 0, this.edgeSize2);
  this.geometries.tube.merge(this.geometries.cylinder, matrix);

  var rtmp = new THREE.Geometry(),
    m2 = new THREE.Matrix4().makeRotationX(Math.PI / 2);;
  matrix.makeTranslation(0, 0, -this.edgeSize2);
  rtmp.merge(this.geometries.cylinder, matrix);
  matrix.makeTranslation(0, 0, this.edgeSize2);
  rtmp.merge(this.geometries.cylinder, matrix);
  matrix.makeTranslation(0, 0, -this.edgeSize2);
  matrix.multiplyMatrices(m2, matrix);
  rtmp.merge(this.geometries.cylinder, matrix);
  matrix.makeTranslation(0, 0, this.edgeSize2);
  matrix.multiplyMatrices(m2, matrix);
  rtmp.merge(this.geometries.cylinder, matrix);

  this.geometries.ring = new THREE.Geometry();
  matrix.makeRotationZ(Math.PI / 2);
  this.geometries.ring.merge(rtmp, matrix);
  rtmp.dispose();

  this.geometries.cube = new THREE.Geometry();
  matrix.makeTranslation(0, -this.edgeSize2, 0);
  this.geometries.cube.merge(this.geometries.ring, matrix);
  matrix.makeTranslation(0, this.edgeSize2, 0);
  this.geometries.cube.merge(this.geometries.ring, matrix);
  this.geometries.cube.merge(this.geometries.tube);

  this.geometries.segment = new THREE.Geometry();
  if (this.segments > 2) {
    matrix.makeTranslation(0, this.edgeSize2, 0);
    this.geometries.segment.merge(this.geometries.tube, matrix);

    for (var t = 1; t < this.segments - 2; t++) {
      matrix.makeTranslation(0, (t) * this.edgeSize, 0);
      this.geometries.segment.merge(this.geometries.ring, matrix);

      matrix.makeTranslation(0, (t + 0.5) * this.edgeSize, 0);
      this.geometries.segment.merge(this.geometries.tube, matrix);
    }
  }

  if (this.useFaces) {
    this.geometries.faceTube.merge(this.geometries.tube, undefined, 0);
    if (this.segments > 2)
      this.geometries.segment.merge(this.geometries.faceSegment, matrix.makeTranslation(0, this.edgeSize2 * (this.segments - 2), 0), 1);
  }


  matrix.makeTranslation(-this.edgeSize2, 0, -this.edgeSize2);
  this.geometries.ring.merge(this.geometries.sphere, matrix);
  matrix.makeTranslation(-this.edgeSize2, 0, this.edgeSize2);
  this.geometries.ring.merge(this.geometries.sphere, matrix);
  matrix.makeTranslation(this.edgeSize2, 0, -this.edgeSize2);
  this.geometries.ring.merge(this.geometries.sphere, matrix);
  matrix.makeTranslation(this.edgeSize2, 0, this.edgeSize2);
  this.geometries.ring.merge(this.geometries.sphere, matrix);


  this.expandMesh = new THREE.Group();

  var material;
  for (var t = 0, material; t < this.segments - 1; t++) {
    if (this.useFaces)
      material = t === this.segments - 2 ? this.materials.base : this.materials.segmentMFM;
    else
      material = t === this.segments - 2 ? this.materials.base : this.materials.segment;

    var mesh = new THREE.Mesh(!this.useFaces || t === this.segments - 2 ? this.geometries.tube : this.geometries.faceTube, material);
    mesh.visible = false;
    this.expandMesh.add(mesh);

    mesh = new THREE.Mesh(this.geometries.ring, t >= this.segments - 3 ? this.materials.base : this.materials.segment);
    mesh.visible = false;
    this.expandMesh.add(mesh);
  }

  scene.add(this.expandMesh);
};
Frame.prototype.removeCubeFace = function(vertex, face) {
  for (var t = 0; t < 4; t++) {
    vertex.sphereScore[this._face2sphere[face][t]]++;

    if (vertex.sphereScore[this._face2sphere[face][t]] === 1) {
      vertex.mesh.remove(vertex.spheres[this._face2sphere[face][t]]);
      this.spherePool.push(vertex.spheres[this._face2sphere[face][t]]);
      vertex.spheres[this._face2sphere[face][t]] = null;
    }
  }
};
Frame.prototype.addCubeFace = function(vertex, face) {
  for (var t = 0, tx; t < 4; t++) {
    tx = this._face2sphere[face][t];
    vertex.sphereScore[tx]--;

    if (vertex.sphereScore[tx] === 0) {
      if (!this.spherePool.length) this._moreSpheres();
      vertex.spheres[tx] = this.spherePool.pop();
      vertex.mesh.add(vertex.spheres[tx]);
      vertex.spheres[tx].position.set((tx & 4 ? 1 : -1) * this.edgeSize2, (tx & 2 ? 1 : -1) * this.edgeSize2, (tx & 1 ? 1 : -1) * this.edgeSize2);
    }
  }
};
Frame.prototype._moreSpheres = function() {
  var mesh = new THREE.Mesh(this.geometries.sphere, this.materials.base);
  this.spherePool.push(mesh);
};
Frame.prototype._createCube = function(vertex, x, y, z) {
  var mesh = new THREE.Mesh(this.geometries.cube, this.materials.base);
  mesh.position.set(x * this.size, y * this.size, z * this.size);
  scene.add(mesh);

  vertex.filled = true;
  vertex.mesh = mesh;

  this.addCubeFace(vertex, '100');
  this.addCubeFace(vertex, '-100');
  this.addCubeFace(vertex, '010');
  this.addCubeFace(vertex, '0-10');
  this.addCubeFace(vertex, '001');
  this.addCubeFace(vertex, '00-1');

  return mesh;
};
Frame.prototype._createVertex = function(x, y, z) {
  var vertex = {
    position: null,
    mesh: null,
    links: {},
    edges: {},
    spheres: [],
    sphereScore: [3, 3, 3, 3, 3, 3, 3, 3],
    filled: false
  };
  vertex.position = new THREE.Vector3(x, y, z);

  this.insertVertex(vertex);

  return vertex;
};
Frame.prototype._disposeVertexObject = function(vertex) {
  for (var t = 0; t < 8; t++) {
    vertex.sphereScore[t] = 3;

    if (!vertex.spheres[t]) continue;
    this.spherePool.push(vertex.spheres[t]);
    vertex.mesh.remove(vertex.spheres[t]);
    vertex.spheres[t] = null;
  }

  if (vertex.mesh)
    scene.remove(vertex.mesh);
};
Frame.prototype._createEdge = function(v1, v2) {
  var edge = {
    mesh: null,
    0: v1,
    1: v2,
    x: v2.position.x - v1.position.x,
    y: v2.position.y - v1.position.y,
    z: v2.position.z - v1.position.z,
    expanded: 0,
    cs: 0
  };
  this.edges.push(edge);
  this._createEdgeObject(edge);
  return edge;
};
Frame.prototype._createEdgeObject = function(edge) {
  edge.mesh = this.expandMesh;
  edge.mesh.position.x = edge[0].position.x * this.size + edge.x * this.edgeSize2;
  edge.mesh.position.y = edge[0].position.y * this.size + edge.y * this.edgeSize2;;
  edge.mesh.position.z = edge[0].position.z * this.size + edge.z * this.edgeSize2;;
  edge.mesh.rotation.copy(new THREE.Euler(edge.y === -1 ? Math.PI : edge.z * Math.PI / 2, 0, -edge.x * Math.PI / 2));
};
Frame.prototype._disposeEdgeObject = function(edge) {
  scene.remove(edge.mesh);
  edge.mesh = null;
};
Frame.prototype.searchVertex = function(x, y, z) {
  var min = 0,
    max = this.vertices.length - 1,
    mid;
  var px, py, pz;
  while (max >= min) {
    mid = min + ((max - min) / 2 | 0);
    px = this.vertices[mid].position.x;
    py = this.vertices[mid].position.y;
    pz = this.vertices[mid].position.z;

    if (px === x && py === y && pz === z)
      return this.vertices[mid];
    else if (px < x || px === x && (py < y || py === y && pz < z))
      min = mid + 1;
    else if (px > x || px === x && (py > y || py === y && pz > z))
      max = mid - 1;
  }

  return false;
};
Frame.prototype.insertVertex = function(vertex) {
  var min = 0,
    max = this.vertices.length - 1,
    mid;
  var x = vertex.position.x,
    y = vertex.position.y,
    z = vertex.position.z;
  var px, py, pz;
  while (max >= min) {
    mid = min + ((max - min) / 2 | 0);
    px = this.vertices[mid].position.x;
    py = this.vertices[mid].position.y;
    pz = this.vertices[mid].position.z;

    if (px < x || px === x && (py < y || py === y && pz < z))
      min = mid + 1;
    else if (px > x || px === x && (py > y || py === y && pz > z))
      max = mid - 1;
  }

  this.vertices.splice(min, 0, vertex); //note: revisit, prove this.
};
Frame.prototype.ensureEdge = function(vertex, x, y, z) {
  if (vertex.links[x + '' + y + '' + z]) {
    if (vertex.edges[x + '' + y + '' + z][0] !== vertex) {
      vertex.edges[x + '' + y + '' + z][0] = vertex;
      vertex.edges[x + '' + y + '' + z][1] = vertex.links[x + '' + y + '' + z];

      vertex.edges[x + '' + y + '' + z].x = -vertex.edges[x + '' + y + '' + z].x || 0;
      vertex.edges[x + '' + y + '' + z].y = -vertex.edges[x + '' + y + '' + z].y || 0;
      vertex.edges[x + '' + y + '' + z].z = -vertex.edges[x + '' + y + '' + z].z || 0;
    }
    return false;
  }

  var destination = this.searchVertex(vertex.position.x + x, vertex.position.y + y, vertex.position.z + z);
  if (!destination)
    destination = this._createVertex(vertex.position.x + x, vertex.position.y + y, vertex.position.z + z);

  var edge = this._createEdge(vertex, destination);

  vertex.links[x + '' + y + '' + z] = destination;
  destination.links[-x + '' + -y + '' + -z] = vertex;

  vertex.edges[x + '' + y + '' + z] = edge;
  destination.edges[-x + '' + -y + '' + -z] = edge;

  this.expandEdge(edge, 0);

  return edge;
};
Frame.prototype.expandEdge = function(edge, lvl) {
  var currentExpand = lvl * (this.segments - 1) - edge.cs;

  if (lvl && !edge.expanded)
    this.removeCubeFace(edge[0], edge.x + '' + edge.y + '' + edge.z);

  while (currentExpand > 0) {
    if (edge.cs === this.segments - 2 && edge[1].filled) break;

    edge.mesh.children[2 * edge.cs].scale.y = Math.min(currentExpand, 1);
    edge.mesh.children[2 * edge.cs].position.y = edge.cs * this.edgeSize + Math.min(currentExpand, 1) * this.edgeSize2;
    edge.mesh.children[2 * edge.cs + 1].position.y = edge.cs * this.edgeSize + Math.min(currentExpand, 1) * this.edgeSize;
    edge.mesh.children[2 * edge.cs + 1].visible = (edge.cs === this.segments - 3 && edge[1].filled && currentExpand >= 1) ? false : true;
    edge.mesh.children[2 * edge.cs].visible = true;

    if (currentExpand-- > 1) edge.cs++;
  }

  if (lvl >= 1 && edge.expanded < 1) {
    for (var t = 0; t < this.expandMesh.children.length; t++)
      this.expandMesh.children[t].visible = false;

    if (!edge[1].filled)
      this._createCube(edge[1], edge[1].position.x, edge[1].position.y, edge[1].position.z);

    this.removeCubeFace(edge[1], (edge.x + '' + edge.y + '' + edge.z).replace(/[^-]/g, '-$&').replace(/--/g, '').replace(/-0/g, '0'));
    edge.mesh = new THREE.Mesh(this.geometries.segment, this.useFaces ? this.materials.segmentMFM : this.materials.segment);
    edge.mesh.position.copy(this.expandMesh.position);
    edge.mesh.rotation.copy(this.expandMesh.rotation);
    scene.add(edge.mesh);
  }

  edge.expanded = lvl;
};

Frame.prototype.removeVertex = function(vertex, index) {
  var dir, rdir;
  for (dir in vertex.links) {
    if (!vertex.links.hasOwnProperty(dir) || !vertex.links[dir]) continue;
    rdir = dir.replace(/[^-]/g, '-$&').replace(/--/g, '').replace(/-0/g, '0');

    this.addCubeFace(vertex.links[dir], rdir);

    this._disposeEdgeObject(vertex.links[dir].edges[rdir]);
    this.edges.splice(this.edges.indexOf(vertex.links[dir].edges[rdir]), 1);

    vertex.links[dir].links[rdir] = null;
    vertex.links[dir].edges[rdir] = null;
  }

  this._disposeVertexObject(vertex);
  vertex.spheres = vertex.links = vertex.edges = vertex.position = vertex.mesh = null;
  this.vertices.splice(index, 1);
};
Frame.prototype.move = function(x, y, z) {
  for (var t = 0; t < this.vertices.length; t++) {
    this.vertices[t].position.x += x;
    this.vertices[t].position.y += y;
    this.vertices[t].position.z += z;

    if (this.vertices[t].mesh) {
      this.vertices[t].mesh.position.x += x * this.size;
      this.vertices[t].mesh.position.y += y * this.size;
      this.vertices[t].mesh.position.z += z * this.size;
    }

    if (Math.abs(this.vertices[t].position.x) > this.maxsize ||
      Math.abs(this.vertices[t].position.y) > this.maxsize ||
      Math.abs(this.vertices[t].position.z) > this.maxsize)
      this.removeVertex(this.vertices[t], t--);
  }
  for (var t = 0; t < this.edges.length; t++) {
    if (!this.edges[t].mesh) continue;
    this.edges[t].mesh.position.x += x * this.size;
    this.edges[t].mesh.position.y += y * this.size;
    this.edges[t].mesh.position.z += z * this.size;
  }
};