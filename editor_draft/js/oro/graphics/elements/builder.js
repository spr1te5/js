var Oro = Oro || {};
Oro.Graphics = Oro.Graphics || {};
Oro.Graphics.Elements = Oro.Graphics.Elements || {};
Oro.Graphics.Elements.Builder = Oro.Graphics.Elements.Builder || {};

Oro.Graphics.Elements.Builder.buildFromDescription = function(description) {
  var obj;
  try{
    obj = eval('new '+description.type+'()');
  } catch (e) {
    if (e.name === 'ReferenceError'){
      obj = new Oro.Graphics.Elements.Element();
    }
  }
  obj.fillFromOption(description);
  return obj;
};
