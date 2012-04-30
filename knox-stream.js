var knox = require('knox');

var client = knox.createClient({
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
  bucket: 'cloudy-test'
});

var stream = require('stream');
var util = require('util');

function WriteStream( path, file ){
  stream.Stream.call(this);
  this.writeable = true;

  client.putStream( this, file, function( err, res ){
    console.log(res.statusCode);
  });
}

util.inherits( WriteStream, stream.Stream );

WriteStream.prototype.write = function( data, cb ){
  this.emit('data', data);
  cb();
};

WriteStream.prototype.end = function(cb){
  this.emit('end');
  cb();
};

module.exports = WriteStream;
