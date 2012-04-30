var
  fs   = require('fs'),
  http = require('http'),
  util = require('util'),
  knoxStream = require('./knox-stream'),
  ecstatic = require('ecstatic'),
  formidable = require('formidable');

var ec = ecstatic( __dirname );

var server = http.createServer(function( req, res ){

  if( req.url === '/upload' ){

    var form = new formidable.IncomingForm();
    form.WriteStream = knoxStream;
    form.uploadDir = __dirname + '/tmp';

    form.parse( req, function( err, fields, files){
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }

  if( req.url === '/' ){
    fs.createReadStream('./index.html').pipe( res );

  } else {
    ec( req, res );
  }

});

server.listen(3000);
console.log('server listening at port 3000');
