var port = process.env.PORT || 8081
  , fs   = require('fs')
  , http = require('http')
  , util = require('util')
  , path = require('path')
  , knoxStream = require('./../')
  , ecstatic = require('ecstatic')
  , formidable = require('formidable')
  , ec = ecstatic( __dirname );

var server = http.createServer(function( req, res ){

  if( req.url === '/upload' ){
    
    var form = new formidable.IncomingForm();
    
    form.onPart = knoxStream(
        {
          key: process.env.AWS_KEY,
          secret: process.env.AWS_SECRET,
          bucket: process.env.BUCKET_NAME
        }
      , '' // Folder, for example: '/my_img_folder'
      , {
          // Headers sent along to AWS, for example:
          // 'x-amz-acl': 'private'
        }
      , {
          // Available callbacks:
          // putStream: function( err, res ) {}
          // write: function( err, res ) {}
          // pause: function( cb ) {}
          // resume: function( cb ) {}
          // end: function( cb ) {}
        }
    );

    form.on('progress', function() {
      console.log('Formidable Received ', Math.floor(this.bytesReceived/this.bytesExpected*100));
    });
    form.parse( req, function( err, fields, files){
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }

  if( req.url === '/' ){
    fs.createReadStream(path.join(__dirname, 'index.html')).pipe( res );

  } else {
    ec( req, res );
  }

});

server.listen(port);
console.log('server listening at port ', port);