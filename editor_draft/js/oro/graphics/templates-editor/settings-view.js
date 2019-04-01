var Oro = Oro || {};
Oro.Graphics = Oro.Graphics || {};
Oro.Graphics.TemplatesEditor = Oro.Graphics.TemplatesEditor || {};
/*
  SettingsView
*/
Oro.Graphics.TemplatesEditor.SettingsView = function(model) {
  var self = this;
  this.model = model;
  this.selectedModelId = ko.observable(model.getUID());
};


Oro.Graphics.TemplatesEditor.SettingsView.prototype.renderSettings = function(parentEl, parentView) {
  this.parentView = parentView;
  this.renderModelSettings(parentEl, this.model);
};

Oro.Graphics.TemplatesEditor.SettingsView.prototype.renderModelSettings = function(parentEl, model) {
  var self = this,
      wrapper = document.createElement('div'),
      header = document.createElement('span');

  header.innerHTML = model.getName();
  header.classList.add('model-title');
  wrapper.appendChild(header);
  parentEl.appendChild(wrapper);

  var settings = model.getSettings(),
      optionWrapper;

  this._settings = this._settings || {};

  for (var opt in settings) {
    if (model.isConfigurable(opt)) {
      //divs
      optionWrapper = document.createElement('div');
      optionWrapper.classList.add('option-wrapper');
      wrapper.appendChild(optionWrapper);
      parentEl.appendChild(wrapper);

      //field
      var field = this.factory.create(opt, settings[opt], optionWrapper),
          name = opt,
          modelUID = model.getUID();
      if (field) {
        field.linkData = {
          modelUID: modelUID, 
          settingName: name,
          settingData: settings[opt]
        };
        field.addChangesListener(function(changes) { self.onChanges(changes)} );

        // register
        this._settings[modelUID] = this._settings[modelUID] || {};
        this._settings[modelUID][name] = field;
      }
    }
  }

  //Append KO-bindings to the on-the-fly 'after-render' generated wrapper.
  ko.applyBindingAccessorsToNode(wrapper,  {
    visible: function() { return self.selectedModelId() == model.getUID(); }
  });

  var children = model.getChildren();
  if (children)
    children.forEach(function(child){ self.renderModelSettings(parentEl, child); });
};

Oro.Graphics.TemplatesEditor.SettingsView.prototype.onChanges = function(changes) {
  this.getChangesListeners()
      .forEach(function(listener){
        listener(changes);
      });
};

Oro.Graphics.TemplatesEditor.SettingsView.prototype.changeSelectedModel = function(uid) {
  this.selectedModelId(uid);
};

Oro.Graphics.TemplatesEditor.SettingsView.prototype.addChangesListener = function(listener) {
  this._changesListeners = this._changesListeners || [];
  this._changesListeners.push(listener);
};

Oro.Graphics.TemplatesEditor.SettingsView.prototype.getChangesListeners = function() {
  return this._changesListeners;
};

Oro.Graphics.TemplatesEditor.SettingsView.prototype.getSettings = function() {
  return this._settings;
};

/*
  Factory
*/
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory = {
  create: function(name, settings, el) {
    var creator = this[settings.type];
    return creator ? creator(name, settings, el) : null;
  },

  integer: function(name, settings, el) {
    var wrapper = new Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.NumberFieldWrapper();
    wrapper.init(name, settings, el);
    return wrapper;
  },

  color: function(name, settings, el) {
    var wrapper = new Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.ColorFieldWrapper();
    wrapper.init(name, settings, el);
    return wrapper;
  },

  angle: function(name, settings, el) {
    var wrapper = new Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.AngleFieldWrapper();
    wrapper.init(name, settings, el);
    return wrapper;
  },

  image: function(name, settings, el) {
    var wrapper = new Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.ImageFieldWrapper();
    wrapper.init(name, settings, el);
    return wrapper;
  }
};
Oro.Graphics.TemplatesEditor.SettingsView.prototype.factory = Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory;

