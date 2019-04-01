var Oro = Oro || {};
Oro.Graphics = Oro.Graphics || {};
Oro.Graphics.TemplatesEditor = Oro.Graphics.TemplatesEditor || {};

/*
   FabricJsView 
*/
Oro.Graphics.TemplatesEditor.FabricJSView = function(model) {
  this.model = model;
  this.width = model.getSetting('width')+'px';
  this.height = model.getSetting('height')+'px';

  // this.canvasWrapper = document.createElement('div');

  // bindings
  // this.canvasWrapper.style.width = model.getWidth()+'px';
  // this.canvasWrapper.style.height = model.getHeight()+'px';

  // this.canvasWrapper.style.display = 'none';
  // this.canvasWrapper.classList.add('model-graphics');
  // this.canvasWrapper.setAttribute('data-bind', 'visible: visible');

  // on ko.afterAdd callback
  // var canvasDiv = document.createElement('canvas');
  // canvasDiv.id = this.randomUID();
  // canvasDiv.style.width = this.canvasWrapper.style.width
  // canvasDiv.style.height = this.canvasWrapper.style.height;

  // this.canvasWrapper.appendChild(canvasDiv);
  // container.appendChild(this.canvasWrapper);

  // this.canvas = new fabric.Canvas(canvasDiv.id);
  // this.canvas.setWidth(model.getWidth());
  // this.canvas.setHeight(model.getHeight());
  // this.setupCanvasOptions(this.canvas);
  // this.drawModelOnCanvas(this.model);
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.renderCanvas = function(element, parentView) {
  this.parentView = parentView;

  // var wrapper = document.createElement('div'),
  var canvasDiv = document.createElement('canvas');
      canvasDiv.id = this.randomUID();

  canvasDiv.style.width = this.width
  canvasDiv.style.height = this.height;
  element.style.height = this.height;
  element.style.width = this.width;

  // wrapper.appendChild(canvasDiv);
  // element.appendChild(wrapper);
  // this.canvasWrapper = wrapper;
  element.appendChild(canvasDiv);
  this.canvasWrapper = element;
  
  this.canvas = new fabric.Canvas(canvasDiv.id);
  this.canvas.setWidth(this.model.getSetting('width'));
  this.canvas.setHeight(this.model.getSetting('height'));

  this.setupCanvasOptions(this.canvas);
  this.drawModelOnCanvas(this.model);
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.drawModelOnCanvas = function(model) {
  var self = this;

  Oro.Graphics.FabricJS.Factory.create(
    model, 
    this.canvas, 
    this.canvasWrapper,
    function(graphic){
      graphic.linkData = {modelUID: model.getUID(), view: self};

      self._graphics = self._graphics || {};  
      self._graphics[model.getUID()] = graphic;
      
      var modelChildren = model.children;
      if (modelChildren) {
        modelChildren.forEach(function(child){
          self.drawModelOnCanvas(child);  
        });
      }
   });
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.redraw = function() {
  this.canvas.renderAll();
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.randomUID = function(){
  function rId() {
    return Math.random().toString(36).substring(2, 15);
  };
  var id = rId();
  while (document.getElementById(id))
    id = rId();
  return id;
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.setupCanvasOptions = function(canvas){
  var self = this;

  canvas.on('mouse:move', function(event) {
    if (canvas.mouseDragged) {
      var obj = canvas.mouseDragged.target;
      if (!obj) {
        return;
      }

      var dragMode = canvas.mouseDragged && canvas.mouseDragged.mode,
          e = event.e,
          action = false;      

      switch(dragMode) {
        case self.MOUSE_MOVE_MODE_MOVE:
           self.handleMove(obj, e.movementX, e.movementY);
           action = true;
          break;
        case self.MOUSE_MOVE_MODE_RESIZE:
           self.handleResize(obj, e.movementX, e.movementY);
           action = true;
         break;
      }
      
      if (action) {
        obj.setCoords();
        canvas.renderAll();
      }
    }
  });

  canvas.on('mouse:down', function(event) {
    var obj = event.target;
    if (!obj)
      return;

    canvas.mouseDragged = canvas.mouseDragged || {};
    canvas.mouseDragged.target = obj; 

    self.changeSelectedModel(obj.linkData.modelUID);

    // var draggedArea = self.checkDownArea(obj, event.e.layerX, event.e.layerY);

    var mode, 
        subMode; 

    mode = self.MOUSE_MOVE_MODE_MOVE;        
/*
    if (!draggedArea) {
      mode = self.MOUSE_MOVE_MODE_MOVE;
    } else {
      mode = self.MOUSE_MOVE_MODE_RESIZE;
      switch(draggedArea) {
        case self.RESIZE_MODE_TOP:
        case self.RESIZE_MODE_BOTTOM:
        case self.RESIZE_MODE_LEFT:
        case self.RESIZE_MODE_RIGHT:
        case self.RESIZE_MODE_LEFT_BOTTOM:
        case self.RESIZE_MODE_RIGHT_BOTTOM:
        case self.RESIZE_MODE_LEFT_TOP:
        case self.RESIZE_MODE_RIGHT_TOP:
          subMode = draggedArea;
        break;
        default: 
          throw Error('Undefined clickedArea: ' + clickedArea);
      }
    }
*/
    canvas.mouseDragged.mode = mode;
    canvas.mouseDragged.subMode = subMode;

    obj.setStroke('rgb(0,154,154)');
    obj.setStrokeWidth(3);
  });

  canvas.on('mouse:up', function(e){
    canvas.mouseDragged = canvas.mouseDragged || {};
    canvas.mouseDragged.mode = null;
    canvas.mouseDragged.subMode = null;
    canvas.mouseDragged.target = null;

    var obj = e.target;
    if (!obj)
      return;

    obj.setStrokeWidth(0);
  });
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.changeSelectedModel = function(modelUID){
  this.parentView.changeSelectedModel(modelUID);
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.getGraphics = function() {
  return this._graphics;
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.addChangesListener = function(listener) {
  this._changesListeners = this._changesListeners || [];
  this._changesListeners.push(listener);
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.getChangesListeners = function() {
  return this._changesListeners;
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.checkDownArea = function(obj, x, y) {
  var self = this;

  function bordersMatches(obj, x, y) {
    var sidesMarkers = {};        

    if (obj) {
      var delta = 2;
      sidesMarkers['leftBorder'] = x > obj.getLeft() && x - obj.getLeft() <= delta;

      sidesMarkers['rightBorder'] = x > obj.getLeft() && 
                                    x <= obj.getLeft() + obj.getWidth() &&
                                    x >= obj.getLeft() + obj.getWidth() - delta;

      sidesMarkers['topBorder'] = y > obj.getTop() && y - obj.getTop() <= delta;

      sidesMarkers['bottomBorder'] = y > obj.getTop() &&
                                     y <= obj.getTop() + obj.getHeight() &&
                                     y >= obj.getTop() + obj.getHeight() - delta;
    }

    return sidesMarkers;
  };

  function resizeType(sidesMarkers) {
    var codes = {
          'leftBorder': 1,
          'rightBorder': 2,
          'topBorder': 4,
          'bottomBorder': 8
        },
        cursors = {};

    cursors[codes['leftBorder']] = self.RESIZE_MODE_LEFT;
    cursors[codes['rightBorder']] = self.RESIZE_MODE_RIGHT;
    cursors[codes['topBorder']] = self.RESIZE_MODE_TOP;
    cursors[codes['bottomBorder']] = self.RESIZE_MODE_BOTTOM;
    cursors[codes['leftBorder'] | codes['topBorder']] = self.RESIZE_MODE_LEFT_TOP;
    cursors[codes['leftBorder'] | codes['bottomBorder']] = self.RESIZE_MODE_LEFT_BOTTOM;
    cursors[codes['rightBorder'] | codes['topBorder']] = self.RESIZE_MODE_RIGHT_TOP;
    cursors[codes['rightBorder'] | codes['bottomBorder']] = self.RESIZE_MODE_RIGHT_BOTTOM;

    var index = sidesMarkers.reduce(function(prev, marker){ return prev | codes[marker] }, 0);
    return cursors[index];
  };

  var sidesMarkers = bordersMatches(obj, x, y),
      selected = Object.keys(sidesMarkers)
                       .filter(function(key){ return sidesMarkers[key]; });
  return resizeType(selected);
};

/*
  Movements
*/
Oro.Graphics.TemplatesEditor.FabricJSView.prototype.MOUSE_MOVE_MODE_MOVE = 1;
Oro.Graphics.TemplatesEditor.FabricJSView.prototype.MOUSE_MOVE_MODE_RESIZE = 2;

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.handleMove = function(obj, dx, dy) {
  var newLeft = obj.getLeft() + dx,
      newTop = obj.getTop() + dy,
      toChange = {
        left: function(obj) { obj.setLeft(newLeft); },
        top: function(obj) { obj.setTop(newTop); }
      };
  
  var updatesResults = this.getChangesListeners()
      .reduce(function(acc, listener){
        var updateResult = listener([
          {
            modelUID: obj.linkData.modelUID,
            setting: 'left',
            value: newLeft
          },
          {
            modelUID: obj.linkData.modelUID,
            setting: 'top',
            value: newTop
          }
        ]);

        for (setting in updateResult)
          if (updateResult[setting])
            acc[setting] = true
        return acc;
      },
      {});

  Object.keys(updatesResults)
        .forEach(function(setting){
          toChange[setting](obj);
        });
};

/*
  Resize
*/
Oro.Graphics.TemplatesEditor.FabricJSView.prototype.RESIZE_MODE_LEFT = 'resize-left';
Oro.Graphics.TemplatesEditor.FabricJSView.prototype.RESIZE_MODE_RIGHT = 'resize-right';
Oro.Graphics.TemplatesEditor.FabricJSView.prototype.RESIZE_MODE_TOP = 'resize-top';
Oro.Graphics.TemplatesEditor.FabricJSView.prototype.RESIZE_MODE_BOTTOM = 'resize-bottom';

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.RESIZE_MODE_LEFT_TOP = 'resize-left-top';
Oro.Graphics.TemplatesEditor.FabricJSView.prototype.RESIZE_MODE_RIGHT_TOP = 'resize-right-top';
Oro.Graphics.TemplatesEditor.FabricJSView.prototype.RESIZE_MODE_RIGHT_BOTTOM = 'resize-right-bottom';
Oro.Graphics.TemplatesEditor.FabricJSView.prototype.RESIZE_MODE_LEFT_BOTTOM = 'resize-left-bottom';

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.resizeLeft = function(object, dx, _dy) {
  console.log('resizeLeft');
  object.setLeft(object.getLeft() - dx);  
  object.setWidth(object.getWidth() + dx);
  // return {left: ...}
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.resizeRight = function(object, dx, _dy) {
  console.log('resizeRight');  
  object.setWidth(object.getWidth() + dx - 3);
  // console.log(object.getWidth());
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.resizeTop = function(object, _dx, dy) {
  console.log('resizeTop');  
  object.setHeight(object.getHeight() + dy);
  object.setTop(object.getTop() + dy);
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.resizeBottom = function(object, _dx, dy) {
  console.log('resizeBottom');  
  object.setHeight(object.getHeight() + dy);
};

Oro.Graphics.TemplatesEditor.FabricJSView.prototype.handleResize = function(object, dx, dy) {
    var self = this,
        canvas = this.canvas,
        mode = canvas.mouseDragged && canvas.mouseDragged.mode;
        subMode = canvas.mouseDragged && canvas.mouseDragged.subMode;

    if (mode !== this.MOUSE_MOVE_MODE_RESIZE || !subMode) {
      return;
    }

    var ops = [];
    switch(subMode) {
      case this.RESIZE_MODE_TOP:
          ops.push('resizeTop');
        break;
      case this.RESIZE_MODE_BOTTOM:
          ops.push('resizeBottom');
        break;
      case this.RESIZE_MODE_LEFT:
          ops.push('resizeLeft');
        break;
      case this.RESIZE_MODE_RIGHT:
          ops.push('resizeRight');
        break;
      case this.RESIZE_MODE_LEFT_BOTTOM:
          ops.push('resizeLeft');
          ops.push('resizeBottom');
        break;
      case this.RESIZE_MODE_RIGHT_BOTTOM:
          ops.push('resizeRight');
          ops.push('resizeBottom');
        break;
      case this.RESIZE_MODE_LEFT_TOP:
          ops.push('resizeLeft');
          ops.push('resizeTop');
        break;
      case this.RESIZE_MODE_RIGHT_TOP:
          ops.push('resizeRight');
          ops.push('resizeTop');
        break;
      default: 
        throw Error('Undefined clickedArea: ' + clickedArea);
    }

    ops.forEach(function(op) { 
      self[op](object, dx, dy); 
      //TODO: notify
    });
};