String.prototype.camelize = function() {
  return this.replace(/(\w{1})/, function(match, chr) { return chr.toUpperCase(); });
};
