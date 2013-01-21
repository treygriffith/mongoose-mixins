var start = require('./common.js'),
	assert = require('assert'),
	mongoose = start.mongoose,
	Schema = mongoose.Schema,
	mixins = require('../'),
	random = function() {
		return Math.random().toString(36).substring(2);
	};

exports.schema = new Schema({
	title: String,
	text: String
});

var Post = mongoose.model('basics_test', exports.schema);
var collection = 'basics_test_'+random();

describe('getAll', function() {

	it('retrieves all posts in a collection when no condition is passed', function(done) {
		var db = start(),
			PostB = db.model('basics_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'basics');

		var post1 = new PostB({
			title: 'BMy title',
			text: 'My text'
		});
		var post2 = new PostB({
			title: 'AMy title 2',
			text: 'My text'
		});

		post1.save(function(err, post) {
			assert.ifError(err);
			post2.save(function(err, post) {
				assert.ifError(err);
				model.getAll(function(err, posts) {

					assert.ifError(err);
					assert.ok(posts[0] instanceof mongoose.Document);
					assert.equal(posts[0].text, post1.text);
					PostB.count(function(err, count) {
						assert.ifError(err);
						assert.equal(count, posts.length);
						db.close();
						done();
					});
				});
			});
		});
	});

	it('retrieves only matching posts when a condition is passed', function(done) {
		var db = start(),
			PostB = db.model('basics_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'basics');

		var post1 = new PostB({
			title: 'BMy title',
			text: 'My text'
		});
		var post2 = new PostB({
			title: 'AMy title 2',
			text: 'My text'
		});

		post1.save(function(err, post) {
			assert.ifError(err);
			post2.save(function(err, post) {
				assert.ifError(err);
				model.getAll({title:post1.title}, function(err, posts) {
					assert.ifError(err);
					posts.forEach(function(post) {
						assert.ok(post instanceof mongoose.Document);
						assert.equal(post.title, post1.title);
					});
					db.close();
					done();
				});
			});
		});	
	});

	it('sorts when a sort condition is passed', function(done) {
		var db = start(),
			PostB = db.model('basics_test', collection),
			model = {
				model:PostB,
				schema:exports.schema
			};

		mixins.extend(model, 'basics');

		var post1 = new PostB({
			title: 'BMy title',
			text: 'My text'
		});
		var post2 = new PostB({
			title: 'AMy title 2',
			text: 'My text'
		});

		post1.save(function(err, post) {
			assert.ifError(err);
			post2.save(function(err, post) {
				assert.ifError(err);
				model.getAll('title', function(err, posts) {
					assert.ifError(err);

					var firstB = false;
					posts.forEach(function(post, i) {
						assert.ok(post instanceof mongoose.Document);
						if(post.title[0] === 'B') {
							firstB = true;
						}
						assert.ok(!(post.title[0] === 'A' && firstB));
					});

					db.close();
					done();
				});
			});
		});	
	});
});