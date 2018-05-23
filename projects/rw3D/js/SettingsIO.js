var SettingsIO = function(obj, prop, retainReference, hash, defaultString, onload) {
  this.obj = obj;
  this.prop = prop;
  this.retainReference = retainReference;
  this.hash = hash;
  this.onload = onload;
  this.dummyupload = document.createElement('input');
  this.dummyupload.type = 'file';
  this.dummyupload.onchange = this.uploadNext.bind(this);
  this.defaultString = defaultString;
  this.loadFromStorage();

  addEventListener('beforeunload', this.saveToStorage.bind(this));
};
SettingsIO.prototype.parseObjectString = function(str) {
  if (str === 'undefined' || str === 'null' || typeof str !== 'string') return false;
  var obj = null;
  try {
    obj = JSON.parse(str);
  } catch (e) {}

  if (typeof obj !== 'object' || obj === null || obj.appName !== this.hash)
    return false;

  return obj;
};
SettingsIO.prototype.clearStorage = function() {
  localStorage.removeItem(this.hash + '.settings');
};
SettingsIO.prototype.loadFromStorage = function() {
  this.loadFromString(localStorage.getItem(this.hash + '.settings'), true);
};
SettingsIO.prototype.saveToStorage = function() {
  localStorage.setItem(this.hash + '.settings', this.getString());
};
SettingsIO.prototype.reset = function() {
  this.loadObject(JSON.parse(this.defaultString));
};
SettingsIO.prototype.overwriteObject = function(obj, newObj) {
  //doesn't work
  for (var prop in newObj)
    if (newObj.hasOwnProperty(prop)) {
      if (typeof newObj[prop] === 'object' && newObj[prop] !== null && typeof obj[prop] === 'object' && obj[prop] !== null)
        this.setObject(obj[prop], newObj[prop]);
      else obj[prop] = newObj[prop];
    }
};
SettingsIO.prototype.loadObject = function(obj) {
  if (this.retainReference)
    this.overwriteObject(this.obj[this.prop], obj);
  else
    this.obj[this.prop] = obj;

  if (this.onload)
    this.onload();

  this.saveToStorage();
};
SettingsIO.prototype.uploadSettings = function() {
  this.dummyupload.click();
};
SettingsIO.prototype.uploadNext = function() {
  var _this = this;
  if (this.dummyupload.files.length) {
    var reader = new FileReader();
    reader.onload = function() {
      _this.loadFromString(reader.result);
    }
    reader.readAsText(this.dummyupload.files[0]);
  }
};
SettingsIO.prototype.loadFromString = function(str, quiet) {
  var obj = this.parseObjectString(str);
  if (!obj) {
    if (!quiet) alert('Invalid settings format!'); //alert is brilliant
    return;
  }

  this.loadObject(obj);
};
SettingsIO.prototype.getString = function() {
  return JSON.stringify(this.obj[this.prop]);
};
SettingsIO.prototype.simulateClickToMakeFirefoxHappy = function(el) {
  /*
  Normally I'd use .click(), but it seems that firefox is unhappy when I do it.
  So I decided to use this way of simulating click - so as to make firefox happy!
  */
  var evt = document.createEvent("MouseEvents");
  evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  el.dispatchEvent(evt);
}
SettingsIO.prototype.downloadSettings = function() {
  var link = document.createElement('a');
  link.download = this.hash + '.settings.json';
  link.href = 'data:application/json;base64,' + btoa(JSON.stringify(this.obj[this.prop]));
  this.simulateClickToMakeFirefoxHappy(link)
};