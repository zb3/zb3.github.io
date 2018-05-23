"use strict";
"dontuse ie6";

var camera, scene, realScene, renderer, light, ambientLight, fog, canvas;
var frame, manager, controls, settingsIO, gui;
var state = 'normal',
  freeMode = false;

var defaultSettings, settings = defaultSettings = {
  "appName": "zb3.rw3D",
  "cameraFOV": 45,
  "cameraFar": 1000,
  "lightColor": "#ffffff",
  "ambientColor": "#101010",
  "bgColor": "#000000",
  "fogDensity": 0.02,
  "lightLocked": true,
  "freeSpeed": 0.07,
  "tickInterval": 30,
  "baseColor": "#9bfff9",
  "segmentColor": "#ffffff",
  "useFaces": true,
  "faceColor": "#000000",
  "faceOpacity": 0.85,
  "thickness": 0.018,
  "detail": 13,
  "heightSegments": 1,
  "sphereSegments": 8,
  "maxsize": 42,
  "edgeSize": 0.5,
  "segments": 4,
  "expandSpeed": 0.0006,
  "rotationSpeed": 1.83,
  "displacementZ": 2.5,
  "displayArrows": true,
  "easeIndex": "1"
};
defaultSettings = JSON.stringify(settings);

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(settings.bgColor);

  canvas = renderer.domElement;
  document.body.appendChild(canvas);
  canvas.tabIndex = 1;
  canvas.oncontextmenu = function(event) {
    event.preventDefault()
  };

  camera = new THREE.PerspectiveCamera(settings.cameraFOV, window.innerWidth / window.innerHeight, 0.3, settings.cameraFar);
  camera.position.z = -10;
  realScene = new THREE.Scene();

  light = new THREE.PointLight({
    color: settings.lightColor
  });
  light.position.z = -10;
  realScene.add(light);

  ambientLight = new THREE.AmbientLight(settings.ambientColor);
  realScene.add(ambientLight);

  fog = new THREE.FogExp2(settings.bgColor, settings.fogDensity);
  realScene.fog = fog;

  scene = new THREE.Object3D();
  realScene.add(scene);

  frame = new Frame(settings);
  manager = new Manager(frame, settings);
  controls = new Controls();

  window.addEventListener('resize', onWindowResize, false);

  changeFree();

  settingsIO = new SettingsIO(window, 'settings', true, 'zb3.rw3D', defaultSettings, onSettingsChanged);
  initGUI();

  getStarted();
  render();
  intro.stopLoading();
  manager.suspended = true;
  tick();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  renderer.render(realScene, camera);
}

function updateGlobalSettings() {
  renderer.setClearColor(settings.bgColor);
  camera.fov = settings.cameraFOV;
  camera.far = settings.cameraFar;
  camera.updateProjectionMatrix();
  light.color.setStyle(settings.lightColor);
  ambientLight.color.setStyle(settings.ambientColor);
  realScene.fog.color.setStyle(settings.bgColor);
  realScene.fog.density = settings.fogDensity;

  if (state === 'free' !== freeMode)
    changeFree();
}

function syncLight() {
  if (settings.lightLocked)
    light.position.copy(camera.position);
}

function setFree() {
  state = 'free';
  freeMode = true;
  manager.detach();
  manager.suspended = true;
  controls.setFree();
}

function setNormal() {
  state = 'normal';
  freeMode = false;
  manager.attach();
  manager.suspended = false;
  controls.setNormal();
}

function changeFree() {
  if (freeMode) setFree();
  else setNormal();
}

function updateManagerSettings() {
  manager.updateSettings(settings);
}

function updateFrameSettings() {
  frame.updateSettings(settings);
}

