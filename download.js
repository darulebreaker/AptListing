/**
 * Created by darulebreaker on 6/20/14.
 */
var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

download('http://streeteasy.com/nyc/image/0/77823300.jpg', 'street.png', function(){
    console.log('done');
});