/*

  Field wrappers.

*/ 
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.FieldWrapper = function() {};
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.FieldWrapper.prototype.init = function(name, setting, el) {};
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.FieldWrapper.prototype.getValue = function(){
  return this.control.getValue();
};
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.FieldWrapper.prototype.setValue = function(value){
  this.control.setValue(value);
};

Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.FieldWrapper.prototype.addChangesListener = function(listener){
  this._changesListeners = this._changesListeners || [];
  this._changesListeners.push(listener);
};

Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.FieldWrapper.prototype.getChangesListeners = function(){
  return this._changesListeners;
};


/*
  Number field wrapper
*/
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.NumberFieldWrapper = Oro.Helpers.extend(Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.FieldWrapper);

Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.NumberFieldWrapper.prototype.init = function(_name, settings, el) {
  var self = this;
      fieldWrapper = document.createElement('div'),
      buttonsWrapper = document.createElement('div'),
      upButton = document.createElement('button'),
      downButton = document.createElement('button');

  upButton.innerHTML = '+';
  downButton.innerHTML = '-';

  fieldWrapper.classList.add('integer-option');    
  buttonsWrapper.classList.add('option-controls');    

  buttonsWrapper.appendChild(upButton);
  buttonsWrapper.appendChild(downButton);
  el.appendChild(fieldWrapper);
  el.appendChild(buttonsWrapper);

  upButton.addEventListener('click', function(){
    self.setValue(parseInt(self.getValue())+1);
    self.control.trigger('increment');
  });

  downButton.addEventListener('click', function(){
    self.setValue(parseInt(self.getValue())-1);
    self.control.trigger('decrement');
  });

  function checkBounds(control, settings){
    var min = settings.min,
        max = settings.max,
        value = control.getValue(),
        valid = true;

    if (min !== undefined && value < min) {
        self.setValue(min);
        self.lastValue = min;
        valid = false;
    }
    if (max !== undefined && value > max) {
      self.setValue(max);
      self.lastValue = max;
      valid = false;
    }

    return valid;
  };

  var value = settings.value || '0';
  self.lastValue = value;

  $(fieldWrapper).alpaca({
    data: value,
    options: {
       schema: {
         type: 'string'
       },
       label: settings.title || 'Без названия',
       size: 5,
       numericEntry: true
     },
     postRender: function(control) {
       self.control = control; 

       control.on('increment', function() {
         this.trigger('change');
       });
       
       control.on('decrement', function() {
         this.trigger('change');
       });

       control.on('change', function() {
         if (checkBounds(this, self.linkData.settingData)) {
           self.getChangesListeners()
               .forEach(function(listener){
                  listener([
                    {
                      modelUID: self.linkData.modelUID, 
                      setting: self.linkData.settingName, 
                      value: self.getValue()
                    }
                  ]);
               });
         }
       });

       control.on('keyup', function() {
         this.trigger('change');
       });
     }
   });
};

Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.NumberFieldWrapper.prototype.setValue = function(val) {
  this.control.setValue(parseInt(val || 0));
};

Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.NumberFieldWrapper.prototype.getValue = function() {
  return this.control.getValue() || '0';
};

/*
  Color picker field wrapper.
*/
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.ColorFieldWrapper = Oro.Helpers.extend(Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.FieldWrapper);
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.ColorFieldWrapper.prototype.init = function(name, settings, el){
  this.name = settings.name;
  this.value = settings.value;
  var self = this;
  
  $(el).alpaca({
     data: settings.value,
     options: {
       schema: {
         type: "string"
       },
       type: "color",
       label: settings.title || 'Без названия',
     },
     postRender: function(control) {
       self.control = control;       
       control.on('change', function(){
         self.getChangesListeners()
             .forEach(function(listener){
                listener([
                  {
                    modelUID: self.linkData.modelUID, 
                    setting: self.linkData.settingName, 
                    value: self.control.getValue()
                  }
                ]);
             });
       });
     }
   });
};

/*
  Rotation angle field wrapper.
*/
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.AngleFieldWrapper = Oro.Helpers.extend(Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.NumberFieldWrapper);
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.AngleFieldWrapper.prototype.init = function(name, settings, el) {
  Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.NumberFieldWrapper.prototype.init.apply(this, [name, settings, el]);
};


/*
  Image field option wrapper
*/
Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.ImageFieldWrapper = Oro.Helpers.extend(Oro.Graphics.TemplatesEditor.SettingsView.OptionFactory.FieldWrapper);