function initGUI() {
  gui = new dat.GUI({
    width: 350
  });
  gui.close();
  var ma = gui.addFolder('Main appearance');
  ma.add(settings, 'displacementZ').min(0).step(0.1).name('Camera z distance').onChange(function() {
    manager.updateCameraDisplacement(settings);
  }).listen();
  ma.addColor(settings, 'bgColor').name('Background color').onChange(updateGlobalSettings);
  ma.addColor(settings, 'baseColor').name('Cylinder color #1').onChange(updateFrameSettings);
  ma.addColor(settings, 'segmentColor').name('Cylinder color #2').onChange(updateFrameSettings);
  ma.add(settings, 'useFaces').name('Display faces').onChange(updateFrameSettings);
  ma.addColor(settings, 'faceColor').name('Face color').onChange(updateFrameSettings);
  ma.add(settings, 'faceOpacity').min(0).max(1).step(0.05).name('Face opacity').onChange(updateFrameSettings);
  ma.add(settings, 'thickness').min(0).name('Cylinder thickness').onChange(updateFrameSettings);
  ma.add(settings, 'edgeSize').min(0.1).step(0.05).name('Cylinder length').onChange(updateFrameSettings);
  ma.add(settings, 'segments').min(2).step(1).name('Cubes per segment').onChange(updateFrameSettings);
  ma.add(settings, 'maxsize').min(4).step(1).name('Max depth').onChange(updateFrameSettings);

  var misca = gui.addFolder('Misc appearance');
  misca.add(manager.cameraRotation, 'z').step(0.01).name('Camera z rotation').onChange(function() {
    manager.updateCameraRotation();
  }).listen();
  misca.add(settings, 'cameraFOV', 0, 90).step(1).name('FOV').onChange(updateGlobalSettings);
  misca.add(settings, 'cameraFar').min(0).step(1).name('Camera far').onChange(updateGlobalSettings);
  misca.addColor(settings, 'lightColor').name('Light color').onChange(updateGlobalSettings);
  misca.addColor(settings, 'ambientColor').name('Ambient light color').onChange(updateGlobalSettings);
  misca.add(settings, 'fogDensity').min(0).step(0.01).name('Fog density').onChange(updateGlobalSettings);
  misca.add(settings, 'detail').min(4).step(1).name('Cylinder segments').onChange(updateFrameSettings);
  misca.add(settings, 'heightSegments').min(1).step(1).name('Cylinder hegiht segments').onChange(updateFrameSettings);
  misca.add(settings, 'sphereSegments').min(6).step(1).name('Shpere segments').onChange(updateFrameSettings);

  var mms = gui.addFolder('Movement settings');
  mms.add(settings, 'expandSpeed').min(0).step(0.0001).name('Expand speed').onChange(updateManagerSettings);
  mms.add(settings, 'rotationSpeed').min(0).step(0.01).name('Relative rotation speed').onChange(updateManagerSettings);
  mms.add(settings, 'displayArrows').name('Dislplay arrow controls').onChange(updateManagerSettings);
  mms.add(settings, 'tickInterval').min(4).step(1).name('Clock interval').onChange(updateGlobalSettings);
  mms.open();

  var ms = gui.addFolder('Misc movement settings');
  ms.add(settings, 'freeSpeed').min(0).step(0.01).name('Free move speed').onChange(updateGlobalSettings);
  ms.add(settings, 'easeIndex', {
    'Linear': 0,
    'Cosine': 1,
    'Cubic': 2
  }).name('Rotation ease function').onChange(updateManagerSettings);
  ms.add(settings, 'lightLocked').name('Bind light to the camera');


  gui.add(controls, 'touchDragPan', {
    'Rotate camera': false,
    'Move camera': true
  }).name('On touch drag');
  gui.add(window, 'freeMode').name('Free mode').onChange(changeFree).listen();
  gui.add(manager, 'suspended').name('Suspend construction').listen();
  gui.add(manager, 'resetCamera').name('Reset camera');
  gui.add(settingsIO, 'uploadSettings').name('Import settings');
  gui.add(settingsIO, 'downloadSettings').name('Export settings');
  gui.add(settingsIO, 'reset').name('Reset settings');
}

function updateGUIDisplay(gui) {
  if (gui.__controllers)
    for (var c in gui.__controllers)
      if (gui.__controllers.hasOwnProperty(c))
        gui.__controllers[c].updateDisplay();

  if (gui.__folders)
    for (var f in gui.__folders)
      if (gui.__folders.hasOwnProperty(f))
        updateGUIDisplay(gui.__folders[f]);
}

function onSettingsChanged() {
  updateGlobalSettings();
  updateFrameSettings();
  updateManagerSettings();
  if (gui)
    updateGUIDisplay(gui);
}


function getStarted() {
  var max_steps = 50,
    min_visible = 8,
    steps = 0;
  var steps = 0,
    vis = 0;
  while (vis < min_visible && steps < max_steps) {
    manager.forceNext();
    steps++;
    vis = manager.countVisible();
  }
}

var renderTime = 0;

function tick() {
  requestAnimationFrame(tick);
  var now = Date.now();
  manager.tick(renderTime ? now - renderTime : 0);
  renderTime = now;
  render();
}

intro.onClick(function() {
  manager.suspended = false;
});
window.addEventListener('load', init);