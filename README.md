Mixins for Mongoose Models
==========================
### Extend common functionality in an MVC environment

This module requires a certain paradigm in working with [Mongoose](http://www.mongoosejs.com) models. It works best in an MVC environment, although that is by no means a requirement.
It requires that you have a model, let's say `things`, which works with a MongoDB collection, also called `things`, via Mongoose. `things` should have a `model` property, such that `things.model` is a reference to the Mongoose model, and another property, `schema`, that is a reference to the Mongoose schema.

You can then extend your `things` model with [mixins](http://en.wikipedia.org/wiki/Mixin) to provide it with added functionality.

Installation
-------------

 using Git
``` bash
$ git clone git://github.com/treygriffith/mongoose-mixins.git node_modules/mongoose-mixins/
```

Usage
-----
Before we start extending functionality, we set up our `things` model in such a way that it can be extended
``` javascript
exports.schema = new Schema({
	name: String,
	color: String
});
exports.model = mongoose.model(exports.schema);
```

Now that we have an environment that will support our mongoose mixins, we can extend their functionality
``` javascript
var mixins = require('mongoose-mixins');
mixins.extend(exports, 'basics');
```

Now we have some functionality exposed on our `things` model! We can [partially apply](http://en.wikipedia.org/wiki/Partial_application) our methods to make them more specific to `things`.
``` javascript
exports.getColor = mixins.partial(exports.getField, _, 'color'); // `_` must be undefined for this to work as expected
```

If this is in an MVC environment where `things` is exposed as `models.Things`, we can use our new partially applied function like so:
``` javascript
models.Things.getColor(id_of_thing, function(err, color) {
	console.log(id_of_thing+" is "+color); // prints 507f1f77bcf86cd799439011 is green
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
