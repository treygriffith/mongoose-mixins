// Basic mixins for mongoose models

// Retrieve all the documents in a collection

// ### Arguments
// * `condition` - Optional Object of Mongoose#find conditions
// * `sort` - Optional String of Mongoose#sort arguments
// * `cb` - Function to be evaluated with the results of the query

exports.getAll = function(condition, sort, cb) {
	switch(arguments.length) {
		case 1:
			cb = condition;
			condition = {};
			sort = '';
			break;
		case 2:
			cb = sort;
			if(typeof condition === 'object') {
				sort = '';
			} else {
				sort = condition;
				condition = {};
			}
			break;
	}
  this.model.find(condition)
    .sort(sort)
    .exec(cb);
};

// Retrieve a field by the id of its document

// ### Arguments
// * `id` - BSON id of the document
// * `field` - String field name
// * `cb` - Function to be evaluated with results

// ### Calls back
// * `err` - Error
// * `ret` - Contents located on `field` for the document

exports.getField = function(id, field, cb) {
	if(!id) {
		cb(null, []);
	}
	if(id._id) {
		id = id._id;
	}
	this.model.findById(id, function(err, doc) {
		if(err || !doc) {
			cb(err || new Error("No such record."));
			return;
		}
		cb(null, doc[field]);
	});
};