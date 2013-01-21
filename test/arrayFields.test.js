var start = require('./common.js'),
	assert = require('assert'),
	mongoose = start.mongoose,
	Schema = mongoose.Schema,
	mixins = require('../'),
	utils = require('../utils'),
	random = utils.random;

exports.schema = new Schema({
	title: String,
	text: String,
	tags: [String]
});

var Post = mongoose.model('arrayFields_test', exports.schema);
var collection = 'arrayFields_test_'+random();

describe('getAllArrays', function() {

	it('returns a single de-duplicated array with all the values on it', function(done) {
		var db = start(),
			PostB = db.model('arrayFields_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'arrayFields');

		var post1 = new PostB({
			title: 'BMy title',
			text: 'My text',
			tags: ['green', 'yellow']
		});
		var post2 = new PostB({
			title: 'AMy title 2',
			text: 'My text',
			tags: ['yellow', 'red']
		});

		post1.save(function(err, post) {
			assert.ifError(err);
			post2.save(function(err, post) {
				assert.ifError(err);
				model.getAllArrays('tags', function(err, tags) {
					assert.ifError(err);

					assert.ok(Array.isArray(tags));

					var found = [];
					tags.forEach(function(tag) {
						assert.ok(!~found.indexOf(tag));
						found.push(tag);
					});
					db.close();
					done();
				});
			});
		});
	});
});

describe('getArray', function() {
	it('can use an object with an _id property to find the field', function(done) {
		var db = start(),
			PostB = db.model('arrayFields_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'arrayFields');

		var post1 = new PostB({
			title: 'BMy title',
			text: 'My text',
			tags: ['green', 'yellow']
		});

		post1.save(function(err, post) {
			assert.ifError(err);
			model.getArray(post1, 'tags', function(err, tags) {
				assert.ifError(err);
				assert.ok(Array.isArray(tags));
				assert.ok(utils.compare(tags, ['green', 'yellow']));
				db.close();
				done();
			});
		});	
	});
	it('returns the array on a document', function(done) {
		var db = start(),
			PostB = db.model('arrayFields_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'arrayFields');

		var post1 = new PostB({
			title: 'BMy title',
			text: 'My text',
			tags: ['green', 'yellow']
		});

		post1.save(function(err, post) {
			assert.ifError(err);
			model.getArray(post1._id, 'tags', function(err, tags) {
				assert.ifError(err);
				assert.ok(Array.isArray(tags));
				assert.ok(utils.compare(tags, ['green', 'yellow']));
				
				db.close();
				done();
			});
		});
	});
	it('returns an empty array when the property is undefined', function(done) {
		var db = start(),
			PostB = db.model('arrayFields_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'arrayFields');

		var post1 = new PostB({
			title: 'BMy title',
			text: 'My text'
		});

		post1.save(function(err, post) {
			assert.ifError(err);
			model.getArray(post1._id, 'tags', function(err, tags) {
				assert.ifError(err);
				assert.ok(Array.isArray(tags));
				assert.ok(utils.compare(tags, []));
				
				db.close();
				done();
			});
		});
	});
});

describe('addToArray', function() {
	it('adds elements onto arrays', function(done) {
		var db = start(),
			PostB = db.model('arrayFields_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'arrayFields');

		var tags = ['green', 'yellow'];

		var post1 = new PostB({
			title: 'AMy title',
			text: 'My text',
			tags: tags
		});

		post1.save(function(err, post) {
			assert.ifError(err);
			model.addToArray(post1._id, 'tags', 'blue', function(err, numAffected, raw) {
				assert.ifError(err);
				assert.equal(numAffected, 1);
				PostB.findOne({_id:post1._id}, function(err, post) {
					assert.ifError(err);
					post = post.toObject();
					assert.ok(utils.compare(post.tags, tags.concat('blue')));
					db.close();
					done();
				});
			});
		});	
	});
	it('can add to a document using an object with an _id property', function(done) {
		var db = start(),
			PostB = db.model('arrayFields_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'arrayFields');

		var tags = ['green', 'yellow'];

		var post2 = new PostB({
			title: 'BMy title',
			text: 'My text',
			tags: tags
		});

		post2.save(function(err, post) {
			assert.ifError(err);
			model.addToArray(post2, 'tags', 'blue', function(err, numAffected) {
				assert.ifError(err);
				PostB.findOne({_id:post2._id}, function(err, post) {
					assert.ifError(err);
					post = post.toObject();
					assert.ok(utils.compare(tags.concat('blue'), post.tags));
					db.close();
					done();
				});
			});
		});	
	});
	it('adds only new elements to an array', function(done) {
		var db = start(),
			PostB = db.model('arrayFields_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'arrayFields');

		var tags = ['green', 'yellow'];

		var post3 = new PostB({
			title: 'CMy title',
			text: 'My text',
			tags: tags
		});

		post3.save(function(err, post) {
			assert.ifError(err);
			model.addToArray(post3._id, 'tags', 'yellow', function(err, numAffected) {
				assert.ifError(err);
				PostB.findOne({_id:post3._id}, function(err, post) {
					assert.ifError(err);
					post = post.toObject();
					assert.ok(utils.compare(post.tags, tags));
					db.close();
					done();
				});
			});
		});
	});
	it('adds multiple items to an array', function(done) {
		var db = start(),
			PostB = db.model('arrayFields_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'arrayFields');

		var tags = ['green', 'orange', 'yellow'];

		var post4 = new PostB({
			title: 'DMy title',
			text: 'My text',
			tags: tags
		});

		post4.save(function(err, post) {
			assert.ifError(err);
			model.addToArray(post4._id, 'tags', ['yellow', 'blue', 'red'], function(err, numAffected) {
				assert.ifError(err);
				assert.equal(numAffected, 1);
				PostB.findOne({_id:post4._id}, function(err, post) {
					assert.ifError(err);
					post = post.toObject();	
					assert.ok(utils.compare(post.tags, tags.concat('blue', 'red')));
					db.close();
					done();
				});
			});
		});
	});
});