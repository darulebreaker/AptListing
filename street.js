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



function extract (url) {
    download(url, function(data, callback) {

        if (data) {

            var $ = cheerio.load(data);


            //$("div.criteria_count").each(function(i, e){
            //    console.log($(e.children));

            //});
            //$("div.details").each(function(i, e){
            //    console.log($(e.children));
            //});



            $('.criteria_count').each(function(){
                var numResults = $(this).text();
                console.log(numResults);
                if(parseInt(numResults) >0){


                    async.series({

                            address: function(callback){
                                var address = new Array();
                                var count=0;
                                $('.details_title').each(function(){

                                    //console.log($(this).find('h5 a').text().trim());
                                    address[count]=$(this).find('h5 a').text().trim();
                                    count++;
                                });
                                callback(null, address)
                            },
                            details: function(callback){
                                var details;
                                var prices = new Array();
                                var firstDetails = new Array();
                                var sndDetails = new Array();
                                var last =new Array();

                                var count=0;
                                $('.details_info').each(function(){
                                    // console.log("******************************");
                                    // console.log($(this).text().trim());
                                    //console.log($(this).find('.price').text().trim());
                                    //console.log($(this).find('.first_detail_cell').text().trim());
                                    //console.log($(this).find('.detail_cell').text().trim());
                                    //console.log($(this).find('.last_detail_cell').text().trim());
                                    try{
                                        if( $(this).text().trim()!= undefined && $(this).text().trim()!='')
                                            details+=($(this).text().trim());

                                        if(  $(this).find('.price').text().trim()!='' ){
                                            prices.push( $(this).find('.price').text().trim());
                                        }
//                                    if ($(this).find('.first_detail_cell').text().trim()!=''){
//                                        firstDetails.push($(this).find('.first_detail_cell').text().trim());
//                                    }
//                                    if ($(this).find('.detail_cell').text().trim()!=''){
//                                        sndDetails.push($(this).find('.detail_cell').text().trim());
//                                    }
//                                    if ($(this).find('.last_detail_cell').text().trim()!=''){
//                                        last.push((this).find('.last_detail_cell').text().trim());
//                                    }
                                    }
                                    catch(err){
                                        console.log(err);
                                    }

                                    count++;
                                    console.log("1.2")
                                });
                                callback(null,
                                    {    'count': numResults,
                                        'price' :prices,
                                        'first': firstDetails,
                                        'second': sndDetails,
                                        'last':last,
                                        'all': details
                                    })

                            }
                        },
                        function(err, results){
                            //console.log(results)
                            console.log("1.3")
                            var separated = results.details.all.split('$');
                            var collection = db.get('usercollection');
                            collection.remove({});
                            for(var i=0; i<results.address.length; i++){
                                //console.log(results.address[i]);
                                //console.log(results.details.price[i]);
                                //console.log(separated[i+1]); //first one is undefined
                                //console.log("-------------------------------------")
                                collection.insert({
                                    "address": results.address[i] ,
                                    "detail": separated[i+1]

                                }, function (err, doc) {
                                    if (err) {
                                        // If it failed, return error
                                        console.log("database insertion fail")
                                    }
                                    else {

                                    }
                                });


                            }

                        });


                }

            })}
        else console.log("error");


    });

}




exports.extract=extract;
exports.download=download;