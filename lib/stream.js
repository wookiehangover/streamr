var knox = require('knox')
  , stream = require('stream')
  , util = require('util')
  , utils = knox.utils;

module.exports = function(knox_object, headers, callbacks) {

  var client = knox.createClient(knox_object)
    , headers = headers || {}
    , callbacks = callbacks || {};

  function KnoxStream(file, path){
    headers = utils.merge(
          {
              'Content-Length': file.total
            , 'Content-Type': file.type
          }
        , headers
      );
    stream.Stream.call(this);
    this.writable = true;
    this.readable = true;
    this.paused = false;

    client.putStream(this, path, headers, (typeof callbacks.putStream !== 'undefined' ? callbacks.putStream : function() {}));
  }

  util.inherits( KnoxStream, stream.Stream );

  KnoxStream.prototype.write = function(data, cb){
    if(callbacks.write) {
      callbacks.write(data);
    }

    this.emit('data', data);
    if(!this.paused) {
      cb();
    }
  };

  KnoxStream.prototype.resume = function(cb){
    if(callbacks.resume) {
      callbacks.resume(cb);
    }

    this.paused = false;
    this.emit('drain');
  };

  KnoxStream.prototype.pause = function(cb){
    if(callbacks.pause) {
      callbacks.pause(cb);
    }

    this.paused = true;
  };

  KnoxStream.prototype.end = function(cb){
    if(callbacks.end) {
      callbacks.end(cb);
    }

    this.emit('end');
    cb();
  };

  return KnoxStream;

};