var http = require("http")
    ,async = require("async")
    ,mongo = require('mongodb')
    ,monk = require('monk')
    ,db = monk('localhost:27017/test')
    ,cheerio = require("cheerio");

// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
    console.log(url);
    http.get(url, function(res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on("end", function() {
            callback(data);
        });
    }).on("error", function() {
            callback(null);
        });
}


exports.download=download;