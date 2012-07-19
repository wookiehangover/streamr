var knox = require('knox');

var client = knox.createClient({
  key: process.env.AWS_KEY,
  secret: process.env.AWS_SECRET,
  bucket: process.env.BUCKET_NAME
});

var stream = require('stream');
var util = require('util');

function WriteStream( path, file ){
  var source = this;
  stream.Stream.call(this);
  this.writable = true;
  this.readable = true;
  this.paused = false;

  client.putStream( this, file, function( err, res ){
    console.log('response status', res.statusCode);
    res.on('data', function(chunk) {
           console.log("response body chunk: " + chunk);
       });
  });
}

util.inherits( WriteStream, stream.Stream );

WriteStream.prototype.write = function( data ){
//  console.log('WriteStream.write');
  this.emit('data', data);
  return !this.paused;
};

WriteStream.prototype.resume = function(cb){
//  console.log('WriteStream.resume');
  this.paused = false;
  this.emit('drain');
};

WriteStream.prototype.pause = function(cb){
//  console.log('WriteStream.pause');
  this.paused = true;
};

WriteStream.prototype.end = function(cb){
  this.emit('end');
  return cb();
};

module.exports = WriteStream;
