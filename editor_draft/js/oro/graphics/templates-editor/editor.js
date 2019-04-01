var Oro = Oro || {};
Oro.Graphics = Oro.Graphics || {};
Oro.Graphics.TemplatesEditor = Oro.Graphics.TemplatesEditor || {};

/*
  Editor
*/
Oro.Graphics.TemplatesEditor.Editor = function(container, templates) {
  this.views = ko.observableArray();
  this.models = ko.observableArray();
  this.selectedModel = ko.observable();
  this.container = container;
  this.handleTemplates(Oro.Graphics.TemplatesEditor.Templates);
  ko.applyBindings(this, this.container);
};

Oro.Graphics.TemplatesEditor.Editor.prototype.handleTemplates = function(templates) {
  var settings = this.container.querySelector('.settings-wrapper'),
      self = this;

  templates.forEach(function(t){
    var view = new Oro.Graphics.TemplatesEditor.TemplateViewModel(t, settings, self.selectedModel);
    //TODO: replace with batch insertions.
    self.views.push(view);
    self.models.push(view.getModel());
  });
};

Oro.Graphics.TemplatesEditor.Editor.prototype.afterRender = function(inserted, view) {
  Oro.Graphics.TemplatesEditor.Editor.injectIntoInserted(inserted, 'graphics-wrapper', function(parent){ view.renderGraphics(parent); });
  Oro.Graphics.TemplatesEditor.Editor.injectIntoInserted(inserted, 'settings-wrapper', function(parent){ view.renderSettings(parent); });
};

Oro.Graphics.TemplatesEditor.Editor.injectIntoInserted = function(inserted, name, func) {
  inserted.forEach(function(e){
    if ('DIV' === e.nodeName) {
      if (e.className.split(/\s+/).indexOf(name) !== -1)
        func(e);
    }
  });
};

Oro.Graphics.TemplatesEditor.Editor.appendTemplate = function(template) {
  Oro.Graphics.TemplatesEditor.Templates.push(template);
};