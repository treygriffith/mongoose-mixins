// Allow richer interactions with Array fields with the arrayFields mixins

var mixins = require('../'),
	utils = require('../utils'),
	extend = mixins.extend;

extend(exports, 'basics');

// Concatenate all of the values in arrays on documents and combine them into one array, with de-duplication

// ### Arguments
// * `condition` - Optional Object of conditions for Mongoose#find
// * `field` - String name of array field
// * `cb` - Function to be evaluated with the results of the operations

// ### Calls back
// * `err` - Error
// * `_docs` - Array of de-duplicated values from all of the documents' `field` field

exports.getAllArrays = function(condition, field, cb) {
	if(!cb) {
		cb = field;
		field = condition;
		condition = {};
	}
	this.model.find(condition, field)
		.exec(function(err, docs) {
			if(err || !docs) {
				cb(err || new Error("No records found."));
				return;
			}
			var els = [];
			docs.forEach(function(doc) {
				utils.addEachToSet(els, doc[field] || []);
			});
			cb(null, els);
		});
};

// Retrieve an array field by the id of its document

// ### Arguments
// * `id` - BSON id of the document
// * `field` - String field name of the array
// * `cb` - Function to be evaluated with results

// ### Calls back
// * `err` - Error
// * `arr` - Array located on `field` for the document, or an empty array if undefined

exports.getArray = function(id, field, cb) {
	this.getField(id, field, function(err, els) {
		if(err) {
			cb(err);
			return;
		}
		cb(null, els || []);
	});
};

// Add an element or an array of elements to a field with de-duplication
// NOTE: this will not work with fields that are arrays of arrays, as it assumes that any array that gets passed in is intended to be concatenated, not added as an element

// ### Arguments
// * `id` - BSON id of the document to add the array to
// * `field` - String field name for the array
// * `add` - Mixed - Array of elements to be added OR element to be added
// * `cb` - Function to be evaluated with results

// ### Calls back
// * `err` - Error
// * `numAffected` - Number count of documents updated
// * `raw` - Full mongo response

exports.addToArray = function(id, field, add, cb) {
	if(!id) {
		cb(new Error("No record provided."));
		return;
	}
	if(id._id) {
		id = id._id;
	}
	if(!Array.isArray(add)) {
		add = [add];
	}

	var query = {};
	query[field] = {$each:add};

	this.model.update({_id:id}, {$addToSet:query}, cb);
};