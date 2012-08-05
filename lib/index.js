var knoxStream = require('./stream')
  , File = require('formidable/lib/file')
  , path = require('path');

module.exports = function(knox_object, directory, headers, callbacks) {
  return function(part) {
    var self = this;

    if (part.filename === undefined) {
      self.handlePart(part);
      return;
    }

    this._flushing++;

    var file = new File({
      path: path.join(( directory || '' ), part.filename),
      name: part.filename,
      type: part.mime,
      total: this.headers['x-file-size']
    });

    this.emit('fileBegin', part.name, file);

    File.prototype.open = function(KnoxStream, file) {
      this._writeStream = new KnoxStream(file, file.path);
    };

    file.open(knoxStream(knox_object, headers, callbacks), file);

    file._writeStream.on('drain', function(buffer) {
        self.resume();
    });

    part.on('data', function(buffer) {
      self.pause();
      file.write(buffer, function() {
        self.resume();
      });
    });

    part.on('end', function() {
      file.end(function() {
        self._flushing--;
        self.emit('file', part.name, file);
        self._maybeEnd();
      });
    });
  };
};