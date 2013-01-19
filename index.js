// Extend an object with mixin functionality

// ### Arguments
// * `destination` - Object where new functionality will be added. The mixins assume that `destination` will have a mongoose model available at `destination.model` and a schema at `destination.schema`
// * `source` - String name of the mixin package to load via `require('./'+source)`. If `source` is an object, it will be treated as the pre-loaded object with functionality to copy.

exports.extend = function(destination, source) {
	if(typeof source === 'string') {
		source = require('./'+source);
	}
	for(var prop in source) {
		destination[prop] = source[prop];
	}
	return destination;
};

// Partially apply a function (implementation is from Functional Javascript, http://osteele.com/sources/javascript/functional/)

// ### Arguments
// * `fn` - Function to be be partially applied
// * `args` - Arguments to be applied. Arguments that are undefined will be left to be filled in by the new function

exports.partial = function(fn, args) {
    args = Array.prototype.slice.call(arguments, 1);
    return function(){
      var arg = 0;
      for ( var i = 0; i < args.length && arg < arguments.length; i++ )
        if ( args[i] === undefined )
          args[i] = arguments[arg++];
      return fn.apply(this, args);
    };
};