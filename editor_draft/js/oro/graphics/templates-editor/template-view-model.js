var Oro = Oro || {};
Oro.Graphics = Oro.Graphics || {};
Oro.Graphics.TemplatesEditor = Oro.Graphics.TemplatesEditor || {};
/*
  Graphics & settings manager.
*/
Oro.Graphics.TemplatesEditor.TemplateViewModel = function(t, settingsContainer, selectionGetter) {
  var self = this;

  // graphicsContainer.classList.add('graphics-wrapper');
  // settingsContainer.classList.add('settings-wrapper');

  this.model = Oro.Graphics.Elements.Builder.buildFromDescription(t);
  this.model.setUIDs(function(){ return Oro.Graphics.TemplatesEditor.TemplateViewModel.getModelNextUID(); });

  this.uid2model = {};
  this.model.visit(function(model){ self.uid2model[model.getUID()] = model; });

  this.graphicView = new Oro.Graphics.TemplatesEditor.FabricJSView(this.model);
  this.graphicView.addChangesListener(function(changes) { return self.onGraphicsChanged(changes); });
  
  this.settingsView = new Oro.Graphics.TemplatesEditor.SettingsView(this.model);
  this.settingsView.addChangesListener(function(changes) { return self.onSettingsChanged(changes); });
  
  this.visible = ko.computed(function(){
    return selectionGetter() === self.model.getUID();
  });
};

Oro.Graphics.TemplatesEditor.TemplateViewModel.prototype.getModel = function() {
  return this.model;
};

Oro.Graphics.TemplatesEditor.TemplateViewModel.lastModelUID=1;
Oro.Graphics.TemplatesEditor.TemplateViewModel.getModelNextUID = function() {
  return this.lastModelUID++;
};

Oro.Graphics.TemplatesEditor.TemplateViewModel.prototype.renderGraphics = function(element) {
  this.graphicView.renderCanvas(element.getElementsByClassName('model-graphics')[0], this);
};

Oro.Graphics.TemplatesEditor.TemplateViewModel.prototype.renderSettings = function(element) {
  this.settingsView.renderSettings(element, this);
}

Oro.Graphics.TemplatesEditor.TemplateViewModel.prototype.changeSelectedModel = function(uid) {
  this.settingsView.changeSelectedModel(uid);
};

Oro.Graphics.TemplatesEditor.TemplateViewModel.prototype.onSettingsChanged = function(changes) {
  var self = this,
      graphics = this.graphicView.getGraphics(),
      g,
      changesResults = {};

  changes.forEach(function(change) {
    self.uid2model[change.modelUID].setSetting(change.setting, change.value)

    g = graphics[change.modelUID];
    g['set'+change.setting.camelize()](change.value);
    g.setCoords();

    changesResults[change.setting] = true
  });

  this.graphicView.redraw();
  return changesResults;
};

Oro.Graphics.TemplatesEditor.TemplateViewModel.prototype.onGraphicsChanged = function(changes) {
  var settings = this.settingsView.getSettings(),
      self = this,
      changesResults = {},
      model;

  changes.forEach(function(change) {
    model = self.uid2model[change.modelUID];
    if (model.isConfigurable(change.setting) && 
        model.isSettingValid(change.setting, change.value)) {
      // If setting valid
      model.setSetting(change.setting, change.value);
      settings[change.modelUID][change.setting].setValue(change.value);
      changesResults[change.setting] = true
    }
  });

  return changesResults;
};
