
/**
 * Module dependencies.
 */

var express = require('express')
,app = module.exports = express.createServer()
,mongo = require('mongodb')
,monk = require('monk')
,db = monk('localhost:27017/test')
,street = require('./street')
,async = require("async")
// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res){
    res.render('simpleQuery',{"title": "Listing", "list":""} )
});

app.post('/simpleQuery', function(req, res){

    var area= req.body.area_select;
    var price_from = req.body.price_from;
    var price_to = req.body.price_to;
    var beds = req.body.beds;
    var baths = req.body.baths;

    async.series([
            function(callback){
                console.log("1")
                street.extract("http://streeteasy.com/for-rent/Noho/price:"+price_from+"-"+price_to+"%7Cbeds:"+beds+"%7Cbaths"+baths, function(){
                    callback(null)
                });
                console.log(1.5);

            },
            function(callback){
                console.log("2")
                callback(null,null)
            }
        ],
        function(err, results){
            console.log("3")
            res.redirect('/simpleList');
            console.log("3.5")
        });

});

app.get('/simpleList', function(req,res){
    console.log("looking for data");
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        //console.log(e);
        //console.log(docs);
        res.render('list', {
            "list" : docs,
            "title": "Address List",
            "count": docs.length

        });
    });

})



app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
