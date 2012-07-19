# streamr

This is an experiment to see how well node can handle streaming file
uploads directly to S3, without touching the file system on the server.
To do this, it uses modified versions of
[node-formidable](https://github.com/wookiehangover/node-formidable) to
handle the file parsing and
[knox](https://github.com/wookiehangover/knox) to push the files out to
S3.

Formidable has been changed to accept a custom WriteStream, instead of
the default fs.WriteStream. Knox's `client.putStream` method has been
updated to expect any type of stream, not just a file stream (and to use
stream.pipe instead of manual event bindings).

### Example

To run the example app you'll need to set your AWS creds (and bucket
name) as environment variables.

    $ export AWS_KEY=(your aws key) AWS_SECRET=(your secret) BUCKET_NAME=(bucket name)
    $ node server
    > server listening on port 3000

Once the demo is running, just drag a file into the window and it will
upload straight to your S3 bucket. Check the console for file info.

### Contributings

I'd love feedback, so please open a pull request or submit an issue!
