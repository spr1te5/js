var Oro = typeof(Oro) === 'undefined' ? {} : Oro;
Oro.Helpers = typeof(Oro.Helpers) === 'undefined' ? {} : Oro.Helpers;

Oro.Helpers.extend = function(parentClass, props) {
  var f = new Function(),
      o = Object.create(parentClass.prototype, {});
  for (var p in props)
    Object.defineProperty(o, p, {value: props[p], configurable: true, writable: true, enumerable: true});
  f.prototype = o;
  return f;
};
