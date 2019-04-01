var Oro = Oro || {};
Oro.Graphics = Oro.Graphics || {};
Oro.Graphics.Elements = Oro.Graphics.Elements || {};
Oro.Graphics.Elements.Element = function() {};

Oro.Graphics.Elements.Element.prototype.fillFromOption = function(options) {
  this.setPrimitiveType(options.type);
  this.setName(options.name || '<Без названия>');
  this.settings = options.settings;
  this.configurable = options.configurable;
  this.fillChildren(options.children);
  this.init();
};

Oro.Graphics.Elements.Element.prototype.init = function() {};

Oro.Graphics.Elements.Element.prototype.fillChildren = function(list) {
  if (!list || 0 === list.length)
    return;
  this.children = [];
  self = this;
  list.forEach(function(desc) {
    var obj;
    try {
      obj = eval('new '+desc.type+'();');
    } catch(e) {
      obj = new Oro.Graphics.Elements.Element();
    }
    obj.fillFromOption(desc);
    obj.setParent(self);
    self.children.push(obj);
  });
};

// Oro.Graphics.Elements.Element.prototype.getWidth = function() {
//   return this.settings.width.value;
// };

// Oro.Graphics.Elements.Element.prototype.getHeight = function() {
//   return this.settings.height.value;
// };

Oro.Graphics.Elements.Element.prototype.setPrimitiveType = function(type) {
  this.primitiveType = type;
};

Oro.Graphics.Elements.Element.prototype.getPrimitiveType = function() {
  var _type = this.primitiveType;
  if (!_type)
    throw Error('No primitive type set');
  return _type;
};

Oro.Graphics.Elements.Element.prototype.getName = function() {
  return this.name;
};

Oro.Graphics.Elements.Element.prototype.setName = function(name) {
  return this.name = name;
};

Oro.Graphics.Elements.Element.prototype.setUID = function(uid) {
  this.uid = uid;
};

Oro.Graphics.Elements.Element.prototype.getUID = function() {
  return this.uid;
};

Oro.Graphics.Elements.Element.prototype.respectParentBorders = function() {
  this.respectParentBorders = true;
};

Oro.Graphics.Elements.Element.prototype.setParent = function(parent) {
  this.parent = parent;
};

Oro.Graphics.Elements.Element.prototype.getParent = function() {
  return this.parent;
};

Oro.Graphics.Elements.Element.prototype.setSetting = function(name, value) {
  this.settings[name] = this.settings[name] || {};
  this.settings[name].value = value;
};

Oro.Graphics.Elements.Element.prototype.getSetting = function(name) {
  var setting = this.settings[name];
  return setting ? setting.value : null;
};

Oro.Graphics.Elements.Element.prototype.getFieldSettings = function(name) {
  return this.settings[name];
};

Oro.Graphics.Elements.Element.prototype.getSettings = function() {
  return this.settings;
};

Oro.Graphics.Elements.Element.prototype.isConfigurable = function(name) {
  var setting = this.settings[name],
      configurable = setting && setting.configurable,
      result;
  if (setting)
    result = configurable != undefined && configurable != null;
  else
    result = false;
  return result;
};

Oro.Graphics.Elements.Element.prototype.setUIDs = function(uidsFactory) {
  this.setUID('model_'+uidsFactory());
  var children = this.children;
  if (children) 
    children.forEach(function(model){ model.setUIDs(uidsFactory) });
};

Oro.Graphics.Elements.Element.prototype.getChildren = function() {
  return this.children;
};

Oro.Graphics.Elements.Element.prototype.visit = function(visitor) {
  visitor(this);
  var children = this.getChildren();
  if (children)
    children.forEach(function(model){ model.visit(visitor); });
};

Oro.Graphics.Elements.Element.prototype.isSettingValid = function(name, value) {
  var setting = this.settings && this.settings[name];
  if (!setting)
    return false;

  var min = setting.min,
      max = setting.max,
      valid = true;

  if (min !== undefined && value < min)
      valid = false;

  if (valid)
    if (max !== undefined && value > max)
      valid = false;

  return valid;
};