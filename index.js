// Extend an object with mixin functionality

// ### Arguments
// * `destination` - Object where new functionality will be added. The mixins assume that `destination` will have a mongoose model available at `destination.model` and a schema at `destination.schema`
// * `source` - String name of the mixin package to load via `require`. If `source` is an object, it will be treated as the pre-loaded object with functionality to copy.
// * `pkgDir` - Optional String path to the mixin packages. Defaults to './pkg';

exports.extend = function(destination, source, pkgDir) {
	pkgDir = pkgDir || './pkg';
	if(typeof source === 'string') {
		source = require(pkgDir+'/'+source);
	}
	for(var prop in source) {
		destination[prop] = source[prop];
	}
	return destination;
};

// Partially apply a function (implementation is inspired by Functional Javascript, http://osteele.com/sources/javascript/functional/)

// ### Arguments
// * `fn` - Function to be be partially applied
// * `args` - Arguments to be applied. Arguments that are undefined will be left to be filled in by the new function

exports.partial = function(fn, args) {
	args = Array.prototype.slice.call(arguments, 1);
	return function(){
		var _args = Array.prototype.slice.call(arguments);
		for(var i=0; i<_args.length;i++) {
			if(args[i] === undefined) {
				args[i] = _args[i];
			} else {
				_args.splice(i, 0, undefined);
			}
		}
		return fn.apply(this, args);
	};
};