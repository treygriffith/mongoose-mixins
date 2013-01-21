Mixins for Mongoose Models
==========================
### Extend common functionality in an MVC environment

If your Node.js app is in an MVC format, where you have your models exposed as properties on a global `models` variable (e.g. `models.Posts`, `models.Authors`), you probably find yourself re-writing similar methods for every new model you add (e.g. `models.Posts.createPost`, `models.Authors.createAuthor`). With [mixins](http://en.wikipedia.org/wiki/Mixin), you can add functionality to your models while keeping your code DRY.

Installation
-------------

 using Git
``` bash
$ git clone git://github.com/treygriffith/mongoose-mixins.git node_modules/mongoose-mixins/
```

Usage
-----
Before we start extending functionality, we set up our `authors` model in such a way that it can be extended
``` javascript
models = {};
models.Authors = {};

models.Authors.schema = new Schema({
	name: String,
	age: Number,
	interests: [String]
});
models.Authors.model = mongoose.model(models.Authors.schema);
```

Now that we have an environment that will support our mongoose mixins, we can extend their functionality
``` javascript
var mixins = require('mongoose-mixins');
mixins.extend(models.Authors, 'arrayFields');
```

Now we have some functionality exposed on our `authors` model! Let's try it out:
``` javascript
models.Authors.printAuthors = function() {
	this.getAll(function(err, authors) {
		if(err) {
			console.log(err);
			return;
		}
		console.log(authors);
	})	
};
```

We can [partially apply](http://en.wikipedia.org/wiki/Partial_application) our methods to make them more specific to `authors`.
``` javascript
var _;
models.Authors.getInterests = mixins.partial(models.Authors.getArray, _, 'interests'); // `_` must be undefined for this to work as expected
```

We can use our new partially applied function like so:
``` javascript
models.Authors.getInterests(author_id, function(err, interests) {
	console.log(author_id+" is interested in "+interests.join(', ')+"."); // prints 507f1f77bcf86cd799439011 is interested in books, writing.
});
```

Mixins
------
Mixins are separated into packages, that can be referenced by their string name. As of now, there are only two packages of mixins available in the core of `mongoose-mixins`:

1. `'basics'` :
	* `getAll` - retrieve all the documents in a collection
	* `getField` - retrieve the contents of one field on one document in a collection
2. `'arrayFields'` :
	* `getAllArrays` - retrieve and concatenate all the values in array fields on all the documents (de-duplicates)
	* `getArray` - retrieve an array on a document
	* `addToArray` - performs an addToSet operation, adding element or group of elements to an array field

You can easily add your own mixins by requiring them from the directory in which they reside:
``` javascript
mixins.extend(exports, require('/my_own_mixins/mixin'));
```

Notes
-----
This is a new concept that I've found to be useful in my workflow to keep my code DRY, but it will probably change significantly as I become more accustomed to programming in this paradigm. To that end, pull requests are welcome to improve functionality, especially the form of new default mixin packages.
