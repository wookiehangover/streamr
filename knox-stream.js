var knox = require('knox');

var client = knox.createClient({
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
  bucket: process.env.BUCKET_NAME
});

var stream = require('stream');
var util = require('util');

function WriteStream( path, file ){
  stream.Stream.call(this);
  this.writable = true;

  client.putStream( this, file, function( err, res ){
    console.log('response status', res.statusCode);
    res.on('data', function(chunk) {
           console.log("response body chunk: " + chunk);
       });
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
