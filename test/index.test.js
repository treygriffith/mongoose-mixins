var assert = require('assert');

var mixins = require('../');

describe('extend', function() {
	var obj = {};
	it('should add functions to obj with a string package name', function() {
		mixins.extend(obj, 'basics');
		assert.equal(typeof obj.getAll, 'function');	
	});
	it('should add functions to obj with an object literal of functions', function() {
		mixins.extend(obj, {myFn: function(){}});
		assert.equal(typeof obj.myFn, 'function');
	});
	it('should add mixins from a different directory', function(done) {
		mixins.extend(obj, require('./pkg/basics.js'));
		assert.equal(typeof obj.testFn, 'function');
		done();
	});
});

describe('partial', function() {
	var echo = function() {
		return Array.prototype.join.call(arguments, '');
	};
	it('should replace the first argument', function() {
		var error = mixins.partial(echo, 'Error: ');
		assert.equal(error('this is an error'), 'Error: this is an error');
	});
	it('should allow for the first argument to be undefined', function() {
		var _;
		var timestamp = mixins.partial(echo, _, ' at 12:00pm');
		assert.equal(timestamp('We had an error'), 'We had an error at 12:00pm');
	});
});