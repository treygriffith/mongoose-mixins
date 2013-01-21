var mongoose = require('../node_modules/mongoose'),
    assert = require('assert');

module.exports = function (options) {
  options = options || {};
  var uri;

  if (options.uri) {
    uri = options.uri;
    delete options.uri;
  } else {
    uri = process.env.MONGOOSE_TEST_URI ||
          'mongodb://localhost/mongoose_test';
  }

  var noErrorListener = !! options.noErrorListener;
  delete options.noErrorListener;

  var conn = mongoose.createConnection(uri, options);

  if (noErrorListener) return conn;

  conn.on('error', function (err) {
    assert.ok(err);
  });

  return conn;
};

module.exports.mongoose = mongoose;