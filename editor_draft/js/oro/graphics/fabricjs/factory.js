var Oro = Oro || {};
Oro.Graphics = Oro.Graphics || {};
Oro.Graphics.FabricJS = Oro.Graphics.FabricJS || {};
Oro.Graphics.FabricJS.Factory = {};

Oro.Graphics.FabricJS.Factory.create = function(model, canvas, wrapperDiv, callback) {
  var self = this,
      type = model.getPrimitiveType(),
      obj = null,
      creatorName = 'create'+type.camelize(),
      creator = this[creatorName];

  if (creator) {
    creator(model, canvas, wrapperDiv, function(obj){
      self.setObjectDefaults(obj);
      canvas.add(obj);
      callback(obj);
    });
  }
  else
    console.log('Oro.Graphics.FabricJS.Factory#create: Unknown type: '+type);
};

Oro.Graphics.FabricJS.Factory.setObjectDefaults = function(object) {
  object.set({selectable: false});
  object.set({hasControls: false});
  object.set({transparentCorners: false});
}

/*
   Creators
*/
Oro.Graphics.FabricJS.Factory.createRect = function(model, canvas, wrapperDiv, callback) {
  callback(new fabric.Rect({
                left: model.getSetting('left') || 0,
                top: model.getSetting('top') || 0,
                originX: 'left',
                originY: 'top',
                width: model.getSetting('width') || 0,
                height: model.getSetting('height') || 0,
                fill: model.getSetting('color') || 'white',
                angle: model.getSetting('angle') || 0
            })
          );
};

Oro.Graphics.FabricJS.Factory.createImage = function(model, canvas, wrapperDiv, callback) {
  var settings = [
    'left', 
    'top',
    'angle'
  ];

  fabric.Image.fromURL(model.getSetting('src'), function(img) {
    var setting, value;
    settings.forEach(function(name){
      value = model.getSetting(name);
      if (value) {
        img['set'+name.camelize()](value);
      }
    });

    callback(img);
  });
};
